from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json
import os
import itertools
import threading

load_dotenv()  # reads a local .env file if present (no-op in most hosted envs)

app = Flask(__name__)


with open("mind.json", "r") as f:
    data = json.load(f)

# GEMINI_API_KEYS = comma-separated list of active keys, e.g.
#   GEMINI_API_KEYS=key1,key2,key3,key4
# Add more later (e.g. your 2 reserved keys) by editing this ONE env var —
# no code changes needed.
_raw_keys = os.environ.get("GEMINI_API_KEYS", "")
API_KEYS = [k.strip() for k in _raw_keys.split(",") if k.strip()]

if not API_KEYS:
    raise RuntimeError(
        "No API keys found. Set GEMINI_API_KEYS as a comma-separated list "
        "in your environment (e.g. in a .env file)."
    )

print(f"[LuminaDeen] Loaded {len(API_KEYS)} Gemini API key(s).")

_key_cycle = itertools.cycle(API_KEYS)
_key_lock = threading.Lock()

def get_client():
    """Round-robins across all configured keys, one client per call."""
    with _key_lock:
        key = next(_key_cycle)
    return genai.Client(api_key=key)


ISLAMIC_SYSTEM_PROMPT = """
You are LuminaDeen AI — an Islamic knowledge assistant. Your purpose is to
help users understand Islam through authentic sources: the Quran and
verified Hadith collections (Sahih Bukhari, Sahih Muslim, Abu Dawud,
Tirmidhi, Ibn Majah, An-Nasa'i).

SCOPE:
Answer questions about Islam and topics a Muslim would reasonably ask an
Islamic assistant, including:
- Quran, Hadith, Fiqh (jurisprudence), Aqeedah (belief), Seerah (Prophet's life)
- Islamic history, Islamic finance/Zakat/Halal-Haram matters
- Comparative religion questions asked in good faith
- Daily-life guidance framed through an Islamic lens (ethics, family,
  worship, character)
- Questions about how to practice or understand a concept, even if no
  single verse or hadith covers it directly — you may explain using
  established scholarly consensus (ijma) or general Islamic principles.

Only decline clearly unrelated topics (e.g. sports scores, coding help,
pop culture, politics unrelated to Islam) — and when you do, say so briefly
and invite an Islamic question instead. Do not decline borderline or
adjacent topics; when in doubt, answer.

REFERENCING RULES:
- When your answer is based on a specific, well-known verse or hadith,
  cite it: [Reference: Quran X:XX] or [Reference: Sahih Bukhari X:XXX], etc.
- If your answer draws on general Islamic scholarship, consensus, or
  reasoning rather than one specific verse/hadith, say so plainly instead
  of forcing a citation — for example: "This is based on general Islamic
  teachings on [topic] rather than one specific verse."
- NEVER fabricate a hadith number, chapter, or wording you are not
  confident is authentic. If you are not certain a specific reference
  exists, say so and recommend the user verify with a qualified scholar —
  do not guess.
- Not every sentence needs a citation. Cite what is directly quoted or
  attributed; explain the rest in your own words.

TONE:
- Respond with Islamic etiquette — Bismillah where appropriate, respectful
  and warm language — without being overly formal or repetitive.
- Keep answers clear and helpful. Match the depth of the question: a
  quick factual question gets a concise answer; a "explain this concept"
  question can go deeper.
- For matters of personal religious rulings (fatwa) specific to someone's
  situation, give general guidance and recommend consulting a qualified
  scholar for their specific case — but still engage with the question.
RESPONSE STYLE:
- Write like you're personally explaining this to someone, not composing
  a reference-book entry. Default to 3-6 short paragraphs for most
  questions. Only go longer if the user explicitly asks for detail,
  depth, or "tell me everything about X."
- Do NOT default to numbered lists for biographical or narrative topics
  (e.g. "who was Aisha (RA)") — tell it as flowing prose with natural
  paragraph breaks, the way a person would explain it aloud. Use numbered
  or bulleted lists only for genuinely list-like content: steps, ranked
  items, categories.
- Use **bold** sparingly — only for names, key terms, or the one idea you
  most want to stand out per paragraph, not on every sub-heading.
- Break your answer into short paragraphs (2-4 sentences each). Avoid
  single giant paragraphs and avoid over-structuring simple answers into
  6+ numbered subsections.
- End with the reference, not with a stacked summary restating everything
  you just said.
"""

def search_knowledge_base(question):
    """Check hardcoded mind.json first"""
    question = question.lower()

    if "your name" in question:
        return data.get('name')
    if "your purpose" in question:
        return data.get('your purpose')
    if "hey" in question or "hello" in question or "salam" in question:
        return data.get('hey')
    if "huffaz" in question and "yamamah" in question:
        return data.get('Battle of Yamamah')
    if "clutch" in question:
        return data.get('Who is clutch') 

    return None  

def ask_gemini(question, history=None):
    # Fold prior turns (sent by the frontend from localStorage) into the
    # prompt so follow-up questions keep context, e.g. "explain that more".
    conversation = ""
    if history:
        for msg in history[-10:]:
            speaker = "User" if msg.get("role") == "user" else "LuminaDeen AI"
            text = (msg.get("content") or "").strip()
            if text:
                conversation += f"{speaker}: {text}\n"

    prompt = (
        ISLAMIC_SYSTEM_PROMPT
        + "\n\n" + conversation
        + "User question: " + question
        + "\n\nReminder before you answer: if a specific Quran verse or "
          "authentic Hadith supports your answer, cite it clearly, e.g. "
          "[Reference: Quran 2:255] or [Reference: Sahih Bukhari 1:1]. "
          "If your answer instead relies on general Islamic scholarship or "
          "consensus rather than one specific verse/hadith, say so plainly "
          "instead of forcing a citation."
    )

    # Try up to once per configured key. If one key is rate-limited/out of
    # quota/erroring, move on to the next one automatically.
    last_error = None
    for attempt in range(len(API_KEYS)):
        try:
            client = get_client()
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_level="low")
                ),
            )
            if not response.text:
                # Gemini returned no text — likely blocked by safety filters or empty candidate
                print(f"[Gemini empty response] question={question!r} response={response}")
                return "I wasn't able to generate a response to that. Could you rephrase your question?"
            return response.text
        except Exception as e:
            last_error = e
            print(f"[Gemini API error, attempt {attempt + 1}/{len(API_KEYS)}] {type(e).__name__}: {e}")
            continue

    print(f"[Gemini API error] all keys exhausted, last error: {last_error}")
    return "I'm having trouble reaching my knowledge source right now. Please try again in a moment."

@app.route('/sw.js')
def service_worker():
    # Served from the root path (not /static/sw.js) so it can control the whole site
    return app.send_static_file('sw.js')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/zakat-calculator')
def zakat_calculator():
    return render_template('zakat_calculator.html')

@app.route('/zakat-guide')
def zakat_guide():
    return render_template('zakat_guide.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question', '')
    history = request.json.get('history', [])  # [{role, content}, ...] from the saved chat

    if not question:
        return jsonify({'answer': 'Please ask a question.'})

    # Always check the local JSON answers first, even mid-conversation —
    # this both fixes questions silently falling through to Gemini after
    # the first message, and saves quota since matched questions never
    # touch the Gemini API at all.
    answer = search_knowledge_base(question)

    if not answer:
        answer = ask_gemini(question, history)

    return jsonify({'answer': answer})

@app.route('/ping')
def ping():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)