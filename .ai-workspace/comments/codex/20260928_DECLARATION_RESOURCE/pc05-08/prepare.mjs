// PC05 Public setup caller; Root executes it with the latest genuine close receipt.
// One qualification caller over existing Product/admission owners; no Run is
// launched here. Original native44 history and worksite are retained in place.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat,symlink,realpath} from 'node:fs/promises';
import {join,resolve,basename,dirname} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {installedFullSandboxApis,fullSandboxSetupCalls,constructFullSandboxEnvironmentResources} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
import {materializeD1Publication} from '../../../../../build_tenants/odd_glc/typescript/test/d1-lifecycle-declarations.mjs';
import {nativeFullSandboxPublications} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-declarations.mjs';
import {constructCase,caseBasis} from './candidate.mjs';
import {isPreservedConstructionInput} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-runtime.mjs';
import {ids} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-contracts.mjs';
import {projectPreservedConstruction} from './source-reuse.mjs';

const [entryReceiptArgument,...extraArguments]=process.argv.slice(2);
assert(entryReceiptArgument&&extraArguments.length===0,'usage: prepare.mjs <latest-genuine-graphExecution-receipt.json>');
const entryReceiptPath=resolve(entryReceiptArgument);
const D=import.meta.dirname,repo=resolve(D,'../../../../..'),abi=resolve(repo,'../abiogenesis');
const base=join(abi,'.ai-workspace/comments/codex/20260926_CALCULUS_CROSSCUT');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const save=async(name,value)=>{const p=join(D,name);await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});};
const exec=promisify(execFile),schemaVersion='5.0.0',actorRef='actor://odd-glc/generic-lifecycle/owner@5';
const {core,configuration,configurationPath,coordinates}=await caseBasis();
const {product,gtl,abg,validator,installedPublic}=await installedFullSandboxApis(core.packageRoot);
const hash=product.sha256Canonical,coord=(ref,value={ref})=>({ref,digest:hash(value)});
const freezePath=join(D,'source-freeze.json'),freeze=await read(freezePath);
for(const row of [...freeze.files,...freeze.reusedUnchanged])assert.equal(await product.sha256File(join(repo,row.path)),row.sha256,row.path);
const entryReceipt=await read(entryReceiptPath),entryClose=entryReceipt.receipt?.resources?.eventResource?.closeHandoff;
assert(entryClose,'genuine completed CLI receipt with owner close handoff required');
assert.equal(entryClose.prefix.eventLogRef,coordinates.native44.prefix.eventLogRef);
assert.equal((await stat(new URL(entryClose.prefix.eventLogRef))).size,entryClose.prefix.prefixLength);
const prior=await read(join(D,'../pc05-07/execution/result.json'));
const priorAuthor=await read(join(D,'../pc05-04/execution/result.json'));
assert.deepEqual(entryClose,prior.closeHandoff,'continue the exact closed PC05-07 handoff');
const priorLaunch=await read(join(D,'../pc05-04/start.jsonl'));
const retainedPath=join(abi,'.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/pc05-evaluation-triage-01/retained-input.json');
const retainedInput=await read(retainedPath);
assert.equal(hash(retainedInput),'sha256:99c58acf6b87ae9dc8ca2fa49144e38217fe6040add0ee81b92b99d37c1142d2');
const expected=b=>Object.fromEntries(['ArtifactDigest','ProductContentDigest','ManifestDigest','ProductId','PackageName','PackageVersion'].map(k=>['expected'+k,b[k[0].toLowerCase()+k.slice(1)]]));
const setupStart=performance.now(),timings={packageMs:0,installMs:0,setupMs:0,sourceLookupMs:0};
const abiRequest={artifactPath:core.artifactPath,artifactRef:basename(core.artifactPath),...expected(core.basis)};
const abiVerification=await product.ProductVerificationPort.verify({kind:'product_verification_packet',schemaVersion,memberKey:'verify',targetKind:'packed_artifact',request:abiRequest});
assert.equal(abiVerification.kind,'product_verification_success');
const abiArtifact=abiVerification.verifiedArtifact,calls=[],state={ordinal:11000,closeHandoff:entryClose,product,abg,installedPublic};
const setup=fullSandboxSetupCalls({scratch:join(D,'setup'),abiArtifact,abiRequest,hash,coord,calls,state});
async function invoke(call,label){const started=performance.now();try{return await setup.invoke(call,label);}finally{
  await save('timings/'+label+'.json',{elapsedMs:performance.now()-started,definitionKey:call.invocation.definitionKey});}}
