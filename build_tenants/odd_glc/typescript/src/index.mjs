export { ABIOGENESIS_SUBSTRATE_PROVENANCE } from "./substrate_provenance.mjs";

export const REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS = Object.freeze([
  "projectLifecycleState"
]);

export const OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS = Object.freeze([
  "compileEdgeRequirementEnvironment",
  "routeContextConstraint",
  "projectEdgeObligations",
  "projectMaterializationTargets",
  "projectExecutionSchedules",
  "projectAssuranceCase",
  "classifyAttenuation"
]);

export const FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES = Object.freeze([
  "emitRequirementRouteFactsForEdgeClose",
  "mintAdmittedRef",
  "admitDeclarations",
  "bindExecutionEvidence",
  "projectRequirementFoldFromAssuranceClosure",
  "projectRequirementResidualsFromFolds",
  "resolveRequirementLifecycleDisposition"
]);

export const REQUIRED_GTL_NODE_TYPE_FACADE_FUNCTIONS = Object.freeze([
  "constructNode",
  "constructNodeTypeGraphFunction",
  "composeNodeTypes"
]);

export const REQUIRED_GTL_DECLARATION_FACADE_SLOTS = deepFreeze({
  gtlM01Contracts: ["constructNode"],
  gtlM01Algebra: ["constructNodeTypeGraphFunction", "composeNodeTypes"],
  gtlM02Contracts: [
    "constructGtlLibraryEntryDeclaration",
    "constructProductRegistryStartupConfig",
    "constructProductPluginSelectionAdvice"
  ]
});

export const REQUIRED_GTL_REGISTRY_DECLARATION_FUNCTIONS = Object.freeze([
  "constructGtlLibraryEntryDeclaration",
  "constructProductRegistryStartupConfig",
  "constructProductPluginSelectionAdvice"
]);

export const FORBIDDEN_ABG_STARTUP_AUTHORITIES = Object.freeze([
  "admitRuntimeGraphFunctionRegistryStartup",
  "admitGtlLibraryEntryDeclaration",
  "projectRuntimeGraphFunctionRegistry",
  "lookupRuntimeGraphFunctionRegistry",
  "selectGraphFunctionFromRegistry",
  "assertGraphFunctionInvocationSelected",
  "constructGraphCallOpenedEvent",
  "emit"
]);

export const REQUIRED_ROUTE_ONE_SURFACES = Object.freeze([
  "LifeCycleWorksiteAsset",
  "LifecycleContextAsset",
  "IntentAsset",
  "ProductDefinitionAsset",
  "RequirementSetAsset",
  "RequirementEnvironmentViewAsset",
  "DestinationTopologyAsset",
  "InstructionSetAsset",
  "TargetArtifactAsset",
  "CapabilityAsset",
  "EvidenceBindingAsset",
  "AssuranceFoldViewAsset",
  "ResidualPressureViewAsset",
  "ReentryDecisionAsset"
]);

export const ODD_GLC_LIFECYCLE_NODE_TYPES = deepFreeze([
  {
    typeRef: "odd_glc.type.lifecycle_worksite",
    nodeName: "LifecycleWorksite",
    surface: "LifeCycleWorksiteAsset",
    schemaRef: "odd_glc.schema.lifecycle_worksite",
    assetKind: "lifecycle_worksite",
    markov: ["scoped"],
    tags: ["odd_glc", "lifecycle_surface"]
  },
  {
    typeRef: "odd_glc.type.lifecycle_context",
    nodeName: "LifecycleContext",
    surface: "LifecycleContextAsset",
    schemaRef: "odd_glc.schema.lifecycle_context",
    assetKind: "lifecycle_context",
    markov: ["contextualized"],
    tags: ["odd_glc", "lifecycle_surface", "context"]
  },
  {
    typeRef: "odd_glc.type.intent",
    nodeName: "LifecycleIntent",
    surface: "IntentAsset",
    schemaRef: "odd_glc.schema.intent",
    assetKind: "lifecycle_intent",
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "what"]
  },
  {
    typeRef: "odd_glc.type.product_definition",
    nodeName: "ProductDefinition",
    surface: "ProductDefinitionAsset",
    schemaRef: "odd_glc.schema.product_definition",
    assetKind: "product_definition",
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "what"]
  },
  {
    typeRef: "odd_glc.type.requirement_set",
    nodeName: "RequirementSet",
    surface: "RequirementSetAsset",
    schemaRef: "odd_glc.schema.requirement_set",
    assetKind: "requirement_set",
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "requirements"]
  },
  {
    typeRef: "odd_glc.type.requirement_environment_view",
    nodeName: "RequirementEnvironmentView",
    surface: "RequirementEnvironmentViewAsset",
    schemaRef: "odd_glc.schema.requirement_environment_view",
    assetKind: "requirement_environment_view",
    markov: ["projected"],
    tags: ["odd_glc", "lifecycle_surface", "read_model", "requirements"]
  },
  {
    typeRef: "odd_glc.type.destination_topology",
    nodeName: "DestinationTopology",
    surface: "DestinationTopologyAsset",
    schemaRef: "odd_glc.schema.destination_topology",
    assetKind: "destination_topology",
    markov: ["projected"],
    tags: ["odd_glc", "lifecycle_surface", "topology"]
  },
  {
    typeRef: "odd_glc.type.instruction_set",
    nodeName: "InstructionSet",
    surface: "InstructionSetAsset",
    schemaRef: "odd_glc.schema.instruction_set",
    assetKind: "instruction_set",
    markov: ["projected"],
    tags: ["odd_glc", "lifecycle_surface", "handoff"]
  },
  {
    typeRef: "odd_glc.type.lifecycle_artifact",
    nodeName: "LifecycleArtifact",
    surface: "TargetArtifactAsset",
    schemaRef: "odd_glc.schema.lifecycle_artifact",
    assetKind: "target_artifact",
    markov: ["materialized"],
    tags: ["odd_glc", "lifecycle_surface", "artifact"]
  },
  {
    typeRef: "odd_glc.type.lifecycle_capability",
    nodeName: "LifecycleCapability",
    surface: "CapabilityAsset",
    schemaRef: "odd_glc.schema.lifecycle_capability",
    assetKind: "capability",
    markov: ["available"],
    tags: ["odd_glc", "lifecycle_surface", "capability"]
  },
  {
    typeRef: "odd_glc.type.evidence_binding_view",
    nodeName: "EvidenceBindingView",
    surface: "EvidenceBindingAsset",
    schemaRef: "odd_glc.schema.evidence_binding_view",
    assetKind: "evidence_binding_view",
    markov: ["projected"],
    tags: ["odd_glc", "read_model", "evidence"]
  },
  {
    typeRef: "odd_glc.type.assurance_state_view",
    nodeName: "AssuranceStateView",
    surface: "AssuranceFoldViewAsset",
    schemaRef: "odd_glc.schema.assurance_state_view",
    assetKind: "assurance_state_view",
    markov: ["projected"],
    tags: ["odd_glc", "read_model", "assurance"]
  },
  {
    typeRef: "odd_glc.type.residual_pressure_view",
    nodeName: "ResidualPressureView",
    surface: "ResidualPressureViewAsset",
    schemaRef: "odd_glc.schema.residual_pressure_view",
    assetKind: "residual_pressure_view",
    markov: ["projected"],
    tags: ["odd_glc", "read_model", "residual"]
  },
  {
    typeRef: "odd_glc.type.lifecycle_disposition_view",
    nodeName: "LifecycleDispositionView",
    surface: "ReentryDecisionAsset",
    schemaRef: "odd_glc.schema.lifecycle_disposition_view",
    assetKind: "lifecycle_disposition_view",
    markov: ["projected"],
    tags: ["odd_glc", "read_model", "disposition"]
  },
  {
    typeRef: "odd_glc.type.lifecycle_release_readiness_view",
    nodeName: "LifecycleReleaseReadinessView",
    surface: "ReleaseReadinessView",
    schemaRef: "odd_glc.schema.lifecycle_release_readiness_view",
    assetKind: "release_readiness_view",
    markov: ["interpreted"],
    tags: ["odd_glc", "read_model", "release_readiness"]
  }
]);

export const ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES = deepFreeze([
  {
    typeRef: "odd_glc.type.lifecycle_definition_bundle",
    nodeName: "LifecycleDefinitionBundle",
    constituentTypeRefs: [
      "odd_glc.type.lifecycle_worksite",
      "odd_glc.type.lifecycle_context",
      "odd_glc.type.intent",
      "odd_glc.type.product_definition",
      "odd_glc.type.requirement_set"
    ],
    surface: "LifecycleDefinitionBundle",
    overlayMeaning: "minimum lifecycle definition pressure"
  },
  {
    typeRef: "odd_glc.type.lifecycle_assurance_bundle",
    nodeName: "LifecycleAssuranceBundle",
    constituentTypeRefs: [
      "odd_glc.type.requirement_environment_view",
      "odd_glc.type.destination_topology",
      "odd_glc.type.instruction_set",
      "odd_glc.type.evidence_binding_view",
      "odd_glc.type.assurance_state_view",
      "odd_glc.type.residual_pressure_view",
      "odd_glc.type.lifecycle_disposition_view"
    ],
    surface: "LifecycleAssuranceBundle",
    overlayMeaning: "read-only assurance and residual interpretation bundle"
  },
  {
    typeRef: "odd_glc.type.lifecycle_release_bundle",
    nodeName: "LifecycleReleaseBundle",
    constituentTypeRefs: [
      "odd_glc.type.lifecycle_artifact",
      "odd_glc.type.lifecycle_capability",
      "odd_glc.type.lifecycle_release_readiness_view"
    ],
    surface: "LifecycleReleaseBundle",
    overlayMeaning: "release-readiness interpretation bundle without release authority"
  }
]);

