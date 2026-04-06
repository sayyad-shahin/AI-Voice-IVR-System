let recognition
let username=""
let currentSpeaker=""

const API_URL="https://ai-voice-ivr-system-5.onrender.com"

const chat=document.getElementById("chat")
const status=document.getElementById("status")
const modal=document.getElementById("langModal")


function showLogin(){

document.getElementById("welcomePage").style.display="none"
document.getElementById("loginPage").style.display="flex"

}


async function login(){

let user=document.getElementById("username").value
let pass=document.getElementById("password").value

if(!user || !pass){

alert("Enter username and password")
return

}

try{

let res=await fetch(API_URL+"/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:user,
password:pass
})

})

let data=await res.json()

if(data.success){

username=data.name

document.getElementById("loginPage").style.display="none"
document.getElementById("appUI").style.display="block"

status.innerText="● Logged in as "+username

}else{

alert("Invalid Login")

}

}catch(error){

console.error("Login error:",error)

alert("Backend connection failed")

}

}


function openLanguageMenu(){

modal.style.display="flex"

let speech=new SpeechSynthesisUtterance(

username+" please select "+
"1 for English "+
"2 for Hindi "+
"3 for Marathi "+
"4 for Tamil "+
"5 for Telugu "+
"6 for Gujarati "+
"7 for Bengali "+
"8 for Kannada"

)

speech.rate=0.9
speechSynthesis.speak(speech)

}


function chooseLang(num){

document.getElementById("language").value=num

modal.style.display="none"

status.innerText="● Language Selected"

}


if('webkitSpeechRecognition' in window){

recognition=new webkitSpeechRecognition()

recognition.continuous=false
recognition.lang="en-US"

recognition.onstart=function(){

status.innerText="● Listening..."

}

recognition.onresult=function(e){

let text=e.results[0][0].transcript

addMessage(currentSpeaker,text)

sendToServer(text)

}

recognition.onerror=function(){

status.innerText="● Ready"

}

recognition.onend=function(){

status.innerText="● Ready"

}

}


function startFriend1(){

currentSpeaker="friend1"

if(recognition){
recognition.start()
}

}

function startFriend2(){

currentSpeaker="friend2"

if(recognition){
recognition.start()
}

}


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

if(!text || text==="undefined"){
text="Translation unavailable"
}

div.innerText="Translated: "+text

chat.appendChild(div)

chat.scrollTop=chat.scrollHeight

}


async function sendToServer(text){

try{

status.innerText="● Processing..."

let option=document.getElementById("language").value

let res=await fetch(API_URL+"/voice",{

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

let translatedText = data.rephrased || data.translated || text

addTranslation(translatedText)


if(data.audio){

let audio=new Audio(data.audio)

audio.onended=function(){
status.innerText="● Ready"
}

audio.play()

}else{

status.innerText="● Ready"

}

}catch(err){

console.error("Server error:",err)

addTranslation("System error occurred")

status.innerText="● Ready"

}

}