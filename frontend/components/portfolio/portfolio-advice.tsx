"use client"

import { Lightbulb } from "lucide-react"

const adviceItems = [
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
]

export function PortfolioAdvice() {
  return (
    <div className="relative overflow-hidden border-y border-border/40 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 backdrop-blur-sm">
      <div className="flex animate-scroll py-3 gap-0">
        {[...adviceItems, ...adviceItems, ...adviceItems].map((advice, index) => (
          <div
            key={`${advice}-${index}`}
            className="flex items-center gap-3 px-8 border-r border-border/30 whitespace-nowrap flex-shrink-0"
          >
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm text-foreground">{advice}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
