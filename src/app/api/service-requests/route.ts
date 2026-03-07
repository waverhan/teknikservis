import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Role-based where clause interface
interface ServiceRequestWhereInput {
    businessId: string;
    technicianId?: string;
}

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const where: ServiceRequestWhereInput = { businessId: session.businessId };

        // Technicians can only see their own jobs
        if (session.role === 'TECHNICIAN') {
            where.technicianId = session.userId;
        }

        const serviceRequests = await prisma.serviceRequest.findMany({
            where,
            include: { customer: true, technician: true },
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
        const { customerId, description, notes, deviceBrand, deviceModel, actions, technicianId } = await req.json();

        // Technicians cannot create jobs
        if (session.role === 'TECHNICIAN') {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

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
                technicianId: technicianId || null,
                actions: actions ? {
                    create: (actions as { description: string; price: string | number }[]).map((a) => ({
                        description: a.description,
                        price: parseFloat(a.price.toString()) || 0
                    }))
                } : undefined
            },
            include: { customer: true, actions: true, technician: true },
        });

        return NextResponse.json(serviceRequest);
    } catch {
        return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
    }
}

