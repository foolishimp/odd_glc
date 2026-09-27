// Package and static declaration-closure proof only. Candidate installs below
// are explicitly hypothetical preflight values: no effect/admission or Run.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve,basename} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {installedFullSandboxApis} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
import {nativeFullSandboxPublications} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-declarations.mjs';
import {materializeD1Publication} from '../../../../../build_tenants/odd_glc/typescript/test/d1-lifecycle-declarations.mjs';
import {constructCase,caseBasis} from './candidate.mjs';
import {buildProgramConstructionProduct} from '../../../../../build_tenants/odd_glc/typescript/scripts/build-native-continuation-product.mjs';
const D=import.meta.dirname,repo=resolve(D,'../../../../..'),read=async p=>JSON.parse(await readFile(p,'utf8'));
const {core,configuration,sourceSelection}=await caseBasis();
const {product,gtl,validator}=await installedFullSandboxApis(core.packageRoot),schemaVersion='5.0.0';
const start=performance.now(),built=await constructCase({product,gtl,artifact:{...core.basis,productManifestDigest:core.basis.manifestDigest},sourceSelection,runEnvironment:configuration.runEnvironment});
assert.equal(built.candidate.kind,'candidate');await mkdir(join(D,'packages'));await mkdir(join(D,'artifacts'));
await buildProgramConstructionProduct({coreRoot:core.packageRoot,publication:built.candidate.publication,dependencies:[],outputRoot:join(D,'packages/construction')});
const packed=await promisify(execFile)('npm',['pack','--ignore-scripts','--json','--pack-destination',join(D,'artifacts')],{cwd:join(D,'packages/construction'),timeout:60000});
const rows=JSON.parse(packed.stdout);assert.equal(rows.length,1);
const manifest=await read(join(D,'packages/construction/product-toolchain-manifest.json'));

const artifactPath=join(D,'artifacts',rows[0].filename);
const prior=(await read(join(D,'../../20260927_PROGRAM_CONSTRUCTION/installed-02/setup/calls/08-catalog.json'))).resources;
const candidateArtifacts=[{artifactPath,basis:{artifactDigest:await product.sha256File(artifactPath),productContentDigest:manifest.productContentDigest,
 manifestDigest:product.sha256Canonical(manifest),productId:manifest.productId,packageName:manifest.packageName,packageVersion:manifest.packageVersion}}];
const packageMs=performance.now()-start,verified=[];
for(const a of [{artifactPath:core.artifactPath,basis:core.basis},...candidateArtifacts]){
 const request={artifactPath:a.artifactPath,artifactRef:basename(a.artifactPath),...Object.fromEntries(Object.entries(a.basis).map(([k,v])=>['expected'+k[0].toUpperCase()+k.slice(1),v]))};
 const verification=await product.ProductVerificationPort.verify({kind:'product_verification_packet',schemaVersion,memberKey:'verify',targetKind:'packed_artifact',request});
 assert.equal(verification.kind,'product_verification_success');verified.push(verification.verifiedArtifact);
}
const lock=product.ProductEnvironmentPort.resolve({kind:'product_resolution_packet',schemaVersion,memberKey:'resolve',verifiedArtifacts:verified});assert.equal(lock.kind,'resolved_product_lock');
// Hypothetical typed materialized candidates test pure readiness. They are never
// serialized into an invocation or passed as admitted installs.
const candidates=lock.rows.map((row,i)=>({...row,kind:'product_install_candidate',disposition:'materialized',schemaVersion,
 installId:`product-install://${row.packageName}/${row.packageVersion}/${row.productContentDigest.slice(7)}/${lock.lockDigest.slice(7)}`,
 installedRoot:join(D,'preflight-only',String(i)),resolvedLockId:lock.lockId,resolvedLockDigest:lock.lockDigest}));
const productSet=product.constructProductSet(candidates,lock);assert.equal(productSet.kind,'product_set');
const workspace=product.constructWorkspaceBinding(built.fixture.input.authority.workspaceAuthorityBasis,productSet,lock,prior.workspaceBinding.roots);
const publications=[...nativeFullSandboxPublications(gtl,verified[0],true),
 materializeD1Publication({gtl,identity:verified[1],publicationData:await read(join(D,'packages/construction/build/publication.json'))})];
const catalog=product.CatalogOperationPort.admit({kind:'catalog_admit_packet',schemaVersion,memberKey:'admit',readinessBasis:{workspaceBinding:workspace,
 resolvedLock:lock,verifiedProducts:verified,installedProducts:candidates,publications}});assert.equal(catalog.kind,'graph_function_catalog');
assert(catalog.rowDispositions.every(r=>r.disposition==='admitted'),JSON.stringify(catalog.rowDispositions.filter(r=>r.disposition!=='admitted')));
const publication=publications.at(-1),program=publication.programs[0];
const view=product.narrowGraphFunctionCatalog(catalog,catalog.entries.filter(r=>r.programMembershipRefs.includes(program.programRef)).map(r=>r.handle).sort());
const closure=product.resolveProgramDeclarationClosure(catalog,view,program.programRef);
assert.equal(closure.kind,'resolved_program_declaration_closure',JSON.stringify(closure.kind==='resolved_program_declaration_closure'?{kind:closure.kind}:closure));
const validation=validator.validateProgram(product.constructCatalogProgramValidationInput(catalog,view,closure,program));assert.equal(validation.kind,'program_validation',JSON.stringify(validation));
await writeFile(join(D,'valid-input.json'),JSON.stringify(built.fixture.input,null,2)+'\n',{flag:'wx'});
await writeFile(join(D,'candidate.json'),JSON.stringify(built.candidate,null,2)+'\n',{flag:'wx'});
const result={selectedDuty:built.selectedDuty,originalGrant:built.originalGrant,mode:'construction_only', status:'packaged_and_static_closure_verified',candidateArtifacts,packageMs,preflightMs:performance.now()-start-packageMs,
 programRef:program.programRef,catalogRows:catalog.entries.length,declarationClosure:closure.closureDigest,
 scope:'hypothetical install candidates test pure declaration closure; actual install, ABG admission and execution unproved'};
await writeFile(join(D,'package-result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
