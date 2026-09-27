// Deterministic component reproduction over exact owner-retained input.
// No Run, provider, worksite, journal or Product mutation.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const D=import.meta.dirname,prior=join(D,'../pc02-installed-02');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const activation=await read(join(prior,'activation-reviewed.json'));
const closed=await read(join(prior,'negative/result.json'));
assert.equal(closed.prefix.prefixLength,991116806);
const runtimePath=join(prior,'products/construction/node_modules/@odd-glc/route-one-typescript/build/program-construction-runtime.mjs');
const runtimeSha256=createHash('sha256').update(await readFile(runtimePath)).digest('hex');
assert.equal(runtimeSha256,'879f0978a64e74cdb9350fb523c0d69a1346c3e1b7d340b02eadd8c6e2e721f2');
const pkg=await read(join(activation.coreRoot,'package.json'));
const load=name=>{const exp=pkg.exports['./'+name];return import(pathToFileURL(join(activation.coreRoot,typeof exp==='string'?exp:exp.import)).href);};
const [product,abg,runtime]=await Promise.all([load('product'),load('abg'),import(pathToFileURL(runtimePath).href)]);
const readStarted=performance.now();
const prefixes=abg.projectRuntimePrefixesAtDurablePrefix(closed.prefix,closed.run.ref);
const projection=abg.projectRunSemanticReplayProjection(prefixes.authorityPrefix,closed.run.ref,closed.prefix);
assert.equal(projection.viewDigest,closed.counts.projectionDigest);
const expectedDigest='sha256:2c002d0719cc577ef3ffb3aee2dc78a62d49d52bfeedcf6415da09d6c9ae92e1';
const rows=projection.ownerFacts.filter(row=>row.retainedInput?.subjectDigest===expectedDigest);
assert.equal(rows.length,1,'one exact retained prepare input');
const retained=rows[0].retainedInput,input=retained.value;
assert.equal(product.sha256Canonical(input),expectedDigest);
const ownerReadMs=performance.now()-readStarted;
let reproduced;
const failureStarted=performance.now();
try { runtime.prepareConstruction(input); reproduced={threw:false}; }
catch(error) { reproduced={threw:true,name:error.name,message:error.message,stack:error.stack}; }
const failureMs=performance.now()-failureStarted;
assert.equal(reproduced.threw,true,'original admitted input must reproduce refusal');
const fixed=structuredClone(input);
assert.equal(fixed.entry.selectedDutyRefs.length,1);
const duty=fixed.entry.model.duties.find(d=>d.ref===fixed.entry.selectedDutyRefs[0]);
assert.equal(duty.dependencies.length,1);
const dependency=duty.dependencies[0];
const predecessor=fixed.entry.currentContext.entries.find(e=>e.relativePath===dependency.path&&e.state==='file');
assert(predecessor);assert.notEqual(dependency.digest,predecessor.digest);
const intervention={path:dependency.path,from:dependency.digest,to:predecessor.digest};
dependency.digest=predecessor.digest;
const positiveStarted=performance.now();let repairedVariant;
try {
 const candidate=runtime.prepareConstruction(fixed);
 repairedVariant={threw:false,kind:candidate.kind,disposition:candidate.disposition,resultKind:candidate.resultCandidate?.kind,
   constructionIndex:candidate.resultCandidate?.nextGroupIndex};
} catch(error) { repairedVariant={threw:true,name:error.name,message:error.message,stack:error.stack}; }
const positiveMs=performance.now()-positiveStarted;
const result={kind:'pc02_exact_input_deterministic_reproduction',runtimePath,runtimeSha256,
 run:closed.run,prefix:closed.prefix,projectionDigest:projection.viewDigest,
 ownerAtom:retained.ownerAtom,referenceBinding:retained.referenceBinding,inputDigest:expectedDigest,
 reproduced,intervention,repairedVariant,timings:{ownerReadMs,failureMs,positiveMs},
 claims:{originalExceptionRetained:false,originalAdmittedInputReproduced:true,
   positiveVariantAdmitted:false,newRun:false,nativeCalls:0,journalWrites:0}};
await writeFile(join(D,'result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
assert.equal(repairedVariant.threw,false,'one digest repair must remove the deterministic refusal');
assert.equal(repairedVariant.disposition,'success');
