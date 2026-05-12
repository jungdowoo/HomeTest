import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";
import { blogPosts } from "@/lib/blog/posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "청약 가이드와 전략 글",
  description: "무주택 기간, 특별공급, 청약통장, 소득·자산 확인 등 청약 준비에 필요한 핵심 가이드를 제공합니다.",
  alternates: { canonical: "/blog" },
};

export default function BlogListingPage() {
  return (
    <InfoPageLayout title="청약 가이드와 전략 글" subtitle="Blog & Insights">
      <div className="mb-12 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8 text-sm leading-7 text-cyan-50">
        <p className="text-base font-bold leading-8">
          MyHome의 글은 청약 이해를 돕기 위한 참고 콘텐츠입니다.
        </p>
        <p className="mt-4 leading-8 text-cyan-50/90">
          실제 신청 가능 여부, 소득·자산 기준, 접수 일정은 반드시 청약홈과 모집공고문을 기준으로 확인해야 합니다. 글마다 핵심 요약과 전략 포인트를 먼저 볼 수 있게 구성했습니다.
        </p>
      </div>

      <div className="grid gap-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="group overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-1 transition-all hover:border-cyan-500/30 hover:bg-white/[0.05]">
            <Link href={`/blog/${post.slug}`} className="block h-full rounded-[1.8rem] bg-[#0f172a]/70 p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 ring-1 ring-cyan-500/20">
                  {post.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{post.date}</span>
                <span className="text-[11px] font-semibold text-slate-500">{post.readingMinutes}분 읽기</span>
              </div>
              <h2 className="mt-6 text-2xl font-black leading-tight transition-colors group-hover:text-cyan-400 md:text-3xl">
                {post.title}
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-slate-300">
                {post.excerpt}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                자세히 읽기 <span aria-hidden="true">→</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </InfoPageLayout>
  );
}
