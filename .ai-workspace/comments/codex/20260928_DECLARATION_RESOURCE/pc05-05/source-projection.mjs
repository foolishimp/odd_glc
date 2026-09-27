// Selection preparation within the already acquired setup owner. No journal
// reader, reconstructed terminal, second acquisition or runtime controller.
import assert from 'node:assert/strict';

export function projectPreservedConstruction({abg,product,prefix,priorRun,priorLaunch,retainedInput,constructionGraphFunctionRef}) {
  const started=performance.now();
  const unique=(rows,label)=>{assert.equal(rows.length,1,label);return rows[0];};
  const proof={kind:'abg_historical_declaration_proof',schemaVersion:'5.0.0',
    catalog:priorLaunch.invocation.resources.catalog,catalogView:priorLaunch.invocation.resources.catalogView};
  const events=abg.projectRuntimePrefixesAtDurablePrefix(prefix,priorRun.ref).runtimePrefix.events;
  const author=retainedInput.source.constructionObservations.at(-1).observation;
  const native=unique(events.filter(e=>e.kind==='c_call_opened'&&e.aggregateId===author.provenance.cCallRef),'actual author CCall');
  const construction=unique(events.filter(e=>e.kind==='graph_call_opened'&&e.runId===priorRun.ref&&
    e.graphFunctionRef===constructionGraphFunctionRef),'one completed construction child');
  const graphCallRef=construction.graphCallId??construction.aggregateId;
  const projected=abg.projectClosedGraphCallTerminalAtDurablePrefix(prefix,graphCallRef,proof);
  assert(projected,'R10 must authenticate the completed construction child');
  assert.deepEqual(projected.value,retainedInput.source,'same admitted completed state as failed evaluation input');
  assert.deepEqual(priorLaunch.invocation.invocation.request.input.value,retainedInput.entry,'unchanged actual root input');
  const {value:constructionState,projectionBasis,...historicalSelection}=projected;
  const nativeBasis=unique(events.filter(e=>e.kind==='basis_admitted'&&e.basisId===native.basisId),'actual author basis');
  assert.equal(nativeBasis.payload.graphFunctionRef,'graph-function://abiogenesis/worksite/native-work@5');
  const basisDigest=nativeBasis.payload.basisDigest;
  assert(/^sha256:[a-f0-9]{64}$/.test(basisDigest),'admitted native basis digest');
  const sourceSelection={prefix,graphCallRef:native.graphCallId,declarationReference:abg.constructAbgHistoricalDeclarationReference(proof)};
  return {historicalSelection,constructionState,originalInput:retainedInput.entry,sourceSelection,
    nativeBasis:{ref:native.basisId,digest:basisDigest},declarationProof:proof,
    sourceInput:{graphFunctionRef:priorLaunch.invocation.resources.catalog.boundPublications.flatMap(p=>p.programs)
      .find(p=>p.programRef===priorLaunch.invocation.invocation.request.program.ref).starts[0].graphFunctionRef,
      contractRef:priorLaunch.invocation.invocation.request.input.contract.ref},
    projectionBasis,elapsedMs:performance.now()-started};
}
