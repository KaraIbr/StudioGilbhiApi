const regForm = document.getElementById('registerForm');
const regError = document.getElementById('registerError');

regForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = regForm.regUser.value.trim();
  const pass = regForm.regPass.value;
  const pass2 = regForm.regPass2.value;
  if (!user.match(/^[a-zA-Z0-9_]{3,16}$/)) {
    regError.textContent = "Usuario: 3-16 letras/números/guión bajo.";
    return;
  }
  if (pass !== pass2) {
    regError.textContent = "Las contraseñas no coinciden.";
    return;
  }
  let users = JSON.parse(localStorage.getItem('ghibli_users') || '[]');
  if (users.some(u => u.username === user)) {
    regError.textContent = "Ese usuario ya existe.";
    return;
  }
  users.push({ username: user, password: pass, favorites: {films:[],people:[]} });
  localStorage.setItem('ghibli_users', JSON.stringify(users));
  sessionStorage.setItem('ghibli_session', user);
  window.location.href = "../catalogo/Catalogo.html";
});