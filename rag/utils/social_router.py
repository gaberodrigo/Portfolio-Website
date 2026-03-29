"""Route short greetings and small talk before RAG (no retrieval or grounding)."""

from __future__ import annotations

import random
import re

# Longer strings are unlikely to be pure small talk.
_MAX_LEN = 120

_THANKS_RE = re.compile(
    r"^(thanks?|thank\s+you|thx|ty|much\s+appreciated|appreciate\s+it|cheers)\b"
    r"(\s+(so\s+much|a\s+lot|again))?[\s!.]*$",
    re.I,
)

_BYE_RE = re.compile(
    r"^(bye|goodbye|see\s+ya|see\s+you|cya|later|take\s+care)[\s!.]*$",
    re.I,
)

_GOOD_DAY_RE = re.compile(
    r"^good\s+(morning|afternoon|evening|day)\b[\s!.]*$",
    re.I,
)

_WHATS_UP_RE = re.compile(r"^(what's\s+up|whats\s+up|wassup)\s*\??[\s!.]*$", re.I)

_HOW_ARE_YOU_RE = re.compile(
    r"^how\s+(are\s+you|r\s+u|have\s+you\s+been)(\s+doing)?\s*\??[\s!.]*$",
    re.I,
)

_NICE_MEET_RE = re.compile(
    r"^nice\s+to\s+(meet|see)\s+you[\s!.]*$",
    re.I,
)

# Single optional word after greeting (there, you, friend, everyone, or one short token).
_GREETING_RE = re.compile(
    r"^(hi|hello|hey|yo|hiya|howdy|greetings|sup)\b"
    r"(\s+(there|you|friend|everyone|[a-z]{1,20}))?[\s!.]*$",
    re.I,
)

_EXACT = frozenset({"morning", "afternoon", "evening", "hallo", "salutations"})

_GREETING_REPLIES = (
    "Hi there! I'm here to answer questions about Gabriel's background, skills, and projects—what would you like to know?",
    "Hello! Feel free to ask me anything about Gabriel's portfolio or experience.",
)

_THANKS_REPLIES = (
    "You're welcome! Happy to help—ask anything else about Gabriel's work if you like.",
    "Glad I could help! Let me know if you have more questions about Gabriel's projects.",
)

_BYE_REPLIES = (
    "Thanks for stopping by! Come back anytime if you have more questions.",
    "Goodbye! Feel free to return if you want to know more about Gabriel's work.",
)

_HOW_ARE_REPLIES = (
    "I'm doing well, thanks for asking! What would you like to know about Gabriel's work?",
)

_CASUAL_REPLIES = (
    "Not much—I'm here to help you learn about Gabriel's projects and experience. What's on your mind?",
)

_NICE_MEET_REPLIES = (
    "Likewise! Ask me anything about Gabriel's background or projects.",
)


def social_response_if_any(query: str) -> str | None:
    """If the message is only social / greeting, return a canned reply; else None."""
    t = query.strip()
    if not t or len(t) > _MAX_LEN:
        return None

    # Any question mark → RAG, except allowed small-talk questions.
    if "?" in t:
        if not (
            _HOW_ARE_YOU_RE.match(t) is not None or _WHATS_UP_RE.match(t) is not None
        ):
            return None

    tl = t.lower()

    if _THANKS_RE.match(t):
        return random.choice(_THANKS_REPLIES)
    if _BYE_RE.match(t):
        return random.choice(_BYE_REPLIES)
    if tl in _EXACT:
        return random.choice(_GREETING_REPLIES)
    if _GOOD_DAY_RE.match(t):
        return random.choice(_GREETING_REPLIES)
    if _WHATS_UP_RE.match(t):
        return random.choice(_CASUAL_REPLIES)
    if _HOW_ARE_YOU_RE.match(t):
        return random.choice(_HOW_ARE_REPLIES)
    if _NICE_MEET_RE.match(t):
        return random.choice(_NICE_MEET_REPLIES)
    if _GREETING_RE.match(t):
        return random.choice(_GREETING_REPLIES)

    return None
