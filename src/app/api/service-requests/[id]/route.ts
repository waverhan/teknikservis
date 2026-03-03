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
        const body = await req.json();
        const { status, description, notes } = body;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};
        if (status) updateData.status = status;
        if (description !== undefined) updateData.description = description;
        if (notes !== undefined) updateData.notes = notes;

        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            data: updateData,
            include: { customer: true, receipt: true },
        });

        return NextResponse.json(serviceRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Service request update error:", error);
        return NextResponse.json({
            error: "Failed to update service request",
            details: error.message
        }, { status: 500 });
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
