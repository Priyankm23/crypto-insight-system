"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"

interface PredictionChartProps {
  predictedValue: number
  confidenceInterval: [number, number]
  nextPeriod: string
}

export function PredictionChart({ predictedValue, confidenceInterval, nextPeriod }: PredictionChartProps) {
  // Generate mock historical data for visualization
  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    period: i + 1,
    value: predictedValue * (0.8 + Math.random() * 0.4),
  }))

  // Add prediction point
  const chartData = [
    ...historicalData,
    {
      period: 31,
      value: predictedValue,
      lower: confidenceInterval[0],
      upper: confidenceInterval[1],
    },
  ]

  const trend = predictedValue > historicalData[historicalData.length - 1].value ? "up" : "down"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Price Prediction</CardTitle>
              <CardDescription>Forecast for {nextPeriod}</CardDescription>
            </div>
            <Badge variant={trend === "up" ? "default" : "destructive"} className="gap-1">
              <TrendingUp className={`w-3 h-3 ${trend === "down" ? "rotate-180" : ""}`} />
              {trend === "up" ? "Bullish" : "Bearish"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Predicted Value</p>
              <p className="text-4xl font-bold">${predictedValue.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lower Bound (95%)</p>
                <p className="text-xl font-semibold">${confidenceInterval[0].toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upper Bound (95%)</p>
                <p className="text-xl font-semibold">${confidenceInterval[1].toFixed(2)}</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="period" stroke="#888" tick={{ fontSize: 12 }} />
              <YAxis stroke="#888" tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorValue)" />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="#f59e0b"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upper"
                stroke="#f59e0b"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
