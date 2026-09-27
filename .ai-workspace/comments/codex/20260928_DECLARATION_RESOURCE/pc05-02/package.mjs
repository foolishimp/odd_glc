// Actual package/verification and one pure declaration conformance. No install or journal.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,symlink} from 'node:fs/promises';
import {join,resolve,basename} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {installedFullSandboxApis} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
import {nativeFullSandboxPublications} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-declarations.mjs';
import {materializeD1Publication} from '../../../../../build_tenants/odd_glc/typescript/test/d1-lifecycle-declarations.mjs';
import {packageEvaluator} from '../../../../../build_tenants/odd_glc/typescript/test/fixtures/program-construction/package-evaluator.mjs';
import {fixtureIds} from '../../../../../build_tenants/odd_glc/typescript/test/fixtures/program-construction/native-records-evaluator.mjs';
import {buildProgramConstructionProduct} from '../../../../../build_tenants/odd_glc/typescript/scripts/build-native-continuation-product.mjs';
import {constructCase,caseBasis} from './candidate.mjs';

const D=import.meta.dirname,repo=resolve(D,'../../../../..'),read=async p=>JSON.parse(await readFile(p,'utf8'));
const save=(name,value)=>writeFile(join(D,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const exec=promisify(execFile),started=performance.now(),timings={};
const {core,configuration,sourceSelection}=await caseBasis();
timings.caseBasisMs=performance.now()-started;
let phaseStarted=performance.now();
const {product,gtl,validator}=await installedFullSandboxApis(core.packageRoot),schemaVersion='5.0.0';
const artifact={...core.basis,productManifestDigest:core.basis.manifestDigest};
const built=await constructCase({product,gtl,artifact,sourceSelection,runEnvironment:configuration.runEnvironment});
assert.equal(built.candidate.kind,'candidate');
timings.caseConstructionMs=performance.now()-phaseStarted;phaseStarted=performance.now();
const evaluatorDependency={kind:'requires',productId:fixtureIds.productId,packageVersion:fixtureIds.packageVersion,
  compatibilityRef:'compatibility://abiogenesis/major/5',requiredContractRefs:[],requiredCapabilityRefs:[]};
await mkdir(join(D,'packages'));await mkdir(join(D,'artifacts'));
await packageEvaluator({coreRoot:core.packageRoot,outputRoot:join(D,'packages/evaluator')});
await buildProgramConstructionProduct({coreRoot:core.packageRoot,publication:built.candidate.publication,
  dependencies:[evaluatorDependency],outputRoot:join(D,'packages/construction')});
timings.payloadGenerationMs=performance.now()-phaseStarted;
timings.archivePackMs={};
const candidateArtifacts=[];
for(const name of ['construction','evaluator']) {
  phaseStarted=performance.now();
  const root=join(D,'packages',name),packed=await exec('npm',['pack','--ignore-scripts','--json','--pack-destination',join(D,'artifacts')],
    {cwd:root,env:{...process.env,npm_config_cache:join(D,'npm-cache'),npm_config_update_notifier:'false',npm_config_logs_max:'0'},timeout:60000,maxBuffer:1024*1024});
  const rows=JSON.parse(packed.stdout);assert.equal(rows.length,1);
  const manifest=await read(join(root,'product-toolchain-manifest.json')),artifactPath=join(D,'artifacts',rows[0].filename);
  candidateArtifacts.push({name,artifactPath,basis:{artifactDigest:await product.sha256File(artifactPath),productContentDigest:manifest.productContentDigest,
    manifestDigest:product.sha256Canonical(manifest),productId:manifest.productId,packageName:manifest.packageName,packageVersion:manifest.packageVersion},
    bytes:rows[0].size,payloadBytes:rows[0].unpackedSize});
  timings.archivePackMs[name]=performance.now()-phaseStarted;
}
timings.packageMs=performance.now()-started;
let at=performance.now();const verified=[];timings.archiveVerificationMs=[];
for(const a of [{artifactPath:core.artifactPath,basis:core.basis},...candidateArtifacts]) {
  phaseStarted=performance.now();
  const request={artifactPath:a.artifactPath,artifactRef:basename(a.artifactPath),...Object.fromEntries(Object.entries(a.basis).map(([k,v])=>['expected'+k[0].toUpperCase()+k.slice(1),v]))};
  const result=await product.ProductVerificationPort.verify({kind:'product_verification_packet',schemaVersion,memberKey:'verify',targetKind:'packed_artifact',request});
  assert.equal(result.kind,'product_verification_success',JSON.stringify(result));verified.push(result.verifiedArtifact);
  timings.archiveVerificationMs.push({artifactPath:a.artifactPath,elapsedMs:performance.now()-phaseStarted});
}
timings.verificationMs=performance.now()-at;at=performance.now();
const lock=product.ProductEnvironmentPort.resolve({kind:'product_resolution_packet',schemaVersion,memberKey:'resolve',verifiedArtifacts:verified});
assert.equal(lock.kind,'resolved_product_lock',JSON.stringify(lock));assert.equal(lock.rows.length,3);
// Hypothetical pure readiness inputs only; never effects, admissions or launch resources.
const candidates=lock.rows.map((row,i)=>({...row,kind:'product_install_candidate',disposition:'materialized',schemaVersion,
  installId:`product-install://${row.packageName}/${row.packageVersion}/${row.productContentDigest.slice(7)}/${lock.lockDigest.slice(7)}`,
  installedRoot:join(D,'preflight-only',String(i)),resolvedLockId:lock.lockId,resolvedLockDigest:lock.lockDigest}));
const set=product.constructProductSet(candidates,lock);assert.equal(set.kind,'product_set');
const prior=(await read(join(D,'../../20260927_PROGRAM_CONSTRUCTION/installed-02/setup/calls/08-catalog.json'))).resources;
const workspace=product.constructWorkspaceBinding(built.fixture.input.authority.workspaceAuthorityBasis,set,lock,prior.workspaceBinding.roots);
const construction=materializeD1Publication({gtl,identity:verified[1],publicationData:await read(join(D,'packages/construction/build/publication.json'))});
const evaluator=materializeD1Publication({gtl,identity:verified[2],publicationData:await read(join(D,'packages/evaluator/build/publication.json'))});
const publications=[...nativeFullSandboxPublications(gtl,verified[0],true),construction,evaluator];
const catalog=product.CatalogOperationPort.admit({kind:'catalog_admit_packet',schemaVersion,memberKey:'admit',readinessBasis:{workspaceBinding:workspace,
  resolvedLock:lock,verifiedProducts:verified,installedProducts:candidates,publications}});
assert.equal(catalog.kind,'graph_function_catalog',JSON.stringify(catalog.kind==='graph_function_catalog'?{}:catalog));
assert(catalog.rowDispositions.every(r=>r.disposition==='admitted'),JSON.stringify(catalog.rowDispositions.filter(r=>r.disposition!=='admitted')));
const program=construction.programs[0],view=product.narrowGraphFunctionCatalog(catalog,catalog.entries.filter(r=>r.programMembershipRefs.includes(program.programRef)).map(r=>r.handle).sort());
const closure=product.resolveProgramDeclarationClosure(catalog,view,program.programRef);assert.equal(closure.kind,'resolved_program_declaration_closure');
const validation=validator.validateProgram(product.constructCatalogProgramValidationInput(catalog,view,closure,program));
assert.equal(validation.kind,'program_validation',JSON.stringify(validation));timings.pureConformanceMs=performance.now()-at;
await save('package-preflight.json',{candidateArtifacts,timings,programRef:program.programRef,declarationClosure:closure.closureDigest,
  catalogRows:catalog.entries.length,verification:'three actual archives verified',validation:validation.kind});

// External ordinary Node linkage for generated package inspection only. This
// does not install a Product; prepare.mjs separately links/checks actual installs.
const link=join(D,'packages/node_modules/@abiogenesis/typescript-tenant');await mkdir(join(D,'packages/node_modules/@abiogenesis'),{recursive:true});
await symlink(core.packageRoot,link,'dir');at=performance.now();
const descriptorCheck=await exec(process.execPath,['--input-type=module','-e',String.raw`
import assert from 'node:assert/strict';
import {readFile,realpath} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const [core,...roots]=process.argv.slice(1),read=async p=>JSON.parse(await readFile(p,'utf8'));
assert(!process.execArgv.some(a=>a==='--loader'||a==='--experimental-loader'||a.startsWith('--loader=')||a.startsWith('--experimental-loader=')));assert.equal(process.env.NODE_OPTIONS,'');
const pkg=await read(join(core,'package.json')),relative=pkg.exports['./product'].import;
const expected=await realpath(join(core,relative)),product=await import(pathToFileURL(expected).href),results=[];
for(const root of roots){
 const resolved=await realpath(fileURLToPath(import.meta.resolve('@abiogenesis/typescript-tenant/product')));
 assert.equal(resolved,expected,'fresh package process resolves selected core');
 const publication=await read(join(root,'build/publication.json')),descriptors=[];
 for(const path of new Set(publication.implementationBindings.map(b=>b.modulePath))){
  const module=await import(pathToFileURL(join(root,path)).href);descriptors.push(...Object.values(module).filter(product.isPackagedLeafImplementationDescriptor));
  for(const binding of publication.implementationBindings.filter(b=>b.modulePath===path))assert.equal(typeof module[binding.namedSymbol],'function');
 }
 for(const binding of publication.implementationBindings)assert.equal(descriptors.filter(d=>d.implementationRef===binding.implementationRef&&d.namedSymbol===binding.namedSymbol).length,1);
 results.push({root,productResolution:resolved,descriptors:descriptors.length});
}
console.log(JSON.stringify({scope:'fresh generated-package descriptor check; no admitted installation',results}));
`,core.packageRoot,join(D,'packages/construction'),join(D,'packages/evaluator')],{env:{...process.env,NODE_OPTIONS:''},cwd:join(D,'packages'),timeout:60000,maxBuffer:1024*1024});
timings.freshPackageDescriptorMs=performance.now()-at;
await save('package-descriptors.json',JSON.parse(descriptorCheck.stdout));
await save('package-result.json',{status:'three_products_verified_pure_conformance_passed_no_install',mode:'construction_evaluation_assessment',core,
  candidateArtifacts,evaluatorDependency,timings,packageMs:timings.packageMs,preflightMs:timings.verificationMs+timings.pureConformanceMs+timings.freshPackageDescriptorMs,
  programRef:program.programRef,declarationClosure:closure.closureDigest,catalogRows:catalog.entries.length,
  inputDigest:product.sha256Canonical(built.fixture.input),interpretation:built.fixture.input.model.interpretation,
  contextDigest:product.sha256Canonical(built.fixture.input.currentContext),runEnvironmentDigest:product.sha256Canonical(configuration.runEnvironment),
  transport:configuration.transport,originalGrant:built.originalGrant,selectedWriteRoots:built.fixture.input.constructionGroups[0].writeRoots,
  scope:'Actual archives verified; hypothetical candidate set used once for pure declaration conformance. Public setup, actual installs, admitted descriptor checks and Run are pending.'});
console.log(JSON.stringify({status:'packaged_case_no_install',candidateArtifacts,timings,totalMs:performance.now()-started}));
