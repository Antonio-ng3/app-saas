"use client"

import * as React from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void
  onImageRemove?: () => void
  selectedImage?: string | null
  maxSize?: number // in MB
  acceptedFormats?: string[]
  className?: string
  disabled?: boolean
}

export function ImageUploadZone({
  onImageSelect,
  onImageRemove,
  selectedImage,
  maxSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  className,
  disabled = false,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Format not supported. Please use: ${acceptedFormats.map((f) => f.split("/")[1]).join(", ")}`
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size is ${maxSize}MB`
    }

    return null
  }

  const handleFile = (file: File | null | undefined) => {
    if (!file) {
      setError(null)
      return
    }

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onImageSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    handleFile(file)
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled && !selectedImage) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)
    onImageRemove?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!disabled && !selectedImage) {
        fileInputRef.current?.click()
      }
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Upload image"
        disabled={disabled}
      />

      {/* Upload Zone / Preview */}
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={!selectedImage && !disabled ? 0 : undefined}
        className={cn(
          "relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragging && !selectedImage && "border-primary bg-primary/5",
          !selectedImage && !isDragging && "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
          selectedImage && "border-solid p-2",
          error && "border-destructive",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {!selectedImage ? (
          // Upload State
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                "bg-muted transition-colors",
                isDragging && "bg-primary/10"
              )}
            >
              <Upload className={cn("h-6 w-6", isDragging ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? "Drop your image here" : "Click or drag & drop to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WebP up to {maxSize}MB
              </p>
            </div>
          </div>
        ) : (
          // Preview State
          <div className="relative h-full w-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="h-full w-full rounded-md object-contain"
              draggable={false}
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className={cn(
                "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full",
                "bg-destructive text-destructive-foreground shadow-md",
                "transition-colors hover:bg-destructive/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected File Info */}
      {selectedImage && !error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4 flex-shrink-0" />
          <span>Image ready to generate</span>
        </div>
      )}
    </div>
  )
}
