# Requirements: Inngest Integration for Image Generation

## Overview

Integrar o Inngest para orquestrar a geração de imagens de pelúcia em background, adicionando observabilidade completa, retries automáticos e controle de concorrência por usuário.

## Problem Statement

O fluxo atual tem sérias limitações:
- A geração é **síncrona** — o browser fica bloqueado ~30s esperando a resposta
- **Sem observabilidade** — não há como ver o status de uma geração em andamento, histórico de erros ou métricas
- **Sem retries** — uma falha do OpenRouter resulta em erro para o usuário (crédito não debitado, mas UX ruim)
- **Sem controle de concorrência** — um usuário pode disparar N gerações simultâneas sobrecarregando a API
- **Sem rate limiting** — ausência de proteção contra abuso da API

## Solution

Usar o Inngest como orquestrador de background jobs. O API route `POST /api/generate-plush` passa a ser um dispatcher rápido (< 1s) que envia um evento ao Inngest e retorna um `runId`. O browser faz polling de status enquanto o Inngest executa a geração de forma durável em background.

## Acceptance Criteria

### Disparo de geração
- Quando o usuário clica em "Gerar", o browser recebe resposta em < 2s (não bloqueia 30s)
- Um Inngest run é criado e visível no dashboard `http://localhost:8288`
- O banco de dados registra a geração com status `pending`

### Execução durável
- A geração é dividida em steps: upload → AI → save
- Se o step de AI falhar (OpenRouter), é retentado até 3x automaticamente
- O crédito **só é debitado** se a geração for concluída com sucesso

### Controle de concorrência
- Máximo de **2 gerações simultâneas** por usuário
- Se um terceiro request vier enquanto 2 estão rodando, ele espera na fila
- Máximo de **5 gerações por hora** por usuário (rate limit)

### Observabilidade
- No Inngest Dev Server, é possível ver cada run com seus steps, inputs e outputs
- Runs com falha podem ser re-executados manualmente
- Status da geração é consultável via `GET /api/generate-plush/status?runId=xxx`

### Frontend
- O componente `GenerationStatus` mostra progresso enquanto o polling retorna `pending`
- Ao receber `complete`, exibe o resultado (before/after slider)
- Ao receber `failed`, exibe mensagem de erro com botão "Tentar novamente"

### Estado da geração no banco
- A tabela `generated_image` deve ter campos `inngestRunId` e `status`
- Status possíveis: `pending`, `complete`, `failed`

## Technical Requirements

- **SDK**: `inngest` npm package
- **Serve route**: `POST/GET/PUT /api/inngest`
- **Evento disparado**: `plush/generate.requested`
- **Concorrência**: `limit: 2, key: event.data.userId`
- **Rate limit**: `limit: 5, period: "1h", key: event.data.userId`
- **Retries**: `3`
- **Timeout total da função**: `5m`
- **Polling interval frontend**: 2s

## User Stories

1. **Geração em background**
   - Como usuário, quero que ao clicar em "Gerar" a resposta seja imediata, sem travar meu browser por 30 segundos.

2. **Feedback de progresso**
   - Como usuário, quero ver o progresso da geração em tempo real (steps: fazendo upload, gerando imagem, salvando).

3. **Retry transparente**
   - Como usuário, se a IA falhar por um problema temporário, quero que o sistema tente novamente automaticamente sem que eu precise fazer nada.

4. **Proteção contra abuso**
   - Como usuário, se eu clicar "Gerar" várias vezes rapidamente, quero que as gerações sejam enfileiradas e não gerem erros ou cobranças duplicadas.

## Dependencies

- **Inngest SDK**: `inngest` package (a ser instalado)
- **Inngest Serve Route**: novo `src/app/api/inngest/route.ts`
- **BetterAuth**: validação de sessão (já implementado)
- **Drizzle ORM**: operações de banco (já implementado)
- **Vercel Blob Storage**: upload de imagens (já implementado)
- **OpenRouter API**: geração de imagens (já implementado)

## Out of Scope

- Notificações push/email quando a geração terminar
- Cancelar uma geração em andamento
- Dashboard de analytics de gerações
- Concorrência global (entre todos os usuários)
- Integração com Inngest Cloud (apenas Dev Server por ora)

## Related Features

- `POST /api/generate-plush` — dispatcher (será modificado)
- `GET /api/generate-plush/status` — endpoint de polling (será criado)
- `src/lib/schema.ts` — schema do banco (adição de colunas)
- `src/app/dashboard/page.tsx` — frontend de geração (polling)
- `src/inngest/` — nova pasta com client e functions
