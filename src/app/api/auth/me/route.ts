import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const business = await prisma.business.findUnique({
            where: { id: session.businessId },
            select: {
                id: true,
                name: true,
                email: true,
                slug: true,
                phone: true,
                address: true,
                logo: true,
                primaryColor: true,
                publicDescription: true,
                isPublic: true,
                customDomain: true,
            }
        });

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        return NextResponse.json({ business });
    } catch (error) {
        console.error("Auth Me Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
