"""Pydantic schemas for request and response payloads."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    app: str
    version: str


class QueryRequest(BaseModel):
    query: str = Field(min_length=1, description="User question.")


class Citation(BaseModel):
    source: str
    chunk_index: int
    snippet: str


class QueryResponse(BaseModel):
    response: str
    citations: list[Citation] = []


class UploadResponse(BaseModel):
    success: bool
    filename: str
    chunks_indexed: int
    message: str
