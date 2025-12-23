"use client"

import { useEffect, useState } from "react"
import { NavHeader } from "@/components/dashboard/nav-header"
import { InsightCard } from "@/components/dashboard/insight-card"
import { MarketTicker } from "@/components/portfolio/market-ticker"
import { Footer } from "@/components/footer"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Target, TrendingUp, Zap, Sparkles, ArrowRight, Activity, Shield, AlertTriangle, Info, Brain, Lock, LineChart, PieChart, Layers } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.dashboard.getLatestInsights()
        setDashboardData(data)
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboard()
    }
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavHeader />
      
      {/* Disclaimer Banner */}
      <a href="#disclaimer" className="block w-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-red-500/20 border-b border-amber-500/30 hover:from-amber-500/30 hover:via-orange-500/25 hover:to-red-500/30 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 max-w-7xl">
          <div className="flex items-center justify-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="font-medium text-foreground">Important Disclaimer:</span>
            <span className="text-muted-foreground">Calculations are real but don't account for external market factors.</span>
            <span className="text-amber-600 dark:text-amber-500 hover:underline">Read full disclaimer →</span>
          </div>
        </div>
      </a>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 max-w-7xl relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Welcome Back</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Hello, {user?.name}!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Track, analyze, and optimize your crypto portfolio with advanced AI-powered insights and real-time market data.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/portfolio">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Portfolio Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/metrics">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Target className="w-5 h-5 mr-2" />
                  View Metrics
                </Button>
              </Link>
              <Link href="/predictions">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Predictions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <MarketTicker />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Your Latest Insights */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Your Latest Insights</h2>
            <p className="text-muted-foreground text-lg">Recent analysis and predictions from your portfolio</p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg bg-muted/20 animate-pulse border border-border/50" />
              ))}
            </div>
          ) : dashboardData && (dashboardData.metrics?.length > 0 || dashboardData.portfolio_analysis?.length > 0) ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboardData.metrics?.slice(0, 9).map((metric: any, index: number) => {
                  const isPositive = metric.value >= 0;
                  
                  return (
                    <Card key={index} className="border border-border/50 bg-card hover:bg-accent/5 transition-colors duration-200 group">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                              {metric.name}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-semibold tabular-nums ${isPositive ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                                {metric.value.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center justify-center w-8 h-8 rounded ${isPositive ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-red-100 dark:bg-red-950/30'}`}>
                            {isPositive ? (
                              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-500 rotate-180" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {metric.name.toLowerCase().includes('sharpe') && 'Risk-adjusted return metric. Higher is better. Above 1 is good, above 2 is excellent.'}
                          {metric.name.toLowerCase().includes('volatility') && 'Measures price fluctuation. Lower means more stable, higher means more risky.'}
                          {metric.name.toLowerCase().includes('return') && 'Percentage gain or loss over the period. Positive means profit, negative means loss.'}
                          {metric.name.toLowerCase().includes('drawdown') && 'Maximum peak-to-trough decline. Shows worst-case loss from highest point.'}
                          {metric.name.toLowerCase().includes('alpha') && 'Excess return compared to benchmark. Positive means outperforming the market.'}
                          {metric.name.toLowerCase().includes('beta') && 'Market sensitivity. 1 means moves with market, >1 means more volatile, <1 means less volatile.'}
                          {metric.name.toLowerCase().includes('correlation') && 'How closely assets move together. 1 means perfect correlation, 0 means no relationship.'}
                          {metric.name.toLowerCase().includes('sortino') && 'Like Sharpe but only penalizes downside risk. Higher is better.'}
                          {!metric.name.toLowerCase().match(/(sharpe|volatility|return|drawdown|alpha|beta|correlation|sortino)/) && 'Performance indicator for your portfolio analysis.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(metric.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                            {isPositive ? '+' : ''}{(metric.value * 100).toFixed(2)}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* View All Metrics Button */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <Link href="/metrics">
                  <Button variant="outline" size="lg" className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Target className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">View All Metrics</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                  </Button>
                </Link>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </>
          ) : (
            <Card className="text-center py-16 border-dashed border-2 border-border/50 bg-muted/20">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">No insights yet</p>
              <p className="text-muted-foreground mb-6">Upload your data to get started with analysis!</p>
              <Link href="/portfolio">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  Start Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Important Disclaimer */}
        <section id="disclaimer" className="mb-12 scroll-mt-20">
          <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-background p-1 shadow-lg">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-600" />
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 flex-shrink-0 animate-pulse-slow">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    System Transparency & Risk Disclosure
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    Important
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  While our AI models utilize advanced historical data analysis and technical indicators, cryptocurrency markets are highly volatile and influenced by unpredictable external factors. 
                  <span className="text-foreground font-medium"> Predictions are probabilistic, not guaranteed.</span> This platform is for informational purposes only.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Does not account for breaking news or regulations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Past performance is not indicative of future results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Explanation */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">System Modules</h2>
              <p className="text-muted-foreground text-lg">Advanced tools for portfolio management</p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="w-2 h-2 rounded-full bg-primary/20" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1 */}
            <Link href="/portfolio" className="group">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BarChart3 className="w-24 h-24 text-primary transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Portfolio Analysis</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Comprehensive breakdown of your holdings with real-time valuation and performance tracking.
                  </p>
                  <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Access Module <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 2 */}
            <Link href="/metrics" className="group">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-24 h-24 text-violet-500 transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-violet-500 transition-colors">Risk Metrics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Advanced risk assessment including Sharpe Ratio, Volatility, and Maximum Drawdown analysis.
                  </p>
                  <div className="flex items-center text-xs font-medium text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Access Module <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 3 */}
            <Link href="/predictions" className="group">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Brain className="w-24 h-24 text-amber-500 transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">AI Predictions</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Machine learning powered price forecasting and trend analysis for major cryptocurrencies.
                  </p>
                  <div className="flex items-center text-xs font-medium text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Access Module <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 4 */}
            <div className="group cursor-default">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <LineChart className="w-24 h-24 text-emerald-500 transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <LineChart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-500 transition-colors">Market Intelligence</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Real-time market data aggregation and sentiment analysis from global sources.
                  </p>
                  <div className="flex items-center text-xs font-medium text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Active <Activity className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Module 5 */}
            <div className="group cursor-default">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers className="w-24 h-24 text-cyan-500 transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-500 transition-colors">Strategy Builder</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Create and backtest custom investment strategies using historical market data.
                  </p>
                  <div className="flex items-center text-xs font-medium text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Active <Activity className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Module 6 */}
            <div className="group cursor-default">
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield className="w-24 h-24 text-rose-500 transform rotate-12 translate-x-8 -translate-y-8" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-rose-500 transition-colors">Security Monitor</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Continuous monitoring of portfolio health and exposure to high-risk assets.
                  </p>
                  <div className="flex items-center text-xs font-medium text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Active <Activity className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
