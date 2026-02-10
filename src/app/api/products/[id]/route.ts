import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;
  const body = await request.json();
  const newStock = body.newStock; 

  try {
    const product = await prisma.product.findUnique({ where: { id: id } });
    
    if (!product) {
        return NextResponse.json({ error: "No Product" }, { status: 404 });
    }

    if (newStock < product.stock) {
        const randomCustomer = await prisma.customer.findFirst({
            skip: Math.floor(Math.random() * 5)
        });

        if (randomCustomer) {
            await prisma.order.create({
                data: {
                    productId: id,
                    customerId: randomCustomer.id,
                    pricePaid: product.currentPrice
                }
            });
            console.log("Order is created: " + randomCustomer.name);
        }
    }

    let newPrice = product.basePrice;

    if (newStock < 50) {
      const fark = 50 - newStock;
      newPrice = product.basePrice + (fark * 2);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        stock: newStock,
        currentPrice: newPrice,
        priceHistory: { create: { price: newPrice } }
      },
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}