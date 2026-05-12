import { describe, expect, it } from "vitest";
import type { ApartmentOffering } from "@/lib/apartments/types";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import { createRecommendations } from "@/lib/recommendation/recommendationEngine";

const baseProfile: ApplicantProfile = {
  age: 34,
  maritalStatus: "married",
  marriageYears: 3,
  childrenCount: 1,
  isHomeless: true,
  isHouseholder: true,
  hasSubscriptionAccount: true,
  subscriptionMonths: 24,
  paymentCount: 18,
  monthlyIncome: 450,
  assetAmount: 20000,
  homelessPeriod: 2,
  currentRegion: "경기도",
  desiredRegion: "경기도",
  desiredDistrict: "하남시",
  preferredHousingType: "public_sale",
  interestedSupplyTypes: ["newlywed_special", "first_life_special", "general_supply"],
};

const apartment: ApartmentOffering = {
  apartmentId: "test-apartment",
  apartmentName: "테스트 데모단지",
  region: "경기도",
  district: "하남시",
  housingType: "public_sale",
  recruitmentStatus: "open",
  announcementDate: "2026-05-01",
  applicationStartDate: "2026-05-20",
  applicationEndDate: "2026-05-24",
  availableSupplyTypes: ["newlywed_special", "first_life_special", "multi_child_special", "general_supply"],
  ruleVersion: "demo-2026.05-v1",
  sourceNote: "테스트용",
  disclaimer: "테스트용",
};

describe("eligibility rule engine", () => {
  it("무주택이고 혼인 3년, 청약통장이 있으면 신혼부부 특별공급 가능 또는 주의로 판정한다", () => {
    const results = evaluateEligibility(baseProfile);
    const newlywed = results.find((result) => result.supplyType === "newlywed_special");
    expect(newlywed?.status).toMatch(/eligible|caution/);
  });

  it("주택 보유자는 대부분 특별공급에서 불가가 된다", () => {
    const results = evaluateEligibility({ ...baseProfile, isHomeless: false });
    const specialResults = results.filter((result) => result.supplyType !== "general_supply");
    expect(specialResults.filter((result) => result.status === "not_eligible").length).toBeGreaterThanOrEqual(3);
  });

  it("청약통장이 없으면 생애최초와 신혼부부에서 불가 또는 주의가 된다", () => {
    const results = evaluateEligibility({ ...baseProfile, hasSubscriptionAccount: false });
    const newlywed = results.find((result) => result.supplyType === "newlywed_special");
    const firstLife = results.find((result) => result.supplyType === "first_life_special");
    expect(["not_eligible", "caution"]).toContain(newlywed?.status);
    expect(["not_eligible", "caution"]).toContain(firstLife?.status);
  });

  it("소득 또는 자산 값이 없으면 주의로 표시한다", () => {
    const results = evaluateEligibility({ ...baseProfile, monthlyIncome: null, assetAmount: null });
    const newlywed = results.find((result) => result.supplyType === "newlywed_special");
    expect(newlywed?.status).toBe("caution");
    expect(newlywed?.warnings.join(" ")).toContain("추가");
  });
});

describe("recommendation engine", () => {
  it("선택한 단지에 없는 공급 유형은 not_available로 표시한다", () => {
    const result = createRecommendations(baseProfile, {
      ...apartment,
      availableSupplyTypes: ["first_life_special", "general_supply"],
    });
    const newlywed = result.allResults.find((item) => item.recommendedSupplyType === "newlywed_special");
    expect(newlywed?.status).toBe("not_available");
  });

  it("신혼부부 조건을 충족하고 단지에 신혼부부 특별공급이 있으면 추천 1순위가 된다", () => {
    const result = createRecommendations(baseProfile, apartment);
    expect(result.topRecommendations[0].recommendedSupplyType).toBe("newlywed_special");
    expect(result.topRecommendations[0].status).toBe("eligible");
  });

  it("특별공급 조건이 모두 불리하면 일반공급을 추천한다", () => {
    const profile: ApplicantProfile = {
      ...baseProfile,
      maritalStatus: "single",
      marriageYears: null,
      childrenCount: 0,
      isHouseholder: false,
      homelessPeriod: 10,
      interestedSupplyTypes: ["general_supply"],
    };
    const result = createRecommendations(profile, {
      ...apartment,
      availableSupplyTypes: ["newlywed_special", "multi_child_special", "elderly_parent_special", "general_supply"],
    });
    expect(result.topRecommendations[0].recommendedSupplyType).toBe("general_supply");
  });

  it("소득이나 자산 정보가 비어 있으면 추천 결과도 caution을 유지한다", () => {
    const result = createRecommendations({ ...baseProfile, monthlyIncome: null, assetAmount: null }, apartment);
    expect(result.topRecommendations[0].status).toBe("caution");
  });

  it("추천 결과에는 추천 적합도와 예상 경쟁 강도 설명이 포함된다", () => {
    const result = createRecommendations(baseProfile, apartment);
    const top = result.topRecommendations[0];
    expect(["high", "medium", "low"]).toContain(top.matchLevel);
    expect(["high", "medium", "low"]).toContain(top.competitionEstimate.level);
    expect(top.rankReason).toContain(top.label);
    expect(top.competitionEstimate.expectedRange).toContain(":1");
  });

  it("무주택 기간이 짧으면 특별공급 우선 전략 메모를 만든다", () => {
    const result = createRecommendations({ ...baseProfile, homelessPeriod: 1 }, apartment);
    expect(result.topRecommendations[0].strategyNotes.join(" ")).toContain("무주택 기간이 짧아");
    expect(result.topRecommendations[0].strategyNotes.join(" ")).toContain("특별공급");
  });

  it("무주택 기간이 길면 일반공급 비교 전략 메모를 만든다", () => {
    const result = createRecommendations({ ...baseProfile, homelessPeriod: 12 }, apartment);
    const general = result.allResults.find((item) => item.recommendedSupplyType === "general_supply");
    expect(general?.strategyNotes.join(" ")).toContain("일반공급도 함께 비교");
  });
});
