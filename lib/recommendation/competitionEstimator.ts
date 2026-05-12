import type { ApartmentOffering } from "@/lib/apartments/types";
import type { ApplicantProfile, EligibilityStatus, SupplyType } from "@/lib/eligibility/types";

export type CompetitionLevel = "high" | "medium" | "low";

export interface CompetitionEstimate {
  level: CompetitionLevel;
  expectedRange: string;
  confidenceLevel: "medium" | "low";
  factors: string[];
  disclaimer: string;
}

const capitalRegions = ["서울", "서울특별시", "경기", "경기도", "인천", "인천광역시"];
const bigMetroRegions = ["부산", "부산광역시", "대구", "대구광역시", "대전", "대전광역시", "광주", "광주광역시", "울산", "울산광역시"];

function levelFromScore(score: number): CompetitionLevel {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function rangeFromLevel(level: CompetitionLevel) {
  switch (level) {
    case "high":
      return "20:1 ~ 50:1";
    case "medium":
      return "8:1 ~ 20:1";
    case "low":
      return "3:1 ~ 8:1";
  }
}

export function estimateCompetition(
  profile: ApplicantProfile,
  apartment: ApartmentOffering,
  supplyType: SupplyType,
  status: EligibilityStatus,
): CompetitionEstimate {
  let score = 25;
  const factors: string[] = [];

  if (capitalRegions.includes(apartment.region)) {
    score += 30;
    factors.push("수도권 단지는 대체로 관심 수요가 높게 형성됩니다.");
  } else if (bigMetroRegions.includes(apartment.region)) {
    score += 18;
    factors.push("광역시 단지는 지역 내 수요가 비교적 높을 수 있습니다.");
  } else {
    score += 8;
    factors.push("비수도권 단지로 분류되어 경쟁 강도 가중치는 낮게 반영했습니다.");
  }

  if (apartment.housingType === "private_sale") {
    score += 18;
    factors.push("민영주택은 입지와 브랜드에 따라 경쟁이 높아질 수 있습니다.");
  }

  if (apartment.recruitmentStatus === "open") {
    score += 10;
    factors.push("현재 접수 중인 단지라 단기 관심도가 높을 수 있습니다.");
  }

  if (supplyType !== "general_supply") {
    score += 10;
    factors.push("특별공급은 대상자가 제한되지만 인기 유형은 경쟁이 생길 수 있습니다.");
  }

  if (profile.currentRegion && apartment.region && !apartment.region.includes(profile.currentRegion) && !profile.currentRegion.includes(apartment.region)) {
    score -= 8;
    factors.push("현재 거주 지역과 단지 지역이 달라 거주 요건 확인이 필요합니다.");
  }

  if (status === "caution") {
    score -= 8;
    factors.push("입력 정보가 일부 비어 있어 경쟁 추정 신뢰도를 낮게 보았습니다.");
  }

  const level = levelFromScore(score);

  return {
    level,
    expectedRange: rangeFromLevel(level),
    confidenceLevel: "low",
    factors,
    disclaimer: "예상 경쟁률은 과거 경쟁률 데이터 기반 예측이 아니라 MVP용 휴리스틱 추정입니다. 실제 경쟁률은 청약홈 공고와 접수 결과를 확인해야 합니다.",
  };
}
