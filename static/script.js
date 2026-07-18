// ==========================================================================
// UI DOM Selectors
// ==========================================================================
const prompt = document.getElementById("prompt");
const sendBtn = document.getElementById("send-btn");
const messagesEl = document.getElementById("messages");
const welcomeCanvas = document.getElementById("welcome-canvas");
const chatArea = document.getElementById("chat-area");

// Sidebar elements
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const newChatBtn = document.getElementById("new-chat-btn");
const historyList = document.getElementById("history-list");
const brandBlock = document.getElementById("brand-block");

// Settings selectors
const settingsBtn = document.getElementById("settings-btn");
const settingsDropdown = document.getElementById("settings-dropdown");
const themeToggleText = document.getElementById("theme-toggle-text");

// Model selector elements
const modelPill = document.getElementById("model-pill");
const modelPillText = document.getElementById("model-pill-text");
const modelPopover = document.getElementById("model-popover");
const modelOptionCards = document.querySelectorAll(".model-option-card");

// Grounded Search Topics selectors [3.5, 1.1.2]
const topicsOverlay = document.getElementById("topics-overlay");
const topicsListContainer = document.getElementById("topics-list-container");

// ==========================================================================
// Application State
// ==========================================================================
let conversations =
  JSON.parse(localStorage.getItem("LUMINA_CONVERSATIONS")) || [];
let currentChatId = null;
let isGenerating = false;
let activeModel = "gemini-3.5-flash";
let activeUserName = localStorage.getItem("LUMINA_USER_NAME") || "";
let activeTheme = localStorage.getItem("LUMINA_THEME") || "dark";

// ==========================================================================
// INITIALIZATION & LIFECYCLE
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderHistoryList();
  startNewChat();
  checkOnboarding();
  applyStoredTheme();
});

function applyStoredTheme() {
  if (activeTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggleText.textContent = "Dark Mode";
  } else {
    document.body.classList.remove("light-theme");
    themeToggleText.textContent = "Light Mode";
  }
}

function toggleViewTheme() {
  activeTheme = activeTheme === "dark" ? "light" : "dark";
  localStorage.setItem("LUMINA_THEME", activeTheme);
  applyStoredTheme();
}

function checkOnboarding() {
  const onboardingOverlay = document.getElementById("onboarding-overlay");
  const onboardingInput = document.getElementById("onboarding-name-input");
  const onboardingSubmit = document.getElementById("onboarding-submit-btn");

  if (!activeUserName) {
    onboardingOverlay.classList.add("show");

    const saveOnboarding = () => {
      const name = onboardingInput.value.trim();
      if (name) {
        localStorage.setItem("LUMINA_USER_NAME", name);
        activeUserName = name;
        onboardingOverlay.classList.remove("show");
        updateUIGreetings(name);
      }
    };

    onboardingSubmit.addEventListener("click", saveOnboarding);
    onboardingInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveOnboarding();
    });
  } else {
    updateUIGreetings(activeUserName);
  }
}

function updateUIGreetings(name) {
  const greetingSpan = document.getElementById("greeting-user-name");
  const profileDisplay = document.getElementById("profile-name-display");

  if (greetingSpan) greetingSpan.textContent = name;
  if (profileDisplay) profileDisplay.textContent = name;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const avatarCircle = document.getElementById("profile-avatar-circle");
  if (avatarCircle) avatarCircle.textContent = initials || "LD";
}

function renameProfile(e) {
  e.stopPropagation();
  const displayEl = document.getElementById("profile-name-display");
  const currentName = displayEl.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "rename-input";
  input.value = currentName;
  input.style.width = "120px";

  displayEl.replaceWith(input);
  input.focus();
  input.select();

  const saveProfileName = () => {
    const newName = input.value.trim();
    if (newName) {
      localStorage.setItem("LUMINA_USER_NAME", newName);
      activeUserName = newName;
      input.replaceWith(displayEl);
      displayEl.textContent = newName;
      updateUIGreetings(newName);
    } else {
      input.replaceWith(displayEl);
    }
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveProfileName();
    if (event.key === "Escape") {
      input.replaceWith(displayEl);
    }
  });

  input.addEventListener("blur", saveProfileName);
}

