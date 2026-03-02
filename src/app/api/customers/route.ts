import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const customers = await prisma.customer.findMany({
            where: { businessId: session.businessId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(customers);
    } catch {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { name, phone, email, address } = await req.json();

        if (!name || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                phone,
                email,
                address,
                businessId: session.businessId,
            },
        });

        return NextResponse.json(customer);
    } catch {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
}
