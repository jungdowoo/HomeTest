import { sampleRules } from "./sampleRules";
import type {
  ApplicantProfile,
  EligibilityResult,
  RuleCondition,
  SupplyRule,
  SupplyType,
} from "./types";

function isMissing(value: unknown) {
  return value === null || value === undefined || value === "";
}

function evaluateCondition(profile: ApplicantProfile, condition: RuleCondition) {
  const actual = profile[condition.field];

  if (isMissing(actual)) {
    return { passed: false, missing: true };
  }

  switch (condition.operator) {
    case "equals":
      return { passed: actual === condition.value, missing: false };
    case "notEquals":
      return { passed: actual !== condition.value, missing: false };
    case "gte":
      return { passed: Number(actual) >= Number(condition.value), missing: false };
    case "lte":
      return { passed: Number(actual) <= Number(condition.value), missing: false };
    case "in":
      return { passed: Array.isArray(condition.value) && condition.value.includes(actual), missing: false };
  }
}

export function evaluateRule(profile: ApplicantProfile, rule: SupplyRule): EligibilityResult {
  const reasons: string[] = [];
  const missingRequirements: string[] = [];
  const warnings: string[] = [];
  let requiredFailure = false;
  let cautionFailure = false;

  for (const condition of rule.conditions) {
    const result = evaluateCondition(profile, condition);

    if (result.passed) {
      reasons.push(condition.reason);
      continue;
    }

    if (condition.required) {
      requiredFailure = true;
      missingRequirements.push(condition.missingMessage);
    } else {
      cautionFailure = true;
      warnings.push(condition.missingMessage);
    }
  }

  for (const field of rule.cautionIfMissingFields) {
    if (isMissing(profile[field])) {
      cautionFailure = true;
      warnings.push("소득, 자산, 기간 등 추가 입력 또는 모집공고문 확인이 필요합니다.");
      break;
    }
  }

  const status = requiredFailure ? "not_eligible" : cautionFailure ? "caution" : "eligible";

  return {
    supplyType: rule.supplyType,
    label: rule.label,
    status,
    reasons,
    missingRequirements,
    warnings: Array.from(new Set(warnings)),
    ruleVersion: rule.ruleVersion,
    effectiveDate: rule.effectiveDate,
    sourceNote: rule.sourceNote,
  };
}

export function evaluateEligibility(
  profile: ApplicantProfile,
  rules: SupplyRule[] = sampleRules,
  supplyTypes?: SupplyType[],
) {
  const allowed = supplyTypes ? new Set(supplyTypes) : null;
  return rules
    .filter((rule) => !allowed || allowed.has(rule.supplyType))
    .sort((a, b) => a.priority - b.priority)
    .map((rule) => evaluateRule(profile, rule));
}