try{
  await setup.acquire();
  const selected=projectPreservedConstruction({product,abg,prefix:setup.prefix(),priorRun:priorAuthor.run,priorLaunch,retainedInput,
    constructionGraphFunctionRef:ids.constructionChildGraphFunctionRef});
  const {declarationProof,elapsedMs,...source}=selected;
  timings.sourceLookupMs=elapsedMs;
  await save('preserved-source.json',source);
  await save('source-projection-record.json',{historicalSelection:source.historicalSelection,sourceSelection:source.sourceSelection,
    nativeBasis:source.nativeBasis,sourceInput:source.sourceInput,elapsedMs,
    unchangedStateDigest:hash(source.constructionState),unchangedOriginalInputDigest:hash(source.originalInput),
    declarationProofDigest:hash(declarationProof),priorLaunchPath:join(D,'../pc05-04/start.jsonl'),
    limit:'Byte-bound reuse of the accepted PC05-05 historical selection; no repeated terminal projection. Existing suffix R10 authenticates history and native reacquisition checks currentness.'});
  const packageStart=performance.now();
  const packagedProcess=await exec(process.execPath,[...process.execArgv,join(D,'package.mjs')],
    {cwd:repo,env:process.env,timeout:120000,maxBuffer:2*1024*1024});
  await save('package.stdout',packagedProcess.stdout);await save('package.stderr',packagedProcess.stderr);
  timings.packageMs=performance.now()-packageStart;
  const built=await constructCase({product,gtl,artifact:{...core.basis,productManifestDigest:core.basis.manifestDigest},runEnvironment:configuration.runEnvironment});
  const packaged=await read(join(D,'package-result.json'));assert.deepEqual(core.basis,packaged.core.basis);
  assert.equal(hash(built.fixture.input),packaged.inputDigest);assert.equal(hash(configuration.runEnvironment),packaged.runEnvironmentDigest);
  const candidateArtifacts=packaged.candidateArtifacts,products=[];
  for(const [i,b]of [{artifactPath:core.artifactPath,basis:core.basis},...candidateArtifacts].entries()){
    const request={artifactPath:b.artifactPath,artifactRef:basename(b.artifactPath),...expected(b.basis)};
    const verification=i===0?abiVerification:await product.ProductVerificationPort.verify({kind:'product_verification_packet',schemaVersion,memberKey:'verify',targetKind:'packed_artifact',request});
    await save('verification-'+i+'.json',verification.kind==='product_verification_success'?{kind:verification.kind,coordinates:verification.coordinates}:verification);
    assert.equal(verification.kind,'product_verification_success');const v=verification.verifiedArtifact;
    products.push({request,verification,packed:{kind:'product_verification_artifact_resource',schemaVersion,artifactPath:request.artifactPath,
      artifact:{ref:v.artifactRef,digest:v.artifactDigest},productContent:{ref:'product-content://abiogenesis/'+v.productContentDigest.slice(7),digest:v.productContentDigest},
      descriptor:verification.coordinates.descriptor,contributionManifest:{ref:v.contributionManifestRef,digest:v.contributionManifestDigest},manifestDigest:v.manifestDigest,
      productId:v.productId,packageName:v.packageName,packageVersion:v.packageVersion}});
  }
  const verifiedProducts=products.map(p=>p.verification.verifiedArtifact);
  const resolvedLock=product.ProductEnvironmentPort.resolve({kind:'product_resolution_packet',schemaVersion,memberKey:'resolve',verifiedArtifacts:verifiedProducts});
  assert.equal(resolvedLock.kind,'resolved_product_lock');const lock={ref:resolvedLock.lockId,digest:resolvedLock.lockDigest};
  for(const [i,item]of products.entries()){
    const v=item.verification.verifiedArtifact;
    const call=await setup.authorized(product.PRODUCT_VERIFICATION_SOURCE_DECLARATIONS.verify,
      {targetKind:'packed_artifact',artifact:item.packed.artifact,productContent:item.packed.productContent,descriptor:item.packed.descriptor,
        contributionManifest:item.packed.contributionManifest,declaredDependencies:v.declaredDependencies,
        compatibilityInputs:v.compatibilityRefs.map(compatibilityRef=>({compatibilityRef,subjectRef:item.packed.productContent.ref}))},
      {kind:'product_verification_resources',schemaVersion,targetKind:'packed_artifact',packedArtifact:item.packed,verifiedArtifact:v});
    item.receipt=await invoke(call,'verify-'+i);
    item.reference={invocation:{ref:call.invocation.invocationRef,digest:call.invocation.invocationDigest},outcome:item.receipt.ownerOutput.value.verifiedArtifact};
  }
  const resolved=await invoke(await setup.authorized(product.PRODUCT_ENVIRONMENT_SOURCE_DECLARATIONS.resolve,
    {requirements:verifiedProducts.map(p=>({productId:p.productId,packageVersion:p.packageVersion,requiredContractRefs:[],requiredCapabilityRefs:[]})),verifiedCandidates:products.map(p=>p.reference)},
    {kind:'product_resolution_resource_assertion',schemaVersion,verifiedPreimages:products.map(p=>({verification:p.reference,verifiedArtifact:p.verification.verifiedArtifact,verificationOutput:p.receipt.ownerOutput})),
      nativeContractClosure:{selectorDispositions:[],occurrences:[],nativeBindings:[]}},
    {verification_references:products.map(p=>p.reference)}),'resolve');
  assert.deepEqual(resolved.ownerOutput.value.resolvedLock,lock);
  const installed=[],actor={actor:coord(actorRef),attribution:coord('attribution://odd-glc/program-construction-qualification')};
  const targets=['core49','construction','evaluator'].map(n=>join(D,'products',n));
  const installStart=performance.now();
  for(const [i,item]of products.entries()){
    const call=await setup.authorized(product.PRODUCT_INSTALL_SOURCE_DECLARATIONS.install,
      {verifiedArtifact:item.verification.coordinates.verifiedArtifact,descriptor:item.packed.descriptor,contributionManifest:item.packed.contributionManifest,
        resolvedLock:lock,targetRoot:targets[i],installPolicy:'clean'},
      {kind:'product_install_resource_assertion',schemaVersion,eventResource:setup.reopen(),packedArtifact:item.packed,verifiedArtifact:item.verification.verifiedArtifact,resolvedLock},
      {dependency_lock:lock,verification_references:[item.reference],actor});
    await invoke(call,'install-'+i);
    const row=abg.projectAdmittedProductInstallByInvocationRef(abg.projectExactPrefixArtifactTruth(setup.prefix()),call.invocation.invocationRef);
    assert(row);installed.push(row);
  }
  timings.installMs=performance.now()-installStart;
  const installs=installed.map(r=>r.install),installCoordinates=installs.map(product.productInstallCoordinate);
  const materialize=async(i)=>materializeD1Publication({gtl,identity:verifiedProducts[i],publicationData:await read(join(installs[i].installedRoot,'build/publication.json'))});
  const publication=await materialize(1),evaluatorPublication=await materialize(2);
  const publications=[...nativeFullSandboxPublications(gtl,abiArtifact,true),publication,evaluatorPublication];
  // Ordinary Node dependency binding is outside every admitted Product payload.
  const dependencyLink=join(D,'products/node_modules/@abiogenesis/typescript-tenant');
  await mkdir(dirname(dependencyLink),{recursive:true});await symlink(installs[0].installedRoot,dependencyLink,'dir');
  assert.equal(await realpath(dependencyLink),await realpath(installs[0].installedRoot));
  // Fresh process: no component loader or inherited NODE_OPTIONS can stand in for
  // resolution and descriptor loading from the actual admitted installations.
  const descriptorStarted=performance.now();
  const descriptorProcess=exec(process.execPath,['--input-type=module','-e',String.raw`
import assert from 'node:assert/strict';
import {readFile,realpath} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
let body='';for await(const chunk of process.stdin)body+=chunk;
const {installs,publications}=JSON.parse(body),core=installs[0].installedRoot;
assert.equal(process.env.NODE_OPTIONS,'');
assert(!process.execArgv.some(a=>a==='--loader'||a==='--experimental-loader'||a.startsWith('--loader=')||a.startsWith('--experimental-loader=')));
const pkg=JSON.parse(await readFile(join(core,'package.json'),'utf8'));
const expected=await realpath(join(core,pkg.exports['./product'].import));
const actual=await realpath(fileURLToPath(import.meta.resolve('@abiogenesis/typescript-tenant/product')));assert.equal(actual,expected);
const product=await import(pathToFileURL(expected).href),rows=[];
for(const [index,publication]of publications.entries()){
 const install=installs[index+1],result=await product.loadInstalledImplementationDescriptors(install,publication);
 assert(Array.isArray(result),JSON.stringify(result));
 for(const binding of publication.implementationBindings)assert.equal(result.filter(d=>d.implementationRef===binding.implementationRef&&d.namedSymbol===binding.namedSymbol).length,1);
 rows.push({installId:install.installId,installedRoot:install.installedRoot,moduleRef:publication.moduleRef,descriptors:result.length});
}
console.log(JSON.stringify({kind:'fresh_installed_descriptor_check',actualProductResolution:actual,rows}));
`],{cwd:join(D,'products'),env:{...process.env,NODE_OPTIONS:''},timeout:60000,maxBuffer:1024*1024});
  descriptorProcess.child.stdin.end(JSON.stringify({installs,publications:[publication,evaluatorPublication]}));
  const descriptorCheck=JSON.parse((await descriptorProcess).stdout);
  timings.installedDescriptorMs=performance.now()-descriptorStarted;
  await save('installed-descriptor-check.json',{...descriptorCheck,dependencyLink,target:installs[0].installedRoot,elapsedMs:timings.installedDescriptorMs});
  const workspaceAuthority=built.fixture.input.authority.workspaceAuthorityBasis;
  assert.equal(workspaceAuthority.canonicalRoot,coordinates.workspaceRoot);
  const workspaceManifest=await read(join(coordinates.workspaceRoot,'.abiogenesis/workspace-manifest.json'));
  const roots={eventLogRoot:dirname(new URL(coordinates.native44.prefix.eventLogRef).pathname),toolchainRoot:targets[0],productRoot:installs[1].installedRoot,
    runtimeStateRoot:join(D,'invocation/runtime'),projectionRoot:join(D,'invocation/projections'),archiveRoot:join(D,'invocation/archives')};
  const rootFields={toolchain:'toolchainRoot',product:'productRoot',event_log:'eventLogRoot',runtime_state:'runtimeStateRoot',projection:'projectionRoot',archive:'archiveRoot'};
  const bound=await invoke(await setup.authorized(product.PRODUCT_ENVIRONMENT_SOURCE_DECLARATIONS.bind,
    {workspaceAuthority:{ref:workspaceAuthority.authorityBasisId,digest:workspaceAuthority.authorityBasisDigest},installedSet:installCoordinates,resolvedLock:lock,
      declaredRoots:Object.entries(rootFields).map(([rootKind,field])=>({rootKind,path:roots[field]}))},
    {kind:'product_workspace_binding_resource_assertion',schemaVersion,eventResource:setup.reopen(),workspaceAuthority,workspaceManifest,
      admittedInstalls:installs,resolvedLock,declaredRoots:roots},{product_set:installCoordinates,dependency_lock:lock,actor}),'bind');
  const binding=bound.ownerOutput.value.binding,boundSlots={workspace_binding:binding,product_set:installCoordinates,dependency_lock:lock,actor};
  const environment=abg.projectExactPrefixWorkspaceEnvironment(setup.prefix(),binding);assert.equal(environment.kind,'exact_prefix_workspace_environment');
  const admitted=await invoke(await setup.authorized(product.CATALOG_OPERATION_SOURCE_DECLARATIONS.admit,
    {workspaceBinding:binding,descriptors:products.map(p=>p.packed.descriptor),contributionManifests:products.map(p=>p.packed.contributionManifest),resolvedLock:lock},
    {kind:'catalog_admission_resource_assertion',schemaVersion,eventResource:setup.reopen(),workspaceBinding:environment.workspaceBinding,resolvedLock,verifiedProducts,admittedInstalls:installs,publications},boundSlots),'catalog');
  const catalog=product.CatalogOperationPort.admit({kind:'catalog_admit_packet',schemaVersion,memberKey:'admit',readinessBasis:{workspaceBinding:environment.workspaceBindingCandidate,
    resolvedLock,verifiedProducts,installedProducts:installed.map(r=>r.candidate),publications}});assert.equal(catalog.kind,'graph_function_catalog');
  const program=publication.programs[0],allowlist=catalog.entries.filter(r=>r.programMembershipRefs.includes(program.programRef)).map(r=>r.handle).sort();
  const catalogView=product.narrowGraphFunctionCatalog(catalog,allowlist);
  const view=await invoke(await setup.authorized(product.CATALOG_OPERATION_SOURCE_DECLARATIONS.view.allowlist,
    {catalog:admitted.ownerOutput.value.catalog,allowlist},{kind:'catalog_view_resource_assertion',schemaVersion,catalog},boundSlots),'view');
  const catalogScope={catalog:admitted.ownerOutput.value.catalog,view:view.ownerOutput.value.view,allowlist:catalogView.allowlist};
  const law=coord('law://abiogenesis/validator/gtl-program@5');
  const checked=await invoke(await setup.authorized(validator.CONFORMANCE_OPERATION_CONTRACTS.evaluate.gtl_program,
    {program:coord(program.programRef,program),conformanceLaw:law,inventoryBasis:{kind:'declared_inventory',inventory:catalog.boundPublications.map(p=>coord(p.moduleRef,p)).sort((a,b)=>a.ref.localeCompare(b.ref))}},
    {kind:'conformance_evaluation_resource_assertion',schemaVersion,packet:{kind:'conformance_evaluate_packet',schemaVersion,memberKey:'gtl_program',publication,program},
      conformanceLaw:law,declaredInventory:catalog.boundPublications,declarationCatalog:{catalog,catalogView}},boundSlots),'conformance');
  assert.equal(checked.ownerOutput.value.disposition,'passed');
  const resolution=await product.ProductExecutionResolutionPort.resolve({catalog,catalogView,admittedInstalls:environment.productInstalls,
    verifyInstallAdmission:i=>abg.hasAdmittedProductInstall(environment.artifactTruth,i),programRef:program.programRef,
    selection:{kind:'start',scope:'program',target:'next',until:'converged',rootMode:'direct'}});
  await save('execution-resolution.json',resolution.kind==='loaded_product_execution_resolution'?{kind:resolution.kind,resolution:resolution.resolution}:resolution);
  assert.equal(resolution.kind,'loaded_product_execution_resolution');
  const originalBinding=source.originalInput.authority.workspaceBinding;
  const beforeBinding={ref:originalBinding.bindingId,digest:originalBinding.bindingDigest};
  const exactChild=source.nativeBasis,witnessContract=abg.WITNESS_CONTENT_CONTRACTS.reprice;
  const witness=await invoke(await setup.authorized(abg.WITNESS_OPERATION_CONTRACTS.admit.reprice,
    {subjectKind:'authority_basis',subject:exactChild,act:'reprice',content:{kind:'typed_payload',contentContract:{ref:witnessContract.ref,digest:witnessContract.digest},value:{
      declarationRef:beforeBinding.ref,beforeDigest:beforeBinding.digest,afterDigest:binding.digest,changeClass:'realization_refactor',owningTicketRef:'ticket://odd-glc/T-043',
      reason:'Preserve the admitted PC05 constructor and every original residual. Rebind its exact native child to the declared current evaluation and independent assessment suffix over unchanged full worksite content. No new author or command execution, no historical rewrite or original-task closure.'}},
      context:{kind:'basis',basis:exactChild},evidence:[beforeBinding,binding],provenance:[exactChild]},
    {kind:'witness_reprice_resource_assertion',schemaVersion,eventResource:setup.reopen()},boundSlots),'native-child-binding-cover');
  const packet=product.RUN_OPERATION_CONTRACTS.invoke.start;
  const policy=product.constructRootInvocationPolicy(environment.workspaceBinding,program,[],['F_D','F_P'],[]);
  const grantBasis={admittedInstalls:environment.productInstalls,workspaceBinding:environment.workspaceBinding,fixedPacket:packet};
  const grants=[product.constructCapabilityGrant(policy,actorRef,'abg.operation.run.invoke',product.DIRECT_INVOKE_CAPABILITY,grantBasis)];
  const authority=product.constructInvocationAuthority(actorRef,environment.workspaceBinding,catalogView,program.programRef,resolution.selectedCatalogEntry,policy,grants,grantBasis);
  const oldContext=built.fixture.input.currentContext;
  const currentContext=await product.observeWorksiteContext({workspaceAuthorityBasis:workspaceAuthority,workspaceBinding:environment.workspaceBinding,
    readRoots:oldContext.readRoots,maxFiles:oldContext.maxFiles,maxBytes:oldContext.maxBytes});
  const rebound=await constructCase({product,gtl,artifact:{...core.basis,productManifestDigest:core.basis.manifestDigest},
    runEnvironment:configuration.runEnvironment,currentContext,
    authority:{workspaceAuthorityBasis:workspaceAuthority,workspaceBinding:environment.workspaceBinding,capabilityGrant:grants[0]}});
  assert.deepEqual(currentContext.entries,oldContext.entries,'complete native44 context unchanged');
  assert.deepEqual(currentContext.readRoots,oldContext.readRoots);
  assert.equal(currentContext.maxFiles,oldContext.maxFiles);assert.equal(currentContext.maxBytes,oldContext.maxBytes);
  assert.equal(rebound.candidate.publication.programs[0].programRef,built.candidate.publication.programs[0].programRef);
  const input=rebound.fixture.input;assert(isPreservedConstructionInput(input));
  assert.equal(input.originalInput.model.bindingRefs.length,15);assert.equal(input.originalInput.model.duties.length,38);
  assert.equal(input.originalInput.assessment.recordSelections.length,15);
  assert.deepEqual(input.originalInput,source.originalInput);assert.deepEqual(input.constructionState,source.constructionState);
  assert.deepEqual(freeze.selectedWriteRoots,[]);
  assert.deepEqual(configuration.transport,packaged.transport);
  assert(!program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.graphFunctionRef));
  assert(program.callableMembership.includes(product.NATIVE_WORKSPACE_WORK_IDS.assessmentGraphFunctionRef));
  assert(program.callableMembership.includes(input.evaluator.graphFunction.ref));
  assert(!program.callableMembership.includes(product.WORKSITE_COMMAND_EXECUTION_IDS.graphFunctionRef));
  const root=publication.graphFunctions.find(g=>g.name===program.starts[0].graphFunctionRef);
  assert.deepEqual(root.template.nodes.map(n=>n.term.graphFunctionRef),freeze.expectedRootCalls);
  const temporaryRoot=join(roots.archiveRoot,'run-environment-access');await mkdir(temporaryRoot,{recursive:true});
  const runEnvironmentResources=constructFullSandboxEnvironmentResources({product,declaration:configuration.runEnvironment,
    configuration:configuration.runEnvironmentResources,authority,program,temporaryRoot});
  const historicalSource={kind:'abg_historical_graph_call_source_resource',schemaVersion,terminal:input.historicalSelection,
    input:source.sourceInput,declarationProof};
  const carrier={contract:{ref:resolution.resolution.inputContract.contractRef,digest:resolution.resolution.inputContractDigest},
    valueRef:'value://odd-glc/T-043/pc05-preserved-construction/evaluation-assessment@5',valueDigest:hash(input),value:input};
  await setup.close();const eventResource=setup.reopen(),steering=hash(eventResource);
  const slots={graph_function:null,verification_references:null,execution_basis:null,workspace_binding:binding,product_set:installs.map(i=>({ref:i.installId,digest:i.productContentDigest})),
    dependency_lock:lock,catalog_scope:catalogScope,execution_program:{ref:program.programRef,digest:resolution.resolution.programDigest},input_contract:carrier,
    session_policy:{ref:policy.policyRef,digest:policy.policyDigest},capability_grants:{requiredCapabilityRefs:[...packet.metadata.capabilityRefs],grants:grants.map(g=>({ref:g.grantRef,digest:g.grantDigest}))},
    actor:{actor:coord(actorRef,{actorRef}),attribution:{ref:authority.authorityRef,digest:authority.authorityDigest}},transport_steering:{ref:'transport-steering://abiogenesis/'+steering.slice(7),digest:steering}};
  const request={program:slots.execution_program,scope:'program',target:{kind:'next'},until:'converged',catalogView:catalogScope.view,allowlist,input:carrier,
    fhMode:'direct',rootMode:'direct',sourceBasis:{kind:'none'}};
  const resources={kind:'run_invocation_resource_assertion',schemaVersion,catalog,catalogView,applications:[],applicationResources:[],source:{kind:'none'},historicalSource,eventResource,runEnvironmentResources};
  const call=setup.call(packet,request,slots,resources);
  await writeFile(join(D,'start.jsonl'),JSON.stringify({kind:'abg_cli_transport_request',schemaVersion,acquisition:{kind:'reopen',closeHandoff:state.closeHandoff},invocation:call})+'\n',{flag:'wx'});
  await save('run-environment.json',configuration.runEnvironment);
  timings.setupMs=performance.now()-setupStart-timings.installMs-timings.packageMs;await save('setup-receipt.json',{...timings,calls,closeHandoff:state.closeHandoff,witness:witness.ownerOutput,entryPrefix:entryClose.prefix,setupAppendedBytes:state.closeHandoff.prefix.prefixLength-entryClose.prefix.prefixLength,configuration:{path:configurationPath,digest:await product.sha256File(configurationPath)},entryReceipt:{path:entryReceiptPath,digest:await product.sha256File(entryReceiptPath)},transport:configuration.transport,packageTimingLimitation:packaged.timingLimitation??null});
  await save('activation-pending-review.json',{kind:'reviewed_program_construction_activation',coreRoot:installs[0].installedRoot,cliPath:join(installs[0].installedRoot,'build/code/src/public/cli.js'),
    sourceFreeze:{path:freezePath,digest:await product.sha256File(freezePath)},mode:'preserved_construction_evaluation_assessment',constructionReview:null,evaluatorReview:null,
    launchPath:join(D,'start.jsonl'),launchDigest:await product.sha256File(join(D,'start.jsonl')),
    environment:{workspaceAuthorityBasis:environment.workspaceAuthorityBasis,workspaceBinding:environment.workspaceBinding,productInstalls:environment.productInstalls},abiArtifact,
    preservedPrefix:coordinates.native44.prefix,setupReceiptPath:join(D,'setup-receipt.json'),
    expectation:'preserved_construction_evaluation_assessment',outputRoot:join(D,'execution'),timeoutMs:configuration.transport.wholeRunMs,transport:configuration.transport});
  await save('prepared.json',{status:'prepared_not_launched',sourceFreeze:await product.sha256File(freezePath),program:slots.execution_program,
    prefix:state.closeHandoff.prefix,sourceSelection:{prefix:source.sourceSelection.prefix,graphCallRef:source.sourceSelection.graphCallRef},timings,calls,
    packages:products.map(p=>p.verification.coordinates),inputDigest:carrier.valueDigest,launchPath:join(D,'start.jsonl'),launchDigest:await product.sha256File(join(D,'start.jsonl')),
    sourceFreezePath:freezePath,reboundInputDigest:hash(input),dutyCount:input.originalInput.model.duties.length,bindingCount:input.originalInput.model.bindingRefs.length,carriedDutyRefs:rebound.candidate.selection.carriedDutyRefs,carriedBindingRefs:rebound.candidate.selection.carriedBindingRefs,
    runEnvironmentDigest:hash(configuration.runEnvironment),runEnvironmentResourcesDigest:hash(runEnvironmentResources),originalTaskCompletion:'not_claimed',s06Closure:'not_claimed'});
  console.log(JSON.stringify({status:'prepared_not_launched',programRef:program.programRef,timings,calls:calls.length,prefix:state.closeHandoff.prefix}));
}catch(error){await save('first-cause.json',{message:error.message,stack:error.stack,calls});throw error;}
finally{await setup.close();}
