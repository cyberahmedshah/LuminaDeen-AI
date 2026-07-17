from flask import Flask, render_template, request, jsonify
from google import genai
import json
import os

app = Flask(__name__)


with open("mind.json", "r") as f:
    data = json.load(f)

api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


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
    
    return None  

def ask_gemini(question):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=ISLAMIC_SYSTEM_PROMPT + "\n\nUser question: " + question
        )
        if not response.text:
            # Gemini returned no text — likely blocked by safety filters or empty candidate
            print(f"[Gemini empty response] question={question!r} response={response}")
            return "I wasn't able to generate a response to that. Could you rephrase your question?"
        return response.text
    except Exception as e:
        print(f"[Gemini API error] {type(e).__name__}: {e}")
        return "I'm having trouble reaching my knowledge source right now. Please try again in a moment."

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
    
    if not question:
        return jsonify({'answer': 'Please ask a question.'})
    
    answer = search_knowledge_base(question)
    
    if not answer:
        answer = ask_gemini(question)
    
    return jsonify({'answer': answer})

@app.route('/ping')
def ping():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)

