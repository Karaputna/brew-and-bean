const DATA_URL = new URL('../data.json', import.meta.url);

export async function fetchMenu() {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити меню (код ${response.status})`);
  }

  const items = await response.json();

  if (!Array.isArray(items)) {
    throw new Error('Дані меню мають неправильний формат');
  }

  return items;
}