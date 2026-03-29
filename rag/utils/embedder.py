"""Embeddings and vector store setup for local Ollama + Chroma."""

from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings

from shared.config import settings


def get_embeddings() -> OllamaEmbeddings:
    """Create Ollama embeddings client."""
    return OllamaEmbeddings(
        model=settings.ollama_embed_model,
        base_url=settings.ollama_base_url,
    )


def get_vector_store() -> Chroma:
    """Load persistent Chroma vector store."""
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    return Chroma(
        collection_name=settings.collection_name,
        persist_directory=str(settings.chroma_path),
        embedding_function=get_embeddings(),
    )


def rebuild_vector_store(documents: list[Document], profile_path: Path) -> int:
    """Rebuild vector store from profile docs, replacing previous profile chunks."""
    vector_store = get_vector_store()

    # Delete previously indexed profile chunks to keep rebuild idempotent.
    vector_store.delete(where={"source": profile_path.name})

    if not documents:
        return 0

    vector_store.add_documents(documents=documents)
    return len(documents)
