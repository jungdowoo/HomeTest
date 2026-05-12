import type { ApartmentOffering } from "./types";
import type { HousingType, SupplyType } from "@/lib/eligibility/types";

type ApplyHomeRow = Record<string, string | number | null | undefined>;

const APT_DETAIL_ENDPOINT = "getAPTLttotPblancDetail";

function normalizeBaseUrl(rawBaseUrl?: string) {
  const configured = rawBaseUrl || "https://api.odcloud.kr";
  const withProtocol = configured.startsWith("http") ? configured : `https://${configured}`;
  const base = withProtocol.replace(/\/$/, "");
  if (base.includes("ApplyhomeInfoDetailSvc/v1")) return base;
  if (base.endsWith("/api")) return `${base}/ApplyhomeInfoDetailSvc/v1`;
  return `${base}/api/ApplyhomeInfoDetailSvc/v1`;
}

function stringValue(row: ApplyHomeRow, key: string) {
  const value = row[key];
  return value === null || value === undefined ? "" : String(value).trim();
}

function parseDate(value: string) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{8}$/.test(value)) return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  return value;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function compareDate(a: string, b: string) {
  if (!a || !b) return 0;
  return a.localeCompare(b);
}

function statusFromDates(start: string, end: string) {
  const today = todayString();
  if (start && compareDate(today, start) < 0) return "upcoming" as const;
  if (end && compareDate(today, end) > 0) return "closed" as const;
  return "open" as const;
}

function regionFromRow(row: ApplyHomeRow) {
  return stringValue(row, "SUBSCRPT_AREA_CODE_NM") || "지역 미상";
}

function districtFromAddress(address: string) {
  const parts = address.split(/\s+/).filter(Boolean);
  return parts.find((part) => /시$|군$|구$/.test(part)) || "시군구 미상";
}

function housingTypeFromRow(row: ApplyHomeRow): HousingType {
  const houseName = `${stringValue(row, "HOUSE_SECD_NM")} ${stringValue(row, "HOUSE_DTL_SECD_NM")} ${stringValue(row, "HOUSE_NM")}`;
  if (houseName.includes("신혼희망")) return "newlywed_hope_town";
  if (houseName.includes("국민") || houseName.includes("공공")) return "public_sale";
  return "private_sale";
}

function availableSupplyTypesFromRow(row: ApplyHomeRow): SupplyType[] {
  const hasSpecialDate = Boolean(stringValue(row, "SPSPLY_RCEPT_BGNDE") || stringValue(row, "SPSPLY_RCEPT_ENDDE"));
  const supplyTypes: SupplyType[] = ["general_supply"];

  if (hasSpecialDate) {
    supplyTypes.unshift(
      "newlywed_special",
      "first_life_special",
      "multi_child_special",
      "elderly_parent_special",
      "institution_recommendation",
    );
  }

  return supplyTypes;
}

export function normalizeApplyHomeApartment(row: ApplyHomeRow): ApartmentOffering {
  const houseManageNo = stringValue(row, "HOUSE_MANAGE_NO");
  const pblancNo = stringValue(row, "PBLANC_NO");
  const address = stringValue(row, "HSSPLY_ADRES");
  const specialStart = parseDate(stringValue(row, "SPSPLY_RCEPT_BGNDE"));
  const generalStart = parseDate(
    stringValue(row, "RCEPT_BGNDE") ||
      stringValue(row, "GNRL_RNK1_CRSPAREA_RCEPT_PD") ||
      stringValue(row, "GNRL_RNK1_CRSPAREA_RCEPT_BGNDE"),
  );
  const specialEnd = parseDate(stringValue(row, "SPSPLY_RCEPT_ENDDE"));
  const generalEnd = parseDate(
    stringValue(row, "RCEPT_ENDDE") ||
      stringValue(row, "GNRL_RNK1_CRSPAREA_RCEPT_PD") ||
      stringValue(row, "GNRL_RNK1_CRSPAREA_RCEPT_ENDDE"),
  );
  const applicationStartDate = specialStart || generalStart || parseDate(stringValue(row, "RCRIT_PBLANC_DE"));
  const applicationEndDate = generalEnd || specialEnd || applicationStartDate;

  return {
    apartmentId: `${houseManageNo || "house"}-${pblancNo || stringValue(row, "HOUSE_NM")}`,
    apartmentName: stringValue(row, "HOUSE_NM") || "단지명 미상",
    region: regionFromRow(row),
    district: districtFromAddress(address),
    housingType: housingTypeFromRow(row),
    recruitmentStatus: statusFromDates(applicationStartDate, applicationEndDate),
    announcementDate: parseDate(stringValue(row, "RCRIT_PBLANC_DE")),
    applicationStartDate,
    applicationEndDate,
    availableSupplyTypes: availableSupplyTypesFromRow(row),
    ruleVersion: "applyhome-api-2026.05",
    sourceNote: "한국부동산원 청약홈 분양정보 조회 서비스 API에서 조회한 데이터입니다.",
    disclaimer: "API 데이터는 참고용이며 실제 청약 가능 여부와 일정은 반드시 청약홈 및 모집공고문에서 확인해야 합니다.",
  };
}

interface ApplyHomeResponse {
  data?: ApplyHomeRow[];
  totalCount?: number;
  currentCount?: number;
  matchCount?: number;
}

export async function fetchApplyHomeApartments() {
  const serviceKey = process.env.APPLY_HOME_SERVICE_KEY;
  if (!serviceKey || serviceKey.includes("여기에_")) {
    throw new Error("APPLY_HOME_SERVICE_KEY is not configured");
  }

  const baseUrl = normalizeBaseUrl(process.env.APPLY_HOME_API_BASE_URL);
  const url = new URL(`${baseUrl}/${APT_DETAIL_ENDPOINT}`);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", "100");
  url.searchParams.set("returnType", "JSON");
  url.searchParams.set("serviceKey", serviceKey);

  const response = await fetch(url, { next: { revalidate: 600 } });
  if (!response.ok) {
    throw new Error(`ApplyHome API failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApplyHomeResponse;
  const rows = payload.data ?? [];
  return rows.map(normalizeApplyHomeApartment).filter((apartment) => apartment.apartmentName !== "단지명 미상");
}

