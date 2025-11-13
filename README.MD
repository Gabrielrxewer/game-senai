# Fuga Acadêmica

Um endless runner simples feito em TypeScript e HTML5 Canvas em que você controla um aluno correndo atrás do diploma enquanto foge do professor. O objetivo é percorrer a maior distância possível e bater seu recorde.

## Estrutura de pastas

```
.
├── index.html             # Documento HTML principal com o canvas
├── package.json           # Scripts NPM e dependências
├── tsconfig.json          # Configuração do TypeScript
├── vite.config.ts         # Configuração do Vite
└── src
    ├── core               # Engine mínima (game loop, estados)
    │   ├── Game.ts
    │   └── State.ts
    ├── entities           # Entidades do jogo (jogador, obstáculos)
    │   ├── Obstacle.ts
    │   └── Player.ts
    ├── scenes             # Telas/estados do jogo (menu, jogo, ranking, game over)
    │   ├── GameOverScene.ts
    │   ├── GameScene.ts
    │   ├── MenuScene.ts
    │   └── RankingScene.ts
    ├── services           # Serviços reutilizáveis (pontuação, ranking)
    │   ├── RankingService.ts
    │   └── ScoreService.ts
    └── ui                 # Helpers de UI e estilos globais
        ├── dom.ts
        └── styles.css
```

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite abrirá o jogo em `http://localhost:5173` (ou porta similar). Qualquer alteração em arquivos `.ts` ou `.css` recarrega automaticamente.

### 3. Build de produção

```bash
npm run build
```

Os arquivos finais serão gerados na pasta `dist/`. Para pré-visualizar a build use:

```bash
npm run preview
```

## Controles

- **Espaço**, **Seta para cima**, **clique** ou **toque** para pular.
- No menu, digite seu nickname e clique em **Jogar**.
- Use os botões do overlay para navegar entre Menu, Ranking e Game Over.

## Extensibilidade

O código foi organizado por estados e serviços, facilitando futuras integrações com APIs reais. As funções `saveScore` e `loadRanking` no `RankingService` e `ScoreService` podem ser adaptadas para chamadas `fetch` sem impactar a lógica das telas.
