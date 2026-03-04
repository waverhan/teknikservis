import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { name, description, price } = await req.json();

        const service = await prisma.offeredService.update({
            where: {
                id: params.id,
                businessId: session.businessId
            },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : null,
            },
        });

        return NextResponse.json(service);
    } catch {
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.offeredService.delete({
            where: {
                id: params.id,
                businessId: session.businessId
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}
