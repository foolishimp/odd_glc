// Reuse the retained PC02 preparation through the repaired installed owners.
// One qualification caller over existing Product/admission owners; no Run is
// launched here. Original native44 history and worksite are retained in place.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {join,resolve,basename,dirname} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {installedFullSandboxApis,fullSandboxSetupCalls,constructFullSandboxEnvironmentResources} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
import {materializeD1Publication} from '../../../../../build_tenants/odd_glc/typescript/test/d1-lifecycle-declarations.mjs';
import {nativeFullSandboxPublications} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-declarations.mjs';
import {constructCase,caseBasis} from './candidate.mjs';
import {isNativeConstructionInput} from '../../../../../build_tenants/odd_glc/typescript/src/program-construction-runtime.mjs';
import {checkInstalledConstructionTopology} from '../../../../../build_tenants/odd_glc/typescript/test/abi5-installed-program-construction.test.mjs';
import {buildProgramConstructionProduct} from '../../../../../build_tenants/odd_glc/typescript/scripts/build-native-continuation-product.mjs';

const D=import.meta.dirname,repo=resolve(D,'../../../../..'),abi=resolve(repo,'../abiogenesis');
const base=join(abi,'.ai-workspace/comments/codex/20260926_CALCULUS_CROSSCUT');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const save=async(name,value)=>{const p=join(D,name);await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});};
const exec=promisify(execFile),schemaVersion='5.0.0',actorRef='actor://odd-glc/generic-lifecycle/owner@5';
const {core,configuration,configurationPath,sourceOwner,sourceLaunch,coordinates,proof,constructorProof,sourceSelection}=await caseBasis();
const {product,gtl,abg,validator,installedPublic}=await installedFullSandboxApis(core.packageRoot);
const hash=product.sha256Canonical,coord=(ref,value={ref})=>({ref,digest:hash(value)});
const freezePath=join(D,'source-freeze.json'),freeze=await read(freezePath);
for(const row of [...freeze.files,...freeze.reusedUnchanged])assert.equal(await product.sha256File(join(repo,row.path)),row.sha256,row.path);
const entryClose=(await read(join(D,'../../20260927_PROGRAM_CONSTRUCTION/pc02-installed-02/negative/graphExecution.json'))).receipt.resources.eventResource.closeHandoff;
assert.equal(entryClose.prefix.prefixLength,991116806);
assert.equal((await stat(new URL(entryClose.prefix.eventLogRef))).size,entryClose.prefix.prefixLength);
const built=await constructCase({product,gtl,artifact:{...core.basis,productManifestDigest:core.basis.manifestDigest},sourceSelection,runEnvironment:configuration.runEnvironment});
const packaged=await read(join(D,'package-result.json'));
const candidateArtifacts=packaged.candidateArtifacts;
const timings={packageMs:packaged.packageMs,installMs:0,setupMs:0,sourceLookupMs:sourceOwner.elapsedMs};
const expected=b=>Object.fromEntries(['ArtifactDigest','ProductContentDigest','ManifestDigest','ProductId','PackageName','PackageVersion'].map(k=>['expected'+k,b[k[0].toLowerCase()+k.slice(1)]]));
const setupStart=performance.now(),products=[];
for(const [i,b]of [{artifactPath:core.artifactPath,basis:core.basis},...candidateArtifacts].entries()){
  const request={artifactPath:b.artifactPath,artifactRef:basename(b.artifactPath),...expected(b.basis)};
  const verification=await product.ProductVerificationPort.verify({kind:'product_verification_packet',schemaVersion,memberKey:'verify',targetKind:'packed_artifact',request});
  await save('verification-'+i+'.json',verification.kind==='product_verification_success'?{kind:verification.kind,coordinates:verification.coordinates}:verification);
  assert.equal(verification.kind,'product_verification_success');const v=verification.verifiedArtifact;
  products.push({request,verification,packed:{kind:'product_verification_artifact_resource',schemaVersion,artifactPath:request.artifactPath,
    artifact:{ref:v.artifactRef,digest:v.artifactDigest},productContent:{ref:'product-content://abiogenesis/'+v.productContentDigest.slice(7),digest:v.productContentDigest},
    descriptor:verification.coordinates.descriptor,contributionManifest:{ref:v.contributionManifestRef,digest:v.contributionManifestDigest},manifestDigest:v.manifestDigest,
    productId:v.productId,packageName:v.packageName,packageVersion:v.packageVersion}});
}
const abiArtifact=products[0].verification.verifiedArtifact,abiRequest=products[0].request,verifiedProducts=products.map(p=>p.verification.verifiedArtifact);
const resolvedLock=product.ProductEnvironmentPort.resolve({kind:'product_resolution_packet',schemaVersion,memberKey:'resolve',verifiedArtifacts:verifiedProducts});
assert.equal(resolvedLock.kind,'resolved_product_lock');const lock={ref:resolvedLock.lockId,digest:resolvedLock.lockDigest};
const calls=[],state={ordinal:8000,closeHandoff:entryClose,product,abg,installedPublic};
const setup=fullSandboxSetupCalls({scratch:join(D,'setup'),abiArtifact,abiRequest,hash,coord,calls,state});
async function invoke(call,label){const started=performance.now();try{return await setup.invoke(call,label);}finally{
  await save('timings/'+label+'.json',{elapsedMs:performance.now()-started,definitionKey:call.invocation.definitionKey});}}
