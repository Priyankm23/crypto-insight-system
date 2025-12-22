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
import { BarChart3, Target, TrendingUp, Zap, Sparkles, ArrowRight, Activity, Shield, AlertTriangle, Info } from "lucide-react"

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Welcome Back</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Hello, {user?.name}!
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
                Track, analyze, and optimize your crypto portfolio with advanced AI-powered insights and real-time market data.
              </p>
              <div className="flex flex-wrap gap-4">
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

            {/* Right Side - 3D Blockchain Visualization */}
            <div className="relative hidden lg:flex items-center justify-center h-96">
              <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                {/* Background Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Blockchain Chain - 5 Connected Blocks */}
                <div className="relative flex items-center gap-4">
                  {/* Block 1 - Bitcoin */}
                  <div className="animate-block-float" style={{ animationDelay: '0s' }}>
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-600 rounded-lg shadow-2xl transform rotate-45 hover:rotate-12 transition-all duration-500 border-2 border-orange-300/30">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-lg" />
                        <div className="absolute inset-2 border border-orange-200/20 rounded" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/95 rounded-full transform -rotate-45 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" fill="#F7931A"/>
                            <path d="M17.13 11.3c.225-1.506-.923-2.316-2.49-2.856l.51-2.04-1.242-.31-.496 1.987c-.327-.08-.662-.158-.996-.234l.5-2.003-1.24-.31-.51 2.038c-.27-.062-.535-.123-.792-.187l.002-.008-1.714-.428-.33 1.324s.923.212.903.224c.503.126.594.457.578.72l-.58 2.327c.035.008.08.02.13.04l-.132-.033-.812 3.256c-.062.153-.217.382-.567.295.013.018-.904-.225-.904-.225l-.617 1.418 1.615.403c.3.075.594.154.883.23l-.515 2.07 1.24.31.51-2.042c.338.092.667.177.99.257l-.508 2.035 1.243.31.515-2.067c2.122.4 3.715.24 4.385-1.67.54-1.54-.027-2.427-1.14-3.006.812-.187 1.422-.72 1.585-1.822zm-2.835 3.976c-.384 1.543-2.98.71-3.82.5l.683-2.733c.84.21 3.55.625 3.137 2.233zm.384-4.003c-.35 1.404-2.5.69-3.198.515l.618-2.48c.697.174 2.944.5 2.58 1.965z" fill="#fff"/>
                          </svg>
                        </div>
                      </div>
                      {/* Connection Line */}
                      <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-orange-400 to-blue-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Block 2 - Ethereum */}
                  <div className="animate-block-float" style={{ animationDelay: '0.2s' }}>
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg shadow-2xl transform rotate-45 hover:rotate-12 transition-all duration-500 border-2 border-indigo-300/30">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-lg" />
                        <div className="absolute inset-2 border border-indigo-200/20 rounded" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/95 rounded-full transform -rotate-45 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" fill="#627EEA"/>
                          </svg>
                        </div>
                      </div>
                      {/* Connection Line */}
                      <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>

                  {/* Block 3 - Center/Highlighted */}
                  <div className="animate-block-float" style={{ animationDelay: '0.4s' }}>
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 rounded-lg shadow-2xl transform rotate-45 hover:rotate-12 transition-all duration-500 border-2 border-purple-300/40 ring-4 ring-purple-400/20">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent rounded-lg" />
                        <div className="absolute inset-2 border-2 border-purple-200/30 rounded" />
                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg blur-sm animate-pulse" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/95 rounded transform -rotate-45 flex items-center justify-center shadow-xl">
                          <Activity className="w-5 h-5 text-purple-600 animate-pulse" />
                        </div>
                      </div>
                      {/* Connection Line */}
                      <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>

                  {/* Block 4 - Cardano */}
                  <div className="animate-block-float" style={{ animationDelay: '0.6s' }}>
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg shadow-2xl transform rotate-45 hover:rotate-12 transition-all duration-500 border-2 border-blue-300/30">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-lg" />
                        <div className="absolute inset-2 border border-blue-200/20 rounded" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/95 rounded-full transform -rotate-45 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.34 16.46c-.21.35-.56.63-.98.78-.42.15-.89.18-1.32.08-.86-.2-1.53-.85-1.73-1.71-.1-.43-.07-.89.08-1.31.15-.42.43-.77.78-.98.35-.21.76-.32 1.18-.32s.83.11 1.18.32c.35.21.63.56.78.98.15.42.18.88.08 1.31-.1.43-.35.82-.65 1.15-.3.33-.68.55-1.1.65.42-.1.8-.32 1.1-.65.3-.33.55-.72.65-1.15.1-.43.07-.89-.08-1.31-.15-.42-.43-.77-.78-.98-.35-.21-.76-.32-1.18-.32s-.83.11-1.18.32c-.35.21-.63.56-.78.98-.15.42-.18.88-.08 1.31.2.86.87 1.51 1.73 1.71.43.1.9.07 1.32-.08.42-.15.77-.43.98-.78z" fill="#0033AD"/>
                            <circle cx="12" cy="8.5" r="1.5" fill="#0033AD"/>
                            <circle cx="8" cy="12" r="1.3" fill="#0033AD"/>
                            <circle cx="16" cy="12" r="1.3" fill="#0033AD"/>
                          </svg>
                        </div>
                      </div>
                      {/* Connection Line */}
                      <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                  </div>

                  {/* Block 5 - Solana */}
                  <div className="animate-block-float" style={{ animationDelay: '0.8s' }}>
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-fuchsia-600 rounded-lg shadow-2xl transform rotate-45 hover:rotate-12 transition-all duration-500 border-2 border-purple-300/30">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-lg" />
                        <div className="absolute inset-2 border border-purple-200/20 rounded" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/95 rounded-full transform -rotate-45 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M5.08 17.93c.15-.15.36-.24.58-.24h16.1c.39 0 .59.47.31.75l-3.68 3.68c-.15.15-.36.24-.58.24H1.71c-.39 0-.59-.47-.31-.75l3.68-3.68zm0-13.61L8.76.64c.15-.15.36-.24.58-.24h16.1c.39 0 .59.47.31.75l-3.68 3.68c-.15.15-.36.24-.58.24H5.39c-.39 0-.59-.47-.31-.75zm3.68 6.54c.15-.15.36-.24.58-.24h16.1c.39 0 .59.47.31.75l-3.68 3.68c-.15.15-.36.24-.58.24H5.39c-.39 0-.59-.47-.31-.75l3.68-3.68z" fill="url(#solana-gradient)"/>
                            <defs>
                              <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#9945FF"/>
                                <stop offset="100%" stopColor="#14F195"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Data Particles */}
                <div className="absolute top-12 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute top-24 right-16 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-16 left-24 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '2.8s', animationDelay: '1.5s' }} />
                
                {/* Orbiting Data Stream */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                  <div className="absolute top-4 left-1/2 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-8 left-1/2 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-lg" />
                </div>

                {/* Blockchain Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-foreground/80">Blockchain Network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add custom animation styles */}
        <style jsx>{`
          @keyframes block-float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-12px);
            }
          }
          .animate-block-float {
            animation: block-float 3s ease-in-out infinite;
          }
          .perspective-1000 {
            perspective: 1000px;
          }
        `}</style>
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
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left side - Icon and title */}
                <div className="flex-shrink-0 lg:w-64">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 shadow-lg mb-4">
                    <AlertTriangle className="w-16 h-16 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-500 mb-1">
                      Important
                    </h2>
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      Disclaimer
                    </h3>
                    <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
                
                {/* Right side - Content */}
                <div className="flex-1">
                  <div className="bg-card/50 rounded-xl p-6 border border-amber-500/20 backdrop-blur-sm mb-4">
                    <p className="text-lg font-semibold text-foreground leading-relaxed">
                      This platform performs <span className="text-amber-600 dark:text-amber-500 font-bold">real calculations</span> on your portfolio data, but results should <span className="text-amber-600 dark:text-amber-500 font-bold">not be trusted 100%</span> as they do not account for external factors affecting each asset's market behavior.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group p-4 rounded-lg bg-card/30 border border-border/50 hover:border-amber-500/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-amber-500/20">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Calculations are <strong className="text-foreground">based on historical data</strong> and technical indicators only
                        </p>
                      </div>
                    </div>
                    
                    <div className="group p-4 rounded-lg bg-card/30 border border-border/50 hover:border-orange-500/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-orange-500/20">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Does <strong className="text-foreground">not account for</strong> news, regulations, or market sentiment
                        </p>
                      </div>
                    </div>
                    
                    <div className="group p-4 rounded-lg bg-card/30 border border-border/50 hover:border-red-500/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-red-500/20">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Should <strong className="text-foreground">not be used</strong> as the sole basis for investment decisions
                        </p>
                      </div>
                    </div>
                    
                    <div className="group p-4 rounded-lg bg-card/30 border border-border/50 hover:border-amber-500/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 rounded-full bg-amber-500/20">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Always <strong className="text-foreground">consult licensed advisors</strong> before making investments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Explanation */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Platform Features</h2>
            <p className="text-muted-foreground text-lg">Comprehensive tools for crypto portfolio analysis</p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
            {/* Portfolio Analysis - Large Featured Card */}
            <div className="lg:col-span-2 lg:row-span-2 group relative">
              <Card className="h-full border-border/50 bg-gradient-to-br from-blue-500/5 via-card/50 to-cyan-500/5 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="relative p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-500">
                      Featured
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Portfolio Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    Upload your portfolio data and get comprehensive risk analysis, investment strategies, and performance metrics. Advanced algorithms analyze your holdings and provide actionable insights.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
                      Risk Analysis
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                      Performance
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
                      Strategies
                    </span>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Risk Metrics */}
            <div className="group relative">
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 inline-block group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Risk Metrics</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Monitor volatility, drawdown, Sharpe ratio, and other key metrics.
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Market Insights */}
            <div className="group relative">
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 inline-block group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Market Insights</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Track real-time market data, price trends, and latest crypto news.
                  </p>
                </div>
              </Card>
            </div>
            
            {/* AI Predictions - Medium Card */}
            <div className="lg:col-span-2 group relative">
              <Card className="h-full border-border/50 bg-gradient-to-br from-orange-500/5 via-card/50 to-red-500/5 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500" />
                <div className="relative p-6 h-full flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Zap className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">AI Predictions</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Get AI-powered price predictions and trend forecasts to help inform your investment strategy with machine learning models.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Stress Testing */}
            <div className="group relative">
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 inline-block group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-indigo-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Stress Testing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Simulate portfolio performance under different market conditions.
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Investment Insights */}
            <div className="group relative">
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500" />
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 inline-block group-hover:scale-110 transition-transform duration-300">
                      <Info className="w-6 h-6 text-teal-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Investment Insights</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Receive actionable insights and recommendations to optimize allocation.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
