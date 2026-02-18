# Plano de Implementação: Gerador de Pelúcias com IA

**Versão**: 1.0
**Data**: 18 de Fevereiro de 2026
**Foco**: UI Components Only (Backend em fase futura)

---

## Visão Geral das Fases

| Fase | Descrição | Estimativa |
|------|-----------|------------|
| 1 | Setup e Componentes Base | ~2h |
| 2 | Landing Page Completa | ~4h |
| 3 | Dashboard UI | ~3h |
| 4 | Galeria Completa | ~3h |
| 5 | Documentação | ~2h |
| 6 | Páginas Legais | ~1h |
| 7 | Navegação Final | ~2h |
| 8 | Polish e Verificação | ~1h |

**Total Estimado**: ~18 horas

---

## Fase 1: Setup e Componentes Base ✅ COMPLETA

### 1.1 Adicionar Componentes shadcn/ui

- [x] Adicionar componente Accordion
  ```bash
  npx shadcn@latest add accordion
  ```
- [x] Adicionar componente Tabs
  ```bash
  npx shadcn@latest add tabs
  ```
- [x] Adicionar componente Tooltip
  ```bash
  npx shadcn@latest add tooltip
  ```
- [x] Verificar todos os componentes instalados em `src/components/ui/`

### 1.2 Criar Estrutura de Pastas

- [x] Criar pasta `src/components/gallery/`
- [x] Criar pasta `src/components/forms/`
- [x] Criar pasta `src/app/(docs)/`
- [x] Criar pasta `public/images/examples/` (para mock images)

### 1.3 Componentes Base Reutilizáveis

#### Before/After Slider
- [x] Criar `src/components/before-after-slider.tsx`
  - [x] Componente Client com drag interaction
  - [x] Touch support para mobile
  - [x] Labels "Original" e "Plush"
  - [x] Responsivo (full-width mobile, max-width desktop)
  - [x] Keyboard accessibility (setas)

#### Image Upload Zone
- [x] Criar `src/components/image-upload-zone.tsx`
  - [x] Drag-and-drop visual
  - [x] Click to browse
  - [x] Preview da imagem
  - [x] Botão remove
  - [x] Indicador de tamanho máximo
  - [x] Error state visual

#### Style Selector
- [x] Criar `src/components/style-selector.tsx`
  - [x] Cards com radio button pattern
  - [x] Visual preview de cada estilo
  - [x] Hover e focus states
  - [x] 5 estilos: Classic Teddy, Modern Cute, Cartoon, Realistic, Mini

#### Generation Status
- [x] Criar `src/components/generation-status.tsx`
  - [x] Skeleton/Spinner states
  - [x] Barra de progresso (0-100%)
  - [x] Textos de status animados
  - [x] Tempo estimado
  - [x] States: Idle, Analyzing, Generating, Complete, Error

---

## Fase 2: Landing Page (`src/app/page.tsx`) ✅ COMPLETA

### 2.1 Metadata e SEO

- [x] Atualizar `src/app/layout.tsx`
  - [x] Title: "Plushify - Transforme Suas Fotos em Pelúcias Fofas"
  - [x] Description otimizada
  - [x] Keywords array
  - [x] Open Graph image
  - [x] Twitter Card config
  - [x] Schema.org WebApplication markup

### 2.2 Hero Section

- [x] Criar hero com gradient text
- [x] Adicionar Before/After Slider
  - [x] Configurar com imagens mock
  - [x] Testar drag interaction
  - [x] Testar touch interaction
- [x] Botão CTA principal ("Gerar Minha Pelúcia")
  - [x] Link para `/dashboard` ou `/register`
- [x] Botão CTA secundário ("Ver Exemplos")
  - [x] Scroll suave para seção de galeria

### 2.3 Features Section

- [x] Criar grid de features (3x2 responsivo)
- [x] Card: "Transformação por IA" (ícone Sparkles)
- [x] Card: "Múltiplos Estilos" (ícone Palette)
- [x] Card: "Alta Resolução" (ícone ImageIcon)
- [x] Card: "Geração Rápida" (ícone Zap)
- [x] Card: "Download & Compartilhe" (ícone Download)
- [x] Card: "Armazenamento Seguro" (ícone Shield)

### 2.4 How It Works Section

