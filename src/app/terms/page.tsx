import Link from "next/link";
import { FileText, CreditCard, Shield, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Termos de Serviço - Plushify",
  description: "Termos e condições de uso do Plushify",
};

const sections = [
  {
    title: "Aceitação dos Termos",
    icon: FileText,
    content: `
      Ao criar uma conta e usar o Plushify, você concorda com estes Termos de Serviço.
      Se você não concordar com qualquer parte destes termos, não utilize nosso serviço.

      Estes termos constituem um acordo legalmente vinculativo entre você e o Plushify.
    `,
  },
  {
    title: "Conta de Usuário",
    icon: CreditCard,
    content: `
      **Responsabilidades do Usuário:**
      - Fornecer informações verdadeiras e atualizadas
      - Manter a segurança de sua senha e conta
      - Ser responsável por todas as atividades em sua conta
      - Notificar imediatamente sobre uso não autorizado

      **Proibições:**
      - Criar mais de uma conta pessoal
      - Compartilhar credenciais de acesso
      - Usar a conta de terceiros
      - Fornecer informações falsas

      Podemos suspender ou encerrar contas que violem estes termos.
    `,
  },
  {
    title: "Serviços Plushify",
    icon: Shield,
    content: `
      **O que oferecemos:**
      - Transformação de fotos em imagens de pelúcia via IA
      - Armazenamento de resultados na galeria pessoal
      - Sistema de créditos para gerações
      - Download de imagens geradas

      **Direitos sobre Gerações:**
      - Você adquire direitos comerciais sobre as imagens geradas
      - Pode usar para fins pessoais ou comerciais
      - Pode modificar e redistribuir as imagens

      **Limitações:**
      - O serviço é fornecido "como está"
      - Não garantimos resultados específicos
      - A qualidade varia conforme a foto original
    `,
  },
  {
    title: "Sistema de Créditos",
    icon: AlertTriangle,
    content: `
      **Funcionamento:**
      - Créditos são necessários para cada geração
      - 1 crédito = 1 geração de pelúcia
      - Créditos não expiram enquanto a conta estiver ativa
      - Pacotes podem ser adquiridos na seção de preços

      **Reembolsos:**
      - Créditos não utilizados podem ser reembolsados em até 7 dias
      - Gerações já consumidas não são reembolsáveis
      - Consulte nossa Política de Reembolso para detalhes
    `,
  },
  {
    title: "Conteúdo do Usuário",
    icon: CreditCard,
    content: `
      **O que você envia:**
      - Você mantém direitos sobre suas fotos originais
      - Ao enviar, você nos concede permissão para processá-las
      - Fotos são usadas apenas para gerar suas pelúcias

      **O que geramos:**
      - Você possui direitos exclusivos sobre as pelúcias geradas
      - O Plushify não reivindica direitos sobre resultados
      - Você pode usar comercialmente sem restrições

      **Conteúdo Proibido:**
      - Imagens com direitos autorais de terceiros
      - Conteúdo ilegal ou ofensivo
      - Imagens de outras pessoas sem consentimento
      - Conteúdo que viole leis aplicáveis
    `,
  },
  {
    title: "Propriedade Intelectual",
    icon: Shield,
    content: `
      **Direitos do Plushify:**
      - A plataforma, tecnologia e marcas são nossa propriedade
      - Design, textos e código são protegidos por direitos autorais
      - Estilos de pelúcia são propriedade intelectual do Plushify

      **Seus Direitos:**
      - Você mantém propriedade sobre suas fotos originais
      - Você adquire direitos completos sobre as gerações
      - Nada nestes termos afeta seus direitos autorais existentes
    `,
  },
  {
    title: "Cancelamento e Encerramento",
    icon: XCircle,
    content: `
      **Pelo Usuário:**
      - Você pode encerrar sua conta a qualquer momento
      - Créditos não utilizados serão reembolsados (prorata)
      - Dados serão mantidos por 30 dias antes da deleção permanente

      **Pelo Plushify:**
      - Podemos encerrar contas que violem os termos
      - Podemos suspender serviços para manutenção
      - Avisaremos com antecedência sobre mudanças significativas

      **Efeitos do Encerramento:**
      - Acesso à conta é revogado imediatamente
      - Dados são retidos por 30 dias (backup legal)
      - Após 30 dias, todos os dados são permanentemente deletados
    `,
  },
  {
    title: "Limitação de Responsabilidade",
    icon: AlertTriangle,
    content: `
      **Até o limite máximo permitido por lei:**
      - O Plushify não é responsável por danos indiretos ou incidentais
      - Não garantimos disponibilidade ininterrupta do serviço
      - Não nos responsabilizamos por perda de dados
      - A responsabilidade máxima é limitada ao valor pago

      **Isentos de responsabilidade:**
      - Qualidade ou satisfação com os resultados
      - Problemas técnicos de terceiros (navegadores, internet)
      - Uso não autorizado da conta por terceiros
    `,
  },
];

export default function TermsPage() {
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Termos de Serviço</h1>
            <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Bem-vindo ao Plushify. Estes termos regem o uso de nossa plataforma e serviços.
        </p>
      </div>

      {/* Agreement Notice */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Importante: Leia com Atenção</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            Ao criar uma conta no Plushify e usar nossos serviços, você concorda estes termos
            como um acordo legalmente vinculativo.
          </p>
          <p>
            Se você tiver dúvidas sobre qualquer parte destes termos, entre em contato:
            <a href="mailto:legal@plushify.com" className="text-primary ml-1">
              legal@plushify.com
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {section.content.split("\n").map((line, i) => {
                  if (line.startsWith("**")) {
                    return (
                      <strong key={i} className="text-foreground block mt-3 first:mt-0">
                        {line.replace(/\*\*/g, "")}
                      </strong>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <li key={i} className="ml-4">
                        {line.substring(2)}
                      </li>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Governing Law */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Legislação Aplicável</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Quaisquer
            disputas serão resolvidas nos tribunais competentes do foro da comarca de São Paulo, SP.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contato Legal</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Para questões legais sobre estes termos:</p>
          <p>Email: <a href="mailto:legal@plushify.com" className="text-primary">legal@plushify.com</a></p>
        </CardContent>
      </Card>

      {/* Other Policies */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Outras Políticas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground mb-3">
            Estes termos são complementados por nossas outras políticas:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            <Link href="/cookies" className="text-primary hover:underline">
              Política de Cookies
            </Link>
            <Link href="/refunds" className="text-primary hover:underline">
              Política de Reembolso
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <div className="mt-12 text-center">
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
