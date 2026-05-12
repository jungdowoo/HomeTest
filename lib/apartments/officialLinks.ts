import type { ApartmentOffering } from "./types";

function baseOfficialListUrl() {
  return "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancListView.do";
}

function baseAptDetailUrl() {
  return "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do";
}

function basePblancDetailUrl() {
  return "https://www.applyhome.co.kr/ai/aia/selectPRMOLttotPblancDetailView.do";
}

export function buildOfficialAnnouncementCandidates(apartment: ApartmentOffering) {
  const houseNm = encodeURIComponent(apartment.apartmentName);
  const candidates: string[] = [];

  if (apartment.officialAnnouncementUrl) {
    const parsed = new URL(apartment.officialAnnouncementUrl);
    const houseManageNo = parsed.searchParams.get("houseManageNo") || "";
    const pblancNo = parsed.searchParams.get("pblancNo") || "";
    const houseSecd = parsed.searchParams.get("houseSecd") || "";

    if (houseManageNo && pblancNo) {
      candidates.push(`${baseAptDetailUrl()}?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}`);
      candidates.push(`${basePblancDetailUrl()}?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&houseSecd=${houseSecd || "02"}`);
      candidates.push(`${basePblancDetailUrl()}?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&houseSecd=03`);
      candidates.push(`${basePblancDetailUrl()}?houseManageNo=${houseManageNo}&pblancNo=${pblancNo}&houseSecd=01`);
    }
  }

  candidates.push(`${baseOfficialListUrl()}?houseNm=${houseNm}`);

  return [...new Set(candidates)];
}

export function getOfficialAnnouncementPrimaryLink(apartment: ApartmentOffering) {
  const candidates = buildOfficialAnnouncementCandidates(apartment);
  return candidates[0] ?? "";
}
