export type HousingType =
  | "public_sale"
  | "private_sale"
  | "public_rental"
  | "newlywed_hope_town";

export type SupplyType =
  | "newlywed_special"
  | "first_life_special"
  | "multi_child_special"
  | "elderly_parent_special"
  | "institution_recommendation"
  | "general_supply";

export type EligibilityStatus = "eligible" | "caution" | "not_eligible" | "not_available";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export interface ApplicantProfile {
  age: number | null;
  maritalStatus: MaritalStatus;
  marriageYears: number | null;
  childrenCount: number;
  isHomeless: boolean;
  isHouseholder: boolean;
  hasSubscriptionAccount: boolean;
  subscriptionMonths: number | null;
  paymentCount: number | null;
  monthlyIncome: number | null;
  assetAmount: number | null;
  homelessPeriod: number | null;
  currentRegion: string;
  desiredRegion: string;
  desiredDistrict: string;
  preferredHousingType: HousingType | "";
  interestedSupplyTypes: SupplyType[];
}

export interface RuleMetadata {
  ruleVersion: string;
  effectiveDate: string;
  sourceNote: string;
}

export interface RuleCondition {
  field: keyof ApplicantProfile;
  operator: "equals" | "notEquals" | "gte" | "lte" | "in";
  value: unknown;
  required?: boolean;
  reason: string;
  missingMessage: string;
}

export interface SupplyRule extends RuleMetadata {
  supplyType: SupplyType;
  label: string;
  priority: number;
  conditions: RuleCondition[];
  cautionIfMissingFields: (keyof ApplicantProfile)[];
}

export interface EligibilityResult extends RuleMetadata {
  supplyType: SupplyType;
  label: string;
  status: EligibilityStatus;
  reasons: string[];
  missingRequirements: string[];
  warnings: string[];
}

export const supplyTypeLabels: Record<SupplyType, string> = {
  newlywed_special: "신혼부부 특별공급",
  first_life_special: "생애최초 특별공급",
  multi_child_special: "다자녀 특별공급",
  elderly_parent_special: "노부모부양 특별공급",
  institution_recommendation: "기관추천 특별공급",
  general_supply: "일반공급",
};

export const statusLabels: Record<EligibilityStatus, string> = {
  eligible: "가능",
  caution: "주의",
  not_eligible: "불가",
  not_available: "공급 유형 없음",
};
