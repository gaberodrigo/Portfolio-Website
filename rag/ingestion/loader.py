"""Load personal profile data and convert it into chunked LangChain documents."""

import json
from pathlib import Path

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_profile_documents(profile_path: Path) -> list[Document]:
    """Create one LangChain document per logical profile section."""
    data = json.loads(profile_path.read_text(encoding="utf-8"))
    docs: list[Document] = []

    docs.append(
        Document(
            page_content=_build_identity_text(data),
            metadata={"source": profile_path.name, "section": "identity"},
        )
    )

    for item in data.get("education", []):
        docs.append(
            Document(
                page_content=_join_lines(
                    [
                        f"Institution: {item.get('institution', '')}",
                        f"Degree: {item.get('degree', '')}",
                        f"Status: {item.get('status', '')}",
                        f"Highlights: {', '.join(item.get('highlights', []))}",
                    ]
                ),
                metadata={"source": profile_path.name, "section": "education"},
            )
        )

    for item in data.get("work_experience", []):
        docs.append(
            Document(
                page_content=_join_lines(
                    [
                        f"Role: {item.get('role', '')}",
                        f"Organization: {item.get('organization', '')}",
                        f"Period: {item.get('period', '')}",
                        f"Achievements: {', '.join(item.get('achievements', []))}",
                    ]
                ),
                metadata={"source": profile_path.name, "section": "work_experience"},
            )
        )

    docs.append(
        Document(
            page_content=_build_skills_text(data.get("skills", {})),
            metadata={"source": profile_path.name, "section": "skills"},
        )
    )

    for item in data.get("projects", []):
        docs.append(
            Document(
                page_content=_join_lines(
                    [
                        f"Project: {item.get('name', '')}",
                        f"Description: {item.get('description', '')}",
                        f"Stack: {', '.join(item.get('stack', []))}",
                        f"Features: {', '.join(item.get('features', []))}",
                    ]
                ),
                metadata={"source": profile_path.name, "section": "projects"},
            )
        )

    return docs


def chunk_documents(
    documents: list[Document], chunk_size: int, chunk_overlap: int
) -> list[Document]:
    """Split profile docs into retrieval-friendly chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(documents)


def _build_identity_text(data: dict) -> str:
    return _join_lines(
        [
            f"Name: {data.get('name', '')}",
            f"Headline: {data.get('headline', '')}",
            f"Location: {data.get('location', '')}",
            f"Summary: {' '.join(data.get('summary', []))}",
        ]
    )


def _build_skills_text(skills: dict) -> str:
    return _join_lines(
        [
            f"Languages: {', '.join(skills.get('languages', []))}",
            f"AI/LLM: {', '.join(skills.get('ai_llm', []))}",
            f"Frameworks/Tools: {', '.join(skills.get('frameworks_tools', []))}",
        ]
    )


def _join_lines(lines: list[str]) -> str:
    return "\n".join(line for line in lines if line.strip())