- [x] Criar 4 cards de passos numerados
- [x] Passo 1: "Faça Upload" (Upload icon)
- [x] Passo 2: "Escolha o Estilo" (Palette icon)
- [x] Passo 3: "Gere a Pelúcia" (Sparkles icon)
- [x] Passo 4: "Baixe o Resultado" (Download icon)
- [x] Linhas conectando passos (desktop only)

### 2.5 Gallery Preview Section

- [x] Grid responsivo de 6-8 exemplos
- [x] Hover overlay com badge "Original vs Plush"
- [x] Click abre modal (Dialog component)
- [x] Botão "Ver Mais Exemplos"

### 2.6 Pricing Section (Placeholder)

- [x] Card Free (1 crédito)
- [x] Card Pro (R$29/mo, 50 créditos)
  - [x] Badge "Mais Popular"
- [x] Card Enterprise (custom)
  - [x] Botão "Fale Conosco"

### 2.7 Testimonials Section (Placeholder)

- [x] Grid de 3 testemunhos
- [x] Cada card: Avatar, nome, estrelas, citação
- [x] Background gradient accent

### 2.8 FAQ Section

- [x] Accordion com 6-8 perguntas
  - [x] "Que tipo de fotos funcionam melhor?"
  - [x] "Quanto tempo leva a geração?"
  - [x] "Posso usar comercialmente?"
  - [x] "E se não ficar satisfeito?"
  - [x] "Meus dados estão seguros?"
  - [x] "Vocês armazenam minhas fotos?"
  - [x] "Quais formatos são aceitos?"
  - [x] "Posso cancelar meu plano?"

### 2.9 Final CTA Section

- [x] Banner com gradient background
- [x] Texto: "Pronto para criar sua pelúcia?"
- [x] Botão grande "Comece Grátis"

---

## Fase 3: Dashboard UI (`src/app/dashboard/page.tsx`) ✅ COMPLETA

### 3.1 Layout

- [x] Criar layout de duas colunas
  - [x] Esquerda: Controles (40%)
  - [x] Direita: Status/Galeria (60%)
- [x] Responsivo para mobile (single column)

### 3.2 Coluna Esquerda - Upload e Controles

#### Upload Area
- [x] Integrar `ImageUploadZone` component
- [x] Drag-and-drop funcional
- [x] Preview de imagem carregada
- [x] Botão "Remover Imagem"
- [x] Indicador "Max 5MB"

#### Style Selection
- [x] Integrar `StyleSelector` component
- [x] 5 opções de estilo em cards
- [x] Radio button pattern

#### Quality Toggle
- [x] Toggle de qualidade
  - [x] Standard (padrão)
  - [x] High
  - [x] Ultra
- [x] Badge mostrando seleção

#### Credits Display
- [x] Mostrar créditos restantes
- [x] Barra de progresso visual
- [x] Link "Comprar Mais"

#### Generate Button
- [x] Botão grande "Gerar Pelúcia"
- [x] Disabled state quando sem imagem
- [x] Loading state durante geração

### 3.3 Coluna Direita - Status e Galeria

#### Generation Status
- [x] Integrar `GenerationStatus` component
- [x] States: Idle, Analyzing, Generating, Complete
- [x] Barra de progresso
- [x] Textos de status animados

#### Recent Gallery
- [x] Grid 2x2 de últimas gerações
- [x] Thumbnail com status badge
- [x] Link "Ver Toda a Galeria"
- [x] Empty state

---

## Fase 4: Galeria (`src/app/gallery/page.tsx`) ✅ COMPLETA

### 4.1 Gallery Grid Component

- [x] Criar `src/components/gallery/gallery-grid.tsx`
- [x] Masonry ou grid responsivo
  - [x] 3 colunas (desktop >1024px)
  - [x] 2 colunas (tablet 640-1024px)
  - [x] 1 coluna (mobile <640px)
- [x] Gaps entre imagens

### 4.2 Gallery Item Card

- [x] Thumbnail da pelúcia
- [x] Hover overlay com actions:
  - [x] Botão Ver (eye icon)
  - [x] Botão Download (download icon)
  - [x] Botão Delete (trash icon)
  - [x] Botão Share (share icon)
- [x] Badge de data de criação
- [x] Badge de estilo usado
- [x] Ícone de favorito (toggle)

### 4.3 Image Preview Modal

