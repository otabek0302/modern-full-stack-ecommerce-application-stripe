import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

        // Clear session cookie
        response.cookies.delete("session");

        return response;

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
