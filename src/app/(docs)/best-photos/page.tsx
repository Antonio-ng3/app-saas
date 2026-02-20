import Link from "next/link";
import { CheckCircle2, XCircle, Sun, Camera, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Melhores Fotos - Plushify",
  description: "Aprenda quais tipos de fotos funcionam melhor para criar pelúcias",
};

const doAndDont = [
  {
    do: {
      title: "Iluminação Natural",
      description: "Use fotos com luz natural suave",
      example: "Fotos próximas a janelas ou ao ar livre em dias nublados",
    },
    dont: {
      title: "Luz Dura",
      description: "Evite sombras fortes ou contraste extremo",
      example: "Fotos com flash direto ou sol forte a pino",
    },
  },
  {
    do: {
      title: "Rosto Visível",
      description: "O rosto deve estar claramente visível",
      example: "Fotos frontais ou 3/4 com o rosto bem definido",
    },
    dont: {
      title: "Rosto Oculto",
      description: "Evite rostos parcialmente cobertos",
      example: "Fotos de perfil, com óculos escuros ou cabelo cobrindo o rosto",
    },
  },
  {
    do: {
      title: "Foco Nítido",
      description: "Use fotos em foco e nítidas",
      example: "Detalhes faciais devem ser visíveis",
    },
    dont: {
      title: "Foto Borrada",
      description: "Evite fotos desfocadas ou tremidas",
      example: "Movimento durante a foto ou foco incorreto",
    },
  },
  {
    do: {
      title: "Fundo Simples",
      description: "Fundos clean ajudam a IA a focar",
      example: "Paredes sólidas, céu, natureza simples",
    },
    dont: {
      title: "Fundo Complexo",
      description: "Evite cenários muito ocupados",
      example: "Multidões, padrões complexos, muitos objetos",
    },
  },
  {
    do: {
      title: "Expressão Clara",
      description: "Expressões faciais bem definidas",
      example: "Sorrisos naturais, olhos abertos, pose relaxada",
    },
    dont: {
      title: "Expressão Indistinta",
      description: "Evite poses muito extremas",
      example: "Risos excessivos, caretas, ângulos muito incomuns",
    },
  },
  {
    do: {
      title: "Boa Resolução",
      description: "Use fotos de alta qualidade",
      example: "Mínimo 500x500px, ideal 1000x1000px ou mais",
    },
    dont: {
      title: "Baixa Resolução",
      description: "Evite fotos pixeladas ou pequenas",
      example: "Selfies de baixa qualidade, capturas de tela",
    },
  },
];

const photoTips = [
  {
    category: "Iluminação Ideal",
    icon: Sun,
    tips: [
      "Luz natural é sempre melhor que artificial",
      "Fotografee durante o dia próximo a uma janela",
      "Evite contraluz (luz vindo de trás)",
      "Nuvens suaves funcionam como difusor natural",
      "Evite flash direto - cria sombras duras",
    ],
  },
  {
    category: "Composição Recomendada",
    icon: Camera,
    tips: [
      "O rosto deve ocupar 30-50% da imagem",
      "Mantenha o rosto centralizado ou ligeiramente acima do centro",
      "Deixe um pouco de espaço acima da cabeça",
      "Para animais, fotografe no nível dos olhos do pet",
      "Evite cortar partes importantes (orelhas, topo da cabeça)",
    ],
  },
];

const formatsAccepted = [
  { format: "JPEG/JPG", description: "Mais comum, boa compressão", recommended: true },
  { format: "PNG", description: "Sem perda de qualidade, arquivos maiores", recommended: true },
  { format: "WEBP", description: "Formato moderno, eficiente", recommended: true },
  { format: "HEIC", description: "Formato iOS (será convertido)", recommended: false },
  { format: "BMP", description: "Não compactado, arquivos muito grandes", recommended: false },
  { format: "GIF", description: "Não recomendado para fotos", recommended: false },
];

