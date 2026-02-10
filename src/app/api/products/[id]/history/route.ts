import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> } 
) {
    const { id } = await params; 

    try {
        const history = await prisma.priceHistory.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'asc' } 
        });
        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json([]); 
    }
}