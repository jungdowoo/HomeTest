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

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">01</p>
            <h3 className="mt-3 text-lg font-black">룰 기반 판정</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-75">
              자격 여부는 AI가 추측하지 않고, 조건별 규칙으로 계산합니다. 그래서 결과가 왜 나왔는지 설명하기 쉽고, 나중에 테스트나 규칙 변경도 관리하기 좋습니다.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">02</p>
            <h3 className="mt-3 text-lg font-black">추천 엔진 분리</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-75">
              판정과 추천은 같은 로직이 아닙니다. 이 프로젝트는 가능한 전형을 구한 뒤, 단지 공급 유형과 사용자 조건을 함께 고려해 추천 순서를 따로 계산합니다.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">03</p>
            <h3 className="mt-3 text-lg font-black">AI는 설명만</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-75">
              AI는 계산 결과를 쉬운 말로 풀어주는 역할만 담당합니다. 정책성 판단을 직접 맡기지 않기 때문에, 비용과 위험을 함께 줄일 수 있습니다.
            </p>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h3 className="text-xl font-black text-cyan-400">Rule Engine</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              청약 자격 판정은 AI가 직접 하지 않습니다. 조건 비교와 가능·주의·불가 판정은 타입이 정의된 룰 엔진에서 수행합니다. 이 구조는 결과의 근거를 추적하기 쉽고 테스트할 수 있습니다.
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              룰 버전, 기준일, 출처 메모를 함께 두기 때문에 나중에 Supabase나 JSON 관리로 옮길 때도 구조를 유지하기 쉽습니다.
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              공개 페이지에서 바로 읽히는 설명을 늘려 둔 이유도 여기에 있습니다. 심사자 입장에서 “이 서비스가 왜 필요한지”와 “무엇이 자동 판단이 아닌지”가 빠르게 보이면 전체 신뢰도가 좋아집니다.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h3 className="text-xl font-black text-cyan-400">AI Explanation</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              AI는 룰 엔진과 추천 엔진이 계산한 결과를 쉬운 문장으로 설명하는 역할만 담당합니다. 중요한 정책성 판단을 LLM에게 직접 맡기지 않기 위한 설계입니다.
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              같은 입력과 같은 결과에 대해 설명을 캐싱하기 쉽기 때문에, 비용을 아끼면서도 사용자가 버튼을 눌렀을 때만 AI를 호출하는 구조를 유지할 수 있습니다.
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              앞으로는 Supabase로 룰 버전과 설명 캐시를 저장하고, OpenAI API를 붙여도 이 구조를 그대로 유지할 수 있게 설계했습니다.
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
            <li>샘플 룰과 샘플 단지는 데모용이며, 실제 운영 시에는 공고 데이터와 관리자 규칙으로 교체할 수 있게 설계합니다.</li>
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black">콘텐츠 검수 기준</h2>
            <p className="mt-4 text-sm leading-7 opacity-75">
              청약비서의 가이드 글은 사용자가 청약 정보를 처음 읽을 때 헷갈리기 쉬운 지점을 설명하는 데 초점을 둡니다. 특정 단지의 실제 신청 가능 여부를 확정하지 않고, 공식 모집공고문에서 확인해야 할 항목을 먼저 정리합니다.
            </p>
            <p className="mt-4 text-sm leading-7 opacity-75">
              정책성 문장은 확정 표현을 피하고, 조건·서류·일정·지역 기준처럼 사용자가 직접 확인해야 하는 항목을 분리해 작성합니다. 잘못된 단정이 생기지 않도록 “가능”, “주의”, “불가”의 의미도 서비스 전반에서 반복 안내합니다.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-black">출처와 업데이트 방식</h2>
            <p className="mt-4 text-sm leading-7 opacity-75">
              단지 정보는 청약홈 API 또는 데모 샘플 데이터를 기반으로 노출되며, 실제 신청 전에는 청약홈과 해당 단지 모집공고문을 다시 확인해야 합니다. 샘플 데이터는 사용 흐름을 보여주기 위한 데모 자료로 실제 공고와 구분합니다.
            </p>
            <p className="mt-4 text-sm leading-7 opacity-75">
              룰 엔진은 ruleVersion, 기준일, 출처 메모를 포함할 수 있는 구조로 설계되어 있습니다. 제도나 공고 기준이 변경되면 자동으로 단정하지 않고, 개발자 또는 관리자가 룰을 검토해 반영하는 방식을 전제로 합니다.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8">
          <h2 className="text-2xl font-black text-cyan-300">운영자 정보와 문의</h2>
          <p className="mt-4 text-sm leading-7 opacity-80">
            청약비서는 개인 프로젝트로 시작한 청약 정보 탐색 도구이며, 서비스 오류 제보와 콘텐츠 수정 요청은 문의 페이지를 통해 받을 수 있습니다. 사용자가 더 정확한 정보를 찾을 수 있도록 피드백을 바탕으로 가이드와 룰 구조를 지속적으로 개선합니다.
          </p>
          <p className="mt-4 text-sm leading-7 opacity-80">
            문의, 오류 제보, 광고 및 제휴 관련 연락은 <a className="font-bold text-cyan-300 underline" href="/contact">문의하기</a> 페이지에서 확인할 수 있습니다.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
