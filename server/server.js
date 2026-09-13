import "dotenv/config";

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());


// ========================
// PUBLIC NEWS
// ========================

app.get("/api/news", (req, res) => {
  const news = db
    .prepare(
      "SELECT * FROM news ORDER BY id DESC"
    )
    .all();

  res.json(news);
});


app.get("/api/news/:id", (req, res) => {
  const news = db
    .prepare(
      "SELECT * FROM news WHERE id = ?"
    )
    .get(req.params.id);

  if (!news) {
    return res.status(404).json({
      message: "Xəbər tapılmadı",
    });
  }

  res.json(news);
});


// ========================
// LOGIN
// ========================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = db
    .prepare(
      "SELECT * FROM users WHERE email = ?"
    )
    .get(email);

  if (!user) {
    return res.status(401).json({
      message: "Email və ya şifrə yanlışdır",
    });
  }

  const correctPassword = bcrypt.compareSync(
    password,
    user.password
  );

  if (!correctPassword) {
    return res.status(401).json({
      message: "Email və ya şifrə yanlışdır",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  res.json({
    token,
  });
});


// ========================
// ADMIN AUTH
// ========================

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "Giriş tələb olunur",
    });
  }

  const token = header.split(" ")[1];

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin icazəsi yoxdur",
      });
    }

    req.user = user;

    next();

  } catch {
    return res.status(401).json({
      message: "Token yanlışdır",
    });
  }
}


// ========================
// ADMIN NEWS
// ========================

app.get(
  "/api/admin/news",
  requireAdmin,
  (req, res) => {

    const news = db
      .prepare(
        "SELECT * FROM news ORDER BY id DESC"
      )
      .all();

    res.json(news);
  }
);


app.post(
  "/api/admin/news",
  requireAdmin,
  (req, res) => {

    const {
      title,
      summary,
      content,
      image,
      category,
    } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({
        message: "Məlumatlar tam deyil",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO news
        (title, summary, content, image, category)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(
        title,
        summary,
        content,
        image || "",
        category || "Ümumi"
      );

    res.json({
      id: result.lastInsertRowid,
      message: "Xəbər əlavə edildi",
    });
  }
);


app.delete(
  "/api/admin/news/:id",
  requireAdmin,
  (req, res) => {

    db.prepare(
      "DELETE FROM news WHERE id = ?"
    ).run(req.params.id);

    res.json({
      message: "Xəbər silindi",
    });
  }
);


app.listen(3000, () => {
  console.log(
    "Backend http://localhost:3000 ünvanında işləyir"
  );
});