# LuminaDeen-AI

## An Islamic dedicated Ai chatbot.
# 🌙 LuminaDeen AI

**Your trusted companion for authentic Islamic knowledge — powered by AI, grounded in the Quran and Sunnah.**

---

## 📖 About LuminaDeen AI

LuminaDeen AI is a dedicated Islamic knowledge assistant designed to help Muslims (and curious minds) get clear, respectful, and *authentic* answers to questions about Islam. Every response is rooted in the Quran and verified Hadith collections — no speculation, no fabrication.

Whether you're curious about the basics of faith, the life of the Prophet ﷺ, Islamic history, or matters of daily practice, LuminaDeen AI is here to guide you — always with a proper reference, and always within the boundaries of Islamic knowledge.

---

## ✨ Features

- 🤖 **AI-Powered Responses** — Built on an integrated model for natural, helpful answers
- 📚 **Authentic References Only** — Every answer is backed by a Quranic verse or recognized Hadith collection (Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i)
- 🎯 **Strictly Islamic Focus** — Stays on topic; politely redirects off-topic questions back to Islamic guidance
- 🕊️ **Respectful & Etiquette-Driven** — Responses follow Islamic etiquette, including Bismillah where appropriate
- ⚠️ **Honest About Limits** — If no direct reference exists, it transparently advises consulting a qualified scholar
- 🧠 **Custom Knowledge Layer** — Instant responses for common questions via a built-in knowledge base

---

## 🛠️ Tech Stack

- **Backend:** Python (Flask)
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`)
- **Frontend:** HTML, CSS, JavaScript
- **Data:** JSON-based local knowledge base for quick responses

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/luminadeen-ai.git
   cd luminadeen-ai
```

2. **Install dependencies**
```bash
   pip install flask google-genai
```

3. **Set your Gemini API key**
```bash
   export GEMINI_API_KEY="your-api-key-here"
```
   *(On Windows: `set GEMINI_API_KEY=your-api-key-here`)*

4. **Run the app**
```bash
   python app.py
```

5. **Open in your browser**
http://127.0.0.1:5000

---

### Web-App Link

```
https://luminadeen-ai.onrender.com
```

## 💬 How It Works

1. The user types a question into the chat interface.
2. The app first checks a local knowledge base (`mind.json`) for instant, predefined answers.
3. If no match is found, the question is passed to API Model with a strict Islamic system prompt.
4. The AI responds only if the question is Islam-related, always closing with a Quran or Hadith reference.
5. Off-topic questions receive a polite redirect back to Islamic topics.

---

## 📁 Project Structure
luminadeen-ai/

├── app.py              # Flask backend & AI logic

├── mind.json           # Local knowledge base

├── templates/

│   └── index.html      # Chat interface

└── README.md

---

## 🎯 Vision & Roadmap

LuminaDeen AI is built with one clear mission: **to remain a trustworthy, scholarly-grounded source of Islamic knowledge** — never drifting into unrelated topics, never fabricating references.

* 🤖 Long-term vision: build a fully independent Islamic AI ecosystem, including our own models, infrastructure, and knowledge systems, ensuring complete control, transparency, and alignment with authentic Islamic scholarship

Planned improvements:
- 🤖 Develop our own Islamic-focused AI models
- 🧠 Build a dedicated knowledge system based on authentic Islamic sources
- 🏗️ Create independent AI infrastructure for greater reliability and control
- 🔒 Reduce dependence on third-party AI providers
- 🌍 Establish a complete Islamic AI ecosystem for future generations

- 🌐 Multi-language support (Arabic, Urdu, and more)
- 📱 Mobile-friendly responsive design
- 🔍 Expanded local knowledge base with more authentic Q&A pairs
- 🕌 Prayer time and Qibla direction integration
- 📥 User feedback system for continuous improvement 

---

## ⚠️ Disclaimer

LuminaDeen AI is an educational tool meant to assist and guide. For matters requiring detailed religious rulings (Fatwa) or personal guidance, please consult a qualified Islamic scholar.

---

## 🤲 Acknowledgements

Built with the intention of making Islamic knowledge more accessible — may it be a means of benefit (Sadaqah Jariyah) for all who use it

*"And say: My Lord, increase me in knowledge." — [Quran 20:114]*