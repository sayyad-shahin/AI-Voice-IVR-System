from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os

from services.translator import translate_text
from services.rephrase import rephrase_text
from services.tts import generate_voice

app = Flask(__name__)
CORS(app)

os.makedirs("audio", exist_ok=True)

LANGUAGES = {
    "1": "en",
    "2": "hi",
    "3": "mr",
    "4": "ta",
    "5": "te",
    "6": "gu",
    "7": "bn",
    "8": "kn"
}


@app.route("/login", methods=["POST"])
def login():

    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username and password:
        return jsonify({
            "success": True,
            "name": username
        })

    return jsonify({"success": False})


@app.route("/voice", methods=["POST"])
def voice():

    try:

        data = request.json

        text = data.get("text", "")
        option = str(data.get("option", "1"))

        lang = LANGUAGES.get(option, "en")

        print("User text:", text)
        print("Target language:", lang)

        translated = translate_text(text, lang)

        improved = rephrase_text(translated)

        audio_file = generate_voice(improved, lang)

        audio_url = ""

        if audio_file:
            audio_url = request.host_url + "audio/" + audio_file

        return jsonify({
            "translated": translated,
            "rephrased": improved,
            "audio": audio_url
        })

    except Exception as e:

        print("SERVER ERROR:", e)

        return jsonify({
            "translated": text,
            "rephrased": text,
            "audio": ""
        })


@app.route("/audio/<file>")
def audio(file):

    path = os.path.join("audio", file)

    return send_file(path, mimetype="audio/mpeg")


@app.route("/")
def home():
    return "AI Voice IVR System Running"


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)