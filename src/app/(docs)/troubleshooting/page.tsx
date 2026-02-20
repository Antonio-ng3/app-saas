import Link from "next/link";
import { AlertCircle, CheckCircle2, HelpCircle, Wrench, Mail, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Solução de Problemas - Plushify",
  description: "Encontre soluções para problemas comuns ao usar o Plushify",
};

const problems = [
  {
    category: "Problemas de Upload",
    icon: RefreshCw,
    issues: [
      {
        problem: "A foto não faz upload",
        solutions: [
          "Verifique se o arquivo tem menos de 5MB",
          "Confirme que o formato é JPEG, PNG ou WEBP",
          "Tente outra foto para descartar problema com o arquivo",
          "Limpe o cache do navegador e tente novamente",
          "Desative extensões de adblock temporariamente",
        ],
      },
      {
        problem: "Erro de formato não suportado",
        solutions: [
          "Converta a imagem para JPEG ou PNG",
          "Se for HEIC (iPhone), use o app Fotos para converter",
          "Evite formatos como BMP, GIF ou TIFF",
          "Tente enviar a foto via outro dispositivo",
        ],
      },
      {
        problem: "Upload trava no meio",
        solutions: [
          "Verifique sua conexão com a internet",
          "Tente uma conexão diferente (WiFi vs dados móveis)",
          "Reduza o tamanho da imagem se for muito grande",
          "Feche outras abas e aplicativos que possam estar consumindo banda",
        ],
      },
    ],
  },
  {
    category: "Problemas de Geração",
    icon: Wrench,
    issues: [
      {
        problem: "A geração demora muito",
        solutions: [
          "Qualidade Ultra leva 2-3 minutos - seja paciente",
          "Verifique se há notificação de erro no dashboard",
          "Tente a qualidade Standard para ser mais rápido",
          "Horários de pico (19h-23h) podem ter mais demora",
        ],
      },
      {
        problem: "Erro durante a geração",
        solutions: [
          "Tente novamente com a mesma foto",
          "Use uma foto diferente para testar",
          "Mude a qualidade de Ultra para High ou Standard",
          "Verifique se você tem créditos disponíveis",
          "Limpe o cache do navegador",
        ],
      },
      {
        problem: "Resultado não apareceu na galeria",
        solutions: [
          "Espere até 5 minutos após a conclusão",
          "Atualize a página da galeria (F5 ou Cmd+R)",
          "Verifique se você está na página correta",
          "Use Standard ao invés de Ultra para testar",
        ],
      },
    ],
  },
  {
    category: "Problemas com Resultados",
    icon: HelpCircle,
    issues: [
      {
        problem: "Resultado muito diferente do esperado",
        solutions: [
          "Experimente um estilo diferente",
          "Use uma foto com iluminação melhor",
          "Certifique-se que o rosto está visível na foto",
          "Tente a qualidade Realistic para maior fidelidade",
          "Veja o guia de melhores fotos para dicas",
        ],
      },
      {
        problem: "Rosto não ficou bom",
        solutions: [
          "Use uma foto onde o rosto ocupa 30-50% da imagem",
          "Fotos frontais funcionam melhor que de perfil",
          "Evite fotos com óculos de sol ou cabelo cobrindo o rosto",
          "Experimente o estilo Classic Teddy ou Realistic",
        ],
      },
      {
        problem: "Cores ficaram estranhas",
        solutions: [
          "Use fotos com iluminação natural e uniforme",
          "Evite fotos com filtros aplicados",
          "Experimente o estilo Realistic",
          "Tente uma foto diferente da mesma pessoa/pet",
        ],
      },
      {
        problem: "Quero tentar novamente",
        solutions: [
          "Você pode gerar a mesma foto múltiplas vezes",
          "Cada geração pode ter pequenas variações",
          "Experimente diferentes estilos com a mesma foto",
          "Gerações em qualidade diferente também variam",
        ],
      },
    ],
  },
  {
    category: "Problemas de Conta",
    icon: AlertCircle,
    issues: [
      {
        problem: "Não consigo fazer login",
        solutions: [
          "Verifique se o email e senha estão corretos",
          "Use a opção 'Esqueci minha senha' para redefinir",
          "Tente entrar com Google se usou esse método",
          "Limpe cookies e cache do navegador",
          "Confirme se o email foi verificado",
        ],
      },
      {
        problem: "Meus créditos não aparecem",
        solutions: [
          "Faça logout e login novamente",
          "Espere até 10 minutos após a compra",
          "Verifique o email de confirmação da compra",
          "Entre em contato com o suporte se o problema persistir",
        ],
      },
      {
        problem: "Não recebi email de verificação",
        solutions: [
          "Verifique a pasta de spam/promoções",
          "Solicite um novo email de verificação",
          "Adicione plushify@email.com aos contatos",
          "Tente usar um email diferente",
        ],
      },
    ],
  },
];

