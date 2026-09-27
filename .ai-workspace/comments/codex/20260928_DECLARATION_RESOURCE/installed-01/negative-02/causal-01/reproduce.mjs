// One deterministic reproduction over the exact installed owner's retained input.
// Reuses pc02-causal-reproduction-01's method. No Run or effect is invoked.
import assert from 'node:assert/strict';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const D=import.meta.dirname,prior=resolve(D,'../..'),read=async p=>JSON.parse(await readFile(p,'utf8'));
const receiptPath=join(prior,'negative-02/graphExecution.json'),receipt=(await read(receiptPath)).receipt;
const closed=receipt.resources.eventResource.closeHandoff,prefix=closed.prefix,run=receipt.ownerOutput.value.run;
const readback=await read(join(prior,'readback-03.stdout'));
assert.equal(prefix.prefixLength,1018398367);
assert.equal(receipt.ownerOutput.value.disposition,'runtime_failed');assert.equal(receipt.ownerOutput.value.result,null);
const expectedProjection='sha256:f35ae745e77cec4b9f3e0f3b8509b45301f2b2b8e74f9cfa272af2c3fea3fbf2';
assert.equal(readback.counts.projectionDigest,expectedProjection);assert.deepEqual(readback.closeHandoff.prefix,prefix);
const journalBefore=await stat(new URL(prefix.eventLogRef));assert.equal(journalBefore.size,prefix.prefixLength);
const runtimePath=join(prior,'products/construction/node_modules/@odd-glc/route-one-typescript/build/program-construction-runtime.mjs');
const runtimeSha256=createHash('sha256').update(await readFile(runtimePath)).digest('hex');
assert.equal(runtimeSha256,'3a6386752c139df6c1742475af07503dc523a9a3624e80e2bb7e66b3327edeaa');
const coreRoot=join(prior,'products/core47/node_modules/@abiogenesis/typescript-tenant'),pkg=await read(join(coreRoot,'package.json'));
const load=name=>{const exp=pkg.exports['./'+name];return import(pathToFileURL(join(coreRoot,typeof exp==='string'?exp:exp.import)).href);};
const [product,abg,runtime]=await Promise.all([load('product'),load('abg'),import(pathToFileURL(runtimePath).href)]);
console.log(JSON.stringify({phase:'one_owner_projection_started',prefixLength:prefix.prefixLength,run:run.ref}));
const readStarted=performance.now();
const prefixes=abg.projectRuntimePrefixesAtDurablePrefix(prefix,run.ref);
const prefixesMs=performance.now()-readStarted,projectionStarted=performance.now();
const projection=abg.projectRunSemanticReplayProjection(prefixes.authorityPrefix,run.ref,prefix);
const semanticProjectionMs=performance.now()-projectionStarted;
assert.equal(projection.viewDigest,expectedProjection);
const expectedDigest='sha256:fc03c6cc7489e3bb589d8f8bdc0687d2ab37df8c15b075b1ba8a13b0a4f297c6';
const rows=projection.ownerFacts.filter(row=>row.retainedInput?.subjectDigest===expectedDigest);
assert.equal(rows.length,1,'one exact retained prepare input');
const retained=rows[0].retainedInput,input=retained.value;assert.equal(product.sha256Canonical(input),expectedDigest);
const ownerReadMs=performance.now()-readStarted;
console.log(JSON.stringify({phase:'one_owner_projection_completed',prefixesMs,semanticProjectionMs,ownerReadMs}));
let reproduced;const failureStarted=performance.now();
try{runtime.prepareConstruction(input);reproduced={threw:false};}
catch(error){reproduced={threw:true,name:error.name,message:error.message,stack:error.stack};}
const failureMs=performance.now()-failureStarted;
assert.equal(reproduced.threw,true,'exact retained admitted input reproduces a deterministic refusal');
const fixed=structuredClone(input);assert.equal(fixed.entry.selectedDutyRefs.length,1);
const dutyIndex=fixed.entry.model.duties.findIndex(d=>d.ref===fixed.entry.selectedDutyRefs[0]),duty=fixed.entry.model.duties[dutyIndex];
assert.equal(duty.dependencies.length,1);
const dependency=duty.dependencies[0],predecessor=fixed.entry.currentContext.entries.find(e=>e.relativePath===dependency.path&&e.state==='file');
assert(predecessor);assert.notEqual(dependency.digest,predecessor.digest);
const intervention={jsonPath:`entry.model.duties[${dutyIndex}].dependencies[0].digest`,path:dependency.path,from:dependency.digest,to:predecessor.digest};
dependency.digest=predecessor.digest;
const restored=structuredClone(fixed);restored.entry.model.duties[dutyIndex].dependencies[0].digest=intervention.from;
assert.deepEqual(restored,input,'only one predecessor digest is changed');
const positiveStarted=performance.now();let repairedVariant;
try{const candidate=runtime.prepareConstruction(fixed);repairedVariant={threw:false,kind:candidate.kind,disposition:candidate.disposition,
  resultKind:candidate.resultCandidate?.kind,constructionIndex:candidate.resultCandidate?.nextGroupIndex};}
catch(error){repairedVariant={threw:true,name:error.name,message:error.message,stack:error.stack};}
const positiveMs=performance.now()-positiveStarted,journalAfter=await stat(new URL(prefix.eventLogRef));
assert.equal(journalAfter.size,journalBefore.size);assert.equal(journalAfter.mtimeMs,journalBefore.mtimeMs);assert.equal(journalAfter.ino,journalBefore.ino);
const result={kind:'pc02_negative02_exact_input_deterministic_reproduction',receiptPath,runtimePath,runtimeSha256,coreRoot,
  run,prefix,projectionDigest:projection.viewDigest,ownerAtom:retained.ownerAtom,referenceBinding:retained.referenceBinding,
  inputDigest:expectedDigest,inputBytes:Buffer.byteLength(JSON.stringify(input)),reproduced,intervention,repairedVariant,
  repairedInputDigest:product.sha256Canonical(fixed),timings:{prefixesMs,semanticProjectionMs,ownerReadMs,failureMs,positiveMs},
  journal:{bytesBefore:journalBefore.size,bytesAfter:journalAfter.size,mtimeUnchanged:true,inodeUnchanged:true},
  claims:{originalExceptionRetained:false,originalAdmittedInputReproduced:true,positiveVariantAdmitted:false,newRun:false,nativeCalls:0,journalWrites:0,
    readScope:'one cold owner prefix projection followed by semantic projection of that same in-memory authority prefix; no second journal read'}};
await writeFile(join(D,'result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
assert.equal(repairedVariant.threw,false,'one digest correction removes the deterministic refusal');assert.equal(repairedVariant.disposition,'success');
