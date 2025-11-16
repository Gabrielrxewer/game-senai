export interface CharacterHitbox {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export interface CharacterSkin {
  id: string;
  name: string;
  title: string;
  description: string;
  spriteUrl: string;
  renderWidth: number;
  renderHeight: number;
  hitbox: CharacterHitbox;
  accentColor: string;
}

export interface SpriteDescriptor {
  spriteUrl: string;
  width: number;
  height: number;
}

const buildSprite = (primary: string, secondary: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="112" viewBox="0 0 96 112">` +
    `<rect width="96" height="112" rx="12" fill="none"/>` +
    `<circle cx="48" cy="26" r="18" fill="${secondary}"/>` +
    `<rect x="30" y="46" width="36" height="46" rx="10" fill="${primary}"/>` +
    `<rect x="26" y="90" width="44" height="14" rx="6" fill="${secondary}"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const buildDiploma = (): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<rect x="8" y="20" width="80" height="56" rx="12" fill="#f8efe4" stroke="#c7994b" stroke-width="4"/>` +
    `<circle cx="68" cy="48" r="14" fill="#ffd166" stroke="#f3722c" stroke-width="4"/>` +
    `<path d="M68 62 L62 82 L68 76 L74 82 Z" fill="#f3722c"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const CHARACTERS: CharacterSkin[] = [
  {
    id: "fernanda",
    name: "Fernanda",
    title: "Arquiteta do Caos",
    description: "Transforma pilhas de trabalhos em arte abstrata.",
    spriteUrl: buildSprite("#ffb4c2", "#ffdfe8"),
    renderWidth: 72,
    renderHeight: 86,
    hitbox: { width: 36, height: 64, offsetX: 18, offsetY: 12 },
    accentColor: "#ffb4c2",
  },
  {
    id: "gabriel",
    name: "Gabriel",
    title: "Dev das Madrugadas",
    description: "Compila esperança e debuga sonhos.",
    spriteUrl: buildSprite("#4ac0ff", "#c3e9ff"),
    renderWidth: 74,
    renderHeight: 88,
    hitbox: { width: 36, height: 66, offsetX: 18, offsetY: 12 },
    accentColor: "#4ac0ff",
  },
  {
    id: "adriel",
    name: "Adriel",
    title: "Bardo dos Bits",
    description: "Canta commits épicos no corredor.",
    spriteUrl: buildSprite("#7b8bff", "#d6dbff"),
    renderWidth: 70,
    renderHeight: 82,
    hitbox: { width: 34, height: 62, offsetX: 17, offsetY: 12 },
    accentColor: "#7b8bff",
  },
  {
    id: "rafael",
    name: "Rafael",
    title: "Engenheiro dos Cafés",
    description: "Equilibra fórmulas e cafeína.",
    spriteUrl: buildSprite("#f2a654", "#ffe0b3"),
    renderWidth: 74,
    renderHeight: 88,
    hitbox: { width: 36, height: 66, offsetX: 18, offsetY: 12 },
    accentColor: "#f2a654",
  },
  {
    id: "bruna",
    name: "Bruna",
    title: "Pixel Witch",
    description: "Invoca interfaces que hipnotizam.",
    spriteUrl: buildSprite("#ff8fb1", "#ffd6e4"),
    renderWidth: 70,
    renderHeight: 84,
    hitbox: { width: 34, height: 62, offsetX: 17, offsetY: 12 },
    accentColor: "#ff8fb1",
  },
  {
    id: "carol",
    name: "Carol",
    title: "Guardião das Builds",
    description: "Não deixa bug passar impune.",
    spriteUrl: buildSprite("#63d89e", "#d4f6e5"),
    renderWidth: 70,
    renderHeight: 84,
    hitbox: { width: 34, height: 64, offsetX: 17, offsetY: 12 },
    accentColor: "#63d89e",
  },
  {
    id: "debora",
    name: "Débora",
    title: "Alquimista UX",
    description: "Mistura acessibilidade com estilo.",
    spriteUrl: buildSprite("#5bd0f5", "#c9f0ff"),
    renderWidth: 72,
    renderHeight: 86,
    hitbox: { width: 36, height: 64, offsetX: 18, offsetY: 12 },
    accentColor: "#5bd0f5",
  },
];

export const DIPLOMA_SPRITE: SpriteDescriptor = {
  spriteUrl: buildDiploma(),
  width: 96,
  height: 96,
};

export const PROFESSOR_SPRITE: SpriteDescriptor = {
  spriteUrl: buildSprite("#ef476f", "#ffd1dd"),
  width: 90,
  height: 110,
};
