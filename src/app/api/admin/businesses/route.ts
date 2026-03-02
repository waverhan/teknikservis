import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();

    // Basit bir süper admin kontrolü (Email bazlı)
    // Gerçekte bir 'role' alanı olması daha iyidir
    const superAdminEmails = ['admin@serviceflow.com', 'erhan@test.com', 'hizli@test.com'];

    if (!session || !superAdminEmails.includes(session.email)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const businesses = await prisma.business.findMany({
            include: {
                _count: {
                    select: {
                        customers: true,
                        serviceRequests: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(businesses);
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return NextResponse.json({ error: "İşletmeler yüklenirken bir hata oluştu." }, { status: 500 });
    }
}
