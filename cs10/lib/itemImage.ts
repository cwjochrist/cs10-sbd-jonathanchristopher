type BasicItem = {
  id: number;
  name: string;
  image_url?: string | null;
  image?: string | null;
};

// Map backend item names to custom frontend PNG filenames when they differ.
const IMAGE_NAME_OVERRIDES: Record<string, string> = {
  laptop: "legion",
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveItemImage(item: BasicItem, localDataUrl?: string) {
  if (item.image_url) return item.image_url;
  if (item.image) return item.image;
  if (localDataUrl) return localDataUrl;

  const rawSlug = toSlug(item.name);
  const normalized = rawSlug.replace(/-/g, "");
  const fileBase = IMAGE_NAME_OVERRIDES[normalized] ?? IMAGE_NAME_OVERRIDES[rawSlug] ?? rawSlug;
  return `/items/${fileBase}.png`;
}
