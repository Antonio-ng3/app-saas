import Link from "next/link";
import { RotateCcw, Clock, CheckCircle2, XCircle, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Política de Reembolso - Plushify",
  description: "Nossa política de reembolso e satisfação garantida",
};

const refundScenarios = [
  {
    category: "Créditos Não Utilizados",
    icon: CheckCircle2,
    refundable: true,
    timeframe: "Até 7 dias após a compra",
    details: "Créditos que não foram usados podem ser reembolsados integralmente",
  },
  {
    category: "Gerações Realizadas",
    icon: XCircle,
    refundable: false,
    timeframe: "Não aplicável",
    details: "Gerações já consumidas não são reembolsáveis (serviço executado)",
  },
  {
    category: "Problema Técnico",
    icon: AlertTriangle,
    refundable: true,
    timeframe: "Até 14 dias após a ocorrência",
    details: "Se a geração falhou por problema técnico na plataforma",
  },
  {
    category: "Resultado Insatisfatório",
    icon: RotateCcw,
    refundable: "condicional",
    timeframe: "Até 7 dias após a geração",
    details: "Analisamos caso a caso. Garantimos 1 nova geração grátis se质量问题",
  },
];

const howToRequest = [
  {
    step: 1,
    title: "Entre em Contato",
    description: "Envie um email para refunds@plushify.com com seu email cadastrado",
  },
  {
    step: 2,
    title: "Descreva o Motivo",
    description: "Explique detalhadamente o motivo do pedido de reembolso",
  },
  {
    step: 3,
    title: "Aguarde Análise",
    description: "Nossa equipe analisará seu pedido em até 3 dias úteis",
  },
  {
    step: 4,
    title: "Receba Resposta",
    description: "Você receberá a decisão e instruções para o reembolso (se aprovado)",
  },
];

const exceptions = [
  {
    title: "Violação dos Termos",
    description: "Contas banidas por violação dos termos de serviço não recebem reembolso",
  },
  {
    title: "Uso Fraudulento",
    description: "Atividades fraudulentas ou abusos do sistema não são reembolsáveis",
  },
  {
    title: "Promoções e Descontos",
    description: "Créditos obtidos em promoções podem ter termos diferentes de reembolso",
  },
];

export default function RefundsPage() {
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
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Política de Reembolso</h1>
            <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Nossa garantia de satisfação e política de reembolso para créditos e serviços.
        </p>
      </div>

      {/* Guarantee Banner */}
      <Card className="mb-8 border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-6 w-6" />
            Garantia de Satisfação
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Queremos que você esteja completamente satisfeito com o Plushify. Se você não estiver
            feliz com sua experiência, entre em contato conosco. Faremos o possível para resolver
            qualquer problema ou processar um reembolso quando aplicável.
          </p>
        </CardContent>
      </Card>

      {/* Refund Scenarios */}
      <h2 className="text-2xl font-bold mb-4">Cenários de Reembolso</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {refundScenarios.map((scenario, index) => (
          <Card
            key={index}
            className={
              scenario.refundable === true
                ? "border-green-500/20"
                : scenario.refundable === false
                ? "border-red-500/20"
                : "border-amber-500/20"
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <scenario.icon className="h-5 w-5 text-primary" />
                  {scenario.category}
                </CardTitle>
                {typeof scenario.refundable === "boolean" && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      scenario.refundable
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {scenario.refundable ? "Reembolsável" : "Não Reembolsável"}
                  </span>
                )}
                {scenario.refundable === "condicional" && (
                  <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded">
                    Condicional
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground">{scenario.details}</p>
              <p className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {scenario.timeframe}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How to Request */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Como Solicitar Reembolso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {howToRequest.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  {step.step}
                </div>
                <div>
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What to Include */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informações Necessárias</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-3">Para processar seu pedido mais rápido, inclua:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>Email cadastrado na conta</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>Nome completo usado na compra</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>Data da compra (aproximada se não souber)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>Descrição detalhada do problema ou motivo do reembolso</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <span>ID da transação (se disponível no email de confirmação)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Processing Time */}
      <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Tempo de Processamento
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li>• Análise do pedido: até 3 dias úteis</li>
            <li>• Aprovação e processamento: até 5 dias úteis</li>
            <li>• Crédito na conta/fatura: 5-10 dias úteis (depende da administradora)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Exceptions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Exceções à Política
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exceptions.map((exception, index) => (
            <div key={index} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <p className="font-semibold text-sm">{exception.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{exception.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Partial Refunds */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reembolsos Parciais</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Em alguns casos, podemos oferecer reembolsos parciais:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Se você usou apenas parte dos créditos comprados</li>
            <li>• Em situações de problemas técnicos que afetaram parcialmente o serviço</li>
            <li>• Como compensação por inconvenientes causados</li>
          </ul>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Entre em Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            Para solicitar um reembolso ou tirar dúvidas:
          </p>
          <p className="font-mono bg-muted px-3 py-2 rounded inline-block">
            refunds@plushify.com
          </p>
        </CardContent>
      </Card>

      {/* Related Links */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/terms" className="text-primary hover:underline text-sm">
            Termos de Serviço
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/privacy" className="text-primary hover:underline text-sm">
            Política de Privacidade
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
