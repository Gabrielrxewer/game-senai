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

export const CHARACTERS: CharacterSkin[] = [
  {
    id: "fernanda",
    name: "Fernanda",
    title: "Arquiteta do Caos",
    description: "Transforma pilhas de trabalhos em arte abstrata.",
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/girl.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/boy.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/manBlue.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/manOld.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/woman.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/girlPink.png",
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
    spriteUrl:
      "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/womanGreen.png",
    renderWidth: 72,
    renderHeight: 86,
    hitbox: { width: 36, height: 64, offsetX: 18, offsetY: 12 },
    accentColor: "#5bd0f5",
  },
];

export const DIPLOMA_SPRITE: SpriteDescriptor = {
  spriteUrl:
    "https://raw.githubusercontent.com/kenneyNL/platformer-pack-redux/master/Items/PNG/medalGold.png",
  width: 96,
  height: 96,
};

export const PROFESSOR_SPRITE: SpriteDescriptor = {
  spriteUrl:
    "https://raw.githubusercontent.com/0x72/32x32-sprites/master/sprites/manBrown.png",
  width: 90,
  height: 110,
};
