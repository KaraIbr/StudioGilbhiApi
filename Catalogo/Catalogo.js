if (!sessionStorage.getItem('ghibli_session')) window.location.href = "../login/Login.html";

const API_FILMS = 'https://ghibliapi.vercel.app/films';
const API_PEOPLE = 'https://ghibliapi.vercel.app/people';
const catalogElem = document.getElementById('catalogo');
const searchInput = document.getElementById('search');
const tabFilms = document.getElementById('tab-films');
const tabCharacters = document.getElementById('tab-characters');
const logoutBtn = document.getElementById('logoutBtn');

let currentTab = 'films';
let dataFilms = [], dataPeople = [];
let user = sessionStorage.getItem('ghibli_session');
let users = JSON.parse(localStorage.getItem('ghibli_users') || '[]');
let me = users.find(u => u.username === user);

logoutBtn.onclick = () => {
  sessionStorage.removeItem('ghibli_session');
  window.location.href = "../login/Login.html";
};

document.addEventListener('DOMContentLoaded', () => {
  tabFilms.addEventListener('click', () => switchTab('films'));
  tabCharacters.addEventListener('click', () => switchTab('people'));
  searchInput.addEventListener('input', renderCatalog);

  fetchData();
});

function switchTab(tab) {
  if (tab === currentTab) return;
  currentTab = tab;
  tabFilms.classList.toggle('active', tab === 'films');
  tabCharacters.classList.toggle('active', tab === 'people');
  searchInput.value = '';
  renderCatalog();
}

function fetchData() {
  fetch(API_FILMS).then(res => res.json()).then(films => {
    dataFilms = films;
    if (currentTab === 'films') renderCatalog();
  });
  fetch(API_PEOPLE).then(res => res.json()).then(people => {
    dataPeople = people;
    if (currentTab === 'people') renderCatalog();
  });
}

function renderCatalog() {
  catalogElem.innerHTML = '';
  const q = searchInput.value.trim().toLowerCase();
  let data = currentTab === 'films' ? dataFilms : dataPeople;
  if (q) data = data.filter(item => (item.title || item.name || '').toLowerCase().includes(q));
  if (!data.length) { catalogElem.innerHTML = `<p style="color:#bbb;">Sin resultados.</p>`; return; }

  data.forEach(item => {
    const isFav = me.favorites[currentTab]?.includes(item.id);
    const card = document.createElement('div');
    card.className = 'card';    let imgUrl = (currentTab === 'films')
      ? item.movie_banner || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      : `https://static.wikia.nocookie.net/studio-ghibli/images/${item.name.replace(/ /g, '_')}.jpg` || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
    card.innerHTML = `
      <button class="fav${isFav ? ' active' : ''}" title="Favorito">&#9733;</button>
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
      toggleFavorite(currentTab, item.id, favBtn);
    });
    catalogElem.appendChild(card);
  });
}
function toggleFavorite(type, id, btnElem) {
  if (!me.favorites[type]) me.favorites[type] = [];
  const idx = me.favorites[type].indexOf(id);
  if (idx !== -1) {
    me.favorites[type].splice(idx, 1);
    btnElem.classList.remove('active');
  } else {
    me.favorites[type].push(id);
    btnElem.classList.add('active');
  }
  users = users.map(u => u.username === user ? me : u);
  localStorage.setItem('ghibli_users', JSON.stringify(users));
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