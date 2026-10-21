import {rm,mkdir,cp,readFile,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await mkdir('dist/src',{recursive:true});
for(const name of ['app.js','style.css','data.js','engine.js']) await cp(`src/${name}`,`dist/src/${name}`);
// The public Vercel demo intentionally does not expose a fake AI API.
const index=await readFile('index.html','utf8');
await writeFile('dist/index.html',index.replace('<script type="module" src="/src/app.js"></script>', '<script>window.__KASE_PUBLIC_DEMO__ = true;</script>\n  <script type="module" src="/src/app.js"></script>'));
await writeFile('dist/README.txt','Public UI demo only: historical market explorer, comparison, risk simulation and sources. Real Qwen3 AI requires the local Ollama + Node.js backend.');
console.log('Ready for Vercel: dist/. Public demo mode displays the AI limitation honestly.');
