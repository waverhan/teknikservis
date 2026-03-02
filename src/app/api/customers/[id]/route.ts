import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const customer = await prisma.customer.findFirst({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
        });

        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { name, phone, email, address } = await req.json();

        const customer = await prisma.customer.update({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            data: {
                name,
                phone,
                email,
                address,
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.customer.delete({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
        });

        return NextResponse.json({ message: "Customer deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}
