import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { businessId, rating, comment, customerName } = await req.json();

        if (!businessId || !rating || !customerName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                businessId,
                rating: parseInt(rating),
                comment,
                customerName,
            },
        });

        return NextResponse.json(review);
    } catch {
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}
