import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "이용약관",
  description: "MyHome 청약비서 이용 조건, 책임 범위, 참고용 정보 고지를 안내합니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InfoPageLayout title="이용약관" subtitle="Terms of Service">
      <div className="space-y-10 text-sm leading-8 opacity-85">
        <section>
          <h2 className="mb-4 text-xl font-black text-white">제1조 목적</h2>
          <p>본 약관은 MyHome 청약비서가 제공하는 청약 정보 탐색, 자격 시뮬레이션, 전형 추천, 설명 콘텐츠 이용과 관련한 기본 사항을 정합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">제2조 서비스의 성격</h2>
          <p>서비스에서 제공하는 모든 결과는 사용자가 입력한 값과 샘플 룰 또는 연동 데이터에 따른 참고 정보입니다. 실제 청약 가능 여부, 공급 일정, 경쟁률, 제출 서류는 반드시 청약홈과 해당 단지 모집공고문을 통해 최종 확인해야 합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">제3조 AI 설명의 한계</h2>
          <p>AI는 청약 자격을 직접 판정하지 않습니다. AI 설명은 룰 엔진과 추천 엔진이 계산한 결과를 쉽게 풀어주는 보조 기능이며, 법률·정책 자문이나 확정 판단으로 해석해서는 안 됩니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">제4조 이용자의 책임</h2>
          <p>이용자는 본인의 입력값이 실제 상황과 다를 경우 결과가 달라질 수 있음을 이해해야 합니다. 청약 신청 전 공식 공고문, 청약홈, 사업주체 안내를 직접 확인해야 합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">제5조 광고 게재</h2>
          <p>서비스는 지속적인 운영을 위해 광고를 게재할 수 있습니다. 광고 게재는 콘텐츠의 독립성과 참고용 정보 제공 원칙에 영향을 주지 않습니다.</p>
        </section>

        <div className="mt-20 border-t border-white/5 pt-10 text-[11px] opacity-50">시행일: 2026년 5월 10일</div>
      </div>
    </InfoPageLayout>
  );
}
