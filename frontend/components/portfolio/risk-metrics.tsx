import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown, Activity, Target, TrendingUp, PieChart, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RiskMetricsProps {
  metrics: {
    volatility: number
    max_drawdown: number
    sharpe: number
    sortino: number
    beta: number
    max_weight: number
  }
  alertMessage?: string
}

const THRESHOLDS = {
  volatility: 0.05,
  sharpe: 1.0,
  max_drawdown: -0.20,
  sortino: 1.0,
  beta: 1.2,
  max_weight: 0.5,
}

const METRIC_INFO = {
  volatility: {
    title: "Volatility",
    description: "Measures how much your portfolio's returns fluctuate. Lower is better.",
    icon: Activity,
    format: (val: number) => `${(val * 100).toFixed(2)}%`,
    getStatus: (val: number) => val >= THRESHOLDS.volatility ? "warning" : "good",
  },
  max_drawdown: {
    title: "Max Drawdown",
    description: "The largest peak-to-trough decline. Shows worst-case loss scenario.",
    icon: TrendingDown,
    format: (val: number) => `${(val * 100).toFixed(2)}%`,
    getStatus: (val: number) => val < THRESHOLDS.max_drawdown ? "warning" : "good",
  },
  sharpe: {
    title: "Sharpe Ratio",
    description: "Risk-adjusted return. Higher values indicate better risk-reward balance.",
    icon: Target,
    format: (val: number) => val.toFixed(2),
    getStatus: (val: number) => val < THRESHOLDS.sharpe ? "warning" : "good",
  },
  sortino: {
    title: "Sortino Ratio",
    description: "Like Sharpe but only considers downside volatility. Higher is better.",
    icon: TrendingUp,
    format: (val: number) => val.toFixed(2),
    getStatus: (val: number) => val < THRESHOLDS.sortino ? "warning" : "good",
  },
  beta: {
    title: "Portfolio Beta",
    description: "Measures correlation with market. <1 is less volatile, >1 is more volatile.",
    icon: Activity,
    format: (val: number) => val.toFixed(2),
    getStatus: (val: number) => val >= THRESHOLDS.beta ? "warning" : "good",
  },
  max_weight: {
    title: "Max Asset Weight",
    description: "Highest allocation to a single asset. Lower indicates better diversification.",
    icon: PieChart,
    format: (val: number) => `${(val * 100).toFixed(2)}%`,
    getStatus: (val: number) => val > THRESHOLDS.max_weight ? "warning" : "good",
  },
}

export function RiskMetrics({ metrics, alertMessage }: RiskMetricsProps) {
  const getRiskLevel = (sharpeRatio: number) => {
    if (sharpeRatio > 2) return { label: "Excellent", variant: "default" as const, color: "text-green-500" }
    if (sharpeRatio > 1) return { label: "Good", variant: "default" as const, color: "text-blue-500" }
    if (sharpeRatio > 0) return { label: "Moderate", variant: "secondary" as const, color: "text-amber-500" }
    return { label: "High Risk", variant: "destructive" as const, color: "text-red-500" }
  }

  const sharpeVal = Number.isFinite(metrics.sharpe) ? metrics.sharpe : 0
  const riskLevel = getRiskLevel(sharpeVal)

  const renderMetricCard = (key: keyof typeof METRIC_INFO) => {
    const info = METRIC_INFO[key]
    const value = metrics[key]
    const Icon = info.icon
    const status = info.getStatus(value)
    const isGood = status === "good"

    return (
      <Card key={key}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${isGood ? "text-green-500" : "text-amber-500"}`} />
              <h4 className="font-semibold">{info.title}</h4>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{info.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{Number.isFinite(value) ? info.format(value) : "—"}</p>
              {!isGood && (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Alert
                </Badge>
              )}
            </div>

            {Number.isFinite(value) && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Threshold: {info.format(THRESHOLDS[key])}</span>
                  <span className={isGood ? "text-green-500" : "text-amber-500"}>
                    {isGood ? "✓ Within limits" : "⚠ Exceeds threshold"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Comprehensive portfolio risk analysis</CardDescription>
            </div>
            <Badge variant={riskLevel.variant} className={riskLevel.color}>
              {riskLevel.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {alertMessage && (
        <Card className="border-amber-500/50 bg-amber-50/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Risk Violations Detected</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{alertMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {renderMetricCard("volatility")}
        {renderMetricCard("max_drawdown")}
        {renderMetricCard("sharpe")}
        {renderMetricCard("sortino")}
        {renderMetricCard("beta")}
        {renderMetricCard("max_weight")}
      </div>
    </div>
  )
}
