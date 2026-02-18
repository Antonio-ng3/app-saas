"use client"

import * as React from "react"
import { MoveHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original",
  afterLabel = "Plush",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50)
  const [isDragging, setIsDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const sliderHandleRef = React.useRef<HTMLButtonElement>(null)

  // Calculate slider position from mouse/touch event
  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  // Mouse handlers
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    updateSliderPosition(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    if (touch) updateSliderPosition(touch.clientX)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Click to position
  const handleContainerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setSliderPosition((prev) => Math.max(0, prev - step))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setSliderPosition((prev) => Math.min(100, prev + step))
    }
  }

  // Global mouse/touch event listeners for drag
  React.useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      updateSliderPosition(e.clientX)
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) updateSliderPosition(touch.clientX)
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    const handleGlobalTouchEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("touchmove", handleGlobalTouchMove)
    document.addEventListener("touchend", handleGlobalTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchmove", handleGlobalTouchMove)
      document.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        "w-full",
        isDragging && "cursor-grabbing",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
      style={{ aspectRatio: "16 / 10" }}
    >
      {/* Before Image (Original) - Background */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover select-none"
        draggable={false}
      />

      {/* After Image (Plush) - Clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover select-none"
          style={{
            position: "absolute",
            left: `-${(100 - sliderPosition) / 100 * 100}%`,
            width: `${100 / (sliderPosition / 100)}%`,
          }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <span
          className={cn(
            "absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity",
            sliderPosition > 25 && "opacity-0"
          )}
        >
          {beforeLabel}
        </span>
        <span
          className={cn(
            "absolute bottom-4 right-4 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity",
            sliderPosition < 75 && "opacity-0"
          )}
        >
          {afterLabel}
        </span>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <button
          ref={sliderHandleRef}
          type="button"
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex h-10 w-10 items-center justify-center",
            "rounded-full bg-white shadow-lg",
            "cursor-grab active:cursor-grabbing",
            "transition-colors hover:bg-white/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
          aria-label="Compare before and after"
          aria-valuenow={sliderPosition}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(sliderPosition)}% ${afterLabel}`}
        >
          <MoveHorizontal className="h-5 w-5 text-foreground" aria-hidden="true" />
        </button>
      </div>

      {/* Semi-transparent overlay for better visibility of slider line */}
      <div
        className="absolute inset-0 pointer-events-none bg-white/5"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
    </div>
  )
}
