const IMAGES_KEY = 'item_images_v1';

export function getImageMap(): Record<number, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(IMAGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setImageForId(id: number, dataUrl: string) {
  if (typeof window === 'undefined') return;
  const map = getImageMap();
  map[id] = dataUrl;
  localStorage.setItem(IMAGES_KEY, JSON.stringify(map));
}

export function removeImageForId(id: number) {
  if (typeof window === 'undefined') return;
  const map = getImageMap();
  delete map[id];
  localStorage.setItem(IMAGES_KEY, JSON.stringify(map));
}

export default { getImageMap, setImageForId, removeImageForId };
