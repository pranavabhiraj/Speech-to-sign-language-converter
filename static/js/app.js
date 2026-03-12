let recognition=null;
let listening=false;
let queue=[];
let idx=0;

const transcriptEl=document.getElementById("transcript");
const wordList=document.getElementById("wordList");
const player=document.getElementById("player");

function setupRecognition(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){ alert("SpeechRecognition not supported. Use Chrome."); return null; }
  const rec=new SR();
  rec.lang="en-IN";
  rec.continuous=true;
  rec.interimResults=true;

  rec.onresult=(event)=>{
    let text="";
    for(let i=0;i<event.results.length;i++){
      text += event.results[i][0].transcript + " ";
    }
    transcriptEl.value=text.trim();
  };

  rec.onend=()=>{ if(listening){ try{rec.start();}catch(e){} } };
  return rec;
}

document.getElementById("startBtn").onclick=()=>{
  if(!recognition) recognition=setupRecognition();
  if(!recognition) return;
  listening=true;
  try{recognition.start();}catch(e){}
};

document.getElementById("stopBtn").onclick=()=>{
  listening=false;
  if(recognition){ try{recognition.stop();}catch(e){} }
};

document.getElementById("processBtn").onclick=async ()=>{
  const text=transcriptEl.value || "";
  const res=await fetch("/process",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
  const data=await res.json();

  queue=data.words || [];
  idx=0;
  wordList.innerHTML="";
  queue.forEach(w=>{ const li=document.createElement("li"); li.textContent=w; wordList.appendChild(li); });
  playNext();
};

function playNext(){
  if(idx>=queue.length) return;
  player.src=`/static/videos/${queue[idx]}.mp4`;
  player.play().catch(()=>{});
}

player.addEventListener("ended",()=>{ idx+=1; playNext(); });
