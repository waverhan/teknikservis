import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signJWT } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email, password, name, phone, address, slug } = await req.json();

        if (!email || !password || !name || !slug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.business.findFirst({
            where: { OR: [{ email }, { slug }] },
        });

        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Slug";
            return NextResponse.json({ error: `${field} already exists` }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const business = await prisma.business.create({
            data: {
                email,
                hashedPassword,
                name,
                phone,
                address,
                slug,
            },
        });

        const token = await signJWT({ businessId: business.id, email: business.email });

        const response = NextResponse.json({
            message: "Account created successfully",
            token,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || "No error message",
            code: error.code
        }, { status: 500 });
    }
}
