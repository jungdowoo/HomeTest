import Link from "next/link";
import { sampleRules } from "@/lib/eligibility/sampleRules";

export default function RulesPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-bold text-cyan-700" href="/">
          메인으로 돌아가기
        </Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Rules Preview</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">룰 미리보기</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          관리자 페이지 확장 전 단계의 개발자용 룰 구조입니다. 현재 룰은 모두 데모용 샘플입니다.
        </p>
        <div className="mt-8 grid gap-4">
          {sampleRules.map((rule) => (
            <article key={rule.supplyType} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950">{rule.label}</h2>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">{rule.ruleVersion}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">기준일 {rule.effectiveDate}</p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                {rule.conditions.map((condition) => (
                  <li key={`${rule.supplyType}-${condition.field}-${condition.operator}`} className="rounded-xl bg-slate-50 px-4 py-3">
                    {condition.field} {condition.operator} {String(condition.value)} · {condition.required ? "필수" : "주의"}
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