// Sidebar Backdrop
sidebarToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleSidebar();
});

sidebarBackdrop.addEventListener("click", closeSidebar);

function toggleSidebar() {
  if (window.innerWidth > 1024) {
    const appWrapper = document.getElementById("app");
    appWrapper.classList.toggle("sidebar-collapsed");
    sidebarToggle.classList.toggle("active");
  } else {
    const isOpen = sidebar.classList.contains("open");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

function openSidebar() {
  sidebar.classList.add("open");
  sidebarToggle.classList.add("active");
  sidebarBackdrop.classList.add("show");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarToggle.classList.remove("active");
  sidebarBackdrop.classList.remove("show");
}

// Dynamic Settings Panel
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsDropdown.classList.toggle("show");
});

modelPill.addEventListener("click", (e) => {
  e.stopPropagation();
  modelPill.classList.toggle("active");
  modelPopover.classList.toggle("show");
});

modelOptionCards.forEach((card) => {
  card.addEventListener("click", () => {
    modelOptionCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");

    activeModel = card.getAttribute("data-model");

    const labelText = card.querySelector(".model-label").textContent;
    modelPillText.textContent = labelText;

    modelPill.classList.remove("active");
    modelPopover.classList.remove("show");
  });
});

document.addEventListener("click", () => {
  settingsDropdown.classList.remove("show");
  modelPill.classList.remove("active");
  modelPopover.classList.remove("show");
  closeAllContextMenus();
});

prompt.addEventListener("input", () => {
  prompt.style.height = "auto";
  prompt.style.height = Math.min(prompt.scrollHeight, 140) + "px";
  sendBtn.disabled = !prompt.value.trim() || isGenerating;

  const inputContainer = document.querySelector(".input-container");
  if (prompt.value.trim().length > 0) {
    inputContainer.classList.add("typing-active");
  } else {
    inputContainer.classList.remove("typing-active");
  }
});

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) handleSend();
  }
});

sendBtn.addEventListener("click", handleSend);
newChatBtn.addEventListener("click", startNewChat);
brandBlock.addEventListener("click", startNewChat);

// ==========================================================================
// Historical local storage management
// ==========================================================================
function saveHistoryToStorage() {
  localStorage.setItem("LUMINA_CONVERSATIONS", JSON.stringify(conversations));
  renderHistoryList();
}

function renderHistoryList() {
  historyList.innerHTML = "";

  const pinnedChats = conversations.filter((c) => c.isPinned);
  const regularChats = conversations.filter((c) => !c.isPinned);

  pinnedChats.sort((a, b) => b.updatedAt - a.updatedAt);
  regularChats.sort((a, b) => b.updatedAt - a.updatedAt);

  if (pinnedChats.length > 0) {
    const section = document.createElement("div");
    section.className = "history-list";
    section.innerHTML = `<div class="history-section-label" style="font-size:10px;color:var(--accent);">📌 Pinned</div>`;
    pinnedChats.forEach((chat) =>
      section.appendChild(createHistoryItemDOM(chat)),
    );
    historyList.appendChild(section);
  }

  if (regularChats.length > 0) {
    const section = document.createElement("div");
    section.className = "history-list";
    regularChats.forEach((chat) =>
      section.appendChild(createHistoryItemDOM(chat)),
    );
    historyList.appendChild(section);
  }

  if (conversations.length === 0) {
    historyList.innerHTML = `<div style="font-size:12px;color:var(--text-dim);text-align:center;padding:12px;">No recent chats</div>`;
  }
}

