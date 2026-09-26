// Thin source-file writer over the reused canonical ABI5 Product emitter.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {constructOddGlcProductPackage} from '../src/product-package.mjs';
import {constructNativeContinuationPublication} from '../src/native-continuation-declarations.mjs';
import {ids,correction,reentry,PACKAGE_NAME,PACKAGE_VERSION,ASSESSMENT_SCHEMA_TEXT,CORRECTION_SELECTION_SCHEMA_TEXT,DESIGN_ASSESSMENT_SCHEMA_TEXT} from '../src/native-continuation-contracts.mjs';
import {ids as constructionIds,PACKAGE_NAME as CONSTRUCTION_PACKAGE,PACKAGE_VERSION as CONSTRUCTION_VERSION} from '../src/program-construction-contracts.mjs';

// A selected concrete publication uses the same canonical emitter and writer.
// It contains no job/source/workspace data; those are ordinary Run entry data.
export async function buildProgramConstructionProduct({coreRoot,publication,dependencies,outputRoot}) {
 const pkg=JSON.parse(await readFile(join(coreRoot,'package.json'),'utf8'));
 const load=async name=>import(pathToFileURL(join(coreRoot,pkg.exports['./'+name].import)).href);
 const product=await load('product'),gtl=await load('gtl');
 if(publication.moduleRef!==constructionIds.moduleRef||publication.programs.length!==1)
  throw new TypeError('one concrete construction publication required');
 if(!Array.isArray(dependencies))throw new TypeError('explicit supplied Product dependencies required');
 const sourceRoot=resolve(dirname(fileURLToPath(import.meta.url)),'../src'),sourceFiles={};
 for(const name of ['program-construction.mjs','program-construction-contracts.mjs','program-construction-runtime.mjs'])
  sourceFiles['build/'+name]=await readFile(join(sourceRoot,name),'utf8');
 const built=constructOddGlcProductPackage({product,gtl,ids:{...constructionIds,packageName:CONSTRUCTION_PACKAGE,packageVersion:CONSTRUCTION_VERSION},
  abiArtifact:JSON.parse(await readFile(join(coreRoot,'product-toolchain-manifest.json'),'utf8')),consumerPublication:publication,sourceFiles,additionalDependencies:dependencies,
  packageExports:{'./publication':'./build/publication.json','./program-construction':'./build/program-construction.mjs','./construction-runtime':'./build/program-construction-runtime.mjs'}});
 await writePackage(outputRoot,built.files);
 return {packageRoot:outputRoot,productId:constructionIds.productId,packageName:CONSTRUCTION_PACKAGE,packageVersion:CONSTRUCTION_VERSION,
  productContentDigest:built.productContentDigest,manifestDigest:product.sha256Canonical(built.manifest),payloadInventory:built.payloadInventory};
}
async function writePackage(outputRoot,files) {
 await mkdir(outputRoot,{recursive:false});
 for(const [path,bytes] of Object.entries(files)) {const target=join(outputRoot,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes,{flag:'wx'});}
}
export async function buildNativeContinuationProduct({coreRoot,runEnvironment,outputRoot}) {
 const pkg=JSON.parse(await readFile(join(coreRoot,'package.json'),'utf8'));
 const load=async name=>import(pathToFileURL(join(coreRoot,pkg.exports['./'+name].import)).href);
 const product=await load('product'),gtl=await load('gtl');
 const manifest=JSON.parse(await readFile(join(coreRoot,'product-toolchain-manifest.json'),'utf8'));
 if(!runEnvironment)throw new TypeError('explicit exact generic run environment required');
 const zero='sha256:'+'0'.repeat(64),artifact={artifactDigest:zero,productContentDigest:zero,manifestDigest:zero};
 const publication=constructNativeContinuationPublication({artifact,gtl,product,runEnvironment});
 const sourceRoot=resolve(dirname(fileURLToPath(import.meta.url)),'../src'),sourceFiles={};
 for(const name of ['native-continuation-contracts.mjs','native-continuation-runtime.mjs','native-continuation-declarations.mjs'])
  sourceFiles['build/'+name]=await readFile(join(sourceRoot,name),'utf8');
 const contractRows=[['contracts/native-continuation-assessment.schema.json',ids.rawContractRef,ASSESSMENT_SCHEMA_TEXT],
  ['contracts/native-correction-selection.schema.json',correction.selectionContractRef,CORRECTION_SELECTION_SCHEMA_TEXT],
  ['contracts/native-design-assessment.schema.json',reentry.rawContractRef,DESIGN_ASSESSMENT_SCHEMA_TEXT]].map(([path,contractId,text])=>{
  sourceFiles[path]=text;const digest=product.sha256Bytes(Buffer.from(text));
  return {contractId,contractVersion:'5.0.0',contractDigest:digest,contractKind:'schema_asset',owningProduct:ids.productId,
   requirementAuthorityRefs:['requirement://odd-glc/REQ-GLC-WORKSITE-LIFECYCLE-005'],capabilityIdentities:[],
   assetLocator:{path,mediaType:'application/schema+json',schemaVersion:'5.0.0',contentDigest:digest}};
 });
 const built=constructOddGlcProductPackage({product,gtl,ids:{...ids,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION},abiArtifact:manifest,consumerPublication:publication,sourceFiles,contractRows,
  packageExports:{'./publication':'./build/publication.json','./native-continuation':'./build/native-continuation-runtime.mjs','./declarations':'./build/native-continuation-declarations.mjs'}});
 await writePackage(outputRoot,built.files);
 return {packageRoot:outputRoot,productId:ids.productId,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,productContentDigest:built.productContentDigest,manifestDigest:product.sha256Canonical(built.manifest),payloadInventory:built.payloadInventory};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 if(process.argv[2]==='--program-construction') {
  const [coreRoot,candidatePath,outputRoot,...extra]=process.argv.slice(3);
  if(!coreRoot||!candidatePath||!outputRoot||extra.length)throw new TypeError('usage: --program-construction <installed-core> <candidate.json> <new-package-root>');
  const candidate=JSON.parse(await readFile(candidatePath,'utf8'));
  console.log(JSON.stringify(await buildProgramConstructionProduct({coreRoot:resolve(coreRoot),publication:candidate.publication,dependencies:candidate.dependencies,outputRoot:resolve(outputRoot)})));
 } else {
 const [coreRoot,environmentPath,outputRoot,...extra]=process.argv.slice(2);
 if(!coreRoot||!environmentPath||!outputRoot||extra.length)throw new TypeError('usage: build-native-continuation-product.mjs <installed-core> <generic-run-environment.json> <new-package-root>');
 console.log(JSON.stringify(await buildNativeContinuationProduct({coreRoot:resolve(coreRoot),runEnvironment:JSON.parse(await readFile(environmentPath,'utf8')),outputRoot:resolve(outputRoot)})));
 }
}
