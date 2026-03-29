"""Embedding helpers using ollama API."""

from langchain_ollama import OllamaEmbeddings
from shared.config import settings

def get_embeddings() -> OllamaEmbeddings:
    return OllamaEmbeddings(
        model=settings.ollama_embed_model,
        base_url=settings.ollama_base_url,
    )

def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    return get_embeddings().embed_documents(texts)

def embed_query(text: str) -> list[float]:
    return get_embeddings().embed_query(text)
