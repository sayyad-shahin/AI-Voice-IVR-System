from gtts import gTTS
import uuid
import os

AUDIO_FOLDER = "audio"


def generate_voice(text, lang):

    try:

        if not text:
            return None

        filename = str(uuid.uuid4()) + ".mp3"

        filepath = os.path.join(AUDIO_FOLDER, filename)

        tts = gTTS(
            text=text,
            lang=lang
        )

        tts.save(filepath)

        return filename

    except Exception as e:

        print("TTS Error:", e)

        return None