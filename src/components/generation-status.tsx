"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { GENERATION_STATUS_MESSAGES } from "@/constants/plush"
import { cn } from "@/lib/utils"
import type { GenerationState } from "@/types/plush"

export type { GenerationState }

interface GenerationStatusProps {
  state: GenerationState
  progress?: number // 0-100
  estimatedTime?: number // in seconds
  error?: string
  className?: string
}

export function GenerationStatus({
  state,
  progress = 0,
  estimatedTime,
  error,
  className,
}: GenerationStatusProps) {
  const [animatedIndex, setAnimatedIndex] = React.useState(0)
  const statusConfig = GENERATION_STATUS_MESSAGES[state]

  // Cycle through animated messages
  React.useEffect(() => {
    if (state !== "analyzing" && state !== "generating") {
      setAnimatedIndex(0)
      return
    }

    const messages = statusConfig.animatedMessages || []
    if (messages.length === 0) return

    const interval = setInterval(() => {
      setAnimatedIndex((prev) => (prev + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [state, statusConfig.animatedMessages])

  // Format estimated time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  const Icon = statusConfig.icon
  const isError = state === "error"
  const isComplete = state === "complete"
  const isLoading = state === "analyzing" || state === "generating"
  const currentMessage =
    isLoading && statusConfig.animatedMessages
      ? statusConfig.animatedMessages[animatedIndex]
      : statusConfig.description

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border p-4",
        isError && "border-destructive bg-destructive/5",
        isComplete && "border-green-500/50 bg-green-500/5 dark:border-green-500/20",
        !isError && !isComplete && "border-border bg-muted/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isError && "bg-destructive/10 text-destructive",
            isComplete && "bg-green-500/10 text-green-600 dark:text-green-500",
            isLoading && "bg-primary/10 text-primary",
            state === "idle" && "bg-muted text-muted-foreground"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              isLoading && "animate-spin"
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {statusConfig.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentMessage}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            {estimatedTime && estimatedTime > 0 && (
              <span>~{formatTime(estimatedTime)} remaining</span>
            )}
          </div>
        </div>
      )}

      {/* Completion State */}
      {isComplete && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <span>Plush generated successfully!</span>
        </div>
      )}

      {/* Error State */}
      {isError && error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Idle State Skeleton (placeholder for when generation starts) */}
      {state === "idle" && (
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-3/4" />
        </div>
      )}
    </div>
  )
}

// Progress component (if not already in shadcn)
function Progress({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
