import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("news.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const admin = db
  .prepare("SELECT * FROM users WHERE email = ?")
  .get("admin@example.com");

if (!admin) {
  const password = bcrypt.hashSync("admin123", 10);

  db.prepare(`
    INSERT INTO users
    (email, password, role)
    VALUES (?, ?, ?)
  `).run(
    "admin@example.com",
    password,
    "admin"
  );
}

export default db;