const faq = [
  {
    q: "Por que minha geração falhou?",
    a: "Gerações podem falhar por vários motivos: foto com baixa qualidade, formato não suportado, problemas temporários no servidor, ou falta de créditos. Tente novamente com uma foto diferente.",
  },
  {
    q: "Posso cancelar uma geração em andamento?",
    a: "Não é possível cancelar uma geração após o início. Se precisar sair da página, a geração continuará e o resultado estará disponível na sua galeria.",
  },
  {
    q: "Por quanto tempo minhas imagens ficam salvas?",
    a: "Suas imagens ficam salvas na galeria por tempo indeterminado, enquanto sua conta estiver ativa. Você pode deletá-las a qualquer momento.",
  },
  {
    q: "Posso usar as imagens comercialmente?",
    a: "Sim! Você tem direitos comerciais sobre as imagens geradas. Consulte nossos Termos de Serviço para mais detalhes.",
  },
  {
    q: "A qualidade Ultra vale a pena?",
    a: "Para impressões ou quadros, sim. Para uso digital e redes sociais, High geralmente é suficiente e mais rápido.",
  },
];

export default function TroubleshootingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Solução de Problemas</h1>
        <p className="text-muted-foreground text-lg">
          Encontre respostas para os problemas mais comuns ao usar o Plushify.
        </p>
      </div>

      {/* Quick Fixes */}
      <section>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Soluções Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium">Antes de procurar problemas específicos, tente:</p>
            <ul className="space-y-2">
              {[
                "Atualize a página (F5 ou Cmd+R)",
                "Limpe o cache do navegador",
                "Tente outro navegador (Chrome, Firefox, Safari)",
                "Desative extensões de adblock ou privacidade",
                "Verifique sua conexão com a internet",
                "Faça logout e login novamente",
              ].map((fix, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {fix}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Problem Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Problemas por Categoria</h2>
        <div className="space-y-6">
          {problems.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.issues.map((issue, issueIndex) => (
                  <Card key={issueIndex}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        {issue.problem}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {issue.solutions.map((solution, solIndex) => (
                          <li key={solIndex} className="flex items-start gap-2">
                            <span className="text-primary font-bold">{solIndex + 1}.</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
        <div className="space-y-3">
          {faq.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  {item.q}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Mail className="h-5 w-5" />
              Ainda precisa de ajuda?
            </CardTitle>
            <CardDescription>
              Nossa equipe de suporte está pronta para ajudar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Se você tentou as soluções acima e o problema persiste, entre em contato conosco:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-500" />
                <span>Email: suporte@plushify.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">•</span>
                <span>Tempo de resposta: até 24 horas úteis</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              Ao entrar em contato, inclua: seu email, descrição do problema eprints se possível.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Docs */}
      <section className="p-6 rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5">
        <h3 className="font-semibold mb-3">Documentação Relacionada</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/getting-started">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm">
              Getting Started
            </span>
          </Link>
          <Link href="/docs/best-photos">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm">
              Guia de Melhores Fotos
            </span>
          </Link>
          <Link href="/docs/how-it-works">
            <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm">
              Como Funciona
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
