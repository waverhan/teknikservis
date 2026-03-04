import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            primaryColor,
            publicDescription,
            isPublic,
            logo,
            coverImage,
            phone,
            address,
            googleMapsUrl
        } = body;

        const updatedBusiness = await prisma.business.update({
            where: {
                id: session.businessId,
            },
            data: {
                primaryColor,
                publicDescription,
                logo,
                coverImage,
                phone,
                address,
                googleMapsUrl,
                isPublic: Boolean(isPublic),
            },
        });

        return NextResponse.json({ success: true, business: updatedBusiness });
    } catch (error) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ error: "Ayarlar güncellenirken bir hata oluştu." }, { status: 500 });
    }
}
