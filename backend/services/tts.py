import requests
import uuid
import os

API_KEY = "sk_45c58063e5e0f9329e4b84043e4376da9ffe0b7b10fe204e"

VOICE_ID = "EXAVITQu4vr4xnSDxMaL"


def generate_voice(text):

    try:

        if not text:
            return ""

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

        headers = {
            "xi-api-key": API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2"
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            print("TTS Error:", response.text)
            return ""

        os.makedirs("audio", exist_ok=True)

        filename = f"{uuid.uuid4().hex}.mp3"
        path = os.path.join("audio", filename)

        with open(path, "wb") as f:
            f.write(response.content)

        return filename

    except Exception as e:

        print("TTS ERROR:", e)

        return ""