- [x] Criar `src/components/gallery/image-preview-modal.tsx`
- [x] Usar Dialog component existente
- [x] Imagem em tamanho completo
- [x] Toggle Before/After (se original disponível)
- [x] Botões de ação:
  - [x] Download
  - [x] Share
  - [x] Delete (com confirmação)
- [x] Setas navegação (anterior/próximo)
- [x] Teclado: ESC fecha, setas navegam

### 4.4 Gallery Page Layout

- [x] Integrar `GalleryGrid` component
- [x] Filtros por estilo
- [x] Filtro por data
- [x] Empty state amigável
- [x] Loading state (Skeleton)

### 4.5 Mock Data

- [x] Criar array de pelúcias mock (6-12 itens)
- [x] Cada item com:
  - [x] ID único
  - [x] URL da imagem
  - [x] Data de criação
  - [x] Estilo usado
  - [x] Favorito (boolean)
  - [x] URL original (para before/after)

---

## Fase 5: Documentação

### 5.1 Layout de Documentação

- [ ] Criar `src/app/(docs)/layout.tsx`
  - [ ] Sidebar de navegação
  - [ ] Área de conteúdo principal
  - [ ] Breadcrumbs
  - [ ] Campo de busca (placeholder)

### 5.2 Getting Started (`/docs/getting-started`)

- [ ] Criar `src/app/(docs)/getting-started/page.tsx`
- [ ] Seção: "O que é Plushify?"
- [ ] Seção: "Criando sua conta"
- [ ] Seção: "Sua primeira pelúcia"
  - [ ] Passo 1: Upload
  - [ ] Passo 2: Escolha o estilo
  - [ ] Passo 3: Gere
  - [ ] Passo 4: Baixe
- [ ] Seção: "Dicas para melhores resultados"

### 5.3 How It Works (`/docs/how-it-works`)

- [ ] Criar `src/app/(docs)/how-it-works/page.tsx`
- [ ] Explicação simplificada da tecnologia
- [ ] Como a IA transforma fotos
- [ ] Tempo de processamento
- [ ] Limitações

### 5.4 Best Photos (`/docs/best-photos`)

- [ ] Criar `src/app/(docs)/best-photos/page.tsx`
- [ ] Guia de qualidade de imagem
- [ ] Do's and Don'ts visuais
- [ ] Iluminação ideal
- [ ] Composição recomendada
- [ ] Formatos aceitos

### 5.5 Styles Guide (`/docs/styles`)

- [ ] Criar `src/app/(docs)/styles/page.tsx`
- [ ] Cada estilo com exemplo visual
- [ ] Descrição do resultado esperado
- [ ] Fotos recomendadas por estilo
- [ ] Tabela comparativa

### 5.6 Troubleshooting (`/docs/troubleshooting`)

- [ ] Criar `src/app/(docs)/troubleshooting/page.tsx`
- [ ] FAQ com problemas comuns
- [ ] Soluções passo a passo
- [ ] Quando contatar suporte
- [ ] Botão "Contact Support"

---

## Fase 6: Páginas Legais

### 6.1 Privacy Policy (`/privacy`)

- [ ] Criar `src/app/privacy/page.tsx`
- [ ] Seções padrão:
  - [ ] Informações coletadas
  - [ ] Uso das informações
  - [ ] Compartilhamento
  - [ ] Cookies
  - [ ] Seus direitos
  - [ ] Contato
- [ ] Data de última atualização

### 6.2 Terms of Service (`/terms`)

- [ ] Criar `src/app/terms/page.tsx`
- [ ] Seções padrão:
  - [ ] Aceitação dos termos
  - [ ] Conta de usuário
  - [ ] Serviços
  - [ ] Pagamentos
  - [ ] Conteúdo do usuário
  - [ ] Propriedade intelectual
  - [ ] Cancelamento
  - [ ] Limitação de responsabilidade
- [ ] Data de última atualização

### 6.3 Cookie Policy (`/cookies`)

- [ ] Criar `src/app/cookies/page.tsx`
- [ ] Explicação de cookies usados
- [ ] Tipos de cookies
- [ ] Como gerenciar
- [ ] Third-party cookies

### 6.4 Refund Policy (`/refunds`)

- [ ] Criar `src/app/refunds/page.tsx`
- [ ] Política baseada em créditos
- [ ] Garantia de satisfação
- [ ] Processo de solicitação
- [ ] Prazos

