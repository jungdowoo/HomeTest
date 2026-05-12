import { NextResponse } from "next/server";
import { sampleApartments } from "@/lib/apartments/sampleApartments";
import { fetchApplyHomeApartments } from "@/lib/apartments/applyHomeApartmentProvider";
import type { ApartmentListResponse } from "@/lib/apartments/types";

export async function GET() {
  try {
    const apartments = await fetchApplyHomeApartments();
    const visibleApartments = apartments.filter((apartment) => apartment.recruitmentStatus !== "closed");
    const response: ApartmentListResponse = {
      apartments: visibleApartments.length > 0 ? visibleApartments : apartments.slice(0, 12),
      source: "applyhome",
      fetchedAt: new Date().toISOString(),
      message: visibleApartments.length > 0 ? "청약홈 API에서 접수 중/예정 단지를 불러왔습니다." : "접수 중/예정 단지가 없어 최근 API 단지를 표시합니다.",
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApartmentListResponse = {
      apartments: sampleApartments,
      source: "mock",
      fetchedAt: new Date().toISOString(),
      message: error instanceof Error ? `청약홈 API 호출 실패: ${error.message}` : "청약홈 API 호출 실패로 데모 데이터를 표시합니다.",
    };
    return NextResponse.json(response, { status: 200 });
  }
}
