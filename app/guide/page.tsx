import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "청약 가이드",
  description: "청약 자격 시뮬레이터 사용법과 특별공급, 일반공급, 단지 선택 기준을 쉽게 안내합니다.",
  alternates: { canonical: "/guide" },
};

const steps = [
  {
    title: "1. 단지와 지역을 먼저 선택하세요",
    body: "청약 결과는 사용자 조건만으로 결정되지 않습니다. 선택한 단지가 어떤 공급 유형을 제공하는지, 접수 중인지, 주택 유형이 무엇인지가 함께 반영됩니다.",
  },
  {
    title: "2. 무주택 기간과 통장 정보를 입력하세요",
    body: "무주택 기간이 짧으면 특별공급 검토 비중이 높아질 수 있고, 무주택 기간이 길면 일반공급도 함께 비교할 만합니다. 청약통장 가입 기간과 납입 횟수도 결과에 영향을 줍니다.",
  },
  {
    title: "3. 혼인·자녀·소득·자산 항목을 확인하세요",
    body: "신혼부부, 생애최초, 다자녀 등 특별공급은 개인 조건별로 검토해야 합니다. 소득과 자산을 비워두면 실제 가능 여부 확인이 필요하므로 주의로 표시될 수 있습니다.",
  },
  {
    title: "4. 추천 전형 TOP 3를 비교하세요",
    body: "추천 순위는 청약 가점이 아닙니다. 룰 엔진 판정과 단지 공급 유형, 사용자 관심 유형, 전략 메모를 조합한 내부 정렬 기준입니다.",
  },
];

export default function GuidePage() {
  return (
    <InfoPageLayout title="청약비서 사용 가이드" subtitle="Usage Guide">
      <div className="space-y-12">
        <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8 text-sm leading-7 text-cyan-50">
          청약비서는 청약홈과 모집공고문을 대신하지 않습니다. 사용자가 조건을 빠르게 정리하고, 어떤 전형을 먼저 확인하면 좋을지 탐색하도록 돕는 참고용 도구입니다.
        </section>

        <section>
          <h2 className="text-2xl font-black">시뮬레이터 사용 순서</h2>
          <div className="mt-8 space-y-6">
            {steps.map((step) => (
              <div key={step.title} className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
                <h3 className="text-lg font-black text-cyan-400">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 opacity-75">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">추천 콘텐츠</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link href="/blog/homeless-period-strategy" className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-cyan-500/40">무주택 기간이 짧을 때 청약 전략</Link>
            <Link href="/blog/newlywed-special-checklist" className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-cyan-500/40">신혼부부 특별공급 체크리스트</Link>
            <Link href="/blog/general-supply-vs-special-supply" className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-cyan-500/40">일반공급과 특별공급 비교</Link>
            <Link href="/blog/rule-engine-not-ai-judgement" className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-cyan-500/40">AI 직접 판정을 피하는 이유</Link>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-slate-900/50 p-10">
          <h2 className="text-xl font-black">주의사항</h2>
          <ul className="mt-6 list-inside list-disc space-y-4 text-sm opacity-80">
            <li>결과는 입력값과 데모 룰 또는 연동 데이터에 따른 참고 정보입니다.</li>
            <li>실제 신청 가능 여부는 청약홈과 해당 단지 모집공고문으로 최종 확인해야 합니다.</li>
            <li>예상 경쟁 강도는 실제 경쟁률 예측이 아니라 비교용 보조 지표입니다.</li>
            <li>정책과 공고 기준은 수시로 변경될 수 있으므로 최신 공고문 확인이 필요합니다.</li>
          </ul>
        </section>
      </div>
    </InfoPageLayout>
  );
}
