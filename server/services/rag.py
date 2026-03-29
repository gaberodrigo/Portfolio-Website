"""RAG orchestration: retrieve context and generate grounded answers."""

from openai import OpenAI

from shared.config import settings


def build_grounded_prompt(question: str, context_chunks: list[str]) -> str:
    """Construct a prompt that forces context-grounded answers."""
    context_block = "\n\n".join(
        [f"[Chunk {i + 1}]\n{chunk}" for i, chunk in enumerate(context_chunks)]
    )

    return (
        "You are a helpful assistant that answers ONLY using the provided context.\n"
        "If the context does not contain the answer, reply exactly: "
        "'I do not have enough information in the uploaded documents.'\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n"
        "Answer:"
    )


def generate_grounded_answer(question: str, context_chunks: list[str]) -> str:
    """Generate an answer from OpenAI using retrieved context."""
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured.")

    if not context_chunks:
        return "I do not have enough information in the uploaded documents."

    prompt = build_grounded_prompt(question=question, context_chunks=context_chunks)
    client = OpenAI(api_key=settings.openai_api_key)

    response = client.chat.completions.create(
        model=settings.openai_chat_model,
        temperature=0.1,
        messages=[
            {"role": "system", "content": "Answer briefly and stay grounded in the provided context."},
            {"role": "user", "content": prompt},
        ],
    )

    answer = response.choices[0].message.content
    return answer.strip() if answer else "I do not have enough information in the uploaded documents."
