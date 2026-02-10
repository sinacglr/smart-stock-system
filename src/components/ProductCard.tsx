"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import PriceHistory from "./PriceHistory"

export default function ProductCard(props: any) {
    const router = useRouter()
    const product = props.product
    const [isLoading, setIsLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)

    async function handleSell() {
        if (product.stock <= 0) return alert("No stock!")
        
        setIsLoading(true)
        await fetch('/api/products/' + product.id, {
            method: 'PATCH',
            body: JSON.stringify({ newStock: product.stock - 1 })
        })
        router.refresh()
        setIsLoading(false)
    }

    async function handleRestock() {
        setIsLoading(true)
        await fetch('/api/products/' + product.id, {
            method: 'PATCH',
            body: JSON.stringify({ newStock: product.stock + 10 })
        })
        router.refresh()
        setIsLoading(false)
    }

    let cardClass = "border-2 border-black p-4 bg-white"
    let statusMsg = "Stock exists"

    if (product.stock < 10) {
        cardClass = "border-2 border-red-600 p-4 bg-red-100" 
        statusMsg = "CRITICAL!"
    } else if (product.stock < 50) {
        cardClass = "border-2 border-orange-500 p-4 bg-orange-100" 
        statusMsg = "Decreasing..."
    }

    return (
        <div className={cardClass}>
            <h3 className="font-bold text-lg underline">{product.name}</h3>
            
            <div className="my-2">
                <span className="text-xl font-bold">{product.currentPrice.toFixed(2)} TL</span>

                {product.currentPrice > product.basePrice && (
                    <span className="ml-2 line-through text-red-500 text-sm">
                        {product.basePrice.toFixed(2)} TL
                    </span>
                )}
            </div>

            <p className="text-sm mb-4">{product.description}</p>

            <div className="font-bold mb-2">
                Stock: {product.stock} <span className="text-sm ml-2">({statusMsg})</span>
            </div>

            <button 
                onClick={() => setShowHistory(!showHistory)}
                className="text-blue-700 underline text-sm mb-2"
            >
                {showHistory ? "Hide History" : "Show History"}
            </button>

            {showHistory && <PriceHistory productId={product.id} />}

            <div className="flex gap-2 mt-4 pt-4 border-t-2 border-black">
                <button 
                    onClick={handleRestock}
                    disabled={isLoading}
                    className="flex-1 bg-white border-2 border-black py-1 hover:bg-gray-200"
                >
                    + Add Stock
                </button>

                <button 
                    onClick={handleSell}
                    disabled={isLoading || product.stock === 0}
                    className="flex-1 bg-black text-white border-2 border-black py-1 hover:bg-gray-800 disabled:opacity-50"
                >
                    Sell (-1)
                </button>
            </div>
        </div>
    )
}