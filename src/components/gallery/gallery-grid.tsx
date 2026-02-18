"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { PlushieGeneration } from "@/types/plush"
import { GalleryItemCard } from "./gallery-item-card"

interface GalleryGridProps {
  items: PlushieGeneration[]
  onView: (item: PlushieGeneration) => void
  onDownload: (item: PlushieGeneration) => void
  onDelete: (item: PlushieGeneration) => void
  onShare: (item: PlushieGeneration) => void
  onFavorite: (item: PlushieGeneration) => void
  loading?: boolean
}

export function GalleryGrid({
  items,
  onView,
  onDownload,
  onDelete,
  onShare,
  onFavorite,
  loading = false,
}: GalleryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma pelúcia encontrada</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Comece criando sua primeira pelúcia ou ajuste os filtros para ver mais resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <GalleryItemCard
          key={item.id}
          item={item}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
          onShare={onShare}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  )
}
