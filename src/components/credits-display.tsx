"use client"

import Link from "next/link"
import { Coins, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CreditsDisplayProps {
  credits?: number
  maxCredits?: number
  onBuyMore?: () => void
  className?: string
  showBuyButton?: boolean
}

export function CreditsDisplay({
  credits = 5,
  maxCredits = 10,
  onBuyMore,
  className,
  showBuyButton = true,
}: CreditsDisplayProps) {
  const percentage = (credits / maxCredits) * 100

  // Determine color based on remaining credits
  const getColorVariant = () => {
    if (credits === 0) return "text-destructive"
    if (credits <= 2) return "text-amber-500 dark:text-amber-400"
    return "text-primary"
  }

  const getProgressColor = () => {
    if (credits === 0) return "bg-destructive"
    if (credits <= 2) return "bg-amber-500 dark:bg-amber-400"
    return "bg-primary"
  }

  return (
    <div className={cn("space-y-3 rounded-lg border border-border bg-muted/30 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className={cn("h-4 w-4", getColorVariant())} />
          <span className="text-sm font-medium text-foreground">
            Créditos Restantes
          </span>
        </div>
        {showBuyButton && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 gap-1 text-xs hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/pricing" {...(onBuyMore && { onClick: onBuyMore })}>
              <ShoppingCart className="h-3 w-3" />
              Comprar Mais
            </Link>
          </Button>
        )}
      </div>

      {/* Credits count */}
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", getColorVariant())}>
          {credits}
        </span>
        <span className="text-sm text-muted-foreground">/ {maxCredits}</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              getProgressColor()
            )}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {credits === 0
            ? "Sem créditos. Compre mais para continuar gerando!"
            : credits <= 2
              ? "Você está ficando sem créditos!"
              : "Você tem créditos suficientes para gerar mais pelúcias."}
        </p>
      </div>

      {/* Warning for low credits */}
      {credits <= 2 && credits > 0 && (
        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2 text-xs text-amber-600 dark:text-amber-400">
          <Coins className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            {credits === 1
              ? "Resta apenas 1 crédito! Compre mais para não ficar sem."
              : `Restam apenas ${credits} créditos. Considere comprar mais.`}
          </span>
        </div>
      )}
    </div>
  )
}