export const ODD_GLC_SOFTWARE_BUILD_NODE_TYPES = deepFreeze([
  {
    typeRef: "odd_glc.type.lifecycle.scenario_surface",
    nodeName: "ScenarioSurface",
    surface: "ScenarioSurfaceAsset",
    schemaRef: "odd_glc.schema.lifecycle.scenario_surface",
    assetKind: "scenario_surface",
    baseTypeRefs: ["odd_glc.type.requirement_set"],
    overlayRefs: [
      "surface.requirement_set",
      "software-build.role.scenario_surface"
    ],
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "software_build", "scenario"]
  },
  {
    typeRef: "odd_glc.type.lifecycle.design_surface",
    nodeName: "DesignSurface",
    surface: "DesignSurfaceAsset",
    schemaRef: "odd_glc.schema.lifecycle.design_surface",
    assetKind: "design_surface",
    baseTypeRefs: ["odd_glc.type.requirement_set"],
    overlayRefs: [
      "surface.instruction_set",
      "software-build.role.design_surface"
    ],
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "software_build", "design"]
  },
  {
    typeRef: "odd_glc.type.lifecycle.implementation_design",
    nodeName: "ImplementationDesign",
    surface: "ImplementationDesignAsset",
    schemaRef: "odd_glc.schema.lifecycle.implementation_design",
    assetKind: "implementation_design",
    baseTypeRefs: ["odd_glc.type.lifecycle.design_surface"],
    overlayRefs: [
      "surface.instruction_set",
      "software-build.role.implementation_design"
    ],
    markov: ["declared"],
    tags: ["odd_glc", "lifecycle_surface", "software_build", "design"]
  },
  {
    typeRef: "odd_glc.type.software.source_surface",
    nodeName: "SoftwareSourceSurface",
    surface: "SoftwareSourceSurfaceAsset",
    schemaRef: "odd_glc.schema.software.source_surface",
    assetKind: "software_source_surface",
    baseTypeRefs: ["odd_glc.type.lifecycle_artifact"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.source_artifact"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "source_artifact"]
  },
  {
    typeRef: "odd_glc.type.software.test_source_surface",
    nodeName: "SoftwareTestSourceSurface",
    surface: "SoftwareTestSourceSurfaceAsset",
    schemaRef: "odd_glc.schema.software.test_source_surface",
    assetKind: "software_test_source_surface",
    baseTypeRefs: ["odd_glc.type.lifecycle_artifact"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.test_source"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "test_source"]
  },
  {
    typeRef: "odd_glc.type.software.build_config_surface",
    nodeName: "SoftwareBuildConfigSurface",
    surface: "SoftwareBuildConfigSurfaceAsset",
    schemaRef: "odd_glc.schema.software.build_config_surface",
    assetKind: "software_build_config_surface",
    baseTypeRefs: ["odd_glc.type.lifecycle_artifact"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.build_config"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "build_config"]
  },
  {
    typeRef: "odd_glc.type.software.test_execution_result",
    nodeName: "SoftwareTestExecutionResult",
    surface: "SoftwareTestExecutionResultAsset",
    schemaRef: "odd_glc.schema.software.test_execution_result",
    assetKind: "software_test_execution_result",
    baseTypeRefs: ["odd_glc.type.evidence_binding_view"],
    overlayRefs: [
      "surface.evidence_binding",
      "software-build.role.test_execution"
    ],
    markov: ["projected"],
    tags: ["odd_glc", "software_build", "test_execution", "evidence"]
  }
]);

export const ODD_GLC_DATA_MAPPING_NODE_TYPES = deepFreeze([
  {
    typeRef: "odd_glc.type.software.mapping_spec",
    nodeName: "DataMappingSpec",
    surface: "DataMappingSpecAsset",
    schemaRef: "odd_glc.schema.software.mapping_spec",
    assetKind: "software_mapping_spec",
    baseTypeRefs: [
      "odd_glc.type.requirement_set",
      "odd_glc.type.lifecycle.design_surface"
    ],
    overlayRefs: [
      "surface.requirement_set",
      "software-build.role.mapping_spec"
    ],
    markov: ["declared"],
    tags: ["odd_glc", "software_build", "data_mapping", "requirement_binding"]
  },
  {
    typeRef: "odd_glc.type.software.schema_source",
    nodeName: "SchemaSource",
    surface: "SchemaSourceAsset",
    schemaRef: "odd_glc.schema.software.schema_source",
    assetKind: "software_schema_source",
    baseTypeRefs: ["odd_glc.type.software.source_surface"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.schema_source"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "data_mapping", "source_artifact"]
  },
  {
    typeRef: "odd_glc.type.software.mapper_source",
    nodeName: "MapperSource",
    surface: "MapperSourceAsset",
    schemaRef: "odd_glc.schema.software.mapper_source",
    assetKind: "software_mapper_source",
    baseTypeRefs: ["odd_glc.type.software.source_surface"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.mapper_source"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "data_mapping", "source_artifact"]
  },
  {
    typeRef: "odd_glc.type.software.mapper_validation_test",
    nodeName: "MapperValidationTest",
    surface: "MapperValidationTestAsset",
    schemaRef: "odd_glc.schema.software.mapper_validation_test",
    assetKind: "software_mapper_validation_test",
    baseTypeRefs: ["odd_glc.type.software.test_source_surface"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.mapper_validation_test"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "data_mapping", "test_source"]
  },
  {
    typeRef: "odd_glc.type.software.mapper_build_config",
    nodeName: "MapperBuildConfig",
    surface: "MapperBuildConfigAsset",
    schemaRef: "odd_glc.schema.software.mapper_build_config",
    assetKind: "software_mapper_build_config",
    baseTypeRefs: ["odd_glc.type.software.build_config_surface"],
    overlayRefs: [
      "surface.target_artifact",
      "software-build.role.mapper_build_config"
    ],
    markov: ["materialized"],
    tags: ["odd_glc", "software_build", "data_mapping", "build_config"]
  }
]);

export const ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES = deepFreeze([
  {
    typeRef: "odd_glc.type.software.data_mapping_implementation_bundle",
    nodeName: "DataMappingImplementationBundle",
    constituentTypeRefs: [
      "odd_glc.type.software.mapping_spec",
      "odd_glc.type.software.schema_source",
      "odd_glc.type.software.mapper_source",
      "odd_glc.type.software.mapper_validation_test",
      "odd_glc.type.software.mapper_build_config"
    ],
    surface: "DataMappingImplementationBundle",
    overlayRefs: [
      "overlay://odd_glc/software-build-lifecycle",
      "software-build.role.mapping_spec",
      "software-build.role.schema_source",
      "software-build.role.mapper_source",
      "software-build.role.mapper_validation_test",
      "software-build.role.mapper_build_config"
    ],
    overlayMeaning: "data-mapping implementation package over software-build lifecycle"
  }
]);

export const ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS = deepFreeze([
  ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
  ...ODD_GLC_DATA_MAPPING_NODE_TYPES,
  ...ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES
].map((entry) => `gtl-library-entry://odd_glc/node-type/${entry.typeRef}`));

export const ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS = deepFreeze([
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/node-type/bootstrap-context",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/node-type/bootstrap-context",
    typeRef: "node-type://odd_glc/GlcBootstrapContext",
    interfaceRef: "interface://odd_glc/node-type/bootstrap-context",
    sourceContractRef: "contract://odd_glc/bootstrap-context",
    targetContractRef: "contract://odd_glc/bootstrap-context",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  },
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/node-type/lifecycle-artifact",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/node-type/lifecycle-artifact",
    typeRef: "node-type://odd_glc/GlcLifecycleArtifact",
    interfaceRef: "interface://odd_glc/node-type/lifecycle-artifact",
    sourceContractRef: "contract://odd_glc/lifecycle-artifact",
    targetContractRef: "contract://odd_glc/lifecycle-artifact",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  },
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/node-type/executable-artifact",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/node-type/executable-artifact",
    typeRef: "node-type://odd_glc/GlcExecutableArtifact",
    interfaceRef: "interface://odd_glc/node-type/executable-artifact",
    sourceContractRef: "contract://odd_glc/lifecycle-artifact",
    targetContractRef: "contract://odd_glc/lifecycle-artifact",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  },
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/node-type/hello-world-program",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/node-type/hello-world-program",
    typeRef: "node-type://odd_glc/GlcHelloWorldProgramArtifact",
    interfaceRef: "interface://odd_glc/node-type/hello-world-program",
    sourceContractRef: "contract://odd_glc/lifecycle-artifact",
    targetContractRef: "contract://odd_glc/lifecycle-artifact",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  },
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/node-type/execution-evidence",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/node-type/execution-evidence",
    typeRef: "node-type://odd_glc/GlcExecutionEvidence",
    interfaceRef: "interface://odd_glc/node-type/execution-evidence",
    sourceContractRef: "contract://odd_glc/execution-evidence",
    targetContractRef: "contract://odd_glc/execution-evidence",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  }
]);

export const ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS = deepFreeze([
  {
    entryRef: "registry-entry://odd_glc/glc-bootstrap/graph-function/glc-hello-world-bootstrap",
    declarationRef: "gtl-declaration://odd_glc/glc-bootstrap/graph-function/glc-hello-world-bootstrap",
    graphFunctionName: "odd_glc.glc_bootstrap.produce_hello_world_program;odd_glc.glc_bootstrap.prove_hello_world_execution",
    interfaceRef: "interface://odd_glc/glc-hello-world-bootstrap",
    sourceContractRef: "contract://odd_glc/bootstrap-context",
    targetContractRef: "contract://odd_glc/execution-evidence",
    overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"]
  }
]);

export const ODD_GLC_HELLO_WORLD_BOOTSTRAP_STARTUP_BINDING = deepFreeze({
  kind: "odd_glc_hello_world_bootstrap_startup_binding",
  schemaVersion: "1",
  configRef: "product-registry-startup://odd_glc/glc-hello-world-bootstrap",
  productNamespace: "odd_glc",
  ownerRef: "owner://odd_glc",
  overlayRefs: ["overlay://odd_glc/glc-hello-world-bootstrap"],
  pluginRefs: ["plugin://odd_glc/glc-bootstrap/live-fp-dispatch"],
  readinessRefs: ["readiness://odd_glc/glc-bootstrap/abg-4.2"],
  proofRefs: ["proof://odd_glc/glc-bootstrap/live"],
  policyRefs: ["policy://odd_glc/glc-bootstrap-selection"],
  configSourceRefs: ["config://odd_glc/glc-bootstrap/startup"],
  entryRefs: [
    ...ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS.map((entry) => entry.entryRef),
    ...ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
  ],
  declarationRefs: [
    ...ODD_GLC_HELLO_WORLD_BOOTSTRAP_NODE_TYPE_BINDINGS.map((entry) => entry.declarationRef),
    ...ODD_GLC_HELLO_WORLD_BOOTSTRAP_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.declarationRef)
  ]
});

