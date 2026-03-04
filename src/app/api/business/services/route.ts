import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const services = await prisma.offeredService.findMany({
            where: { businessId: session.businessId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(services);
    } catch {
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { name, description, price } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const service = await prisma.offeredService.create({
            data: {
                name,
                description,
                price: price ? parseFloat(price) : null,
                businessId: session.businessId,
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error("Service Create Error:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
