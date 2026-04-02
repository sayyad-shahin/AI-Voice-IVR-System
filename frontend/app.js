let recognition

const status=document.getElementById("status")

/* IVR Voice Message */

function speakIVR(){

let message=

"Welcome to AI Voice Customer Support. "+
"Select 1 for English. "+
"Select 2 for Hindi. "+
"Select 3 for Marathi. "+
"Select 4 for Tamil. "+
"Select 5 for Telugu. "+
"Select 6 for Gujarati. "+
"Select 7 for Bengali. "+
"Select 8 for Kannada."

let speech=new SpeechSynthesisUtterance(message)

speech.rate=0.9
speech.pitch=1

speechSynthesis.speak(speech)

}

/* Run IVR on page load */

window.onload=function(){

speakIVR()

}


/* Speech Recognition */

if('webkitSpeechRecognition' in window){

recognition=new webkitSpeechRecognition()

recognition.continuous=false
recognition.lang="en-US"

recognition.onstart=function(){

status.innerText="● Listening..."
status.style.color="#22c55e"

}

recognition.onresult=function(e){

let text=e.results[0][0].transcript

document.getElementById("input").value=text

}

recognition.onend=function(){

status.innerText="● Processing..."
status.style.color="orange"

}

}


/* Start listening on input click */

document.getElementById("input").onclick=function(){

if(recognition) recognition.start()

}


/* Send to backend */

async function send(){

status.innerText="● Processing..."
status.style.color="orange"

let text=document.getElementById("input").value

if(!text){

status.innerText="● Speak something first"
status.style.color="red"

return
}

/* Language Selection */

let option=prompt(

"Select language:\n\n"+
"1 English\n"+
"2 Hindi\n"+
"3 Marathi\n"+
"4 Tamil\n"+
"5 Telugu\n"+
"6 Gujarati\n"+
"7 Bengali\n"+
"8 Kannada"

)

try{

let res=await fetch("http://127.0.0.1:5000/voice",{

method:"POST",
headers:{"Content-Type":"application/json"},

body:JSON.stringify({
text:text,
option:option
})

})

let data=await res.json()

if(data.error){

status.innerText="● Error generating output"
status.style.color="red"
return

}

/* Show response */

document.getElementById("response").innerText=data.rephrased

/* Play AI voice */

let audio=new Audio(data.audio)

audio.play()

status.innerText="● Output Ready"
status.style.color="#22c55e"

}
catch(err){

console.log(err)

status.innerText="● Server Error"
status.style.color="red"

}

}