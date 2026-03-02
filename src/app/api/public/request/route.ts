import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { slug, name, phone, email, address, description } = await req.json();

        if (!slug || !name || !phone || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find business by slug
        const business = await prisma.business.findUnique({
            where: { slug },
        });

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        // Use transaction to ensure both customer and request are created
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create customer scoped to this business
            const customer = await tx.customer.create({
                data: {
                    name,
                    phone,
                    email,
                    address,
                    businessId: business.id,
                },
            });

            // 2. Create service request scoped to this business and new customer
            const serviceRequest = await tx.serviceRequest.create({
                data: {
                    description,
                    customerId: customer.id,
                    businessId: business.id,
                    status: "NEW", // Service requests started via public form are always NEW
                },
            });

            return { customer, serviceRequest };
        });

        return NextResponse.json({
            message: "Service request submitted successfully",
            requestId: result.serviceRequest.id
        });
    } catch (error) {
        console.error("Public service request error:", error);
        return NextResponse.json({ error: "Failed to submit service request" }, { status: 500 });
    }
}
