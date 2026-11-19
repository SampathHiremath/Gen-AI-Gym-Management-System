import os
import json
import requests
from django.conf import settings

def call_gemini(prompt, api_key=None, system_instruction=None, response_schema=None):
    """
    Calls Google Gemini REST API. Returns parsed JSON or text, or None if failed.
    """
    key = api_key or getattr(settings, 'GEMINI_API_KEY', '') or os.getenv('GEMINI_API_KEY', '')
    if not key:
        return None

    # Try gemini-1.5-flash or gemini-2.0-flash
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
    
    headers = {"Content-Type": "application/json"}
    
    contents = [
        {"role": "user", "parts": [{"text": prompt}]}
    ]

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048,
        }
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    if response_schema:
        payload["generationConfig"]["responseMimeType"] = "application/json"

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=12)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts:
                    text = parts[0].get('text', '')
                    if response_schema:
                        try:
                            # Strip markdown backticks if returned
                            cleaned = text.strip()
                            if cleaned.startswith("```json"):
                                cleaned = cleaned[7:]
                            if cleaned.startswith("```"):
                                cleaned = cleaned[3:]
                            if cleaned.endswith("```"):
                                cleaned = cleaned[:-3]
                            return json.loads(cleaned.strip())
                        except Exception:
                            pass
                    return text
    except Exception as e:
        print(f"[Gemini API Call Warning] {e}")
    
    return None
