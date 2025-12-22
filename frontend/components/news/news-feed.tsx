"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCryptoNews, type NewsArticle } from "@/lib/news-api"
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  const categories = ["Bitcoin", "DeFi", "NFT", "Regulation"]

  const fetchNews = async () => {
    setIsLoading(true)
    const articles = await getCryptoNews(selectedCategory)
    setNews(articles)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  return (
    <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/30 py-4">
        <div className="bg-gradient-to-r from-primary/8 via-accent/4 to-background rounded-lg px-4 py-3 -mx-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Market Buzz</h3>
              </div>
              <CardDescription className="mt-1">Latest crypto news and market updates</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchNews} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {isLoading
            ? [...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />)
            : news.map((article, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{article.title}</h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
