"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Shield,
  ArrowRight,
  AlertTriangle,
  Brain,
  Sparkles,
  LineChart,
  PieChart,
  Activity,
  Lock,
  FileText,
  TrendingDown,
  DollarSign
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                CryptoInsight
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 max-w-7xl relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Crypto Analytics
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight">
              Master Your Crypto Portfolio with Intelligent Insights
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
              Make data-driven investment decisions with real-time market analysis, AI-powered predictions, 
              and advanced risk assessment tools designed for serious crypto investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Start Analyzing Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Explore Features
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Analysis Metrics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">Real-Time</div>
                <div className="text-sm text-muted-foreground">Market Data</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">AI-Powered</div>
                <div className="text-sm text-muted-foreground">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Card */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <Alert className="border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="ml-2">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Important Investment Disclaimer</p>
              <p className="text-sm text-muted-foreground">
                All calculations and predictions provided by CryptoInsight are based on historical data and mathematical models. 
                While our analysis is mathematically accurate, it <strong>does not account for external market factors</strong> such as 
                regulatory changes, global economic events, market sentiment, or sudden news that can significantly impact cryptocurrency prices. 
                Past performance does not guarantee future results. This platform is for informational and educational purposes only and should 
                not be considered as financial advice. Always conduct your own research and consult with financial advisors before making investment decisions.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </section>

      {/* Dashboard Features Preview */}
      <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Target className="w-3 h-3 mr-1" />
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed to give you an edge in the crypto market
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Core</Badge>
              </div>
              <CardTitle className="text-xl">Portfolio Analysis</CardTitle>
              <CardDescription>
                Upload your transaction history and get comprehensive portfolio insights with asset allocation breakdowns and performance tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6 text-purple-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Core</Badge>
              </div>
              <CardTitle className="text-xl">Real-Time Market Data</CardTitle>
              <CardDescription>
                Access live cryptocurrency prices, market caps, volume data, and trends for thousands of digital assets updated in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-amber-500" />
                </div>
                <Badge className="text-xs bg-gradient-to-r from-primary to-primary/80">AI</Badge>
              </div>
              <CardTitle className="text-xl">AI Price Predictions</CardTitle>
              <CardDescription>
                Machine learning algorithms analyze historical patterns to forecast future price movements with confidence intervals and risk assessments.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Advanced</Badge>
              </div>
              <CardTitle className="text-xl">Investment Strategies</CardTitle>
              <CardDescription>
                Optimize your portfolio with AI-driven investment strategies including risk parity, momentum trading, and mean reversion approaches.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Advanced</Badge>
              </div>
              <CardTitle className="text-xl">Risk Assessment</CardTitle>
              <CardDescription>
                Calculate VaR (Value at Risk), Sharpe Ratio, volatility metrics, and maximum drawdown to understand and manage your portfolio risk exposure.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-indigo-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Core</Badge>
              </div>
              <CardTitle className="text-xl">Performance Metrics</CardTitle>
              <CardDescription>
                Track detailed performance metrics including total returns, daily changes, correlation analysis, and asset-specific KPIs over time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* In-Depth Feature Explanation */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border-y border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A deep dive into the technology and methodology behind CryptoInsight
            </p>
          </div>

          <div className="space-y-16">
            {/* Detail 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <PieChart className="w-3 h-3 mr-1" />
                  Portfolio Intelligence
                </Badge>
                <h3 className="text-3xl font-bold mb-4">Comprehensive Portfolio Analytics</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Upload your transaction history in CSV format, and our system automatically processes your trades, 
                  calculates your current holdings, and generates detailed analytics. We track cost basis, unrealized 
                  gains/losses, and provide visual breakdowns of your asset allocation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Automatic Transaction Processing:</strong>
                      <span className="text-muted-foreground"> Parse and categorize all your buy, sell, and transfer transactions</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Real-Time Valuation:</strong>
                      <span className="text-muted-foreground"> Current market prices applied to calculate portfolio value</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Performance Tracking:</strong>
                      <span className="text-muted-foreground"> Monitor your gains/losses across different time periods</span>
                    </div>
                  </li>
                </ul>
              </div>
              <Card className="border-2 border-primary/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Total Value</div>
                          <div className="text-2xl font-bold">$125,847</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.4%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">24h Change</div>
                        <div className="text-lg font-semibold text-green-600">+$3,247</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Total Gain</div>
                        <div className="text-lg font-semibold">+$28,912</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="border-2 border-primary/20 shadow-2xl md:order-1 order-2">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      <div>
                        <div className="text-sm text-muted-foreground">Next 7 Days</div>
                        <div className="text-2xl font-bold">BTC Prediction</div>
                      </div>
                      <Brain className="w-10 h-10 text-purple-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Predicted Price</div>
                        <div className="text-lg font-semibold">$48,230</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                        <div className="text-lg font-semibold text-green-600">78%</div>
                      </div>
                    </div>
                    <Badge className="w-full justify-center py-2 bg-amber-500/20 text-amber-600 border-amber-500/30">
                      <Zap className="w-3 h-3 mr-1" />
                      Model: LSTM Neural Network
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="md:order-2 order-1">
                <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Technology
                </Badge>
                <h3 className="text-3xl font-bold mb-4">Machine Learning Price Predictions</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Our advanced LSTM (Long Short-Term Memory) neural networks analyze historical price patterns, volume trends, 
                  and technical indicators to forecast future price movements. The AI model is trained on years of market data 
                  and continuously learns from new patterns.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Multi-Factor Analysis:</strong>
                      <span className="text-muted-foreground"> Considers price, volume, volatility, and momentum indicators</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Confidence Scoring:</strong>
                      <span className="text-muted-foreground"> Every prediction includes a confidence level based on model certainty</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Risk Ranges:</strong>
                      <span className="text-muted-foreground"> Provides best/worst case scenarios for informed decision-making</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Detail 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Risk Management
                </Badge>
                <h3 className="text-3xl font-bold mb-4">Advanced Risk Assessment Tools</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Understanding risk is crucial for successful investing. We calculate industry-standard risk metrics including 
                  Value at Risk (VaR), Sharpe Ratio, volatility measures, and maximum drawdown to help you quantify and manage 
                  your portfolio risk exposure effectively.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Value at Risk (VaR):</strong>
                      <span className="text-muted-foreground"> Maximum expected loss over a given period with 95% confidence</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Sharpe Ratio:</strong>
                      <span className="text-muted-foreground"> Measures risk-adjusted returns to evaluate portfolio efficiency</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/20 mt-1">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <strong className="text-foreground">Volatility Tracking:</strong>
                      <span className="text-muted-foreground"> Monitor price swings and portfolio stability over time</span>
                    </div>
                  </li>
                </ul>
              </div>
              <Card className="border-2 border-primary/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10">
                      <div>
                        <div className="text-sm text-muted-foreground">Risk Level</div>
                        <div className="text-2xl font-bold">Moderate</div>
                      </div>
                      <Shield className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                          <span className="text-sm font-semibold">1.85</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[70%]" />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Max Drawdown</span>
                          <span className="text-sm font-semibold text-red-600">-18.3%</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 w-[35%]" />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Volatility (30d)</span>
                          <span className="text-sm font-semibold">42.7%</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[50%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-7xl">
        <Card className="border-2 border-primary/50 shadow-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Take Control of Your Crypto Investments?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join CryptoInsight today and start making smarter, data-driven investment decisions with our powerful analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6">
                  <Lock className="w-5 h-5 mr-2" />
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">CryptoInsight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CryptoInsight. All rights reserved. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
