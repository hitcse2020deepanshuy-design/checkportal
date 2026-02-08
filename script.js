const TOTALS = { hindu:20, ca:20, desc:30, weeklyH:60, weeklyCA:70, overall:200 };
const CUTOFFS = { hindu:8, ca:8, desc:12, weeklyH:24, weeklyCA:28, overall:112 };

const USERS = {
  "9151701": { password:"91517001", dob:"05-07-2000", name:"Deepanshu Yadav", hindu:20, ca:20, desc:28, weeklyH:55, weeklyCA:62 },
  "8504002": { password:"85040002", dob:"25-11-2004", name:"Nikita Soni", hindu:18, ca:11, desc:18, weeklyH:42, weeklyCA:40 },
  "8756203": { password:"87562003", dob:"10-08-2002", name:"Jyoti Yadav", hindu:19, ca:18, desc:25, weeklyH:48, weeklyCA:52 },
  "6001104": { password:"60011004", dob:"29-11-1999", name:"Priyanka Dev", hindu:17, ca:16, desc:20, weeklyH:46, weeklyCA:45 },
  "6205705": { password:"62057005", dob:"25-12-2003", name:"Priyanka Verma", hindu:6, ca:8, desc:12, weeklyH:20, weeklyCA:22 },
  "8303906": { password:"83039006", dob:"27-07-2003", name:"Adweta Sen", hindu:0, ca:0, desc:0, weeklyH:0, weeklyCA:0 },
  "7878107": { password:"78781007", dob:"02-02-2002", name:"Shivani Jha", hindu:6, ca:10, desc:10, weeklyH:22, weeklyCA:25 },
  "8534808": { password:"85348008", dob:"06-06-2002", name:"Shweta Yadav", hindu:8, ca:13, desc:14, weeklyH:30, weeklyCA:35 }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("downloadBtn").addEventListener("click", downloadScorecard);
});

function starWithTooltip(score, cutoff){ return score < cutoff ? `<span class="star" title="Sectional cut-off not cleared">*</span>${score}` : `${score}`; }
function setBadge(id, passed){ const el=document.getElementById(id); el.textContent=passed?"PASS":"FAIL"; el.className="badge "+(passed?"pass":"fail"); }
function colorRow(id, passed){ const row=document.getElementById(id); row.classList.remove("pass-row","fail-row"); row.classList.add(passed?"pass-row":"fail-row"); }
function perfBar(id,val,total,cutoff){ const pct=Math.round((val/total)*100); const bar=document.getElementById(id); bar.style.width=pct+"%"; bar.className="bar-fill "+(val>=cutoff?"green":val>=cutoff*0.8?"orange":"red"); }

function calculateRanks(){
  return Object.entries(USERS).map(([roll,u])=>{
    const total=u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA;
    const qualified = u.hindu>=CUTOFFS.hindu && u.ca>=CUTOFFS.ca && u.desc>=CUTOFFS.desc &&
                      u.weeklyH>=CUTOFFS.weeklyH && u.weeklyCA>=CUTOFFS.weeklyCA && total>=CUTOFFS.overall;
    return {roll,name:u.name,total,qualified};
  }).sort((a,b)=>(b.qualified-a.qualified)||(b.total-a.total));
}

function showConfetti(){
  const c=document.getElementById("confetti"); c.style.display="block";
  const ctx=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const pieces=Array.from({length:120},()=>({x:Math.random()*c.width,y:Math.random()*-c.height,r:Math.random()*6+2,s:Math.random()*3+2}));
  let t=0; (function anim(){ ctx.clearRect(0,0,c.width,c.height);
    pieces.forEach(p=>{ ctx.fillStyle=["#22c55e","#3b82f6","#f59e0b","#ef4444"][Math.floor(Math.random()*4)];
      ctx.beginPath(); ctx.arc(p.x,p.y+=p.s,p.r,0,Math.PI*2); ctx.fill(); if(p.y>c.height)p.y=-10;});
    if(t++<160) requestAnimationFrame(anim); else c.style.display="none";
  })();
}

function updatePdfExtras(){
  document.getElementById("lastUpdated").textContent=new Date().toLocaleString();
  document.getElementById("qrCode").src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+encodeURIComponent(location.href);
}

