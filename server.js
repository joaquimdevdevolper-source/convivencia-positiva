const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos da raiz
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const upload = multer({ dest: "uploads/" });

// Cadastro
app.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;
  try {
    await pool.query("INSERT INTO usuarios(email, senha) VALUES($1,$2)", [email, senha]);
    res.send({ ok: true });
  } catch (err) {
    res.send({ ok: false, erro: err.message });
  }
});

// Upload de foto
app.post("/uploadFoto", upload.single("foto"), async (req, res) => {
  const { email } = req.body;
  const arquivo = req.file;
  const imgData = fs.readFileSync(arquivo.path).toString("base64");
  try {
    await pool.query("UPDATE usuarios SET foto=$1 WHERE email=$2", [imgData, email]);
    fs.unlinkSync(arquivo.path);
    res.send({ ok: true });
  } catch (err) {
    res.send({ ok: false, erro: err.message });
  }
});

// Listar usuários
app.get("/usuarios", async (req, res) => {
  const usuarios = await pool.query("SELECT email, foto FROM usuarios");
  res.send(usuarios.rows);
});

// Página inicial - login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "login.html")));

// Página de cadastro
app.get("/cadastro", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));