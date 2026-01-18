// 🌸 Welcome message
window.addEventListener("load", () => {
    alert("Hi, Destiny! 🌸 Welcome to your Little Habit Garden!");
});

const input = habitInput, list = habitList;
const bar = progressBar, txt = progressText;
const streakEl = streak, mascot = document.getElementById("mascot");
const rewardEl = document.getElementById("reward");
const sound = document.getElementById("ding");
const calendar = document.getElementById("calendar");

let data = JSON.parse(localStorage.getItem("garden")) || {
  habits:[],
  streak:0,
  last:"",
  week:[0,0,0,0,0,0,0],
  goodDays:{}   // calendar storage
};

checkDay();
render();
renderCalendar();

addBtn.onclick = () => {
  if(!input.value.trim()) return;
  data.habits.push({t:input.value, c:category.value, d:false});
  input.value=""; save(); render();
};

function toggle(i){
  data.habits[i].d=!data.habits[i].d;
  if(data.habits[i].d){ celebrate(); sound.play(); }
  save(); render();
}

function del(i){
  data.habits.splice(i,1);
  save(); render();
}

function render(){
  list.innerHTML="";
  data.habits.forEach((h,i)=>{
    list.innerHTML+=`
      <li class="${h.d?"done":""}">
        <span>📌 ${h.t} (${h.c})</span>
        <span>
          <button onclick="toggle(${i})">✔</button>
          <button onclick="del(${i})">🗑</button>
        </span>
      </li>`;
  });
  progress();
  updateReward();
  streakEl.innerText=`🔥 Streak: ${data.streak}`;
}

function progress(){
  let done=data.habits.filter(h=>h.d).length;
  let p=data.habits.length?Math.round(done/data.habits.length*100):0;
  bar.style.width=p+"%";
  txt.innerText=p+"% completed";
}

function updateReward(){
  let r="None yet";
  if(data.streak>=30) r="👑 Habit Master";
  else if(data.streak>=14) r="🥇 Gold Star";
  else if(data.streak>=7) r="🥈 Silver Star";
  else if(data.streak>=3) r="🥉 Bronze Star";
  rewardEl.innerText="🎁 Reward: "+r;
}

function checkDay(){
  let today=new Date().toDateString();

  if(data.last!==today){
    if(data.habits.length && data.habits.every(h=>h.d)){
      data.streak++;
      data.goodDays[today]=true;
    } else if(data.last){
      data.streak=0;
    }
    data.habits.forEach(h=>h.d=false);
    data.last=today;
    save();
  }
}

function save(){
  localStorage.setItem("garden",JSON.stringify(data));
  renderCalendar();
}

function celebrate(){
  mascot.textContent="😸";
  setTimeout(()=>mascot.textContent="🐱",400);
}

/* 🌸 Monthly Calendar */
function renderCalendar(){
  calendar.innerHTML="";
  const now=new Date();
  const year=now.getFullYear(), month=now.getMonth();
  const days=new Date(year,month+1,0).getDate();

  for(let d=1; d<=days; d++){
    const date=new Date(year,month,d).toDateString();
    const div=document.createElement("div");
    div.className="day";
    if(data.goodDays[date]) div.classList.add("good");
    div.innerText=d;
    calendar.appendChild(div);
  }
}

/* 💾 Backup & Restore */
backupBtn.onclick=()=>{
  const blob=new Blob([JSON.stringify(data)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="habit-garden-backup.json";
  a.click();
};

restoreBtn.onclick=()=>restoreInput.click();

restoreInput.onchange=e=>{
  const file=e.target.files[0];
  if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    data=JSON.parse(r.result);
    save(); render();
  };
  r.readAsText(file);
};
