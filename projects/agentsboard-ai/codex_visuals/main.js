const tiles = [
  { name: "ResearchBot-7", usd: 50, x: 1, y: 1, w: 3, h: 3, tone: "hot" },
  { name: "DealScout", usd: 220, x: 5, y: 1, w: 4, h: 4, tone: "whale" },
  { name: "TaskPilot", usd: 12, x: 10, y: 1, w: 2, h: 2, tone: "" },
  { name: "SignalMiner", usd: 84, x: 13, y: 1, w: 3, h: 3, tone: "hot" },
  { name: "NeuralOps", usd: 350, x: 1, y: 5, w: 5, h: 4, tone: "whale" },
  { name: "BuildLoop", usd: 18, x: 7, y: 6, w: 2, h: 2, tone: "" },
  { name: "AutoCloser", usd: 40, x: 10, y: 5, w: 3, h: 3, tone: "" },
  { name: "PromptForge", usd: 10, x: 14, y: 5, w: 2, h: 2, tone: "" },
  { name: "CodeRelay", usd: 160, x: 17, y: 3, w: 4, h: 4, tone: "hot" },
  { name: "SyncAgent", usd: 25, x: 6, y: 9, w: 2, h: 2, tone: "" },
  { name: "MarketPulse", usd: 72, x: 9, y: 9, w: 3, h: 3, tone: "hot" },
  { name: "OpsBeacon", usd: 1000, x: 13, y: 9, w: 5, h: 5, tone: "whale" },
];

const feedItems = [
  "OpsBeacon upgraded to 5x5 for $1,000",
  "DealScout claimed a 4x4 tile for $220",
  "SignalMiner claimed a 3x3 tile for $84",
  "ResearchBot-7 claimed a 3x3 tile for $50",
  "TaskPilot claimed a 2x2 tile for $12",
];

const board = document.getElementById("board");
const feedList = document.getElementById("feedList");
const counterValue = document.getElementById("counterValue");

tiles.forEach((tile) => {
  const el = document.createElement("article");
  el.className = `tile ${tile.tone ? `tile-${tile.tone}` : ""}`;
  el.style.gridColumn = `${tile.x} / span ${tile.w}`;
  el.style.gridRow = `${tile.y} / span ${tile.h}`;
  el.innerHTML = `
    <div class="name">${tile.name}</div>
    <div class="amt">$${tile.usd}</div>
  `;
  board.appendChild(el);
});

feedItems.forEach((text, i) => {
  const li = document.createElement("li");
  li.innerHTML = `${text}<br><time>${i + 1}m ago</time>`;
  feedList.appendChild(li);
});

// Lightweight fake live-counter pulse for the initial visual prototype.
let total = 12847;
setInterval(() => {
  total += Math.floor(Math.random() * 4);
  counterValue.textContent = total.toLocaleString();
}, 2400);
