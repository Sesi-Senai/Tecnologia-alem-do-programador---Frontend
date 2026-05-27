# Frontend Sesi (ChatBot)

Projeto frontend desenvolvido para uma apresentacao de seguranca.

O sistema e um chat simples com consumo de moedas/tokens por mensagem e foi usado para demonstrar como uma aplicacao pode ficar vulneravel a **IDOR (Insecure Direct Object Reference)** quando um atacante intercepta e manipula requisicoes.

## Objetivo da demonstracao

- Mostrar um fluxo real de login, cadastro e conversa com chatbot.
- Evidenciar como a manipulacao de `usuarioId` em URL/body pode causar acesso indevido quando o backend nao valida corretamente.
- Simular consumo de moedas por mensagem para deixar o impacto da falha mais visivel.

## Tecnologias

- React + TypeScript
- Vite
- Material UI
- React Router

## Estrutura

- App do frontend: `Sessi/`
- Scripts de conveniencia (na pasta atual) executam comandos com `--prefix Sessi`

## Instalacao e execucao

### 1) Frontend

Na pasta `Tecnologia-alem-do-programador---Frontend`:

```bash
npm install
npm run dev
```

Frontend por padrao: `http://localhost:5173`

### 2) Backend (obrigatorio para funcionar)

Na pasta `Tecnologia-alem-do-programador---Brackend`:

```bash
npm install
npm run dev
```

Backend por padrao: `http://localhost:3001`

## Fluxo da aplicacao

1. Usuario faz cadastro/login.
2. A Home carrega dados do usuario e conversa do chat.
3. Cada mensagem enviada consome moedas (regra do backend).
4. O backend chama Gemini e devolve resposta do ChatBot.

## Sobre IDOR na apresentacao

O foco didatico e mostrar o que acontece quando o identificador de recurso/usuario e confiado sem validacao robusta no servidor.

Exemplos de risco em cenarios inseguros:

- Alterar `id` na URL para abrir dados de outro usuario.
- Alterar `usuarioId` no corpo da requisicao para agir como outra conta.
- Misturar identidade de quem envia e de quem paga moedas.

> Importante: este repositorio foi usado em contexto educacional de seguranca.
> Em ambiente real, sempre validar identidade/autorizacao no backend.

## Scripts disponiveis (raiz do frontend)

- `npm run dev` -> inicia Vite dentro de `Sessi`
- `npm run build` -> build de producao
- `npm run preview` -> preview do build
