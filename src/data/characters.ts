const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

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

const fernandaSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="26" y="18" width="44" height="56" rx="18" fill="#ff8fab" />
  <rect x="22" y="58" width="52" height="28" rx="14" fill="#f7e1d7" />
  <rect x="34" y="8" width="28" height="28" rx="12" fill="#ffeef2" />
  <circle cx="48" cy="22" r="11" fill="#0b132b" fill-opacity="0.85" />
  <rect x="28" y="40" width="40" height="8" rx="4" fill="#ffe066" />
  <rect x="18" y="64" width="10" height="20" rx="4" fill="#0b132b" />
  <rect x="68" y="64" width="10" height="20" rx="4" fill="#0b132b" />
</svg>`;

const gabrielSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="16" width="48" height="60" rx="20" fill="#118ab2" />
  <rect x="20" y="60" width="56" height="30" rx="15" fill="#073b4c" />
  <rect x="34" y="6" width="28" height="28" rx="14" fill="#f0f3bd" />
  <circle cx="48" cy="22" r="10" fill="#ffd166" />
  <rect x="30" y="42" width="36" height="10" rx="5" fill="#06d6a0" />
  <rect x="18" y="70" width="12" height="18" rx="4" fill="#ffd166" />
  <rect x="66" y="70" width="12" height="18" rx="4" fill="#ffd166" />
</svg>`;

const adrielSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="28" y="20" width="40" height="54" rx="18" fill="#9d4edd" />
  <rect x="24" y="58" width="48" height="30" rx="14" fill="#5e60ce" />
  <rect x="34" y="10" width="28" height="26" rx="12" fill="#dec9e9" />
  <circle cx="48" cy="24" r="9" fill="#240046" />
  <rect x="32" y="42" width="32" height="8" rx="4" fill="#ffba08" />
  <path d="M24 68 L30 80" stroke="#f5f3f4" stroke-width="6" stroke-linecap="round" />
  <path d="M72 68 L66 80" stroke="#f5f3f4" stroke-width="6" stroke-linecap="round" />
</svg>`;

const rafaelSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="25" y="18" width="46" height="58" rx="20" fill="#fb8b24" />
  <rect x="20" y="58" width="56" height="30" rx="15" fill="#ffbf69" />
  <rect x="32" y="6" width="32" height="30" rx="14" fill="#f4f1de" />
  <circle cx="48" cy="22" r="9" fill="#3d405b" />
  <rect x="30" y="42" width="36" height="10" rx="5" fill="#81b29a" />
  <rect x="20" y="70" width="12" height="18" rx="4" fill="#3d405b" />
  <rect x="64" y="70" width="12" height="18" rx="4" fill="#3d405b" />
</svg>`;

const brunaSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="28" y="18" width="40" height="58" rx="20" fill="#ff9770" />
  <rect x="24" y="58" width="48" height="30" rx="15" fill="#ffd3b6" />
  <rect x="34" y="10" width="28" height="26" rx="12" fill="#ffe5ec" />
  <circle cx="48" cy="24" r="9" fill="#ff5d8f" />
  <rect x="30" y="42" width="36" height="10" rx="5" fill="#2ec4b6" />
  <path d="M24 68 L30 82" stroke="#ff5d8f" stroke-width="6" stroke-linecap="round" />
  <path d="M72 68 L66 82" stroke="#ff5d8f" stroke-width="6" stroke-linecap="round" />
</svg>`;

const carolSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="26" y="16" width="44" height="60" rx="22" fill="#80ed99" />
  <rect x="22" y="58" width="52" height="30" rx="15" fill="#57cc99" />
  <rect x="34" y="8" width="28" height="28" rx="12" fill="#c7f9cc" />
  <circle cx="48" cy="22" r="9" fill="#22577a" />
  <rect x="30" y="42" width="36" height="8" rx="4" fill="#22577a" />
  <path d="M24 68 L32 82" stroke="#22577a" stroke-width="6" stroke-linecap="round" />
  <path d="M72 68 L64 82" stroke="#22577a" stroke-width="6" stroke-linecap="round" />
</svg>`;

const deboraSvg = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="18" width="48" height="58" rx="20" fill="#ade8f4" />
  <rect x="20" y="58" width="56" height="30" rx="15" fill="#caf0f8" />
  <rect x="32" y="8" width="32" height="28" rx="14" fill="#fff1e6" />
  <circle cx="48" cy="22" r="10" fill="#03045e" />
  <rect x="30" y="42" width="36" height="10" rx="5" fill="#ff006e" />
  <path d="M22 68 L30 80" stroke="#03045e" stroke-width="6" stroke-linecap="round" />
  <path d="M74 68 L66 80" stroke="#03045e" stroke-width="6" stroke-linecap="round" />
