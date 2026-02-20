import Link from "next/link";
import { Heart, Palette, Sparkles, Award, Baby } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Guia de Estilos - Plushify",
  description: "Conheça todos os estilos de pelúcia disponíveis e qual escolher",
};

const styles = [
  {
    id: "classic-teddy",
    name: "Classic Teddy",
    icon: Heart,
    color: "from-amber-400 to-orange-500",
    description: "O tradicional ursinho de pelúcia que todos amam. Textura clássica e atemporal.",
    characteristics: [
      "Textura de pelúcia tradicional",
      "Olhos grandes e expressivos",
      "Bochechas rosadas suaves",
      "Formas arredondadas e fofas",
      "Cores quentes e naturais",
    ],
    bestFor: [
      "Fotos de família e bebês",
      "Retratos clássicos",
      "Presentes nostálgicos",
      "Quem gosta de tradicional",
    ],
    worksWith: [
      "Fotos com iluminação suave",
      "Retratos frontais",
      "Expressões serenas ou sorridentes",
    ],
  },
  {
    id: "modern-cute",
    name: "Modern Cute",
    icon: Sparkles,
    color: "from-pink-400 to-purple-500",
    description: "Estilo kawaii moderno com proporções exageradas e cores vibrantes.",
    characteristics: [
      "Olhos enormes e brilhantes",
      "Proporções cabeça-corpo aumentadas",
      "Cores saturadas e vibrantes",
      "Detalhes minimalistas",
      "Visual 'chibi' anime",
    ],
    bestFor: [
      "Fotos de jovens e adolescentes",
      "Selfies e casuais",
      "Fãs de anime e kawaii",
      "Quem quer algo moderno",
    ],
    worksWith: [
      "Fotos com expressões marcantes",
      "Selfies de boa qualidade",
      "Cores originais vibrantes",
    ],
  },
  {
    id: "cartoon",
    name: "Cartoon",
    icon: Palette,
    color: "from-blue-400 to-cyan-500",
    description: "Aparência de desenho animado 2D com linhas definidas e cores planas.",
    characteristics: [
      "Estilo de desenho animado",
      "Cores planas e definidas",
      "Contornos sutis",
      "Expressões exageradas",
      "Visual artístico e único",
    ],
    bestFor: [
      "Personagens fictícios",
      "Arte e ilustrações",
      "Quem quer algo artístico",
      "Avatares e perfis",
    ],
    worksWith: [
      "Arte e ilustrações originais",
      "Personagens de jogos",
      "Fotos com poses marcantes",
    ],
  },
  {
    id: "realistic",
    name: "Realistic",
    icon: Award,
    color: "from-emerald-400 to-teal-500",
    description: "Texturas realistas de pelúcia mantendo a fidelidade ao original.",
    characteristics: [
      "Texturas de pelúcia realistas",
      "Fidelidade ao original",
      "Iluminação natural",
      "Detalhes sutis e refinados",
      "Aparência premium",
    ],
    bestFor: [
      "Retratos profissionais",
      "Fotos de alta qualidade",
      "Presentes especiais",
      "Quem quer fidelidade",
    ],
    worksWith: [
      "Fotos profissionais",
      "Boa iluminação natural",
      "Detalhes faciais visíveis",
    ],
  },
  {
    id: "mini",
    name: "Mini",
    icon: Baby,
    color: "from-rose-400 to-pink-500",
    description: "Versão em miniatura fofa com proporções super compactas.",
    characteristics: [
      "Proporções miniaturizadas",
      "Detalhes simplificados",
      "Visual super fofo",
      "Cores suaves e pastéis",
      "Formas compactas",
    ],
    bestFor: [
      "Bebês e animais pequenos",
      "Quem gosta de miniaturas",
      "Chaveiros e decoração",
      "Presentes compactos",
    ],
    worksWith: [
      "Fotos de bebês",
      "Pets pequenos",
      "Elementos individuais",
    ],
  },
];

const comparisonTable = [
  { feature: "Fidelidade ao Original", classic: "Alta", modern: "Média", cartoon: "Baixa", realistic: "Muito Alta", mini: "Média" },
  { feature: "Fofofactor", classic: "Alto", modern: "Muito Alto", cartoon: "Alto", realistic: "Médio", mini: "Muito Alto" },
  { feature: "Modernidade", classic: "Baixa", modern: "Alta", cartoon: "Média", realistic: "Média", mini: "Alta" },
  { feature: "Nostalgia", classic: "Alta", modern: "Baixa", cartoon: "Média", realistic: "Média", mini: "Alta" },
  { feature: "Versatilidade", classic: "Alta", modern: "Média", cartoon: "Alta", realistic: "Alta", mini: "Média" },
];

