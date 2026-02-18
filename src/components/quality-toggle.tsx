"use client"

import * as React from "react"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QualityLevel } from "@/types/plush"

interface QualityOption {
  id: QualityLevel
  name: string
  description: string
  resolution: string
  fileSize: string
  badge: string
  color: string
}

const qualityOptions: QualityOption[] = [
  {
    id: "standard",
    name: "Padrão",
    description: "Ótimo para visualização na tela",
    resolution: "1024x1024",
    fileSize: "~1 MB",
    badge: "Rápido",
    color: "bg-muted-foreground/20",
  },
  {
    id: "high",
    name: "Alta",
    description: "Ideal para impressões pequenas",
    resolution: "2048x2048",
    fileSize: "~3 MB",
    badge: "Popular",
    color: "bg-primary/20",
  },
  {
    id: "ultra",
    name: "Ultra",
    description: "Melhor qualidade para impressões",
    resolution: "4096x4096",
    fileSize: "~8 MB",
    badge: "Premium",
    color: "bg-amber-500/20 dark:bg-amber-400/20",
  },
]

interface QualityToggleProps {
  value: QualityLevel
  onChange: (quality: QualityLevel) => void
  className?: string
  disabled?: boolean
}

export function QualityToggle({
  value,
  onChange,
  className,
  disabled = false,
}: QualityToggleProps) {
  const [focusedId, setFocusedId] = React.useState<QualityLevel | null>(null)

  const handleKeyDown = (
    e: React.KeyboardEvent,
    qualityId: QualityLevel,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!disabled) {
        onChange(qualityId)
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = (index + 1) % qualityOptions.length
      const nextQuality = qualityOptions[nextIndex]
      if (nextQuality) {
        const nextElement = document.getElementById(`quality-${nextQuality.id}`)
        nextElement?.focus()
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = index === 0 ? qualityOptions.length - 1 : index - 1
      const prevQuality = qualityOptions[prevIndex]
      if (prevQuality) {
        const prevElement = document.getElementById(`quality-${prevQuality.id}`)
        prevElement?.focus()
      }
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">
          Qualidade da Geração
        </label>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {qualityOptions.map((quality, index) => {
          const isSelected = value === quality.id
          const isFocused = focusedId === quality.id

          return (
            <button
              key={quality.id}
              id={`quality-${quality.id}`}
              type="button"
              onClick={() => !disabled && onChange(quality.id)}
              onFocus={() => setFocusedId(quality.id)}
              onBlur={() => setFocusedId(null)}
              onKeyDown={(e) => handleKeyDown(e, quality.id, index)}
              disabled={disabled}
              className={cn(
                "group relative flex flex-1 flex-col gap-2 rounded-lg border-2 p-3 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-pressed={isSelected}
              aria-label={`Selecionar qualidade ${quality.name}: ${quality.description}`}
            >
              {/* Header with name and badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {quality.name}
                </span>
                {isSelected ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                ) : (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      quality.color,
                      "text-foreground"
                    )}
                  >
                    {quality.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <span className="text-xs text-muted-foreground">
                {quality.description}
              </span>

              {/* Tech specs */}
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{quality.resolution}</span>
                <span>•</span>
                <span>{quality.fileSize}</span>
              </div>

              {/* Focus ring for accessibility */}
              {isFocused && !isSelected && (
                <span className="absolute inset-0 rounded-lg ring-2 ring-ring ring-offset-2" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected quality info */}
      {value && (
        <p className="text-xs text-muted-foreground">
          Selecionado:{" "}
          <span className="font-medium text-foreground">
            {qualityOptions.find((q) => q.id === value)?.name} (
            {qualityOptions.find((q) => q.id === value)?.resolution})
          </span>
        </p>
      )}
    </div>
  )
}
