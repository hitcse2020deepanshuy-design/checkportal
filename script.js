const SECTIONAL_CUTOFF = { hindu: 8, ca: 8, desc: 12, weeklyH: 24, weeklyCA: 28 };
const OVERALL_CUTOFF = 112;

// 🔗 Your Google Sheets (converted to CSV endpoint)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWSnMdtYLF1mr4mYcxKzqAoANXhO-hSwWWHKuYWIx1VMaF-3tkiEQ1HAxYhB6C3LJZEYJTm6I5UZgm/pub?output=csv";

let USERS = {};
let LAST_LOADED_AT = null;

// 🧠 Robust CSV parser (handles commas & quotes)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"'; i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(cur); cur = "";
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (cur || row.length) {
        row.push(cur);
        rows.push(row.map(v => v.trim()));
        row = []; cur = "";
      }
    } else {
      cur += ch;
    }
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row.map(v => v.trim()));
  }
  return rows.filter(r => r.length);
}

// 📥 Fetch users from Google Sheets CSV (no cache)
async function fetchUsersFromSheet() {
  const url = SHEET_URL + "&t=" + Date.now(); // cache buster
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  const rows = parseCSV(text);
  const headers = rows.shift().map(h => h.trim());

  const users = {};
  rows.forEach(cols => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").replace(/^"|"$/g, "").trim();
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

  LAST_LOADED_AT = new Date();
  console.log("🔄 Users refreshed at", LAST_LOADED_AT.toLocaleTimeString(), users);
  return users;
}

// 🔁 Auto-load on page load + refresh every 10 seconds
async function loadUsers() {
  try {
    USERS = await fetchUsersFromSheet();
  } catch (err) {
    console.error("❌ Failed to load sheet:", err);
    const errBox = document.getElementById("error");
    if (errBox) errBox.textContent = "⚠️ Unable to load latest data. Retrying...";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadUsers();
  setInterval(loadUsers, 10000); // refresh every 10 seconds
});

// 🧮 Rank calculation
function calculateRanks() {
  return Object.entries(USERS)
    .map(([roll, u]) => ({
      roll,
      name: u.name,
      total: (u.hindu||0) + (u.ca||0) + (u.desc||0) + (u.weeklyH||0) + (u.weeklyCA||0)
    }))
    .sort((a, b) => b.total - a.total);
}

// 🔐 Login
function login() {
  const roll = document.getElementById("roll").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const err = document.getElementById("error");

  if (!USERS || Object.keys(USERS).length === 0) {
    err.textContent = "⏳ Loading latest data… please try again in a moment.";
    return;
  }

  if (!USERS[roll] || USERS[roll].password !== password || USERS[roll].dob !== dob) {
    err.textContent = "❌ Invalid credentials. Check Roll No, Password & DOB.";
    return;
  }

  const u = USERS[roll];
  const total = (u.hindu||0) + (u.ca||0) + (u.desc||0) + (u.weeklyH||0) + (u.weeklyCA||0);

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

  // 🏆 Top 3
  const top3 = calculateRanks().slice(0, 3);
  document.getElementById("top3").innerHTML = top3.map((t, i) => {
    const medal = ["🥇 Gold Performer", "🥈 Silver Performer", "🥉 Bronze Performer"][i];
    return `<li>${medal} – <b>${t.name}</b> (${t.total}/200)</li>`;
  }).join("");

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

// 🖨️ Download scorecard
function downloadScorecard() {
  window.print();
}

function logout() {
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  ["roll", "password", "dob"].forEach(id => document.getElementById(id).value = "");
}
