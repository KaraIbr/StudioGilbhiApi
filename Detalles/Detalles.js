if (!sessionStorage.getItem('ghibli_session')) window.location.href = "../login/Login.html";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");
const main = document.getElementById("main");
const titleElem = document.getElementById("title");

let user = sessionStorage.getItem('ghibli_session');
let users = JSON.parse(localStorage.getItem('ghibli_users') || '[]');
let me = users.find(u => u.username === user);

if (!id || !type) main.innerHTML = "<p>No hay datos.</p>";
else {
  const ENDPOINT = type === "films"
    ? `https://ghibliapi.vercel.app/films/${id}`
    : `https://ghibliapi.vercel.app/people/${id}`;
  fetch(ENDPOINT).then(r => r.json()).then(data => showDetails(data));
}

function showDetails(obj) {
  let img = (type === "films")
    ? ghibliPosterUrl(obj.id) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
    : ghibliCharacterImg(obj.name) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  let isFav = me.favorites[type]?.includes(obj.id);

  titleElem.innerText = obj.title || obj.name || "Detalles";
  main.innerHTML = `
    <img src="${img}" alt="${obj.title || obj.name}">
    <h2>${obj.title || obj.name}</h2>
    <div class="data">${type === 'films'
      ? `Año: ${obj.release_date || '-'}<br>Director: ${obj.director || '-'}`
      : `Género: ${obj.gender || '-'}<br>Edad: ${obj.age || '-'}`
    }</div>
    <div class="desc">${type === 'films'
      ? obj.description || ''
      : `Color de ojos: ${obj.eye_color || '-'}<br>Color de cabello: ${obj.hair_color || '-'}`
    }</div>
    <button class="fav-btn${isFav ? ' active' : ''}" title="Favorito">&#9733;</button>
  `;
  document.querySelector('.fav-btn').onclick = function() {
    if (!me.favorites[type]) me.favorites[type] = [];
    const idx = me.favorites[type].indexOf(obj.id);
    if (idx !== -1) {
      me.favorites[type].splice(idx, 1); this.classList.remove('active');
    } else {
      me.favorites[type].push(obj.id); this.classList.add('active');
    }
    users = users.map(u => u.username === user ? me : u);
    localStorage.setItem('ghibli_users', JSON.stringify(users));
  }
}
function ghibliPosterUrl(id) {
  const posters = {
    "2baf70d1-42bb-4437-b551-e5fed5a87abe": "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",
    "12cfb892-aac0-4c5b-94af-521852e46d6a": "https://image.tmdb.org/t/p/w500/8Cj6I4v3Lk6R5pTKKQvQkA6v1Sk.jpg",
  };
  return posters[id];
}
function ghibliCharacterImg(name) {
  const imgs = {
    "Ashitaka": "https://static.wikia.nocookie.net/studio-ghibli/images/1/1e/Ashitaka.jpg",
    "San": "https://static.wikia.nocookie.net/studio-ghibli/images/1/1e/San.jpg",
  };
  return imgs[name];
}