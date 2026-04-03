let recognition

let currentSpeaker=""

const chat=document.getElementById("chat")
const status=document.getElementById("status")
const modal=document.getElementById("langModal")

/* AUTO IVR MENU */

window.onload=function(){

modal.style.display="flex"

let speech=new SpeechSynthesisUtterance(

"Select 1 for English. "+
"Select 2 for Hindi. "+
"Select 3 for Marathi. "+
"Select 4 for Tamil. "+
"Select 5 for Telugu. "+
"Select 6 for Gujarati. "+
"Select 7 for Bengali. "+
"Select 8 for Kannada."

)

speech.rate=0.9

speechSynthesis.speak(speech)

}

/* POPUP LANGUAGE SELECT */

function chooseLang(num){

document.getElementById("language").value=num

modal.style.display="none"

status.innerText="● Language Selected"

}

/* KEYBOARD NUMBER SELECT */

document.addEventListener("keydown",function(e){

let n=parseInt(e.key)

if(n>=1 && n<=8){

chooseLang(n)

}

})

/* SPEECH RECOGNITION */

if('webkitSpeechRecognition' in window){

recognition=new webkitSpeechRecognition()

recognition.continuous=false
recognition.lang="en-US"

recognition.onstart=function(){

status.innerText="● Listening..."

}

recognition.onresult=function(e){

let text=e.results[0][0].transcript

detectNumber(text)

addMessage(currentSpeaker,text)

sendToServer(text)

}

}

/* VOICE NUMBER DETECTION */

function detectNumber(text){

let match=text.match(/[1-8]/)

if(match){

chooseLang(match[0])

}

}

/* SPEAKER BUTTONS */

function startFriend1(){

currentSpeaker="friend1"

recognition.start()

}

function startFriend2(){

currentSpeaker="friend2"

recognition.start()

}

/* ADD MESSAGE */

function addMessage(type,text){

let div=document.createElement("div")
div.className="message "+type

let bubble=document.createElement("div")
bubble.className="bubble"
bubble.innerText=text

div.appendChild(bubble)

chat.appendChild(div)

chat.scrollTop=chat.scrollHeight

}

/* ADD TRANSLATION */

function addTranslation(text){

let div=document.createElement("div")

div.className="translation"

div.innerText="Translated: "+text

chat.appendChild(div)

chat.scrollTop=chat.scrollHeight

}

/* BACKEND REQUEST */

async function sendToServer(text){

status.innerText="● Processing..."

let option=document.getElementById("language").value

let res=await fetch("http://127.0.0.1:5000/voice",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
text:text,
option:option
})

})

let data=await res.json()

addTranslation(data.rephrased)

let audio=new Audio(data.audio)

audio.play()

status.innerText="● Ready"

}