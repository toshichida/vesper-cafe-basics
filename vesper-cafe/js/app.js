const CATEGORY_LABELS = {
  coffee: 'Coffee',
  food: 'Food',
};

function formatPrice(price) {
  return `¥${price.toLocaleString('ja-JP')}`;
}

function createMenuCard(item, favorites) {
  const card = document.createElement('article');
  card.className = 'menu-card reveal';
  card.dataset.id = String(item.id);

  const isFavorite = favorites.includes(item.id);
  const description = item.description
    ? `<p class="menu-card-desc">${item.description}</p>`
    : '';

  card.innerHTML = `
    <div class="menu-card-accent" aria-hidden="true"></div>
    <div class="menu-card-top">
      <div class="menu-card-meta">
        <span class="category-badge category-badge--${item.category}">
          ${CATEGORY_LABELS[item.category] || item.category}
        </span>
        <h3 class="menu-card-name">${item.name}</h3>
      </div>
      <button
        type="button"
        class="favorite-btn${isFavorite ? ' is-active' : ''}"
        aria-label="${isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}"
        aria-pressed="${isFavorite}"
      >${isFavorite ? '♥' : '♡'}</button>
    </div>
    ${description}
    <div class="menu-card-bottom">
      <p class="menu-card-price">${formatPrice(item.price)}</p>
      <span class="menu-card-tag">tax incl.</span>
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
  items.forEach((item, index) => {
    const card = createMenuCard(item, favorites);
    card.style.transitionDelay = `${index * 0.08}s`;
    grid.appendChild(card);
  });

  updateMenuCount(items.length);
  observeRevealElements();
}

function showError(message) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  grid.innerHTML = `<p class="menu-error">${message}</p>`;
  updateMenuCount(0);
}

function observeRevealElements() {
  const targets = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!targets.length || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

function initScrollReveal() {
  observeRevealElements();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

async function init() {
  initScrollReveal();

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
