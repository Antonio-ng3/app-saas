"use client"

import * as React from "react"
import Link from "next/link"
import { Lock, Sparkles, Loader2 } from "lucide-react"
import { UserProfile } from "@/components/auth/user-profile"
import { CreditsDisplay } from "@/components/credits-display"
import { GenerationStatus } from "@/components/generation-status"
import { ImageUploadZone } from "@/components/image-upload-zone"
import { QualityToggle } from "@/components/quality-toggle"
import { RecentGallery } from "@/components/recent-gallery"
import { StyleSelector } from "@/components/style-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "@/lib/auth-client"
import { getRecentPlushies } from "@/lib/mock-data/plushie"
import { cn } from "@/lib/utils"
import type { GenerationState, PlushiePreview, PlushStyle, QualityLevel } from "@/types/plush"

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  // Dashboard state
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState<PlushStyle>("classic-teddy")
  const [quality, setQuality] = React.useState<QualityLevel>("high")
  const [credits, setCredits] = React.useState(5)
  const [generationState, setGenerationState] = React.useState<GenerationState>("idle")
  const [progress, setProgress] = React.useState(0)
  const [recentGenerations] = React.useState<PlushiePreview[]>(getRecentPlushies())

  // Simulate generation progress
  React.useEffect(() => {
    if (generationState === "analyzing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(interval)
            setGenerationState("generating")
            return 30
          }
          return prev + 5
        })
      }, 500)
      return () => clearInterval(interval)
    }
    return undefined
  }, [generationState])

  React.useEffect(() => {
    if (generationState === "generating") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setGenerationState("complete")
            setCredits((c) => Math.max(0, c - 1))
            return 100
          }
          return prev + 8
        })
      }, 400)
      return () => clearInterval(interval)
    }
    return undefined
  }, [generationState])

  const handleGenerate = async () => {
    if (!selectedImage || credits <= 0) return

    setGenerationState("analyzing")
    setProgress(0)

    try {
      // Step 1: Upload the image
      setProgress(10)

      // Convert base64 to blob
      const response = await fetch(selectedImage)
      const blob = await response.blob()
      const formData = new FormData()
      formData.append("file", blob, "upload.jpg")

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const { url: uploadedImageUrl } = await uploadResponse.json()
      setProgress(30)

      // Step 2: Generate plush using AI
      setGenerationState("generating")
      setProgress(40)

      const generateResponse = await fetch("/api/generate-plush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          style: selectedStyle,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || "Failed to generate plush")
      }

      const { url: plushImageUrl } = await generateResponse.json()
      // TODO: Store plushImageUrl and display result to user
      void plushImageUrl // Mark as intentionally unused for now
      setProgress(100)
      setGenerationState("complete")
      setCredits((c) => Math.max(0, c - 1))

      // TODO: Save to database with original and plush URLs
      // For now, the plush image is generated but not persisted

    } catch (error) {
      console.error("Error generating plush:", error)
      setGenerationState("error")
    }
  }

  const handleReset = () => {
    setGenerationState("idle")
    setProgress(0)
  }

  const handleImageSelect = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8">
            <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Página Protegida</h1>
            <p className="mb-6 text-muted-foreground">
              Você precisa entrar para acessar o painel
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    )
  }

  const isGenerating = generationState === "analyzing" || generationState === "generating"
  const canGenerate = selectedImage && credits > 0 && !isGenerating

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Criar sua Pelúcia
        </h1>
        <p className="mt-2 text-muted-foreground">
          Transforme suas fotos em pelúcias personalizadas com IA
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Left column - Controls (40%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upload Zone */}
          <Card>
            <CardContent className="pt-6">
              <ImageUploadZone
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                selectedImage={selectedImage}
                disabled={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Style Selector */}
          <Card>
            <CardContent className="pt-6">
              <StyleSelector
                value={selectedStyle}
                onChange={setSelectedStyle}
                disabled={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Quality Toggle */}
          <Card>
            <CardContent className="pt-6">
              <QualityToggle
                value={quality}
                onChange={setQuality}
                disabled={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Credits Display */}
          <CreditsDisplay credits={credits} maxCredits={10} />

          {/* Generate Button */}
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "w-full gap-2",
              canGenerate && "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            )}
          >
            <Sparkles className="h-5 w-5" />
            {isGenerating ? "Gerando..." : "Gerar Pelúcia"}
          </Button>

          {!selectedImage && (
            <p className="text-center text-xs text-muted-foreground">
              Carregue uma imagem para começar
            </p>
          )}

          {selectedImage && credits <= 0 && (
            <p className="text-center text-xs text-destructive">
              Você não tem créditos suficientes.{" "}
              <Link href="/pricing" className="underline hover:text-destructive">
                Compre mais
              </Link>
            </p>
          )}
        </div>

        {/* Right column - Status & Gallery (60%) */}
        <div className="space-y-6 lg:col-span-3">
          {/* Generation Status */}
          <GenerationStatus
            state={generationState}
            progress={progress}
            {...(isGenerating && { estimatedTime: Math.ceil((100 - progress) / 8) })}
            {...(generationState === "error" && { error: "Ocorreu um erro ao gerar sua pelúcia. Tente novamente." })}
            className="min-h-[180px]"
          />

          {/* Action buttons for complete/error states */}
          {generationState === "complete" && (
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Criar Outra
              </Button>
              <Button asChild className="flex-1">
                <Link href="/gallery">Ver na Galeria</Link>
              </Button>
            </div>
          )}

          {generationState === "error" && (
            <Button onClick={handleReset} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
          )}

          {/* Recent Gallery */}
          <Card>
            <CardContent className="pt-6">
              <RecentGallery items={recentGenerations} maxItems={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
