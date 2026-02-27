"use client"

import * as React from "react"
import {
  Heart,
  Filter,
  ChevronDown,
  Lock,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { UserProfile } from "@/components/auth/user-profile"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
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
import { STYLE_LABELS_PT, ALL_STYLES_LABEL } from "@/constants/plush"
import { MOCK_PLUSHIES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { PlushieGeneration, FilterOptions, PlushStyle } from "@/types/plush"

export default function GalleryPage() {
  // ALL hooks must be called first, before any conditional returns
  const { data: session, isPending } = useSession()

  const [filters, setFilters] = React.useState<FilterOptions>({
    style: null,
    dateSort: "newest",
    favoritesOnly: false,
  })
  const [selectedItem, setSelectedItem] = React.useState<PlushieGeneration | null>(null)
  const [items, setItems] = React.useState<PlushieGeneration[]>(MOCK_PLUSHIES)

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

  // Early returns for auth state (after all hooks are called)
  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted" />
            <div className="mx-auto h-8 w-48 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Página Protegida</h1>
          <p className="mb-6 text-muted-foreground">
            Você precisa entrar para acessar a galeria
          </p>
          <UserProfile />
        </div>
      </div>
    )
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleViewItem = (item: PlushieGeneration) => {
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

  const handleDownload = (item: PlushieGeneration) => {
    // In a real app, this would download the image
    // eslint-disable-next-line no-console
    console.log("Downloading:", item.id)
  }

  const handleShare = async (item: PlushieGeneration) => {
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

  const handleDelete = (item: PlushieGeneration) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    if (selectedItem?.id === item.id) {
      setSelectedItem(null)
    }
  }

  const handleFavorite = (item: PlushieGeneration) => {
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
                    {filters.style ? STYLE_LABELS_PT[filters.style as PlushStyle] : ALL_STYLES_LABEL}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Estilo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange({ style: null })}
                  >
                    {ALL_STYLES_LABEL}
                  </DropdownMenuItem>
                  {Object.entries(STYLE_LABELS_PT).map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleFilterChange({ style: key as PlushStyle })}
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
