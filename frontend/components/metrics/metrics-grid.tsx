import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MetricRow {
  date: string | null
  percent_change: number
  rolling_volatility_7d: number | null
  average_return_3d: number | null
  trading_signal: string
  sortino: number | null
  beta: number | null
}

interface MetricsGridProps {
  metrics: {
    metrics: Record<string, MetricRow[]>
    stored_count: number
  }
}

const formatValue = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A'
  if (isNaN(value)) return 'N/A'
  if (Math.abs(value) < 0.01 && value !== 0) return value.toExponential(2)
  if (Math.abs(value) > 1000) return value.toFixed(0)
  return value.toFixed(4)
}

const formatPercent = (value: number | null): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  return `${(value * 100).toFixed(2)}%`
}

const getSignalBadge = (signal: string) => {
  if (signal === 'Buy') return <Badge className="bg-green-500 hover:bg-green-600">Buy</Badge>
  if (signal === 'Sell') return <Badge variant="destructive">Sell</Badge>
  return <Badge variant="outline">Hold</Badge>
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const symbolData = metrics?.metrics || {}
  const storedCount = metrics?.stored_count || 0

  // Check if we have any data to display
  if (!symbolData || Object.keys(symbolData).length === 0) {
    return (
      <Card className="border-dashed border-2 border-border/50 bg-muted/20">
        <CardContent className="text-center py-12">
          <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg font-medium mb-2">No Metrics Available</p>
          <p className="text-muted-foreground">Calculate metrics to see detailed results</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30 py-4">
          <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Technical Metrics Results</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {storedCount} metrics stored
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {Object.entries(symbolData).map(([symbol, rows]) => {
        // Take first 5 rows
        const displayRows = rows.slice(0, 5)
        
        return (
          <Card key={symbol} className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-border/30 py-4">
              <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{symbol}</h3>
                  <Badge variant="secondary" className="text-xs">{displayRows.length} rows</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto -mx-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold pl-6">Date</TableHead>
                      <TableHead className="font-semibold text-right">% Change</TableHead>
                      <TableHead className="font-semibold text-right">Volatility (7d)</TableHead>
                      <TableHead className="font-semibold text-right">Avg Return (3d)</TableHead>
                      <TableHead className="font-semibold text-center">Signal</TableHead>
                      <TableHead className="font-semibold text-right">Sortino</TableHead>
                      <TableHead className="font-semibold text-right pr-6">Beta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayRows.map((row, idx) => {
                      const changeIcon = row.percent_change > 0 
                        ? <TrendingUp className="w-3 h-3 text-green-500 inline" />
                        : row.percent_change < 0 
                        ? <TrendingDown className="w-3 h-3 text-red-500 inline" />
                        : <Minus className="w-3 h-3 text-muted-foreground inline" />
                      
                      return (
                        <TableRow key={idx} className="hover:bg-muted/20">
                          <TableCell className="font-mono text-xs pl-6">
                            {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${row.percent_change > 0 ? 'text-green-600 dark:text-green-500' : row.percent_change < 0 ? 'text-red-600 dark:text-red-500' : ''}`}>
                            {changeIcon} {formatPercent(row.percent_change)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatValue(row.rolling_volatility_7d)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatPercent(row.average_return_3d)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getSignalBadge(row.trading_signal)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatValue(row.sortino)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground pr-6">
                            {formatValue(row.beta)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
