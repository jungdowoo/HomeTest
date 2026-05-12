import { NextResponse } from "next/server";
import { fetchApplyHomeApartments } from "@/lib/apartments/applyHomeApartmentProvider";
import { sampleApartments } from "@/lib/apartments/sampleApartments";
import { buildOfficialAnnouncementCandidates } from "@/lib/apartments/officialLinks";
import type { ApartmentOffering } from "@/lib/apartments/types";

async function loadApartment(apartmentId: string): Promise<ApartmentOffering | null> {
  try {
    const liveApartments = await fetchApplyHomeApartments();
    const liveMatch = liveApartments.find((apartment) => apartment.apartmentId === apartmentId);
    if (liveMatch) return liveMatch;
  } catch {
    // Fall back to demo data.
  }

  return sampleApartments.find((apartment) => apartment.apartmentId === apartmentId) ?? null;
}

async function isReachable(url: string) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      headers: {
        "user-agent": "Mozilla/5.0",
      },
    });
    const text = await response.text();
    if (!response.ok) return false;
    if (text.includes("요청처리를 실패하였습니다")) return false;
    if (text.includes("죄송합니다")) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ apartmentId: string }> }) {
  const { apartmentId } = await params;
  const apartment = await loadApartment(apartmentId);

  if (!apartment) {
    return NextResponse.redirect(new URL("/", "https://www.applyhome.co.kr"), 302);
  }

  const candidates = buildOfficialAnnouncementCandidates(apartment);
  for (const candidate of candidates) {
    if (await isReachable(candidate)) {
      return NextResponse.redirect(candidate, 302);
    }
  }

  return NextResponse.redirect(new URL(candidates[candidates.length - 1] ?? "/", "https://www.applyhome.co.kr"), 302);
}

