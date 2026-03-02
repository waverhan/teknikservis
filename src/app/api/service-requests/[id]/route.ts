import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const serviceRequest = await prisma.serviceRequest.findFirst({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            include: { customer: true, receipt: true },
        });

        if (!serviceRequest) return NextResponse.json({ error: "Service request not found" }, { status: 404 });
        return NextResponse.json(serviceRequest);
    } catch {
        return NextResponse.json({ error: "Failed to fetch service request" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { status, description, notes } = await req.json();

        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            data: {
                status,
                description,
                notes,
            },
            include: { customer: true },
        });

        return NextResponse.json(serviceRequest);
    } catch {
        return NextResponse.json({ error: "Failed to update service request" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Note: Business rule could be to not allow delete if receipt exists
        await prisma.serviceRequest.delete({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
        });

        return NextResponse.json({ message: "Service request deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Failed to delete service request" }, { status: 500 });
    }
}
