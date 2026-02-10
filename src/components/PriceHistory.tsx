"use client"

import { useEffect, useState } from "react"

export default function PriceHistory(props: any) {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/products/' + props.productId + '/history')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setHistory(data.slice(-10))
                }
                setLoading(false)
            })
            .catch(err => setLoading(false))
    }, [])

    if (loading) return <div>Loading...</div>
    if (history.length === 0) return <div>No data.</div>

    let maxPrice = 0
    history.forEach(h => {
        if (h.price > maxPrice) maxPrice = h.price
    })

    return (
        <div className="bg-gray-50 border border-black p-2 mt-2">
            <h4 className="font-bold text-xs mb-1">Change of price:</h4>
            
            <div className="flex items-end h-24 border-l-2 border-b-2 border-black gap-1 p-1">
                {history.map((item, index) => {
                    const heightPercent = (item.price / maxPrice) * 100
                    
                    return (
                        <div key={index} className="flex-1 flex flex-col justify-end group relative">
                            <div 
                                style={{ height: `${heightPercent}%` }} 
                                className="bg-blue-600 hover:bg-blue-800 w-full"
                                title={`Price: ${item.price} TL`} 
                            ></div>
                        </div>
                    )
                })}
            </div>
            <div className="text-xs text-center mt-1">From older to new</div>
        </div>
    )
}