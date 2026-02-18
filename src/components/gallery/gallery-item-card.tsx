"use client"

import * as React from "react"
import Image from "next/image"
import {
  Eye,
  Download,
  Trash2,
  Share2,
  Heart,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PlushStyle =
  | "classic-teddy"
  | "modern-cute"
  | "cartoon"
  | "realistic"
  | "mini"

export type PlushieStatus = "complete" | "processing" | "failed"

export interface MockPlushie {
  id: string
  url: string
  originalUrl?: string
  createdAt: Date
  style: PlushStyle
  isFavorite: boolean
  status: PlushieStatus
}

interface GalleryItemCardProps {
  item: MockPlushie
  onView: (item: MockPlushie) => void
  onDownload: (item: MockPlushie) => void
  onDelete: (item: MockPlushie) => void
  onShare: (item: MockPlushie) => void
  onFavorite: (item: MockPlushie) => void
}

const statusLabels: Record<PlushieStatus, string> = {
  complete: "Concluído",
  processing: "Processando",
  failed: "Falhou",
}

const statusVariants: Record<PlushieStatus, "default" | "secondary" | "destructive"> = {
  complete: "default",
  processing: "secondary",
  failed: "destructive",
}

export function GalleryItemCard({
  item,
  onView,
  onDownload,
  onDelete,
  onShare,
  onFavorite,
}: GalleryItemCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload(item)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(item)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare(item)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite(item)
  }

  const handleView = () => {
    onView(item)
  }

  if (item.status === "processing") {
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-muted",
          "aspect-square flex flex-col items-center justify-center gap-3"
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Gerando seu pelúcia...</p>
        <Badge variant={statusVariants[item.status]}>{statusLabels[item.status]}</Badge>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card",
        "transition-all duration-200 hover:shadow-lg",
        "aspect-square cursor-pointer"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image */}
      {imageError ? (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-sm text-muted-foreground">Imagem não disponível</span>
        </div>
      ) : (
        <Image
          src={item.url}
          alt="Pelúcia gerada"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      {/* Status Badge */}
      <div className="absolute left-2 top-2">
        <Badge
          variant={statusVariants[item.status]}
          className="bg-black/60 text-white border-transparent hover:bg-black/70"
        >
          {statusLabels[item.status]}
        </Badge>
      </div>

      {/* Favorite Badge */}
      {item.isFavorite && (
        <div className="absolute right-2 top-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 flex items-center justify-center gap-2",
          "transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        {/* View Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleView}
          aria-label="Ver imagem"
        >
          <Eye className="h-5 w-5" />
        </Button>

        {/* Download Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleDownload}
          aria-label="Baixar imagem"
        >
          <Download className="h-5 w-5" />
        </Button>

        {/* Favorite Button */}
        <Button
          variant={item.isFavorite ? "default" : "secondary"}
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleFavorite}
          aria-label={item.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={cn("h-5 w-5", item.isFavorite && "fill-current")} />
        </Button>

        {/* Share Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleShare}
          aria-label="Compartilhar"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={handleDelete}
          aria-label="Excluir"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
