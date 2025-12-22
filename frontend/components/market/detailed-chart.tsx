"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { getTopCryptos } from "@/lib/coingecko"
import { BarChart3 } from "lucide-react"

export function DetailedChart() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin")
  const [timeframe, setTimeframe] = useState("7d")
  const [chartData, setChartData] = useState<any[]>([])
  const [coinInfo, setCoinInfo] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const cryptos = await getTopCryptos(10)
      const coin = cryptos.find((c) => c.id === selectedCoin)

      if (coin && coin.sparkline_in_7d) {
        const prices = coin.sparkline_in_7d.price
        const data = prices.map((price, index) => ({
          time: index,
          price: price,
        }))
        setChartData(data)
        setCoinInfo(coin)
      }
    }

    fetchData()
  }, [selectedCoin, timeframe])

  return (
    <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/30 py-4">
        <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Price Chart</h3>
              </div>
              <CardDescription className="mt-1">Historical price data and trends</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="binancecoin">BNB</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="ripple">XRP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="1y">1y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {coinInfo && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-full shadow-sm">
                  <img src={coinInfo.image || "/placeholder.svg"} alt={coinInfo.name} className="w-10 h-10 rounded-full" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">${coinInfo.current_price.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground">{coinInfo.name}</p>
                </div>
              </div>
              <div
                className={`text-right ${coinInfo.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                <p className="text-2xl font-bold">{coinInfo.price_change_percentage_24h.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground">24h change</p>
              </div>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
