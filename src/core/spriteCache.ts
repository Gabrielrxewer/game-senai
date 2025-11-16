const cache = new Map<string, HTMLImageElement>();

export function loadSprite(url: string): HTMLImageElement {
  const cached = cache.get(url);
  if (cached) {
    return cached;
  }

  const image = new Image();
  image.src = url;
  cache.set(url, image);
  return image;
}
