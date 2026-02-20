"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, Sparkles, BookOpen } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ModeToggle } from "./ui/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#pricing", label: "Pricing" },
];

const docsLinks = [
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/how-it-works", label: "Como Funciona" },
  { href: "/docs/best-photos", label: "Melhores Fotos" },
  { href: "/docs/styles", label: "Guia de Estilos" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        Pular para o conteúdo principal
      </a>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
        <nav
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
            aria-label="Plushify - Ir para página inicial"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
              Plushify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Docs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <BookOpen className="h-4 w-4" />
                  Docs
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {docsLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3" role="group" aria-label="Ações do usuário">
            <Link href="/dashboard">
              <Button size="sm" className="hidden md:inline-flex gap-2">
                <Sparkles className="h-4 w-4" />
                Criar Pelúcia
              </Button>
            </Link>

            <UserProfile />
            <ModeToggle />

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navegue pelo Plushify</SheetDescription>
                </SheetHeader>

                <nav className="p-6 space-y-6" aria-label="Menu mobile">
                  {/* Main Links */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">Navegação</h3>
                    <ul className="space-y-2">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Docs */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">Documentação</h3>
                    <ul className="space-y-2">
                      {docsLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full gap-2">
                        <Sparkles className="h-4 w-4" />
                        Criar Pelúcia
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