function createHistoryItemDOM(chat) {
  const el = document.createElement("div");
  el.className = `history-item ${chat.id === currentChatId ? "active" : ""}`;
  el.setAttribute("data-id", chat.id);

  el.innerHTML = `
    <div class="history-item-left">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <span class="history-title" id="title-${chat.id}">${escapeHtml(chat.title)}</span>
    </div>
    <button class="options-btn" id="opt-btn-${chat.id}">⋮</button>
    <div class="context-dropdown" id="dropdown-${chat.id}">
      <button class="context-option" id="pin-btn-${chat.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M12 2v20M17 5H7M15 19H9" stroke-linecap="round"/></svg>
        <span>${chat.isPinned ? "Unpin" : "Pin"}</span>
      </button>
      <button class="context-option" id="rename-btn-${chat.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4z"/></svg>
        <span>Rename</span>
      </button>
      <button class="context-option" id="delete-btn-${chat.id}" style="color:#f87171;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        <span>Delete</span>
      </button>
    </div>`;

  el.querySelector(".history-item-left").addEventListener("click", (e) => {
    e.stopPropagation();
    loadConversation(chat.id);
    if (window.innerWidth <= 1024) closeSidebar();
  });

  const optBtn = el.querySelector(`#opt-btn-${chat.id}`);
  const dropdown = el.querySelector(`#dropdown-${chat.id}`);

  optBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = dropdown.classList.contains("show");
    closeAllContextMenus();
    if (!isVisible) {
      dropdown.classList.add("show");
      optBtn.classList.add("active");
    }
  });

  el.querySelector(`#pin-btn-${chat.id}`).addEventListener("click", (e) => {
    e.stopPropagation();
    chat.isPinned = !chat.isPinned;
    chat.updatedAt = Date.now();
    saveHistoryToStorage();
  });

  el.querySelector(`#rename-btn-${chat.id}`).addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllContextMenus();
    triggerRenameInline(chat.id);
  });

  el.querySelector(`#delete-btn-${chat.id}`).addEventListener("click", (e) => {
    e.stopPropagation();
    deleteConversation(chat.id);
  });

  return el;
}

function closeAllContextMenus() {
  document
    .querySelectorAll(".context-dropdown")
    .forEach((d) => d.classList.remove("show"));
  document
    .querySelectorAll(".options-btn")
    .forEach((b) => b.classList.remove("active"));
}

function triggerRenameInline(chatId) {
  const titleSpan = document.getElementById(`title-${chatId}`);
  if (!titleSpan) return;

  const currentTitle = titleSpan.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "rename-input";
  input.value = currentTitle;

  titleSpan.replaceWith(input);
  input.focus();
  input.select();

  const saveRename = () => {
    const newTitle = input.value.trim();
    if (newTitle && newTitle !== currentTitle) {
      const chat = conversations.find((c) => c.id === chatId);
      if (chat) {
        chat.title = newTitle;
        chat.updatedAt = Date.now();
        saveHistoryToStorage();
      }
    } else {
      renderHistoryList();
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveRename();
    if (e.key === "Escape") renderHistoryList();
  });

  input.addEventListener("blur", saveRename);
}

function deleteConversation(chatId) {
  conversations = conversations.filter((c) => c.id !== chatId);
  localStorage.setItem("LUMINA_CONVERSATIONS", JSON.stringify(conversations));
  renderHistoryList();

  if (currentChatId === chatId) {
    startNewChat();
  }
}

function clearAllHistory() {
  conversations = [];
  localStorage.removeItem("LUMINA_CONVERSATIONS");
  renderHistoryList();
  startNewChat();
}

function exportHistory() {
  if (conversations.length === 0) return;
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(conversations, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "LuminaDeen_Chat_Backup.json");
  dlAnchorElem.click();
}

