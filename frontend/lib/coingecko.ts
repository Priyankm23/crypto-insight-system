// CoinGecko API integration for live market data

export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  sparkline_in_7d?: {
    price: number[]
  }
}

export async function getTopCryptos(limit = 10): Promise<CryptoAsset[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch crypto data")
    }

    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching crypto data:", error)
    return []
  }
}
