import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: "MyHome 청약비서는 룰 엔진 기반 청약 전형 추천과 AI 설명을 결합한 참고용 청약 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPageLayout title="서비스 소개" subtitle="About MyHome">
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black">청약 판단을 더 투명하게 돕는 도구</h2>
          <p className="mt-4 text-lg leading-relaxed opacity-80">
            MyHome 청약비서는 복잡한 청약 정보를 사용자가 이해하기 쉽게 정리하기 위해 만든 참고용 웹서비스입니다. 사용자가 입력한 조건과 선택한 아파트 단지를 바탕으로 가능한 전형을 분류하고, 어떤 전형을 먼저 확인하면 좋을지 추천합니다.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h3 className="text-xl font-black text-cyan-400">Rule Engine</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              청약 자격 판정은 AI가 직접 하지 않습니다. 조건 비교와 가능·주의·불가 판정은 타입이 정의된 룰 엔진에서 수행합니다. 이 구조는 결과의 근거를 추적하기 쉽고 테스트할 수 있습니다.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h3 className="text-xl font-black text-cyan-400">AI Explanation</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              AI는 룰 엔진과 추천 엔진이 계산한 결과를 쉬운 문장으로 설명하는 역할만 담당합니다. 중요한 정책성 판단을 LLM에게 직접 맡기지 않기 위한 설계입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">운영 원칙</h2>
          <ul className="mt-6 list-inside list-disc space-y-3 text-sm leading-7 opacity-80">
            <li>모든 결과는 참고용이며 실제 신청 가능 여부는 청약홈과 모집공고문 기준을 우선합니다.</li>
            <li>정책과 법령성 정보는 자동으로 단정하지 않고, 룰 버전과 기준일을 표시할 수 있는 구조로 관리합니다.</li>
            <li>예상 경쟁 강도는 실제 경쟁률 예측이 아니라 사용자 비교를 돕는 보조 지표입니다.</li>
            <li>개인정보를 서버에 저장하지 않는 MVP 구조를 우선합니다.</li>
          </ul>
        </section>
      </div>
    </InfoPageLayout>
  );
}
