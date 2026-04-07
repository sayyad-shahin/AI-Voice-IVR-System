from flask import Flask,request,jsonify,send_file
from flask_cors import CORS
import os

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

@app.route("/login",methods=["POST"])
def login():

    data=request.json

    username=data.get("username")
    password=data.get("password")

    if username and password:

        return jsonify({
        "success":True,
        "name":username
        })

    return jsonify({"success":False})

@app.route("/voice",methods=["POST"])
def voice():

    data=request.json

    text=data.get("text","")
    option=str(data.get("option","1"))

    lang=LANGUAGES.get(option,"en")

    translated=translate_text(text,lang)

    improved=rephrase_text(translated)

    audio_file=generate_voice(improved)

    audio_url=""

    if audio_file:

        audio_url=f"http://127.0.0.1:5000/audio/{audio_file}"

    return jsonify({

    "translated":translated,
    "rephrased":improved,
    "audio":audio_url

    })

@app.route("/audio/<file>")
def audio(file):

    path=os.path.join("audio",file)

    return send_file(path,mimetype="audio/mpeg")

if __name__=="__main__":

    os.makedirs("audio",exist_ok=True)

    app.run(debug=True)