function triggerImport() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        if (!Array.isArray(importedData)) {
          throw new Error(
            "Invalid structure. Backup file must be a JSON array.",
          );
        }

        for (let chat of importedData) {
          if (!chat.id || !chat.title || !Array.isArray(chat.messages)) {
            throw new Error(
              "Corrupted schema structure. Each conversation must contain an id, title, and message array.",
            );
          }
        }

        const existingIds = new Set(conversations.map((c) => c.id));
        let importCount = 0;

        for (let chat of importedData) {
          if (!existingIds.has(chat.id)) {
            conversations.push(chat);
            importCount++;
          }
        }

        if (importCount > 0) {
          saveHistoryToStorage();
          alert(`Successfully restored ${importCount} conversation(s)!`);
        } else {
          alert("No new conversations to restore.");
        }
      } catch (err) {
        alert("Import rejected: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  fileInput.click();
}

// ==========================================================================
// CONVERSATION LIFECYCLE CONTROLLER
// ==========================================================================
function startNewChat() {
  if (isGenerating) return;
  currentChatId = null;
  messagesEl.innerHTML = "";
  messagesEl.appendChild(welcomeCanvas);

  prompt.value = "";
  prompt.style.height = "auto";
  sendBtn.disabled = true;

  document.querySelector(".input-container").classList.remove("typing-active");
  document
    .querySelectorAll(".history-item")
    .forEach((i) => i.classList.remove("active"));
  scrollToBottom();
}

function loadConversation(chatId) {
  if (isGenerating) return;
  const chat = conversations.find((c) => c.id === chatId);
  if (!chat) return;

  currentChatId = chatId;
  messagesEl.innerHTML = "";

  const matchedCard = document.querySelector(
    `.model-option-card[data-model="${chat.model}"]`,
  );
  if (matchedCard) {
    modelOptionCards.forEach((c) => c.classList.remove("active"));
    matchedCard.classList.add("active");
    activeModel = chat.model;
    modelPillText.textContent =
      matchedCard.querySelector(".model-label").textContent;
  }

  chat.messages.forEach((msg) => {
    if (msg.role === "user") {
      appendRawUserMessage(msg.content);
    } else {
      appendRawAIMessage(msg.content, msg.thought);
    }
  });

  renderHistoryList();
  scrollToBottom();
}

function sendSuggestion(text) {
  prompt.value = text;
  prompt.dispatchEvent(new Event("input"));
  handleSend();
}

// ==========================================================================
// DAILY GROUNDED TOPICS CONTROLLER
// ==========================================================================
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDuplicateTopic(topic, existingArray) {
  if (!existingArray || !Array.isArray(existingArray)) return false;
  const clean = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ");
  const normalizedTopic = clean(topic);
  return existingArray.some((item) => clean(item) === normalizedTopic);
}

function openGroundedTopics(e) {
  e.stopPropagation();
  topicsOverlay.classList.add("show");
  loadDailyGroundedTopics();
}

async function loadDailyGroundedTopics(forceRefresh = false) {
  const todayStr = getTodayString();
  const sessionData = localStorage.getItem("LUMINA_DAILY_TOPICS_SESSION");
  let session = null;

  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      if (parsed.date === todayStr) {
        session = parsed;
      } else {
        localStorage.removeItem("LUMINA_DAILY_TOPICS_SESSION");
      }
    } catch (e) {
      console.error("Error reading cached topics session:", e);
    }
  }

  if (session && !forceRefresh && Array.isArray(session.currentTopics)) {
    renderGroundedTopics(session.currentTopics);
    return;
  }

  topicsListContainer.innerHTML = `
    <div class="skeleton-container" style="padding: 10px;">
      <div class="skeleton-line s1" style="margin-bottom: 8px;"></div>
      <div class="skeleton-line s2" style="margin-bottom: 8px;"></div>
      <div class="skeleton-line s3"></div>
    </div>
  `;

  if (!session) {
    session = {
      date: todayStr,
      currentTopics: [],
      history: [],
    };
  }

  try {
    const response = await fetch(`/fetch_daily_topics?_t=${Date.now()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seen_topics: session.history,
        model: activeModel,
      }),
    });

    if (!response.ok) {
      let errorText = "Failed to retrieve daily topics";
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorText = errData.error;
        }
      } catch (e) {}
      throw new Error(errorText);
    }

    const data = await response.json();

    if (data && Array.isArray(data.topics)) {
      session.currentTopics = data.topics;

      data.topics.forEach((topic) => {
        const cleanTopic = topic.trim();
        if (!isDuplicateTopic(cleanTopic, session.history)) {
          session.history.push(cleanTopic);
        }
      });

      if (session.history.length > 100) {
        session.history = session.history.slice(-100);
      }

      localStorage.setItem(
        "LUMINA_DAILY_TOPICS_SESSION",
        JSON.stringify(session),
      );
      renderGroundedTopics(data.topics);
    } else {
      throw new Error("Malformed JSON response");
    }
  } catch (error) {
    console.error("Error loading daily topics:", error);

    const modelLabels = {
      "gemini-3.5-flash": "3.5 Flash",
      "gemini-3.1-flash-lite": "3.1 Flash-Lite",
      "gemini-2.5-flash": "2.5 Flash",
    };
    const selectedLabel = modelLabels[activeModel] || activeModel;

    topicsListContainer.innerHTML = `
      <div style="color: #f87171; font-size: 13px; text-align: center; padding: 16px; line-height: 1.5;">
        ⚠️ Failed to load topics with <strong>${escapeHtml(selectedLabel)}</strong>.<br>
        ${escapeHtml(error.message)}
      </div>
    `;
  }
}

function renderGroundedTopics(topics) {
  topicsListContainer.innerHTML = "";
  topics.forEach((topic) => {
    const pill = document.createElement("button");
    pill.className = "topic-item-pill";
    pill.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${escapeHtml(topic)}</span>
    `;
    pill.onclick = (e) => {
      e.stopPropagation();
      topicsOverlay.classList.remove("show");
      sendSuggestion(topic);
    };
    topicsListContainer.appendChild(pill);
  });
}

