import type { ApartmentOffering } from "@/lib/apartments/types";
import { sampleRules } from "@/lib/eligibility/sampleRules";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import type { ApplicantProfile, EligibilityResult, EligibilityStatus, SupplyType } from "@/lib/eligibility/types";
import { estimateCompetition, type CompetitionEstimate } from "./competitionEstimator";

export type ConfidenceLevel = "high" | "medium" | "low";
export type MatchLevel = "high" | "medium" | "low";

export interface SupplyRecommendation {
  recommendedSupplyType: SupplyType;
  recommendationRank: number;
  status: EligibilityStatus;
  confidenceLevel: ConfidenceLevel;
  recommendationScore: number;
  matchLevel: MatchLevel;
  scoreBreakdown: string[];
  strategyNotes: string[];
  rankReason: string;
  competitionEstimate: CompetitionEstimate;
  reasons: string[];
  missingRequirements: string[];
  warnings: string[];
  label: string;
  ruleVersion: string;
  effectiveDate: string;
  sourceNote: string;
}

export interface RecommendationResult {
  apartment: ApartmentOffering;
  topRecommendations: SupplyRecommendation[];
  allResults: SupplyRecommendation[];
}

const specialSupplyTypes: SupplyType[] = [
  "newlywed_special",
  "first_life_special",
  "multi_child_special",
  "elderly_parent_special",
  "institution_recommendation",
];

function statusScore(status: EligibilityStatus) {
  switch (status) {
    case "eligible":
      return 55;
    case "caution":
      return 38;
    case "not_eligible":
      return 8;
    case "not_available":
      return 0;
  }
}

