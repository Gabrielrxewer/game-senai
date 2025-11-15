// src/ui/dom.ts
export function createOverlay(id: string): HTMLDivElement {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = id;

  // classe base para estilizar via CSS
  overlay.classList.add("game-overlay");

  // fallback simples (CSS assume o controle depois)
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  return overlay;
}

export function removeOverlay(id: string): void {
  const overlay = document.getElementById(id);
  overlay?.remove();
}

export function createButton(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = label;
  button.classList.add("overlay-button");
  button.style.cursor = "pointer"; // fallback
  return button;
}

export function createTitle(text: string): HTMLHeadingElement {
  const title = document.createElement("h1");
  title.textContent = text;
  title.classList.add("overlay-title");
  title.style.margin = "0"; // fallback
  return title;
}
