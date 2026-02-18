# Requisitos: Gerador de Pelúcias com IA

## Visão Geral

Transformar um projeto boilerplate em uma aplicação SaaS que permite aos usuários fazer upload de imagens (de si mesmos, amigos, família ou animais de estimação) e convertê-las em pelúcias usando um modelo de IA.

## Requisitos Iniciais do Usuário

1. **Landing Page Bonita**: Mostrar o resultado final com imagem de antes/depois e texto otimizado para SEO
2. **Autenticação**: Usuários devem conseguir fazer login
3. **Dashboard**: Painel onde usuários podem gerar imagens
4. **Galeria**: Imagens geradas armazenadas na galeria do usuário
5. **Documentação Pública**: Como usar a aplicação
6. **Documentos Legais**: Páginas de privacidade, termos, etc.

**Nota Importante**: Esta fase foca **apenas em componentes de UI**, sem lógica de backend.

---

## Requisitos Funcionais

### 1. Landing Page (`/`)

- [ ] Hero section com título atrativo e subtítulo descritivo
- [ ] Slider interativo de antes/depois mostrando transformação
- [ ] Botão CTA principal "Gerar Minha Pelúcia"
- [ ] Botão CTA secundário "Ver Exemplos"
- [ ] Seção de recursos (features) em grid
- [ ] Seção "Como Funciona" com passos numerados
- [ ] Preview da galeria com exemplos de pelúcias
- [ ] Seção de preços (placeholder) com 3 tiers
- [ ] Seção de testemunhos (placeholder)
- [ ] FAQ com accordion (6-8 perguntas)
- [ ] CTA final com banner destacado
- [ ] SEO otimizado (meta tags, Open Graph, Schema.org)

### 2. Autenticação

- [ ] Página de Login (`/login`) - já existe, manter
- [ ] Página de Registro (`/register`) - já existe, manter
- [ ] Recuperação de Senha (`/forgot-password`) - já existe, manter
- [ ] Reset de Senha (`/reset-password`) - já existe, manter

### 3. Dashboard (`/dashboard`)

- [ ] Área de upload de imagens com drag-and-drop
- [ ] Preview da imagem carregada
- [ ] Opção de remover imagem carregada
- [ ] Seleção de estilo de pelúcia (cards visuais)
- [ ] Controle de qualidade (Standard/High/Ultra)
- [ ] Display de créditos restantes
- [ ] Botão "Gerar Pelúcia" (validado)
- [ ] Status de geração com barra de progresso
- [ ] Mini galeria de gerações recentes (últimas 4-6)
- [ ] Link para galeria completa

### 4. Galeria (`/gallery`)

- [ ] Grid responsivo de pelúcias geradas
- [ ] Hover overlay com ações (Ver, Download, Delete, Share)
- [ ] Badge de data de criação
- [ ] Badge de estilo usado
- [ ] Ícone de favorito (toggle)
- [ ] Modal de preview em tamanho completo
- [ ] Toggle before/after no modal
- [ ] Navegação (anterior/próximo) no modal
- [ ] Ações: Download, Share, Delete
- [ ] Empty state amigável
- [ ] Filtros por estilo e data

### 5. Documentação (`/docs/*`)

- [ ] Guia de Introdução (`/docs/getting-started`)
- [ ] Como Funciona (`/docs/how-it-works`)
- [ ] Melhores Fotos (`/docs/best-photos`)
- [ ] Guia de Estilos (`/docs/styles`)
- [ ] Solução de Problemas (`/docs/troubleshooting`)
- [ ] Sidebar de navegação
- [ ] Breadcrumbs
- [ ] Campo de busca (placeholder)

### 6. Páginas Legais

- [ ] Política de Privacidade (`/privacy`)
- [ ] Termos de Serviço (`/terms`)
- [ ] Política de Cookies (`/cookies`)
- [ ] Política de Reembolso (`/refunds`)
- [ ] Data de última atualização

### 7. Navegação

#### Header
- [ ] Logo com branding da aplicação
- [ ] Links de navegação: Features, Gallery, Pricing, Docs
- [ ] Dropdown para documentação
- [ ] Menu mobile (hamburger)
- [ ] Profile de usuário e theme toggle
- [ ] Link para dashboard quando autenticado

#### Footer
- [ ] Coluna Product: Features, Pricing, Gallery
- [ ] Coluna Resources: Docs, Blog, Support
- [ ] Coluna Company: About, Contact
- [ ] Coluna Legal: Privacy, Terms, Cookies
- [ ] Copyright e redes sociais