export const ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS = deepFreeze([
  {
    entryRef: "gtl-library-entry://odd_glc/bootstrap/observe-lifecycle-context",
    graphFunctionRef: "graph-function://odd_glc/bootstrap/observe-lifecycle-context",
    interfaceRef: "interface://odd_glc/bootstrap/context-to-definition",
    sourceContractRef: "contract://odd_glc/lifecycle-context",
    targetContractRef: "contract://odd_glc/lifecycle-definition",
    overlayRefs: ["surface.lifecycle_context", "surface.intent", "surface.product_definition"],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/startup-bound"],
    proofRefs: ["proof.negative_boundary"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/bootstrap/bind-requirement-pressure",
    graphFunctionRef: "graph-function://odd_glc/bootstrap/bind-requirement-pressure",
    interfaceRef: "interface://odd_glc/bootstrap/definition-to-requirements",
    sourceContractRef: "contract://odd_glc/lifecycle-definition",
    targetContractRef: "contract://odd_glc/requirement-pressure",
    overlayRefs: ["surface.requirement_set", "surface.requirement_environment_view"],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/requirements-route"],
    proofRefs: ["proof.fixture_of_record", "proof.live_run_reference"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/deployment/project-release-readiness",
    graphFunctionRef: "graph-function://odd_glc/deployment/project-release-readiness",
    interfaceRef: "interface://odd_glc/deployment/assurance-to-readiness",
    sourceContractRef: "contract://odd_glc/assurance-state",
    targetContractRef: "contract://odd_glc/release-readiness",
    overlayRefs: ["view.assurance_state", "view.release_readiness_state"],
    policyRefs: ["policy.fh_human_decision"],
    readinessRefs: ["readiness://odd_glc/release-authority-not-claimed"],
    proofRefs: ["proof.negative_boundary"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/deployment/observe-operational-feedback",
    graphFunctionRef: "graph-function://odd_glc/deployment/observe-operational-feedback",
    interfaceRef: "interface://odd_glc/deployment/feedback-to-pressure",
    sourceContractRef: "contract://odd_glc/operational-feedback",
    targetContractRef: "contract://odd_glc/lifecycle-pressure",
    overlayRefs: ["view.executive_pressure_state", "surface.reentry_decision"],
    policyRefs: ["policy.fh_human_decision"],
    readinessRefs: ["readiness://odd_glc/operational-feedback-deferred"],
    proofRefs: ["proof.negative_boundary"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  }
]);

export const ODD_GLC_LIFECYCLE_SLOT_MAP = deepFreeze({
  kind: "odd_glc_lifecycle_interpretation_slot_map",
  schemaVersion: "1",
  catalogId: "odd_glc.lifecycle_interpretation_slots.route_1",
  authority: {
    owner: "odd_glc",
    substrate: "gtl_abg",
    rule: "data_only_slot_map_over_admitted_gtl_abg_truth"
  },
  families: [
    "lifecycle_surface",
    "policy_overlay",
    "read_model",
    "proof_binding",
    "specialization_seam"
  ],
  familyRules: {
    lifecycle_surface: {
      owner: "odd_glc",
      allowedUse: "map lifecycle labels to admitted GTL/ABG refs and readiness states",
      forbiddenAuthority: [
        "native_carrier_shadowing",
        "gtl_graph_construction",
        "abg_runtime_truth_construction"
      ],
      extensionRule: "downstream may add domain asset roles only when bound to GTL/ABG refs"
    },
    policy_overlay: {
      owner: "odd_glc_or_downstream",
      allowedUse: "declare F_P/F_H prompts, rubrics, evidence expectations, owner, risk, reprice, block, and escalation policy as data",
      forbiddenAuthority: [
        "fp_worker_invocation",
        "owner_decision_controller",
        "evidence_admission",
        "closure_decision"
      ],
      extensionRule: "downstream or plugins may supply domain policy data without executable authority"
    },
    read_model: {
      owner: "odd_glc",
      allowedUse: "interpret ABG public query output and replay facts as lifecycle vocabulary",
      forbiddenAuthority: [
        "event_emission",
        "evidence_admission",
        "admitted_ref_minting",
        "fold_or_residual_projection",
        "continuation_or_reentry_routing"
      ],
      extensionRule: "downstream may add query overlays that preserve ABG refs and source truth"
    },
    proof_binding: {
      owner: "odd_glc",
      allowedUse: "record digest-pinned ABI proof inputs and negative boundary checks",
      forbiddenAuthority: [
        "proof_truth_creation",
        "runtime_execution",
        "artifact_admission"
      ],
      extensionRule: "downstream may add proof references only when ABI or another governed substrate owns the proof truth"
    },
    specialization_seam: {
      owner: "odd_glc_and_downstream",
      allowedUse: "name extension slots for domain assets, data policy, proof expectations, and plugin binding refs",
      forbiddenAuthority: [
        "product_local_runtime",
        "graph_function_catalog",
        "retry_loop",
        "closure_ledger",
        "odd_sdlc_reproduction"
      ],
      extensionRule: "plugins fill the slot with GTL/ABG-bound data and shall not supply local runtime authority"
    }
  },
  entries: [
    {
      entryId: "surface.lifecycle_worksite",
      family: "lifecycle_surface",
      surface: "LifeCycleWorksiteAsset",
      gtlAbgTruth: "ABG run/worksite refs and GTL module/job refs where present",
      overlayMeaning: "lifecycle scope label"
    },
    {
      entryId: "surface.lifecycle_context",
      family: "lifecycle_surface",
      surface: "LifecycleContextAsset",
      gtlAbgTruth: "ABG AuthorityContextFragment and context routing truth",
      overlayMeaning: "lifecycle context label"
    },
    {
      entryId: "surface.intent",
      family: "lifecycle_surface",
      surface: "IntentAsset",
      gtlAbgTruth: "GTL/ABG refs used by requirement declarations and staged context",
      overlayMeaning: "product intent meaning"
    },
    {
      entryId: "surface.product_definition",
      family: "lifecycle_surface",
      surface: "ProductDefinitionAsset",
      gtlAbgTruth: "GTL/ABG refs used by requirement declarations and proof policy",
      overlayMeaning: "product-definition meaning"
    },
    {
      entryId: "surface.requirement_set",
      family: "lifecycle_surface",
      surface: "RequirementSetAsset",
      gtlAbgTruth: "GTL requirement declarations, bundles, and traversal spans",
      overlayMeaning: "lifecycle requirement pressure binding"
    },
    {
      entryId: "surface.requirement_environment_view",
      family: "lifecycle_surface",
      surface: "RequirementEnvironmentViewAsset",
      gtlAbgTruth: "ABG requirement environment projection",
      overlayMeaning: "active requirement environment view"
    },
    {
      entryId: "surface.destination_topology",
      family: "lifecycle_surface",
      surface: "DestinationTopologyAsset",
      gtlAbgTruth: "ABG destination topology and GTL topology declarations",
      overlayMeaning: "lifecycle destination label"
    },
    {
      entryId: "surface.instruction_set",
      family: "lifecycle_surface",
      surface: "InstructionSetAsset",
      gtlAbgTruth: "ABG obligation, target, and schedule projections",
      overlayMeaning: "bounded construction handoff label"
    },
    {
      entryId: "surface.target_artifact",
      family: "lifecycle_surface",
      surface: "TargetArtifactAsset",
      gtlAbgTruth: "GTL asset surfaces and ABG admitted artifact refs",
      overlayMeaning: "lifecycle target artifact label"
    },
    {
      entryId: "surface.capability",
      family: "lifecycle_surface",
      surface: "CapabilityAsset",
      gtlAbgTruth: "GTL/ABG capability carriers and ABG actor/operator invocation truth",
      overlayMeaning: "lifecycle capability label"
    },
    {
      entryId: "surface.evidence_binding",
      family: "lifecycle_surface",
      surface: "EvidenceBindingAsset",
      gtlAbgTruth: "ABG admitted evidence and requirement evidence binding",
      overlayMeaning: "evidence-binding view"
    },
    {
      entryId: "surface.assurance_fold_view",
      family: "lifecycle_surface",
      surface: "AssuranceFoldViewAsset",
      gtlAbgTruth: "ABG assurance fold and assurance-case projections",
      overlayMeaning: "assurance state view"
    },
    {
      entryId: "surface.residual_pressure_view",
      family: "lifecycle_surface",
      surface: "ResidualPressureViewAsset",
      gtlAbgTruth: "ABG residual projection and attenuation classification",
      overlayMeaning: "residual pressure view"
    },
    {
      entryId: "surface.reentry_decision",
      family: "lifecycle_surface",
      surface: "ReentryDecisionAsset",
      gtlAbgTruth: "ABG continuation, correction, re-entry, release, or block facts",
      overlayMeaning: "lifecycle disposition label"
    },
    {
      entryId: "policy.fp_semantic_judgment",
      family: "policy_overlay",
      gtlAbgTruth: "data declaration consumed by GTL/ABG or interpreted after replay",
      overlayMeaning: "F_P prompts, rubrics, evidence expectations, and semantic judgment criteria"
    },
    {
      entryId: "policy.fh_human_decision",
      family: "policy_overlay",
      gtlAbgTruth: "data declaration consumed by GTL/ABG or interpreted after replay",
      overlayMeaning: "F_H owner, risk, reprice, block, escalation, and release-readiness policy"
    },
    {
      entryId: "view.lifecycle_state",
      family: "read_model",
      gtlAbgTruth: "ABG projectLifecycleState read model and replayed disposition facts",
      overlayMeaning: "lifecycle disposition vocabulary"
    },
    {
      entryId: "view.evidence_state",
      family: "read_model",
      gtlAbgTruth: "ABG admitted evidence and requirement evidence-binding facts",
      overlayMeaning: "evidence readiness vocabulary"
    },
    {
      entryId: "view.assurance_state",
      family: "read_model",
      gtlAbgTruth: "ABG fold, residual, and lifecycle disposition facts",
      overlayMeaning: "assurance and residual vocabulary"
    },
    {
      entryId: "view.requirement_graph_state",
      family: "read_model",
      gtlAbgTruth: "ABG requirement graph/refinement projections",
      overlayMeaning: "requirement graph lifecycle view"
    },
    {
      entryId: "view.recursive_span_state",
      family: "read_model",
      gtlAbgTruth: "ABG frame, zoom, span, foldback, and re-entry facts",
      overlayMeaning: "recursive lifecycle readiness view"
    },
    {
      entryId: "view.executive_pressure_state",
      family: "read_model",
      gtlAbgTruth: "ABG executive pressure facts and continuation refs",
      overlayMeaning: "reprice, block, and pressure-preservation view"
    },
    {
      entryId: "view.release_readiness_state",
      family: "read_model",
      gtlAbgTruth: "lifecycle, assurance, and evidence views",
      overlayMeaning: "release-readiness interpretation without release authority"
    },
    {
      entryId: "view.parallel_frontier_state",
      family: "read_model",
      gtlAbgTruth: "ABG saga/frontier, branch, fan-in, fold, and disposition facts",
      overlayMeaning: "parallel branch/fan-in lifecycle view"
    },
    {
      entryId: "proof.fixture_of_record",
      family: "proof_binding",
      gtlAbgTruth: "digest-pinned ABI artifact and manifest",
      overlayMeaning: "read-only proof input"
    },
    {
      entryId: "proof.live_run_reference",
      family: "proof_binding",
      gtlAbgTruth: "ABI live proof run metadata",
      overlayMeaning: "live proof provenance pointer"
    },
    {
      entryId: "proof.negative_boundary",
      family: "proof_binding",
      gtlAbgTruth: "import/export and fixture checks",
      overlayMeaning: "negative proof that forbidden local authority is absent"
    },
    {
      entryId: "seam.domain_asset_roles",
      family: "specialization_seam",
      gtlAbgTruth: "domain asset role names bound to GTL/ABG refs",
      overlayMeaning: "downstream asset-role extension slot"
    },
    {
      entryId: "seam.domain_policy_slots",
      family: "specialization_seam",
      gtlAbgTruth: "domain-specific F_P/F_H data policy",
      overlayMeaning: "downstream policy extension slot"
    },
    {
      entryId: "seam.domain_proof_expectations",
      family: "specialization_seam",
      gtlAbgTruth: "domain evidence expectations over ABG admitted evidence",
      overlayMeaning: "downstream proof interpretation extension slot"
    },
    {
      entryId: "seam.plugin_binding_refs",
      family: "specialization_seam",
      gtlAbgTruth: "plugin refs that supply data declarations or downstream interpretation",
      overlayMeaning: "downstream plugin binding slot"
    }
  ],
  forbiddenAuthority: [
    "gtl_graph_function_catalog",
    "abg_runtime_emitter",
    "admitted_ref_minting",
    "evidence_admission",
    "assurance_fold_projection",
    "residual_projection",
    "continuation_or_reentry_routing",
    "fp_worker_invocation",
    "odd_sdlc_phase_or_ledger_reproduction"
  ]
});

export const ODD_GLC_SOFTWARE_BUILD_OVERLAY = deepFreeze({
  kind: "odd_glc_software_build_overlay_graph",
  schemaVersion: "1",
  overlayRef: "overlay://odd_glc/software-build-lifecycle",
  graphRef: "graph://odd_glc/software-build-lifecycle",
  ownerRef: "product://odd_glc",
  scope: "reusable_software_build_lifecycle",
  rule: "gtl_overlay_graph_declaration_over_gtl_abg_truth",
  graphFunctionRefs: [
    "graph-function://odd_glc/software-build/bootstrap-worksite",
    "graph-function://odd_glc/software-build/materialize-artifact",
    "graph-function://odd_glc/software-build/prove-artifact",
    "graph-function://odd_glc/software-build/fan-in-branches"
  ],
  graphVectorRefs: [
    "graph-vector://odd_glc/software-build/context-to-requirements",
    "graph-vector://odd_glc/software-build/requirements-to-artifact",
    "graph-vector://odd_glc/software-build/artifact-to-evidence",
    "graph-vector://odd_glc/software-build/branches-to-artifact"
  ],
  publicStartTargets: [
    "graph-function://odd_glc/software-build/bootstrap-worksite"
  ],
  defaultStartTarget: "graph-function://odd_glc/software-build/bootstrap-worksite",
  slotRefs: [
    "surface.lifecycle_worksite",
    "surface.lifecycle_context",
    "surface.intent",
    "surface.product_definition",
    "surface.requirement_set",
    "surface.requirement_environment_view",
    "surface.instruction_set",
    "surface.target_artifact",
    "surface.capability",
    "surface.evidence_binding",
    "surface.assurance_fold_view",
    "surface.residual_pressure_view",
    "surface.reentry_decision",
    "view.lifecycle_state",
    "view.evidence_state",
    "view.assurance_state",
    "view.requirement_graph_state",
    "view.parallel_frontier_state",
    "view.release_readiness_state"
  ],
  roleRefs: [
    "software-build.role.source_artifact",
    "software-build.role.generated_artifact",
    "software-build.role.build_command",
    "software-build.role.scenario_surface",
    "software-build.role.design_surface",
    "software-build.role.implementation_design",
    "software-build.role.test_source",
    "software-build.role.test_execution",
    "software-build.role.service_process",
    "software-build.role.client_request",
    "software-build.role.parallel_branch",
    "software-build.role.branch_fan_in",
    "software-build.role.release_candidate",
    "software-build.role.build_config",
    "software-build.role.mapping_spec",
    "software-build.role.schema_source",
    "software-build.role.mapper_source",
    "software-build.role.mapper_validation_test",
    "software-build.role.mapper_build_config"
  ],
  policyRefs: [
    "policy.fp_semantic_judgment",
    "policy.fh_human_decision"
  ],
  pluginRefs: [
    "plugin://odd_glc/software-build-lifecycle"
  ],
  forbiddenAuthority: [
    "odd_sdlc_code_or_phase_flow",
    "product_local_runtime_shell",
    "graph_function_selection",
    "graph_call_opening",
    "event_emission",
    "evidence_admission",
    "requirement_fold_or_residual_projection",
    "continuation_or_reentry_routing"
  ]
});

export const ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS = deepFreeze([
  {
    entryRef: "gtl-library-entry://odd_glc/software-build/bootstrap-worksite",
    graphFunctionRef: "graph-function://odd_glc/software-build/bootstrap-worksite",
    interfaceRef: "interface://odd_glc/software-build/worksite-to-requirements",
    sourceContractRef: "contract://odd_glc/lifecycle-context",
    targetContractRef: "contract://odd_glc/requirement-pressure",
    overlayRefs: [
      ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
      "surface.lifecycle_context",
      "surface.requirement_set",
      "surface.requirement_environment_view"
    ],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/startup-bound"],
    proofRefs: ["proof.negative_boundary"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/software-build/materialize-artifact",
    graphFunctionRef: "graph-function://odd_glc/software-build/materialize-artifact",
    interfaceRef: "interface://odd_glc/software-build/requirements-to-artifact",
    sourceContractRef: "contract://odd_glc/requirement-pressure",
    targetContractRef: "contract://odd_glc/lifecycle-artifact",
    overlayRefs: [
      ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
      "surface.instruction_set",
      "surface.target_artifact",
      "surface.capability"
    ],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/bootstrap-traversal-required"],
    proofRefs: ["proof.fixture_of_record", "proof.live_run_reference"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/software-build/prove-artifact",
    graphFunctionRef: "graph-function://odd_glc/software-build/prove-artifact",
    interfaceRef: "interface://odd_glc/software-build/artifact-to-evidence",
    sourceContractRef: "contract://odd_glc/lifecycle-artifact",
    targetContractRef: "contract://odd_glc/execution-evidence",
    overlayRefs: [
      ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
      "surface.evidence_binding",
      "view.evidence_state",
      "view.assurance_state"
    ],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/evidence-route-required"],
    proofRefs: ["proof.fixture_of_record", "proof.live_run_reference"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  },
  {
    entryRef: "gtl-library-entry://odd_glc/software-build/fan-in-branches",
    graphFunctionRef: "graph-function://odd_glc/software-build/fan-in-branches",
    interfaceRef: "interface://odd_glc/software-build/branches-to-artifact",
    sourceContractRef: "contract://odd_glc/parallel-branch-artifacts",
    targetContractRef: "contract://odd_glc/lifecycle-artifact",
    overlayRefs: [
      ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef,
      "view.parallel_frontier_state",
      "surface.target_artifact",
      "surface.assurance_fold_view"
    ],
    policyRefs: ["policy.fp_semantic_judgment"],
    readinessRefs: ["readiness://odd_glc/abg-4.2/parallel-frontier-required"],
    proofRefs: ["proof.fixture_of_record", "proof.live_run_reference"],
    catalogReuseStatus: "abg_catalog_reuse_audit_required",
    genericity: "candidate_abg_system_function",
    reuseGate: "bind_existing_abg_catalog_entry_when_equivalent_exists"
  }
]);

export const ODD_GLC_STARTUP_BINDING = deepFreeze({
  kind: "odd_glc_startup_binding",
  schemaVersion: "1",
  configRef: "gtl-startup-config://odd_glc/abg-4.2/route-1",
  productNamespace: "odd_glc",
  ownerRef: "product://odd_glc",
  version: "0.0.0-source",
  enabledLibraryRefs: [
    "gtl-library://odd_glc/lifecycle-node-types",
    "gtl-library://odd_glc/software-build-node-types",
    "gtl-library://odd_glc/data-mapping-node-types",
    "gtl-library://odd_glc/software-build-graph-function-bindings",
    "gtl-library://odd_glc/bootstrap-graph-function-bindings",
    "gtl-library://odd_glc/deployment-graph-function-bindings"
  ],
  overlayRefs: [
    ...ODD_GLC_LIFECYCLE_SLOT_MAP.entries.map((entry) => entry.entryId),
    ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef
  ],
  pluginRefs: [
    "plugin://odd_glc/downstream-specialization-seam",
    "plugin://odd_glc/software-build-lifecycle"
  ],
  readinessRefs: [
    "readiness://odd_glc/abg-4.2-installed",
    "readiness://odd_glc/startup-declarations-only",
    "readiness://odd_glc/abg-catalog-reuse-audit-required"
  ],
  proofRefs: ["proof.negative_boundary"],
  policyRefs: ["policy.fp_semantic_judgment", "policy.fh_human_decision"],
  configSourceRefs: [
    "specification/PRODUCT.md",
    "build_tenants/common/design/ODD_GLC_LIFECYCLE_SLOT_MAP.md"
  ]
});

export const ODD_GLC_SOFTWARE_BUILD_STARTUP_BINDING = deepFreeze({
  kind: "odd_glc_software_build_startup_binding",
  schemaVersion: "1",
  configRef: "product-registry-startup://odd_glc/software-build-lifecycle",
  productNamespace: "odd_glc",
  ownerRef: "product://odd_glc",
  version: "0.0.0-source",
  overlayRefs: [ODD_GLC_SOFTWARE_BUILD_OVERLAY.overlayRef],
  pluginRefs: ODD_GLC_SOFTWARE_BUILD_OVERLAY.pluginRefs,
  readinessRefs: [
    "readiness://odd_glc/abg-4.2-installed",
    "readiness://odd_glc/software-build-bootstrap-traversal-required",
    "readiness://odd_glc/abg-catalog-reuse-audit-required"
  ],
  proofRefs: ["proof.fixture_of_record", "proof.live_run_reference", "proof.negative_boundary"],
  policyRefs: ODD_GLC_SOFTWARE_BUILD_OVERLAY.policyRefs,
  configSourceRefs: [
    "specification/PRODUCT.md",
    "build_tenants/common/design/ODD_GLC_ABG42_TYPED_STARTUP_BINDING.md",
    "build_tenants/common/design/ODD_GLC_GENERIC_PARITY_MATRIX.md"
  ],
  entryRefs: [
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
  ],
  declarationRefs: [
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
  ].map((entryRef) =>
    entryRef.replace("gtl-library-entry://odd_glc/", "gtl-declaration://odd_glc/")
  ),
  enabledLibraryRefs: [
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPE_LIBRARY_REFS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS.map((entry) => entry.entryRef)
  ].flatMap((entryRef) => [
    entryRef,
    entryRef.replace("gtl-library-entry://odd_glc/", "gtl-declaration://odd_glc/")
  ])
});

export const REQUIRED_EVIDENCE_EVENT_KINDS = Object.freeze([
  "actor_invocation_started",
  "actor_result_artifact_observed",
  "actor_invocation_closed",
  "evidence_admitted",
  "requirement_route_fact_projected"
]);

const TENANT_ID = "build_tenants/odd_glc/typescript";

function accepted(value, sourceRefs = []) {
  return Object.freeze({
    status: "accepted",
    value: deepFreeze(value),
    diagnostics: Object.freeze([]),
    sourceRefs: Object.freeze([...sourceRefs])
  });
}

function rejected(reason, diagnostics, sourceRefs = []) {
  return Object.freeze({
    status: "rejected",
    reason,
    diagnostics: Object.freeze([...diagnostics]),
    sourceRefs: Object.freeze([...sourceRefs])
  });
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (!isRecord(value) && !Array.isArray(value)) {
    return value;
  }
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
}

function containsFunction(value) {
  if (typeof value === "function") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some(containsFunction);
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).some(containsFunction);
}

export function validateAbgRequirementsFacade(facade) {
  if (!isRecord(facade)) {
    return rejected("malformed_input", ["ABG requirements facade must be an object"]);
  }

  const missing = REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS.filter(
    (name) => typeof facade[name] !== "function"
  );
  if (missing.length > 0) {
    return rejected(
      "missing_public_query",
      missing.map((name) => `Missing ABG public query function ${name}`),
      missing
    );
  }

  const forbidden = FORBIDDEN_ABG_REQUIREMENTS_AUTHORITIES.filter(
    (name) => Object.hasOwn(facade, name)
  );
  if (forbidden.length > 0) {
    return rejected(
      "forbidden_authority",
      forbidden.map((name) => `ABG runtime-internal authority is not a public odd_glc dependency: ${name}`),
      forbidden
    );
  }

  const availableFunctions = [
    ...REQUIRED_ABG_REQUIREMENTS_QUERY_FUNCTIONS,
    ...OPTIONAL_ABG_REQUIREMENTS_QUERY_FUNCTIONS.filter((name) => typeof facade[name] === "function")
  ];

  return accepted({
    kind: "abg_requirements_query_facade",
    availableFunctions: Object.freeze(availableFunctions)
  }, availableFunctions);
}

export function defineLifecycleSurfaceMap(input) {
  if (!isRecord(input) || !isRecord(input.surfaces)) {
    return rejected("malformed_input", ["Lifecycle surface map requires a surfaces object"]);
  }

  const missing = REQUIRED_ROUTE_ONE_SURFACES.filter(
    (surface) => typeof input.surfaces[surface] !== "string" || input.surfaces[surface].length === 0
  );
  if (missing.length > 0) {
    return rejected(
      "malformed_input",
      missing.map((surface) => `Missing route-1 lifecycle surface binding ${surface}`),
      missing
    );
  }

  return accepted({
    kind: "odd_glc_lifecycle_surface_map",
    surfaces: Object.freeze({ ...input.surfaces })
  }, Object.values(input.surfaces));
}

export function definePolicyOverlay(input) {
  if (!isRecord(input) || typeof input.id !== "string" || input.id.length === 0) {
    return rejected("malformed_input", ["Policy overlay requires a stable id"]);
  }
  const fp = isRecord(input.fp) ? input.fp : Object.freeze({});
  const fh = isRecord(input.fh) ? input.fh : Object.freeze({});
  if (containsFunction(fp) || containsFunction(fh)) {
    return rejected("forbidden_authority", ["F_P/F_H policy overlays must be data declarations, not executable authority"], [input.id]);
  }
  return accepted({
    kind: "odd_glc_policy_overlay",
    id: input.id,
    fp: Object.freeze({ ...fp }),
    fh: Object.freeze({ ...fh })
  }, [input.id]);
}

export function validateGtlAbg42DeclarationFacades(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["GTL declaration facades input must be an object"]);
  }

  const gtlM01Contracts = isRecord(input.gtlM01Contracts) ? input.gtlM01Contracts : {};
  const gtlM01Algebra = isRecord(input.gtlM01Algebra) ? input.gtlM01Algebra : {};
  const gtlM02Contracts = isRecord(input.gtlM02Contracts) ? input.gtlM02Contracts : {};
  const moduleSlots = {
    gtlM01Contracts,
    gtlM01Algebra,
    gtlM02Contracts
  };
  const missing = Object.entries(REQUIRED_GTL_DECLARATION_FACADE_SLOTS).flatMap(([slot, names]) => (
    names.filter((name) => typeof moduleSlots[slot][name] !== "function")
      .map((name) => ({ slot, name }))
  ));
  if (missing.length > 0) {
    return rejected(
      "missing_public_query",
      missing.map((row) => `Missing public GTL declaration function ${row.slot}.${row.name}`),
      missing.map((row) => row.name)
    );
  }

  const forbidden = Object.entries(moduleSlots).flatMap(([slot, facade]) => (
    FORBIDDEN_ABG_STARTUP_AUTHORITIES
      .filter((name) => Object.hasOwn(facade, name))
      .map((name) => `${slot}.${name}`)
  ));
  if (forbidden.length > 0) {
    return rejected(
      "forbidden_authority",
      forbidden.map((name) => `ABG startup/runtime authority is not an odd_glc declaration dependency: ${name}`),
      forbidden
    );
  }

  const required = Object.values(REQUIRED_GTL_DECLARATION_FACADE_SLOTS).flat();
  return accepted({
    kind: "gtl_abg42_declaration_facades",
    availableFunctions: Object.freeze(required)
  }, required);
}

function lifecycleNodeInit(entry) {
  return Object.freeze({
    name: entry.nodeName,
    schema: Object.freeze({
      kind: "symbolic",
      ref: "odd_glc.schema.lifecycle_asset"
    }),
    typeRef: entry.typeRef,
    markov: entry.markov,
    assetSurface: Object.freeze({
      kind: "lifecycle_asset",
      requiredContexts: Object.freeze(["workspace"]),
      standardsRefs: Object.freeze(["standard://odd_glc/lifecycle-node-model"]),
      outputContractRefs: Object.freeze([`contract://${entry.typeRef}`, `contract://odd_glc/${entry.assetKind}`]),
      constructorRefs: Object.freeze([`constructor://${entry.typeRef}`]),
      constructorInputAssetKinds: Object.freeze([]),
      rendererRefs: Object.freeze([]),
      renderedViewDigestPolicyRef: null,
      sectionKindRefs: Object.freeze([]),
      clauseKindRefs: Object.freeze([]),
      authoritySlots: Object.freeze([]),
      proofObligationRefs: Object.freeze(["proof.negative_boundary"])
    }),
    tags: entry.tags,
    id: `node://${entry.typeRef}`
  });
}

function libraryDeclarationInput(entry) {
  return Object.freeze({
    declarationRef: `gtl-declaration://odd_glc/${entry.entryRef}`,
    entryRef: entry.entryRef,
    libraryScope: "product",
    entryKind: "graph_function",
    namespace: "odd_glc",
    ownerRef: "product://odd_glc",
    version: "0.0.0-source",
    graphFunctionRef: entry.graphFunctionRef,
    interfaceRef: entry.interfaceRef,
    sourceContractRef: entry.sourceContractRef,
    targetContractRef: entry.targetContractRef,
    contextRefs: ["context://odd_glc/lifecycle"],
    authorityRefs: ["authority://abg/runtime-selection"],
    overlayRefs: entry.overlayRefs,
    provenanceRefs: ["provenance://abiogenesis/4.2.0-rc.1"],
    readinessRefs: entry.readinessRefs,
    proofRefs: entry.proofRefs,
    policyRefs: entry.policyRefs,
    declarationSourceRefs: [
      "gtl-declaration://odd_glc/startup-binding",
      entry.graphFunctionRef
    ]
  });
}

function overlayRefsForSurface(surface) {
  return uniqueStrings(ODD_GLC_LIFECYCLE_SLOT_MAP.entries
    .filter((entry) => entry.family === "lifecycle_surface" && entry.surface === surface)
    .map((entry) => entry.entryId));
}

function overlayRefsForNodeTypeEntry(entry) {
  if (Array.isArray(entry.overlayRefs) && entry.overlayRefs.length > 0) {
    return uniqueStrings(entry.overlayRefs);
  }
  const refs = overlayRefsForSurface(entry.surface);
  return refs.length > 0 ? refs : Object.freeze(["surface.lifecycle_worksite"]);
}

function allPrimitiveNodeTypeEntries() {
  return Object.freeze([
    ...ODD_GLC_LIFECYCLE_NODE_TYPES,
    ...ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
    ...ODD_GLC_DATA_MAPPING_NODE_TYPES
  ]);
}

function allComposedNodeTypeEntries() {
  return Object.freeze([
    ...ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES,
    ...ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES
  ]);
}

function overlayRefsForTypeRef(typeRef) {
  const primitiveEntry = allPrimitiveNodeTypeEntries().find((entry) => entry.typeRef === typeRef);
  if (primitiveEntry) {
    return overlayRefsForNodeTypeEntry(primitiveEntry);
  }
  const composedEntry = allComposedNodeTypeEntries().find((entry) => entry.typeRef === typeRef);
  return composedEntry ? overlayRefsForComposedNodeTypeEntry(composedEntry) : Object.freeze([]);
}

function overlayRefsForComposedNodeTypeEntry(entry) {
  if (Array.isArray(entry.overlayRefs) && entry.overlayRefs.length > 0) {
    return uniqueStrings(entry.overlayRefs);
  }
  return uniqueStrings(entry.constituentTypeRefs.flatMap(overlayRefsForTypeRef));
}

export function defineLifecycleNodeTypeDeclarations(input) {
  const validation = validateGtlAbg42DeclarationFacades(input);
  if (validation.status === "rejected") {
    return validation;
  }

  const contracts = input.gtlM01Contracts;
  const algebra = input.gtlM01Algebra;
  const m02 = input.gtlM02Contracts;
  const primitiveEntries = allPrimitiveNodeTypeEntries();
  const composedEntries = allComposedNodeTypeEntries();
  const nodes = primitiveEntries.map((entry) => contracts.constructNode(lifecycleNodeInit(entry)));
  const nodeTypeGraphFunctions = nodes.map((node, index) => algebra.constructNodeTypeGraphFunction(node, {
    typeRef: primitiveEntries[index].typeRef,
    tags: ["odd_glc", "node_type", "non_callable"]
  }));
  const compositionResults = composedEntries.map((entry) => algebra.composeNodeTypes({
    typeRef: entry.typeRef,
    constituentTypeRefs: entry.constituentTypeRefs,
    graphFunctions: nodeTypeGraphFunctions,
    name: entry.nodeName,
    tags: ["odd_glc", "node_type", "composed", "non_callable"]
  }));
  const failedCompositions = compositionResults.filter((result) => result.satisfied !== true);
  if (failedCompositions.length > 0) {
    return rejected(
      "abg_query_rejected",
      failedCompositions.map((result) => `GTL node-type composition rejected ${result.typeRef}: ${result.rejectionReason}`),
      failedCompositions.map((result) => result.typeRef)
    );
  }
  const composedGraphFunctions = compositionResults.map((result) => result.graphFunction).filter(Boolean);
  const allGraphFunctions = Object.freeze([...nodeTypeGraphFunctions, ...composedGraphFunctions]);
  const sourceEntriesByTypeRef = new Map(primitiveEntries.map((entry) => [entry.typeRef, entry]));
  const composedEntriesByTypeRef = new Map(composedEntries.map((entry) => [entry.typeRef, entry]));
  const libraryEntries = allGraphFunctions.map((graphFunction) => {
    const sourceEntry = sourceEntriesByTypeRef.get(graphFunction.name);
    const composedEntry = composedEntriesByTypeRef.get(graphFunction.name);
    const overlayRefs = sourceEntry
      ? overlayRefsForNodeTypeEntry(sourceEntry)
      : composedEntry
        ? overlayRefsForComposedNodeTypeEntry(composedEntry)
        : Object.freeze(["surface.lifecycle_worksite"]);
    return m02.constructGtlLibraryEntryDeclaration({
    declarationRef: `gtl-declaration://odd_glc/node-type/${graphFunction.name}`,
    entryRef: `gtl-library-entry://odd_glc/node-type/${graphFunction.name}`,
    libraryScope: "product",
    entryKind: "node_type",
    namespace: "odd_glc",
    ownerRef: "product://odd_glc",
    version: "0.0.0-source",
    graphFunctionRef: graphFunction.id,
    interfaceRef: `interface://odd_glc/node-type/${graphFunction.name}`,
    sourceContractRef: `contract://odd_glc/node-type/${graphFunction.name}`,
    targetContractRef: `contract://odd_glc/node-type/${graphFunction.name}`,
    contextRefs: ["context://odd_glc/lifecycle"],
    authorityRefs: ["authority://gtl/node-type/non-callable"],
    overlayRefs,
    provenanceRefs: ["provenance://abiogenesis/4.2.0-rc.1"],
    readinessRefs: ["readiness://odd_glc/node-type-declared"],
    proofRefs: ["proof.negative_boundary"],
    policyRefs: [],
    declarationSourceRefs: [
      "gtl-declaration://odd_glc/lifecycle-node-types",
      graphFunction.id
    ]
  });
  });

  return accepted({
    kind: "odd_glc_lifecycle_node_type_declarations",
    nodeTypeEntries: ODD_GLC_LIFECYCLE_NODE_TYPES,
    softwareBuildNodeTypeEntries: ODD_GLC_SOFTWARE_BUILD_NODE_TYPES,
    dataMappingNodeTypeEntries: ODD_GLC_DATA_MAPPING_NODE_TYPES,
    allNodeTypeEntries: primitiveEntries,
    composedNodeTypeEntries: ODD_GLC_COMPOSED_LIFECYCLE_NODE_TYPES,
    dataMappingComposedNodeTypeEntries: ODD_GLC_DATA_MAPPING_COMPOSED_NODE_TYPES,
    allComposedNodeTypeEntries: composedEntries,
    nodes: Object.freeze(nodes),
    graphFunctions: allGraphFunctions,
    compositionResults: Object.freeze(compositionResults),
    libraryEntries: Object.freeze(libraryEntries)
  }, libraryEntries.map((entry) => entry.entryRef));
}

export function defineOddGlcStartupBinding(input) {
  const validation = validateGtlAbg42DeclarationFacades(input);
  if (validation.status === "rejected") {
    return validation;
  }
  const m02 = input.gtlM02Contracts;
  const graphFunctionBindings = [
    ...ODD_GLC_PRODUCT_GRAPH_FUNCTION_BINDINGS,
    ...ODD_GLC_SOFTWARE_BUILD_GRAPH_FUNCTION_BINDINGS
  ].map((entry) => (
    m02.constructGtlLibraryEntryDeclaration(libraryDeclarationInput(entry))
  ));
  const startupConfig = m02.constructProductRegistryStartupConfig(ODD_GLC_STARTUP_BINDING);
  const pluginAdvice = m02.constructProductPluginSelectionAdvice({
    adviceRef: "plugin-advice://odd_glc/downstream-specialization-seam/no-preference",
    pluginRef: "plugin://odd_glc/downstream-specialization-seam",
    lookupResultRef: "registry-lookup-result://abg/runtime-owned",
    preferredCandidateRef: null,
    rankedCandidateRefs: [],
    constraintRefs: ["constraint://odd_glc/no-local-selection-authority"],
    rationaleRef: "rationale://odd_glc/plugin-advice-is-advisory",
    policyRefs: ["policy.fp_semantic_judgment", "policy.fh_human_decision"],
    forbiddenAuthorityRefs: FORBIDDEN_ABG_STARTUP_AUTHORITIES
  });
  return accepted({
    kind: "odd_glc_startup_declaration_binding",
    startupConfig,
    libraryEntries: Object.freeze(graphFunctionBindings),
    pluginAdvice,
    overlayRefs: ODD_GLC_STARTUP_BINDING.overlayRefs
  }, [
    startupConfig.configRef,
    ...graphFunctionBindings.map((entry) => entry.entryRef),
    pluginAdvice.adviceRef
  ]);
}

function runtimeDispositionFacts(runtimeEvents) {
  if (!Array.isArray(runtimeEvents)) {
    return Object.freeze([]);
  }
  return Object.freeze(runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_lifecycle_disposition" ||
      !isRecord(event.requirementPayload) ||
      event.requirementPayload.kind !== "requirement_lifecycle_disposition" ||
      event.requirementPayload.dispositionRef !== event.routePayloadRef
    ) {
      return [];
    }
    return [Object.freeze({
      kind: "requirement_lifecycle_disposition",
      ref: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      payload: event.requirementPayload
    })];
  }));
}

function eventRefFor(event) {
  if (!isRecord(event)) {
    return null;
  }
  return event.eventId ?? event.routeEventRef ?? event.eventRef ?? null;
}

function stringOrNull(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function uniqueStrings(values) {
  return Object.freeze([...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]);
}

export function interpretStartupRegistryState(input) {
  const runtimeEvents = Array.isArray(input?.runtimeEvents) ? input.runtimeEvents : [];
  const proof = isRecord(input?.proof) ? input.proof : {};
  const liveArtifacts = Array.isArray(input?.liveArtifacts) ? input.liveArtifacts : [];
  const registryEntries = runtimeEvents.filter((event) => isRecord(event) && event.kind === "registry_entry_admitted");
  const selections = runtimeEvents.filter((event) => isRecord(event) && event.kind === "graph_function_selected");
  const graphCalls = runtimeEvents.filter((event) => isRecord(event) && event.kind === "graph_call_opened");
  const vectorClosed = runtimeEvents.filter((event) => isRecord(event) && event.kind === "vector_closed");
  const nodeTypeEntryRefs = uniqueStrings(registryEntries
    .filter((event) => event.entryKind === "node_type")
    .map((event) => event.entryRef));
  const graphFunctionEntryRefs = uniqueStrings(registryEntries
    .filter((event) => event.entryKind === "graph_function")
    .map((event) => event.entryRef));
  const selectedEntryKinds = uniqueStrings(selections.map((event) => event.selectedEntryKind));
  const selectedGraphFunctionRefs = uniqueStrings(selections.map((event) => event.selectedGraphFunctionRef));
  const graphCallIds = uniqueStrings(graphCalls.map((event) => event.graphCallId));
  const vectorClosedRefs = uniqueStrings(vectorClosed.map((event) => event.eventId ?? event.eventRef ?? event.vectorRef));
  const stdoutValues = uniqueStrings(liveArtifacts
    .map((artifact) => isRecord(artifact) && isRecord(artifact.execution) ? artifact.execution.stdout : null));
  let readiness = "no_startup_truth";
  if (registryEntries.length > 0) {
    readiness = "registry_admitted";
  }
  if (selections.length > 0 && graphCalls.length > 0) {
    readiness = "graph_function_selected";
  }
  if (proof.status === "converged" || (isRecord(proof.startOutput) && proof.startOutput.status === "converged")) {
    readiness = "traversal_converged";
  }

  return accepted({
    kind: "odd_glc_startup_registry_state_view",
    tenant: TENANT_ID,
    readiness,
    registryEntryCount: registryEntries.length,
    nodeTypeEntryRefs,
    graphFunctionEntryRefs,
    selectionRefs: uniqueStrings(selections.map((event) => event.selectionRef)),
    selectedEntryKinds,
    selectedGraphFunctionRefs,
    graphCallIds,
    vectorClosedRefs,
    stdoutValues,
    eventKinds: uniqueStrings(runtimeEvents.map((event) => event.kind)),
    sourceEventRefs: uniqueStrings(runtimeEvents.map(eventRefFor)),
    abgStartOutput: proof.startOutput ?? null
  }, [
    ...nodeTypeEntryRefs,
    ...graphFunctionEntryRefs,
    ...selectedGraphFunctionRefs,
    ...graphCallIds
  ]);
}

function routeEvidenceBindings(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_evidence_bound" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.binding)
    ) {
      return [];
    }
    const binding = event.requirementPayload.binding;
    return [Object.freeze({
      evidenceRef: binding.evidenceRef,
      requirementId: binding.requirementId,
      projectionRef: binding.projectionRef,
      evidenceRole: binding.evidenceRole,
      bindingStatus: binding.bindingStatus,
      digest: binding.digest,
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function routeFoldEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_fold_projected" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.fold)
    ) {
      return [];
    }
    const fold = event.requirementPayload.fold;
    return [Object.freeze({
      foldRef: fold.foldRef,
      requirementId: fold.requirementId,
      requirementProjectionRef: fold.requirementProjectionRef,
      state: fold.state,
      evidenceRefs: Object.freeze(Array.isArray(fold.evidenceRefs) ? [...fold.evidenceRefs] : []),
      evidenceBindingRefs: Object.freeze(Array.isArray(fold.evidenceBindingRefs) ? [...fold.evidenceBindingRefs] : []),
      sourceAbgTruthRefs: Object.freeze(Array.isArray(fold.sourceAbgTruthRefs) ? [...fold.sourceAbgTruthRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function routeResidualEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_residual_projected" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.residual)
    ) {
      return [];
    }
    const residual = event.requirementPayload.residual;
    return [Object.freeze({
      residualRef: residual.residualRef,
      requirementId: residual.requirementId,
      requirementProjectionRef: residual.requirementProjectionRef,
      foldRef: residual.foldRef,
      pressureClass: residual.pressureClass,
      ownerSurface: residual.ownerSurface,
      evidenceRefs: Object.freeze(Array.isArray(residual.evidenceRefs) ? [...residual.evidenceRefs] : []),
      sourceFoldRefs: Object.freeze(Array.isArray(residual.sourceFoldRefs) ? [...residual.sourceFoldRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      residual
    })];
  });
}

function routeTermEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_term_admitted" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.term)
    ) {
      return [];
    }
    const term = event.requirementPayload.term;
    return [Object.freeze({
      requirementId: term.requirementId,
      stableId: term.stableId,
      termKind: term.termKind,
      sourceRef: term.sourceRef,
      sourceDigest: term.sourceDigest,
      relationRefs: Object.freeze(Array.isArray(term.relationRefs) ? [...term.relationRefs] : []),
      spanRefs: Object.freeze(Array.isArray(term.spanRefs) ? [...term.spanRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      term
    })];
  });
}

function routeRelationEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_relation_admitted" ||
      !isRecord(event.requirementPayload) ||
      !isRecord(event.requirementPayload.relation)
    ) {
      return [];
    }
    const relation = event.requirementPayload.relation;
    return [Object.freeze({
      relationId: relation.relationId,
      relationKind: relation.relationKind,
      fromRequirementId: relation.fromRequirementId,
      toRequirementId: relation.toRequirementId,
      evidenceRefs: Object.freeze(Array.isArray(relation.evidenceRefs) ? [...relation.evidenceRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef,
      relation
    })];
  });
}

function routeDispositionEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (
      !isRecord(event) ||
      event.kind !== "requirement_route_fact_projected" ||
      event.routePayloadKind !== "requirement_lifecycle_disposition" ||
      !isRecord(event.requirementPayload)
    ) {
      return [];
    }
    return [Object.freeze({
      dispositionRef: event.requirementPayload.dispositionRef,
      disposition: event.requirementPayload.disposition,
      residualRefs: Object.freeze(Array.isArray(event.requirementPayload.residualRefs) ? [...event.requirementPayload.residualRefs] : []),
      continuationRefs: Object.freeze(Array.isArray(event.requirementPayload.continuationRefs) ? [...event.requirementPayload.continuationRefs] : []),
      reentryRefs: Object.freeze(Array.isArray(event.requirementPayload.reentryRefs) ? [...event.requirementPayload.reentryRefs] : []),
      routePayloadRef: event.routePayloadRef,
      sourceEventRef: event.routeEventRef
    })];
  });
}

