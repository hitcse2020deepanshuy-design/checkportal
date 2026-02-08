// ✅ Admin Credentials (As you specified)
const ADMIN = {
  id: "admin",
  pass: "admin@123",
  dob: "05-07-2000"
};

// ✅ Demo USERS (Same structure as student portal)
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

function adminLogin() {
  const id = document.getElementById("adminId").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  const dob = document.getElementById("adminDob").value.trim();
  const err = document.getElementById("adminErr");

  if (id === ADMIN.id && pass === ADMIN.pass && dob === ADMIN.dob) {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    err.textContent = "";
  } else {
    err.textContent = "❌ Invalid Admin Roll No, Password, or DOB.";
  }
}

function saveMarks() {
  const roll = document.getElementById("a_roll").value.trim();
  const msg = document.getElementById("saveMsg");

  if (!USERS[roll]) {
    msg.textContent = "❌ Student roll number not found.";
    msg.className = "fail";
    return;
  }

  // Update student DOB (optional)
  const newDob = document.getElementById("a_dob").value.trim();
  if (newDob) USERS[roll].dob = newDob;

  // Update marks
  USERS[roll].hindu = +document.getElementById("a_hindu").value || 0;
  USERS[roll].ca = +document.getElementById("a_ca").value || 0;
  USERS[roll].desc = +document.getElementById("a_desc").value || 0;
  USERS[roll].weeklyH = +document.getElementById("a_weeklyH").value || 0;
  USERS[roll].weeklyCA = +document.getElementById("a_weeklyCA").value || 0;

  msg.textContent = "✅ Student DOB & marks updated successfully (demo only).";
  msg.className = "pass";
}

function adminLogout() {
  document.getElementById("adminLogin").style.display = "block";
  document.getElementById("dashboard").style.display = "none";

  // Clear admin fields
  ["adminId","adminPass","adminDob"].forEach(id => document.getElementById(id).value = "");
}
