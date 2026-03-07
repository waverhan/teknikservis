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

        const existingBusiness = await prisma.business.findFirst({
            where: { slug },
        });

        if (existingBusiness) {
            return NextResponse.json({ error: `Slug already exists` }, { status: 409 });
        }

        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: `Email already exists` }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const { business, user } = await prisma.$transaction(async (tx) => {
            const biz = await tx.business.create({
                data: {
                    email, // Keep for backward compat/ref during dev
                    hashedPassword, // Keep for backward compat/ref during dev
                    name,
                    phone,
                    address,
                    slug,
                },
            });

            const admin = await tx.user.create({
                data: {
                    email,
                    hashedPassword,
                    name, // Use business name or person name? User said "first account becomes admin"
                    role: 'ADMIN',
                    businessId: biz.id,
                }
            });

            return { business: biz, user: admin };
        });

        const token = await signJWT({
            userId: user.id,
            businessId: business.id,
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            message: "Account created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
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
