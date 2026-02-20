import Link from "next/link";
import { Shield, Eye, Cookie, User, Mail, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Política de Privacidade - Plushify",
  description: "Nossa política de privacidade e proteção de dados",
};

const sections = [
  {
    title: "Informações que Coletamos",
    icon: Eye,
    content: `
      **Informações de Conta:**
      - Nome, email e senha (ou autenticação via Google)
      - Foto de perfil (opcional)

      **Informações de Uso:**
      - Fotos enviadas para geração de pelúcias
      - Estilos e configurações escolhidas
      - Histórico de gerações

      **Dados Técnicos:**
      - Endereço IP
      - Tipo de navegador e dispositivo
      - Logs de acesso para segurança
    `,
  },
  {
    title: "Como Usamos suas Informações",
    icon: Shield,
    content: `
      **Para fornecer o serviço:**
      - Processar suas fotos e gerar pelúcias
      - Armazenar seus resultados na galeria
      - Gerenciar seus créditos

      **Para melhorar o serviço:**
      - Analisar padrões de uso
      - Desenvolver novos estilos e funcionalidades

      **Para comunicação:**
      - Enviar notificações sobre gerações
      - Comunicar atualizações do serviço
      - Suporte ao cliente
    `,
  },
  {
    title: "Compartilhamento de Dados",
    icon: Flag,
    content: `
      **Não vendemos suas informações pessoais.**

      Compartilhamos dados apenas nas seguintes situações:
      - Com prestadores de serviço essenciais (hospedagem, IA)
      - Para cumprir obrigações legais
      - Com sua permissão explícita

      **Fotos enviadas:**
      - São usadas exclusivamente para gerar sua pelúcia
      - Não são compartilhadas com terceiros
      - Não são usadas para treinamento de IA
      - Ficam disponíveis apenas na sua galeria privada
    `,
  },
  {
    title: "Cookies e Tecnologias",
    icon: Cookie,
    content: `
      **Usamos os seguintes tipos de cookies:**
      - **Essenciais:** necessários para o funcionamento
      - **Autenticação:** mantêm sua sessão ativa
      - **Preferências:** salvam tema (dark/light mode)
      - **Analytics:** entendem como o serviço é usado

      Você pode gerenciar cookies nas configurações do navegador.
    `,
  },
  {
    title: "Seus Direitos",
    icon: User,
    content: `
      Você tem direito a:
      - **Acesso:** saber quais dados temos sobre você
      - **Correção:** atualizar informações incorretas
      - **Exclusão:** solicitar remoção de dados
      - **Portabilidade:** receber seus dados em formato estruturado
      - **Oposição:** objeção a processamento específico

      Para exercer esses direitos, entre em contato: privacy@plushify.com
    `,
  },
  {
    title: "Contato",
    icon: Mail,
    content: `
      Para dúvidas sobre privacidade ou para exercer seus direitos:

      **Email:** privacy@plushify.com
      **Tempo de resposta:** até 30 dias

      Para denúncias de violação de dados:
      **Email:** dpo@plushify.com
    `,
  },
];

export default function PrivacyPage() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Política de Privacidade</h1>
            <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Sua privacidade é importante para nós. Esta política descreve como o Plushify coleta,
          usa e protege suas informações pessoais.
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Compromisso com sua Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            O Plushify leva a sério a proteção dos seus dados. Desenvolvemos nossa plataforma com
            privacidade em mente desde o início, seguindo as melhores práticas e regulamentações
            internacionais, incluindo LGPD e GDPR.
          </p>
          <p>
            Suas fotos e informações pessoais são tratadas com total confidencialidade e usadas
            exclusivamente para proporcionar a melhor experiência possível.
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

      {/* Data Security */}
      <Card className="mt-8 border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Shield className="h-5 w-5" />
            Segurança dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Implementamos medidas rigorosas de segurança para proteger suas informações:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Criptografia SSL em todas as conexões</li>
            <li>• Armazenamento criptografado de senhas</li>
            <li>• Servidores em data centers certificados</li>
            <li>• Acesso restrito a dados pessoais</li>
            <li>• Backups regulares e testados</li>
            <li>• Monitoramento contínuo de segurança</li>
          </ul>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Retenção de Dados</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>• **Fotos e gerações:** mantidas enquanto sua conta estiver ativa</li>
            <li>• **Dados de conta:** mantidos enquanto sua conta existir</li>
            <li>• **Logs de sistema:** mantidos por 90 dias</li>
            <li>• Ao deletar sua conta, todos os dados pessoais são removidos em até 30 dias</li>
          </ul>
        </CardContent>
      </Card>

      {/* Children Privacy */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Privacidade de Crianças</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            O Plushify não é direcionado a crianças menores de 13 anos. Não coletamos
            intencionalmente informações de crianças. Se descobrirmos que coletamos dados de
            uma criança, tomaremos medidas para remover essas informações.
          </p>
          <p>
            Pais responsáveis podem criar contas e gerar pelúcias de seus filhos menores,
            desde que supervisionem o uso.
          </p>
        </CardContent>
      </Card>

      {/* Changes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Alterações nesta Política</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos usuários sobre
            mudanças significativas via email ou aviso na plataforma. O uso contínuo do
            serviço após alterações constitui aceitação da nova política.
          </p>
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
