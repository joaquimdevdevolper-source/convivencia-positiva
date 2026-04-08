const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// LOGIN FIXO
const LOGIN_FIXO = "admin";
const SENHA_FIXA = "123456";

// Página inicial e login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));

// Rota de login
app.post("/login", (req, res) => {
  const { login, senha } = req.body;
  if (login === LOGIN_FIXO && senha === SENHA_FIXA) {
    res.send({ ok: true });
  } else {
    res.send({ ok: false, erro: "Login ou senha incorretos" });
  }
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));