</svg>`;

const diplomaSvg = `
<svg width="160" height="80" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="12" y="20" width="136" height="40" rx="18" fill="#fff8e1" stroke="#d4a418" stroke-width="4" />
  <rect x="28" y="32" width="80" height="4" rx="2" fill="#d4a418" />
  <rect x="28" y="42" width="58" height="4" rx="2" fill="#d4a418" />
  <circle cx="128" cy="40" r="10" fill="#ef476f" />
  <path d="M128 30 L134 46 L122 46 Z" fill="#ffd166" />
</svg>`;

const professorSvg = `
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="32" y="28" width="56" height="72" rx="20" fill="#2b2d42" />
  <rect x="28" y="70" width"
  <rect x="28" y="70" width="64" height="34" rx="16" fill="#ef476f" />
  <rect x="40" y="12" width="40" height="40" rx="18" fill="#ffd166" />
  <rect x="52" y="8" width="16" height="14" rx="6" fill="#2b2d42" />
  <rect x="38" y="44" width="44" height="12" rx="6" fill="#f8ffe5" />
  <circle cx="50" cy="34" r="6" fill="#2b2d42" />
  <circle cx="70" cy="34" r="6" fill="#2b2d42" />
  <rect x="44" y="92" width="12" height="18" rx="6" fill="#1c2541" />
  <rect x="64" y="92" width="12" height="18" rx="6" fill="#1c2541" />
</svg>`;

export const CHARACTERS: CharacterSkin[] = [
  {
    id: "fernanda",
    name: "Fernanda",
    title: "Arquiteta do Caos",
    description: "Transforma pilhas de trabalhos em arte abstrata.",
    spriteUrl: svgToDataUri(fernandaSvg),
    renderWidth: 68,
    renderHeight: 80,
    hitbox: { width: 34, height: 60, offsetX: 17, offsetY: 12 },
    accentColor: "#ff8fab",
  },
  {
    id: "gabriel",
    name: "Gabriel",
    title: "Dev das Madrugadas",
    description: "Compila esperança e debuga sonhos.",
    spriteUrl: svgToDataUri(gabrielSvg),
    renderWidth: 72,
    renderHeight: 84,
    hitbox: { width: 36, height: 64, offsetX: 18, offsetY: 12 },
    accentColor: "#118ab2",
  },
  {
    id: "adriel",
    name: "Adriel",
    title: "Bardo dos Bits",
    description: "Canta commits épicos no corredor.",
    spriteUrl: svgToDataUri(adrielSvg),
    renderWidth: 66,
    renderHeight: 82,
    hitbox: { width: 34, height: 62, offsetX: 16, offsetY: 12 },
    accentColor: "#9d4edd",
  },
  {
    id: "rafael",
    name: "Rafael",
    title: "Engenheiro dos Cafés",
    description: "Equilibra fórmulas e cafeína.",
    spriteUrl: svgToDataUri(rafaelSvg),
    renderWidth: 70,
    renderHeight: 86,
    hitbox: { width: 36, height: 66, offsetX: 17, offsetY: 12 },
    accentColor: "#fb8b24",
  },
  {
    id: "bruna",
    name: "Bruna",
    title: "Pixel Witch",
    description: "Invoca interfaces que hipnotizam.",
    spriteUrl: svgToDataUri(brunaSvg),
    renderWidth: 68,
    renderHeight: 82,
    hitbox: { width: 34, height: 62, offsetX: 17, offsetY: 12 },
    accentColor: "#ff5d8f",
  },
  {
    id: "carol",
    name: "Carol",
    title: "Guardião das Builds",
    description: "Não deixa bug passar impune.",
    spriteUrl: svgToDataUri(carolSvg),
    renderWidth: 70,
    renderHeight: 84,
    hitbox: { width: 36, height: 64, offsetX: 17, offsetY: 12 },
    accentColor: "#57cc99",
  },
  {
    id: "debora",
    name: "Débora",
    title: "Alquimista UX",
    description: "Mistura acessibilidade com estilo.",
    spriteUrl: svgToDataUri(deboraSvg),
    renderWidth: 72,
    renderHeight: 84,
    hitbox: { width: 36, height: 64, offsetX: 18, offsetY: 12 },
    accentColor: "#00b4d8",
  },
];

export const DIPLOMA_SPRITE: SpriteDescriptor = {
  spriteUrl: svgToDataUri(diplomaSvg),
  width: 160,
  height: 80,
};

export const PROFESSOR_SPRITE: SpriteDescriptor = {
  spriteUrl: svgToDataUri(professorSvg),
  width: 120,
  height: 120,
};
