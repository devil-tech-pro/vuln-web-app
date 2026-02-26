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
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"></script>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial;}

body{
  overflow:hidden;
  background:black;
  color:white;
}

/* ===== Background Layers ===== */
#bgCanvas{
  position:fixed;
  top:0;
  left:0;
  z-index:-3;
}

.nebula{
  position:fixed;
  width:120%;
  height:120%;
  top:-10%;
  left:-10%;
  background:
  radial-gradient(circle at 30% 40%, rgba(0,150,255,0.4), transparent 40%),
  radial-gradient(circle at 70% 60%, rgba(255,0,200,0.4), transparent 40%),
  radial-gradient(circle at 50% 80%, rgba(0,255,150,0.3), transparent 50%);
  filter:blur(80px);
  animation:nebulaMove 40s infinite alternate ease-in-out;
  z-index:-2;
}

@keyframes nebulaMove{
  from{transform:translateX(-5%) translateY(-5%) rotate(0deg);}
  to{transform:translateX(5%) translateY(5%) rotate(5deg);}
}

/* Navbar */
nav{
  background:rgba(0,0,0,0.6);
  padding:15px;
  text-align:center;
  backdrop-filter:blur(10px);
}

nav a{
  color:#00f5ff;
  margin:0 20px;
  text-decoration:none;
  font-weight:bold;
  transition:.3s;
}

nav a:hover{
  color:white;
  text-shadow:0 0 10px cyan;
}

/* Content */
.container{
  width:450px;
  margin:20px auto;
  padding:25px;
  border-radius:20px;
  background:rgba(0,0,0,0.75);
  backdrop-filter:blur(15px);
  box-shadow:0 0 50px rgba(0,255,255,.3);
  text-align:center;
}

#threeContainer{
  width:100%;
  height:420px;
}

input{
  width:100%;
  padding:10px;
  margin:10px 0;
  border:none;
  border-radius:10px;
}

button{
  width:100%;
  padding:10px;
  border:none;
  border-radius:10px;
  background:#00f5ff;
  color:black;
  font-weight:bold;
  cursor:pointer;
  transition:.3s;
}

button:hover{
  background:white;
  transform:scale(1.05);
}

h2{margin-bottom:15px;color:#00f5ff;}

</style>
</head>
<body>

<canvas id="bgCanvas"></canvas>
<div class="nebula"></div>

<nav>
<a href="/">Home</a>
<a href="/signup">Signup</a>
<a href="/login">Login</a>
<a href="/dashboard">Dashboard</a>
<a href="/logout">Logout</a>
</nav>

<div id="threeContainer"></div>

<div class="container">
${content}
</div>

<script>
// ===== STARFIELD =====
const bgCanvas=document.getElementById("bgCanvas");
const bgCtx=bgCanvas.getContext("2d");
bgCanvas.width=window.innerWidth;
bgCanvas.height=window.innerHeight;

let stars=[];
for(let i=0;i<900;i++){
stars.push({
x:Math.random()*bgCanvas.width,
y:Math.random()*bgCanvas.height,
r:Math.random()*2,
speed:Math.random()*0.5
});
}

function animateStars(){
bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
stars.forEach(s=>{
bgCtx.beginPath();
bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
bgCtx.fillStyle="white";
bgCtx.fill();
s.y+=s.speed;
if(s.y>bgCanvas.height)s.y=0;
});
requestAnimationFrame(animateStars);
}
animateStars();

// ===== THREE JS SOLAR SYSTEM =====
const container=document.getElementById("threeContainer");
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,container.clientWidth/container.clientHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({alpha:true});
renderer.setSize(container.clientWidth,container.clientHeight);
container.appendChild(renderer.domElement);

const controls=new THREE.OrbitControls(camera,renderer.domElement);
camera.position.z=60;

const light=new THREE.PointLight(0xffffff,2);
scene.add(light);

const sun=new THREE.Mesh(
new THREE.SphereGeometry(6,32,32),
new THREE.MeshBasicMaterial({color:0xffaa00})
);
scene.add(sun);

function createPlanet(size,color,distance,speed,ring=false){
const geo=new THREE.SphereGeometry(size,32,32);
const mat=new THREE.MeshStandardMaterial({color:color});
const planet=new THREE.Mesh(geo,mat);
const pivot=new THREE.Object3D();
scene.add(pivot);
pivot.add(planet);
planet.position.x=distance;

if(ring){
const ringGeo=new THREE.RingGeometry(size+1,size+3,32);
const ringMat=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
const ringMesh=new THREE.Mesh(ringGeo,ringMat);
ringMesh.rotation.x=Math.PI/2;
planet.add(ringMesh);
}
return{pivot,speed};
}

const mercury=createPlanet(1,0xb1b1b1,10,0.02);
const venus=createPlanet(1.5,0xffb703,14,0.015);
const earth=createPlanet(1.7,0x00b4d8,18,0.01);
const mars=createPlanet(1.3,0xff6d00,22,0.008);
const jupiter=createPlanet(3.5,0xf4a261,28,0.005);
const saturn=createPlanet(3,0xe9c46a,35,0.004,true);
const uranus=createPlanet(2.2,0x48cae4,42,0.003);
const neptune=createPlanet(2.2,0x4361ee,48,0.002);

function animate(){
requestAnimationFrame(animate);
mercury.pivot.rotation.y+=mercury.speed;
venus.pivot.rotation.y+=venus.speed;
earth.pivot.rotation.y+=earth.speed;
mars.pivot.rotation.y+=mars.speed;
jupiter.pivot.rotation.y+=jupiter.speed;
saturn.pivot.rotation.y+=saturn.speed;
uranus.pivot.rotation.y+=uranus.speed;
neptune.pivot.rotation.y+=neptune.speed;
renderer.render(scene,camera);
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
