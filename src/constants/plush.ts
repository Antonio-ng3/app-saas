import { CheckCircle2, Loader2, Clock, Sparkles, XCircle, type LucideIcon } from "lucide-react"
import type { PlushStyle, PlushieStatus, GenerationState, QualityLevel } from "@/types/plush"

// Style options (with both languages for labels)
export const PLUSH_STYLES = [
  {
    id: "classic-teddy" as PlushStyle,
    name: "Classic Teddy",
    namePt: "Urso Clássico",
    description: "Traditional bear with soft fur",
    emoji: "🧸",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "modern-cute" as PlushStyle,
    name: "Modern Cute",
    namePt: "Fofinho Moderno",
    description: "Kawaii style with big eyes",
    emoji: "🥰",
    color: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "cartoon" as PlushStyle,
    name: "Cartoon",
    namePt: "Desenho Animado",
    description: "Fun and playful character",
    emoji: "🎨",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "realistic" as PlushStyle,
    name: "Realistic",
    namePt: "Realista",
    description: "Lifelike plush details",
    emoji: "✨",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "mini" as PlushStyle,
    name: "Mini",
    namePt: "Mini",
    description: "Small and adorable pocket size",
    emoji: "🐾",
    color: "bg-green-100 dark:bg-green-900/30",
  },
] as const

// Style labels (Portuguese)
export const STYLE_LABELS_PT: Record<PlushStyle, string> = {
  "classic-teddy": "Urso Clássico",
  "modern-cute": "Fofinho Moderno",
  "cartoon": "Desenho Animado",
  "realistic": "Realista",
  "mini": "Mini",
}

// Status labels (Portuguese)
export const STATUS_LABELS: Record<PlushieStatus, string> = {
  complete: "Concluído",
  processing: "Processando",
  failed: "Falhou",
  queued: "Na fila",
}

// Status variants
export const STATUS_VARIANTS: Record<PlushieStatus, "default" | "secondary" | "destructive" | "outline"> = {
  complete: "default",
  processing: "secondary",
  failed: "destructive",
  queued: "outline",
}

// Status config for recent gallery
export const STATUS_CONFIG = {
  complete: {
    label: "Pronto",
    icon: CheckCircle2,
    variant: "default" as const,
    bgColor: "bg-green-500/20 text-green-600 dark:text-green-400",
  },
  processing: {
    label: "Gerando",
    icon: Loader2,
    variant: "secondary" as const,
    bgColor: "bg-primary/20 text-primary",
  },
  queued: {
    label: "Na fila",
    icon: Clock,
    variant: "outline" as const,
    bgColor: "bg-muted-foreground/20 text-muted-foreground",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    variant: "destructive" as const,
    bgColor: "bg-destructive/20 text-destructive",
  },
}

// Generation status messages
export const GENERATION_STATUS_MESSAGES: Record<GenerationState, { title: string; description: string; icon: LucideIcon; animatedMessages?: readonly string[] }> = {
  idle: {
    title: "Ready to Generate",
    description: "Upload an image and select a style to get started",
    icon: Sparkles,
  },
  analyzing: {
    title: "Analyzing Your Image",
    description: "Our AI is studying the details to create the perfect plush",
    icon: Loader2,
    animatedMessages: [
      "Detecting shapes and contours...",
      "Analyzing colors and textures...",
      "Preparing plush transformation...",
      "Almost ready...",
    ] as const,
  },
  generating: {
    title: "Creating Your Plush",
    description: "Bringing your adorable plush to life",
    icon: Loader2,
    animatedMessages: [
      "Adding soft fur textures...",
      "Creating cute facial features...",
      "Refining plush details...",
      "Applying final touches...",
      "Almost there...",
    ] as const,
  },
  complete: {
    title: "Your Plush is Ready!",
    description: "Your adorable plush has been generated successfully",
    icon: CheckCircle2,
  },
  error: {
    title: "Generation Failed",
    description: "Something went wrong. Please try again.",
    icon: XCircle,
  },
}

// Quality options
export const QUALITY_OPTIONS = [
  {
    id: "standard" as QualityLevel,
    name: "Padrão",
    description: "Ótimo para visualização na tela",
    resolution: "1024x1024",
    fileSize: "~1 MB",
    badge: "Rápido",
    color: "bg-muted-foreground/20",
  },
  {
    id: "high" as QualityLevel,
    name: "Alta",
    description: "Ideal para impressões pequenas",
    resolution: "2048x2048",
    fileSize: "~3 MB",
    badge: "Popular",
    color: "bg-primary/20",
  },
  {
    id: "ultra" as QualityLevel,
    name: "Ultra",
    description: "Melhor qualidade para impressões",
    resolution: "4096x4096",
    fileSize: "~8 MB",
    badge: "Premium",
    color: "bg-amber-500/20 dark:bg-amber-400/20",
  },
] as const

export const ALL_STYLES_LABEL = "Todos os Estilos"