export default function BestPhotosPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Guia de Melhores Fotos</h1>
        <p className="text-muted-foreground text-lg">
          Aprenda quais tipos de fotos produzem os melhores resultados para suas pelúcias.
        </p>
      </div>

      {/* Introduction */}
      <section>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Por que a Qualidade da Foto Importa?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              A qualidade da sua foto original é o fator mais importante para obter um excelente
              resultado. Nossa IA trabalha com os detalhes da imagem para criar a pelúcia, então:
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Mais detalhes na original = pelúcia mais fiel e bonita</li>
              <li>• Boa iluminação = cores e texturas mais vibrantes</li>
              <li>• Rosto visível = expressões melhor capturadas</li>
              <li>• Foto nítida = resultado final mais profissional</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Do's and Don'ts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Do's and Don'ts</h2>
        <div className="space-y-4">
          {doAndDont.map((item, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4">
              {/* Do */}
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    {item.do.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    {item.do.description}
                  </p>
                  <p className="text-muted-foreground text-xs">Exemplo: {item.do.example}</p>
                </CardContent>
              </Card>

              {/* Don't */}
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    {item.dont.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-red-700 dark:text-red-400 font-medium">
                    {item.dont.description}
                  </p>
                  <p className="text-muted-foreground text-xs">Exemplo: {item.dont.example}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dicas por Categoria</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {photoTips.map((tip, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <tip.icon className="h-5 w-5 text-primary" />
                  {tip.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tip.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Formats Accepted */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Formatos Aceitos</CardTitle>
            <CardDescription>Tipos de arquivo suportados e suas características</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {formatsAccepted.map((fmt, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    fmt.recommended ? "bg-green-500/5 border-green-500/20" : "bg-muted/30"
                  }`}
                >
                  <div>
                    <p className="font-mono font-medium text-sm">{fmt.format}</p>
                    <p className="text-xs text-muted-foreground">{fmt.description}</p>
                  </div>
                  {fmt.recommended && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      Recomendado
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm flex items-start gap-2 text-amber-700 dark:text-amber-400">
                <Sun className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Tamanho máximo:</strong> 5MB por arquivo. Fotos maiores serão compactadas
                  automaticamente.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Specific Situations */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Situações Especiais</CardTitle>
            <CardDescription>Dicas para casos específicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>🐾</span> Animais de Estimação
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Fotografe no nível dos olhos do animal (não de cima)</li>
                <li>• Capture a personalidade: brincando, descansando, expressões típicas</li>
                <li>• Evite coleiras ou acessórios muito grandes (podem distorcer o resultado)</li>
                <li>• Para animais de pelo escuro, use iluminação extra para ver detalhes</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>👶</span> Bebês e Crianças
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Capture expressões naturais (não force poses)</li>
                <li>• Fotos de frente funcionam melhor para o rosto</li>
                <li>• Chapéus e acessórios grandes podem ser removidos na pelúcia</li>
                <li>• Use cores vibrantes nas roupas para resultados mais alegres</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>👫</span> Casais e Grupos
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Todos os rostos devem estar visíveis e em foco</li>
                <li>• Funciona melhor com 2-3 pessoas no máximo</li>
                <li>• Posições próximas criam resultados mais harmônicos</li>
                <li>• Considere criar pelúcias individuais para melhores detalhes</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>🎨</span> Arte e Personagens
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Desenhos e arte podem funcionar muito bem</li>
                <li>• Personagens de games/animes têm resultados interessantes</li>
                <li>• Use imagens de alta resolução para melhor detalhe</li>
                <li>• Estilo Cartoon funciona particularmente bem para este caso</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Checklist */}
      <section>
        <Card className="border-primary/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
          <CardHeader>
            <CardTitle>Checklist Rápido</CardTitle>
            <CardDescription>Antes de fazer upload, verifique:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                "A foto está em foco e nítida?",
                "O rosto/elemento principal está claramente visível?",
                "A iluminação é boa (sem sombras fortes)?",
                "O arquivo tem pelo menos 500x500 pixels?",
                "O formato é JPEG, PNG ou WEBP?",
                "O arquivo tem menos de 5MB?",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" readOnly />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="flex items-center justify-between p-6 rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5">
        <div>
          <h3 className="font-semibold text-lg mb-1">Pronto para criar sua pelúcia?</h3>
          <p className="text-sm text-muted-foreground">
            Com uma boa foto, você terá um resultado incrível!
          </p>
        </div>
        <Link href="/dashboard">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Começar Agora
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </div>
  );
}
