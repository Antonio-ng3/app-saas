import type { PlushieGeneration } from "@/types/plush"

// Single source of truth for all mock plushies
export const MOCK_PLUSHIES: PlushieGeneration[] = [
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
