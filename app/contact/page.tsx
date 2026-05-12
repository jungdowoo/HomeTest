"use client";

import { useState } from "react";
import { InfoPageLayout } from "@/components/InfoPageLayout";

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);

  return (
    <InfoPageLayout title="문의하기" subtitle="Contact Us">
      <div className="relative space-y-12">
        <section>
          <h2 className="text-2xl font-black">무엇을 도와드릴까요?</h2>
          <p className="mt-4 text-lg leading-relaxed opacity-70">
            서비스 이용 제안, 오류 제보, 콘텐츠 수정 요청, 광고 및 제휴 문의가 있다면 아래 연락처 또는 메일 작성 폼을 이용해 주세요.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</p>
            <p className="mt-4 text-xl font-black text-cyan-400">jdw9302@naver.com</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Time</p>
            <p className="mt-4 text-xl font-black text-white">영업일 기준 순차 확인</p>
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/40 p-10">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const name = formData.get("name");
              const email = formData.get("email");
              const message = formData.get("message");
              const subject = encodeURIComponent(`[청약비서 문의] ${name}님의 메시지`);
              const body = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n문의 내용:\n${message}`);

              window.location.href = `mailto:jdw9302@naver.com?subject=${subject}&body=${body}`;
              setIsSent(true);
            }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">이름 또는 닉네임</label>
                <input name="name" required className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm outline-none focus:border-cyan-500/50" placeholder="홍길동" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">이메일 주소</label>
                <input name="email" type="email" required className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm outline-none focus:border-cyan-500/50" placeholder="example@email.com" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">문의 내용</label>
              <textarea name="message" required rows={5} className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm outline-none focus:border-cyan-500/50" placeholder="문의하실 내용을 자세히 적어주세요." />
            </div>
            <button type="submit" className="primary-button w-full py-5 text-sm font-black">메일 작성하기</button>
          </form>
        </section>

        {isSent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md">
            <div className="mx-4 w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-10 text-center shadow-2xl">
              <h3 className="text-2xl font-black text-white">메일 앱을 확인해 주세요</h3>
              <p className="mt-4 font-medium leading-relaxed text-slate-400">
                기본 메일 프로그램이 열렸습니다. 내용을 확인한 뒤 전송 버튼을 눌러야 문의가 접수됩니다.
              </p>
              <button onClick={() => setIsSent(false)} className="mt-10 w-full rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 transition hover:bg-cyan-400">
                확인했습니다
              </button>
            </div>
          </div>
        )}
      </div>
    </InfoPageLayout>
  );
}
