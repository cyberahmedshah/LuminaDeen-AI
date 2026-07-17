import traceback
import re
import os
import sys
import json
import random
# Import missing datetime module to prevent runtime NameError crash [1.2.2]
import datetime
from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from google import genai
from google.genai import types

# Native .env loader placed safely below standard library imports [20]
if os.path.exists(".env"):
    with open(".env", "r") as env_file:
        for line in env_file:
            if "=" in line and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key.strip()] = val.strip().replace(
                    '"', '').replace("'", "")

app = Flask(__name__)

# Load local knowledge base configurations safely
try:
    with open("mind.json", "r") as f:
        data = json.load(f)
except FileNotFoundError:
    print("Warning: mind.json was not found. Local knowledge base fallback disabled.")
    data = {}

# Secure secret credentials management [20]
api_key: str | None = os.environ.get("GEMINI_API_KEY")
client: genai.Client = genai.Client(api_key=api_key)

ISLAMIC_SYSTEM_PROMPT: str = """
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


def search_knowledge_base(question: str) -> str | None:
    """Check local JSON database first to return rapid, zero-cost cached replies."""
    question_lower = question.lower()

    if "your name" in question_lower:
        return data.get('name')
    if "your purpose" in question_lower:
        return data.get('your purpose')
    if "hey" in question_lower or "hello" in question_lower or "salam" in question_lower:
        return data.get('hey')
    if "huffaz" in question_lower and "yamamah" in question_lower:
        return data.get('Battle of Yamamah')

    return None


def ask_gemini(question: str, model_name: str) -> str:
    """Call Google Developer GenAI API with Islamic system prompt and dynamic model routing."""
    allowed_models: list[str] = ["gemini-3.5-flash",
                                 "gemini-3.1-flash-lite", "gemini-2.5-flash"]
    if model_name not in allowed_models:
        model_name = "gemini-3.5-flash"

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=ISLAMIC_SYSTEM_PROMPT + "\n\nUser question: " + question
        )
        return response.text
    except Exception as e:
        print(
            f"Exception encountered during Gemini API Call ({model_name}): {e}", file=sys.stderr)
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            return "⚠️ Dynamic model limit reached: The daily free-tier limit has been hit for this model. Please try again tomorrow at 12:00 AM PST (Google's daily quota reset time), or switch to another model from the dropdown."
        elif "503" in err_str or "UNAVAILABLE" in err_str:
            return "⚠️ Model Overloaded: The selected model is currently experiencing extremely high demand on Google's free tier. Please switch to another model (such as 3.1 Flash-Lite) to continue."
        return "Sorry, I am unable to help you due to an internal server communication issue."


@app.route('/sw.js')
def serve_sw() -> Response:
    """Serves the service worker from root scope with safe MIME settings [1.2.6]."""
    return app.send_static_file('sw.js')


@app.route('/manifest.json')
def serve_manifest() -> Response:
    """Serves the manifest configuration from root scope."""
    return app.send_static_file('manifest.json')


@app.route('/')
def home() -> str:
    """Renders the primary chat dashboard interface [3.5]."""
    return render_template('index.html')


@app.route('/ask', methods=['POST'])
def ask() -> Response:
    """
    JSON POST streaming endpoint. Generates a Server-Sent Events (SSE) stream, 
    dynamically isolating internal thoughts from final answer chunks [1.1.1, 1.1.6, 1.2.6].
    """
    payload = request.json
    if not payload:
        return Response("data: {\"chunk\": \"Error: Invalid JSON payload.\"}\n\n", mimetype='text/event-stream')

    question: str = payload.get('question', '').strip()
    model_name: str = payload.get('model', 'gemini-3.5-flash')

    if not question:
        return Response("data: {\"chunk\": \"Please ask a question.\"}\n\n", mimetype='text/event-stream')

    # 1. Check local static database first
    cached_answer: str | None = search_knowledge_base(question)

    # Whitelisting defensive model checks
    allowed_models: list[str] = ["gemini-3.5-flash",
                                 "gemini-3.1-flash-lite", "gemini-2.5-flash"]
    if model_name not in allowed_models:
        model_name = "gemini-3.5-flash"

    def generate_stream():
        if cached_answer:
            yield f"data: {json.dumps({'chunk': cached_answer})}\n\n"
            return

        try:
            # Enable thinking configuration dynamically for reasoning models [1.2.3, 1.2.6]
            config = types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig()
            )
            response_stream = client.models.generate_content_stream(
                model=model_name,
                contents=ISLAMIC_SYSTEM_PROMPT + "\n\nUser question: " + question,
                config=config
            )
            for chunk in response_stream:
                if chunk.candidates and chunk.candidates[0].content and chunk.candidates[0].content.parts:
                    for part in chunk.candidates[0].content.parts:
                        # Extract thoughts vs text chunks dynamically using part.thought [1.2.6]
                        if getattr(part, 'thought', False):
                            if part.text:
                                yield f"data: {json.dumps({'thought': part.text})}\n\n"
                        elif part.text:
                            yield f"data: {json.dumps({'chunk': part.text})}\n\n"
        except Exception as e:
            print(
                f"Exception during client stream iteration ({model_name}): {e}", file=sys.stderr)
            err_str = str(e)

            # Smart, specific chat exception reporter
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                msg = "⚠️ Dynamic model limit reached: The daily free-tier limit has been hit for this model. Please try again tomorrow at 12:00 AM PST (Google's daily quota reset time), or switch to another model from the dropdown."
            elif "503" in err_str or "UNAVAILABLE" in err_str:
                msg = "⚠️ Model Overloaded: The selected model is currently experiencing extremely high demand on Google's free tier. Please switch to another model (such as 3.1 Flash-Lite) to continue."
            elif "API_KEY_INVALID" in err_str or "API key" in err_str:
                msg = "⚠️ API Configuration Error: Your Gemini API Key is invalid or expired. Please check your .env configuration."
            else:
                msg = f"⚠️ Connection Error: Failed to communicate with the model due to a server error ({err_str}). Please try switching models."

            yield f"data: {json.dumps({'chunk': msg})}\n\n"

    return Response(stream_with_context(generate_stream()), mimetype='text/event-stream')


def extract_json_array(text: str) -> list | None:
    """
    Safely parses JSON arrays wrapped in conversational or markdown text.
    Bypasses wrapping markers like ```json or leading introductory sentences.
    """
    cleaned = text.strip()

    # Locate the outer boundaries of the square brackets
    start = cleaned.find('[')
    end = cleaned.rfind(']')

    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start:end+1]
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, list):
                # Return string list with clean trailing and leading spaces stripped
                return [str(item).strip() for item in parsed if item]
        except Exception as e:
            print(
                f"[JSON Parser Warning] Inner candidate parsing failed: {e}", file=sys.stderr)

    # Fallback to a direct loads try
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if item]
    except Exception:
        pass

    return None


@app.route('/fetch_daily_topics', methods=['POST'])
def fetch_daily_topics() -> Response | tuple[Response, int]:
    """
    Searches the live web using Google Search Grounding to generate 
    3 highly relevant, custom Islamic topics for today's date dynamically.
    Uses the client's currently selected chat model.
    Strictly uses live search grounding with no predefined fallback templates.
    """
    try:
        current_date_str = datetime.date.today().strftime("%B %d, %Y")

        # Parse seen topics and active model selection from frontend payload
        seen_topics = []
        model_name = "gemini-3.5-flash"  # Default fallback model
        if request.is_json:
            payload = request.get_json()
            seen_topics = payload.get('seen_topics', [])
            model_name = payload.get('model', 'gemini-3.5-flash')

        # Defensive whitelist verification
        allowed_models = ["gemini-3.5-flash",
                          "gemini-3.1-flash-lite", "gemini-2.5-flash"]
        if model_name not in allowed_models:
            model_name = "gemini-3.5-flash"

        # Choose a random dynamic category focus to ensure diversity
        random_themes: list[str] = [
            "Islamic History & Civilizations", "Quranic Sciences & Tafsir",
            "Hadith Studies & Preservation", "Islamic Akhlaq (Character) & Ethics",
            "Fiqh (Jurisprudence) & Daily Life", "Seerah (Prophetic Biography) lessons",
            "Islamic Philosophy & Spirituality (Tazkiyah)"
        ]
        chosen_focus: str = random.choice(random_themes)

        # Inject instructions to avoid previously seen questions
        exclude_instruction = ""
        if isinstance(seen_topics, list) and len(seen_topics) > 0:
            limited_seen = seen_topics[-100:]
            exclude_instruction = (
                f" IMPORTANT: Do NOT generate or repeat any of these already seen topics: {limited_seen}. "
                f"You must generate 3 entirely different, distinct questions."
            )

        # Prompt modified to require briefer, simpler, and highly concise questions
        prompt = (
            f"Search Google for current Islamic dates, calendar events, or beneficial "
            f"Islamic discussion themes for today's date: {current_date_str}. "
            f"Based on your findings, formulate exactly three encouraging discussion questions "
            f"or topics for today, focusing particularly on: {chosen_focus}."
            f"{exclude_instruction} "
            f"IMPORTANT: Make each topic extremely brief, simple, clear, and easy for readers to understand. "
            f"Return ONLY a raw, valid JSON list of 3 strings (e.g. ['topic1', 'topic2', 'topic3'])."
        )

        topics = None

        # ==========================================
        # TIER 1: Attempt Grounded Web Search
        # ==========================================
        try:
            config = types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.90
            )
            response = client.models.generate_content(
                model=model_name,  # Dynamically matched to selected model
                contents=prompt,
                config=config
            )
            topics = extract_json_array(response.text)
        except Exception as search_err:
            print(
                f"[Warning] Google Search Grounding failed: {search_err}. Trying standard AI fallback...", file=sys.stderr)

        # ==========================================================
        # TIER 2: Dynamic Standard AI Generation Fallback on SELECTED model
        # ==========================================================
        if not topics or not isinstance(topics, list) or len(topics) < 3:
            fallback_prompt = (
                f"Formulate exactly three encouraging and unique Islamic discussion questions "
                f"or topics for a Muslim audience today ({current_date_str}), focusing particularly on: {chosen_focus}."
                f"{exclude_instruction} "
                f"IMPORTANT: Make each topic extremely brief, simple, clear, and easy for readers to understand. "
                f"Return ONLY a raw, valid JSON list of 3 strings (e.g. ['topic1', 'topic2', 'topic3'])."
            )

            fallback_config = types.GenerateContentConfig(temperature=0.95)

            try:
                fallback_response = client.models.generate_content(
                    model=model_name,  # Try standard generation on selected model
                    contents=fallback_prompt,
                    config=fallback_config
                )
                topics = extract_json_array(fallback_response.text)
            except Exception as selected_model_err:
                print(
                    f"[Warning] Standard fallback failed on selected model {model_name}: {selected_model_err}. Escalating to secure safe-model failover...", file=sys.stderr)
                topics = None

        # ==========================================================
        # TIER 3: Safe-Model Dynamic Generation Failover (Bypasses local model 503 limits)
        # ==========================================================
        if not topics or not isinstance(topics, list) or len(topics) < 3:
            try:
                # Force dynamic fallback generation on the highly-available, lite model
                fallback_response = client.models.generate_content(
                    model="gemini-3.1-flash-lite",
                    contents=fallback_prompt,
                    config=fallback_config
                )
                topics = extract_json_array(fallback_response.text)
            except Exception as ultimate_err:
                print(
                    f"[Critical Error] Ultimate fallback generation on gemini-3.1-flash-lite failed: {ultimate_err}", file=sys.stderr)
                topics = None

        if isinstance(topics, list) and len(topics) >= 3:
            res = jsonify({'topics': topics[:3]})
            res.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            res.headers["Pragma"] = "no-cache"
            res.headers["Expires"] = "0"
            return res

        raise ValueError(
            "AI Search Grounding did not return a valid JSON array of at least 3 topics.")

    except Exception as e:
        print(
            f"Exception during grounded search retrieval: {e}", file=sys.stderr)
        traceback.print_exc()

        # Smart, descriptive error forwarder for topics
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            err_msg = "The dynamic search limit has been hit for this model. Please switch to another model from the dropdown or try again tomorrow at 12:00 AM PST (Google's daily quota reset time)."
        elif "503" in err_str or "UNAVAILABLE" in err_str:
            err_msg = "The selected model is experiencing temporary overload. Please switch to another model (such as 3.1 Flash-Lite) to load topics."
        else:
            err_msg = f"Failed to retrieve dynamic search topics due to a server error ({err_str}). Please try switching models."

        # Strictly no predefined fallbacks. Return the exact error response
        res = jsonify({'error': err_msg})
        res.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return res, 500


@app.route('/ping')
def ping() -> tuple[str, int]:
    """Health check endpoint for automated deployment pipelines."""
    return 'OK', 200


if __name__ == '__main__':
    app.run(debug=True)
