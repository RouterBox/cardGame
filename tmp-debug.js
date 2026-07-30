const fs = require('fs');
const content = fs.readFileSync('design/playtest-spatial.md', 'utf8');
function stepText(content, n) {
  const startRe = new RegExp(`^${n}\\.\\s+`, 'm');
  const endRe = new RegExp(`^${n + 1}\\.\\s+`, 'm');
  const startMatch = startRe.exec(content);
  const rest = content.slice(startMatch.index);
  const endMatch = endRe.exec(rest);
  const body = endMatch ? rest.slice(0, endMatch.index) : rest;
  return body.replace(/\s+/g, ' ').trim();
}
const body = stepText(content, 10);
const idx = body.indexOf('Conveyance Directive');
console.log('idx', idx);
const nearby = body.slice(idx, idx + 700);
console.log(nearby);
console.log('---has Generator', /Generator/.test(nearby));
console.log('---has Circuit Point', /Circuit Point/.test(nearby));

const idx2 = body.indexOf("Pilgrim's Right of Way");
console.log('idx2', idx2);

const idxCP = body.indexOf('Circuit Point', idx);
console.log('distance to Circuit Point', idxCP - idx);

