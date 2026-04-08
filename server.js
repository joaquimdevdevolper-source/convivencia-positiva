const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const LOGIN_FIXO = "admin";
const SENHA_FIXA = "123456";

// Primeiro abre o login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "login.html")));

// Rota de login
app.post("/login", (req, res) => {
  const { login, senha } = req.body;
  if (login === LOGIN_FIXO && senha === SENHA_FIXA) {
    // Redireciona para o index
    res.send({ ok: true, redirect: "/index.html" });
  } else {
    res.send({ ok: false, erro: "Login ou senha incorretos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));