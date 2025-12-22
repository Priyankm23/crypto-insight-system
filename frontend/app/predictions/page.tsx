"use client"

import { useState } from "react"
import { NavHeader } from "@/components/dashboard/nav-header"
import { FileUpload } from "@/components/portfolio/file-upload"
import { PredictionChart } from "@/components/predictions/prediction-chart"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Zap, Sparkles, Target, TrendingUp, Activity, Shield } from "lucide-react"

export default function PredictionsPage() {
  const [files, setFiles] = useState<File[]>([])
  const [prediction, setPrediction] = useState<{
    predicted_value: number
    confidence_interval: [number, number]
    next_period: string
    r2_score?: number
    rmse?: number
    mae?: number
    mape?: number
    model_order?: [number, number, number]
    training_size?: number
    validation_size?: number
    aic?: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePredict = async () => {
    setIsLoading(true)
    try {
      const result = await api.predictions.predict(files.length > 0 ? files : undefined)
      setPrediction(result)

      toast({
        title: "Prediction generated",
        description: "Price forecast has been calculated successfully",
      })
    } catch (error) {
      toast({
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "Failed to generate prediction",
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
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">AI Predictions</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Price Forecasting
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Advanced ARIMA-based price prediction with comprehensive model validation and accuracy metrics.
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
                    <CardTitle>Upload Data</CardTitle>
                    <CardDescription className="mt-1">Upload new CSV files or use previously uploaded data</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <FileUpload files={files} onFilesChange={setFiles} />
                </CardContent>
              </Card>
            </div>

            {/* Predict Section */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-l-lg" />
              <Card className="border-l-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg ml-1">
                <CardHeader className="border-b border-border/30 py-4">
                  <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Generate Prediction
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-1">Run AI model to forecast future prices</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handlePredict} 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isLoading ? "Predicting..." : "Generate Prediction"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {prediction ? (
              <>
                {/* Prediction Summary Card */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Prediction Summary
                          </h3>
                          <CardDescription className="mt-1">Forecast for {prediction.next_period}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          Next Period
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Predicted Value</p>
                        <p className="text-3xl font-bold text-primary mb-1">${prediction.predicted_value.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Expected price for next period</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Lower Bound (95%)</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">${prediction.confidence_interval[0].toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Minimum expected price</p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Upper Bound (95%)</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">${prediction.confidence_interval[1].toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Maximum expected price</p>
                      </div>
                    </div>
                    
                    {/* Price Range Info */}
                    <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Confidence Interval</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            There is a 95% probability that the actual price will fall between ${prediction.confidence_interval[0].toFixed(2)} and ${prediction.confidence_interval[1].toFixed(2)}. 
                            Range: ±${((prediction.confidence_interval[1] - prediction.confidence_interval[0]) / 2).toFixed(2)} ({(((prediction.confidence_interval[1] - prediction.confidence_interval[0]) / 2 / prediction.predicted_value) * 100).toFixed(1)}% of predicted value)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prediction Chart */}
                <PredictionChart
                  predictedValue={prediction.predicted_value}
                  confidenceInterval={prediction.confidence_interval}
                  nextPeriod={prediction.next_period}
                />

                {/* Model Accuracy Metrics */}
                {(prediction.r2_score !== undefined || prediction.rmse !== undefined) && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/30 py-4">
                      <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              Model Accuracy Metrics
                            </h3>
                            <CardDescription className="mt-1">Validation results from test data</CardDescription>
                          </div>
                          <Badge variant="outline">
                            ARIMA({prediction.model_order?.join(',')})
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Performance Interpretation */}
                      {prediction.r2_score !== undefined && (
                        <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/30">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">Model Performance Assessment</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {prediction.r2_score >= 0.7 ? (
                                  <span className="text-green-600 dark:text-green-400 font-medium">Strong model fit</span>
                                ) : prediction.r2_score >= 0.4 ? (
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">Moderate model fit</span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400 font-medium">Weak model fit</span>
                                )} - The R² score of {prediction.r2_score.toFixed(4)} indicates {prediction.r2_score >= 0.7 ? 'the model explains most price variations well' : prediction.r2_score >= 0.4 ? 'the model captures some trends but has room for improvement' : 'predictions should be used with caution'}. 
                                {prediction.mape !== undefined && ` Average prediction error is ${prediction.mape.toFixed(2)}%.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {prediction.r2_score !== undefined && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-blue-500" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">R² Score</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prediction.r2_score.toFixed(4)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {prediction.r2_score >= 0.7 ? 'Excellent' : prediction.r2_score >= 0.4 ? 'Fair' : 'Poor'} (0-1 scale)
                            </p>
                          </div>
                        )}
                        
                        {prediction.rmse !== undefined && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-purple-500" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RMSE</p>
                            </div>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{prediction.rmse.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
                          </div>
                        )}
                        
                        {prediction.mae !== undefined && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">MAE</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{prediction.mae.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Avg error magnitude</p>
                          </div>
                        )}
                        
                        {prediction.mape !== undefined && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-orange-500" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">MAPE</p>
                            </div>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{prediction.mape.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {prediction.mape < 10 ? 'Excellent' : prediction.mape < 20 ? 'Good' : 'Needs improvement'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Model Info */}
                      {(prediction.training_size || prediction.aic) && (
                        <div className="mt-6 pt-6 border-t border-border/30">
                          <h4 className="text-sm font-semibold mb-4">Model Configuration</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {prediction.model_order && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-muted-foreground mb-1">ARIMA Order</p>
                                <p className="font-semibold">({prediction.model_order.join(', ')})</p>
                                <p className="text-xs text-muted-foreground mt-1">(p, d, q)</p>
                              </div>
                            )}
                            {prediction.training_size !== undefined && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-muted-foreground mb-1">Training Size</p>
                                <p className="font-semibold">{prediction.training_size}</p>
                                <p className="text-xs text-muted-foreground mt-1">data points</p>
                              </div>
                            )}
                            {prediction.validation_size !== undefined && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-muted-foreground mb-1">Validation Size</p>
                                <p className="font-semibold">{prediction.validation_size}</p>
                                <p className="text-xs text-muted-foreground mt-1">data points</p>
                              </div>
                            )}
                            {prediction.aic !== undefined && (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-muted-foreground mb-1">AIC Score</p>
                                <p className="font-semibold">{prediction.aic}</p>
                                <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Explanation of metrics */}
                          <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/20">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              <span className="font-medium text-foreground">Metric Guide:</span> R² measures how well the model explains price variations (closer to 1 is better). 
                              RMSE and MAE measure average prediction errors. MAPE shows percentage error (under 10% is excellent). 
                              AIC (Akaike Information Criterion) evaluates model quality considering complexity—selected from multiple configurations to find the best fit.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-dashed border-2 border-border/50 bg-muted/20">
                <CardContent className="text-center py-16">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-lg font-medium mb-2">No prediction yet</p>
                  <p className="text-muted-foreground">Upload data and generate a prediction to see AI-powered forecasts</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
