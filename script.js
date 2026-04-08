const cadastroForm = document.getElementById("cadastroForm");
if(cadastroForm){
  cadastroForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const formData = new FormData(cadastroForm);
    const res = await fetch("/cadastro", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email:formData.get("email"),senha:formData.get("senha")})
    });
    const data = await res.json();
    if(data.ok) alert("Cadastro feito!"); else alert("Erro: "+data.erro);
  });
}

const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const formData = new FormData(loginForm);
    alert("Login simulado: "+formData.get("email"));
  });
}