---

## Fase 7: Navegação

### 7.1 Header Update

- [ ] Atualizar `src/components/site-header.tsx`
- [ ] Novo logo com branding
- [ ] Links desktop:
  - [ ] Features (anchor link)
  - [ ] Gallery (link)
  - [ ] Pricing (anchor link)
  - [ ] Docs (dropdown)
- [ ] Links mobile:
  - [ ] Menu hamburger
  - [ ] Slide-out ou dropdown
- [ ] Manter profile e theme toggle

### 7.2 Footer Update

- [ ] Atualizar `src/components/site-footer.tsx`
- [ ] Layout multi-coluna:
  - [ ] Product (Features, Pricing, Gallery)
  - [ ] Resources (Docs, Blog, Support)
  - [ ] Company (About, Contact)
  - [ ] Legal (Privacy, Terms, Cookies)
- [ ] Bottom row:
  - [ ] Copyright
  - [ ] Social links
- [ ] Responsivo (4→2→1 colunas)

### 7.3 Navigation Menu Component

- [ ] Criar `src/components/mobile-nav-menu.tsx`
- [ ] Sheet ou Drawer pattern
- [ ] Links organizados por seção
- [ ] Animação de entrada/saída

---

## Fase 8: Polish e Verificação

### 8.1 Dark Mode

- [ ] Testar todas as páginas em dark mode
- [ ] Ajustar contraste onde necessário
- [ ] Verificar gradientes em ambos os temas
- [ ] Testar transições suaves

### 8.2 Responsividade

- [ ] Testar em mobile (<640px)
- [ ] Testar em tablet (640-1024px)
- [ ] Testar em desktop (>1024px)
- [ ] Ajustar breakpoints se necessário

### 8.3 Acessibilidade

- [ ] Verificar navegação por teclado
- [ ] Verificar ARIA labels
- [ ] Testar com screen reader
- [ ] Verificar contraste WCAG AA
- [ ] Verificar focus indicators

### 8.4 Performance

- [ ] Otimizar imagens (Next.js Image)
- [ ] Verificar Lighthouse score
- [ ] Lazy loading implementado
- [ ] Sem memory leaks

### 8.5 Validação Final

- [ ] Executar `npm run lint` - sem erros
- [ ] Executar `npm run typecheck` - sem erros
- [ ] Testar todas as rotas
- [ ] Verificar console sem erros
- [ ] Testar em múltiplos browsers
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
- [ ] Testar em mobile (Chrome Mobile, Safari)

---

## Checklist Final

### Landing Page
- [ ] Hero section com slider before/after
- [ ] Features grid (6 cards)
- [ ] How it works (4 passos)
- [ ] Gallery preview (6-8 exemplos)
- [ ] Pricing cards (3 tiers)
- [ ] Testimonials (3 cards)
- [ ] FAQ accordion (6-8 perguntas)
- [ ] Final CTA banner

### Dashboard
- [x] Upload zone drag-and-drop
- [x] Style selector (5 opções)
- [x] Quality toggle
- [x] Credits display
- [x] Generate button (validado)
- [x] Generation status
- [x] Mini galeria recente

### Galeria
- [x] Grid responsivo
- [x] Hover overlay com ações
- [x] Modal de preview
- [x] Navegação anterior/próximo
- [x] Empty state
- [x] Filtros

### Documentação
- [ ] Getting started
- [ ] How it works
- [ ] Best photos
- [ ] Styles guide
- [ ] Troubleshooting
- [ ] Sidebar e breadcrumbs

### Legal
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy
- [ ] Refund policy

### Navegação
- [ ] Header atualizado
- [ ] Footer expandido
- [ ] Menu mobile
- [ ] Todos os links funcionando

### Geral
- [ ] Dark mode OK
- [ ] Responsivo OK
- [ ] Acessível OK
- [ ] Lint pass
- [ ] Typecheck pass
- [ ] Console sem erros
- [ ] Cross-browser OK

---

## Próximos Passos (Fora desta fase)

- [ ] Integração com API de IA
- [ ] Sistema de créditos funcional
- [ ] Sistema de pagamentos
- [ ] Upload real para storage
- [ ] Banco de dados de galeria
- [ ] Testes automatizados
- [ ] Analytics e tracking
