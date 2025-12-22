import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Clock } from "lucide-react"

interface MetricsHistoryProps {
  history: Array<{ name: string; value: number; timestamp: string }>
}

// Metric descriptions for user reference
const metricDescriptions: Record<string, string> = {
  sharpe_ratio: "Risk-adjusted return metric. Higher values indicate better risk-adjusted performance.",
  volatility: "Measures price fluctuation and market risk. Lower is more stable.",
  return: "Percentage gain or loss over the period. Shows overall profitability.",
  max_drawdown: "Maximum peak-to-trough decline. Indicates worst-case loss scenario.",
  alpha: "Excess return vs benchmark. Positive means outperforming the market.",
  beta: "Market sensitivity and correlation. 1 means moves with market.",
  correlation: "How closely assets move together. Ranges from -1 to 1.",
  sortino_ratio: "Risk-adjusted return focusing only on downside volatility.",
  information_ratio: "Risk-adjusted excess return vs benchmark.",
  treynor_ratio: "Return per unit of systematic risk (beta).",
  calmar_ratio: "Return vs maximum drawdown. Higher is better.",
}

export function MetricsHistory({ history }: MetricsHistoryProps) {
  // Group by name
  const groupedMetrics = history.reduce(
    (acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = []
      }
      acc[metric.name].push(metric)
      return acc
    },
    {} as Record<string, typeof history>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics History</CardTitle>
        <CardDescription>Previously calculated technical metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedMetrics).map(([name, metrics]) => (
            <div key={name} className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm capitalize mb-1">{name.replace(/_/g, " ")}</h4>
                {metricDescriptions[name] && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{metricDescriptions[name]}</p>
                )}
              </div>
              <div className="space-y-2">
                {metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono">{metric.value.toFixed(4)}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(metric.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedMetrics).length === 0 && (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              <p>No metrics history available yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
