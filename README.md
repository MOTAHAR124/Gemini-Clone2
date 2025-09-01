## 🚨 Tutorial

This repository contains an AI chat app built as a Gemini clone with a Next.js frontend and a NestJS backend.

## <a name="introduction">🤖 Overview</a>

Monorepo with:

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Clerk auth.
- Backend: NestJS 11 with Google Generative AI (Gemini) integration.

Key features:

- Chat interface with Gemini AI.
- Conversation history and context-aware replies.
- File upload and preview (UI components present).
- Clerk-based authentication scaffold.

## <a name="tech-stack">Tech Stack</a>

- Frontend: Next.js, React, Tailwind CSS, Clerk, Radix UI, Lucide.
- Backend: NestJS, @google/generative-ai.
- Language: TypeScript end-to-end.

## <a name="structure">Directory Structure</a>

```
root/
├─ front-end/      # Next.js app (UI, auth, chat components)
└─ back-end/       # NestJS API (Gemini endpoint)
```

Important files:

- Frontend API client: `front-end/src/lib/gemini.ts` (POST to `http://localhost:3001/gemini`).
- Backend controller: `back-end/src/app.controller.ts` (Gemini chat with context).
- Backend bootstrap: `back-end/src/main.ts` (CORS enabled, default port 3001).

## <a name="quick-start">Quick Start</a>

**Prerequisites**

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- pnpm/yarn/npm (choose one; examples below use yarn)

### 1) Clone

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2) Backend setup (`back-end/`)

Create `.env` in `back-end/`:

```
GEMINI_API_KEY=your_google_generative_ai_key
# Optional
# PORT=3001
```

Install deps and run dev:

```bash
cd back-end
yarn
yarn start:dev
```

The API should run on `http://localhost:${PORT:-3001}`.

### 3) Frontend setup (`front-end/`)

```bash
cd front-end
yarn
yarn dev
```

The app runs on `http://localhost:3000`.

If using Clerk, define env vars in `front-end/.env.local` (per Clerk docs):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## <a name="api">API</a>

- `POST /gemini` (Backend)
  - URL: `http://localhost:3001/gemini`
  - Request body:

    ```json
    {
      "prompt": "string",
      "conversation": [
        { "role": "user" | "bot", "content": "string" }
      ]
    }
    ```

  - Response:

    ```json
    {
      "text": "model response"
    }
    ```

The frontend helper `front-end/src/lib/gemini.ts` posts to this endpoint and returns `text`.

## <a name="scripts">Scripts</a>

Frontend (`front-end/package.json`):

- `yarn dev` — Next dev server.
- `yarn build` — Next build.
- `yarn start` — Next start (production).
- `yarn lint` — Lint.

Backend (`back-end/package.json`):

- `yarn start:dev` — Nest dev with watch.
- `yarn start` — Nest start.
- `yarn build` — Build.
- `yarn test` — Tests.

## <a name="notes">Notes & Troubleshooting</a>

- Ensure `GEMINI_API_KEY` is set in `back-end/.env`. Missing key will throw in `AppController.gemini()`.
- CORS is enabled in `back-end/src/main.ts`. Frontend calls `http://localhost:3001/gemini`.
- Update API base URL in `front-end/src/lib/gemini.ts` if you change backend port/host.
- If Clerk is not configured yet, disable or adjust middleware at `front-end/src/middleware.ts`.

## <a name="features">Planned/Available UI Components</a>

- `GeminiBody`, `ConversationDisplay`, `ChatInput`, `FilePreview`, `SuggestionCards`, `Sidebar`, `ThemeToggle`, `UserStatus`.

These compose the chat experience; authentication hooks and file upload UI are scaffolded.
