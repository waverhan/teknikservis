import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, description, slug } = body;

        // 1. Resolve Tenant
        const business = await prisma.business.findUnique({
            where: { slug },
        });

        if (!business || !business.isPublic) {
            return NextResponse.json({ error: "Tenant not found or public access disabled" }, { status: 404 });
        }

        // 2. Find or Create Customer for this Business
        // (In a real app, we might match by phone, but here we simplify for MVP V3)
        let customer = await prisma.customer.findFirst({
            where: {
                phone: phone,
                businessId: business.id
            }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    name,
                    phone,
                    businessId: business.id
                }
            });
        }

        // 3. Create Service Request
        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                description,
                status: 'NEW', // Default in schema is NEW, but we set it explicitly
                businessId: business.id,
                customerId: customer.id,
                notes: `TALEP KAYNAĞI: WEB SİTESİ`,
            },
        });

        return NextResponse.json({ success: true, id: serviceRequest.id });
    } catch (error) {
        console.error('Public Service Request Error:', error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
    }
}
