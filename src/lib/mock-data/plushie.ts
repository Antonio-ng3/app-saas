import type { PlushieGeneration } from "@/types/plush"

// Single source of truth for all mock plushies
export const MOCK_PLUSHIES: PlushieGeneration[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    createdAt: new Date("2026-02-15"),
    style: "classic-teddy",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&q=80",
    createdAt: new Date("2026-02-14"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=800&q=80",
    createdAt: new Date("2026-02-13"),
    style: "cartoon",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=800&q=80",
    createdAt: new Date("2026-02-12"),
    style: "realistic",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1563901935883-cb61f6f26a9e?w=800&q=80",
    createdAt: new Date("2026-02-11"),
    style: "mini",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    createdAt: new Date("2026-02-10"),
    style: "classic-teddy",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1585155770913-5f0cf267b5d4?w=800&q=80",
    createdAt: new Date("2026-02-09"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    createdAt: new Date("2026-02-08"),
    style: "cartoon",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    originalUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    createdAt: new Date("2026-02-07"),
    style: "realistic",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    createdAt: new Date("2026-02-06"),
    style: "mini",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=800&q=80",
    createdAt: new Date("2026-02-05"),
    style: "classic-teddy",
    isFavorite: false,
    status: "processing",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&q=80",
    createdAt: new Date("2026-02-04"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
] as const

// Helper to get recent items
export const getRecentPlushies = (count: number = 4): PlushieGeneration[] => {
  return MOCK_PLUSHIES.slice(0, count)
}

// Helper to get items for homepage gallery
export const getHomepageGallery = () => {
  return MOCK_PLUSHIES.slice(0, 6).map(item => ({
    id: item.id,
    url: item.url,
    style: item.style,
  }))
}
