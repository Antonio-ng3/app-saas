import Link from "next/link";
import { Cpu, Zap, Shield, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Como Funciona - Plushify",
  description: "Entenda a tecnologia por trás da transformação de fotos em pelúcias",
};

const techSteps = [
  {
    phase: "Análise da Imagem",
    icon: Cpu,
    description: "Nossa IA analisa sua foto para identificar características importantes:",
    items: [
      "Detecção de rostos e objetos principais",
      "Análise de expressões e pose",
      "Identificação de cores e iluminação",
      "Mapeamento de detalhes importantes",
    ],
    duration: "~10-15 segundos",
  },
  {
    phase: "Processamento de Estilo",
    icon: Zap,
    description: "O modelo aplica as características do estilo escolhido:",
    items: [
      "Conversão de texturas para aparência de pelúcia",
      "Adaptação de proporções para formato plush",
      "Preservação de características únicas do original",
      "Aplicação de efeitos do estilo selecionado",
    ],
    duration: "~30-90 segundos",
  },
  {
    phase: "Refinamento e Qualidade",
    icon: Shield,
    description: "A imagem final é refinada para garantir qualidade:",
    items: [
      "Otimização de cores e contraste",
      "Ajuste de detalhes finos",
      "Verificação de consistência visual",
      "Geração em alta resolução",
    ],
    duration: "~10-30 segundos",
  },
];

const limitations = [
  {
    title: "Qualidade da Foto Original",
    description: "A qualidade final depende diretamente da foto enviada. Fotos com baixa resolução ou iluminação ruim podem resultar em transformações menos precisas.",
    tip: "Sempre use a melhor foto disponível.",
  },
  {
    title: "Complexidade da Cena",
    description: "Fotos com muitos elementos ou fundos muito complexos podem não ter o resultado ideal. O foco da IA é no elemento principal.",
    tip: "Fotos com fundo simples funcionam melhor.",
  },
  {
    title: "Variações de Estilo",
    description: "Cada estilo produz resultados únicos. Algumas fotos funcionam melhor com certos estilos do que outros.",
    tip: "Experimente diferentes estilos para ver qual você prefere.",
  },
  {
    title: "Tempo de Processamento",
    description: "O tempo pode variar dependendo da qualidade escolhida e da carga atual dos servidores.",
    tip: "A qualidade Standard é mais rápida, ideal para testes.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Como Funciona</h1>
        <p className="text-muted-foreground text-lg">
          Entenda a tecnologia por trás da mágica de transformar fotos em pelúcias.
        </p>
      </div>

      {/* Introduction */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              A Tecnologia Plushify
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              O Plushify utiliza modelos avançados de Inteligência Artificial especializados em
              processamento de imagens e transferência de estilo. Nossa tecnologia combina:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Redes neurais convolucionais para análise visual</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Transferência de estilo neural para texturas de pelúcia</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Modelos generativos para criação de detalhes plush</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Otimização de imagem para alta qualidade de saída</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* How AI Transforms Photos */}
      <section>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Como a IA Transforma Fotos em Pelúcias</CardTitle>
            <CardDescription>O processo passo a passo da mágica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Quando você faz upload de uma foto, nossa IA segue um processo sofisticado:
            </p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Análise Compreensiva</p>
                  <p>
                    A IA "entende" o que está na imagem - rostos, poses, expressões, cores,
                    iluminação. Ela identifica os elementos importantes que devem ser preservados
                    na versão pelúcia.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Mapeamento de Texturas</p>
                  <p>
                    Cada área da imagem é analisada para determinar a textura de pelúcia mais
                    apropriada. O rosto pode ter uma textura mais suave, enquanto o corpo pode
                    ser mais fofinho.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Aplicação de Estilo Plush</p>
                  <p>
                    A IA aplica características de pelúcia: olhos grandes e brilhantes, bochechas
                    rosadas, textura de pelúcia, proporções adoráveis, mantendo a identidade do
                    original.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-foreground">Refinamento Visual</p>
                  <p>
                    A imagem final é ajustada para garantir que tudo pareça harmonioso - cores,
                    sombras, destaques e detalhes finos são otimizados para criar uma pelúcia
                    convincente e adorável.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Processing Steps */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Etapas do Processamento</h2>
        <div className="space-y-4">
          {techSteps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.phase}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {step.duration}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <ul className="space-y-1.5 text-sm">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Processing Time */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Tempo de Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <p className="font-semibold text-lg">Standard</p>
                <p className="text-2xl font-bold text-primary">30-60s</p>
                <p className="text-xs text-muted-foreground mt-1">Ideal para previews e testes</p>
              </div>
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">High</p>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Recomendado</span>
                </div>
                <p className="text-2xl font-bold text-primary">1-2 min</p>
                <p className="text-xs text-muted-foreground mt-1">Melhor equilíbrio qualidade/tempo</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="font-semibold text-lg">Ultra</p>
                <p className="text-2xl font-bold text-primary">2-3 min</p>
                <p className="text-xs text-muted-foreground mt-1">Máxima qualidade e detalhes</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Nota:</strong> Os tempos são estimativas e podem variar dependendo da complexidade
              da imagem e da carga atual dos servidores.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Limitations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Limitações</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {limitations.map((limitation, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {limitation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{limitation.description}</p>
                <p className="text-sm font-medium text-primary">💡 {limitation.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Privacy Note */}
      <section>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Shield className="h-5 w-5" />
              Privacidade e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-2">
              Sua privacidade é nossa prioridade. Aqui está o que fazemos:
            </p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Fotos são usadas apenas para gerar sua pelúcia</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Imagens não são compartilhadas com terceiros</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Resultados ficam disponíveis apenas na sua galeria privada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Você pode deletar suas imagens a qualquer momento</span>
              </li>
            </ul>
            <Link href="/privacy" className="inline-block mt-3 text-sm text-green-700 dark:text-green-400 hover:underline">
              Leia nossa Política de Privacidade →
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Next Steps */}
      <section className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Saiba Mais</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/best-photos">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm">
              Guia de Melhores Fotos
            </span>
          </Link>
          <Link href="/docs/styles">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm">
              Guia de Estilos
            </span>
          </Link>
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm">
              Criar Minha Pelúcia
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
