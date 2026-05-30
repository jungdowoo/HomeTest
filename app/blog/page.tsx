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
  const featuredPosts = [
    "cheongyak-beginner-roadmap",
    "announcement-reading-guide",
    "special-supply-type-map",
    "common-mistakes-before-apply",
  ]
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is (typeof blogPosts)[number] => Boolean(post));

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

      <section className="mb-12 rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Start Here</p>
        <h2 className="mt-4 text-3xl font-black">처음 방문했다면 이 순서로 읽어보세요</h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
          이 블로그는 단순 뉴스 모음이 아니라 청약을 처음 준비하는 사람이 조건, 공고문, 전형, 서류를 차례로 이해하도록 만든 콘텐츠 허브입니다. 아래 글들은 재방문자가 가장 먼저 읽어도 좋은 핵심 글입니다.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-6 transition hover:border-cyan-500/40 hover:bg-cyan-500/10"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">{post.category}</span>
              <h3 className="mt-3 text-lg font-black leading-tight">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="text-lg font-black text-cyan-400">초보자 흐름</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">용어, 준비 순서, 공고문 읽기처럼 처음 막히는 지점을 먼저 설명합니다.</p>
        </div>
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="text-lg font-black text-cyan-400">조건별 전략</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">무주택, 혼인, 자녀, 통장, 소득·자산 입력값이 결과에 어떻게 이어지는지 다룹니다.</p>
        </div>
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
          <h2 className="text-lg font-black text-cyan-400">신청 전 점검</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">공식 모집공고문, 서류, 일정, 주의 문구를 실제 행동으로 연결하는 방법을 정리합니다.</p>
        </div>
      </section>

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
