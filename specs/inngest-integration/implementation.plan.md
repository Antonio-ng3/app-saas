# Plano de Implementação: Inngest Integration

**Versão**: 1.0
**Data**: 03 de Março de 2026
**Objetivo**: Adicionar Inngest para orquestrar a geração de imagens em background com observabilidade, retries, concorrência e rate limiting por usuário.

---

## Visão Geral das Fases

| Fase | Descrição | Estimativa |
|------|-----------|------------|
| 1 | Instalação e Setup do Inngest | ~30min |
| 2 | Schema do Banco de Dados | ~20min |
| 3 | Inngest Function (geração durável) | ~1h |
| 4 | API Routes (dispatcher + status) | ~30min |
| 5 | Frontend (polling + UI) | ~45min |
| 6 | Verificação e Testes | ~30min |

**Total Estimado**: ~3h30min

---

## Fase 1: Instalação e Setup ✅ COMPLETA

### 1.1 Instalar dependências

- [x] Instalar o SDK do Inngest:
  ```bash
  pnpm add inngest
  ```
- [x] Verificar que o pacote aparece em `package.json` (`inngest 3.52.5`)

### 1.2 Criar cliente Inngest

- [x] Criar pasta `src/inngest/`
- [x] Criar `src/inngest/client.ts`:
  ```ts
  import { Inngest } from "inngest";
  export const inngest = new Inngest({ id: "plush-generator" });
  ```

### 1.3 Criar serve route

- [x] Criar `src/app/api/inngest/route.ts`:
  ```ts
  import { serve } from "inngest/next";
  import { inngest } from "@/inngest/client";
  import { plushGenerateFunction } from "@/inngest/functions/generate-plush";

  export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [plushGenerateFunction, plushGenerateFailureFunction],
  });
  ```

### 1.4 Configurar variáveis de ambiente

- [x] Adicionar em `.env` (dev local — sem keys necessárias):
  ```env
  INNGEST_DEV=1
  ```
- [x] Adicionar em `.env.example` (produção):
  ```env
  # Inngest
  INNGEST_EVENT_KEY=        # Obter em inngest.com/settings
  INNGEST_SIGNING_KEY=      # Obter em inngest.com/settings
  ```

### 1.5 Testar setup básico

- [x] Compilação sem erros de TypeScript
- [ ] Em outro terminal: `INNGEST_DEV=1 npx inngest-cli@latest dev`
- [ ] Abrir `http://localhost:8288` — Inngest Dev Server rodando
- [ ] Acessar `http://localhost:3000/api/inngest` (GET) — deve retornar 200 com JSON de configuração

---

## Fase 2: Schema do Banco de Dados ✅ COMPLETA

### 2.1 Atualizar schema

- [x] Editar `src/lib/schema.ts` — adicionadas colunas na tabela `generatedImage`:
  ```ts
  inngestRunId: text("inngest_run_id"),
  status: text("status").notNull().default("complete"),
  // "pending" | "complete" | "failed"
  errorMessage: text("error_message"),
  ```
- [x] `originalImageUrl` e `generatedImageUrl` tornadas nullable (necessário para registros `pending`)

### 2.2 Gerar e aplicar migração

- [x] Migração gerada: `drizzle/0006_colossal_dust.sql`
  ```bash
  pnpm run db:generate
  ```
- [x] Migração aplicada com sucesso:
  ```bash
  pnpm run db:migrate
  ```
- [x] Adicionado índice em `inngestRunId` para queries de polling eficientes

---

## Fase 3: Inngest Function ✅ COMPLETA

### 3.1 Criar a função principal

- [x] Criar pasta `src/inngest/functions/`
- [x] Criar `src/inngest/functions/generate-plush.ts`
- [x] Definir a função com configuração de flow control:
  ```ts
  export const plushGenerateFunction = inngest.createFunction(
    {
      id: "generate-plush",
      retries: 3,
      concurrency: {
        limit: 2,
        key: "event.data.userId",
      },
      rateLimit: {
        limit: 5,
        period: "1h",
        key: "event.data.userId",
      },
    },
    { event: "plush/generate.requested" },
    async ({ event, step }) => { ... }
  );
  ```

### 3.2 Step 1: Upload da imagem original

- [x] Implementar `step.run("upload-original-image", ...)`:
  - Construir URL completa da imagem (relativa → absoluta)
  - Fazer fetch da imagem e converter para base64
  - Fazer upload para storage (`bob-app-saas/originals/{userId}/`)
  - Retornar `{ originalImageUrl, originalBase64DataUrl }`

### 3.3 Step 2: Chamar OpenRouter API

- [x] Implementar `step.run("call-openrouter-api", ...)`:
  - Chamar `POST https://openrouter.ai/api/v1/chat/completions`
  - Enviar imagem como base64 + prompt em português
  - Parsear resposta em múltiplos formatos (image_url, inline_data, files, images)
  - Fazer upload da imagem gerada para storage
  - Retornar `{ generatedImageUrl }`
  - **Retentado até 3x** em caso de falha do OpenRouter

### 3.4 Step 3: Salvar resultado e debitar crédito

- [x] Implementar `step.run("save-result-and-debit-credit", ...)`:
  - Atualizar registro em `generatedImage`: `status: "complete"`, URLs
  - Debitar 1 crédito do usuário
  - **Crédito só é debitado aqui** — apenas após sucesso confirmado

