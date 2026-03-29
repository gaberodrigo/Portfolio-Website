// Chatbot UI + FastAPI integration.

(function initChatbotUI() {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const chatLoadingMessage = document.getElementById("chatLoadingMessage");
  const chatErrorMessage = document.getElementById("chatErrorMessage");
  const submitButton = chatForm?.querySelector('button[type="submit"]');

  if (!chatForm || !chatInput || !chatMessages || !chatLoadingMessage || !chatErrorMessage || !submitButton) {
    return;
  }

  function appendMessage(role, text) {
    const message = document.createElement("article");
    message.className = `chat-message ${role}`;

    const content = document.createElement("p");
    content.textContent = text;
    message.appendChild(content);

    chatMessages.appendChild(message);
    scrollToLatestMessage();
  }

  function scrollToLatestMessage() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function setLoadingState(isLoading) {
    chatLoadingMessage.hidden = !isLoading;
    submitButton.disabled = isLoading;
    chatInput.disabled = isLoading;

    if (isLoading) {
      submitButton.textContent = "Sending...";
      chatInput.setAttribute("aria-busy", "true");
    } else {
      submitButton.textContent = "Send";
      chatInput.removeAttribute("aria-busy");
      chatInput.focus();
    }
  }

  function clearError() {
    chatErrorMessage.hidden = true;
  }

  function showError(message) {
    chatErrorMessage.textContent = message;
    chatErrorMessage.hidden = false;
  }

  async function queryBackend(userText) {
    const response = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userText }),
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = typeof data?.detail === "string" ? data.detail : `Request failed with status ${response.status}`;
      throw new Error(detail);
    }

    // Support common response shapes: {response}, {answer}, or {message}.
    const assistantText = data.response || data.answer || data.message;
    if (!assistantText || typeof assistantText !== "string") {
      throw new Error("Unexpected API response format");
    }

    return assistantText;
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) {
      return;
    }

    clearError();
    appendMessage("user", userMessage);
    chatForm.reset();
    setLoadingState(true);

    try {
      const assistantReply = await queryBackend(userMessage);
      appendMessage("assistant", assistantReply);
    } catch (error) {
      console.error("Chat request error:", error);
      const message = error instanceof Error ? error.message : "Unable to complete request.";
      showError(message);
    } finally {
      setLoadingState(false);
    }
  });
})();
