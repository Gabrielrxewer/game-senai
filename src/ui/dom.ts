export function createOverlay(id: string): HTMLDivElement {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = id;
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.background = "rgba(12, 21, 43, 0.65)";
  overlay.style.backdropFilter = "blur(4px)";
  overlay.style.gap = "16px";
  overlay.style.color = "#fff";
  overlay.style.textAlign = "center";
  overlay.style.padding = "24px";

  return overlay;
}

export function removeOverlay(id: string): void {
  const overlay = document.getElementById(id);
  overlay?.remove();
}

export function createButton(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = label;
  button.style.padding = "12px 24px";
  button.style.borderRadius = "9999px";
  button.style.border = "none";
  button.style.background = "#5bc0be";
  button.style.color = "#0b132b";
  button.style.fontSize = "1.1rem";
  button.style.cursor = "pointer";
  button.style.fontWeight = "bold";
  button.addEventListener("mouseover", () => {
    button.style.transform = "scale(1.04)";
  });
  button.addEventListener("mouseout", () => {
    button.style.transform = "scale(1)";
  });
  return button;
}

export function createTitle(text: string): HTMLHeadingElement {
  const title = document.createElement("h1");
  title.textContent = text;
  title.style.margin = "0";
  title.style.fontSize = "2.4rem";
  title.style.color = "#f8ffe5";
  return title;
}
