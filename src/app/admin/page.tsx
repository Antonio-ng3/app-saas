import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield, Users, CreditCard, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  // Check if user is authenticated
  if (!session) {
    redirect("/login")
  }

  // Check if user has admin role
  if (session.user.platformRole !== "admin") {
    redirect("/dashboard")
  }

  const stats = [
    {
      title: "Total de Usuários",
      value: "0",
      description: "Usuários cadastrados",
      icon: Users,
    },
    {
      title: "Assinantes",
      value: "0",
      description: "Usuários com planos ativos",
      icon: CreditCard,
    },
    {
      title: "Receita Mensal",
      value: "R$ 0",
      description: "Receita recorrente mensal",
      icon: BarChart3,
    },
  ]

  const actions = [
    {
      title: "Gerenciar Usuários",
      description: "Ver e gerenciar todos os usuários da plataforma",
      icon: Users,
      href: "/admin/users",
      variant: "default" as const,
    },
    {
      title: "Configurações",
      description: "Configurar definições da plataforma",
      icon: Settings,
      href: "/admin/settings",
      variant: "outline" as const,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Painel Administrativo
          </h1>
        </div>
        <p className="text-muted-foreground">
          Bem-vindo, {session.user.name}. Você tem acesso de administrador.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant={action.variant} className="w-full">
                  <Link href={action.href}>Acessar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Informações de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Email:</strong> {session.user.email}
          </p>
          <p>
            <strong>Função:</strong>{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
              Admin
            </span>
          </p>
          <p className="text-muted-foreground">
            Você tem permissão total para gerenciar a plataforma.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
