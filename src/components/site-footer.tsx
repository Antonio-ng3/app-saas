import Link from "next/link";
import { Heart, Github, Twitter, Instagram } from "lucide-react";

const footerSections = [
  {
    title: "Produto",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Preços" },
      { href: "/gallery", label: "Galeria" },
      { href: "/dashboard", label: "Criar Pelúcia" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/how-it-works", label: "Como Funciona" },
      { href: "/docs/best-photos", label: "Melhores Fotos" },
      { href: "/docs/styles", label: "Guia de Estilos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/about", label: "Sobre" },
      { href: "/contact", label: "Contato" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Carreiras" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacidade" },
      { href: "/terms", label: "Termos de Uso" },
      { href: "/cookies", label: "Cookies" },
      { href: "/refunds", label: "Reembolsos" },
    ],
  },
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-sm">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
              Plushify
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Plushify. Todos os direitos reservados.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
