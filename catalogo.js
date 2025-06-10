const API_FILMS = 'https://ghibliapi.vercel.app/films';
const API_PEOPLE = 'https://ghibliapi.vercel.app/people';
const catalogElem = document.getElementById('catalogo');
const searchInput = document.getElementById('search');
const tabFilms = document.getElementById('tab-films');
const tabCharacters = document.getElementById('tab-characters');

let currentTab = 'films';
let dataFilms = [];
let dataPeople = [];
let favorites = getFavorites();

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
  // Films
  fetch(API_FILMS)
    .then(res => res.json())
    .then(films => {
      dataFilms = films;
      if (currentTab === 'films') renderCatalog();
    });
  // People
  fetch(API_PEOPLE)
    .then(res => res.json())
    .then(people => {
      dataPeople = people;
      if (currentTab === 'people') renderCatalog();
    });
}

function renderCatalog() {
  catalogElem.innerHTML = '';
  const q = searchInput.value.trim().toLowerCase();
  let data = currentTab === 'films' ? dataFilms : dataPeople;

  // Filtrar por búsqueda
  if (q) {
    data = data.filter(item =>
      (item.title || item.name || '').toLowerCase().includes(q)
    );
  }

  if (data.length === 0) {
    catalogElem.innerHTML = `<p style="color:#bbb;">Sin resultados.</p>`;
    return;
  }

  data.forEach(item => {
    const isFav = favorites[currentTab]?.includes(item.id);
    const card = document.createElement('div');
    card.className = 'card';

    // Imagen
    let imgUrl = '';
    if (currentTab === 'films') {
      imgUrl = ghibliPosterUrl(item.id) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
    } else {
      imgUrl = ghibliCharacterImg(item.name) || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
    }
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
    // Navega a detalles
    card.addEventListener('click', e => {
      if (e.target.classList.contains('fav')) return;
      // Abre detalles.html?id=XXX&type=films|people
      window.location.href = `Detalles.html?id=${item.id}&type=${currentTab}`;
    });
    // Favoritos
    const favBtn = card.querySelector('.fav');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(currentTab, item.id, favBtn);
    });
    catalogElem.appendChild(card);
  });
}

// Helpers
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('ghibli_favorites')) || { films: [], people: [] };
  } catch {
    return { films: [], people: [] };
  }
}
function saveFavorites() {
  localStorage.setItem('ghibli_favorites', JSON.stringify(favorites));
}
function toggleFavorite(type, id, btnElem) {
  if (!favorites[type]) favorites[type] = [];
  const idx = favorites[type].indexOf(id);
  if (idx !== -1) {
    favorites[type].splice(idx, 1);
    btnElem.classList.remove('active');
  } else {
    favorites[type].push(id);
    btnElem.classList.add('active');
  }
  saveFavorites();
}
// Devuelve un link genérico de poster por id de film 
function ghibliPosterUrl(id) {
  // Algunos posters públicos en: https://ghibliapi.vercel.app/images/
  const posters = {
    "2baf70d1-42bb-4437-b551-e5fed5a87abe": "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",
    "12cfb892-aac0-4c5b-94af-521852e46d6a": "https://image.tmdb.org/t/p/w500/8Cj6I4v3Lk6R5pTKKQvQkA6v1Sk.jpg",
    // agrega tus propios links si quieres
  };
  return posters[id];
}

function ghibliCharacterImg(name) {
  const imgs = {
    "Ashitaka": "https://static.wikia.nocookie.net/studio-ghibli/images/1/1e/Ashitaka.jpg",
    "San": "https://static.wikia.nocookie.net/studio-ghibli/images/1/1e/San.jpg",
    // etc
  };
  return imgs[name];
}
function short(text, len) {
  if (!text) return '';
  if (text.length <= len) return text;
  return text.slice(0, len) + '...';
}