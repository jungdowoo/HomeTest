import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "결과 안내",
  description: "청약 자격 시뮬레이션 결과를 확인하는 내부 경로입니다.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/result",
  },
};

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Result Route</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">결과 안내</h1>
        <p className="mt-4 leading-7 text-slate-600">
          이 경로는 청약 자격 시뮬레이션 결과를 다시 확인하기 위한 내부 안내 페이지입니다. 실제 판정은 메인 화면의 룰 엔진에서 처리되며, 이 화면은 결과를 읽고 주의 문구를 확인하는 보조 경로로만 사용합니다.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          <p className="font-bold text-slate-950">이 페이지에서 다시 확인할 것</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>선택한 단지의 모집 상태와 공급 유형</li>
            <li>가능 / 주의 / 불가 상태와 부족 조건</li>
            <li>룰 버전, 기준일, 출처 메모</li>
            <li>청약홈과 모집공고문을 다시 확인해야 하는 항목</li>
          </ul>
        </div>
        <div className="mt-6">
          <Disclaimer />
        </div>
        <Link className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white" href="/">
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
