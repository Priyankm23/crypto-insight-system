// Crypto news API integration

export interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  urlToImage?: string
}

// Mock news data for demonstration - replace with actual API when available
const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
    description:
      "Major financial institutions continue to add Bitcoin to their balance sheets, driving price to unprecedented levels.",
    url: "https://example.com/bitcoin-ath",
    source: "CryptoNews",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Ethereum 2.0 Upgrade Shows Promising Results in Network Efficiency",
    description:
      "The latest Ethereum upgrade has significantly reduced transaction fees and improved network throughput.",
    url: "https://example.com/eth-upgrade",
    source: "BlockchainDaily",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "DeFi Protocol Sees Record Trading Volume in Q4",
    description: "Decentralized finance platforms continue to gain traction with retail and institutional investors.",
    url: "https://example.com/defi-record",
    source: "DeFi Insider",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Central Banks Explore Digital Currency Implementations",
    description: "Multiple countries announce pilot programs for central bank digital currencies (CBDCs).",
    url: "https://example.com/cbdc-pilot",
    source: "Financial Times",
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "NFT Market Shows Signs of Recovery After Recent Downturn",
    description: "Digital collectibles platform reports increased trading activity and user engagement.",
    url: "https://example.com/nft-recovery",
    source: "NFT Today",
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Regulatory Framework for Crypto Assets Gains Clarity in Major Markets",
    description: "New guidelines provide clearer path for cryptocurrency businesses to operate compliantly.",
    url: "https://example.com/crypto-regulation",
    source: "Reuters",
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    urlToImage: "/placeholder.svg?height=200&width=400",
  },
]

export async function getCryptoNews(category?: string): Promise<NewsArticle[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In production, replace with actual API call
  // Example: NewsAPI, CryptoControl, or backend proxy
  return MOCK_NEWS
}
