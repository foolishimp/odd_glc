// Closed-range diagnostic only. Existing body codec; no acquisition or replay.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const D=import.meta.dirname;
const read=async name=>JSON.parse(await fs.readFile(join(D,name),'utf8'));
const activation=await read('activation.json');
const {decodeEventBody,inlineEventBody}=await import(pathToFileURL(join(activation.coreRoot,'build/code/src/abg/event_body_encoding.js')).href);
const basis=await read('execution/execution-basis.json');
const result=await read('execution/result.json');
const cli=await read('execution/graphExecution.json');
assert.equal(result.disposition,'runtime_failed');
assert.deepEqual(result.closeHandoff,cli.receipt.resources.eventResource.closeHandoff);
const start=basis.beforeBytes,end=result.closeHandoff.prefix.prefixLength;
assert.equal(start,result.log.beforeBytes);assert.equal(end-start,result.log.appendedBytes);
const file=new URL(result.closeHandoff.prefix.eventLogRef),fd=await fs.open(file,'r');
const before=await fd.stat();assert.equal(before.size,end);
const rawBytes=Buffer.alloc(end-start);let readBytes=0;
const started=performance.now();
try {while(readBytes<rawBytes.length){const r=await fd.read(rawBytes,readBytes,rawBytes.length-readBytes,start+readBytes);assert(r.bytesRead>0);readBytes+=r.bytesRead;}}
finally {await fd.close();}
const readMs=performance.now()-started;
assert.equal(rawBytes.at(-1),10);
const bodies=new Map(),kinds={},rows=[],unresolved=[];let offset=start;
const brief=(value,depth=0)=>{
 if(value===null||typeof value==='boolean'||typeof value==='number')return value;
 if(typeof value==='string')return value.length>900?{stringBytes:Buffer.byteLength(value),excerpt:value.slice(0,180)}:value;
 if(depth>4)return {shape:Array.isArray(value)?'array':'object',size:Array.isArray(value)?value.length:Object.keys(value).length};
 if(Array.isArray(value))return value.length>12?{items:value.length}:value.map(v=>brief(v,depth+1));
 return Object.fromEntries(Object.entries(value).filter(([k])=>!['rawInputValue','value','catalog','catalogView','program','instructionAssembly','request','context','assembly','body','content','valuePayload'].includes(k)).map(([k,v])=>[k,brief(v,depth+1)]));
};
for(const line of rawBytes.toString('utf8').split('\n').slice(0,-1)){
 const physical=JSON.parse(line),begin=offset;offset+=Buffer.byteLength(line)+1;
 try {
  const decoded=decodeEventBody(physical,bodies),e=decoded.event;
  if(decoded.physicallyInline){const body=inlineEventBody(e);if(body)bodies.set(e.eventId,body);}
  kinds[e.kind]=(kinds[e.kind]??0)+1;
  if(!/stream_chunk|stdout_chunk|stderr_chunk/.test(e.kind))rows.push({begin,end:offset,physicalRowSha256:crypto.createHash('sha256').update(line+'\n').digest('hex'),event:brief(e)});
 }catch(error){unresolved.push({begin,end:offset,eventId:physical.event?.eventId,kind:physical.event?.kind,reason:error.message});}
}
const after=await fs.stat(file);
assert.equal(after.size,before.size);assert.equal(after.mtimeMs,before.mtimeMs);assert.equal(after.ino,before.ino);
const output={scope:'Raw diagnostic of exact closed appended suffix; not owner admission, recovery or replay. Large values omitted; unresolved earlier body references remain unknown.',run:result.run,range:{start,end,bytes:rawBytes.length,sha256:crypto.createHash('sha256').update(rawBytes).digest('hex')},readMs,totalMs:performance.now()-started,closeCoordinate:result.closeHandoff.prefix,sourceReceiptSha256:crypto.createHash('sha256').update(await fs.readFile(join(D,'execution/graphExecution.json'))).digest('hex'),kinds,unresolved,rows};
await fs.writeFile(join(D,'execution/diagnostic-suffix.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({range:output.range,readMs,totalMs:output.totalMs,kinds,unresolved,selectedRows:rows.length}));
