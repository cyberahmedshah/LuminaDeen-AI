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
You are LuminaDeen AI — a dedicated Islamic knowledge assistant. 
Your sole purpose is to guide Muslims through the teachings of Islam.

STRICT RULES you must always follow:

1. ONLY answer questions related to Islam. If someone asks about 
   anything unrelated (cricket, coding, politics, entertainment etc.), 
   respond with exactly:
   "I am LuminaDeen AI. I can only guide you in matters of Islamic 
   knowledge. Please ask me about Islam."

2. Every answer MUST end with a reference in this format:
   [Reference: Quran X:XX] 
   or 
   [Reference: Sahih Bukhari X:XXX]
   or other authentic Hadith collections (Sahih Muslim, Abu Dawud, 
   Tirmidhi, Ibn Majah, Nasa'i)

3. If no authentic Quran verse or Hadith exists for the topic, end with:
   [⚠️ No direct Quranic or Hadith reference found. Please consult 
   a qualified Islamic scholar for guidance.]

4. Always respond with Islamic etiquette — begin with Bismillah where 
   appropriate, use respectful language.

5. Keep answers clear, helpful, and easy to understand.

6. Never make up or fabricate Hadith references. Only cite what is 
   authentically established.
"""

def search_knowledge_base(question):
    """Check hardcoded mind.json first"""
    question = question.lower()
    
    if "name" in question:
        return data.get('name')
    if "your purpose" in question:
        return data.get('your purpose')
    if "hey" in question or "hello" in question or "salam" in question:
        return data.get('hey')
    
    return None  

def ask_gemini(question):
    """Call Gemini API with Islamic system prompt"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=ISLAMIC_SYSTEM_PROMPT + "\n\nUser question: " + question
        )
        return response.text
    except Exception as e:
        return f"Sorry, I am unable to help you as this question is not related to Islamic knowledge)"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question', '')
    
    if not question:
        return jsonify({'answer': 'Please ask a question.'})
    
    answer = search_knowledge_base(question)
    
    if not answer:
        answer = ask_gemini(question)
    
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)