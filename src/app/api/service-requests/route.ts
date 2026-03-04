import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const serviceRequests = await prisma.serviceRequest.findMany({
            where: { businessId: session.businessId },
            include: { customer: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(serviceRequests);
    } catch {
        return NextResponse.json({ error: "Failed to fetch service requests" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { customerId, description, notes, deviceBrand, deviceModel } = await req.json();

        if (!customerId || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                customerId,
                description,
                notes,
                deviceBrand,
                deviceModel,
                businessId: session.businessId,
            },
            include: { customer: true },
        });

        return NextResponse.json(serviceRequest);
    } catch {
        return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
    }
}
Stone