function refreshGroundedTopics(event) {
  if (event) {
    event.stopPropagation();
  }

  const refreshBtn = document.querySelector(".refresh-topics-btn");
  const svgIcon = refreshBtn ? refreshBtn.querySelector("svg") : null;

  if (svgIcon) {
    svgIcon.classList.add("rotating");
    setTimeout(() => {
      svgIcon.classList.remove("rotating");
    }, 800);
  }

  loadDailyGroundedTopics(true);
}

function closeGroundedTopics(event) {
  if (event) {
    event.stopPropagation();
  }
  topicsOverlay.classList.remove("show");
}

// ==========================================================================
// UI COMPONENT HANDLERS & TEXT COMPILING
// ==========================================================================
function toggleThinkingBox(headerEl) {
  const container = headerEl.closest(".thinking-container");
  container.classList.toggle("expanded");
  scrollToBottom();
}

function createAIMessagePlaceholderDOM() {
  const el = document.createElement("div");
  el.className = "message ai";
  el.setAttribute("role", "article");
  el.innerHTML = `
    <div class="avatar-col" aria-hidden="true">
      <img src="/static/icons/icon-192x192.png" alt="AI" class="avatar-img">
    </div>
    <div class="bubble-col"></div>`;
  messagesEl.appendChild(el);
  scrollToBottom();
  return el;
}

