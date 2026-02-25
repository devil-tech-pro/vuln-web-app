Vulnerable App (Node.js + Express + SQLite)

A simple Node.js web application built using Express and SQLite3 for learning and practicing web security concepts like:

SQL Injection

Authentication flaws

IDOR

CORS Misconfiguration

Input validation issues

⚠️ This project is intentionally vulnerable and should be used only for educational purposes.

🚀 Tech Stack

Node.js

Express.js

SQLite3

Body-parser

📂 Project Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/vuln-app.git
cd vuln-app
2️⃣ Install Dependencies
npm install
3️⃣ Start the Server
node app.js

Or if using nodemon:

npx nodemon app.js

Server will start at:

http://localhost:3000
📁 Project Structure
vuln-app/
│── node_modules/
│── package.json
│── package-lock.json
│── app.js
│── database.db
│── README.md
🧪 Learning Objectives

This application can be used to practice:

🔍 Finding SQL Injection vulnerabilities

🛡️ Understanding how authentication works

🔐 Testing insecure endpoints

🌍 Learning how CORS behaves

🧨 Exploring IDOR vulnerabilities

⚠️ Disclaimer

This project is intentionally vulnerable.

Do NOT deploy this on a public server.

Use only in local environments.

For educational and security research purposes only.

🛠️ Future Improvements

Add JWT authentication

Implement proper input validation

Add secure version branch

Add Docker support

Add login/register system

👨‍💻 Author

Sumit Kumar
Learning Backend Development & Cyber Security
