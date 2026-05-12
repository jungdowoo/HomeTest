import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";
import { blogPosts } from "@/lib/blog/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <InfoPageLayout title={post.title} subtitle={post.category}>
      <div className="mb-12 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
        <span>작성일: {post.date}</span>
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span>분류: {post.category}</span>
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span>{post.readingMinutes}분 읽기</span>
      </div>

      <div className="mb-12 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 text-sm leading-7 text-amber-100">
        이 글은 청약 정보 탐색을 돕기 위한 참고용 콘텐츠입니다. 실제 신청 가능 여부와 세부 기준은 반드시 청약홈 및 해당 단지 모집공고문을 확인해야 합니다.
      </div>

      <div
        className="blog-content prose prose-slate prose-invert max-w-none prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-black prose-h2:text-white prose-p:text-slate-300 prose-p:leading-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-20 border-t border-white/10 pt-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-black text-cyan-400 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    </InfoPageLayout>
  );
}
