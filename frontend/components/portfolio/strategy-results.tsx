"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react"

interface StrategyResultsProps {
  portfolioReturn: number
  weights: Record<string, number>
  stressTestResults?: {
    "Bull Market": {
      mean_return: number
      volatility: number
      min_return: number
      max_return: number
    }
    "Bear Market": {
      mean_return: number
      volatility: number
      min_return: number
      max_return: number
    }
    "Volatile Market": {
      mean_return: number
      volatility: number
      min_return: number
      max_return: number
    }
  }
  insights?: string[]
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]

export function StrategyResults({ portfolioReturn, weights, stressTestResults, insights }: StrategyResultsProps) {
  const chartData = Object.entries(weights).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: value * 100,
  }))

  const getScenarioIcon = (scenario: string) => {
    if (scenario === "Bull Market") return <TrendingUp className="w-5 h-5 text-green-500" />
    if (scenario === "Bear Market") return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Activity className="w-5 h-5 text-amber-500" />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Investment strategy results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Total Return</p>
            <p className={`text-4xl font-bold ${portfolioReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
              {(portfolioReturn * 100).toFixed(2)}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Portfolio weight distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {stressTestResults && (
        <Card>
          <CardHeader>
            <CardTitle>Stress Test Scenarios</CardTitle>
            <CardDescription>Portfolio performance under different market conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stressTestResults).map(([scenario, data]) => (
              <div key={scenario} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getScenarioIcon(scenario)}
                  <h4 className="font-semibold text-lg">{scenario}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Average Return</p>
                    <p className={`font-semibold ${data.mean_return >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {(data.mean_return * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volatility</p>
                    <p className="font-semibold">{(data.volatility * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min Return</p>
                    <p className="font-semibold text-red-500">{(data.min_return * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Return</p>
                    <p className="font-semibold text-green-500">{(data.max_return * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {insights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Insights</CardTitle>
            <CardDescription>AI-generated analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
