const FAVORITES_KEY = 'vesper-favorites';

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);

  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  return favorites.includes(id);
}
