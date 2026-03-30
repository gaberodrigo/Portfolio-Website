# Portfolio-Website

## Repository layout

- **Root (`src/`, `package.json`)** — Next.js frontend (deployed to Vercel or run with `npm run dev`).
- **`server/`**, **`rag/`**, **`shared/`**, **`requirements.txt`** — Python FastAPI RAG API. Run from the repo root with `uvicorn server.main:app` (after installing deps in a venv). The site’s chat calls `POST /query`; set `NEXT_PUBLIC_API_URL` to that API’s base URL in production.
- **`data/`** — Profile text, uploads, and Chroma vector store paths used by the RAG indexer.
- **`archive/legacy-static-site/`** — Older static HTML/CSS/JS copy kept for reference (not part of the Next app).
