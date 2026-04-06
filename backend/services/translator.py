from deep_translator import GoogleTranslator

def translate_text(text, target):

    try:

        if not text:
            return ""

        translated = GoogleTranslator(
            source="auto",
            target=target
        ).translate(text)

        return translated

    except Exception as e:

        print("Translation Error:", e)

        return text