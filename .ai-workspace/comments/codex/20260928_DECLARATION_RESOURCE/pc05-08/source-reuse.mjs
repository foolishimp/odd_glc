// Reuse an exact prior derived selection, not runtime authority. The declared
// suffix still performs existing R10 authentication and native currentness.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
export function projectPreservedConstruction({product,priorRun,priorLaunch,retainedInput}) {
  const started=performance.now(),base=join(import.meta.dirname,'../pc05-05');
  const load=(name,digest)=>{const bytes=readFileSync(join(base,name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),digest,name);return JSON.parse(bytes);};
  const source=load('preserved-source.json','4594903d072f3961cfa81f176c5c9b0b4562f08727878e601913c72a99f0d6a2');
  const record=load('source-projection-record.json','f3b50672718567c664f62bb73d39ff272e71b4e79cbab676170fad3fa97d522d');
  assert.equal(source.historicalSelection.producer.runRef,priorRun.ref);
  assert.deepEqual(source.historicalSelection,record.historicalSelection);
  assert.deepEqual(source.constructionState,retainedInput.source);
  assert.deepEqual(source.originalInput,retainedInput.entry);
  assert.deepEqual(source.originalInput,priorLaunch.invocation.invocation.request.input.value);
  assert.equal(product.sha256Canonical(source.constructionState),record.unchangedStateDigest);
  assert.equal(product.sha256Canonical(source.originalInput),record.unchangedOriginalInputDigest);
  const declarationProof={kind:'abg_historical_declaration_proof',schemaVersion:'5.0.0',
    catalog:priorLaunch.invocation.resources.catalog,catalogView:priorLaunch.invocation.resources.catalogView};
  assert.equal(product.sha256Canonical(declarationProof),record.declarationProofDigest);
  return {...source,declarationProof,elapsedMs:performance.now()-started};
}