function matchLevelFromScore(score: number): MatchLevel {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function interestBoost(profile: ApplicantProfile, supplyType: SupplyType) {
  return profile.interestedSupplyTypes.includes(supplyType) ? 12 : 0;
}

function fitBoost(profile: ApplicantProfile, supplyType: SupplyType) {
  if (supplyType === "newlywed_special" && profile.maritalStatus === "married" && Number(profile.marriageYears) <= 7) return 14;
  if (supplyType === "multi_child_special" && profile.childrenCount >= 3) return 14;
  if (supplyType === "elderly_parent_special" && profile.isHouseholder) return 8;
  if (supplyType === "first_life_special" && profile.isHomeless && profile.hasSubscriptionAccount) return 10;
  if (supplyType === "general_supply") return 5;
  return 4;
}

function confidenceFor(result: EligibilityResult): ConfidenceLevel {
  if (result.status === "eligible" && result.warnings.length === 0) return "high";
  if (result.status === "not_eligible") return "medium";
  return "low";
}

function createScore(profile: ApplicantProfile, result: EligibilityResult) {
  const breakdown: string[] = [];
  let score = statusScore(result.status);

  breakdown.push("룰 엔진 판정 상태를 내부 정렬 기준에 반영했습니다.");

  if (specialSupplyTypes.includes(result.supplyType)) {
    score += 8;
    breakdown.push("특별공급 전형은 조건이 맞을 때 우선 검토하도록 반영했습니다.");
  }

  if (profile.homelessPeriod !== null && profile.homelessPeriod < 3) {
    if (specialSupplyTypes.includes(result.supplyType)) {
      score += 8;
      breakdown.push("무주택 기간이 짧아 일반공급 가점 경쟁보다 조건형 특별공급 검토 비중을 높였습니다.");
    }
    if (result.supplyType === "general_supply") {
      score -= 8;
      breakdown.push("무주택 기간이 짧아 일반공급 우선순위는 보수적으로 반영했습니다.");
    }
  }

  if (profile.homelessPeriod !== null && profile.homelessPeriod >= 10 && result.supplyType === "general_supply") {
    score += 8;
    breakdown.push("무주택 기간이 긴 편이라 일반공급 비교 가치를 높였습니다.");
  }

  const interest = interestBoost(profile, result.supplyType);
  if (interest > 0) {
    score += interest;
    breakdown.push("사용자가 관심 유형으로 선택한 전형입니다.");
  }

  const fit = fitBoost(profile, result.supplyType);
  if (fit > 0) {
    score += fit;
    breakdown.push("입력 조건과 전형 특성이 일부 부합합니다.");
  }

  if (result.warnings.length > 0) {
    score -= Math.min(result.warnings.length * 4, 12);
    breakdown.push("추가 확인이 필요한 항목이 있어 적합도를 낮게 반영했습니다.");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    breakdown,
  };
}

function createStrategyNotes(profile: ApplicantProfile, apartment: ApartmentOffering, result: EligibilityResult) {
  if (result.status === "not_available") {
    return ["선택한 단지에서 제공하지 않는 공급 유형이라 추천 순위에는 포함하지 않습니다."];
  }

  const notes: string[] = [];

  if (profile.homelessPeriod !== null && profile.homelessPeriod < 3 && specialSupplyTypes.includes(result.supplyType)) {
    notes.push("무주택 기간이 짧아 일반공급 가점 경쟁보다 조건형 특별공급을 우선 검토하는 전략이 유리할 수 있습니다.");
  }

  if (profile.homelessPeriod !== null && profile.homelessPeriod >= 10 && result.supplyType === "general_supply") {
    notes.push("무주택 기간이 긴 편이라 일반공급도 함께 비교할 만합니다.");
  }

  if (result.supplyType === "newlywed_special" && profile.maritalStatus === "married" && profile.marriageYears !== null && profile.marriageYears <= 7) {
    notes.push("혼인 기간이 신혼부부 특별공급 검토 범위에 가까워 우선 확인할 가치가 있습니다.");
  }

  if (result.supplyType === "multi_child_special" && profile.childrenCount >= 3) {
    notes.push("자녀 수 기준상 다자녀 특별공급을 우선 검토할 수 있습니다.");
  }

  if (!profile.hasSubscriptionAccount) {
    notes.push("청약통장 조건이 약해 통장 가입 여부와 납입 요건 확인이 우선입니다.");
  }

  if (profile.monthlyIncome === null || profile.assetAmount === null) {
    notes.push("소득·자산 정보가 비어 있어 실제 가능 여부는 모집공고문 기준 확인이 필요합니다.");
  }

  if (profile.currentRegion.trim() !== "" && apartment.region.trim() !== "" && profile.currentRegion !== apartment.region) {
    notes.push("현재 거주 지역과 희망 단지 지역이 달라 거주기간 및 우선공급 요건 확인이 필요합니다.");
  }

  if (notes.length === 0 && result.status === "eligible") {
    notes.push("현재 입력값에서는 필수 조건 충족 항목이 많아 우선 검토 대상으로 볼 수 있습니다.");
  }

  return Array.from(new Set(notes));
}

function createRankReason(result: EligibilityResult, matchLevel: MatchLevel, strategyNotes: string[]) {
  const levelText = matchLevel === "high" ? "높음" : matchLevel === "medium" ? "보통" : "낮음";
  const strategyLead = strategyNotes[0] ? ` ${strategyNotes[0]}` : "";

  if (result.status === "eligible") {
    return `${result.label}은 현재 입력 조건에서 충족 항목이 많아 추천 적합도 '${levelText}'으로 분류했습니다.${strategyLead}`;
  }
  if (result.status === "caution") {
    return `${result.label}은 가능성이 있지만 추가 확인 항목이 있어 추천 적합도 '${levelText}'으로 분류했습니다.${strategyLead}`;
  }
  if (result.status === "not_available") {
    return `${result.label}은 선택한 단지에서 제공하지 않아 추천 대상에서 제외했습니다.`;
  }
  return `${result.label}은 필수 조건 미충족 항목이 있어 추천 적합도 '${levelText}'으로 분류했습니다.${strategyLead}`;
}

function toRecommendation(profile: ApplicantProfile, apartment: ApartmentOffering, result: EligibilityResult, rank: number): SupplyRecommendation {
  const { score, breakdown } = createScore(profile, result);
  const matchLevel = matchLevelFromScore(score);
  const strategyNotes = createStrategyNotes(profile, apartment, result);

  return {
    recommendedSupplyType: result.supplyType,
    recommendationRank: rank,
    status: result.status,
    confidenceLevel: confidenceFor(result),
    recommendationScore: score,
    matchLevel,
    scoreBreakdown: breakdown,
    strategyNotes,
    rankReason: createRankReason(result, matchLevel, strategyNotes),
    competitionEstimate: estimateCompetition(profile, apartment, result.supplyType, result.status),
    reasons: result.reasons,
    missingRequirements: result.missingRequirements,
    warnings: result.warnings,
    label: result.label,
    ruleVersion: result.ruleVersion,
    effectiveDate: result.effectiveDate,
    sourceNote: result.sourceNote,
  };
}

export function createRecommendations(
  profile: ApplicantProfile,
  apartment: ApartmentOffering,
): RecommendationResult {
  const availableResults = evaluateEligibility(profile, sampleRules, apartment.availableSupplyTypes);
  const unavailableResults = sampleRules
    .filter((rule) => !apartment.availableSupplyTypes.includes(rule.supplyType))
    .map<EligibilityResult>((rule) => ({
      supplyType: rule.supplyType,
      label: rule.label,
      status: "not_available",
      reasons: ["선택한 단지에서 제공하지 않는 공급 유형입니다."],
      missingRequirements: [],
      warnings: ["해당 단지 공급 유형 없음"],
      ruleVersion: rule.ruleVersion,
      effectiveDate: rule.effectiveDate,
      sourceNote: rule.sourceNote,
    }));

  const rankedAvailable = [...availableResults].sort((a, b) => {
    const aScore = createScore(profile, a).score;
    const bScore = createScore(profile, b).score;
    return bScore - aScore;
  });

  const rankedAll = [...rankedAvailable, ...unavailableResults].map((result, index) =>
    toRecommendation(profile, apartment, result, index + 1),
  );

  return {
    apartment,
    topRecommendations: rankedAll.filter((result) => result.status !== "not_available").slice(0, 3),
    allResults: rankedAll,
  };
}
