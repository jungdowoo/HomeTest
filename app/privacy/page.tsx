import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "MyHome 청약비서의 개인정보 처리 방식, 쿠키 및 광고 고지, 문의 방법을 안내합니다.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="개인정보처리방침" subtitle="Privacy Policy">
      <div className="space-y-10 text-sm leading-8 opacity-85">
        <section>
          <h2 className="mb-4 text-xl font-black text-white">1. 개인정보 처리 목적</h2>
          <p>MyHome 청약비서는 청약 조건 시뮬레이션과 단지별 추천 결과 제공을 위해 사용자가 입력한 조건을 브라우저 화면에서 처리합니다. MVP 단계에서는 별도 회원가입을 제공하지 않으며, 입력값을 사용자 식별 목적으로 서버에 저장하지 않습니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">2. 처리하는 정보</h2>
          <p>나이, 혼인 여부, 자녀 수, 무주택 여부, 청약통장 정보, 소득·자산 입력값, 희망 지역 등 사용자가 직접 입력한 값이 시뮬레이션에 사용됩니다. 이 값은 청약 자격 탐색을 위한 참고 계산에만 사용됩니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">3. 보관 및 파기</h2>
          <p>현재 서비스는 입력값을 별도 데이터베이스에 저장하지 않는 구조입니다. 브라우저 세션이 종료되거나 페이지를 새로고침하면 입력 상태가 초기화될 수 있습니다. 향후 저장 기능이 추가될 경우 본 방침을 갱신합니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">4. 쿠키 및 광고 고지</h2>
          <p>서비스는 Google AdSense 광고 코드를 사용할 수 있습니다. Google 및 제3자 광고 공급업체는 쿠키를 사용해 사용자의 이전 방문 기록 또는 다른 웹사이트 방문 정보를 바탕으로 광고를 게재할 수 있습니다.</p>
          <p className="mt-4">Google의 광고 쿠키 사용은 Google과 파트너가 본 사이트 또는 인터넷상의 다른 사이트 방문 정보를 바탕으로 사용자에게 맞춤 광고를 표시하는 데 사용될 수 있습니다.</p>
          <p className="mt-4">사용자는 <a className="text-cyan-300 underline" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google 광고 설정</a>에서 맞춤 광고를 관리하거나 거부할 수 있습니다. 또한 브라우저 설정에서 쿠키 저장을 제한하거나 삭제할 수 있습니다.</p>
          <p className="mt-4">제3자 광고 네트워크 또는 광고 공급업체가 사용되는 경우 해당 업체의 쿠키가 광고 게재에 사용될 수 있으며, 사용자는 각 업체가 제공하는 선택 도구 또는 <a className="text-cyan-300 underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">aboutads.info</a>와 같은 선택 도구를 통해 일부 맞춤 광고 사용을 관리할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">5. 제3자 제공</h2>
          <p>서비스는 사용자의 입력 정보를 제3자에게 판매하거나 제공하지 않습니다. 다만 법령상 요청이 있거나 서비스 운영에 필요한 범위에서 관련 법령에 따라 처리될 수 있습니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">6. 문의</h2>
          <p>개인정보 처리와 관련한 문의는 문의 페이지 또는 이메일을 통해 접수할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">7. 정책 변경 안내</h2>
          <p>서비스 구조, 광고 제공 방식, 개인정보 처리 방식이 변경되면 본 개인정보처리방침을 갱신합니다. 중요한 변경이 있는 경우 페이지 내 고지 또는 별도 안내를 통해 변경 내용을 확인할 수 있도록 하겠습니다.</p>
        </section>

        <div className="mt-20 border-t border-white/5 pt-10 text-[11px] opacity-50">최종 수정일: 2026년 7월 2일</div>
      </div>
    </InfoPageLayout>
  );
}
