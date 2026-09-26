// Separate qualification Product, using the existing canonical emitter.
// Publication/packaging is called only after the evaluator review is accepted.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as product from '@abiogenesis/typescript-tenant/product';
import * as gtl from '@abiogenesis/typescript-tenant/gtl';
import {constructOddGlcProductPackage} from '../../../src/product-package.mjs';
import {evaluatorPublication,fixtureIds} from './native-records-evaluator.mjs';
export async function packageEvaluator({coreRoot,outputRoot}) {
 const zero='sha256:'+'0'.repeat(64),artifact={artifactDigest:zero,manifestDigest:zero,productContentDigest:zero};
 const suffix='odd-glc/program-construction-fixture@'+fixtureIds.packageVersion;
 const ids={...fixtureIds,descriptorRef:'descriptor://'+suffix,contributionManifestRef:'contribution-manifest://'+suffix,
  catalogRef:'catalog://'+suffix,provenanceRef:'provenance://'+suffix};
 const built=constructOddGlcProductPackage({product,gtl,ids,abiArtifact:JSON.parse(await readFile(join(coreRoot,'product-toolchain-manifest.json'),'utf8')),
  consumerPublication:evaluatorPublication({gtl,artifact}),sourceFiles:{'build/native-records-evaluator.mjs':await readFile(new URL('./native-records-evaluator.mjs',import.meta.url),'utf8')},
  packageExports:{'./publication':'./build/publication.json','./evaluator':'./build/native-records-evaluator.mjs'}});
 await mkdir(outputRoot,{recursive:false});
 for(const [path,bytes] of Object.entries(built.files)){const target=join(outputRoot,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes,{flag:'wx'});}
 return {packageRoot:outputRoot,productId:ids.productId,productContentDigest:built.productContentDigest,manifestDigest:product.sha256Canonical(built.manifest)};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [coreRoot,outputRoot,...rest]=process.argv.slice(2);
 if(!coreRoot||!outputRoot||rest.length)throw new TypeError('usage: package-evaluator.mjs <installed-core> <new-package-root>');
 console.log(JSON.stringify(await packageEvaluator({coreRoot:resolve(coreRoot),outputRoot:resolve(outputRoot)})));
}
