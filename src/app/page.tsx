"use client"

import Link from "next/link";
import {
  Sparkles,
  Palette,
  ImageIcon,
  Zap,
  Download,
  Shield,
  Upload,
  CheckCircle2,
  Star,
  ChevronRight,
} from "lucide-react";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STYLE_LABELS_PT } from "@/constants/plush";
import { MOCK_PLUSHIES } from "@/lib/mock-data";
import type { PlushStyle } from "@/types/plush";

export default function HomePage() {
  // Mock images for before/after slider
  // Demonstrates the plush transformation: original photo → plush version that covers it
  // The "after" image (plush) slides over the "before" image (original person)
  const mockBeforeImage = "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&q=80"; // Original person
  const mockAfterImage = "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=800&q=80"; // Plush version

  // Mock gallery images
  const galleryImages = MOCK_PLUSHIES.map((item) => ({
    id: item.id,
    url: item.url,
    style: STYLE_LABELS_PT[item.style as PlushStyle],
  }));

  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: "Ana Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      rating: 5,
      text: "Transformei a foto do meu cachorro em uma pelúcia fofíssima! Ficou igualzinha ao pet.",
    },
    {
      id: 2,
      name: "Carlos Mendes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      rating: 5,
      text: "Qualidade incrível! Usei no presente de aniversário da minha namorada e ela amou.",
    },
    {
      id: 3,
      name: "Juliana Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
      rating: 5,
      text: "Super fácil de usar. Em poucos minutos tinha minha pelúcia personalizada.",
    },
  ];

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/20"
            >
              ✨ Nova IA de Transformação de Imagens
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transforme Suas Fotos em{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
                Pelúcias Fofas
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Use IA para transformar qualquer imagem em uma pelúcia adorável. Você,
              seu pet, amigos ou família - veja a magia acontecer em segundos.
            </p>

            {/* Before/After Slider */}
            <div className="w-full max-w-3xl">
              <BeforeAfterSlider
                beforeImage={mockBeforeImage}
                afterImage={mockAfterImage}
                beforeLabel="Original"
                afterLabel="Pelúcia"
                className="shadow-2xl"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="text-base px-8 h-12">
                <Link href="/dashboard">Gerar Minha Pelúcia</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 h-12"
                onClick={scrollToGallery}
              >
                <Link href="#gallery">Ver Exemplos</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Por que escolher o Plushify?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Recursos poderosos de IA para criar pelúcias únicas e personalizadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Transformação por IA</h3>
                <p className="text-muted-foreground">
                  Nossa IA avançada analisa cada detalhe da sua foto para criar uma
                  pelúcia realista e cheia de personalidade.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Múltiplos Estilos</h3>
                <p className="text-muted-foreground">
                  Escolha entre Classic Teddy, Modern Cute, Cartoon, Realistic e Mini
                  - cada estilo único e especial.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Alta Resolução</h3>
                <p className="text-muted-foreground">
                  Pelúcias geradas em alta resolução, perfeitas para impressão ou
                  compartilhamento nas redes sociais.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold">Geração Rápida</h3>
                <p className="text-muted-foreground">
                  Em menos de um minuto, sua pelúcia está pronta. Sem esperas, sem
                  complicações.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Download & Compartilhe</h3>
                <p className="text-muted-foreground">
                  Faça download em alta qualidade ou compartilhe diretamente nas suas
                  redes sociais favoritas.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold">Armazenamento Seguro</h3>
                <p className="text-muted-foreground">
                  Suas imagens e pelúcias ficam salvas na sua galeria privada, sempre
                  disponíveis quando precisar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Como funciona?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Quatro passos simples para sua pelúcia personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary" />

            {/* Step 1 */}
            <div className="relative text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
                  <Upload className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground"
                >
                  Passo 1
                </Badge>
                <h3 className="text-xl font-semibold">Faça Upload</h3>
                <p className="text-muted-foreground">
                  Arraste e solte ou selecione sua foto preferida
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg">
                  <Palette className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-500 text-white"
                >
                  Passo 2
                </Badge>
                <h3 className="text-xl font-semibold">Escolha o Estilo</h3>
                <p className="text-muted-foreground">
                  Selecione o estilo de pelúcia que mais combina
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-lg">
                  <Sparkles className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white"
                >
                  Passo 3
                </Badge>
                <h3 className="text-xl font-semibold">Gere a Pelúcia</h3>
                <p className="text-muted-foreground">
                  Nossa IA cria sua pelúcia em segundos
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Download className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white"
                >
                  Passo 4
                </Badge>
                <h3 className="text-xl font-semibold">Baixe o Resultado</h3>
                <p className="text-muted-foreground">
                  Download em alta qualidade ou compartilhe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section id="gallery" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Galeria de Exemplos
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Veja algumas pelúcias criadas pela nossa comunidade
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {galleryImages.map((image: { id: string; url: string; style: string }) => (
              <Card
                key={image.id}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`Pelúcia estilo ${image.style}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <Badge className="mb-2">{image.style}</Badge>
                        <p className="text-white text-sm font-medium">
                          Original vs Plush
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/gallery">
                Ver Mais Exemplos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Planos e Preços
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Escolha o plano ideal para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">Para experimentar</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>1 crédito grátis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Qualidade padrão</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>3 estilos disponíveis</span>
                  </li>
                </ul>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/register">Começar Grátis</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Mais Popular
              </Badge>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">Para usuários ativos</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">R$29</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>50 créditos por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Alta resolução</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Todos os 5 estilos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Galeria ilimitada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/register">Assinar Pro</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-muted-foreground">Para empresas</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Créditos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Estilos personalizados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Gerente de conta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>SLA garantido</span>
                  </li>
                </ul>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/contact">Fale Conosco</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Perguntas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Que tipo de fotos funcionam melhor?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Fotos com boa iluminação, rosto ou objeto bem visível e fundo
                simples funcionam melhor. Evite fotos muito escuras, desfocadas ou
                com muitos elementos no fundo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Quanto tempo leva a geração?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A geração normalmente leva entre 30 a 60 segundos, dependendo da
                complexidade da imagem e do estilo escolhido.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Posso usar comercialmente?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! As pelúcias geradas são suas para usar como quiser, inclusive
                comercialmente, nos planos Pro e Enterprise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                E se não ficar satisfeito?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Se o resultado não ficar como esperado, você pode gerar novamente
                usando o mesmo crédito. Não gostou? Pedimos feedback para melhorar!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Meus dados estão seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Usamos criptografia de ponta a ponta e seguimos as melhores
                práticas de segurança. Suas imagens são processadas e removidas
                dos nossos servidores temporários.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Vocês armazenam minhas fotos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                As imagens originais são usadas apenas para processamento e não são
                armazenadas permanentemente. As pelúcias geradas ficam na sua galeria
                privada.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-7"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Quais formatos são aceitos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Aceitamos JPG, PNG e WebP com tamanho máximo de 5MB por imagem.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-8"
              className="border-2 px-6 rounded-lg"
            >
              <AccordionTrigger className="text-left">
                Posso cancelar meu plano?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Você pode cancelar seu plano a qualquer momento. Continuará
                tendo acesso até o fim do período já pago.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Pronto para criar sua pelúcia?
            </h2>
            <p className="text-lg opacity-90">
              Comece gratuitamente e transforme suas fotos em pelúcias fofas hoje
              mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="text-base px-8 h-12 bg-white text-primary hover:bg-white/90"
              >
                <Link href="/register">Comece Grátis</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-white text-white hover:bg-white/10"
              >
                <Link href="/gallery">Ver Galeria</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
