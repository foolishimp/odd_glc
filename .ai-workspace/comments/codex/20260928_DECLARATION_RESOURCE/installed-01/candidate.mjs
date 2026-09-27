// Same retained PC02 refusal case, using the owner's compact declaration reference.
import {readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {caseBasis as retainedBasis} from '../../20260927_PROGRAM_CONSTRUCTION/pc02-installed-02/candidate.mjs';
import {installedFullSandboxApis} from '../../../../../build_tenants/odd_glc/typescript/test/full-sandbox-support.mjs';
export {constructCase} from '../../20260927_PROGRAM_CONSTRUCTION/pc02-installed-02/candidate.mjs';
export async function caseBasis(){
 const repo=resolve(import.meta.dirname,'../../../../..'),base=await retainedBasis();
 const core=JSON.parse(await readFile(join(repo,'../abiogenesis/.ai-workspace/comments/codex/20260928_DECLARATION_RESOURCE/core-01/selected-core.json'),'utf8'));
 const {abg}=await installedFullSandboxApis(core.packageRoot);
 const {declarationProof:constructorProof,...source}=base.sourceSelection;
 return {...base,core,constructorProof,sourceSelection:{...source,declarationReference:abg.constructAbgHistoricalDeclarationReference(constructorProof)}};
}
