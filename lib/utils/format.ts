import type { HousingType, SupplyType } from "@/lib/eligibility/types";
import { supplyTypeLabels } from "@/lib/eligibility/types";
import type { RecruitmentStatus } from "@/lib/apartments/types";

export const housingTypeLabels: Record<HousingType, string> = {
  public_sale: "공공분양",
  private_sale: "민영주택",
  public_rental: "공공임대",
  newlywed_hope_town: "신혼희망타운",
};

export const recruitmentStatusLabels: Record<RecruitmentStatus, string> = {
  upcoming: "모집 예정",
  open: "접수 중",
  closed: "마감",
};

export function formatSupplyTypes(types: SupplyType[]) {
  return types.map((type) => supplyTypeLabels[type]).join(", ");
}
