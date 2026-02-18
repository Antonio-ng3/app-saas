"use client"

import * as React from "react"
import {
  Heart,
  Filter,
  ChevronDown,
} from "lucide-react"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import type { MockPlushie, PlushStyle } from "@/components/gallery/gallery-item-card"
import { ImagePreviewModal } from "@/components/gallery/image-preview-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FilterOptions {
  style?: string | null
  dateSort?: "newest" | "oldest"
  favoritesOnly?: boolean
}

const styleLabels: Record<PlushStyle, string> = {
  "classic-teddy": "Urso Clássico",
  "modern-cute": "Fofinho Moderno",
  "cartoon": "Desenho Animado",
  "realistic": "Realista",
  "mini": "Mini",
}

const allStylesLabel = "Todos os Estilos"

// Mock data - 12 plushie items with varied styles and dates
const mockGalleryItems: MockPlushie[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    createdAt: new Date("2026-02-15"),
    style: "classic-teddy",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&q=80",
    createdAt: new Date("2026-02-14"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80",
    createdAt: new Date("2026-02-13"),
    style: "cartoon",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1518005052300-a4ef6c3e8df6?w=800&q=80",
    createdAt: new Date("2026-02-12"),
    style: "realistic",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1605656594284-0fa6f9c1644b?w=800&q=80",
    createdAt: new Date("2026-02-11"),
    style: "mini",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1576426079877-4e3b8dd8ad7e?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1518882605630-8a9fed15b5bf?w=800&q=80",
    createdAt: new Date("2026-02-10"),
    style: "classic-teddy",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1566305418082-8562f1e2c799?w=800&q=80",
    createdAt: new Date("2026-02-09"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    createdAt: new Date("2026-02-08"),
    style: "cartoon",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1624788137628-1bf26d7b5950?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    createdAt: new Date("2026-02-07"),
    style: "realistic",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
    createdAt: new Date("2026-02-06"),
    style: "mini",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80",
    createdAt: new Date("2026-02-05"),
    style: "classic-teddy",
    isFavorite: false,
    status: "processing",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    createdAt: new Date("2026-02-04"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
]

export default function GalleryPage() {
  const [filters, setFilters] = React.useState<FilterOptions>({
    style: null,
    dateSort: "newest",
    favoritesOnly: false,
  })
  const [selectedItem, setSelectedItem] = React.useState<MockPlushie | null>(null)
  const [items, setItems] = React.useState<MockPlushie[]>(mockGalleryItems)

  // Apply filters to items
  const filteredItems = React.useMemo(() => {
    let result = [...items]

    // Style filter
    if (filters.style) {
      result = result.filter((item) => item.style === filters.style)
    }

    // Favorites filter
    if (filters.favoritesOnly) {
      result = result.filter((item) => item.isFavorite)
    }

    // Date sort
    result.sort((a, b) => {
      const dateA = a.createdAt.getTime()
      const dateB = b.createdAt.getTime()
      return filters.dateSort === "newest" ? dateB - dateA : dateA - dateB
    })

    return result
  }, [items, filters])

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleViewItem = (item: MockPlushie) => {
    setSelectedItem(item)
  }

  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedItem) return

    const currentIndex = filteredItems.findIndex((i) => i.id === selectedItem.id)
    let newIndex = currentIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedItem(filteredItems[newIndex] ?? null)
  }

  const handleDownload = (item: MockPlushie) => {
    // In a real app, this would download the image
    // eslint-disable-next-line no-console
    console.log("Downloading:", item.id)
  }

  const handleShare = async (item: MockPlushie) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha Pelúcia Plushify",
          text: "Confira esta pelúcia que criei!",
          url: item.url,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(item.url)
    }
  }

  const handleDelete = (item: MockPlushie) => {
    // In a real app, this would delete from database
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    if (selectedItem?.id === item.id) {
      setSelectedItem(null)
    }
  }

  const handleFavorite = (item: MockPlushie) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Galeria</h1>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? "pelúcia" : "pelúcias"}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Favorites Toggle */}
              <Button
                variant={filters.favoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleFilterChange({ favoritesOnly: !filters.favoritesOnly })
                }
                className="gap-2"
              >
                <Heart className={cn("h-4 w-4", filters.favoritesOnly && "fill-current")} />
                Favoritos
              </Button>

              {/* Style Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {filters.style ? styleLabels[filters.style as PlushStyle] : allStylesLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Estilo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange({ style: null })}
                  >
                    {allStylesLabel}
                  </DropdownMenuItem>
                  {Object.entries(styleLabels).map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleFilterChange({ style: key })}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Date Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {filters.dateSort === "newest" ? "Mais Recentes" : "Mais Antigos"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFilterChange({ dateSort: "newest" })}>
                    Mais Recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange({ dateSort: "oldest" })}>
                    Mais Antigos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="container mx-auto px-4 py-6">
        <GalleryGrid
          items={filteredItems}
          onView={handleViewItem}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
          onFavorite={handleFavorite}
        />
      </main>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        items={filteredItems}
        onNavigate={handleNavigate}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onShare={handleShare}
        onFavorite={handleFavorite}
      />
    </div>
  )
}