async function handleSend() {
  const text = prompt.value.trim();
  if (!text || isGenerating) return;

  if (!currentChatId && welcomeCanvas.parentNode) {
    welcomeCanvas.remove();
  }

  isGenerating = true;

  if (!currentChatId) {
    currentChatId = "chat-" + Date.now();
    const cleanTitle = generateCleanTitle(text);

    const newChat = {
      id: currentChatId,
      title: cleanTitle,
      model: activeModel,
      messages: [],
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    conversations.push(newChat);
  }

  const chat = conversations.find((c) => c.id === currentChatId);
  chat.messages.push({ role: "user", content: text });
  chat.updatedAt = Date.now();
  saveHistoryToStorage();

  addUserMessageDOM(text);

  prompt.value = "";
  prompt.style.height = "auto";
  sendBtn.disabled = true;

  document.querySelector(".input-container").classList.remove("typing-active");

  const shimmerEl = showShimmer();

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: text,
        model: activeModel,
        history: chat ? chat.messages : [], // Send full conversation session history
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("QuotaLimitExceeded");
      }
      throw new Error("HTTPConnectionError");
    }

    removeShimmer(shimmerEl);
    const aiMessageEl = createAIMessagePlaceholderDOM();
    const bubbleCol = aiMessageEl.querySelector(".bubble-col");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedThought = "";
    let accumulatedResponse = "";
    let thinkingContainer = null;
    let thinkingContentEl = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split("\n\n");
      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          try {
            const jsonStr = trimmed.substring(6);
            const data = JSON.parse(jsonStr);

            if (data.thought) {
              if (!thinkingContainer) {
                thinkingContainer = document.createElement("div");
                thinkingContainer.className = "thinking-container expanded";
                thinkingContainer.innerHTML = `
                  <div class="thinking-header" onclick="toggleThinkingBox(this)">
                    <span class="thinking-status-text">Thinking...</span>
                    <svg class="thinking-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div class="thinking-content"></div>`;
                bubbleCol.appendChild(thinkingContainer);
                thinkingContentEl =
                  thinkingContainer.querySelector(".thinking-content");
              }
              accumulatedThought += data.thought;
              thinkingContentEl.innerHTML =
                parseMarkdownAndArabic(accumulatedThought);
              scrollToBottom();
            }

            if (data.chunk) {
              if (
                thinkingContainer &&
                !thinkingContainer.classList.contains("thought-complete")
              ) {
                thinkingContainer.classList.add("thought-complete");
                thinkingContainer.classList.remove("expanded");
                thinkingContainer.querySelector(
                  ".thinking-status-text",
                ).style.background = "none";
                thinkingContainer.querySelector(
                  ".thinking-status-text",
                ).style.webkitTextFillColor = "var(--text-dim)";
                thinkingContainer.querySelector(
                  ".thinking-status-text",
                ).textContent = "Thought Complete";
              }
              accumulatedResponse += data.chunk;

              const thoughtBlockMarkup = thinkingContainer
                ? thinkingContainer.outerHTML
                : "";
              bubbleCol.innerHTML =
                thoughtBlockMarkup +
                parseMarkdownAndArabic(accumulatedResponse);

              const newHeader = bubbleCol.querySelector(".thinking-header");
              if (newHeader) {
                newHeader.setAttribute("onclick", "toggleThinkingBox(this)");
              }
              scrollToBottom();
            }
          } catch (e) {}
        }
      }
    }

    chat.messages.push({
      role: "ai",
      content: accumulatedResponse,
      thought: accumulatedThought || null,
    });
    chat.updatedAt = Date.now();
    saveHistoryToStorage();
  } catch (err) {
    removeShimmer(shimmerEl);

    // Explicit dynamic chat error reporter
    let errorMsg =
      "⚠️ [Connection issue: Unable to reach the LuminaDeen server. Please check your internet line or ensure your active API key is set in your .env file]";
    const errText = err.message || "";

    if (
      errText.includes("QuotaLimitExceeded") ||
      errText.includes("RESOURCE_EXHAUSTED") ||
      errText.includes("429")
    ) {
      errorMsg =
        "⚠️ [RESOURCE_EXHAUSTED: Daily Free-Tier Limit reached. Daily quota resets automatically at Midnight Pacific Standard Time (12:00 AM PST). Please switch to another model from the dropdown or try again tomorrow.]";
    } else if (errText.includes("503") || errText.includes("UNAVAILABLE")) {
      errorMsg =
        "⚠️ [Model Overloaded: The selected model is currently experiencing extremely high demand on Google's free tier. Please switch to another model (such as 3.1 Flash-Lite) from the dropdown to continue.]";
    } else if (
      errText.includes("API_KEY_INVALID") ||
      errText.includes("API key")
    ) {
      errorMsg =
        "⚠️ [API Configuration Error: Your Gemini API Key is invalid or expired. Please check your .env configuration.]";
    } else if (
      errText.includes("Failed to retrieve") ||
      errText.includes("Failed to communicate")
    ) {
      errorMsg = `⚠️ [Connection Error: Failed to communicate with the model due to a server error. ${errText}. Please try switching models.]`;
    }

    addAIMessageDOM(errorMsg);
  } finally {
    isGenerating = false;
    sendBtn.disabled = !prompt.value.trim();
  }
}

