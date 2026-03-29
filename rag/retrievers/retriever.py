"""Retriever factory for similarity search over the portfolio profile index."""

from langchain_core.documents import Document

from shared.config import settings
from rag.utils.embedder import get_vector_store


def get_retriever():
    """Build a simple similarity retriever with configurable top-k."""
    vector_store = get_vector_store()
    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": settings.rag_top_k},
    )


def retrieve_context(query: str) -> list[Document]:
    """Fetch top matching chunks for the query."""
    retriever = get_retriever()
    return retriever.invoke(query)
