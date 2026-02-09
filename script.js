// ===== CONFIG =====
const TOTALS = { hindu:20, ca:20, desc:30, weeklyH:60, weeklyCA:70, overall:200 };
const CUTOFFS = { hindu:8, ca:8, desc:12, weeklyH:24, weeklyCA:28, overall:112 };

// ===== USER DATA =====
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
  submitBtn.onclick = login;
  logoutBtn.onclick = logout;
  downloadBtn.onclick = () => window.print();
});

// ===== LOGIN =====
function login(){
  const r = roll.value.trim();
  const p = password.value.trim();
  const d = dob.value.trim();

  if(!USERS[r] || USERS[r].password !== p || USERS[r].dob !== d){
    error.textContent = "❌ Invalid credentials";
    return;
  }

  error.textContent = "";
  const u = USERS[r];

  const total = u.hindu + u.ca + u.desc + u.weeklyH + u.weeklyCA;

  name.textContent = u.name;
  rollShow.textContent = r;
  totalEl.textContent = total;

  totalEl = document.getElementById("total");

  const qualified = total >= CUTOFFS.overall;
  status.textContent = qualified ? "Qualified" : "Not Qualified";
  status.className = qualified ? "pass" : "fail";

  const ranks = Object.entries(USERS)
    .map(([roll,u]) => ({ roll, total: u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA }))
    .sort((a,b)=>b.total-a.total);

  rank.textContent = "#" + (ranks.findIndex(x=>x.roll===r)+1);

  top3.innerHTML = ranks.slice(0,3)
    .map((t,i)=>`<li>${["🥇","🥈","🥉"][i]} Roll ${t.roll} — ${t.total}</li>`)
    .join("");

  lastUpdated.textContent = new Date().toLocaleString();
  qrCode.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" + location.href;

  loginCard.style.display = "none";
  resultCard.style.display = "block";
}

// ===== LOGOUT =====
function logout(){
  loginCard.style.display = "block";
  resultCard.style.display = "none";
          }
