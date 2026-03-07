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

        const user = await prisma.user.findUnique({
            where: { email },
            include: { business: true }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await comparePasswords(password, user.hashedPassword);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signJWT({
            userId: user.id,
            businessId: user.businessId,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            message: "Logged in successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            business: {
                id: user.business.id,
                name: user.business.name,
                email: user.business.email,
                slug: user.business.slug
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || "No error message",
            code: error.code
        }, { status: 500 });
    }
}
