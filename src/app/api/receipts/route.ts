import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

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
    } catch {
        return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { serviceRequestId, price } = await req.json();

        if (!serviceRequestId || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const receipt = await prisma.receipt.create({
            data: {
                price: Number(price),
                serviceRequestId,
                businessId: session.businessId,
            },
            include: {
                serviceRequest: {
                    include: { customer: true }
                }
            }
        });

        return NextResponse.json(receipt);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Receipt creation error:", error);
        return NextResponse.json({ error: "Failed to create receipt", details: error.message }, { status: 500 });
    }
}
