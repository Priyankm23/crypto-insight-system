"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, Zap } from "lucide-react"
import { getGlobalMarketData } from "@/lib/coingecko"

interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  btcDominance: number
  marketCapChange: number
}

export function MarketStats() {
  const [stats, setStats] = useState<MarketStats>({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    marketCapChange: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      const data = await getGlobalMarketData()
      if (data?.data) {
        setStats({
          totalMarketCap: data.data.total_market_cap.usd,
          totalVolume: data.data.total_volume.usd,
          btcDominance: data.data.market_cap_percentage.btc,
          marketCapChange: data.data.market_cap_change_percentage_24h_usd,
        })
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      fetchMarketData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  // Calculate sentiment based on market cap change
  const getSentiment = () => {
    if (stats.marketCapChange > 3) return { label: "Bullish", change: stats.marketCapChange }
    if (stats.marketCapChange > 0) return { label: "Neutral", change: stats.marketCapChange }
    if (stats.marketCapChange > -3) return { label: "Cautious", change: stats.marketCapChange }
    return { label: "Bearish", change: stats.marketCapChange }
  }

  const sentiment = getSentiment()

  const statCards = [
    {
      title: "Total Market Cap",
      value: isLoading ? "Loading..." : formatLargeNumber(stats.totalMarketCap),
      change: stats.marketCapChange,
      icon: Globe,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "24h Volume",
      value: isLoading ? "Loading..." : formatLargeNumber(stats.totalVolume),
      change: stats.marketCapChange, // Volume change correlates with market cap change
      icon: Activity,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "BTC Dominance",
      value: isLoading ? "Loading..." : `${stats.btcDominance.toFixed(2)}%`,
      change: 0, // BTC dominance doesn't have a 24h change in the API
      icon: DollarSign,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
    },
    {
      title: "Market Sentiment",
      value: isLoading ? "Loading..." : sentiment.label,
      change: sentiment.change,
      icon: Zap,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.change >= 0

        return (
          <Card
            key={index}
            className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden relative group hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} backdrop-blur-sm`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(stat.change).toFixed(2)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
