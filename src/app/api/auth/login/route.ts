import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find user by email
        const user = await serverClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email }
        );

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Set HTTP-only cookie for session
        const response = NextResponse.json({ message: "Login successful", user: userWithoutPassword }, { status: 200 });

        // Set secure session cookie
        response.cookies.set("session", user._id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
