import type { Metadata } from "next";
import Link from "next/link";
import { sampleRules } from "@/lib/eligibility/sampleRules";

export const metadata: Metadata = {
  title: "룰 미리보기",
  description: "청약 전형 룰 구조를 확인하는 내부 미리보기 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/rules-preview",
  },
};

export default function RulesPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-bold text-cyan-700" href="/">
          메인으로 돌아가기
        </Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Rules Preview</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">룰 미리보기</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          이 페이지는 관리자용 또는 개발자용으로 룰 구조를 확인하기 위한 미리보기 화면입니다. 실제 사용자에게 노출되는 핵심 가치는 메인 시뮬레이터와 정보 페이지에 집중되어야 하므로, 이 화면은 검색 노출용 콘텐츠로 보지 않도록 정리했습니다.
        </p>
        <div className="mt-6 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <p className="font-bold">미리보기에서 확인할 항목</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>전형별 ruleVersion과 effectiveDate</li>
            <li>조건 필드, 연산자, required 여부</li>
            <li>sourceNote와 추후 DB 이전 가능성</li>
          </ul>
        </div>
        <div className="mt-8 grid gap-4">
          {sampleRules.map((rule) => (
            <article key={rule.supplyType} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950">{rule.label}</h2>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">{rule.ruleVersion}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">기준일: {rule.effectiveDate}</p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                {rule.conditions.map((condition) => (
                  <li key={`${rule.supplyType}-${condition.field}-${condition.operator}`} className="rounded-xl bg-slate-50 px-4 py-3">
                    {condition.field} {condition.operator} {String(condition.value)} / {condition.required ? "필수" : "주의"}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-5 text-slate-500">{rule.sourceNote}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
