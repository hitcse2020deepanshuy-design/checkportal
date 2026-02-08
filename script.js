// ✨ Use your ONE CSV link for both Students + Settings
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWSnMdtYLF1mr4mYcxKzqAoANXhO-hSwWWHKuYWIx1VMaF-3tkiEQ1HAxYhB6C3LJZEYJTm6I5UZgm/pub?output=csv";

let USERS = {};
let TOTALS = {};
let CUTOFFS = {};

function parseCSV(text) {
  const rows = [];
  let row = [], cur = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i+1];
    if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; }
    else if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) { row.push(cur); cur = ""; }
    else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (cur || row.length) {
        row.push(cur);
        rows.push(row.map(v=>v.trim()));
        row = []; cur = "";
      }
    } else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row.map(v=>v.trim())); }
  return rows.filter(r=>r.length);
}

async function loadData() {
  const res = await fetch(DATA_URL + "&t=" + Date.now(), { cache:"no-store" });
  const text = await res.text();
  const rows = parseCSV(text);

  const headers = rows.shift().map(h=>h.toLowerCase());
  const users = {};

  rows.forEach(r=>{
    const obj = {};
    headers.forEach((h,i)=> obj[h] = (r[i]||"").replace(/^"|"$/g,""));

    if (obj.roll) {
      users[obj.roll] = {
        password: obj.password,
        dob: obj.dob,
        name: obj.name,
        hindu: +obj.hindu || 0,
        ca: +obj.ca || 0,
        desc: +obj.desc || 0,
        weeklyH: +obj.weeklyh || 0,
        weeklyCA: +obj.weeklyca || 0
      };
    }

    if (obj.key && obj.value) {
      const k=obj.key.toLowerCase(), v=+obj.value;
      if (k.endsWith("_total")) TOTALS[k.replace("_total","")] = v;
      if (k.endsWith("_cutoff")) CUTOFFS[k.replace("_cutoff","")] = v;
      if (k==="overall_total") TOTALS.overall = v;
      if (k==="overall_cutoff") CUTOFFS.overall = v;
    }
  });

  USERS = users;

  document.getElementById("overallCutoff").textContent = `${CUTOFFS.overall} / ${TOTALS.overall}`;
}

window.addEventListener("DOMContentLoaded", async()=>{
  await loadData();
  setInterval(loadData,10000); // auto refresh
});

// ===== UI functions =====

function starWithTooltip(score, cutoff) {
  return score < cutoff ? `<span class="star" title="Sectional cut-off not cleared">*</span>${score}` : `${score}`;
}

function setBadge(id, passed) {
  const el = document.getElementById(id);
  el.textContent = passed ? "PASS" : "FAIL";
  el.className = "badge " + (passed ? "pass" : "fail");
}

function colorRow(id, passed) {
  const row = document.getElementById(id);
  row.classList.remove("pass-row","fail-row");
  row.classList.add(passed ? "pass-row" : "fail-row");
}

function calculateRanksWithQualification() {
  return Object.entries(USERS).map(([roll,u])=>{
    const total=u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA;
    const sPass = u.hindu>=CUTOFFS.hindu && u.ca>=CUTOFFS.ca && u.desc>=CUTOFFS.desc &&
                  u.weeklyH>=CUTOFFS.weeklyH && u.weeklyCA>=CUTOFFS.weeklyCA;
    const overallPass = total>=CUTOFFS.overall;
    return {roll,name:u.name,total,qualified:sPass && overallPass};
  }).sort((a,b)=>(b.qualified-a.qualified)||(b.total-a.total));
}

function updatePdfExtras() {
  document.getElementById("lastUpdated").textContent = new Date().toLocaleString();
  document.getElementById("qrCode").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(window.location.href);
}

function login(){
  const r=document.getElementById("roll").value.trim();
  const p=document.getElementById("password").value.trim();
  const d=document.getElementById("dob").value.trim();
  const err=document.getElementById("error");

  if (!USERS[r] || USERS[r].password!==p || USERS[r].dob!==d){
    err.textContent="❌ Invalid credentials.";
    return;
  }
  err.textContent="";

  const u=USERS[r];
  const total=u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA;

  const hinduPass=u.hindu>=CUTOFFS.hindu, caPass=u.ca>=CUTOFFS.ca, descPass=u.desc>=CUTOFFS.desc,
        wHPass=u.weeklyH>=CUTOFFS.weeklyH, wCAPass=u.weeklyCA>=CUTOFFS.weeklyCA;

  document.getElementById("hindu").innerHTML = `${starWithTooltip(u.hindu,CUTOFFS.hindu)}/${TOTALS.hindu}`;
  document.getElementById("ca").innerHTML = `${starWithTooltip(u.ca,CUTOFFS.ca)}/${TOTALS.ca}`;
  document.getElementById("desc").innerHTML = `${starWithTooltip(u.desc,CUTOFFS.desc)}/${TOTALS.desc}`;
  document.getElementById("weeklyH").innerHTML = `${starWithTooltip(u.weeklyH,CUTOFFS.weeklyH)}/${TOTALS.weeklyH}`;
  document.getElementById("weeklyCA").innerHTML = `${starWithTooltip(u.weeklyCA,CUTOFFS.weeklyCA)}/${TOTALS.weeklyCA}`;

  setBadge("hinduBadge",hinduPass);
  setBadge("caBadge",caPass);
  setBadge("descBadge",descPass);
  setBadge("weeklyHBadge",wHPass);
  setBadge("weeklyCABadge",wCAPass);

  colorRow("row-hindu",hinduPass);
  colorRow("row-ca",caPass);
  colorRow("row-desc",descPass);
  colorRow("row-weeklyH",wHPass);
  colorRow("row-weeklyCA",wCAPass);

  const finalPass = hinduPass && caPass && descPass && wHPass && wCAPass && total>=CUTOFFS.overall;

  document.getElementById("name").textContent=u.name;
  document.getElementById("rollShow").textContent=r;
  document.getElementById("total").textContent=total;

  const statusEl=document.getElementById("status");
  statusEl.textContent=finalPass?"Qualified":"Not Qualified";
  statusEl.className=finalPass?"pass":"fail";

  const ranks=calculateRanksWithQualification();
  document.getElementById("rank").textContent = "#" + (ranks.findIndex(x=>x.roll===r)+1);

  document.getElementById("top3").innerHTML = ranks.slice(0,3).map((t,i)=>
    `<li>${["🥇 Gold Performer","🥈 Silver Performer","🥉 Bronze Performer"][i]} – <b>${t.name}</b> (${t.total}/${TOTALS.overall})</li>`
  ).join("");

  updatePdfExtras();
  document.getElementById("loginCard").style.display="none";
  document.getElementById("resultCard").style.display="block";
}

function downloadScorecard(){ window.print(); }
function logout(){ document.getElementById("loginCard").style.display="block"; document.getElementById("resultCard").style.display="none"; }
