"""Entrypoint utilities for building and testing the LangChain profile index."""

from pathlib import Path

from shared.config import settings
from rag.chains.chat_chain import answer_with_rag
from rag.utils.embedder import rebuild_vector_store
from rag.ingestion.loader import chunk_documents, load_profile_documents


def get_profile_path() -> Path:
    return Path(settings.data_dir) / "personal_profile.json"


def index_profile_data() -> int:
    """Load, chunk, and index profile data into Chroma."""
    profile_path = get_profile_path()
    docs = load_profile_documents(profile_path)
    chunks = chunk_documents(
        docs,
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
    )
    return rebuild_vector_store(chunks, profile_path=profile_path)


def run_sample_queries() -> dict[str, str]:
    """Helper to test the chain quickly from Python or scripts."""
    questions = [
        "Who are you?",
        "What skills do you have?",
        "What is your experience?",
    ]
    outputs: dict[str, str] = {}
    for question in questions:
        result = answer_with_rag(question)
        outputs[question] = result["response"]
    return outputs
