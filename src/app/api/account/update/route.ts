import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import { UserType } from "@/interfaces/index";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract and validate form data
        const userId = formData.get("userId") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const street = formData.get("street") as string;
        const city = formData.get("city") as string;
        const state = formData.get("state") as string;
        const zipCode = formData.get("zipCode") as string;
        const country = formData.get("country") as string;
        const avatarFile = formData.get("avatar") as File | null;

        // Enhanced validation
        if (!userId || userId.trim() === "") {
            return NextResponse.json({
                error: "User ID is required"
            }, { status: 400 });
        }

        if (!name || name.trim() === "") {
            return NextResponse.json({
                error: "Name is required"
            }, { status: 400 });
        }

        if (!email || email.trim() === "") {
            return NextResponse.json({
                error: "Email is required"
            }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                error: "Invalid email format"
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

        // Check if email is already taken by another user
        const normalizedEmail = email.toLowerCase().trim();
        if (normalizedEmail !== existingUser.email?.toLowerCase()) {
            const emailExists = await serverClient.fetch(
                `*[_type == "user" && email == $email && _id != $userId][0]`,
                { email: normalizedEmail, userId }
            );

            if (emailExists) {
                return NextResponse.json({
                    error: "Email is already taken by another user"
                }, { status: 400 });
            }
        }

        // Prepare update data with proper sanitization
        const updateData: Partial<UserType> = {
            name: name.trim(),
            email: normalizedEmail,
            phone: phone?.trim() || "",
            address: {
                street: street?.trim() || "",
                city: city?.trim() || "",
                state: state?.trim() || "",
                zipCode: zipCode?.trim() || "",
                country: country?.trim() || "",
            },
            updatedAt: new Date().toISOString(),
        };

        // Handle avatar upload if provided
        if (avatarFile && avatarFile.size > 0) {
            // File size validation (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (avatarFile.size > maxSize) {
                return NextResponse.json({
                    error: "Avatar file size must be less than 5MB"
                }, { status: 400 });
            }

            // File type validation
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(avatarFile.type)) {
                return NextResponse.json({
                    error: "Avatar must be a valid image file (JPEG, PNG, or WebP)"
                }, { status: 400 });
            }

            try {
                // Convert file to buffer
                const bytes = await avatarFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Upload to Sanity
                const asset = await serverClient.assets.upload('image', buffer, {
                    filename: `avatar_${userId}_${Date.now()}_${avatarFile.name}`,
                    contentType: avatarFile.type,
                });

                // Add avatar reference to update data
                updateData.avatar = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id,
                    },
                };
            } catch (uploadError) {
                console.error("Avatar upload error:", uploadError);
                return NextResponse.json({
                    error: "Failed to upload avatar. Please try again."
                }, { status: 500 });
            }
        }

        // Update user in Sanity - try direct update first
        try {
            await serverClient
                .patch(userId)
                .set(updateData)
                .commit();

        } catch (updateError) {
            console.error("Direct update failed, trying draft approach:", updateError);
            
            // If direct update fails, try creating a new document
            try {
                const newUserData = {
                    ...existingUser,
                    ...updateData,
                    _id: userId,
                    _type: 'user'
                };
                
                // Delete the old document and create new one
                await serverClient.delete(userId);
                await serverClient.create(newUserData);
                
            } catch (fallbackError) {
                console.error("Fallback update also failed:", fallbackError);
                return NextResponse.json({
                    error: "Failed to update user profile. Please try again."
                }, { status: 500 });
            }
        }

        // Fetch the complete updated user (without password)
        const userWithoutPassword = await serverClient.fetch(
            `*[_type == "user" && _id == $userId]{
                _id,
                name,
                email,
                phone,
                avatar,
                address,
                wishlist,
                cart,
                orders,
                createdAt,
                updatedAt
            }[0]`,
            { userId }
        );

        if (!userWithoutPassword) {
            return NextResponse.json({
                error: "Failed to retrieve updated user data"
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userWithoutPassword,
        }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({
            error: "Internal server error",
            message: "Failed to update profile. Please try again later."
        }, { status: 500 });
    }
}
