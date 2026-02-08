const SECTIONAL_CUTOFF = { hindu: 8, ca: 8, desc: 12, weeklyH: 24, weeklyCA: 28 };
const OVERALL_CUTOFF = 112;

const USERS = {
  "9151701": { password: "91517001", dob:"05-07-2000", name:"Deepanshu Yadav", hindu:20, ca:20, desc:28, weeklyH:55, weeklyCA:62 },
  "8504002": { password: "85040002", dob:"25-11-2004", name:"Nikita Soni", hindu:18, ca:11, desc:18, weeklyH:42, weeklyCA:40 },
  "8756203": { password: "87562003", dob:"10-08-2002", name:"Jyoti Yadav", hindu:19, ca:18, desc:25, weeklyH:48, weeklyCA:52 },
  "6001104": { password: "60011004", dob:"29-11-1999", name:"Priyanka Dev", hindu:17, ca:16, desc:20, weeklyH:46, weeklyCA:45 },
  "6205705": { password: "62057005", dob:"25-12-2003", name:"Priyanka Verma", hindu:6, ca:8, desc:12, weeklyH:20, weeklyCA:22 },
  "8303906": { password: "83039006", dob:"27-07-2003", name:"Adweta Sen", hindu:0, ca:0, desc:0, weeklyH:0, weeklyCA:0 },
  "7878107": { password: "78781007", dob:"02-02-2002", name:"Shivani Jha", hindu:6, ca:10, desc:10, weeklyH:22, weeklyCA:25 },
  "8534808": { password: "85348008", dob:"06-06-2002", name:"Shweta Yadav", hindu:8, ca:13, desc:14, weeklyH:30, weeklyCA:35 }
};

function calculateRanks() {
  return Object.entries(USERS)
    .map(([roll,u]) => ({ roll, name:u.name, total:u.hindu+u.ca+u.desc+u.weeklyH+u.weeklyCA }))
    .sort((a,b)=>b.total-a.total);
}

function login() {
  const roll = document.getElementById("roll").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const err = document.getElementById("error");

  if (!USERS[roll] || USERS[roll].password!==password || USERS[roll].dob!==dob) {
    err.textContent = "❌ Invalid credentials. Please check details.";
    return;
  }

  const u = USERS[roll];
  const total = u.hindu + u.ca + u.desc + u.weeklyH + u.weeklyCA;

  const ranks = calculateRanks();
  const myRank = ranks.findIndex(r => r.roll === roll) + 1;

  document.getElementById("name").textContent = u.name;
  document.getElementById("rollShow").textContent = roll;
  document.getElementById("rank").textContent = "#" + myRank;

  document.getElementById("hindu").textContent = `${u.hindu}/20`;
  document.getElementById("ca").textContent = `${u.ca}/20`;
  document.getElementById("desc").textContent = `${u.desc}/30`;
  document.getElementById("weeklyH").textContent = `${u.weeklyH}/60`;
  document.getElementById("weeklyCA").textContent = `${u.weeklyCA}/70`;
  document.getElementById("total").textContent = total;

  const statusEl = document.getElementById("status");
  statusEl.textContent = total >= OVERALL_CUTOFF ? "Qualified" : "Not Qualified";
  statusEl.className = total >= OVERALL_CUTOFF ? "pass" : "fail";

  // Top 3
  const top3 = calculateRanks().slice(0,3);
  document.getElementById("top3").innerHTML = top3.map((t,i)=>{
    const medal = ["🥇 Gold Performer","🥈 Silver Performer","🥉 Bronze Performer"][i];
    return `<li>${medal} – <b>${t.name}</b> (${t.total}/200)</li>`;
  }).join("");

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function downloadScorecard() {
  window.print(); // print to PDF
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  ["roll","password","dob"].forEach(id => document.getElementById(id).value = "");
}
