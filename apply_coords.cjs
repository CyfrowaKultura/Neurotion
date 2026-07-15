const fs = require('fs');
const path = '/Users/kl/blokowe emocje/emotion-app/src/data/emotions.js';
let content = fs.readFileSync(path, 'utf8');

const baseCoordsCode = `
export const baseCoords = {
  joy: { x: 0.8, y: 0.5 },
  sadness: { x: -0.7, y: -0.6 },
  anger: { x: -0.6, y: 0.8 },
  fear: { x: -0.5, y: 0.7 },
  trust: { x: 0.7, y: -0.2 },
  disgust: { x: -0.8, y: 0.3 },
  anticipation: { x: 0.5, y: 0.6 },
  surprise: { x: 0.1, y: 0.8 }
};

// Seeded random for jitter
function pseudoRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
`;

// Insert baseCoordsCode after baseEmotions declaration
content = content.replace('export const baseEmotions = [', baseCoordsCode + '\nexport const baseEmotions = [');

// Update combinations array definition
content = content.replace(
  '    color: blendColors(baseColor(m.pri), baseColor(m.sec))\n  }\n}));',
`    color: blendColors(baseColor(m.pri), baseColor(m.sec)),
    x: (() => {
      const p = baseCoords[m.pri];
      const s = baseCoords[m.sec];
      // seed from hash of id
      let seed = 0;
      for (let i = 0; i < m.id.length; i++) seed += m.id.charCodeAt(i);
      const jitterX = (pseudoRandom(seed) - 0.5) * 0.25;
      return (p.x + s.x) / 2 + jitterX;
    })(),
    y: (() => {
      const p = baseCoords[m.pri];
      const s = baseCoords[m.sec];
      let seed = 0;
      for (let i = 0; i < m.id.length; i++) seed += m.id.charCodeAt(i);
      const jitterY = (pseudoRandom(seed + 1) - 0.5) * 0.25;
      return (p.y + s.y) / 2 + jitterY;
    })()
  }
}));`
);

// We must also assign baseCoords to baseEmotions
content = content.replace(
  "    name: 'Oczekiwanie', color: '#ff7f00' }",
  "    name: 'Oczekiwanie', color: '#ff7f00' }\n].map(e => ({ ...e, x: baseCoords[e.id].x, y: baseCoords[e.id].y }));"
);

fs.writeFileSync(path, content);
console.log("Updated emotions.js with coordinates.");
