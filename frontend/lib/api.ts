// API client configuration and utilities

const API_BASE_URL ="http://127.0.0.1:8000"

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const headers: HeadersInit = {
    ...options.headers,
  }

  if (token && !endpoint.includes("/auth/")) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new APIError(response.status, error || response.statusText)
  }

  return response.json()
}

export const api = {
  auth: {
    signup: async (data: { name: string; email: string; password: string }) => {
      return apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    login: async (email: string, password: string) => {
      const formData = new FormData()
      formData.append("username", email)
      formData.append("password", password)

      return apiRequest<{ access_token: string; token_type: string }>("/auth/login", {
        method: "POST",
        body: formData,
      })
    },
  },
  dashboard: {
    getLatestInsights: async () => {
      return apiRequest<{
        metrics: Array<{ name: string; value: number; timestamp: string }>
        portfolio_analysis: Array<{ date: string; timestamp: string }>
        investment_strategy: Array<{
          result: { portfolio_return: number; weights: Record<string, number> }
          timestamp: string
        }>
        prediction: Array<{ result: { predicted_value: number; confidence: number }; timestamp: string }>
      }>("/metrics/dashboard/")
    },
  },
  metrics: {
    list: async () => {
      return apiRequest<Array<{ name: string; value: number; timestamp: string }>>("/metrics/")
    },
    calculate: async (files?: File[]) => {
      const formData = new FormData()

      if (files) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      return apiRequest<Record<string, number>>("/metrics/", {
        method: "POST",
        body: files ? formData : undefined,
      })
    },
  },
  portfolio: {
    analysis: async (rule: string, files?: File[]) => {
      const formData = new FormData()
      formData.append("rule", rule)

      if (files) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      return apiRequest<{
        plot: string
        comparison_data: Record<string, number | Record<string, number>>
        insights: string
        weights: Record<string, number>
      }>(`/portfolio/analysis?rule=${rule}`, {
        method: "POST",
        body: files ? formData : JSON.stringify({ rule }),
      })
    },
    investmentStrategy: async (files?: File[]) => {
      const formData = new FormData()

      if (files) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      return apiRequest<{
        portfolio_return: number
        weights: Record<string, number>
        stress_test_results: {
          "Bull Market": {
            mean_return: number
            volatility: number
            min_return: number
            max_return: number
          }
          "Bear Market": {
            mean_return: number
            volatility: number
            min_return: number
            max_return: number
          }
          "Volatile Market": {
            mean_return: number
            volatility: number
            min_return: number
            max_return: number
          }
        }
        insights: string[]
      }>("/portfolio/investment-strategy", {
        method: "POST",
        body: files ? formData : undefined,
      })
    },
    riskCheck: async (files?: File[]) => {
      const formData = new FormData()

      if (files) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      return apiRequest<{
        metrics: {
          volatility: number
          max_drawdown: number
          sharpe: number
          sortino: number
          beta: number
          max_weight: number
        }
        alert_message: string
      }>("/portfolio/risk-check", {
        method: "POST",
        body: files ? formData : undefined,
      })
    },
  },
  predictions: {
    predict: async (files?: File[]) => {
      const formData = new FormData()

      if (files) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      return apiRequest<{
        predicted_value: number
        confidence_interval: [number, number]
        next_period: string
      }>("/predict/predict", {
        method: "POST",
        body: files ? formData : undefined,
      })
    },
  },
}
