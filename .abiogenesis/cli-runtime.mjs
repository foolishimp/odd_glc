import {
  admitModule,
  admitNode,
  admitResolvedPolicyIdentity,
  admitResolvedRuntimeIdentity,
  constructDefaultAbgFnCompositionDeclarations,
  edge,
  graphFunctionForVector
} from "file:///Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/lib/node_modules/@abiogenesis/typescript-tenant/build/semantic/code/src/index.js";

const installedSubstrate = admitNode({
  id: "node:abiogenesis:installed_substrate",
  name: "installed_substrate",
  schema: { kind: "symbolic", ref: "schema://abiogenesis/install/substrate" },
  markov: ["installed"],
  assetSurface: {
    kind: "installed_substrate",
    requiredContexts: ["workspace"],
    standardsRefs: ["/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/docs/standards"],
    outputContractRefs: ["installed_substrate_present"]
  },
  tags: ["abiogenesis", "installer", "substrate"]
});

const cliRuntimeBinding = admitNode({
  id: "node:abiogenesis:cli_runtime_binding",
  name: "cli_runtime_binding",
  schema: { kind: "symbolic", ref: "schema://abiogenesis/install/cli-runtime-binding" },
  markov: ["installed"],
  assetSurface: {
    kind: "cli_runtime_binding",
    requiredContexts: ["workspace"],
    standardsRefs: ["/Users/jim/src/apps/.abg-toolchains/abiogenesis-typescript-tenant/products/abiogenesis/4.1.0-rc.12/docs/standards/ODD_METHOD.md"],
    outputContractRefs: ["cli_runtime_binding_present"]
  },
  tags: ["abiogenesis", "installer", "runtime_binding"]
});

const runtimeBindingGraphFunction = graphFunctionForVector(
  edge([installedSubstrate], cliRuntimeBinding, {
    id: "graph:abiogenesis:installed_cli_runtime_binding",
    name: "installed_substrate_to_cli_runtime_binding",
    evaluators: [
      {
        name: "installed_cli_runtime_binding_present",
        regime: "F_D",
        description: "Installed CLI runtime binding is present and package-backed.",
        binding: "fd://abiogenesis/installed-cli-runtime-binding/present",
        tags: ["installer", "runtime_binding"]
      }
    ],
    declarations: constructDefaultAbgFnCompositionDeclarations({
      scopeRef: "abiogenesis/installed-cli-runtime-binding",
      hostGraphVectorRef: "graph:abiogenesis:installed_cli_runtime_binding"
    })
  }).vectors[0],
  {
    id: "graph-function:abiogenesis:installed_cli_runtime_binding_self_test",
    name: "installed_cli_runtime_binding_self_test",
    declarations: { entries: [] }
  }
);

const module = admitModule({
  name: "abiogenesis_installed_substrate",
  graphs: [runtimeBindingGraphFunction.template.graph],
  graphFunctions: [runtimeBindingGraphFunction],
  refinementBoundaries: [],
  candidateFamilies: [],
  jobs: [
    {
      id: "job:abiogenesis:installed_cli_runtime_binding_self_test",
      name: "installed_cli_runtime_binding_self_test_job",
      contracts: [
        {
          kind: "graph_function",
          targetId: runtimeBindingGraphFunction.id
        }
      ],
      roles: [],
      tags: ["abiogenesis", "installer", "self_test"]
    }
  ],
  roles: [],
  operators: [],
  evaluators: [],
  rules: [],
  imports: [],
  metadata: { entries: [] }
});

export const runtimeBinding = {
  module,
  runtimeIdentity: admitResolvedRuntimeIdentity({
  "workerId": "abiogenesis-typescript-installer",
  "backendId": "node",
  "buildId": "4.1.0-rc.12",
  "resolvedRuntimeRef": "package:@abiogenesis/typescript-tenant@4.1.0-rc.12"
}),
  resolvedPolicy: admitResolvedPolicyIdentity({
    resolvedPolicyBundleRef: "policy://abiogenesis/installed-substrate-self-test/F_D",
    defaultRegime: "F_D",
    dispatchRef: null
  }),
  fallbackConfigPath: ".abiogenesis/config/abg.config.json",
  runId: "run://abiogenesis/installed-substrate-self-test",
  workKey: "wk://abiogenesis/installed-substrate-self-test"
};
