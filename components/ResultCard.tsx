import { statusLabels, type EligibilityStatus } from "@/lib/eligibility/types";
import type { SupplyRecommendation } from "@/lib/recommendation/recommendationEngine";

const statusClass: Record<EligibilityStatus, string> = {
  eligible: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  caution: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  not_eligible: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
  not_available: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
};

const matchLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const competitionLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export function ResultCard({ result }: { result: SupplyRecommendation }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-1 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="relative z-10 h-full rounded-[1.4rem] bg-[#0f172a]/50 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-8 items-center justify-center rounded-lg bg-cyan-500/10 px-3 text-[10px] font-black text-cyan-400 ring-1 ring-cyan-500/20">
            추천 {result.recommendationRank}순위
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ring-1 ${statusClass[result.status]}`}>
            {statusLabels[result.status]}
          </span>
        </div>

        <h3 className="mt-5 text-lg font-black tracking-tight">{result.label}</h3>
        <p className="mt-3 text-[12px] font-medium leading-relaxed text-slate-400">{result.rankReason}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="추천 적합도" value={matchLabels[result.matchLevel]} />
          <Metric label="예상 경쟁" value={`${competitionLabels[result.competitionEstimate.level]} ${result.competitionEstimate.expectedRange}`} />
        </div>

        {result.strategyNotes.length > 0 && (
          <Section title="맞춤 전략 메모" tone="cyan" items={result.strategyNotes.slice(0, 3)} />
        )}

        {result.reasons.length > 0 && (
          <Section title="충족된 조건" tone="emerald" items={result.reasons.slice(0, 3)} />
        )}

        {result.missingRequirements.length > 0 && (
          <Section title="부족 조건" tone="rose" items={result.missingRequirements.slice(0, 3)} />
        )}

        {result.warnings.length > 0 && (
          <Section title="추가 확인" tone="amber" items={result.warnings.slice(0, 2)} />
        )}

        {result.scoreBreakdown.length > 0 && (
          <Section title="적합도 산정 기준" tone="slate" items={result.scoreBreakdown.slice(0, 3)} />
        )}

        <div className="mt-6 border-t border-white/5 pt-4 text-[10px] font-bold leading-5 text-slate-500">
          추천 적합도는 청약 가점이 아니라 입력 조건과 단지 공급 유형을 비교한 내부 정렬 기준입니다.
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function Section({ title, tone, items }: { title: string; tone: "cyan" | "emerald" | "rose" | "amber" | "slate"; items: string[] }) {
  const toneClass = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  }[tone];

  return (
    <div className="mt-5 space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-slate-300">
          <span className={`mt-1 text-[10px] ${toneClass}`}>•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
