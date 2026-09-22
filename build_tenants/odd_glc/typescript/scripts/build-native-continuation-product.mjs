// Thin source-file writer over the reused canonical ABI5 Product emitter.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {constructOddGlcProductPackage} from '../src/product-package.mjs';
import {constructNativeContinuationPublication} from '../src/native-continuation-declarations.mjs';
import {ids,PACKAGE_NAME,PACKAGE_VERSION,ASSESSMENT_SCHEMA_TEXT} from '../src/native-continuation-contracts.mjs';
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
 const schemaPath='contracts/native-continuation-assessment.schema.json';sourceFiles[schemaPath]=ASSESSMENT_SCHEMA_TEXT;
 const schemaDigest=product.sha256Bytes(Buffer.from(ASSESSMENT_SCHEMA_TEXT));
 const contractRows=[{contractId:ids.rawContractRef,contractVersion:'5.0.0',contractDigest:schemaDigest,contractKind:'schema_asset',owningProduct:ids.productId,
  requirementAuthorityRefs:['requirement://odd-glc/REQ-GLC-WORKSITE-LIFECYCLE-005'],capabilityIdentities:[],
  assetLocator:{path:schemaPath,mediaType:'application/schema+json',schemaVersion:'5.0.0',contentDigest:schemaDigest}}];
 const built=constructOddGlcProductPackage({product,gtl,ids:{...ids,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION},abiArtifact:manifest,consumerPublication:publication,sourceFiles,contractRows,
  packageExports:{'./publication':'./build/publication.json','./native-continuation':'./build/native-continuation-runtime.mjs','./declarations':'./build/native-continuation-declarations.mjs'}});
 await mkdir(outputRoot,{recursive:false});
 for(const [path,bytes] of Object.entries(built.files)) { const target=join(outputRoot,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes,{flag:'wx'}); }
 return {packageRoot:outputRoot,productId:ids.productId,packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,productContentDigest:built.productContentDigest,manifestDigest:product.sha256Canonical(built.manifest),payloadInventory:built.payloadInventory};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const [coreRoot,environmentPath,outputRoot,...extra]=process.argv.slice(2);
 if(!coreRoot||!environmentPath||!outputRoot||extra.length)throw new TypeError('usage: build-native-continuation-product.mjs <installed-core> <generic-run-environment.json> <new-package-root>');
 console.log(JSON.stringify(await buildNativeContinuationProduct({coreRoot:resolve(coreRoot),runEnvironment:JSON.parse(await readFile(environmentPath,'utf8')),outputRoot:resolve(outputRoot)})));
}
