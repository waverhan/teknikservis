import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting data migration via API...');

        const businesses = await prisma.business.findMany();
        console.log(`Found ${businesses.length} businesses.`);

        const results = [];

        for (const biz of businesses) {
            // Check if admin user already exists for this business
            const existingUser = await prisma.user.findFirst({
                where: { email: biz.email }
            });

            if (!existingUser) {
                console.log(`Migrating business: ${biz.name} (${biz.email})`);
                await prisma.user.create({
                    data: {
                        email: biz.email,
                        hashedPassword: (biz as any).hashedPassword,
                        name: biz.name,
                        role: 'ADMIN',
                        businessId: biz.id,
                    }
                });
                results.push({ name: biz.name, status: 'migrated' });
            } else {
                console.log(`Admin user already exists for business: ${biz.name}`);
                results.push({ name: biz.name, status: 'already_exists' });
            }
        }

        return NextResponse.json({ message: "Migration completed", results });
    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
