from flask import Flask,request,jsonify,send_file
from flask_cors import CORS

from services.translator import translate_text
from services.rephrase import rephrase_text
from services.tts import generate_voice

app=Flask(__name__)
CORS(app)

LANGUAGES={
"1":"en",
"2":"hi",
"3":"mr",
"4":"ta",
"5":"te",
"6":"gu",
"7":"bn",
"8":"kn"
}

@app.route("/voice",methods=["POST"])
def voice():

    data=request.json

    text=data["text"]
    option=data["option"]

    lang=LANGUAGES.get(option,"en")

    translated=translate_text(text,lang)

    improved=rephrase_text(translated)

    audio_file=generate_voice(improved)

    if not audio_file:
        return jsonify({"error":"Audio generation failed"}),500

    return jsonify({
        "translated":translated,
        "rephrased":improved,
        "audio":f"http://127.0.0.1:5000/audio/{audio_file}"
    })

@app.route("/audio/<file>")
def audio(file):
    return send_file("audio/"+file)

if __name__=="__main__":
    app.run(debug=True)