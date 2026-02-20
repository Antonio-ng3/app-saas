import Link from "next/link";
import { Cookie, Settings, Shield, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Política de Cookies - Plushify",
  description: "Como usamos cookies para melhorar sua experiência",
};

const cookieTypes = [
  {
    category: "Cookies Essenciais",
    icon: Shield,
    required: true,
    description: "Necessários para o funcionamento básico da plataforma",
    cookies: [
      { name: "session", purpose: "Mantém você autenticado", duration: "Sessão" },
      { name: "csrf_token", purpose: "Proteção contra ataques CSRF", duration: "Sessão" },
      { name: "pref_theme", purpose: "Salva preferência de tema (dark/light)", duration: "1 ano" },
    ],
  },
  {
    category: "Cookies de Performance",
    icon: Settings,
    required: false,
    description: "Ajudam a entender como o serviço é usado",
    cookies: [
      { name: "_ga", purpose: "Google Analytics - análise de uso", duration: "2 anos" },
      { name: "_gid", purpose: "Google Analytics - identificação única", duration: "24 horas" },
    ],
  },
  {
    category: "Cookies Funcionais",
    icon: Info,
    required: false,
    description: "Lembram suas preferências e escolhas",
    cookies: [
      { name: "recent_styles", purpose: "Lembra estilos usados recentemente", duration: "30 dias" },
      { name: "gallery_view", purpose: "Lembra preferência de visualização", duration: "Sessão" },
    ],
  },
];

const thirdParty = [
  {
    name: "Google Analytics",
    purpose: "Análise de tráfego e comportamento do usuário",
    privacy: "https://policies.google.com/privacy",
    cookies: ["_ga", "_gid", "_gat"],
  },
];

export default function CookiesPage() {
  const lastUpdated = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Política de Cookies</h1>
            <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Entenda como usamos cookies para melhorar sua experiência no Plushify.
        </p>
      </div>

      {/* What are Cookies */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>O que são Cookies?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
            um site. Eles permitem que o site se lembre de suas ações e preferências (como login,
            idioma, tema) para que você não precise inserir essas informações novamente.
          </p>
          <p>
            Os cookies são seguros e não podem acessar informações armazenadas no seu dispositivo
            ou espalhar vírus.
          </p>
        </CardContent>
      </Card>

      {/* Cookie Types */}
      <h2 className="text-2xl font-bold mb-4">Tipos de Cookies que Usamos</h2>
      <div className="space-y-6 mb-8">
        {cookieTypes.map((type, index) => (
          <Card key={index} className={type.required ? "border-green-500/20" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <type.icon className="h-5 w-5 text-primary" />
                  {type.category}
                </CardTitle>
                {type.required && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    Obrigatório
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{type.description}</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Cookie</th>
                      <th className="text-left py-2 font-semibold">Finalidade</th>
                      <th className="text-left py-2 font-semibold">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.cookies.map((cookie, i) => (
                      <tr key={i} className="border-b border-dashed last:border-0">
                        <td className="py-2 font-mono text-xs">{cookie.name}</td>
                        <td className="py-2">{cookie.purpose}</td>
                        <td className="py-2">{cookie.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Third Party Cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cookies de Terceiros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Utilizamos serviços terceiros que também usam cookies:
          </p>
          {thirdParty.map((service, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{service.purpose}</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  Cookies: <code className="font-mono bg-muted px-1 rounded">
                    {service.cookies.join(", ")}
                  </code>
                </span>
                <a
                  href={service.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Política de Privacidade →
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Managing Cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Como Gerenciar Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Você pode controlar e gerenciar cookies de várias maneiras:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border">
              <p className="font-medium text-foreground mb-1">Através do Navegador</p>
              <p className="text-xs">
                A maioria dos navegadores permite que você:
              </p>
              <ul className="text-xs mt-2 space-y-1 ml-4">
                <li>• Visualize quais cookies estão armazenados</li>
                <li>• Delete cookies individuais ou todos</li>
                <li>• Bloqueie cookies de terceiros</li>
                <li>• Notifique quando um cookie é definido</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg border">
              <p className="font-medium text-foreground mb-1">Configurações Comuns</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>
                  <strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Opções → Privacidade e segurança → Cookies
                </li>
                <li>
                  <strong>Safari:</strong> Preferências → Privacidade → Gerenciar dados de sites
                </li>
                <li>
                  <strong>Edge:</strong> Configurações → Cookies e permissões de site
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                Importante: Bloquear Cookies Essenciais
              </p>
              <p className="text-xs">
                Se você bloquear cookies essenciais, algumas partes da plataforma podem não funcionar
                corretamente, como login e personalização.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Atualizações desta Política</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Podemos atualizar esta política periodicamente para refletir mudanças em nossos
            serviços ou requisitos legais. Notificaremos usuários sobre mudanças significativas
            via aviso na plataforma.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Dúvidas sobre Cookies?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            Se você tiver dúvidas sobre nosso uso de cookies, entre em contato:
          </p>
          <p>
            Email:{" "}
            <a href="mailto:privacy@plushify.com" className="text-primary">
              privacy@plushify.com
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Related Links */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/privacy" className="text-primary hover:underline text-sm">
            Política de Privacidade
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/terms" className="text-primary hover:underline text-sm">
            Termos de Serviço
          </Link>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
