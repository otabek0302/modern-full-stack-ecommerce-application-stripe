import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await serverClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email }
        );

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user in Sanity
        const userDoc = {
            _type: 'user',
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        const userId = await serverClient.create(userDoc);

        // Fetch the created user (without password)
        const newUser = await serverClient.fetch(
            `*[_id == $userId]{
               _id,
               _type,
               name,
               email,
               createdAt,
               updatedAt
            }[0]`, { userId });

        // Set HTTP-only cookie for session
        const response = NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });

        // Set secure session cookie
        response.cookies.set("session", userId._id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
