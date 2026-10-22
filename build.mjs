import {rm,mkdir,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await copyFile('public-demo.html','dist/index.html');
console.log('KASE Lens public UI built; Vercel serverless API lives under /api/ask.');
