"""FastAPI application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.config import settings
from server.api.chat import router as chat_router
from server.api.upload import router as upload_router
from shared.schemas import HealthResponse

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(app=settings.app_name, version=settings.app_version)
