import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";

export async function GET(request: NextRequest) {
    try {
        // Get session cookie
        const sessionCookie = request.cookies.get("session");

        if (!sessionCookie?.value) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // Fetch user from Sanity using the session ID
        const user = await serverClient.fetch(
            `*[_type == "user" && _id == $userId]{
             _id,
             _type,
             name,
             email,
             phone,
             address,
             wishlist,
             cart,
             orders,
             avatar,
             createdAt,
             updatedAt,
            }[0]`, { userId: sessionCookie.value });

        if (!user) {
            // Clear invalid session cookie
            const response = NextResponse.json({ user: null }, { status: 200 });
            response.cookies.delete("session");
            return response;
        }

        return NextResponse.json(
            { user },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
