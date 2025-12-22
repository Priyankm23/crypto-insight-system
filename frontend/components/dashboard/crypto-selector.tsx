"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const POPULAR_CRYPTOS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
]

export function CryptoSelector() {
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleCrypto = (cryptoId: string) => {
    setSelectedCryptos((prev) => (prev.includes(cryptoId) ? prev.filter((id) => id !== cryptoId) : [...prev, cryptoId]))
  }

  const handleFetchData = async () => {
    if (selectedCryptos.length === 0) {
      toast({
        title: "No cryptocurrencies selected",
        description: "Please select at least one cryptocurrency",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    toast({
      title: "Coming soon!",
      description: "Data fetching will be available once the backend endpoint is implemented",
    })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fetch Market Data</CardTitle>
        <CardDescription>Don&apos;t have your own data? Start with API data!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Cryptocurrencies</Label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CRYPTOS.map((crypto) => (
              <Button
                key={crypto.id}
                variant={selectedCryptos.includes(crypto.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCrypto(crypto.id)}
              >
                {crypto.symbol}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleFetchData} disabled={isLoading} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? "Fetching..." : "Fetch Data"}
        </Button>
      </CardContent>
    </Card>
  )
}
