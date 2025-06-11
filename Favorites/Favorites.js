if (!sessionStorage.getItem('ghibli_session')) window.location.href = "../login/Login.html";

const tabFilms = document.getElementById('tab-films');
const tabCharacters = document.getElementById('tab-characters');
const favoritesList = document.getElementById('favoritesList');
const logoutBtn = document.getElementById('logoutBtn');

let currentTab = 'films';
let user = sessionStorage.getItem('ghibli_session');
let users = JSON.parse(localStorage.getItem('ghibli_users') || '[]');
let me = users.find(u => u.username === user);

logoutBtn.onclick = () => {
  sessionStorage.removeItem('ghibli_session');
  window.location.href = "../login/Login.html";
};

tabFilms.onclick = () => switchTab('films');
tabCharacters.onclick = () => switchTab('people');

function switchTab(tab) {
  if (tab === currentTab) return;
  currentTab = tab;
  tabFilms.classList.toggle('active', tab === 'films');
  tabCharacters.classList.toggle('active', tab === 'people');
  renderFavs();
}
renderFavs();

function renderFavs() {
  favoritesList.innerHTML = '<p>Cargando...</p>';
  if (!me.favorites[currentTab] || !me.favorites[currentTab].length) {
    favoritesList.innerHTML = `<p style="color:#bbb;">No tienes favoritos en esta categoría.</p>`;
    return;
  }
  const ids = me.favorites[currentTab];
  const endpoint = currentTab === 'films'
    ? 'https://ghibliapi.vercel.app/films'
    : 'https://ghibliapi.vercel.app/people';
  fetch(endpoint).then(r=>r.json()).then(data => {
    favoritesList.innerHTML = '';
    data.filter(item => ids.includes(item.id)).forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      let imgUrl = (currentTab === 'films')
        ? ghibliPosterUrl(item.id) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
        : ghibliCharacterImg(item.name) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
      card.innerHTML = `
        <button class="fav active" title="Quitar favorito">&#9733;</button>
        <img src="${imgUrl}" alt="${item.title || item.name}">
        <div class="title">${item.title || item.name}</div>
        <div class="subtitle">
          ${currentTab === 'films'
            ? `<span>${item.release_date || ''}</span>`
            : `<span>${item.gender ? 'Género: ' + item.gender : ''}</span>`
          }
        </div>
        <div class="desc">
          ${currentTab === 'films'
            ? short(item.description, 100)
            : `<span style="color:#9b9bb4;">${item.age ? 'Edad: ' + item.age : ''}</span>`
          }
        </div>
      `;
      card.addEventListener('click', e => {
        if (e.target.classList.contains('fav')) return;
        window.location.href = `../detalles/Detalles.html?id=${item.id}&type=${currentTab}`;
      });
      const favBtn = card.querySelector('.fav');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFavorite(currentTab, item.id, card);
      });
      favoritesList.appendChild(card);
    });
  });
}
function removeFavorite(type, id, cardElem) {
  if (!me.favorites[type]) me.favorites[type] = [];
  const idx = me.favorites[type].indexOf(id);
  if (idx !== -1) {
    me.favorites[type].splice(idx, 1);
    users = users.map(u => u.username === user ? me : u);
    localStorage.setItem('ghibli_users', JSON.stringify(users));
    cardElem.remove();
    if (!me.favorites[type].length) renderFavs();
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
function short(text, len) {
  if (!text) return '';
  if (text.length <= len) return text;
  return text.slice(0, len) + '...';
}