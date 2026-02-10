import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export const dynamic = 'force-dynamic'

export default async function Home() {
    const products = await prisma.product.findMany({
        orderBy: { id: 'asc' }
    })

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            customer: true, 
            product: true
        }
    })

    const totalRevenue = await prisma.order.aggregate({
        _sum: { pricePaid: true }
    })

    const totalOrders = await prisma.order.count()

    const criticalStockCount = await prisma.product.count({
        where: { stock: { lt: 10 } }
    })

    return (
        <div className="p-5 font-sans">
            <div className="border-b-4 border-black mb-5 pb-2">
                <h1 className="text-3xl font-bold">STOCK & ORDER TRACKING SYSTEM</h1>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="border-2 border-black p-4 bg-green-100 flex-1">
                    <h3 className="font-bold">TOTAL REVENUE</h3>
                    <p className="text-2xl">{(totalRevenue._sum.pricePaid || 0).toFixed(2)} TL</p>
                </div>

                <div className="border-2 border-black p-4 bg-blue-100 flex-1">
                    <h3 className="font-bold">TOTAL ORDER</h3>
                    <p className="text-2xl">{totalOrders} Piece</p>
                </div>

                <div className="border-2 border-black p-4 bg-red-100 flex-1">
                    <h3 className="font-bold">CRITICAL STOCK</h3>
                    <p className="text-2xl">{criticalStockCount} Product</p>
                    {criticalStockCount > 0 && <b className="text-red-600">Low Stock!</b>}
                </div>
            </div>

            <h2 className="text-xl font-bold mb-2 bg-black text-white p-2 inline-block">PRODUCTS</h2>
            <div className="grid grid-cols-3 gap-4 mb-10">
                {products.map((item: any) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>

            <h2 className="text-xl font-bold mb-2 bg-black text-white p-2 inline-block">ORDERS</h2>
            <div className="border-2 border-black">
                <table className="w-full text-left">
                    <thead className="bg-gray-300 border-b-2 border-black">
                        <tr>
                            <th className="p-2 border-r border-black">Customer</th>
                            <th className="p-2 border-r border-black">Product</th>
                            <th className="p-2 border-r border-black">Price</th>
                            <th className="p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order: any) => (
                            <tr key={order.id} className="border-b border-gray-400 hover:bg-yellow-100">
                                <td className="p-2 border-r border-gray-400">{order.customer.name}</td>
                                <td className="p-2 border-r border-gray-400">{order.product.name}</td>
                                <td className="p-2 border-r border-gray-400">
                                    {order.pricePaid.toFixed(2)} TL
                                </td>
                                <td className="p-2 text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recentOrders.length === 0 && <div className="p-4 text-center">No order exists.</div>}
            </div>
        </div>
    )
}