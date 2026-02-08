const SECTIONAL_CUTOFF = {
  hindu: 8,
  ca: 8,
  desc: 12,
  weeklyH: 24,
  weeklyCA: 28
};

const OVERALL_CUTOFF = 112;

const USERS = {
  "9151701": { password: "91517001", dob:"05-07-2000", name:"Deepanshu Yadav",
    hindu:20, ca:20, desc:28, weeklyH:55, weeklyCA:62 },

  "8504002": { password: "85040002", dob:"25-11-2004", name:"Nikita Soni",
    hindu:18, ca:11, desc:18, weeklyH:42, weeklyCA:40 },

  "8756203": { password: "87562003", dob:"10-08-2002", name:"Jyoti Yadav",
    hindu:19, ca:18, desc:25, weeklyH:48, weeklyCA:52 },

  "6001104": { password: "60011004", dob:"29-11-1999", name:"Priyanka Dev",
    hindu:17, ca:16, desc:20, weeklyH:46, weeklyCA:45 }
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
    err.textContent = "Invalid credentials.";
    return;
  }

  const u = USERS[roll];
  const total = u.hindu + u.ca + u.desc + u.weeklyH + u.weeklyCA;

  const ranks = calculateRanks();
  const myRank = ranks.findIndex(r => r.roll === roll) + 1;

  document.getElementById("name").textContent = u.name;
  document.getElementById("rollShow").textContent = roll;
  document.getElementById("rank").textContent = "#" + myRank;

  document.getElementById("hindu").textContent = u.hindu + "/20";
  document.getElementById("ca").textContent = u.ca + "/20";
  document.getElementById("desc").textContent = u.desc + "/30";
  document.getElementById("weeklyH").textContent = u.weeklyH + "/60";
  document.getElementById("weeklyCA").textContent = u.weeklyCA + "/70";
  document.getElementById("total").textContent = total;

  document.getElementById("status").textContent =
    total >= OVERALL_CUTOFF ? "Qualified" : "Not Qualified";

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function downloadScorecard() {
  window.print(); // You can later convert to jsPDF for actual PDF
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
}
