import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const docsNav = [
  {
    title: "Introdução",
    items: [
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/how-it-works", label: "Como Funciona" },
    ],
  },
  {
    title: "Guias",
    items: [
      { href: "/docs/best-photos", label: "Melhores Fotos" },
      { href: "/docs/styles", label: "Guia de Estilos" },
      { href: "/docs/troubleshooting", label: "Solução de Problemas" },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Docs Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
              Plushify Docs
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <UserProfile />
            <ModeToggle />
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <DocsSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Docs Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
            <DocsSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 max-w-4xl">{children}</main>
        </div>
      </div>
    </div>
  );
}

function DocsSidebar() {
  return (
    <nav className="p-6" aria-label="Docs navigation">
      <div className="space-y-6">
        {docsNav.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-sm hover:text-primary transition-colors py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Voltar para Home
        </Link>
      </div>
    </nav>
  );
}