try{
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
  await setup.acquire();
  const installed=[],actor={actor:coord(actorRef),attribution:coord('attribution://odd-glc/program-construction-qualification')};
  const targets=['core47','construction'].map(n=>join(D,'products',n));
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
  const publication=await materialize(1);
  const publications=[...nativeFullSandboxPublications(gtl,abiArtifact,true),publication];
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
  const priorCover=await read(join(base,'native44/witness-01/result.json'));
  const exactChild=(await read(join(D,'../../20260927_PROGRAM_CONSTRUCTION/installed-04/positive03/binding-cover-diagnostic.json'))).sourceBasis;
  assert.equal(exactChild.ref,sourceOwner.selectedCall[0].basisId);
  assert.equal(priorCover.W0.ref,built.fixture.input.origin.observation.task.sourceNativeWork.task.workspaceBinding.bindingId);
  const witnessContract=abg.WITNESS_CONTENT_CONTRACTS.reprice;
  const witness=await invoke(await setup.authorized(abg.WITNESS_OPERATION_CONTRACTS.admit.reprice,
    {subjectKind:'authority_basis',subject:exactChild,act:'reprice',content:{kind:'typed_payload',contentContract:{ref:witnessContract.ref,digest:witnessContract.digest},value:{
      declarationRef:priorCover.W0.ref,beforeDigest:priorCover.W0.digest,afterDigest:binding.digest,changeClass:'realization_refactor',owningTicketRef:'ticket://odd-glc/T-043',
      reason:'Bind the exact retained native child to this construction-only pre-dispatch predecessor-refusal case; preserve the original task, context and history. No actor or worksite effect is authorized.'}},
      context:{kind:'basis',basis:exactChild},evidence:[priorCover.W0,binding],provenance:[exactChild]},
    {kind:'witness_reprice_resource_assertion',schemaVersion,eventResource:setup.reopen()},boundSlots),'native-child-binding-cover');
  const packet=product.RUN_OPERATION_CONTRACTS.invoke.start;
  const policy=product.constructRootInvocationPolicy(environment.workspaceBinding,program,[],['F_D','F_P'],[]);
  const grantBasis={admittedInstalls:environment.productInstalls,workspaceBinding:environment.workspaceBinding,fixedPacket:packet};
  const grants=[product.constructCapabilityGrant(policy,actorRef,'abg.operation.run.invoke',product.DIRECT_INVOKE_CAPABILITY,grantBasis)];
  const authority=product.constructInvocationAuthority(actorRef,environment.workspaceBinding,catalogView,program.programRef,resolution.selectedCatalogEntry,policy,grants,grantBasis);
  const oldContext=built.fixture.input.currentContext;
  const currentContext=await product.observeWorksiteContext({workspaceAuthorityBasis:workspaceAuthority,workspaceBinding:environment.workspaceBinding,
    readRoots:oldContext.readRoots,maxFiles:oldContext.maxFiles,maxBytes:oldContext.maxBytes});
  const rebound=await constructCase({product,gtl,artifact:{...core.basis,productManifestDigest:core.basis.manifestDigest},sourceSelection,
    runEnvironment:configuration.runEnvironment,currentContext,
    authority:{workspaceAuthorityBasis:workspaceAuthority,workspaceBinding:environment.workspaceBinding,capabilityGrant:grants[0]}});
  assert.deepEqual(currentContext.entries,oldContext.entries,'complete native44 context unchanged');
  assert.deepEqual(currentContext.readRoots,oldContext.readRoots);
  assert.equal(currentContext.maxFiles,oldContext.maxFiles);assert.equal(currentContext.maxBytes,oldContext.maxBytes);
  assert.equal(rebound.candidate.publication.programs[0].programRef,built.candidate.publication.programs[0].programRef);
  const validInput=rebound.fixture.input,input=structuredClone(validInput);
  const selectedIndex=input.model.duties.findIndex(d=>d.ref===input.selectedDutyRefs[0]);
  const before=input.model.duties[selectedIndex].dependencies[0].digest;
  const after=hash('PC02 installed one wrong declared observed predecessor; actual source/context unchanged');
  input.model.duties[selectedIndex].dependencies[0].digest=after;assert.notEqual(before,after);assert(isNativeConstructionInput(input));
  const intervention={path:'input.model.duties['+selectedIndex+'].dependencies[0].digest',before,after,
    expected:'prepare-construction refuses actual acquired-context predecessor before native constructor/assessor/C2/actor dispatch'};
  const restored=structuredClone(input);restored.model.duties[selectedIndex].dependencies[0].digest=before;assert.deepEqual(restored,validInput);
  checkInstalledConstructionTopology({product,activation:{mode:'construction_only',expectation:'predecessor_refusal'},input,catalog,programRef:program.programRef});
  await save('valid-rebound-input.json',validInput);await save('intervention.json',intervention);
  const temporaryRoot=join(roots.archiveRoot,'run-environment-access');await mkdir(temporaryRoot,{recursive:true});
  const runEnvironmentResources=constructFullSandboxEnvironmentResources({product,declaration:configuration.runEnvironment,
    configuration:configuration.runEnvironmentResources,authority,program,temporaryRoot});
  const historicalSource={kind:'abg_historical_graph_call_source_resource',schemaVersion,terminal:input.historicalSelection,
    input:{graphFunctionRef:input.historicalSelection.producer.graphFunction.ref,contractRef:sourceLaunch.invocation.invocation.request.input.contract.ref},
    declarationProof:proof(sourceLaunch),declarationDependencies:[constructorProof]};
  const carrier={contract:{ref:resolution.resolution.inputContract.contractRef,digest:resolution.resolution.inputContractDigest},
    valueRef:'value://odd-glc/T-043/declaration-resource-01/wrong-predecessor@5',valueDigest:hash(input),value:input};
  await setup.close();const eventResource=setup.reopen(),steering=hash(eventResource);
  const slots={graph_function:null,verification_references:null,execution_basis:null,workspace_binding:binding,product_set:installs.map(i=>({ref:i.installId,digest:i.productContentDigest})),
    dependency_lock:lock,catalog_scope:catalogScope,execution_program:{ref:program.programRef,digest:resolution.resolution.programDigest},input_contract:carrier,
    session_policy:{ref:policy.policyRef,digest:policy.policyDigest},capability_grants:{requiredCapabilityRefs:[...packet.metadata.capabilityRefs],grants:grants.map(g=>({ref:g.grantRef,digest:g.grantDigest}))},
    actor:{actor:coord(actorRef,{actorRef}),attribution:{ref:authority.authorityRef,digest:authority.authorityDigest}},transport_steering:{ref:'transport-steering://abiogenesis/'+steering.slice(7),digest:steering}};
  const request={program:slots.execution_program,scope:'program',target:{kind:'next'},until:'converged',catalogView:catalogScope.view,allowlist,input:carrier,
    fhMode:'direct',rootMode:'direct',sourceBasis:{kind:'none'}};
  const resources={kind:'run_invocation_resource_assertion',schemaVersion,catalog,catalogView,applications:[],applicationResources:[],source:{kind:'none'},historicalSource,eventResource,runEnvironmentResources};
  const call=setup.call(packet,request,slots,resources);
  await writeFile(join(D,'negative-start.jsonl'),JSON.stringify({kind:'abg_cli_transport_request',schemaVersion,acquisition:{kind:'reopen',closeHandoff:state.closeHandoff},invocation:call})+'\n',{flag:'wx'});
  await save('run-environment.json',configuration.runEnvironment);
  timings.setupMs=performance.now()-setupStart-timings.installMs;await save('setup-receipt.json',{...timings,calls,closeHandoff:state.closeHandoff,witness:witness.ownerOutput,entryPrefix:entryClose.prefix,setupAppendedBytes:state.closeHandoff.prefix.prefixLength-entryClose.prefix.prefixLength,configuration:{path:configurationPath,digest:await product.sha256File(configurationPath)}});
  await save('activation-pending-review.json',{kind:'reviewed_program_construction_activation',coreRoot:installs[0].installedRoot,cliPath:join(installs[0].installedRoot,'build/code/src/public/cli.js'),
    sourceFreeze:{path:freezePath,digest:await product.sha256File(freezePath)},mode:'construction_only',constructionReview:null,
    launchPath:join(D,'negative-start.jsonl'),launchDigest:await product.sha256File(join(D,'negative-start.jsonl')),
    environment:{workspaceAuthorityBasis:environment.workspaceAuthorityBasis,workspaceBinding:environment.workspaceBinding,productInstalls:environment.productInstalls},abiArtifact,
    preservedPrefix:coordinates.native44.prefix,setupReceiptPath:join(D,'setup-receipt.json'),intervention,
    expectation:'predecessor_refusal',outputRoot:join(D,'negative'),timeoutMs:600000});
  await save('prepared.json',{status:'prepared_not_launched',sourceFreeze:await product.sha256File(freezePath),program:slots.execution_program,
    prefix:state.closeHandoff.prefix,sourceSelection:{prefix:sourceSelection.prefix,graphCallRef:sourceSelection.graphCallRef},timings,calls,
    packages:products.map(p=>p.verification.coordinates),inputDigest:carrier.valueDigest,launchPath:join(D,'negative-start.jsonl'),launchDigest:await product.sha256File(join(D,'negative-start.jsonl')),intervention,
    sourceFreezePath:freezePath,validReboundInputDigest:hash(validInput),dutyCount:input.model.duties.length,bindingCount:input.model.bindingRefs.length,carriedDutyRefs:rebound.candidate.selection.carriedDutyRefs,carriedBindingRefs:rebound.candidate.selection.carriedBindingRefs,
    runEnvironmentDigest:hash(configuration.runEnvironment),runEnvironmentResourcesDigest:hash(runEnvironmentResources),originalTaskCompletion:'not_claimed',s06Closure:'not_claimed'});
  console.log(JSON.stringify({status:'prepared_not_launched',programRef:program.programRef,timings,calls:calls.length,prefix:state.closeHandoff.prefix}));
}catch(error){await save('first-cause.json',{message:error.message,stack:error.stack,calls});throw error;}
finally{await setup.close();}
