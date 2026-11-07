// ===== รายการตั๋ว (เพิ่ม/แก้ได้ที่นี่) =====
const TICKETS = [
  { id: "sing",   emoji: "🎤", title: "ร้องเพลงให้แฟนฟัง", desc: "เลือกเพลงได้เลย เดี๋ยวร้องให้ฟังจนจบ",   tint: "#e0487a" },
  { id: "game",   emoji: "🎮", title: "เล่นเกมด้วยกัน",    desc: "เลือกเกมได้ตามใจ แพ้ชนะไม่สำคัญ",        tint: "#7c5cff" },
  { id: "cuddle", emoji: "🛏️", title: "นอนกอดกันเฉยๆ",     desc: "ไม่ต้องทำอะไรเลย แค่นอนกอดกัน",          tint: "#f08a5d" },
  { id: "hug",    emoji: "🫂", title: "กอดแฟนนานๆ",       desc: "กอดแน่นๆ จนกว่าจะบอกให้ปล่อย",           tint: "#3fb5a3" },
  { id: "treat",  emoji: "🍡", title: "เลี้ยงขนม 20 บาท",   desc: "เลือกขนมที่อยากกิน งบ 20 บาท",           tint: "#e6a23c" },
  { id: "trip",   emoji: "🗺️", title: "ไปเที่ยวตามใจ",      desc: "เลือกที่เที่ยวได้เลย ",         tint: "#4a90e2" }
];

// ===== เก็บสถานะว่าใช้ตั๋วไหนไปแล้ว (จำในเครื่องนี้) =====
const KEY = "love-tickets-v1";
let state = {};
try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
const fmt = ts => new Date(ts).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

const list = document.getElementById("list");

function render() {
  list.innerHTML = "";
  let used = 0;

  TICKETS.forEach((t, i) => {
    const usedAt = state[t.id];
    if (usedAt) used++;

    const el = document.createElement("article");
    el.className = "ticket" + (usedAt ? " used" : "");
    el.style.setProperty("--tint", t.tint);
    el.innerHTML = `
      <div class="main">
        <div class="emoji">${t.emoji}</div>
        <div>
          <div class="no">ตั๋วใบที่ ${i + 1}</div>
          <h2>${t.title}</h2>
          <p>${t.desc}</p>
        </div>
      </div>
      <div class="stamp">ใช้แล้ว</div>
      <div class="stub">
        <small>${usedAt ? "ใช้เมื่อ " + fmt(usedAt) : "ใช้ได้ไม่จำกัดเวลา"}</small>
        <button class="use" data-id="${t.id}">ใช้ตั๋ว</button>
        <button class="again" data-undo="${t.id}">ยกเลิก</button>
      </div>`;
    list.appendChild(el);
  });

  document.getElementById("n").textContent = used;
  document.getElementById("t").textContent = TICKETS.length;

  // จัดรอยเว้าให้ตรงกับเส้นปรุ
  requestAnimationFrame(() => {
    document.querySelectorAll(".ticket").forEach(el => {
      el.style.setProperty("--cut", el.querySelector(".main").offsetHeight + "px");
    });
  });
}

// ===== กดใช้ตั๋ว / ยกเลิก =====
const dlg = document.getElementById("dlg");
let pending = null;

list.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;

  if (b.dataset.id) {
    pending = TICKETS.find(t => t.id === b.dataset.id);
    document.getElementById("dE").textContent = pending.emoji;
    document.getElementById("dT").textContent = pending.title;
    dlg.showModal();
  } else if (b.dataset.undo) {
    delete state[b.dataset.undo];
    save();
    render();
  }
});

document.getElementById("dNo").onclick = () => dlg.close();
document.getElementById("dYes").onclick = () => {
  state[pending.id] = Date.now();
  save();
  dlg.close();
  render();
  hearts();
};

// ===== หัวใจลอยตอนใช้ตั๋ว =====
function hearts() {
  const set = ["💗", "💖", "💕", "🎉", "💘"];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = set[i % set.length];
    h.style.left = Math.random() * 95 + "vw";
    h.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 3200);
  }
}

window.addEventListener("resize", render);
render();
