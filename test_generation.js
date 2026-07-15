import { getAllEmotionsMap, combinations } from './src/data/emotions.js';

const allMap = getAllEmotionsMap();
const allArray = Array.from(allMap.values());
const existingKeys = new Set(combinations.map(c => `${c.primary}-${c.secondary}`));

let newRecipesCount = 0;
for (let i = 0; i < allArray.length; i++) {
  for (let j = 0; j < allArray.length; j++) {
    if (i === j) continue; // no self-combining dynamically? Or should we allow A+A?
    const A = allArray[i];
    const B = allArray[j];
    const key = `${A.id}-${B.id}`;
    if (existingKeys.has(key)) continue;

    // find closest C
    const midX = (A.x + B.x) / 2;
    const midY = (A.y + B.y) / 2;
    let closestC = null;
    let minDist = Infinity;
    
    for (const C of allArray) {
      if (C.id === A.id || C.id === B.id) continue;
      const dist = Math.hypot(C.x - midX, C.y - midY);
      if (dist < minDist) {
        minDist = dist;
        closestC = C;
      }
    }
    
    if (closestC && minDist < 0.3) {
      newRecipesCount++;
    }
  }
}
console.log('Total emotions:', allArray.length);
console.log('Potential new recipes (dist < 0.3):', newRecipesCount);
console.log('Potential new recipes (dist < 0.5):', (() => {
  let c = 0;
  for (let i = 0; i < allArray.length; i++) {
    for (let j = 0; j < allArray.length; j++) {
      if (i === j) continue;
      const A = allArray[i];
      const B = allArray[j];
      const key = `${A.id}-${B.id}`;
      if (existingKeys.has(key)) continue;
      const midX = (A.x + B.x) / 2;
      const midY = (A.y + B.y) / 2;
      let closestC = null;
      let minDist = Infinity;
      for (const C of allArray) {
        if (C.id === A.id || C.id === B.id) continue;
        const dist = Math.hypot(C.x - midX, C.y - midY);
        if (dist < minDist) { minDist = dist; closestC = C; }
      }
      if (closestC && minDist < 0.5) c++;
    }
  }
  return c;
})());
