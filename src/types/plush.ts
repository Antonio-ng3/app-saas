// Centralized types for Plushify plush toy generator

// Style types
export type PlushStyle = "classic-teddy" | "modern-cute" | "cartoon" | "realistic" | "mini"

// Status types - unified to include all states
export type PlushieStatus = "complete" | "processing" | "failed" | "queued"

// Generation status
export type GenerationState = "idle" | "analyzing" | "generating" | "complete" | "error"

// Quality types
export type QualityLevel = "standard" | "high" | "ultra"

// Main interface - unified with all properties
export interface PlushieGeneration {
  id: string
  url: string
  originalUrl?: string
  createdAt: Date
  style: PlushStyle
  isFavorite: boolean
  status: PlushieStatus
}

// For dashboard/recent gallery (minimal properties)
export interface PlushiePreview {
  id: string
  url: string
  style: PlushStyle
  status: PlushieStatus
  createdAt: Date
}

// Filter options for gallery
export interface FilterOptions {
  style?: PlushStyle | null
  dateSort?: "newest" | "oldest"
  favoritesOnly?: boolean
}
