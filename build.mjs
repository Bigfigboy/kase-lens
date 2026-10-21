import {rm,mkdir,cp,copyFile,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
await copyFile('index.html','dist/index.html');await cp('src','dist/src',{recursive:true});
await writeFile('dist/README.txt','Static UI assets only. For the real local AI use the full project: npm run dev. A static deployment cannot access your local Ollama instance.');
console.log('Static UI exported to dist/; local AI needs the Node backend.');
