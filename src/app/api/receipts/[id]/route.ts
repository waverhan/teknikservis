import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const receipt = await prisma.receipt.findFirst({
            where: {
                id: params.id,
                businessId: session.businessId,
            },
            include: {
                serviceRequest: {
                    include: { customer: true },
                },
                business: true,
            },
        });

        if (!receipt) return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
        return NextResponse.json(receipt);
    } catch {
        return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 });
    }
}
