"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BarChart3, TrendingUp, Zap, Target } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: BarChart3 },
  { name: "Market", href: "/market", icon: TrendingUp },
  { name: "Metrics", href: "/metrics", icon: Target },
  { name: "Predictions", href: "/predictions", icon: Zap },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