function admittedEvidence(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (!isRecord(event) || event.kind !== "evidence_admitted") {
      return [];
    }
    return [Object.freeze({
      evidenceRef: event.evidenceRef,
      payloadRef: event.payloadRef,
      authorityRef: event.authorityRef,
      authorityDigest: event.authorityDigest,
      inputDigest: event.inputDigest,
      complete: event.complete === true,
      deferred: event.deferred === true,
      contradictsAuthority: event.contradictsAuthority === true,
      providerRefs: Object.freeze(Array.isArray(event.providerRefs) ? [...event.providerRefs] : []),
      policyRefs: Object.freeze(Array.isArray(event.policyRefs) ? [...event.policyRefs] : []),
      sourceEventRef: eventRefFor(event)
    })];
  });
}

function branchFrontierEvents(runtimeEvents) {
  return runtimeEvents.flatMap((event) => {
    if (!isRecord(event)) {
      return [];
    }
    if (
      event.kind !== "branch_lease_acquired" &&
      event.kind !== "branch_payload_admitted" &&
      event.kind !== "branch_lease_released" &&
      event.kind !== "branch_fan_in_projected"
    ) {
      return [];
    }
    return [event];
  });
}

function branchPayloadRows(events) {
  return Object.freeze(events
    .filter((event) => event.kind === "branch_payload_admitted")
    .map((event) => Object.freeze({
      branchRef: event.branchRef,
      payloadDigest: event.payloadDigest,
      evidenceRefs: Object.freeze(Array.isArray(event.evidenceRefs) ? [...event.evidenceRefs] : []),
      sourceEventRef: eventRefFor(event)
    })));
}

