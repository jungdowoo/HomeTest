"use client";

import { useState } from "react";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import type { RecommendationResult } from "@/lib/recommendation/recommendationEngine";

export function AiExplanationBox({
  profile,
  recommendation,
}: {
  profile: ApplicantProfile;
  recommendation: RecommendationResult;
}) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    setLoading(true);
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, recommendation }),
    });
    const data = (await response.json()) as { explanation: string };
    setExplanation(data.explanation);
    setLoading(false);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-1 backdrop-blur-xl">
      <div className="rounded-[1.4rem] bg-[#0f172a]/50 p-8 md:p-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Generative Insight</p>
            <h2 className="mt-4 text-3xl font-black">AI 쉬운 설명</h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed opacity-60">
              룰 엔진이 계산한 판정과 추천 결과만 바탕으로, 사용자가 이해하기 쉬운 설명을 생성합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExplain}
            disabled={loading}
            className="primary-button flex min-w-[200px] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "설명 생성 중" : "AI 설명 실행"}
          </button>
        </div>
        {explanation && (
          <div className="relative mt-10">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg" />
            <div className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Explanation Report</span>
              </div>
              <div className="space-y-4 text-[15px] font-medium leading-7 text-slate-200">
                {explanation
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((paragraph) => {
                    const [head, ...rest] = paragraph.split(": ");
                    const hasLabel = rest.length > 0 && /^(1순위 추천|추천 이유|주의사항|예상 경쟁도|다음 검토안|참고)$/.test(head);

                    if (!hasLabel) {
                      return <p key={paragraph} className="text-pretty whitespace-pre-wrap">{paragraph}</p>;
                    }

                    return (
                      <div key={paragraph} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">{head}</p>
                        <p className="mt-3 whitespace-pre-wrap text-pretty text-slate-200">{rest.join(": ")}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
