"use client"

import { Ghost } from "lucide-react"
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
          <Ghost className="w-16 h-16 text-muted-foreground/50 mb-4" />
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
