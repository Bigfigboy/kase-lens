// Public demo is self-contained: this build never depends on src/.
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await copyFile('public-demo.html','dist/index.html');
console.log('KASE Lens public demo compiled (no src/ files required).');
