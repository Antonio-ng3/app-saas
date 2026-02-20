"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { STATUS_CONFIG } from "@/constants/plush"
import { cn } from "@/lib/utils"
import type { PlushiePreview, PlushieStatus } from "@/types/plush"

interface RecentGalleryProps {
  items?: PlushiePreview[]
  maxItems?: number
  className?: string
}

export function RecentGallery({
  items = [],
  maxItems = 4,
  className,
}: RecentGalleryProps) {
  const displayItems = items.slice(0, maxItems)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">
            Gerações Recentes
          </h3>
        </div>
        {items.length > maxItems && (
          <Button
            variant="link"
            size="sm"
            asChild
            className="h-auto gap-1 p-0 text-xs text-primary"
          >
            <Link href="/gallery">
              Ver Toda a Galeria
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>

      {/* Grid */}
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {displayItems.map((item) => {
            const config = STATUS_CONFIG[item.status as PlushieStatus]
            const StatusIcon = config.icon

            return (
              <Link
                href="/gallery"
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30 transition-all hover:border-primary/50 hover:shadow-md block"
              >
                {/* Image */}
                <div className="relative h-full w-full">
                  <Image
                    src={item.url}
                    alt={`Pelúcia gerada - estilo ${item.style}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-1 shadow-sm">
                  <StatusIcon
                    className={cn(
                      "h-3 w-3",
                      item.status === "processing" && "animate-spin"
                    )}
                  />
                  <span className="text-[10px] font-medium text-foreground">
                    {config.label}
                  </span>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/0 opacity-0 transition-opacity group-hover:bg-foreground/5 group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 py-8 text-center">
          <Clock className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma geração ainda
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Suas pelúcias aparecerão aqui
          </p>
        </div>
      )}

      {/* View All Link (when items exist but <= maxItems) */}
      {items.length > 0 && items.length <= maxItems && (
        <Button
          variant="ghost"
          asChild
          className="w-full justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Link href="/gallery">
            Ver Toda a Galeria
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
