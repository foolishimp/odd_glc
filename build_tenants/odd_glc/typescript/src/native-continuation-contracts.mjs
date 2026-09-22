// Canonical bounded continuation. Every application selection is invocation data.
export const VERSION = "5.0.0";
export const PACKAGE_NAME = "@odd-glc/route-one-typescript";
export const PACKAGE_VERSION = "0.2.0-dev.3";
const ref = (kind, name = "") => `${kind}://odd-glc/native-continuation${name ? "/" + name : ""}@5`;
export const ids = Object.freeze({
 productId:`product://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
 descriptorRef:`descriptor://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
 contributionManifestRef:`contribution-manifest://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
 catalogRef:`catalog://odd_glc/public-contracts@${PACKAGE_VERSION}`,
 provenanceRef:`provenance://odd_glc/route-one-typescript@${PACKAGE_VERSION}`,
 moduleRef:ref("module"),programRef:ref("program"),graphFunctionRef:ref("graph-function"),
 assessmentWrapperRef:ref("graph-function","execution-assessment"),graphRef:ref("graph"),wrapperGraphRef:ref("graph","execution-assessment"),startRef:ref("start"),
 semanticsBindingRef:ref("product-semantics"),inputContractRef:ref("contract","input"),boundInputContractRef:"contract://abiogenesis/worksite/retained-graph-input@5",rawContractRef:ref("contract","criterion-verdicts"),
 evidenceContractRef:ref("contract","evidence"),failureContractRef:ref("contract","failure"),refusalContractRef:ref("contract","refusal"),
 judgmentContractRef:ref("contract","judgment"),transitionContractRef:ref("contract","transition"),closureContractRef:ref("contract","closure"),wrapperClosureContractRef:ref("contract","assessment-closure"),
 completionPredicateRef:ref("predicate","completed"),wrapperPredicateRef:ref("predicate","execution-assessed"),stepPredicateRef:ref("predicate","step"),wrapperStepPredicateRef:ref("predicate","assessment-step"),
 selectNodeRef:ref("node","select-request"),reacquisitionNodeRef:ref("node","reacquire"),executionNodeRef:ref("node","execute"),assessmentNodeRef:ref("node","assess-execution"),
 wrapperPrepareNodeRef:ref("node","prepare-assessment"),wrapperCallNodeRef:ref("node","native-assessment") });
export const inputContract = Object.freeze({contractRef:ids.inputContractRef,contractVersion:VERSION,contractKind:"input",valueKind:"native_continuation_input"});
export const rawContract = Object.freeze({contractRef:ids.rawContractRef,contractVersion:VERSION,contractKind:"output",valueKind:"native_asset_criterion_assessment"});
export const executionContract = Object.freeze({contractRef:"contract://abiogenesis/worksite/command-execution-observation@5",contractVersion:VERSION,contractKind:"output",valueKind:"worksite_command_execution_observation"});
export const stages = Object.freeze([
 ["select-request","selectRequest",ids.inputContractRef,"contract://abiogenesis/worksite/native-command-reacquisition-request@5",ids.selectNodeRef],
 ["prepare-assessment","prepareAssessment",ids.boundInputContractRef,"contract://abiogenesis/worksite/native-work/task@5",ids.wrapperPrepareNodeRef],
].map(([name,namedSymbol,inputContractRef,outputContractRef,programLocusRef]) => Object.freeze({name,namedSymbol,inputContractRef,outputContractRef,programLocusRef,
 implementationRef:ref("implementation",name),bindingRef:ref("implementation-binding",name),predicateRef:ref("predicate",name),armId:ref("arm",name)})));
export const bindingFor = stage => ({kind:"implementation_binding",bindingRef:stage.bindingRef,implementationRef:stage.implementationRef,
 packageName:PACKAGE_NAME,packageVersion:PACKAGE_VERSION,modulePath:"build/native-continuation-runtime.mjs",namedSymbol:stage.namedSymbol,computeRegime:"F_D",
 inputContractRef:stage.inputContractRef,outputContractRef:stage.outputContractRef,failureContractRef:ids.failureContractRef,refusalContractRef:ids.refusalContractRef});

export const ASSESSMENT_SCHEMA = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "contract://odd-glc/native-continuation/criterion-verdicts@5",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind",
    "criteria",
    "residuals"
  ],
  "properties": {
    "kind": {
      "const": "native_asset_criterion_assessment"
    },
    "criteria": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "criterionRef",
          "disposition",
          "rationale",
          "evidence"
        ],
        "properties": {
          "criterionRef": {
            "type": "string",
            "minLength": 1
          },
          "disposition": {
            "enum": [
              "satisfied",
              "falsified",
              "indeterminate"
            ]
          },
          "rationale": {
            "type": "string",
            "minLength": 1
          },
          "evidence": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "path",
                "quote"
              ],
              "properties": {
                "path": {
                  "type": "string",
                  "minLength": 1
                },
                "quote": {
                  "type": "string",
                  "minLength": 1
                }
              }
            }
          }
        }
      }
    },
    "residuals": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "scope",
          "criterionRef",
          "description"
        ],
        "properties": {
          "scope": {
            "enum": [
              "selected-assessment",
              "outside-assessment"
            ]
          },
          "criterionRef": {
            "type": [
              "string",
              "null"
            ]
          },
          "description": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  }
};
export const ASSESSMENT_SCHEMA_TEXT = JSON.stringify(ASSESSMENT_SCHEMA) + "\n";

export const constructBoundContract = product => product.RETAINED_GRAPH_INPUT_CONTRACT;