function generateCleanTitle(promptText) {
  if (!promptText) return "New Chat";
  let cleaned = promptText.replace(
    /^(explain|what is|tell me about|how do we|can you explain|can you tell me|salam|hello|hey|show me|describe)\s+/gi,
    "",
  );
  cleaned = cleaned.trim();
  const words = cleaned.split(/\s+/);
  if (words.length <= 4) {
    return cleaned;
  }
  return words.slice(0, 4).join(" ") + "...";
}

function addUserMessageDOM(text) {
  const el = document.createElement("div");
  el.className = "message user";
  el.setAttribute("role", "article");
  el.innerHTML = `
    <div class="bubble-col">
      <div class="bubble">${escapeHtml(text)}</div>
    </div>`;
  messagesEl.appendChild(el);
  scrollToBottom();
}

function appendRawUserMessage(text) {
  addUserMessageDOM(text);
}

function addAIMessageDOM(rawContent, rawThought = null) {
  const el = document.createElement("div");
  el.className = "message ai";
  el.setAttribute("role", "article");

  const parsedHtml = parseMarkdownAndArabic(rawContent);
  let thoughtHtmlMarkup = "";

  if (rawThought) {
    thoughtHtmlMarkup = `
      <div class="thinking-container thought-complete">
        <div class="thinking-header" onclick="toggleThinkingBox(this)">
          <span class="thinking-status-text">Thought Complete</span>
          <svg class="thinking-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="thinking-content">${parseMarkdownAndArabic(rawThought)}</div>
      </div>`;
  }

  el.innerHTML = `
    <div class="avatar-col" aria-hidden="true">
      <img src="/static/icons/icon-192x192.png" alt="AI" class="avatar-img">
    </div>
    <div class="bubble-col">
      ${thoughtHtmlMarkup}
      ${parsedHtml}
    </div>`;
  messagesEl.appendChild(el);
  scrollToBottom();
}

function appendRawAIMessage(text, thought = null) {
  addAIMessageDOM(text, thought);
}

function showShimmer() {
  const el = document.createElement("div");
  el.className = "message ai";
  el.innerHTML = `
    <div class="avatar-col" aria-hidden="true">
      <img src="/static/icons/icon-192x192.png" alt="AI" class="avatar-img">
    </div>
    <div class="bubble-col" style="max-width: 420px;">
      <div class="skeleton-container" aria-label="LuminaDeen AI is generating answer...">
        <div class="skeleton-line s1" aria-hidden="true"></div>
        <div class="skeleton-line s2" aria-hidden="true"></div>
        <div class="skeleton-line s3" aria-hidden="true"></div>
      </div>
    </div>`;
  messagesEl.appendChild(el);
  scrollToBottom();
  return el;
}

function removeShimmer(shimmerEl) {
  if (shimmerEl) {
    shimmerEl.remove();
  }
}

