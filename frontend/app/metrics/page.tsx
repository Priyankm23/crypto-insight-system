"use client"

import { useState, useEffect, useRef } from "react"
import { NavHeader } from "@/components/dashboard/nav-header"
import { FileUpload } from "@/components/portfolio/file-upload"
import { MetricsGrid } from "@/components/metrics/metrics-grid"
import { MetricsHistory } from "@/components/metrics/metrics-history"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Calculator, TrendingUp } from "lucide-react"

export default function MetricsPage() {
  const [files, setFiles] = useState<File[]>([])
  const [metrics, setMetrics] = useState<{
    metrics: Record<string, any[]>
    stored_count: number
  } | null>(null)
  const [history, setHistory] = useState<Array<{ name: string; value: number; timestamp: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load persisted results from localStorage
    const savedMetrics = localStorage.getItem('metricsResult')
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics))
      } catch (error) {
        console.debug("Could not load saved metrics:", error)
      }
    }

    const fetchHistory = async () => {
      try {
        const data = await api.metrics.list()
        setHistory(data)
      } catch (error) {
        // Silently handle - history endpoint may not be available yet
        console.debug("Metrics history not available:", error)
        setHistory([])
      }
    }

    fetchHistory()
  }, [])

  const handleCalculate = async () => {
    setIsLoading(true)
    try {
      const result = await api.metrics.calculate(files.length > 0 ? files : undefined)
      setMetrics(result)
      localStorage.setItem('metricsResult', JSON.stringify(result))

      // Refresh history (handle errors gracefully)
      try {
        const data = await api.metrics.list()
        setHistory(data)
      } catch (err) {
        console.debug("Could not refresh history:", err)
      }

      toast({
        title: "Metrics calculated",
        description: "Technical metrics have been computed successfully",
      })

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "Failed to calculate metrics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Clear results when new files are uploaded
  useEffect(() => {
    if (files.length > 0) {
      setMetrics(null)
      localStorage.removeItem('metricsResult')
    }
  }, [files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Analytics</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Technical Metrics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Calculate and analyze comprehensive technical indicators and portfolio metrics to make data-driven investment decisions.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-10">
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Section */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-l-lg" />
              <Card className="border-l-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg ml-1">
                <CardHeader className="border-b border-border/30 py-4">
                  <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Upload Data</CardTitle>
                    </div>
                    <CardDescription className="mt-1">Upload new CSV files or use previously uploaded data</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>
            </div>

            {/* Calculate Section */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-l-lg" />
              <Card className="border-l-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg ml-1">
                <CardHeader className="border-b border-border/30 py-4">
                  <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Calculate Metrics
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-1">Compute technical indicators and portfolio metrics</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handleCalculate} 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isLoading ? "Calculating..." : "Calculate Metrics"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-7" ref={resultsRef}>
            {/* Results */}
            {metrics && <MetricsGrid metrics={metrics} />}
            
            {/* History Section Below Results */}
            <div className="mt-8">
              <MetricsHistory history={history} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
