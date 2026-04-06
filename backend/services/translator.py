from deep_translator import GoogleTranslator
from langdetect import detect


def translate_text(text, target):

    try:

        # detect source language
        source_lang = detect(text)

        # translate text
        translated = GoogleTranslator(
            source=source_lang,
            target=target
        ).translate(text)

        return translated

    except Exception as e:

        print("Translation Error:", e)

        # fallback if translation fails
        return text

