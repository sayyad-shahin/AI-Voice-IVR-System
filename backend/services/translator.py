from deep_translator import GoogleTranslator
from langdetect import detect

def translate_text(text,target):

    try:
        source=detect(text)

        translated=GoogleTranslator(
            source=source,
            target=target
        ).translate(text)

        return translated

    except:
        return text