"""Vector store operations for indexing and retrieval with Chroma."""

from collections.abc import Iterable
from uuid import uuid4

import chromadb

from shared.config import settings


def get_collection():
    """Create or load the persistent Chroma collection."""
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(settings.chroma_path))
    return client.get_or_create_collection(name=settings.collection_name)


def add_chunks(chunks: list[str], embeddings: list[list[float]], source: str) -> int:
    """Index document chunks into the vector collection."""
    if not chunks:
        return 0

    collection = get_collection()
    ids: list[str] = []
    metadatas: list[dict] = []

    for index, _chunk in enumerate(chunks):
        ids.append(str(uuid4()))
        metadatas.append({"source": source, "chunk_index": index})

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )
    return len(chunks)


def query_similar(query_embedding: list[float], top_k: int) -> list[dict]:
    """Return top matching chunks with metadata."""
    collection = get_collection()
    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    documents = _first_or_empty(result.get("documents"))
    metadatas = _first_or_empty(result.get("metadatas"))
    distances = _first_or_empty(result.get("distances"))

    matches: list[dict] = []
    for document, metadata, distance in zip(documents, metadatas, distances):
        matches.append(
            {
                "document": document or "",
                "metadata": metadata or {},
                "distance": distance,
            }
        )
    return matches


def _first_or_empty(value: Iterable | None) -> list:
    if not value:
        return []
    first = list(value)[0]
    return first if isinstance(first, list) else []
