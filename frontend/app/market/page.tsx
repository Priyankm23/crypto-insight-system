"use client"

import { NavHeader } from "@/components/dashboard/nav-header"
import { NewsFeed } from "@/components/news/news-feed"
import { DetailedChart } from "@/components/market/detailed-chart"
import { MarketSnapshot } from "@/components/dashboard/market-snapshot"
import { MarketStats } from "@/components/market/market-stats"
import { Footer } from "@/components/footer"
import { TrendingUp, Newspaper, BarChart3 } from "lucide-react"

export default function MarketPage() {
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
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Market</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Market Overview
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Real-time crypto market data, analysis, and latest news to keep you informed about market trends.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">

        {/* Market Stats Cards */}
        <div className="mb-8">
          <MarketStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <DetailedChart />
            <NewsFeed />
          </div>

          <div>
            <MarketSnapshot />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
