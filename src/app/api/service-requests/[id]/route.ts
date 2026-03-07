import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Prisma, ServiceStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface IServiceAction {
    description: string;
    price: string | number;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const serviceRequest = await prisma.serviceRequest.findFirst({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            include: { customer: true, receipt: true, actions: true, business: true, technician: true },
        });

        if (!serviceRequest) return NextResponse.json({ error: "Service request not found" }, { status: 404 });

        // Security check for Technicians
        if (session.role === 'TECHNICIAN' && serviceRequest.technicianId !== session.userId) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

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
        const { status, description, notes, deviceBrand, deviceModel, actions, technicianId } = body;

        // Security check: Technicians can only update status and actions of their own jobs
        if (session.role === 'TECHNICIAN') {
            const check = await prisma.serviceRequest.findFirst({
                where: { id: params.id, businessId: session.businessId, technicianId: session.userId }
            });
            if (!check) return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status as ServiceStatus;
        if (description !== undefined && session.role === 'ADMIN') updateData.description = description;
        if (notes !== undefined && session.role === 'ADMIN') updateData.notes = notes;
        if (deviceBrand !== undefined && session.role === 'ADMIN') updateData.deviceBrand = deviceBrand;
        if (deviceModel !== undefined && session.role === 'ADMIN') updateData.deviceModel = deviceModel;
        if (technicianId !== undefined && session.role === 'ADMIN') {
            updateData.technician = technicianId ? { connect: { id: technicianId } } : { disconnect: true };
        }

        if (actions) {
            updateData.actions = {
                deleteMany: {},
                create: actions.map((a: IServiceAction) => ({
                    description: a.description,
                    price: new Prisma.Decimal(parseFloat(a.price.toString()) || 0)
                }))
            };
        }

        const serviceRequest = await prisma.serviceRequest.update({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            data: updateData as Prisma.ServiceRequestUpdateInput,
            include: { customer: true, receipt: true, actions: true },
        });

        return NextResponse.json(serviceRequest);
    } catch (error) {
        console.error("Service request update error:", error);
        return NextResponse.json({
            error: "Failed to update service request",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: "Access denied. Only Admins can delete." }, { status: 403 });
    }

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

