import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {answer} from './src/answer-service.js';
import {searchKnowledge,getDocuments,addDocument,publicSource} from './src/knowledge.js';
const root=resolve(fileURLToPath(new URL('.',import.meta.url)));
const port=Number(process.env.PORT||5173);
const model=process.env.OLLAMA_MODEL||'qwen3:1.7b';
const ollama=process.env.OLLAMA_URL||'http://127.0.0.1:11434';
const mime={'.mjs':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
const json=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj))};
async function readJson(req,max=15000){
 const chunks=[];let bytes=0;
 for await (const chunk of req){bytes+=chunk.length;if(bytes>max)throw new Error('Too much data');chunks.push(chunk)}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
const safePost=(req)=>{const origin=req.headers.origin;return (!origin||origin===`http://localhost:${port}`||origin===`http://127.0.0.1:${port}`) && (req.headers['content-type']||'').startsWith('application/json')};
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url||'/','http://localhost');
 if(url.pathname.startsWith('/api/')&&req.method==='POST'&&!safePost(req))return json(res,403,{error:'Same-origin JSON requests only'});
 if(req.method==='GET'&&url.pathname==='/api/status'){
  try{const resp=await fetch(new URL('/api/tags',ollama),{signal:AbortSignal.timeout(2400)});const result=await resp.json();return json(res,200,{version:'FINAL',ollama:resp.ok,installed:!!result.models?.some(x=>[x.name,x.model].includes(model)),model,documents:getDocuments().length,scope:'local-only'});}catch{return json(res,200,{version:'FINAL',ollama:false,installed:false,model,documents:getDocuments().length,scope:'local-only'})}
 }
 if(req.method==='GET'&&url.pathname==='/api/version')return json(res,200,{version:'FINAL',architecture:'AI-first RAG; no canned-answer router; historical market only'});
 if(req.method==='GET'&&url.pathname==='/api/evidence'){const query=(url.searchParams.get('q')||'').slice(0,500);return json(res,200,{results:searchKnowledge(query).map(publicSource),method:'local lexical retrieval',documents:getDocuments().length})}
 if(req.method==='GET'&&url.pathname==='/api/documents')return json(res,200,{documents:getDocuments().map(x=>({id:x.id,title:x.title,url:x.url,checked:x.checked,confidence:x.confidence||'reviewed-paraphrase'}))});
 if(req.method==='POST'&&url.pathname==='/api/documents'){
   try{const doc=await addDocument(await readJson(req,45000));return json(res,201,{saved:true,id:doc.id,documents:getDocuments().length});}catch(err){return json(res,400,{error:String(err.message||err)})}
 }
 if(req.method==='POST'&&url.pathname==='/api/ask'){
  try{const {question,lang}=await readJson(req,5000);
   const q=String(question||'').trim();if(q.length<3||q.length>500)return json(res,400,{error:'Question length must be 3–500 characters'});
   const l=['ru','en','kz'].includes(lang)?lang:'ru';
   return json(res,200,{...(await answer(q,l)),version:'FINAL'});
  }catch(err){return json(res,400,{error:'Invalid question: '+String(err.message||err)})}
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
 let pathname;try{pathname=decodeURIComponent(url.pathname)}catch{return json(res,400,{error:'Bad URL'})}
 const name=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
 // Never serve internal files (model data, config, test suite, package.json or internal docs).
 if(name.startsWith('api/')||name.includes('..')||!(/^(?:index\.html|favicon\.ico|src\/(?:app|style|data|engine)\.(?:js|css))$/.test(name)))return json(res,404,{error:'Not found'});
 const full=resolve(root,name);
 if(full!==root&&!full.startsWith(root+sep))return json(res,403,{error:'Forbidden'});
 try{const s=await stat(full);if(!s.isFile())throw Error('not file');const payload=await readFile(full);res.writeHead(200,{'Content-Type':mime[extname(full)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:payload);}catch{return json(res,404,{error:'Not found'})}
});
server.listen(port,'127.0.0.1',()=>console.log(`KASE Lens FINAL | http://localhost:${port} | local model ${model} | ${getDocuments().length} source records`));