function fanInRows(events) {
  return Object.freeze(events
    .filter((event) => event.kind === "branch_fan_in_projected")
    .map((event) => Object.freeze({
      fanInRef: event.fanInRef,
      orderedBranchRefs: Object.freeze(Array.isArray(event.orderedBranchRefs) ? [...event.orderedBranchRefs] : []),
      evidenceRefs: Object.freeze(Array.isArray(event.evidenceRefs) ? [...event.evidenceRefs] : []),
      sourceEventRef: eventRefFor(event)
    })));
}

function graphDisposition(requirementGraph, aggregateStates) {
  if (!isRecord(requirementGraph)) {
    return "no_requirement_graph";
  }
  if (aggregateStates.some((state) =>
    isRecord(state) &&
    state.state === "partial" &&
    Array.isArray(state.residualRefs) &&
    state.residualRefs.length > 0
  )) {
    return "aggregate_residual_pressure";
  }
  if (aggregateStates.length > 0 && aggregateStates.every((state) =>
    isRecord(state) && state.state === "satisfied"
  )) {
    return "aggregate_satisfied";
  }
  return "requirement_graph_projected";
}

function spanLineageRows(lifecycleState) {
  if (!isRecord(lifecycleState) || !Array.isArray(lifecycleState.spanLineage)) {
    return Object.freeze([]);
  }
  return Object.freeze(lifecycleState.spanLineage
    .filter(isRecord)
    .map((lineage) => deepFreeze({ ...lineage })));
}

