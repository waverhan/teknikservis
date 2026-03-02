import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const receipts = await prisma.receipt.findMany({
            where: {
                businessId: session.businessId,
            },
            include: {
                serviceRequest: {
                    include: { customer: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(receipts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
    }
}
