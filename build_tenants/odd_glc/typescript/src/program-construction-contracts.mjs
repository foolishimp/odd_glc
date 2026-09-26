// Consumer contracts describe proposals and projections; ABG owns their admission.
export const VERSION = '5.0.0';
export const PACKAGE_NAME = '@odd-glc/route-one-typescript';
export const PACKAGE_VERSION = '0.3.0-dev.2';
const ref = (kind, name) => `${kind}://odd-glc/program-construction/${name}@5`;
export const ids = Object.freeze({
  productId: `product://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
  descriptorRef: `descriptor://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
  contributionManifestRef: `contribution-manifest://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
  catalogRef: `catalog://odd_glc/public-contracts@${PACKAGE_VERSION}`,
  provenanceRef: `provenance://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
  moduleRef: ref('module', 'library'), semanticsBindingRef: ref('product-semantics', 'library'),
  inputContractRef: ref('contract', 'input'), evaluatorInputContractRef: ref('contract', 'evaluation-input'),
  evidenceContractRef: ref('contract', 'evidence'), failureContractRef: ref('contract', 'failure'),
  refusalContractRef: ref('contract', 'refusal'), judgmentContractRef: ref('contract', 'judgment'),
  transitionContractRef: ref('contract', 'transition'), closureContractRef: ref('contract', 'closure'),
  stepPredicateRef: ref('predicate', 'step'), completionPredicateRef: ref('predicate', 'computed-increment'),
  authenticateGraphFunctionRef: ref('graph-function', 'authenticate'),
  prepareGraphFunctionRef: ref('graph-function', 'prepare-evaluation'),
});
export const contract = (contractRef, contractKind, valueKind) => Object.freeze({contractRef, contractVersion: VERSION, contractKind, valueKind});
export const inputContract = contract(ids.inputContractRef, 'input', 'lifecycle_construction_input');
export const evaluatorInputContract = contract(ids.evaluatorInputContractRef, 'input', 'lifecycle_evaluation_input');
export const stages = Object.freeze([
  {name:'authenticate', symbol:'prepareReacquisition', input:ids.inputContractRef,
    output:'contract://abiogenesis/worksite/native-command-reacquisition-request@5', graphFunctionRef:ids.authenticateGraphFunctionRef},
  {name:'prepare-evaluation', symbol:'prepareEvaluation', input:'contract://abiogenesis/worksite/retained-graph-input@5',
    output:ids.evaluatorInputContractRef, graphFunctionRef:ids.prepareGraphFunctionRef},
].map(s => Object.freeze({...s, nodeRef:ref('node',s.name), bindingRef:ref('implementation-binding',s.name),
  implementationRef:ref('implementation',s.name), predicateRef:ref('predicate',s.name),
  closureRef:ref('contract',s.name+'/closure')})));
export const bindingFor = s => ({kind:'implementation_binding', bindingRef:s.bindingRef,
  implementationRef:s.implementationRef, packageName:PACKAGE_NAME, packageVersion:PACKAGE_VERSION,
  modulePath:'build/program-construction-runtime.mjs', namedSymbol:s.symbol, computeRegime:'F_D',
  inputContractRef:s.input, outputContractRef:s.output,
  failureContractRef:ids.failureContractRef, refusalContractRef:ids.refusalContractRef});
export const roles = Object.freeze(['construct','execute','evaluate','assess','provenance']);
