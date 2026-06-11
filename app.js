const STORAGE_KEY = "workdaytracker";

let state =
JSON.parse(localStorage.getItem(STORAGE_KEY))
||
{
start:null,
breakStart:null,
breakTotal:0,
dailyHours:7.5
};

const finishTime =
document.getElementById("finishTime");

const workedToday =
document.getElementById("workedToday");

function saveState(){
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);
}

function calculate(){

if(!state.start){
finishTime.textContent="--:--";
workedToday.textContent="Not started";
return;
}

let finish =
state.start +
(state.dailyHours*3600000) +
state.breakTotal;

if(state.breakStart){
finish += Date.now()-state.breakStart;
}

const finishDate = new Date(finish);

finishTime.textContent =
finishDate.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

let worked =
Date.now()-state.start-state.breakTotal;

if(state.breakStart){
worked -= Date.now()-state.breakStart;
}

const workedHours =
worked/3600000;

workedToday.textContent =
workedHours.toFixed(2) +
" hrs worked";

const progress =
Math.min(
(workedHours/state.dailyHours)*100,
100
);

document
.getElementById("progressFill")
.style.width =
progress+"%";

document
.getElementById("progressText")
.textContent =
progress.toFixed(0)+"%";
}

document
.getElementById("startBtn")
.onclick=()=>{
if(!state.start){
state.start=Date.now();
saveState();
}
};

document
.getElementById("breakBtn")
.onclick=()=>{
if(!state.breakStart){
state.breakStart=Date.now();
saveState();
}
};

document
.getElementById("resumeBtn")
.onclick=()=>{
if(state.breakStart){

state.breakTotal +=
Date.now()-state.breakStart;

state.breakStart=null;

saveState();
}
};

document
.getElementById("resetBtn")
.onclick=()=>{

const hours =
state.dailyHours;

state={
start:null,
breakStart:null,
breakTotal:0,
dailyHours:hours
};

saveState();
calculate();
};

document
.getElementById("settingsBtn")
.onclick=()=>{
document
.getElementById("settingsPanel")
.classList.toggle("hidden");
};

document
.getElementById("saveSettings")
.onclick=()=>{

state.dailyHours =
parseFloat(
document
.getElementById("dailyHours")
.value
);

saveState();
};

document
.getElementById("dailyHours")
.value =
state.dailyHours;

calculate();
setInterval(calculate,1000);

if("serviceWorker" in navigator){
navigator.serviceWorker.register(
"./service-worker.js"
);
}