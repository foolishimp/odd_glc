// Resolves only public exports of the explicitly selected real installed core.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
export async function resolve(specifier,context,nextResolve) {
  const prefix='@abiogenesis/typescript-tenant';
  if(specifier===prefix||specifier.startsWith(prefix+'/')) {
    const root=process.env.ABI5_COMPONENT_ROOT;if(!root)throw Error('ABI5_COMPONENT_ROOT must select the installed core');
    const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
    const key=specifier===prefix?'.':'./'+specifier.slice(prefix.length+1);
    const target=pkg.exports[key]?.import;if(!target)throw Error('not a public core export: '+specifier);
    return {url:pathToFileURL(join(root,target)).href,shortCircuit:true};
  }
  return nextResolve(specifier,context);
}