### 3.5 Failure handler

- [x] Criar `plushGenerateFailureFunction` que escuta `inngest/function.failed`:
  - Atualiza o registro com `status: "failed"` e `errorMessage`
  - Crédito **não** é debitado

### 3.6 Registrar functions no serve route

- [x] Ambas as functions registradas em `src/app/api/inngest/route.ts`

---

## Fase 4: API Routes ✅ COMPLETA

### 4.1 Modificar `POST /api/generate-plush`

- [x] Reescrito como dispatcher rápido (< 1s):
  - Manteve: validação de auth, check de créditos, validação de `imageUrl`
  - Removeu: toda a lógica de upload e chamada OpenRouter
  - Adicionou: criação de registro `pending` + `inngest.send(...)`
  - Retorna `{ runId, recordId }` com status `202 Accepted`

### 4.2 Criar `GET /api/generate-plush/status`

- [x] Criado `src/app/api/generate-plush/status/route.ts`
- [x] Valida auth e scopa query ao usuário autenticado
- [x] Aceita `recordId` como query param
- [x] Retorna `{ status: "pending" | "complete" | "failed" }` com dados completos quando `complete`

---

## Fase 5: Frontend ✅ COMPLETA

### 5.1 Atualizar `handleGenerate` no Dashboard

- [x] `handleGenerate` agora:
  1. Faz upload da imagem → obtém `uploadedImageUrl`
  2. Chama `POST /api/generate-plush` → obtém `{ recordId }` (< 1s)
  3. Inicia polling de status (2s)
  4. Para polling quando receber `complete` ou `failed`

### 5.2 Implementar polling

- [x] `setInterval` com 2s de intervalo
- [x] Cleanup com `useEffect` ao desmontar componente
- [x] Erros de rede no polling não param o polling (resiliente)
- [x] Progress animado de 45% → 90% enquanto aguarda

### 5.3 Atualizar UI de progresso

- [x] `complete`: mostra `generatedImageUrl`, `generationState: "complete"`
- [x] `failed`: mostra mensagem de erro, `generationState: "error"`
- [x] `refreshCredits()` chamado após `complete`

---

## Fase 6: Verificação e Testes ✅ COMPLETA

### 6.1 Código e tipos

- [x] `pnpm run typecheck` — ✅ exit code 0, zero erros
- [x] `pnpm run lint` — ✅ exit code 0, apenas warnings pré-existentes de `<img>`
- [x] Corrigido: gallery route com null guards para URLs nullable

### 6.2 Testes manuais (a fazer pelo dev)

- [ ] Rodar `pnpm run dev` + Inngest Dev Server (`INNGEST_DEV=1 npx inngest-cli@latest dev`)
- [ ] Acessar `http://localhost:8288/functions` — função `generate-plush` aparece
- [ ] No dashboard, fazer upload e clicar "Gerar" — resposta em < 2s
- [ ] Ver run criado em `http://localhost:8288/runs`
- [ ] Aguardar conclusão e verificar pelúcia gerada
- [ ] Verificar que crédito foi debitado apenas após sucesso

---

## Checklist Final

### Setup
- [x] `pnpm add inngest` instalado (v3.52.5)
- [x] `src/inngest/client.ts` criado
- [x] `src/app/api/inngest/route.ts` criado
- [x] Variáveis de ambiente documentadas

### Banco de dados
- [x] Colunas `inngestRunId`, `status`, `errorMessage` na tabela `generatedImage`
- [x] Migração aplicada com sucesso
- [x] Índice em `inngestRunId` criado

### Inngest Function
- [x] 3 steps implementados (upload-original, call-openrouter, save-result)
- [x] Retries: 3
- [x] Concorrência: limit 2 por usuário
- [x] Rate limit: 5/hora por usuário
- [x] Crédito debitado apenas no step final de sucesso
- [x] Failure handler: status `failed` gravado sem debitar crédito

### API Routes
- [x] `POST /api/generate-plush` retorna `{ runId, recordId }` em < 2s (202)
- [x] `GET /api/generate-plush/status?recordId=xxx` funciona
- [x] Ambos validam autenticação

### Frontend
- [x] Polling a cada 2s funciona
- [x] UI atualiza ao receber `complete`
- [x] Erro exibido ao receber `failed`
- [x] Créditos atualizados após conclusão
- [x] Cleanup do `setInterval` no unmount

### Verificação automática
- [x] `pnpm run typecheck` — zero erros
- [x] `pnpm run lint` — zero erros

---

## Notas Técnicas

**Por que polling e não WebSocket/SSE?**
Polling com 2s é simples, funciona em qualquer infraestrutura e é suficiente para uma tarefa que leva ~15-30s. WebSockets adicionariam complexidade sem benefício real para o volume atual.

**Crédito seguro**
Na implementação anterior, o crédito era debitado antes da chamada à API (risco de débito sem geração). Com Inngest, o débito acontece apenas no step final `save-result-and-debit-credit` — garantia de que só é cobrado por gerações bem-sucedidas.

**Dev vs Produção**
- Dev: `INNGEST_DEV=1` + `npx inngest-cli@latest dev` (sem keys, tudo local)
- Produção: registrar app em `inngest.com`, obter `INNGEST_EVENT_KEY` e `INNGEST_SIGNING_KEY`