function login(){
  const r=document.getElementById("roll").value.trim();
  const p=document.getElementById("password").value.trim();
  const d=document.getElementById("dob").value.trim();
  const err=document.getElementById("error");

  if(!USERS[r] || USERS[r].password!==p || USERS[r].dob!==d){
    err.textContent="❌ Invalid credentials."; return;
  }
  err.textContent="";

  const u=USERS[r];
  const total=u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA;

  const hinduPass=u.hindu>=CUTOFFS.hindu, caPass=u.ca>=CUTOFFS.ca, descPass=u.desc>=CUTOFFS.desc,
        wHPass=u.weeklyH>=CUTOFFS.weeklyH, wCAPass=u.weeklyCA>=CUTOFFS.weeklyCA;
  const finalPass=hinduPass&&caPass&&descPass&&wHPass&&wCAPass&&total>=CUTOFFS.overall;

  document.getElementById("hindu").innerHTML=`${starWithTooltip(u.hindu,CUTOFFS.hindu)}/${TOTALS.hindu}`;
  document.getElementById("ca").innerHTML=`${starWithTooltip(u.ca,CUTOFFS.ca)}/${TOTALS.ca}`;
  document.getElementById("desc").innerHTML=`${starWithTooltip(u.desc,CUTOFFS.desc)}/${TOTALS.desc}`;
  document.getElementById("weeklyH").innerHTML=`${starWithTooltip(u.weeklyH,CUTOFFS.weeklyH)}/${TOTALS.weeklyH}`;
  document.getElementById("weeklyCA").innerHTML=`${starWithTooltip(u.weeklyCA,CUTOFFS.weeklyCA)}/${TOTALS.weeklyCA}`;

  setBadge("hinduBadge",hinduPass); setBadge("caBadge",caPass); setBadge("descBadge",descPass);
  setBadge("weeklyHBadge",wHPass); setBadge("weeklyCABadge",wCAPass);
  colorRow("row-hindu",hinduPass); colorRow("row-ca",caPass); colorRow("row-desc",descPass);
  colorRow("row-weeklyH",wHPass); colorRow("row-weeklyCA",wCAPass);

  perfBar("bar-hindu",u.hindu,TOTALS.hindu,CUTOFFS.hindu);
  perfBar("bar-ca",u.ca,TOTALS.ca,CUTOFFS.ca);
  perfBar("bar-desc",u.desc,TOTALS.desc,CUTOFFS.desc);
  perfBar("bar-weeklyH",u.weeklyH,TOTALS.weeklyH,CUTOFFS.weeklyH);
  perfBar("bar-weeklyCA",u.weeklyCA,TOTALS.weeklyCA,CUTOFFS.weeklyCA);

  document.getElementById("bar-hindu-val").textContent=`${u.hindu}/${TOTALS.hindu}`;
  document.getElementById("bar-ca-val").textContent=`${u.ca}/${TOTALS.ca}`;
  document.getElementById("bar-desc-val").textContent=`${u.desc}/${TOTALS.desc}`;
  document.getElementById("bar-weeklyH-val").textContent=`${u.weeklyH}/${TOTALS.weeklyH}`;
  document.getElementById("bar-weeklyCA-val").textContent=`${u.weeklyCA}/${TOTALS.weeklyCA}`;

  document.getElementById("cmp-hindu").textContent=`${u.hindu} vs ${CUTOFFS.hindu} ${hinduPass?"✅":"❌"}`;
  document.getElementById("cmp-ca").textContent=`${u.ca} vs ${CUTOFFS.ca} ${caPass?"✅":"❌"}`;
  document.getElementById("cmp-desc").textContent=`${u.desc} vs ${CUTOFFS.desc} ${descPass?"✅":"❌"}`;
  document.getElementById("cmp-weeklyH").textContent=`${u.weeklyH} vs ${CUTOFFS.weeklyH} ${wHPass?"✅":"❌"}`;
  document.getElementById("cmp-weeklyCA").textContent=`${u.weeklyCA} vs ${CUTOFFS.weeklyCA} ${wCAPass?"✅":"❌"}`;
  document.getElementById("cmp-overall").textContent=`${total} vs ${CUTOFFS.overall} ${finalPass?"✅":"❌"}`;

  const attempted=TOTALS.overall, correct=total, wrong=attempted-correct, acc=Math.round((correct/attempted)*100);
  document.getElementById("attempted").textContent=attempted;
  document.getElementById("correct").textContent=correct;
  document.getElementById("wrong").textContent=wrong;
  document.getElementById("accuracy").textContent=acc+"%";

  document.getElementById("motivationBox").innerHTML = finalPass
    ? "🎉 <b>Great attempt!</b> You’ve cleared the cut-off. Keep pushing 🚀"
    : "💪 <b>Good effort!</b> Analyze weak areas and come back stronger 🔁";

  document.getElementById("name").textContent=u.name;
  document.getElementById("rollShow").textContent=r;
  document.getElementById("total").textContent=total;
  const statusEl=document.getElementById("status");
  statusEl.textContent=finalPass?"Qualified":"Not Qualified";
  statusEl.className=finalPass?"pass":"fail";

  const ranks=calculateRanks();
  document.getElementById("rank").textContent="#"+(ranks.findIndex(x=>x.roll===r)+1);
  document.getElementById("top3").innerHTML = ranks.slice(0,3).map((t,i)=>`<li>${["🥇 Gold Performer","🥈 Silver Performer","🥉 Bronze Performer"][i]} – <b>${t.name}</b> (${t.total}/${TOTALS.overall})</li>`).join("");

  updatePdfExtras();
  if(finalPass) showConfetti();

  document.getElementById("loginCard").style.display="none";
  document.getElementById("resultCard").style.display="block";
}

function downloadScorecard(){ window.print(); }
function logout(){
  document.getElementById("loginCard").style.display="block";
  document.getElementById("resultCard").style.display="none";
  document.getElementById("error").textContent="";
}
