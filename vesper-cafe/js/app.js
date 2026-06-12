const CATEGORY_LABELS = {
  coffee: 'Coffee',
  food: 'Food',
};

function formatPrice(price) {
  return `¥${price.toLocaleString('ja-JP')}`;
}

function createMenuCard(item, favorites) {
  const card = document.createElement('article');
  card.className = 'menu-card';
  card.dataset.id = String(item.id);

  const isFavorite = favorites.includes(item.id);

  card.innerHTML = `
    <div class="menu-card-top">
      <h3 class="menu-card-name">${item.name}</h3>
      <span class="category-badge category-badge--${item.category}">
        ${CATEGORY_LABELS[item.category] || item.category}
      </span>
    </div>
    <div class="menu-card-bottom">
      <p class="menu-card-price">${formatPrice(item.price)}</p>
      <button
        type="button"
        class="favorite-btn${isFavorite ? ' is-active' : ''}"
        aria-label="${isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}"
        aria-pressed="${isFavorite}"
      >${isFavorite ? '♥' : '♡'}</button>
    </div>
  `;

  const favoriteBtn = card.querySelector('.favorite-btn');
  favoriteBtn.addEventListener('click', () => {
    const active = toggleFavorite(item.id);
    favoriteBtn.classList.toggle('is-active', active);
    favoriteBtn.textContent = active ? '♥' : '♡';
    favoriteBtn.setAttribute('aria-pressed', String(active));
    favoriteBtn.setAttribute(
      'aria-label',
      active ? 'お気に入りから外す' : 'お気に入りに追加'
    );
    updateMenuCount(document.querySelectorAll('.menu-card').length);
  });

  return card;
}

function updateMenuCount(total) {
  const countEl = document.getElementById('menu-count');
  if (!countEl) return;

  const favoriteCount = getFavorites().length;
  countEl.textContent = `${total} items · ♥ ${favoriteCount}`;
}

function renderMenu(items) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!items.length) {
    grid.innerHTML = '<p class="menu-empty">メニューはまだありません。</p>';
    updateMenuCount(0);
    return;
  }

  const favorites = getFavorites();
  items.forEach((item) => {
    grid.appendChild(createMenuCard(item, favorites));
  });

  updateMenuCount(items.length);
}

function showError(message) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = `<p class="menu-error">${message}</p>`;
  updateMenuCount(0);
}

async function init() {
  try {
    const response = await fetch('data/menu-mock.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderMenu(data.menu || []);
  } catch {
    showError('メニューの読み込みに失敗しました。ローカルサーバー経由で開いてください。');
  }
}

init();
