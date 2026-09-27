// Finite read-only comparison of the exact retained caller input. No Run or actor.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import * as product from '@abiogenesis/typescript-tenant/product';
const repo=resolve(import.meta.dirname,'../../../../..'),relative='build_tenants/odd_glc/typescript/src/program-construction.mjs';
const sourcePath=resolve(repo,relative),sourceURL=pathToFileURL(sourcePath);
const oldSource=execFileSync('git',['show','66304a6:'+relative],{cwd:repo,encoding:'utf8'});
const importable=oldSource.replace(/from '([^']+)'/gu,(whole,spec)=>spec.startsWith('.')?`from '${new URL(spec,sourceURL).href}'`:whole);
const before=await import('data:text/javascript;base64,'+Buffer.from(importable).toString('base64'));
const after=await import(sourceURL.href);
const inputPath=resolve(repo,'.ai-workspace/comments/codex/20260927_PROGRAM_CONSTRUCTION/pc02-installed-02/valid-rebound-input.json');
const t=performance.now(),bytes=await readFile(inputPath),input=JSON.parse(bytes),readParseMs=performance.now()-t;
const basis={executionObservation:input.origin.observation,construction:input.origin.construction,execution:input.origin.execution,
  sourceRefs:input.origin.sourceRefs,currentContext:input.currentContext,evaluations:[]};
const allApplicability=value=>({...input.model,duties:input.model.duties.map(d=>({...d,applicability:{...d.applicability,value}}))});
const cases=[['retained-valid',input.model,basis],
  ['invalid-execution-identity',input.model,{...basis,executionObservation:{...basis.executionObservation,observationRef:'observation://invalid'}}],
  ['missing-basis',input.model,{...basis,executionObservation:null}],
  ['all-inapplicable',allApplicability('false'),basis],['all-unknown',allApplicability('unknown'),basis]];
const rows=[];
for(const [name,model,caseBasis] of cases){
  const outputs=[],measurements=[];
  for(const implementation of [before,after]){
    const calls={},predicateMs={};
    const measured=new Proxy(product,{get(target,key){const value=target[key];
      if(!['isNativeWorkspaceWorkObservation','isNativeWorksiteCommandExecutionObservation'].includes(key))return value;
      return(...args)=>{const start=performance.now();calls[key]=(calls[key]??0)+1;
        try{return value(...args);}finally{predicateMs[key]=(predicateMs[key]??0)+performance.now()-start;}};}});
    const start=performance.now();outputs.push(implementation.selectLifecycleWork({product:measured,model,basis:caseBasis,selectedDutyRefs:input.selectedDutyRefs}));
    measurements.push({elapsedMs:performance.now()-start,calls,predicateMs});
  }
  assert.deepEqual(outputs[1],outputs[0],name+' preserves complete selection including residuals');
  rows.push({name,before:measurements[0],after:measurements[1],sameResult:true,resultDigest:product.sha256Canonical(outputs[1])});
}
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const result={basisCommit:'66304a6',inputPath,inputBytes:bytes.length,inputSha256:sha(bytes),readParseMs,duties:input.model.duties.length,
  beforeSourceSha256:sha(oldSource),afterSourceSha256:sha(await readFile(sourcePath)),rows,
  scope:'pure consumer selection only; no installed invocation, actor, history acquisition or worksite effect'};
await writeFile(new URL('selection-comparison.json',import.meta.url),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
