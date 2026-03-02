import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePasswords, signJWT } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        const business = await prisma.business.findUnique({
            where: { email },
        });

        if (!business) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await comparePasswords(password, business.hashedPassword);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signJWT({ businessId: business.id, email: business.email });

        const response = NextResponse.json({
            message: "Logged in successfully",
            token, // Mobile needs the token in body
            business: {
                id: business.id,
                name: business.name,
                email: business.email,
                slug: business.slug
            }
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
