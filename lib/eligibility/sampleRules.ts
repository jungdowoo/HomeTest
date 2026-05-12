import type { SupplyRule } from "./types";

const commonMeta = {
  ruleVersion: "demo-2026.05-v1",
  effectiveDate: "2026-05-09",
  sourceNote: "데모용 샘플 룰입니다. 실제 기준은 모집공고문과 청약홈을 확인해야 합니다.",
};

export const sampleRules: SupplyRule[] = [
  {
    ...commonMeta,
    supplyType: "newlywed_special",
    label: "신혼부부 특별공급",
    priority: 10,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount", "marriageYears"],
    conditions: [
      { field: "isHomeless", operator: "equals", value: true, required: true, reason: "무주택 조건을 충족했습니다.", missingMessage: "무주택 요건 확인이 필요합니다." },
      { field: "maritalStatus", operator: "equals", value: "married", required: true, reason: "혼인 상태 조건과 맞습니다.", missingMessage: "신혼부부 유형은 혼인 상태 확인이 필요합니다." },
      { field: "marriageYears", operator: "lte", value: 7, required: false, reason: "혼인 기간이 데모 기준 범위 안에 있습니다.", missingMessage: "혼인 기간 기준 확인이 필요합니다." },
      { field: "hasSubscriptionAccount", operator: "equals", value: true, required: true, reason: "청약통장 보유 조건을 충족했습니다.", missingMessage: "청약통장 가입 여부가 필요합니다." },
      { field: "subscriptionMonths", operator: "gte", value: 6, required: false, reason: "청약통장 가입 기간이 데모 기준을 충족했습니다.", missingMessage: "청약통장 가입 기간이 부족하거나 확인이 필요합니다." },
    ],
  },
  {
    ...commonMeta,
    supplyType: "first_life_special",
    label: "생애최초 특별공급",
    priority: 20,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount", "homelessPeriod"],
    conditions: [
      { field: "isHomeless", operator: "equals", value: true, required: true, reason: "무주택 조건을 충족했습니다.", missingMessage: "생애최초 유형은 무주택 여부 확인이 중요합니다." },
      { field: "hasSubscriptionAccount", operator: "equals", value: true, required: true, reason: "청약통장 보유 조건을 충족했습니다.", missingMessage: "청약통장 가입 여부가 필요합니다." },
      { field: "paymentCount", operator: "gte", value: 12, required: false, reason: "납입 횟수가 데모 기준을 충족했습니다.", missingMessage: "납입 횟수가 부족하거나 확인이 필요합니다." },
    ],
  },
  {
    ...commonMeta,
    supplyType: "multi_child_special",
    label: "다자녀 특별공급",
    priority: 30,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount", "homelessPeriod"],
    conditions: [
      { field: "isHomeless", operator: "equals", value: true, required: true, reason: "무주택 조건을 충족했습니다.", missingMessage: "무주택 요건 확인이 필요합니다." },
      { field: "childrenCount", operator: "gte", value: 3, required: true, reason: "자녀 수가 데모 기준을 충족했습니다.", missingMessage: "다자녀 기준 충족 여부 확인이 필요합니다." },
      { field: "hasSubscriptionAccount", operator: "equals", value: true, required: false, reason: "청약통장을 보유하고 있습니다.", missingMessage: "청약통장 조건 확인이 필요합니다." },
    ],
  },
  {
    ...commonMeta,
    supplyType: "elderly_parent_special",
    label: "노부모부양 특별공급",
    priority: 40,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount", "homelessPeriod"],
    conditions: [
      { field: "isHomeless", operator: "equals", value: true, required: true, reason: "무주택 조건을 충족했습니다.", missingMessage: "무주택 요건 확인이 필요합니다." },
      { field: "isHouseholder", operator: "equals", value: true, required: true, reason: "세대주 조건을 충족했습니다.", missingMessage: "세대주 요건 확인이 필요합니다." },
      { field: "age", operator: "gte", value: 30, required: false, reason: "연령 정보가 데모 기준 검토 범위에 있습니다.", missingMessage: "노부모부양 요건은 가족관계와 부양기간 확인이 필요합니다." },
    ],
  },
  {
    ...commonMeta,
    supplyType: "institution_recommendation",
    label: "기관추천 특별공급",
    priority: 50,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount", "homelessPeriod"],
    conditions: [
      { field: "isHomeless", operator: "equals", value: true, required: false, reason: "무주택 여부가 확인되었습니다.", missingMessage: "추천 기관별 세부 기준 확인이 필요합니다." },
    ],
  },
  {
    ...commonMeta,
    supplyType: "general_supply",
    label: "일반공급",
    priority: 90,
    cautionIfMissingFields: ["monthlyIncome", "assetAmount"],
    conditions: [
      { field: "hasSubscriptionAccount", operator: "equals", value: true, required: false, reason: "청약통장을 보유하고 있습니다.", missingMessage: "청약통장 조건 확인이 필요합니다." },
      { field: "subscriptionMonths", operator: "gte", value: 6, required: false, reason: "청약통장 가입 기간이 데모 기준을 충족했습니다.", missingMessage: "청약통장 가입 기간 확인이 필요합니다." },
    ],
  },
];
