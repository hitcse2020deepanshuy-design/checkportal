const SECTIONAL_CUTOFF = { hindu: 8, ca: 8, desc: 12, weeklyH: 24, weeklyCA: 28 };
const OVERALL_CUTOFF = 112;

// 🔗 Your published Google Sheets CSV URL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWSnMdtYLF1mr4mYcxKzqAoANXhO-hSwWWHKuYWIx1VMaF-3tkiEQ1HAxYhB6C3LJZEYJTm6I5UZgm/pub?output=csv";

let USERS = {}; // Will be loaded from sheet

// 🚀 Fetch data from Google Sheets CSV
async function fetchUsersFromSheet() {
  const response = await fetch(SHEET_URL, { cache: "no-store" });
  const text = await response.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  const headers = rows.shift().map(h => h.trim());

  const users = {};
  rows.forEach(cols => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").trim();
    });

    if (!obj.roll) return;

    users[obj.roll] = {
      password: obj.password || "",
      dob: obj.dob || "",
      name: obj.name || "",
      hindu: +obj.hindu || 0,
      ca: +obj.ca || 0,
      desc: +obj.desc || 0,
      weeklyH: +obj.weeklyH || 0,
      weeklyCA: +obj.weeklyCA || 0
    };
  });

  return users;
}

// Load CSV data on page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    USERS = await fetchUsersFromSheet();
    console.log("✅ Loaded users from CSV:", USERS);
  } catch (err) {
    console.error("❌ Failed to load sheet:", err);
    document.getElementById("error").textContent = "⚠️ Could not load data. Try again later.";
  }
});

function calculateRanks() {
  return Object.entries(USERS)
    .map(([roll, u]) => ({
      roll,
      name: u.name,
      total: (u.hindu||0) + (u.ca||0) + (u.desc||0) + (u.weeklyH||0) + (u.weeklyCA||0)
    }))
    .sort((a,b)=>b.total - a.total);
}

function login() {
  const roll = document.getElementById("roll").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const err = document.getElementById("error");

  if (!USERS || Object.keys(USERS).length === 0) {
    err.textContent = "⏳ Data loading... try again in a moment.";
    return;
  }

  if (!USERS[roll] || USERS[roll].password !== password || USERS[roll].dob !== dob) {
    err.textContent = "❌ Invalid credentials. Please check Roll No, Password & DOB.";
    return;
  }

  const u = USERS[roll];
  const total = (u.hindu||0) + (u.ca||0) + (u.desc||0) + (u.weeklyH||0) + (u.weeklyCA||0);

  // Ranks
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

  // Qualified or Not
  const statusEl = document.getElementById("status");
  statusEl.textContent = total >= OVERALL_CUTOFF ? "Qualified" : "Not Qualified";
  statusEl.className = total >= OVERALL_CUTOFF ? "pass" : "fail";

  // Top 3 performers
  const top3List = calculateRanks().slice(0,3);
  document.getElementById("top3").innerHTML = top3List.map((t,i) => {
    const medal = ["🥇 Gold Performer","🥈 Silver Performer","🥉 Bronze Performer"][i];
    return `<li>${medal} – <b>${t.name}</b> (${t.total}/200)</li>`;
  }).join("");

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function downloadScorecard() {
  window.print();
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  ["roll","password","dob"].forEach(id => document.getElementById(id).value = "");
}