function graphSpanReplayEvents(lifecycleState) {
  if (
    !isRecord(lifecycleState) ||
    !isRecord(lifecycleState.graphSpanReplay) ||
    !Array.isArray(lifecycleState.graphSpanReplay.events)
  ) {
    return Object.freeze([]);
  }
  return Object.freeze(lifecycleState.graphSpanReplay.events
    .filter(isRecord)
    .map((event) => deepFreeze({ ...event })));
}

function recursiveRuntimeSpanEvents(runtimeEvents) {
  const recursiveKinds = new Set([
    "frame_opened",
    "zoom_frame_opened",
    "graph_span_foldback_evaluated",
    "graph_reentry_planned",
    "graph_reentry_applied"
  ]);
  return Object.freeze(runtimeEvents
    .filter((event) => isRecord(event) && recursiveKinds.has(event.kind))
    .map((event) => deepFreeze({ ...event })));
}

function spanReadiness(lineage, graphEvents, runtimeEvents) {
  if (lineage.length === 0 && graphEvents.length === 0 && runtimeEvents.length === 0) {
    return "no_span_lineage_truth";
  }
  const frameRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.frameRefs) ? row.frameRefs : []));
  const zoomRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.zoomRefs) ? row.zoomRefs : []));
  const foldbackRefs = uniqueStrings(lineage.flatMap((row) => Array.isArray(row.foldbackRefs) ? row.foldbackRefs : []));
  const runtimeKinds = uniqueStrings(runtimeEvents.map((event) => event.kind));
  if (
    frameRefs.length > 1 &&
    zoomRefs.length > 0 &&
    foldbackRefs.length > 0 &&
    runtimeKinds.includes("graph_reentry_planned") &&
    runtimeKinds.includes("graph_reentry_applied")
  ) {
    return "recursive_span_ready";
  }
  if (frameRefs.length > 1 || zoomRefs.length > 0 || foldbackRefs.length > 0 || graphEvents.length > 0) {
    return "span_lineage_projected";
  }
  return "single_frame_span_projected";
}

