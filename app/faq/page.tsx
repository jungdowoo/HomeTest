import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "청약비서 사용법, 결과 해석, AI 설명, 예상 경쟁 강도, 개인정보 처리에 대한 FAQ입니다.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "청약비서 결과는 실제 신청 가능 여부를 보장하나요?",
    a: "아닙니다. 결과는 입력값과 룰 엔진에 따른 참고 정보입니다. 실제 신청 가능 여부는 반드시 청약홈과 해당 단지 모집공고문으로 확인해야 합니다.",
  },
  {
    q: "AI가 청약 자격을 판단하나요?",
    a: "아닙니다. 자격 판정은 코드 기반 룰 엔진이 수행합니다. AI는 계산된 결과를 쉬운 문장으로 설명하는 역할만 합니다.",
  },
  {
    q: "무주택 기간이 짧으면 왜 특별공급을 추천하나요?",
    a: "무주택 기간이 짧으면 일반공급 가점 경쟁에서 불리할 수 있기 때문입니다. 다만 혼인, 생애최초, 자녀 수 등 특별공급 요건과 단지 공급 유형이 함께 맞아야 합니다.",
  },
  {
    q: "예상 경쟁률은 실제 경쟁률인가요?",
    a: "아닙니다. 현재 MVP의 예상 경쟁 강도는 지역, 주택 유형, 모집 상태 등을 바탕으로 만든 참고용 분류입니다. 실제 경쟁률은 청약홈과 공식 발표를 확인해야 합니다.",
  },
  {
    q: "소득이나 자산을 비워두면 왜 주의가 뜨나요?",
    a: "소득·자산 기준은 전형과 공고에 따라 달라질 수 있어 비어 있는 경우 확정 판단이 어렵습니다. 그래서 추가 확인이 필요하다는 의미로 주의 상태를 표시합니다.",
  },
  {
    q: "선택한 단지에 없는 특별공급도 추천되나요?",
    a: "아닙니다. 선택한 단지에서 제공하지 않는 공급 유형은 추천 순위에서 제외하고 '공급 유형 없음'으로 표시합니다.",
  },
  {
    q: "개인정보가 저장되나요?",
    a: "현재 MVP는 회원가입 없이 작동하며 입력값을 별도 데이터베이스에 저장하지 않는 구조입니다. 향후 저장 기능이 생기면 개인정보처리방침을 갱신할 예정입니다.",
  },
  {
    q: "추천 전형 TOP 3는 당첨 확률 순위인가요?",
    a: "아닙니다. 추천 전형 TOP 3는 당첨 확률이 아니라 입력 조건, 단지 공급 유형, 룰 엔진 판정 결과를 함께 반영한 내부 우선 검토 순위입니다.",
  },
  {
    q: "거주 지역과 희망 지역이 다르면 결과가 달라질 수 있나요?",
    a: "그럴 수 있습니다. 실제 공고에서는 지역 우선공급이나 거주기간 요건이 영향을 줄 수 있으므로, 서비스는 이를 주의 항목으로 안내하고 최종 확인을 권장합니다.",
  },
  {
    q: "청약홈 API 정보만 보면 바로 신청해도 되나요?",
    a: "아닙니다. API 데이터는 탐색을 돕는 보조 정보입니다. 실제 일정, 공급 세대수, 제출서류, 자격 기준은 반드시 모집공고문 원문을 확인해야 합니다.",
  },
  {
    q: "광고가 붙으면 결과 추천이 달라지나요?",
    a: "아닙니다. 광고 게재 여부와 추천 엔진의 계산은 분리되어 있습니다. 추천 결과는 입력 조건과 룰 로직에 따라 계산됩니다.",
  },
];

export default function FaqPage() {
  return (
    <InfoPageLayout title="자주 묻는 질문" subtitle="FAQ">
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.05]">
            <h3 className="text-lg font-black text-cyan-400">Q. {faq.q}</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-75">A. {faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-white/5 bg-white/[0.03] p-8 text-center">
        <p className="text-sm opacity-70">찾는 질문이 없다면 문의 페이지를 통해 알려주세요.</p>
        <Link href="/contact" className="mt-4 inline-block text-sm font-black text-cyan-400 hover:underline">문의하기</Link>
      </div>
    </InfoPageLayout>
  );
}
