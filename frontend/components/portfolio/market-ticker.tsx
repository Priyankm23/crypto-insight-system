"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TickerItem {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>([
    { symbol: "BTC", price: 42850.32, change: 1250.45, changePercent: 3.01 },
    { symbol: "ETH", price: 2245.67, change: -45.23, changePercent: -1.97 },
    { symbol: "BNB", price: 312.45, change: 8.92, changePercent: 2.94 },
    { symbol: "SOL", price: 98.23, change: 4.56, changePercent: 4.87 },
    { symbol: "XRP", price: 0.6234, change: 0.0123, changePercent: 2.01 },
    { symbol: "ADA", price: 0.4523, change: -0.0089, changePercent: -1.93 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((ticker) => {
          const changeAmount = (Math.random() - 0.5) * ticker.price * 0.02
          const newPrice = Math.max(0.01, ticker.price + changeAmount)
          const newChange = newPrice - ticker.price
          const newChangePercent = (newChange / ticker.price) * 100

          return {
            ...ticker,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden border-y border-border/40 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
      <div className="flex animate-scroll py-3 gap-0">
        {[...tickers, ...tickers, ...tickers].map((ticker, index) => (
          <div
            key={`${ticker.symbol}-${index}`}
            className="flex items-center gap-2 px-8 border-r border-border/30 whitespace-nowrap flex-shrink-0"
          >
            <span className="font-semibold text-foreground">{ticker.symbol}</span>
            <span className="text-sm font-mono">${ticker.price.toFixed(ticker.price > 1 ? 2 : 4)}</span>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                ticker.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {ticker.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{ticker.changePercent >= 0 ? "+" : ""}
                {ticker.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