---

## Requisitos Não-Funcionais

### Design & UX

- [ ] Interface responsiva (mobile, tablet, desktop)
- [ ] Suporte a modo escuro/claro
- [ ] Animações suaves e micro-interações
- [ ] Feedback visual para todas as ações
- [ ] Loading states Skeleton/Spinner
- [ ] Toast notifications para feedback

### Acessibilidade

- [ ] Navegação por teclado em todos os elementos interativos
- [ ] ARIA labels apropriados
- [ ] Contraste WCAG AA compliance
- [ ] Alt text para todas as imagens
- [ ] Focus indicators visíveis
- [ ] Screen reader friendly

### Performance

- [ ] Otimização de imagens (Next.js Image)
- [ ] Lazy loading para galeria
- [ ] Code splitting por rota
- [ ] Minimal JavaScript para UI-only

### SEO

- [ ] Meta tags otimizadas
- [ ] Open Graph images
- [ ] Twitter Cards
- [ ] Schema.org markup (WebApplication, FAQPage, Product)
- [ ] Sitemap.xml
- [ ] Robots.txt

### Browser Compatibility

- [ ] Chrome/Edge (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (últimas 2 versões)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Critérios de Aceite

### Landing Page

- [ ] Usuario vê hero com slider before/after funcional
- [ ] Slider funciona com mouse drag e touch swipe
- [ ] Todas as seções estão presentes e responsivas
- [ ] CTAs redirecionam corretamente (login/dashboard)
- [ ] FAQ accordion expande/colapsa corretamente
- [ ] Meta tags estão configuradas corretamente

### Dashboard

- [ ] Usuário pode fazer drag-and-drop de imagem
- [ ] Preview da imagem aparece após upload
- [ ] Botão de remover funciona
- [ ] Seleção de estilo visual e funcional
- [ ] Créditos são exibidos
- [ ] Botão "Gerar" habilita apenas com imagem selecionada
- [ ] Status de geração exibe estado (mock)
- [ ] Mini galeria mostra itens recentes

### Galeria

- [ ] Galeria exibe grid responsivo
- [ ] Hover overlay mostra ações corretamente
- [ ] Click abre modal de preview
- [ ] Modal navega entre itens
- [ ] Botões de ação funcionam visualmente
- [ ] Empty state aparece quando vazio
- [ ] Filtros estão presentes (placeholder)

### Documentação

- [ ] Todas as páginas de docs são acessíveis
- [ ] Sidebar navega entre páginas
- [ ] Breadcrumbs mostram caminho correto
- [ ] Markdown renderiza corretamente
- [ ] Código syntax highlight (se aplicável)

### Páginas Legais

- [ ] Todas as páginas legais são acessíveis via footer
- [ ] Layout é legível e profissional
- [ ] Links funcionam corretamente

### Geral

- [ ] Modo escuro funciona em todas as páginas
- [ ] Navegação funciona em mobile
- [ ] Não há erros de console no navegador
- [ ] Não há erros de TypeScript
- [ ] Lint passa sem warnings
- [ ] Todas as telas são responsivas

---

## Requisitos de Mock Data

Como esta fase é UI-only, os seguintes dados mock serão utilizados:

- [ ] Imagens placeholder de Unsplash/Pexels para exemplos
- [ ] Dados mock de before/after (2-3 pares)
- [ ] Estado mock de créditos (ex: 5 créditos restantes)
- [ ] Galeria mock com 6-12 pelúcias de exemplo
- [ ] Dados mock de testemunhos
- [ ] Dados mock de preços

---

## Tecnologia

- **Framework**: Next.js 16 com App Router
- **UI**: shadcn/ui + Tailwind CSS 4
- **Ícones**: lucide-react
- **Dark Mode**: next-themes
- **Markdown**: react-markdown
- **Imagens**: Next.js Image component

---

## Dependências Adicionais Necessárias

```bash
# Componentes shadcn/ui a adicionar
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
```

---

## Escopo Fora do Escopo

### Fora do Escopo (Fase Atual)
- Implementação real de geração de IA
- Backend de processamento de imagens
- Sistema de pagamentos
- Sistema de créditos real
- Upload real para storage
- Banco de dados de galeria
- Autenticação real (já existe, será reutilizada)

### Futuras Fases
- Integração com API de IA
- Sistema de créditos funcional
- Integração de pagamentos
- Analytics e tracking
- Testes automatizados
