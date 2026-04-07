let recognition
let currentSpeaker=""
let currentAudio=null

const chat=document.getElementById("chat")
const status=document.getElementById("status")
const modal=document.getElementById("langModal")

let username=""

/* PAGE NAVIGATION */

document.getElementById("startBtn").onclick=function(){

document.getElementById("welcomePage").style.display="none"
document.getElementById("loginPage").style.display="flex"

}

/* LOGIN */

document.getElementById("loginBtn").onclick=async function(){

username=document.getElementById("username").value
let password=document.getElementById("password").value

let res=await fetch("http://127.0.0.1:5000/login",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})

})

let data=await res.json()

if(data.success){

localStorage.setItem("username",username)

document.getElementById("loginPage").style.display="none"
document.getElementById("appPage").style.display="block"

}else{

alert("Login failed")

}

}

/* LANGUAGE POPUP */

document.getElementById("voiceBox").onclick=function(){

modal.style.display="flex"

let speech=new SpeechSynthesisUtterance(

username+" select 1 for English. "+
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

function chooseLang(num){

document.getElementById("language").value=num
modal.style.display="none"
status.innerText="● Language Selected"

}

/* SPEECH */

if("webkitSpeechRecognition" in window){

recognition=new webkitSpeechRecognition()
recognition.continuous=false
recognition.lang="en-US"

recognition.onstart=function(){
status.innerText="● Listening..."
}

recognition.onresult=function(event){

let text=event.results[0][0].transcript

addMessage(currentSpeaker,text)

sendToServer(text)

}

recognition.onend=function(){
status.innerText="● Ready"
}

}

/* BUTTONS */

document.getElementById("friend1").onclick=function(){

currentSpeaker="friend1"
recognition.start()

}

document.getElementById("friend2").onclick=function(){

currentSpeaker="friend2"
recognition.start()

}

/* CHAT */

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

function addTranslation(text){

let div=document.createElement("div")
div.className="translation"
div.innerText="Translated: "+text

chat.appendChild(div)

}

/* SERVER */

async function sendToServer(text){

status.innerText="● Processing..."

let option=document.getElementById("language").value

let res=await fetch("http://127.0.0.1:5000/voice",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({text,option})

})

let data=await res.json()

let translated=data.rephrased || data.translated || text

addTranslation(translated)

if(currentAudio){

currentAudio.pause()
currentAudio.currentTime=0

}

if(data.audio){

currentAudio=new Audio(data.audio)
currentAudio.play().catch(()=>{})

}

status.innerText="● Ready"

}