function executivePressureRows(runtimeEvents, pressureEvents) {
  const rows = new Map();
  const candidates = [
    ...(Array.isArray(runtimeEvents) ? runtimeEvents : []),
    ...(Array.isArray(pressureEvents) ? pressureEvents : [])
  ];
  for (const event of candidates) {
    if (!isRecord(event)) {
      continue;
    }
    const fact = isRecord(event.executivePressureFact)
      ? event.executivePressureFact
      : event.kind === "abg_executive_pressure_fact_projection"
        ? event
        : null;
    if (!isRecord(fact) || fact.kind !== "abg_executive_pressure_fact_projection") {
      continue;
    }
    const pressureFactRef = fact.pressureFactRef;
    if (typeof pressureFactRef !== "string" || pressureFactRef.length === 0) {
      continue;
    }
    rows.set(pressureFactRef, Object.freeze({
      pressureFactRef,
      observationRef: fact.observationRef,
      disposition: fact.disposition,
      closeDisposition: fact.closeDisposition,
      attenuation: fact.attenuation,
      requirementIds: Object.freeze(Array.isArray(fact.requirementIds) ? [...fact.requirementIds] : []),
      residualPressureRefs: Object.freeze(Array.isArray(fact.residualPressureRefs) ? [...fact.residualPressureRefs] : []),
      continuationRefs: Object.freeze(Array.isArray(fact.continuationRefs) ? [...fact.continuationRefs] : []),
      evidenceRefs: Object.freeze(Array.isArray(fact.evidenceRefs) ? [...fact.evidenceRefs] : []),
      diagnosticRefs: Object.freeze(Array.isArray(fact.diagnosticRefs) ? [...fact.diagnosticRefs] : []),
      spanRefs: Object.freeze(Array.isArray(fact.spanRefs) ? [...fact.spanRefs] : []),
      sourceEventRef: eventRefFor(event),
      fact
    }));
  }
  return Object.freeze([...rows.values()]);
}

function pressureDisposition(rows) {
  if (rows.length === 0) {
    return "no_pressure";
  }
  const dispositions = rows.map((row) => row.disposition);
  const closeDispositions = rows.map((row) => row.closeDisposition);
  if (dispositions.includes("blocked") || closeDispositions.includes("block")) {
    return "blocked";
  }
  if (
    dispositions.includes("nonlocal_reentry") ||
    dispositions.includes("reentry_available") ||
    closeDispositions.includes("reprice")
  ) {
    return "reprice_required";
  }
  if (rows.some((row) => row.residualPressureRefs.length > 0 || row.continuationRefs.length > 0)) {
    return "local_repair_available";
  }
  if (closeDispositions.includes("close")) {
    return "close_candidate";
  }
  return "pressure_observed";
}

function releaseReadiness(lifecycleStateView, assuranceStateView, evidenceStateView) {
  const lifecycleDisposition = isRecord(lifecycleStateView)
    ? lifecycleStateView.lifecycleDisposition
    : "no_disposition";
  const assurance = isRecord(assuranceStateView)
    ? assuranceStateView.assuranceDisposition
    : "no_assurance";
  const evidence = isRecord(evidenceStateView)
    ? evidenceStateView.evidenceDisposition
    : "no_evidence";
  if (lifecycleDisposition === "blocked" || assurance === "assurance_blocked") {
    return "blocked";
  }
  if (
    lifecycleDisposition === "continuation_available" ||
    lifecycleDisposition === "reentry_available" ||
    assurance === "residual_pressure" ||
    assurance === "assurance_partial"
  ) {
    return "not_ready_residual";
  }
  if (
    lifecycleDisposition === "release_readiness_candidate" &&
    assurance === "assurance_satisfied" &&
    evidence === "admitted_bound_and_executed"
  ) {
    return "ready_candidate";
  }
  return "not_ready";
}

function actorInvocationViews(runtimeEvents) {
  const byInvocation = new Map();
  for (const event of runtimeEvents) {
    if (!isRecord(event) || typeof event.actorInvocationId !== "string") {
      continue;
    }
    if (
      event.kind !== "actor_invocation_started" &&
      event.kind !== "actor_result_artifact_observed" &&
      event.kind !== "actor_invocation_closed"
    ) {
      continue;
    }
    const current = byInvocation.get(event.actorInvocationId) ?? {
      actorInvocationId: event.actorInvocationId,
      workerId: null,
      backendId: null,
      dispatchRef: null,
      resultRef: null,
      artifactRef: null,
      closureStatus: null,
      edge: null,
      sourceEventRefs: []
    };
    current.workerId = current.workerId ?? stringOrNull(event.workerId);
    current.backendId = current.backendId ?? stringOrNull(event.backendId);
    current.dispatchRef = current.dispatchRef ?? stringOrNull(event.dispatchRef);
    current.resultRef = current.resultRef ?? stringOrNull(event.resultRef);
    current.artifactRef = current.artifactRef ?? stringOrNull(event.artifactRef);
    current.closureStatus = current.closureStatus ?? stringOrNull(event.closureStatus);
    current.edge = current.edge ?? stringOrNull(event.edge);
    const sourceEventRef = eventRefFor(event);
    if (sourceEventRef !== null) {
      current.sourceEventRefs.push(sourceEventRef);
    }
    byInvocation.set(event.actorInvocationId, current);
  }
  return Object.freeze([...byInvocation.values()].map((entry) => Object.freeze({
    ...entry,
    sourceEventRefs: uniqueStrings(entry.sourceEventRefs)
  })));
}

function evidenceDisposition(evidence, bindings, invocations) {
  const completeEvidence = evidence.filter((item) =>
    item.complete && !item.deferred && !item.contradictsAuthority
  );
  const admittedBindings = bindings.filter((item) => item.bindingStatus === "admitted");
  const completedInvocations = invocations.filter((item) => item.closureStatus === "completed");
  if (completeEvidence.length > 0 && admittedBindings.length > 0 && completedInvocations.length > 0) {
    return "admitted_bound_and_executed";
  }
  if (completeEvidence.length > 0 && admittedBindings.length > 0) {
    return "admitted_and_bound";
  }
  if (completeEvidence.length > 0) {
    return "admitted_unbound";
  }
  if (admittedBindings.length > 0) {
    return "bound_without_runtime_evidence";
  }
  return "no_evidence";
}

function assuranceDisposition(folds, residuals, dispositions) {
  if (residuals.length > 0) {
    return "residual_pressure";
  }
  const foldStates = folds.map((fold) => fold.state);
  if (foldStates.includes("failed")) {
    return "assurance_failed";
  }
  if (foldStates.includes("blocked")) {
    return "assurance_blocked";
  }
  if (foldStates.includes("partial")) {
    return "assurance_partial";
  }
  if (foldStates.includes("satisfied")) {
    return "assurance_satisfied";
  }
  if (dispositions.some((disposition) => disposition.disposition === "blocked")) {
    return "assurance_blocked";
  }
  return "no_assurance";
}

function dispositionPayloadsFor(readModel, replayFacts, runtimeEvents) {
  const facts = Object.freeze([
    ...(Array.isArray(replayFacts) ? replayFacts : []),
    ...runtimeDispositionFacts(runtimeEvents)
  ]);
  return readModel.dispositionRefs.map((ref) => {
    const fact = facts.find((candidate) => (
      isRecord(candidate) &&
      candidate.kind === "requirement_lifecycle_disposition" &&
      candidate.ref === ref
    ));
    return isRecord(fact) ? fact.payload : null;
  }).filter((payload) => payload !== null);
}

function interpretDisposition(dispositions) {
  if (dispositions.length === 0) {
    return "no_disposition";
  }
  const kinds = dispositions.map((payload) => isRecord(payload) ? payload.disposition : null);
  if (kinds.includes("blocked")) {
    return "blocked";
  }
  if (kinds.includes("reentry_available")) {
    return "reentry_available";
  }
  if (kinds.includes("continuation_available")) {
    return "continuation_available";
  }
  if (kinds.includes("closed")) {
    return "release_readiness_candidate";
  }
  return "no_disposition";
}

export function interpretLifecycleState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Lifecycle interpretation requires an input object"]);
  }

  const facade = validateAbgRequirementsFacade(input.abgRequirements);
  if (facade.status === "rejected") {
    return facade;
  }

  const queryInput = {
    query: input.query,
    dispositionRefs: Array.isArray(input.dispositionRefs) ? Object.freeze([...input.dispositionRefs]) : Object.freeze([]),
    replayFacts: Array.isArray(input.replayFacts) ? Object.freeze([...input.replayFacts]) : Object.freeze([]),
    runtimeEvents: Array.isArray(input.runtimeEvents) ? Object.freeze([...input.runtimeEvents]) : Object.freeze([])
  };

  const routeResult = input.abgRequirements.projectLifecycleState(queryInput);
  if (!isRecord(routeResult) || routeResult.status !== "accepted") {
    return rejected(
      "abg_query_rejected",
      isRecord(routeResult) && Array.isArray(routeResult.diagnostics)
        ? routeResult.diagnostics
        : ["ABG projectLifecycleState rejected or returned a malformed result"],
      isRecord(routeResult) && Array.isArray(routeResult.sourceRefs) ? routeResult.sourceRefs : []
    );
  }

  const readModel = routeResult.value;
  if (!isRecord(readModel) || readModel.kind !== "requirement_lifecycle_state_read_model") {
    return rejected("abg_query_rejected", ["ABG lifecycle state query returned an unexpected read model"]);
  }

  const interpretedDispositions = dispositionPayloadsFor(
    readModel,
    queryInput.replayFacts,
    queryInput.runtimeEvents
  );
  const requirementIds = isRecord(readModel.requirementQuery) && Array.isArray(readModel.requirementQuery.requirementIds)
    ? readModel.requirementQuery.requirementIds
    : [];

  return accepted({
    kind: "odd_glc_lifecycle_state_view",
    tenant: TENANT_ID,
    lifecycleDisposition: interpretDisposition(interpretedDispositions),
    requirementIds: Object.freeze([...requirementIds]),
    dispositionRefs: Object.freeze([...(readModel.dispositionRefs ?? [])]),
    sourceEventRefs: Object.freeze([...(readModel.sourceEventRefs ?? [])]),
    sourceProjectionRefs: Object.freeze([...(readModel.sourceProjectionRefs ?? [])]),
    interpretedDispositions: Object.freeze(interpretedDispositions),
    surfaceMap: input.surfaceMap ?? null,
    policyOverlayId: input.policyOverlay?.id ?? null,
    abgReadModel: readModel
  }, [
    ...requirementIds,
    ...(readModel.dispositionRefs ?? []),
    ...(readModel.sourceEventRefs ?? [])
  ]);
}

export function interpretEvidenceState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Evidence interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const bindings = routeEvidenceBindings(runtimeEvents);
  const evidence = admittedEvidence(runtimeEvents);
  const invocations = actorInvocationViews(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...bindings.map((item) => item.sourceEventRef),
    ...evidence.map((item) => item.sourceEventRef),
    ...invocations.flatMap((item) => item.sourceEventRefs)
  ]);
  const targetArtifactRefs = uniqueStrings(invocations.map((item) => item.artifactRef));
  const capabilityRefs = uniqueStrings(invocations.flatMap((item) => [
    item.workerId,
    item.backendId,
    item.dispatchRef
  ]));

  return accepted({
    kind: "odd_glc_evidence_state_view",
    tenant: TENANT_ID,
    evidenceDisposition: evidenceDisposition(evidence, bindings, invocations),
    targetArtifactRefs,
    capabilityRefs,
    actorInvocations: invocations,
    admittedEvidence: Object.freeze(evidence),
    requirementEvidenceBindings: Object.freeze(bindings),
    sourceEventRefs,
    runtimeEventCount: runtimeEvents.length
  }, [
    ...targetArtifactRefs,
    ...capabilityRefs,
    ...sourceEventRefs
  ]);
}

