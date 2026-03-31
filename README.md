# Portfolio-Website

## Repository layout

- **Root (`src/`, `package.json`)** — Next.js frontend (deployed to Vercel or run with `npm run dev`).
- **`server/`**, **`rag/`**, **`shared/`**, **`requirements.txt`** — Python FastAPI RAG API (`uvicorn server.main:app`). Used when chat is in **FastAPI** mode (see below).
- **`src/app/api/chat/route.ts`** — Next.js Route Handler that calls **Amazon Bedrock** Knowledge Base (`RetrieveAndGenerate`). Used when chat is in **Bedrock** mode.
- **`data/`** — Profile text, uploads, and Chroma vector store paths used by the Python RAG indexer.
- **`archive/legacy-static-site/`** — Older static HTML/CSS/JS copy kept for reference (not part of the Next app).

## Environment files (local dev)

- **`.env`** — FastAPI / Python only. Copy from [`.env.example`](.env.example). Pydantic loads this for `uvicorn`; do not rely on **`NEXT_PUBLIC_*`** here (those are for the Next.js client bundle, not the Python app).
- **`.env.local`** — Next.js only (copy from [`.env.local.example`](.env.local.example)). Overrides `.env` for `npm run dev` / `next build`. Put **`NEXT_PUBLIC_*`**, Bedrock IDs, and AWS credentials for the Route Handler here (or in Vercel project settings for production).

## Chat: Bedrock vs FastAPI

Set **`NEXT_PUBLIC_CHAT_BACKEND`** in `.env.local` (and Vercel):

| Value | Behavior |
|--------|----------|
| **`bedrock`** (default) | Browser calls same-origin **`POST /api/chat`** first. If that fails (errors, non-OK response, bad JSON), the client automatically falls back to **`POST {NEXT_PUBLIC_API_URL}/query`** (FastAPI) so local RAG still works when Bedrock is misconfigured. Configure Bedrock via server-side env: `AWS_REGION`, `BEDROCK_KB_ID`, `BEDROCK_MODEL_ARN`, and AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optional `AWS_SESSION_TOKEN`). |
| **`fastapi`** | Browser calls **`POST {NEXT_PUBLIC_API_URL}/query`** with body `{ query }`. Run the Python API locally or deploy it separately. |

**IAM:** The credentials used by the Next.js server need permission to invoke Bedrock Agent Runtime for your Knowledge Base (for example `bedrock:RetrieveAndGenerate` on the appropriate resources—confirm exact actions with [AWS Bedrock documentation](https://docs.aws.amazon.com/bedrock/) for your setup).

**Local testing:** For Bedrock, put AWS and Bedrock variables in `.env.local` (not committed). For FastAPI-only dev, set `NEXT_PUBLIC_CHAT_BACKEND=fastapi` and `NEXT_PUBLIC_API_URL=http://localhost:8000`, and run `uvicorn server.main:app`.
