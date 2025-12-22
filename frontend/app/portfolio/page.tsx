"use client"

import { useState, useEffect, useRef } from "react"
import { NavHeader } from "@/components/dashboard/nav-header"
import { FileUpload } from "@/components/portfolio/file-upload"
import { RiskMetrics } from "@/components/portfolio/risk-metrics"
import { StrategyResults } from "@/components/portfolio/strategy-results"
import { PortfolioAdvice } from "@/components/portfolio/portfolio-advice"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Shield, Target, TrendingUp, Activity, Sparkles, Lightbulb } from "lucide-react"

export default function PortfolioPage() {
  const [files, setFiles] = useState<File[]>([])
  const [selectedRule, setSelectedRule] = useState("moving_average_crossover")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [strategyResult, setStrategyResult] = useState<any>(null)
  const [riskResult, setRiskResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const analysisResultsRef = useRef<HTMLDivElement>(null)
  const strategyResultsRef = useRef<HTMLDivElement>(null)
  const riskResultsRef = useRef<HTMLDivElement>(null)

  // Load persisted results on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('analysisResult')
    const savedStrategy = localStorage.getItem('strategyResult')
    const savedRisk = localStorage.getItem('riskResult')
    const savedRule = localStorage.getItem('selectedRule')

    if (savedAnalysis) {
      try {
        setAnalysisResult(JSON.parse(savedAnalysis))
      } catch (error) {
        console.debug("Could not load saved analysis:", error)
      }
    }
    if (savedStrategy) {
      try {
        setStrategyResult(JSON.parse(savedStrategy))
      } catch (error) {
        console.debug("Could not load saved strategy:", error)
      }
    }
    if (savedRisk) {
      try {
        setRiskResult(JSON.parse(savedRisk))
      } catch (error) {
        console.debug("Could not load saved risk:", error)
      }
    }
    if (savedRule) {
      setSelectedRule(savedRule)
    }
  }, [])

  // Clear results when new files are uploaded
  useEffect(() => {
    if (files.length > 0) {
      setAnalysisResult(null)
      setStrategyResult(null)
      setRiskResult(null)
      localStorage.removeItem('analysisResult')
      localStorage.removeItem('strategyResult')
      localStorage.removeItem('riskResult')
    }
  }, [files])

  const handleAnalysis = async () => {
    setIsLoading(true)
    try {
      const result = await api.portfolio.analysis(selectedRule, files.length > 0 ? files : undefined)
      setAnalysisResult(result)
      localStorage.setItem('analysisResult', JSON.stringify(result))
      localStorage.setItem('selectedRule', selectedRule)
      
      toast({
        title: "Analysis complete",
        description: "Portfolio analysis has been generated successfully",
      })

      // Auto-scroll to results
      setTimeout(() => {
        analysisResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze portfolio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStrategy = async () => {
    setIsLoading(true)
    try {
      const result = await api.portfolio.investmentStrategy(files.length > 0 ? files : undefined)
      setStrategyResult(result)
      localStorage.setItem('strategyResult', JSON.stringify(result))
      
      toast({
        title: "Strategy calculated",
        description: "Investment strategy results are ready",
      })

      // Auto-scroll to results
      setTimeout(() => {
        strategyResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      toast({
        title: "Strategy calculation failed",
        description: error instanceof Error ? error.message : "Failed to calculate strategy",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRiskCheck = async () => {
    setIsLoading(true)
    try {
      const result = await api.portfolio.riskCheck(files.length > 0 ? files : undefined)
      setRiskResult(result)
      localStorage.setItem('riskResult', JSON.stringify(result))
      
      toast({
        title: "Risk assessment complete",
        description: "Portfolio risk metrics have been calculated",
      })

      // Auto-scroll to results
      setTimeout(() => {
        riskResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      toast({
        title: "Risk check failed",
        description: error instanceof Error ? error.message : "Failed to check risk",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl relative">
          <div className="flex items-start gap-8">
            <div className="flex-1 max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Portfolio</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Portfolio Analysis
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Advanced analytics and risk assessment for your crypto portfolio with comprehensive strategy insights.
              </p>
            </div>
            
            {/* Vertical Scrolling Advice */}
            <div className="hidden lg:block w-96 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Portfolio Tips</h3>
              </div>
              <div className="relative h-[200px] overflow-hidden rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-4">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-card/30 to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/30 to-transparent z-10 pointer-events-none" />
                <div className="animate-scroll-vertical space-y-3">
                  {[
                    "Diversification is key - Don't put all your eggs in one basket",
                    "Dollar-cost averaging helps reduce volatility impact",
                    "Set stop-loss orders to protect your investments",
                    "Only invest what you can afford to lose in crypto",
                    "Research thoroughly before investing in any asset",
                    "Keep emotions out of trading decisions",
                    "Rebalance your portfolio regularly to maintain target allocations",
                    "Consider tax implications of your trades",
                    "Use hardware wallets for long-term holdings",
                    "Stay updated with market news and regulations",
                    "Track your portfolio performance consistently",
                    "Set realistic profit targets and stick to them",
                    "Diversification is key - Don't put all your eggs in one basket",
                    "Dollar-cost averaging helps reduce volatility impact",
                    "Set stop-loss orders to protect your investments",
                    "Only invest what you can afford to lose in crypto",
                    "Research thoroughly before investing in any asset",
                    "Keep emotions out of trading decisions",
                  ].map((advice, index) => (
                    <div key={index} className="p-3 rounded-md bg-muted/20 border border-border/30">
                      <span className="text-sm text-foreground leading-relaxed">{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">

        <Tabs defaultValue="analysis" className="space-y-8">
          <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-12 bg-muted/50">
              <TabsTrigger value="analysis" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="strategy" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Strategy
              </TabsTrigger>
              <TabsTrigger value="risk" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Risk Check
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analysis" className="space-y-6 mt-0">
            <div className="grid gap-8 lg:grid-cols-10">
              <div className="lg:col-span-3 space-y-6">
                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">Upload Data</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Upload CSV files to analyze your portfolio</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload files={files} onFilesChange={setFiles} />
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-accent" />
                          <h3 className="text-lg font-semibold">Select Analysis Rule</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Choose among the following to select the Analysis Base</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Analysis Rule</Label>
                      <Select value={selectedRule} onValueChange={setSelectedRule}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="InvVol">Involatility Based</SelectItem>
                          <SelectItem value="Price">Price Based</SelectItem>
                          <SelectItem value="Equal">Equality Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleAnalysis} 
                      disabled={isLoading} 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      size="lg"
                    >
                      {isLoading ? "Analyzing..." : "Run Analysis"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-7" ref={analysisResultsRef}>
                {analysisResult ? (
                  <div className="space-y-6">
                    {/* Main Chart - Larger Display */}
                    <Card className="border-border/50 shadow-lg overflow-hidden bg-card/50 backdrop-blur-sm">
                      <CardHeader className="border-b border-border/30 py-4">
                        <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">Portfolio Analysis Chart</h3>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="rounded-lg overflow-hidden border border-border/50 shadow-xl">
                          <img
                            src={`data:image/png;base64,${analysisResult.plot}`}
                            alt="Analysis Plot"
                            className="w-full h-auto"
                            style={{ minHeight: '500px' }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weights Display */}
                    {analysisResult.weights && Object.keys(analysisResult.weights).length > 0 && (
                      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-border/30 py-4">
                          <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-accent" />
                              <h3 className="text-lg font-semibold">Asset Allocation Weights</h3>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(analysisResult.weights).map(([asset, weight]) => {
                              const weightValue = typeof weight === 'number' ? weight : 0;
                              return (
                              <div key={asset} className="relative group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/10 to-transparent rounded-tr-lg" />
                                <Card className="relative border-border/50 bg-card/30 backdrop-blur-sm hover:border-accent/30 transition-all duration-300">
                                  <CardContent className="p-4">
                                    <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase">{asset}</div>
                                    <div className="text-2xl font-bold text-accent">{(weightValue * 100).toFixed(2)}%</div>
                                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                                        style={{ width: `${weightValue * 100}%` }}
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )})}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Comparison Data */}
                    {analysisResult.comparison_data && Object.keys(analysisResult.comparison_data).length > 0 && (
                      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-border/30 py-4">
                          <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                            <div className="flex items-center gap-2">
                              <Activity className="w-5 h-5 text-primary" />
                              <h3 className="text-lg font-semibold">Performance Comparison</h3>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            {Object.entries(analysisResult.comparison_data).map(([key, value]) => {
                              // Check if value is an object (nested data)
                              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                const values = Object.values(value).filter(v => typeof v === 'number') as number[];
                                if (values.length === 0) return null;
                                
                                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                                const max = Math.max(...values);
                                const min = Math.min(...values);
                                const isPositive = avg >= 0;
                                
                                return (
                                  <div key={key} className="border-l-4 border-primary/30 pl-4">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">{key.replace(/_/g, ' ')}</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                                        <CardContent className="p-3">
                                          <div className="text-xs text-muted-foreground mb-1">Average</div>
                                          <div className={`text-lg font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {avg.toFixed(4)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                                        <CardContent className="p-3">
                                          <div className="text-xs text-muted-foreground mb-1">Maximum</div>
                                          <div className="text-lg font-bold text-emerald-500">
                                            {max.toFixed(4)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                                        <CardContent className="p-3">
                                          <div className="text-xs text-muted-foreground mb-1">Minimum</div>
                                          <div className="text-lg font-bold text-red-500">
                                            {min.toFixed(4)}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                );
                              } else {
                                // Handle simple number values
                                const numValue = typeof value === 'number' ? value : parseFloat(String(value));
                                if (isNaN(numValue)) return null;
                                const isPositive = numValue >= 0;
                                
                                return (
                                  <div key={key} className="relative group">
                                    <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-lg" />
                                    <Card className="relative border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                                      <CardContent className="p-4">
                                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{key.replace(/_/g, ' ')}</div>
                                        <div className={`text-xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                          {numValue.toFixed(4)}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Insights */}
                    <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                      <CardHeader className="border-b border-border/30 py-4">
                        <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Strategy Insights</h3>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{analysisResult.insights}</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-border/50 bg-muted/20">
                    <CardContent className="text-center py-12">
                      <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium mb-2">Ready to Analyze</p>
                      <p className="text-muted-foreground">Upload your data and run analysis to see results</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6 mt-0">
            <div className="grid gap-8 lg:grid-cols-10">
              <div className="lg:col-span-3 space-y-6">
                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">Upload Data</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Upload CSV files for strategy calculation</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload files={files} onFilesChange={setFiles} />
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-accent" />
                          <h3 className="text-lg font-semibold">Calculate Strategy</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Generate investment strategy and asset allocation</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={handleStrategy} 
                      disabled={isLoading} 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      size="lg"
                    >
                      {isLoading ? "Calculating..." : "Calculate Strategy"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-7" ref={strategyResultsRef}>
                {strategyResult ? (
                  <StrategyResults
                    portfolioReturn={strategyResult.portfolio_return}
                    weights={strategyResult.weights}
                    stressTestResults={strategyResult.stress_test_results}
                    insights={strategyResult.insights}
                  />
                ) : (
                  <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-border/50 bg-muted/20">
                    <CardContent className="text-center py-12">
                      <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Target className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium mb-2">Ready to Calculate</p>
                      <p className="text-muted-foreground">Calculate strategy to see results and insights</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6 mt-0">
            <div className="grid gap-8 lg:grid-cols-10">
              <div className="lg:col-span-3 space-y-6">
                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">Upload Data</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Upload CSV files for risk assessment</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <FileUpload files={files} onFilesChange={setFiles} />
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-destructive" />
                          <h3 className="text-lg font-semibold">Risk Assessment</h3>
                        </div>
                      </div>
                      <CardDescription className="mt-1">Evaluate portfolio risk metrics and alerts</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={handleRiskCheck} 
                      disabled={isLoading} 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      size="lg"
                    >
                      {isLoading ? "Checking..." : "Check Risk"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-7" ref={riskResultsRef}>
                {riskResult ? (
                  <RiskMetrics metrics={riskResult.metrics} alertMessage={riskResult.alert_message} />
                ) : (
                  <Card className="h-full min-h-[500px] flex items-center justify-center border-dashed border-2 border-border/50 bg-muted/20">
                    <CardContent className="text-center py-12">
                      <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-destructive/20 to-amber-500/20 flex items-center justify-center">
                        <Shield className="w-10 h-10 text-destructive" />
                      </div>
                      <p className="text-lg font-medium mb-2">Ready for Assessment</p>
                      <p className="text-muted-foreground">Run risk check to see comprehensive metrics</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}
