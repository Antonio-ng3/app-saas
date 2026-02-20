import Link from "next/link";
import { Upload, Palette, Sparkles, Download, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Getting Started - Plushify",
  description: "Aprenda como começar a criar suas pelúcias personalizadas com IA",
};

const steps = [
  {
    icon: Upload,
    title: "1. Faça Upload da Foto",
    description: "Escolha uma foto clara e bem iluminada. Você pode fazer upload de fotos de pessoas, animais de estimação ou qualquer imagem que queira transformar em pelúcia.",
    tips: [
      "Use fotos com boa iluminação",
      "Evite fotos desfocadas ou granuladas",
      "O rosto deve estar visível e centralizado",
      "Formatos aceitos: JPG, PNG, WEBP (máx. 5MB)",
    ],
  },
  {
    icon: Palette,
    title: "2. Escolha o Estilo",
    description: "Selecione o estilo de pelúcia que preferir. Temos opções para todos os gostos, do clássico ao moderno.",
    styles: [
      { name: "Classic Teddy", desc: "O tradicional ursinho de pelúcia" },
      { name: "Modern Cute", desc: "Estilo kawaii moderno" },
      { name: "Cartoon", desc: "Aparência de desenho animado" },
      { name: "Realistic", desc: "Texturas realistas de pelúcia" },
      { name: "Mini", desc: "Versão em miniatura fofa" },
    ],
  },
  {
    icon: Sparkles,
    title: "3. Gere sua Pelúcia",
    description: "Clique no botão 'Gerar Pelúcia' e nossa IA começará a trabalhar. O processo geralmente leva de 30 segundos a 2 minutos, dependendo da qualidade escolhida.",
    quality: [
      { level: "Standard", time: "30-60 segundos", note: "Ótimo para previews" },
      { level: "High", time: "1-2 minutos", note: "Recomendado para impressão" },
      { level: "Ultra", time: "2-3 minutos", note: "Máxima qualidade e detalhes" },
    ],
  },
  {
    icon: Download,
    title: "4. Baixe o Resultado",
    description: "Após a geração completa, você pode visualizar o resultado, fazer o download em alta resolução e compartilhar com seus amigos.",
    actions: [
      "Visualize em tela cheia",
      "Compare com a foto original",
      "Faça download em PNG ou JPG",
      "Compartilhe diretamente nas redes sociais",
      "Adicione aos favoritos para acessar depois",
    ],
  },
];

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Getting Started</h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo ao Plushify! Aprenda como criar suas primeiras pelúcias personalizadas com IA.
        </p>
      </div>

      {/* What is Plushify */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              O que é Plushify?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Plushify é uma aplicação powered by IA que transforma suas fotos em pelúcias fofas e personalizadas.
              Usamos tecnologia avançada de processamento de imagens para criar versões em pelúcia de pessoas,
              animais de estimação e qualquer imagem que você imaginar.
            </p>
            <p>
              O processo é simples: faça upload de uma foto, escolha o estilo desejado, e em minutos você terá
              sua pelúcia personalizada pronta para download!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Creating Account */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Criando sua Conta</CardTitle>
            <CardDescription>Comece com 1 crédito grátis para testar!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Para começar a usar o Plushify, você precisa criar uma conta:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Clique em "Sign In" no canto superior direito</li>
              <li>Selecione "Create an account"</li>
              <li>Insira seu email e crie uma senha</li>
              <li>Confirme seu email (link enviado automaticamente)</li>
              <li>Pronto! Você já tem 1 crédito grátis para começar</li>
            </ol>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Dica:</strong> Você pode entrar com Google para criar sua conta ainda mais rápido!
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Sua Primeira Pelúcia</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  {step.title}
                </CardTitle>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {step.tips && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Dicas importantes:
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.styles && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Estilos disponíveis:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {step.styles.map((style, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
                          <div>
                            <p className="font-medium text-sm">{style.name}</p>
                            <p className="text-xs text-muted-foreground">{style.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {step.quality && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Níveis de qualidade:</h4>
                    <div className="space-y-2">
                      {step.quality.map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium text-sm">{q.level}</p>
                            <p className="text-xs text-muted-foreground">{q.note}</p>
                          </div>
                          <span className="text-sm text-primary font-medium">{q.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {step.actions && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Após a geração você pode:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {step.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Best Results */}
      <section>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Dicas para Melhores Resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Use fotos com iluminação natural e uniforme</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Evite sombras fortes no rosto ou objeto principal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>O rosto deve ocupar pelo menos 30% da imagem</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Experimente diferentes estilos com a mesma foto</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Para animais de estimação, fotos em nível dos olhos funcionam melhor</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Next Steps */}
      <section className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Próximos Passos</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Sparkles className="h-4 w-4" />
              Ir para Dashboard
            </span>
          </Link>
          <Link href="/docs/how-it-works">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
              Como Funciona
            </span>
          </Link>
          <Link href="/docs/best-photos">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
              Guia de Fotos
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
