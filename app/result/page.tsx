import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "결과 안내",
  description: "청약 자격 시뮬레이션 결과는 메인 화면에서 입력값을 기준으로 확인할 수 있습니다.",
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
          청약 자격 시뮬레이션 결과는 메인 화면에서 사용자가 입력한 조건과 선택한 단지를 기준으로 계산됩니다.
          이 페이지는 결과 화면으로 직접 진입했을 때 안내를 제공하는 보조 경로입니다.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          <p className="font-bold text-slate-950">메인 화면에서 확인할 수 있는 내용</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>선택한 단지의 모집 상태와 제공 공급 유형</li>
            <li>가능, 주의, 불가 상태와 부족 조건</li>
            <li>추천 전형 TOP 3와 추천 이유</li>
            <li>룰 버전, 기준일, 출처 메모</li>
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