function scrollToBottom() {
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseMarkdownAndArabic(text) {
  if (!text) return "";

  const lines = text.split(/\r?\n/);
  let parsedHtml = "";
  let inList = false;

  for (let line of lines) {
    let processedLine = line.trim();
    if (!processedLine) {
      if (inList) {
        parsedHtml += "</ul>";
        inList = false;
      }
      continue;
    }

    if (processedLine.startsWith("* ") || processedLine.startsWith("- ")) {
      if (!inList) {
        parsedHtml += '<ul class="markdown-list">';
        inList = true;
      }
      processedLine = processedLine.substring(2);
      processedLine = formatInlineMarkdown(processedLine);
      parsedHtml += `<li>${processedLine}</li>`;
      continue;
    } else if (inList) {
      parsedHtml += "</ul>";
      inList = false;
    }

    let isHeader = false;
    if (processedLine.startsWith("### ")) {
      processedLine = `<h3 class="markdown-header">${formatInlineMarkdown(processedLine.substring(4))}</h3>`;
      isHeader = true;
    } else if (processedLine.startsWith("## ")) {
      processedLine = `<h2 class="markdown-header">${formatInlineMarkdown(processedLine.substring(3))}</h2>`;
      isHeader = true;
    } else if (processedLine.startsWith("# ")) {
      processedLine = `<h1 class="markdown-header">${formatInlineMarkdown(processedLine.substring(2))}</h1>`;
      isHeader = true;
    }

    const numberedListMatch = processedLine.match(/^(\d+)\.\s+(.*)$/);
    if (numberedListMatch && !isHeader) {
      const listContent = formatInlineMarkdown(numberedListMatch[2]);
      processedLine = `<p class="english-text"><strong class="highlight">${numberedListMatch[1]}.</strong> ${listContent}</p>`;
    } else if (!isHeader) {
      processedLine = formatInlineMarkdown(processedLine);
    }

    const hasArabic =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
        processedLine,
      );
    if (hasArabic && !isHeader) {
      parsedHtml += `<p class="arabic-text" dir="rtl">${processedLine}</p>`;
    } else if (isHeader) {
      parsedHtml += processedLine;
    } else {
      parsedHtml += `<p class="english-text">${processedLine}</p>`;
    }
  }

  if (inList) {
    parsedHtml += "</ul>";
  }

  return parsedHtml;
}

function formatInlineMarkdown(text) {
  let formatted = text;

  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="highlight">$1</strong>',
  );
  formatted = formatted.replace(
    /__(.*?)__/g,
    '<strong class="highlight">$1</strong>',
  );
  formatted = formatted.replace(
    /\*\((.*?)\*/g,
    '<em class="markdown-italic">$1</em>',
  );
  formatted = formatted.replace(
    /_(.*?)_/g,
    '<em class="markdown-italic">$1</em>',
  );

  formatted = formatted.replace(
    /\[Reference:\s*(.*?)\]/gi,
    (match, refContent) => {
      return `<span class="reference-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18-3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${refContent}
    </span>`;
    },
  );

  formatted = formatted.replace(/\[⚠️\s*(.*?)\]/gi, (match, warningContent) => {
    return `<span class="warning-badge">⚠️ ${warningContent}</span>`;
  });

  return formatted;
}

// Progressive Web App active Registration block [1.2.6]
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) =>
        console.log("[PWA] Service Worker registered scope:", reg.scope),
      )
      .catch((err) =>
        console.error("[PWA] Service Worker registration failed:", err),
      );
  });
}

// Expose all inline HTML event handlers globally to window
window.toggleViewTheme = toggleViewTheme;
window.exportHistory = exportHistory;
window.triggerImport = triggerImport;
window.clearAllHistory = clearAllHistory;
window.renameProfile = renameProfile;
window.openGroundedTopics = openGroundedTopics;
window.refreshGroundedTopics = refreshGroundedTopics;
window.closeGroundedTopics = closeGroundedTopics;
window.toggleThinkingBox = toggleThinkingBox;