export function interpretParallelFrontierState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Parallel frontier interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const events = branchFrontierEvents(runtimeEvents);
  const branchPayloads = branchPayloadRows(events);
  const fanIns = fanInRows(events);
  const acquiredBranchRefs = uniqueStrings(events
    .filter((event) => event.kind === "branch_lease_acquired")
    .map((event) => event.branchRef));
  const releasedBranchRefs = uniqueStrings(events
    .filter((event) => event.kind === "branch_lease_released")
    .map((event) => event.branchRef));
  const aggregateStates = Object.freeze(
    Array.isArray(lifecycleState.aggregateStates)
      ? lifecycleState.aggregateStates.map((state) => deepFreeze({ ...state }))
      : []
  );
  const requirementGraph = isRecord(lifecycleState.requirementGraph)
    ? lifecycleState.requirementGraph
    : null;
  const readiness =
    fanIns.length > 0 && branchPayloads.length > 0
      ? "fan_in_ready"
      : branchPayloads.length > 0
        ? "branch_payloads_admitted"
        : acquiredBranchRefs.length > 0
          ? "frontier_started"
          : "no_frontier_truth";

  return accepted({
    kind: "odd_glc_parallel_frontier_state_view",
    tenant: TENANT_ID,
    readiness,
    branchRefs: uniqueStrings([
      ...acquiredBranchRefs,
      ...releasedBranchRefs,
      ...branchPayloads.map((row) => row.branchRef),
      ...fanIns.flatMap((row) => row.orderedBranchRefs)
    ]),
    acquiredBranchRefs,
    releasedBranchRefs,
    branchPayloads,
    fanIns,
    fanInRefs: uniqueStrings(fanIns.map((row) => row.fanInRef)),
    payloadDigests: uniqueStrings(branchPayloads.map((row) => row.payloadDigest)),
    evidenceRefs: uniqueStrings([
      ...branchPayloads.flatMap((row) => row.evidenceRefs),
      ...fanIns.flatMap((row) => row.evidenceRefs)
    ]),
    aggregateStates,
    requirementGraph,
    sourceEventRefs: uniqueStrings(events.map((event) => eventRefFor(event)))
  }, [
    ...events.map((event) => eventRefFor(event)),
    ...branchPayloads.map((row) => row.payloadDigest),
    ...fanIns.map((row) => row.fanInRef)
  ]);
}

export function interpretRequirementGraphState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Requirement graph interpretation requires an input object"]);
  }
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const requirementGraph = isRecord(lifecycleState.requirementGraph)
    ? lifecycleState.requirementGraph
    : null;
  const aggregateStates = Object.freeze(
    Array.isArray(lifecycleState.aggregateStates)
      ? lifecycleState.aggregateStates.filter(isRecord).map((state) => deepFreeze({ ...state }))
      : []
  );
  const terms = routeTermEvents(runtimeEvents);
  const relations = routeRelationEvents(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleState.sourceEventRefs) ? lifecycleState.sourceEventRefs : []),
    ...terms.map((term) => term.sourceEventRef),
    ...relations.map((relation) => relation.sourceEventRef)
  ]);

  return accepted({
    kind: "odd_glc_requirement_graph_state_view",
    tenant: TENANT_ID,
    graphDisposition: graphDisposition(requirementGraph, aggregateStates),
    graphRef: requirementGraph?.graphRef ?? null,
    requirementIds: uniqueStrings([
      ...(Array.isArray(requirementGraph?.requirementIds) ? requirementGraph.requirementIds : []),
      ...terms.map((term) => term.requirementId)
    ]),
    rootRequirementIds: uniqueStrings(Array.isArray(requirementGraph?.rootRequirementIds) ? requirementGraph.rootRequirementIds : []),
    leafRequirementIds: uniqueStrings(Array.isArray(requirementGraph?.leafRequirementIds) ? requirementGraph.leafRequirementIds : []),
    relationRefs: uniqueStrings([
      ...(Array.isArray(requirementGraph?.relationRefs) ? requirementGraph.relationRefs : []),
      ...relations.map((relation) => relation.relationId)
    ]),
    parentChildPairs: Object.freeze(Array.isArray(requirementGraph?.parentChildPairs)
      ? requirementGraph.parentChildPairs.filter(isRecord).map((pair) => deepFreeze({ ...pair }))
      : []),
    aggregateStates,
    residualRefs: uniqueStrings(aggregateStates.flatMap((state) => Array.isArray(state.residualRefs) ? state.residualRefs : [])),
    terms: Object.freeze(terms),
    relations: Object.freeze(relations),
    sourceRefs: uniqueStrings([
      ...(Array.isArray(requirementGraph?.sourceRefs) ? requirementGraph.sourceRefs : []),
      ...terms.map((term) => term.sourceRef),
      ...relations.map((relation) => relation.relationId)
    ]),
    sourceEventRefs,
    abgRequirementGraph: requirementGraph
  }, [
    requirementGraph?.graphRef,
    ...sourceEventRefs,
    ...(Array.isArray(requirementGraph?.sourceRefs) ? requirementGraph.sourceRefs : [])
  ]);
}

export function interpretRecursiveSpanState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Recursive span interpretation requires an input object"]);
  }
  const lifecycleState = isRecord(input.lifecycleState) ? input.lifecycleState : Object.freeze({});
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const lineage = spanLineageRows(lifecycleState);
  const graphEvents = graphSpanReplayEvents(lifecycleState);
  const recursiveEvents = recursiveRuntimeSpanEvents(runtimeEvents);
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleState.sourceEventRefs) ? lifecycleState.sourceEventRefs : []),
    ...graphEvents.map((event) => eventRefFor(event)),
    ...recursiveEvents.map((event) => eventRefFor(event))
  ]);

  return accepted({
    kind: "odd_glc_recursive_span_state_view",
    tenant: TENANT_ID,
    readiness: spanReadiness(lineage, graphEvents, recursiveEvents),
    spanLineageRefs: uniqueStrings(lineage.map((row) => row.lineageRef)),
    spanIds: uniqueStrings(lineage.map((row) => row.spanId)),
    frameRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.frameRefs) ? row.frameRefs : [])),
    zoomRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.zoomRefs) ? row.zoomRefs : [])),
    foldbackRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.foldbackRefs) ? row.foldbackRefs : [])),
    aliasRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.aliasRefs) ? row.aliasRefs : [])),
    graphVectorRefs: uniqueStrings(lineage.flatMap((row) => Array.isArray(row.graphVectorRefs) ? row.graphVectorRefs : [])),
    graphSpanEventKinds: uniqueStrings(graphEvents.map((event) => event.kind)),
    runtimeSpanEventKinds: uniqueStrings(recursiveEvents.map((event) => event.kind)),
    lineage,
    graphSpanReplay: Object.freeze(graphEvents),
    runtimeSpanEvents: Object.freeze(recursiveEvents),
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...lineage.map((row) => row.lineageRef),
    ...lineage.map((row) => row.spanId)
  ]);
}

export function interpretExecutivePressureState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Executive pressure interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const pressureEvents = Array.isArray(input.pressureEvents)
    ? Object.freeze([...input.pressureEvents])
    : Object.freeze([]);
  const pressureFacts = executivePressureRows(runtimeEvents, pressureEvents);
  const sourceEventRefs = uniqueStrings([
    ...pressureFacts.map((fact) => fact.sourceEventRef),
    ...pressureFacts.flatMap((fact) => Array.isArray(fact.fact.sourceEventRefs) ? fact.fact.sourceEventRefs : [])
  ]);

  return accepted({
    kind: "odd_glc_executive_pressure_state_view",
    tenant: TENANT_ID,
    pressureDisposition: pressureDisposition(pressureFacts),
    pressureFactRefs: uniqueStrings(pressureFacts.map((fact) => fact.pressureFactRef)),
    observationRefs: uniqueStrings(pressureFacts.map((fact) => fact.observationRef)),
    requirementIds: uniqueStrings(pressureFacts.flatMap((fact) => fact.requirementIds)),
    residualPressureRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.residualPressureRefs)),
    continuationRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.continuationRefs)),
    evidenceRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.evidenceRefs)),
    diagnosticRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.diagnosticRefs)),
    spanRefs: uniqueStrings(pressureFacts.flatMap((fact) => fact.spanRefs)),
    dispositions: uniqueStrings(pressureFacts.map((fact) => fact.disposition)),
    closeDispositions: uniqueStrings(pressureFacts.map((fact) => fact.closeDisposition)),
    attenuation: uniqueStrings(pressureFacts.map((fact) => fact.attenuation)),
    pressureFacts: Object.freeze(pressureFacts),
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...pressureFacts.map((fact) => fact.pressureFactRef)
  ]);
}

export function interpretReleaseReadinessState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Release readiness interpretation requires an input object"]);
  }
  const lifecycleStateView = isRecord(input.lifecycleStateView) ? input.lifecycleStateView : Object.freeze({});
  const assuranceStateView = isRecord(input.assuranceStateView) ? input.assuranceStateView : Object.freeze({});
  const evidenceStateView = isRecord(input.evidenceStateView) ? input.evidenceStateView : Object.freeze({});
  const sourceEventRefs = uniqueStrings([
    ...(Array.isArray(lifecycleStateView.sourceEventRefs) ? lifecycleStateView.sourceEventRefs : []),
    ...(Array.isArray(assuranceStateView.sourceEventRefs) ? assuranceStateView.sourceEventRefs : []),
    ...(Array.isArray(evidenceStateView.sourceEventRefs) ? evidenceStateView.sourceEventRefs : [])
  ]);

  return accepted({
    kind: "odd_glc_release_readiness_state_view",
    tenant: TENANT_ID,
    readiness: releaseReadiness(lifecycleStateView, assuranceStateView, evidenceStateView),
    lifecycleDisposition: lifecycleStateView.lifecycleDisposition ?? "no_disposition",
    assuranceDisposition: assuranceStateView.assuranceDisposition ?? "no_assurance",
    evidenceDisposition: evidenceStateView.evidenceDisposition ?? "no_evidence",
    residualRefs: uniqueStrings(Array.isArray(assuranceStateView.residualRefs) ? assuranceStateView.residualRefs : []),
    dispositionRefs: uniqueStrings(Array.isArray(lifecycleStateView.dispositionRefs) ? lifecycleStateView.dispositionRefs : []),
    evidenceRefs: uniqueStrings(Array.isArray(evidenceStateView.admittedEvidence)
      ? evidenceStateView.admittedEvidence.map((event) => isRecord(event) ? event.evidenceRef : null)
      : []),
    releaseAuthority: "not_claimed",
    sourceEventRefs
  }, [
    ...sourceEventRefs,
    ...(Array.isArray(assuranceStateView.residualRefs) ? assuranceStateView.residualRefs : [])
  ]);
}

export function interpretAssuranceState(input) {
  if (!isRecord(input)) {
    return rejected("malformed_input", ["Assurance interpretation requires an input object"]);
  }
  const runtimeEvents = Array.isArray(input.runtimeEvents)
    ? Object.freeze([...input.runtimeEvents])
    : Object.freeze([]);
  const folds = routeFoldEvents(runtimeEvents);
  const residuals = routeResidualEvents(runtimeEvents);
  const dispositions = routeDispositionEvents(runtimeEvents);
  const evidenceRefs = uniqueStrings(folds.flatMap((fold) => fold.evidenceRefs));
  const sourceAbgTruthRefs = uniqueStrings(folds.flatMap((fold) => fold.sourceAbgTruthRefs));
  const sourceEventRefs = uniqueStrings([
    ...folds.map((fold) => fold.sourceEventRef),
    ...residuals.map((residual) => residual.sourceEventRef),
    ...dispositions.map((disposition) => disposition.sourceEventRef)
  ]);

  return accepted({
    kind: "odd_glc_assurance_state_view",
    tenant: TENANT_ID,
    assuranceDisposition: assuranceDisposition(folds, residuals, dispositions),
    foldRefs: uniqueStrings(folds.map((fold) => fold.foldRef)),
    foldStates: uniqueStrings(folds.map((fold) => fold.state)),
    residualRefs: uniqueStrings(residuals.map((residual) => residual.residualRef)),
    dispositionRefs: uniqueStrings(dispositions.map((disposition) => disposition.dispositionRef)),
    evidenceRefs,
    sourceAbgTruthRefs,
    folds: Object.freeze(folds),
    residuals: Object.freeze(residuals),
    dispositions: Object.freeze(dispositions),
    sourceEventRefs,
    runtimeEventCount: runtimeEvents.length
  }, [
    ...sourceEventRefs,
    ...sourceAbgTruthRefs
  ]);
}
