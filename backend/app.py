from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os

from services.translator import translate_text
from services.rephrase import rephrase_text
from services.tts import generate_voice

app = Flask(__name__)
CORS(app)

# LANGUAGE OPTIONS
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

# LOGIN API
@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.json

        username = data.get("username")
        password = data.get("password")

        # Accept any username/password
        if username and password:

            return jsonify({
                "success": True,
                "name": username
            })

        return jsonify({"success": False})

    except Exception as e:

        print("Login Error:", e)

        return jsonify({"success": False})


# VOICE PROCESSING
@app.route("/voice", methods=["POST"])
def voice():

    try:

        data = request.json

        if not data:
            return jsonify({"error": "No input"}), 400

        text = data.get("text", "")
        option = str(data.get("option", "1"))

        if text.strip() == "":
            return jsonify({
                "translated": "",
                "rephrased": "",
                "audio": ""
            })

        lang = LANGUAGES.get(option, "en")

        print("User text:", text)
        print("Target language:", lang)

        # TRANSLATE
        translated = translate_text(text, lang)

        # REPHRASE
        improved = rephrase_text(translated)

        # GENERATE AUDIO
        audio_file = generate_voice(improved)

        audio_url = ""

        if audio_file:
            audio_url = f"http://127.0.0.1:5000/audio/{audio_file}"

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


# AUDIO ROUTE
@app.route("/audio/<file>")
def audio(file):

    try:

        path = os.path.join("audio", file)

        if not os.path.exists(path):
            return jsonify({"error": "Audio file not found"}), 404

        return send_file(path, mimetype="audio/mpeg")

    except Exception as e:

        print("Audio Error:", e)

        return jsonify({"error": "Audio failed"}), 500


# START SERVER
if __name__ == "__main__":

    os.makedirs("audio", exist_ok=True)

    app.run(debug=True)

