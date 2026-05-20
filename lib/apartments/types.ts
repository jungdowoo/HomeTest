import type { HousingType, SupplyType } from "../eligibility/types";

export type RecruitmentStatus = "upcoming" | "open" | "closed";

export interface ApartmentOffering {
  apartmentId: string;
  apartmentName: string;
  region: string;
  district: string;
  housingType: HousingType;
  recruitmentStatus: RecruitmentStatus;
  announcementDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  availableSupplyTypes: SupplyType[];
  ruleVersion: string;
  sourceNote: string;
  disclaimer: string;
  officialAnnouncementUrl?: string;
}

export interface ApartmentListResponse {
  apartments: ApartmentOffering[];
  source: "applyhome" | "mock";
  fetchedAt: string;
  message?: string;
}
