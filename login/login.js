const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = loginForm.loginUser.value.trim();
  const pass = loginForm.loginPass.value;

  const users = JSON.parse(localStorage.getItem('ghibli_users') || '[]');
  const found = users.find(u => u.username === user && u.password === pass);

  if (found) {
    sessionStorage.setItem('ghibli_session', user);
    window.location.href = "Catalogo.html";
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos.";
  }
});