import type { PlushieGeneration } from "@/types/plush";

export const MOCK_PLUSHIES: PlushieGeneration[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    createdAt: new Date("2024-01-15"),
    style: "classic-teddy",
    isFavorite: true,
    status: "complete",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400",
    createdAt: new Date("2024-01-14"),
    style: "modern-cute",
    isFavorite: false,
    status: "complete",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1606347569102-f0f1b9209451?w=400",
    createdAt: new Date("2024-01-13"),
    style: "cartoon",
    isFavorite: false,
    status: "complete",
  },
];
