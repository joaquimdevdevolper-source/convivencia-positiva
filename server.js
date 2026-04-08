const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const ARQUIVO_USUARIOS = path.join(__dirname, 'usuarios.json');
const LOGIN_ADMIN = "admin";
const SENHA_ADMIN = "123456";

// Função para garantir que o arquivo exista e seja JSON válido
function lerUsuarios() {
  try {
    if (!fs.existsSync(ARQUIVO_USUARIOS)) {
      fs.writeFileSync(ARQUIVO_USUARIOS, "[]");
      return [];
    }
    const data = fs.readFileSync(ARQUIVO_USUARIOS, 'utf-8');
    if(!data) return [];
    return JSON.parse(data);
  } catch(e) {
    console.error("Erro ao ler usuarios.json:", e);
    return [];
  }
}

// Função para salvar usuários
function salvarUsuarios(usuarios) {
  try {
    fs.writeFileSync(ARQUIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
  } catch(e) {
    console.error("Erro ao salvar usuarios.json:", e);
  }
}

// Gera matrícula automática
function gerarMatricula() {
  const usuarios = lerUsuarios();
  if (usuarios.length === 0) return "2026001";
  const ultima = usuarios[usuarios.length-1].matricula;
  return String(Number(ultima)+1).padStart(7,'0');
}

// Rotas de páginas
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')));
app.get('/inicio.html', (req,res) => res.sendFile(path.join(__dirname,'inicio.html')));
app.get('/cadastro.html', (req,res) => res.sendFile(path.join(__dirname,'cadastro.html')));
app.get('/userdata.html', (req,res) => res.sendFile(path.join(__dirname,'userdata.html')));

// Login
app.post('/login', (req,res) => {
  const { login, senha } = req.body;
  if(login === LOGIN_ADMIN && senha === SENHA_ADMIN){
    return res.send({ ok:true, redirect:'/userdata.html' });
  }

  const usuarios = lerUsuarios();
  const usuario = usuarios.find(u => u.login === login);
  if(!usuario) return res.send({ ok:false, erro:"Usuário não encontrado" });
  if(usuario.senha !== senha) return res.send({ ok:false, erro:"Senha incorreta" });

  res.send({ ok:true, redirect:'/inicio.html' });
});

// Cadastro
app.post('/cadastro', (req,res) => {
  const { nome, idade, turma, login, senha } = req.body;
  const usuarios = lerUsuarios();
  if (usuarios.find(u => u.login === login))
    return res.send({ ok:false, erro:"Login já existe" });

  const matricula = gerarMatricula();
  usuarios.push({ nome, idade, turma, login, senha, matricula });
  salvarUsuarios(usuarios);
  res.send({ ok:true, msg:`Cadastro realizado com sucesso! Sua matrícula é ${matricula}` });
});

// Admin - listar usuários
app.get('/usuarios', (req,res)=>{
  const { login, senha } = req.query;
  if(login !== LOGIN_ADMIN || senha !== SENHA_ADMIN){
    return res.status(403).send({ ok:false, erro:"Acesso negado" });
  }
  res.send({ ok:true, usuarios: lerUsuarios() });
});

// Admin - remover usuário
app.delete('/usuarios/:login', (req,res)=>{
  const { login: loginReq, senha } = req.query;
  const loginRemover = req.params.login;

  if(loginReq !== LOGIN_ADMIN || senha !== SENHA_ADMIN){
    return res.status(403).send({ ok:false, erro:"Acesso negado" });
  }

  let usuarios = lerUsuarios();
  const index = usuarios.findIndex(u => u.login === loginRemover);
  if(index === -1) return res.send({ ok:false, erro:"Usuário não encontrado" });

  usuarios.splice(index,1);
  salvarUsuarios(usuarios);
  res.send({ ok:true, msg:"Usuário removido com sucesso" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));