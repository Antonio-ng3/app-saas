import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Plushify - Transforme Suas Fotos em Pelúcias Fofas",
    template: "%s | Plushify",
  },
  description:
    "Transforme suas fotos em pelúcias fofas com IA. Faça upload de qualquer imagem - você, seu pet, amigos ou família - e veja a magia acontecer. Gere pelúcias únicas em segundos com múltiplos estilos disponíveis.",
  keywords: [
    "pelúcia",
    "plush",
    "gerador de pelúcia",
    "IA",
    "inteligência artificial",
    "transformar foto em pelúcia",
    "gerar pelúcia",
    "plushie generator",
    "custom plush",
    "personalized plush",
    "plush toy",
  ],
  authors: [{ name: "Plushify" }],
  creator: "Plushify",
  publisher: "Plushify",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Plushify",
    title: "Plushify - Transforme Suas Fotos em Pelúcias Fofas",
    description:
      "Transforme suas fotos em pelúcias fofas com IA. Faça upload de qualquer imagem e veja a magia acontecer.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Plushify - Transforme fotos em pelúcias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plushify - Transforme Suas Fotos em Pelúcias Fofas",
    description:
      "Transforme suas fotos em pelúcias fofas com IA. Faça upload de qualquer imagem e veja a magia acontecer.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Plushify",
  description:
    "Transforme suas fotos em pelúcias fofas com IA. Faça upload de qualquer imagem - você, seu pet, amigos ou família - e veja a magia acontecer.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Gerência gratuita de pelúcias com créditos disponíveis",
  },
  featureList: [
    "Transformação por IA de fotos em pelúcias",
    "Múltiplos estilos de pelúcia",
    "Alta resolução",
    "Geração rápida",
    "Download e compartilhamento",
    "Armazenamento seguro",
  ],
  author: {
    "@type": "Organization",
    name: "Plushify",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
