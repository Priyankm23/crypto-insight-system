"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopCryptos, type CryptoAsset } from "@/lib/coingecko"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketSnapshot() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopCryptos(8)
      setCryptos(data)
      setIsLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30 py-4">
          <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Market Snapshot</h3>
            </div>
            <CardDescription className="mt-1">Loading market data...</CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm sticky top-24">
      <CardHeader className="border-b border-border/30 py-4">
        <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Market Snapshot</h3>
          </div>
          <CardDescription className="mt-1">Top cryptocurrencies by market cap</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {cryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 hover:to-accent/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-semibold">{crypto.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${crypto.current_price.toLocaleString()}</p>
                <div
                  className={`flex items-center gap-1 text-sm ${crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
