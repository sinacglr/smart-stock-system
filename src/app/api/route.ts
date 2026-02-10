import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const newStock = Number(body.newStock);

        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" }, 
                { status: 404 }
            );
        }

        let newPrice = product.basePrice;

        if (newStock < 10) {
            newPrice = product.basePrice * 1.5;
        } else if (newStock < 50) {
            newPrice = product.basePrice * 1.2;
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                stock: newStock,
                currentPrice: newPrice,
                priceHistory: {
                    create: {
                        price: newPrice
                    }
                }
            }
        });

        return NextResponse.json(updatedProduct);

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}