import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { fetchApplyHomeApartments } from "@/lib/apartments/applyHomeApartmentProvider";
import { sampleApartments } from "@/lib/apartments/sampleApartments";
import type { ApartmentOffering } from "@/lib/apartments/types";
import { formatSupplyTypes, housingTypeLabels, recruitmentStatusLabels } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ apartmentId: string }>;
}

async function loadApartment(apartmentId: string): Promise<ApartmentOffering | null> {
  try {
    const liveApartments = await fetchApplyHomeApartments();
    const liveMatch = liveApartments.find((apartment) => apartment.apartmentId === apartmentId);
    if (liveMatch) return liveMatch;
  } catch {
    // Live API unavailable: fall back to demo data.
  }

  return sampleApartments.find((apartment) => apartment.apartmentId === apartmentId) ?? null;
}

export async function generateStaticParams() {
  return sampleApartments.map((apartment) => ({ apartmentId: apartment.apartmentId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { apartmentId } = await params;
  const apartment = await loadApartment(apartmentId);

  if (!apartment) {
    return {
      title: "단지 상세",
      description: "청약 단지 상세 정보를 찾을 수 없습니다.",
    };
  }

  return {
    title: `${apartment.apartmentName} 모집공고 상세`,
    description: `${apartment.region} ${apartment.district}의 ${apartment.apartmentName} 모집공고와 공급 유형을 확인합니다.`,
    alternates: {
      canonical: `/apartments/${apartment.apartmentId}`,
    },
    openGraph: {
      title: `${apartment.apartmentName} 모집공고 상세`,
      description: `${apartment.region} ${apartment.district}의 모집공고 정보입니다.`,
      type: "article",
    },
  };
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { apartmentId } = await params;
  const apartment = await loadApartment(apartmentId);

  if (!apartment) {
    notFound();
  }

  const officialUrl = apartment.officialAnnouncementUrl || "";

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-black uppercase tracking-widest text-cyan-400 hover:underline">
            청약비서로 돌아가기
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {recruitmentStatusLabels[apartment.recruitmentStatus]}
          </span>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Apartment Detail</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{apartment.apartmentName}</h1>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>{apartment.region}</span>
            <span>{apartment.district}</span>
            <span>{housingTypeLabels[apartment.housingType]}</span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Info label="공고일" value={apartment.announcementDate || "일정 확인 필요"} />
            <Info label="접수 시작" value={apartment.applicationStartDate || "일정 확인 필요"} />
            <Info label="접수 종료" value={apartment.applicationEndDate || "일정 확인 필요"} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {officialUrl ? (
              <a
                href={`/go/${apartment.apartmentId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
              >
                청약홈 공식 모집공고문 열기
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-slate-300">
                공식 모집공고 링크 없음
              </span>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 p-8">
            <h2 className="text-2xl font-black">제공 공급 유형</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{formatSupplyTypes(apartment.availableSupplyTypes)}</p>
            <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
              <p>이 페이지는 단지의 기본 정보와 공식 모집공고로 이동하는 경로를 함께 보여주는 안내용 화면입니다.</p>
              <p>실제 신청 가능 여부는 반드시 청약홈과 모집공고문 원문에서 다시 확인해 주세요.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 p-8 text-sm leading-7 text-slate-300">
              <h2 className="text-2xl font-black text-white">주의사항</h2>
              <p className="mt-4">{apartment.disclaimer}</p>
              <p className="mt-4">샘플 데이터일 경우 실제 단지와 다를 수 있으며, 공식 청약홈 페이지를 우선 확인해야 합니다.</p>
            </div>
            <Disclaimer />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-black">기준 정보</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Info label="룰 버전" value={apartment.ruleVersion} />
            <Info label="출처 메모" value={apartment.sourceNote} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
  );
}
