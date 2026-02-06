// ✅ Total Marks = 30 (Vocab 10 + CA 20)
const CUTOFF = 18;  

const SECTIONAL_CUTOFF = {
  vocab: 5,   // out of 10
  ca: 7       // out of 20
};

const USERS = {
  "9151701": { password: "91517001", dob:"05-07-2000", name:"Deepanshu Yadav",
    vocab:{scored:10,total:10}, ca:{scored:20,total:20} },

  "8504002": { password: "85040002", dob:"25-11-2004", name:"Nikita Soni",
    vocab:{scored:9,total:10}, ca:{scored:11,total:20} },

  "8756203": { password: "87562003", dob:"10-08-2002", name:"Jyoti Yadav",
    vocab:{scored:10,total:10}, ca:{scored:18,total:20} },

  "6001104": { password: "60011004", dob:"29-11-1999", name:"Priyanka Dev",
    vocab:{scored:10,total:10}, ca:{scored:16,total:20} },

  "6205705": { password: "62057005", dob:"25-12-2003", name:"Priyanka Verma",
    vocab:{scored:6,total:10}, ca:{scored:8,total:20} },

  "8303906": { password: "83039006", dob:"27-07-2003", name:"Adweta Sen",
    vocab:{scored:null,total:10}, ca:{scored:null,total:20} },

  "7008899": { password: "70088999", dob:"12-04-2001", name:"Shivani Jha",
    vocab:{scored:6,total:10}, ca:{scored:10,total:20} },

  "7099911": { password: "70999111", dob:"03-09-2002", name:"Shweta Yadav",
    vocab:{scored:8,total:10}, ca:{scored:13,total:20} }
};

// ⏰ Result Unlock Time – 10:35 PM
const RESULT_UNLOCK_TIME = { hour: 22, minute: 35 };

function isResultUnlocked() {
  const now = new Date();
  const unlock = new Date();
  unlock.setHours(RESULT_UNLOCK_TIME.hour, RESULT_UNLOCK_TIME.minute, 0, 0);
  return now >= unlock;
}

function login() {
  const err = document.getElementById("error");
  const lockMsg = document.getElementById("lockMsg");

  if (!isResultUnlocked()) {
    lockMsg.textContent = "⏰ Results will be available after 10:35 PM.";
    err.textContent = "";
    return;
  } else {
    lockMsg.textContent = "";
  }

  const roll = document.getElementById("roll").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();

  if (!roll || !password || !dob) {
    err.textContent = "Please fill all fields.";
    return;
  }

  if (!USERS[roll] || USERS[roll].password !== password || USERS[roll].dob !== dob) {
    err.textContent = "Invalid credentials. Please check Roll No, Password or DOB.";
    return;
  }

  const u = USERS[roll];

  const vocabScore = u.vocab.scored ?? 0;
  const caScore = u.ca.scored ?? 0;
  const totalObtained = vocabScore + caScore;

  const vocabClear = u.vocab.scored !== null && vocabScore >= SECTIONAL_CUTOFF.vocab;
  const caClear = u.ca.scored !== null && caScore >= SECTIONAL_CUTOFF.ca;
  const overallClear = totalObtained >= CUTOFF;

  const finalStatus = vocabClear && caClear && overallClear;

  document.getElementById("name").textContent = u.name;
  document.getElementById("rollShow").textContent = roll;

  document.getElementById("vocab").textContent =
    u.vocab.scored === null ? "Not Attempted" : `${vocabScore}/${u.vocab.total}${vocabClear ? "" : " *"}`;

  document.getElementById("ca").textContent =
    u.ca.scored === null ? "Not Attempted" : `${caScore}/${u.ca.total}${caClear ? "" : " *"}`;

  document.getElementById("total").textContent = `${totalObtained} / 30`;
  document.getElementById("cutoff").textContent = CUTOFF;

  const statusEl = document.getElementById("status");
  statusEl.textContent = finalStatus ? "Qualified" : "Not Qualified";
  statusEl.className = finalStatus ? "pass" : "fail";

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  ["roll","password","dob"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("error").textContent = "";
  document.getElementById("lockMsg").textContent = "";
}
