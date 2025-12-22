import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface InsightCardProps {
  title: string
  category: string
  value?: number | string
  timestamp: string
  trend?: "up" | "down"
  icon?: React.ReactNode
}

export function InsightCard({ title, category, value, timestamp, trend, icon }: InsightCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{category}</CardDescription>
          </div>
          {trend && (
            <Badge variant={trend === "up" ? "default" : "destructive"} className="gap-1">
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {value && <p className="text-2xl font-bold mb-2">{value}</p>}
        {icon && <div className="mb-2">{icon}</div>}
        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</p>
      </CardContent>
    </Card>
  )
}