const recommendations = [
  {
    situation: "Primeira vez usando o Plushify",
    recommended: ["Classic Teddy", "Realistic"],
    reason: "São os mais previsíveis e funcionam bem com a maioria das fotos.",
  },
  {
    situation: "Presente para crianças",
    recommended: ["Modern Cute", "Mini"],
    reason: "Cores vibrantes e visual fofo agradam muito os pequenos.",
  },
  {
    situation: "Presente para adultos",
    recommended: ["Classic Teddy", "Realistic"],
    reason: "Sofisticação e nostalgia funcionam melhor para público adulto.",
  },
  {
    situation: "Redes sociais e perfil",
    recommended: ["Modern Cute", "Cartoon"],
    reason: "Visual marcante e artístico se destaca nas redes.",
  },
  {
    situation: "Foto de animal de estimação",
    recommended: ["Classic Teddy", "Mini"],
    reason: "Realçam a fofura natural dos pets.",
  },
  {
    situation: "Arte ou personagem ficcional",
    recommended: ["Cartoon", "Modern Cute"],
    reason: "Combinam melhor com elementos não realistas.",
  },
];

export default function StylesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Guia de Estilos</h1>
        <p className="text-muted-foreground text-lg">
          Conheça todos os estilos disponíveis e descubra qual é o ideal para você.
        </p>
      </div>

      {/* Introduction */}
      <section>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Escolha seu Estilo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              O Plushify oferece 5 estilos únicos de pelúcia, cada um com características próprias.
              Você pode experimentar quantos estilos quiser - cada um produz um resultado diferente
              da mesma foto!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Styles */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Estilos Disponíveis</h2>
        <div className="space-y-6">
          {styles.map((style) => (
            <Card key={style.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${style.color} shadow-lg`}>
                      <style.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{style.name}</CardTitle>
                      <CardDescription className="text-base mt-1">{style.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden md:inline-flex">
                    Estilo {(style.id.split("-")[0] || "STYLE").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Characteristics */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Características</h4>
                  <div className="flex flex-wrap gap-2">
                    {style.characteristics.map((char, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Melhor Para</h4>
                  <ul className="grid md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                    {style.bestFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Works With */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Funciona Melhor Com</h4>
                  <ul className="grid md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                    {style.worksWith.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Tabela Comparativa</CardTitle>
            <CardDescription>Compare os estilos lado a lado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Característica</th>
                    <th className="text-center py-3 px-4 font-semibold">Classic</th>
                    <th className="text-center py-3 px-4 font-semibold">Modern</th>
                    <th className="text-center py-3 px-4 font-semibold">Cartoon</th>
                    <th className="text-center py-3 px-4 font-semibold">Realistic</th>
                    <th className="text-center py-3 px-4 font-semibold">Mini</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr key={index} className="border-b border-dashed last:border-0">
                      <td className="py-3 px-4 font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-center">{row.classic}</td>
                      <td className="py-3 px-4 text-center">{row.modern}</td>
                      <td className="py-3 px-4 text-center">{row.cartoon}</td>
                      <td className="py-3 px-4 text-center">{row.realistic}</td>
                      <td className="py-3 px-4 text-center">{row.mini}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recomendações por Situação</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{rec.situation}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Recomendado:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.recommended.map((style, i) => (
                      <Badge key={i} className="bg-primary text-primary-foreground">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">💡 {rec.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section>
        <Card className="border-primary/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
          <CardHeader>
            <CardTitle>Dicas Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">Experimente Multiplos Estilos</p>
            <p className="text-muted-foreground">
              A mesma foto pode produzir resultados completamente diferentes dependendo do estilo.
              Não tenha medo de experimentar - cada estilo tem seu charme único!
            </p>
            <div className="h-px bg-border my-3" />
            <p className="font-medium">Combine com Qualidade Ultra</p>
            <p className="text-muted-foreground">
              Para resultados impressionantes, experimente usar a qualidade Ultra com o estilo
              Realistic ou Classic Teddy. Os detalhes ficam incríveis!
            </p>
            <div className="h-px bg-border my-3" />
            <p className="font-medium">Use para Diferentes Finalidades</p>
            <p className="text-muted-foreground">
              Modern Cute para redes sociais, Classic Teddy para presentes, Realistic para
              impressões em alta resolução. Cada situação pede um estilo!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="flex items-center justify-between p-6 rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5">
        <div>
          <h3 className="font-semibold text-lg mb-1">Pronto para escolher seu estilo?</h3>
          <p className="text-sm text-muted-foreground">
            Faça upload de uma foto e experimente todos os estilos!
          </p>
        </div>
        <Link href="/dashboard">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Sparkles className="h-4 w-4" />
            Criar Agora
          </span>
        </Link>
      </section>
    </div>
  );
}
