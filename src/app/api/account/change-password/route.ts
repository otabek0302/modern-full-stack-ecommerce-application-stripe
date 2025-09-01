import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { userId, current, next } = await request.json();

        // Enhanced validation
        if (!userId || userId.trim() === "") {
            return NextResponse.json({
                error: "User ID is required"
            }, { status: 400 });
        }

        if (!current || current.trim() === "") {
            return NextResponse.json({
                error: "Current password is required"
            }, { status: 400 });
        }

        if (!next || next.trim() === "") {
            return NextResponse.json({
                error: "New password is required"
            }, { status: 400 });
        }

        // Password strength validation
        if (next.length < 6) {
            return NextResponse.json({
                error: "New password must be at least 6 characters long"
            }, { status: 400 });
        }

        if (next.length > 128) {
            return NextResponse.json({
                error: "New password must be less than 128 characters"
            }, { status: 400 });
        }

        // Prevent using the same password
        if (current === next) {
            return NextResponse.json({
                error: "New password must be different from current password"
            }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await serverClient.fetch(
            `*[_type == "user" && _id == $userId][0]`,
            { userId }
        );

        if (!existingUser) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(current, existingUser.password);

        if (!isCurrentPasswordValid) {
            return NextResponse.json({
                error: "Current password is incorrect"
            }, { status: 401 });
        }

        // Hash new password with higher salt rounds for better security
        const hashedNewPassword = await bcrypt.hash(next, 12);

        // Update password in Sanity - try direct update first
        try {
            await serverClient
                .patch(userId)
                .set({
                    password: hashedNewPassword,
                    updatedAt: new Date().toISOString(),
                })
                .commit();

        } catch (updateError) {
            console.error("Direct update failed, trying fallback approach:", updateError);

            // If direct update fails, try creating a new document
            try {
                const newUserData = {
                    ...existingUser,
                    password: hashedNewPassword,
                    updatedAt: new Date().toISOString(),
                    _id: userId,
                    _type: 'user'
                };

                // Delete the old document and create new one
                await serverClient.delete(userId);
                await serverClient.create(newUserData);

            } catch (fallbackError) {
                console.error("Fallback update also failed:", fallbackError);
                return NextResponse.json({
                    error: "Failed to update password. Please try again."
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            message: "Password changed successfully",
        }, { status: 200 });

    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json({
            error: "Internal server error",
            message: "Failed to change password. Please try again later."
        }, { status: 500 });
    }
}
