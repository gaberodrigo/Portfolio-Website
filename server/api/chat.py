"""Chat route for RAG-based question answering."""

from fastapi import APIRouter, HTTPException

from shared.schemas import Citation, QueryRequest, QueryResponse
from rag.chains.chat_chain import answer_with_rag
from rag.ingestion.indexer import index_profile_data

router = APIRouter(tags=["chat"])
_index_ready = False


@router.post("/query", response_model=QueryResponse)
async def query_chatbot(payload: QueryRequest):
    global _index_ready
    try:
        if not _index_ready:
            index_profile_data()
            _index_ready = True

        result = answer_with_rag(payload.query)
        citations: list[Citation] = []
        for index, doc in enumerate(result["documents"]):
            metadata = doc.metadata if isinstance(doc.metadata, dict) else {}
            snippet = doc.page_content[:220] if isinstance(doc.page_content, str) else ""
            citations.append(
                Citation(
                    source=str(metadata.get("source", "unknown")),
                    chunk_index=int(metadata.get("chunk_index", index)),
                    snippet=snippet,
                )
            )

        return QueryResponse(response=result["response"], citations=citations)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Query failed: {exc}") from exc
