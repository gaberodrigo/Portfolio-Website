"""Upload route for document ingestion and indexing."""

from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from shared.config import settings
from shared.schemas import UploadResponse
from server.services.embedding import embed_texts
from server.services.ingestion import SUPPORTED_EXTENSIONS, chunk_text, read_document_text
from server.services.retrieval import add_chunks

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_EXTENSIONS))
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Use: {supported}")

    settings.uploads_path.mkdir(parents=True, exist_ok=True)
    destination = settings.uploads_path / (file.filename or "uploaded_document.txt")

    # Save upload to disk so ingestion can be deterministic and debuggable.
    file_bytes = await file.read()
    destination.write_bytes(file_bytes)

    try:
        text = read_document_text(destination)
        chunks = chunk_text(
            text=text,
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
        )
        embeddings = embed_texts(chunks)
        indexed = add_chunks(chunks=chunks, embeddings=embeddings, source=destination.name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to ingest document: {exc}") from exc

    return UploadResponse(
        success=True,
        filename=destination.name,
        chunks_indexed=indexed,
        message="Document uploaded and indexed successfully.",
    )
