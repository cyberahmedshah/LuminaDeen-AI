markdown

# LuminaDeen AI

**Your trusted companion for authentic Islamic knowledge — powered by AI, grounded in the Quran and Sunnah, and built as a modern, installable Progressive Web App.**

---

## 📖 About LuminaDeen AI

LuminaDeen AI is a dedicated Islamic knowledge assistant designed to help Muslims (and curious minds) get clear, respectful, and _authentic_ answers to questions about Islam [35]. Every response is rooted in the Quran and verified Hadith collections — no speculation, no fabrication [35].

Whether you're curious about the basics of faith, Prophetic biography (Seerah), Islamic history, or matters of daily practice, LuminaDeen AI is here to guide you — always with a proper citation, and always within the boundaries of Islamic knowledge [35].

---

## ✨ Features

- 🤖 **Dynamic Multi-Model Streaming** — Uses Google’s next-generation developer API endpoints (`gemini-3.5-flash` and `gemini-3.1-flash-lite`) to stream responses character-by-character in real-time, matching the Google AI Studio monologue thinking layout [1.3.2, 1.4.6].
- 📚 **Authentic References Only** — Every answer is backed by a Quranic verse or recognized Hadith collection (Sahih al-Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i) [35].
- 🎯 **Strictly Islamic Focus & Natural Refusals** — Updates your system prompts to enforce context-aware, organic refusals for off-topic questions, while explicitly permitting natural conversational meta-questions (such as asking the AI about its own past conversation history).
- 💬 **Conversational Multi-Turn Memory** — Transitioned the chatbot from stateless replies to full multi-turn awareness by packaging past conversation histories directly inside the `/ask` payload.
- 🎨 **Luxury Obsidian Theme** — Designed with a deep, dark obsidian-slate visual palette featuring slowly pulsing, organic background fluid waves, rotating glowing input borders, and elegant classical serif typography (`Cormorant Garamond`).
- 🧭 **✨ Explore Daily Topics (Google Search Grounded)** — Generates three fresh daily discussion questions by initiating a live Google Search Grounding request to determine active Islamic calendar dates, Thursday/Friday themes, or historical events, complete with:
  - **Dynamic Cache Bypassing:** Appends random timestamp query parameters to completely bypass browser-side HTTP caching.
  - **Uniqueness Filters:** Tracks same-day generated history arrays to guarantee unique, non-deterministic choices on refresh.
  - **Next-Day Cache Purging:** Automatically wipes old cached topics when a new day arrives.
- 🛡️ **Multi-Tiered Backend Failovers** — Configured your backend to handle API quotas or `503 Service Unavailable` overloads gracefully by falling back from live web search grounding to standard model generation, and finally to `gemini-3.1-flash-lite` to ensure the dashboard loads reliably [1.1.1, 1.1.5, 1.2.6].
- 📱 **Installable Progressive Web App (PWA)** — Integrated a standard `manifest.json` and full-scope caching service worker (`sw.js`) allowing users to install LuminaDeen AI natively on Android, iOS, or desktop taskbars [1.2.6].
- 📥 **Defensive Data backups** — Allows users to export their entire chat history database as a `.json` backup and restore past conversations safely using a defensive schema-validating file importer [1.2.5].

---

## 🛠️ Tech Stack

- **Backend:** Python (Flask)
- **AI Engine:** Google GenAI Unified SDK (`google-genai` and `google.genai.types`) [1.1.6]
- **Web Grounding:** Google Search Tool Integration [1.1.2]
- **Frontend:** Standard HTML5, CSS3 Variables, and Vanilla JavaScript (separated directory architecture)
- **Local Storage:** HTML5 `localStorage` database for offline-ready persistence [12]

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ [12]
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/luminadeen-ai.git
cd luminadeen-ai
```

````

2. **Initialize your isolated virtual environment**

```bash
python -m venv venv
source venv/Scripts/activate  # On Windows Git Bash / MINGW64
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Set your Gemini API key inside your secure `.env` file**
   Create a file named `.env` in the root folder of your project and paste your key [20]:

```text
GEMINI_API_KEY="your_actual_ai_studio_api_key_here"
```

5. **Run the app**

```bash
python app.py
```

6. **Open in your browser**
   Navigate directly to: **`http://127.0.0.1:5000`**

---

## 📁 Project Structure

```text
LuminaDeen-AI/
├── app.py                      # Flask backend, streaming endpoints & search grounding [1.2.6]
├── mind.json                   # Local knowledge base fallback
├── templates/
│   └── index.html              # Clean, responsive HTML dashboard [3.5]
├── static/
│   ├── sw.js                   # Network-first service worker cache manager [1.2.6]
│   ├── manifest.json           # Progressive Web App installer configuration [1.2.6]
│   ├── style.css               # Separated CSS layout styles & animations (Optional)
│   ├── script.js               # Separated local storage script logic (Optional)
│   └── icons/
│       ├── icon-192x192.png    # PWA and desktop tab icon (192px) [1.2.6]
│       └── icon-512x512.png    # PWA home screen launcher icon (512px) [1.2.6]
├── requirements.txt            # Locked Python library dependencies [7]
└── README.md                   # Complete developer setups and runtime architecture
```

---

## 💬 How It Works Under the Hood

1. **Onboarding:** When a user opens the page for the first time, a dark-glass overlay modal welcomes them and prompts them to enter their name [12, 20]. The name is stored permanently in the browser's `localStorage` and can be edited inline inside the profile bar [12].
2. **Database Routing:** When a message is sent, JavaScript initializes a unique session, generates a clean NLP title (stripping operational directives like _"What is"_), and stores the session inside `localStorage` [12].
3. **SSE Streaming:** The request is sent to Flask. If there is no local `mind.json` match, `app.py` initiates a Server-Sent Events (SSE) connection [35]. The server streams candidate parts, isolating model reasoning thoughts (`part.thought`) from final answer chunks [1.1.1, 1.1.6, 1.2.6].
4. **Bilingual Rendering:** The frontend reads the stream in real-time, compiles headings, italics, and list nodes on the fly, and uses a custom regex to format Arabic paragraphs Right-to-Left (RTL) using classical `Amiri` typefaces while keeping English citations LTR [35].

---

## ⚠️ Disclaimer

LuminaDeen AI is an educational tool meant to assist and guide. For matters requiring detailed religious rulings (Fatwa) or personal guidance, please consult a qualified Islamic scholar.

---

## 🤲 Acknowledgements

Built with the intention of making Islamic knowledge more accessible — may it be a means of benefit (Sadaqah Jariyah) for all who use it.

_"And say: My Lord, increase me in knowledge." — [Quran 20:114]_

```

---
**Current File:** `LuminaDeen-AI/README.md`
**Next File:** `LuminaDeen-AI/requirements.txt` (Verifying package list and locking configurations)
````
