const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "weaksecret",
  resave: false,
  saveUninitialized: true
}));

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
});

/* ---------- Common Layout ---------- */
function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; font-family:Arial; }

      body {
        overflow:hidden;
        background:black;
        color:white;
      }

      canvas {
        position:fixed;
        top:0;
        left:0;
        z-index:-1;
      }

      nav {
        background:rgba(0,0,0,0.6);
        padding:15px;
        text-align:center;
        backdrop-filter:blur(10px);
      }

      nav a {
        color:#00f5ff;
        margin:0 15px;
        text-decoration:none;
        font-weight:bold;
      }

      nav a:hover {
        color:white;
        text-shadow:0 0 10px cyan;
      }

      .container {
        width:420px;
        margin:40px auto;
        padding:25px;
        border-radius:15px;
        background:rgba(0,0,0,0.7);
        backdrop-filter:blur(10px);
        box-shadow:0 0 40px rgba(0,255,255,0.3);
        text-align:center;
      }

      /* 🌞 SOLAR SYSTEM */
      .solar-system {
        position:relative;
        width:300px;
        height:300px;
        margin:0 auto 20px auto;
      }

      .sun {
        position:absolute;
        top:50%;
        left:50%;
        width:40px;
        height:40px;
        background:yellow;
        border-radius:50%;
        transform:translate(-50%,-50%);
        box-shadow:0 0 30px orange;
      }

      .orbit {
        position:absolute;
        border:1px dashed rgba(255,255,255,0.2);
        border-radius:50%;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        animation: rotate linear infinite;
      }

      .planet {
        position:absolute;
        top:-6px;
        left:50%;
        transform:translateX(-50%);
        border-radius:50%;
      }

      @keyframes rotate {
        from { transform:translate(-50%,-50%) rotate(0deg); }
        to { transform:translate(-50%,-50%) rotate(360deg); }
      }

      h2 { margin-bottom:15px; color:#00f5ff; }

      input {
        width:100%;
        padding:10px;
        margin:10px 0;
        border:none;
        border-radius:8px;
      }

      button {
        width:100%;
        padding:10px;
        border:none;
        border-radius:8px;
        background:#00f5ff;
        color:black;
        font-weight:bold;
        cursor:pointer;
      }

      button:hover {
        background:white;
      }

    </style>
  </head>
  <body>

    <canvas id="universe"></canvas>

    <nav>
      <a href="/">Home</a>
      <a href="/signup">Signup</a>
      <a href="/login">Login</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/logout">Logout</a>
    </nav>

    <div class="container">

      <div class="solar-system">
        <div class="sun"></div>

        <div class="orbit" style="width:60px;height:60px;animation-duration:4s;">
  <div class="planet" style="width:8px;height:8px;background:#b1b1b1;"></div>
</div>

<div class="orbit" style="width:90px;height:90px;animation-duration:6s;">
  <div class="planet" style="width:10px;height:10px;background:#ffb703;"></div>
</div>

<div class="orbit" style="width:120px;height:120px;animation-duration:8s;">
  <div class="planet" style="width:12px;height:12px;background:#00b4d8;"></div>
</div>

<div class="orbit" style="width:150px;height:150px;animation-duration:10s;">
  <div class="planet" style="width:14px;height:14px;background:#ff6d00;"></div>
</div>

<div class="orbit" style="width:180px;height:180px;animation-duration:12s;">
  <div class="planet" style="width:16px;height:16px;background:#f72585;"></div>
</div>

<div class="orbit" style="width:210px;height:210px;animation-duration:15s;">
  <div class="planet" style="width:18px;height:18px;background:#7209b7;"></div>
</div>

<div class="orbit" style="width:240px;height:240px;animation-duration:18s;">
  <div class="planet" style="width:20px;height:20px;background:#4361ee;"></div>
</div>

<div class="orbit" style="width:270px;height:270px;animation-duration:22s;">
  <div class="planet" style="width:22px;height:22px;background:#90e0ef;"></div>
</div>
      </div>

      ${content}
    </div>


<script>
// 🌌 Universe Background Engine
const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for(let i=0;i<500;i++){
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*2,
    speed: Math.random()*0.3
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  stars.forEach(star=>{
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
    star.y += star.speed;
    if(star.y > canvas.height) star.y = 0;
  });

  requestAnimationFrame(animate);
}

animate();
</script>

  </body>
  </html>
  `;
}
/* ---------- Routes ---------- */

app.get("/", (req, res) => {
  res.send(layout("Home", `
    <h2>🔥 Vulnerable Web Lab</h2>
    <p>This is a purposely vulnerable practice application.</p>
  `));
});

/* ---------- Signup ---------- */
app.get("/signup", (req, res) => {
  res.send(layout("Signup", `
    <h2>Create Account</h2>
    <form method="POST" action="/signup">
      <input name="username" placeholder="Username">
      <input name="password" type="password" placeholder="Password">
      <button>Signup</button>
    </form>
  `));
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`);
  res.redirect("/login");
});

/* ---------- Login ---------- */
app.get("/login", (req, res) => {
  res.send(layout("Login", `
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username">
      <input name="password" type="password" placeholder="Password">
      <button>Login</button>
    </form>
  `));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.get(query, [], (err, row) => {
    if (row) {
      req.session.user = row.username;
      req.session.userId = row.id;
      res.redirect("/dashboard");
    } else {
      res.send(layout("Login Failed", `<h2>Login Failed ❌</h2>`));
    }
  });
});

/* ---------- Dashboard ---------- */
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.send(layout("Access Denied", `<h2>Access Denied</h2>`));
  }

  res.send(layout("Dashboard", `
    <h2>Welcome ${req.session.user} 😎</h2>
    <div class="card">
      <p><strong>Your User ID:</strong> ${req.session.userId}</p>
      <p><strong>Try IDOR:</strong> <a href="/user/${req.session.userId}">View Your Profile</a></p>
    </div>
  `));
});

/* ---------- IDOR Vulnerable Profile ---------- */
app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id = ${id}`, [], (err, row) => {
    if (!row) {
      return res.send(layout("User Not Found", `<h2>User not found</h2>`));
    }

    res.send(layout("User Profile", `
      <h2>User Profile</h2>
      <p><strong>ID:</strong> ${row.id}</p>
      <p><strong>Username:</strong> ${row.username}</p>
      <p><strong>Password:</strong> ${row.password}</p>
    `));
  });
});

/* ---------- View All Users (Data Exposure) ---------- */
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    res.send(layout("All Users", `
      <h2>All Users</h2>
      <pre>${JSON.stringify(rows, null, 2)}</pre>
    `));
  });
});

/* ---------- Logout ---------- */
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("🔥 Vulnerable Website running on http://localhost:3000");
});
