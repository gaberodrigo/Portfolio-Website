"""LangChain RAG chain and prompt orchestration."""

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama

from shared.config import settings
from rag.retrievers.retriever import retrieve_context
from rag.utils.social_router import social_response_if_any

SYSTEM_PROMPT = (
    "You are a personal AI assistant representing Gabriel Rodriguez. "
    "Answer questions using only the provided context. "
    "If the answer is not in the context, reply exactly: I don't have that information. "
    "Keep responses concise, professional, and in first person."
)


def get_chat_model() -> ChatOllama:
    """Create local Ollama chat model client."""
    return ChatOllama(
        model=settings.ollama_chat_model,
        base_url=settings.ollama_base_url,
        temperature=0.1,
    )


def answer_with_rag(query: str) -> dict:
    """Retrieve context and generate a grounded answer with citations."""
    social = social_response_if_any(query)
    if social is not None:
        return {"response": social, "documents": []}

    docs = retrieve_context(query)
    context = "\n\n".join(doc.page_content for doc in docs)

    if not context.strip():
        return {"response": "I don't have that information.", "documents": []}

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            (
                "user",
                "Context:\n{context}\n\nQuestion: {question}\n\nAnswer:",
            ),
        ]
    )

    chain = prompt | get_chat_model()
    message = chain.invoke({"context": context, "question": query})
    answer = message.content.strip() if isinstance(message.content, str) else "I don't have that information."

    if not answer:
        answer = "I don't have that information."

    return {"response": answer, "documents": docs}
