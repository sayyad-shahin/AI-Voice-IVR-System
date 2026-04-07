import requests
import uuid
import os

API_KEY="sk_777f15c4383559da769d79dd43377c2cb14bbfcc9c47cff0"

VOICE_ID="EXAVITQu4vr4xnSDxMaL"

def generate_voice(text):

    url=f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers={

    "xi-api-key":API_KEY,
    "Content-Type":"application/json"

    }

    payload={

    "text":text,
    "model_id":"eleven_multilingual_v2"

    }

    response=requests.post(url,json=payload,headers=headers)

    if response.status_code!=200:

        print(response.text)
        return ""

    os.makedirs("audio",exist_ok=True)

    filename=f"{uuid.uuid4().hex}.mp3"

    path=os.path.join("audio",filename)

    with open(path,"wb") as f:

        f.write(response.content)

    return filename