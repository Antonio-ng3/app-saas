"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlushStyle } from "@/types/plush"

interface StyleOption {
  id: PlushStyle
  name: string
  description: string
  emoji: string
  color: string
}

const styleOptions: StyleOption[] = [
  {
    id: "classic-teddy",
    name: "Classic Teddy",
    description: "Traditional bear with soft fur",
    emoji: "🧸",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "modern-cute",
    name: "Modern Cute",
    description: "Kawaii style with big eyes",
    emoji: "🥰",
    color: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Fun and playful character",
    emoji: "🎨",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "realistic",
    name: "Realistic",
    description: "Lifelike plush details",
    emoji: "✨",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "mini",
    name: "Mini",
    description: "Small and adorable pocket size",
    emoji: "🐾",
    color: "bg-green-100 dark:bg-green-900/30",
  },
]

interface StyleSelectorProps {
  value?: PlushStyle
  onChange: (style: PlushStyle) => void
  className?: string
  disabled?: boolean
}

export function StyleSelector({
  value,
  onChange,
  className,
  disabled = false,
}: StyleSelectorProps) {
  const [focusedId, setFocusedId] = React.useState<PlushStyle | null>(null)

  const handleKeyDown = (
    e: React.KeyboardEvent,
    styleId: PlushStyle,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!disabled) {
        onChange(styleId)
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = (index + 1) % styleOptions.length
      const nextStyle = styleOptions[nextIndex]
      if (nextStyle) {
        const nextElement = document.getElementById(`style-${nextStyle.id}`)
        nextElement?.focus()
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = index === 0 ? styleOptions.length - 1 : index - 1
      const prevStyle = styleOptions[prevIndex]
      if (prevStyle) {
        const prevElement = document.getElementById(`style-${prevStyle.id}`)
        prevElement?.focus()
      }
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-foreground">
        Choose Your Style
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {styleOptions.map((style, index) => {
          const isSelected = value === style.id
          const isFocused = focusedId === style.id

          return (
            <button
              key={style.id}
              id={`style-${style.id}`}
              type="button"
              onClick={() => !disabled && onChange(style.id)}
              onFocus={() => setFocusedId(style.id)}
              onBlur={() => setFocusedId(null)}
              onKeyDown={(e) => handleKeyDown(e, style.id, index)}
              disabled={disabled}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-pressed={isSelected}
              aria-label={`Select ${style.name} style: ${style.description}`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}

              {/* Emoji / Icon */}
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full text-3xl",
                  style.color,
                  "transition-transform group-hover:scale-110",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {style.emoji}
              </div>

              {/* Style Name */}
              <span className="text-xs font-medium text-foreground">
                {style.name}
              </span>

              {/* Description */}
              <span className="line-clamp-2 text-center text-[10px] text-muted-foreground">
                {style.description}
              </span>

              {/* Focus ring for accessibility */}
              {isFocused && !isSelected && (
                <span className="absolute inset-0 rounded-lg ring-2 ring-ring ring-offset-2" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected style description */}
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {styleOptions.find((s) => s.id === value)?.name}
          </span>
        </p>
      )}
    </div>
  )
}
