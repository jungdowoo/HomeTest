import Link from "next/link";

export function PageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-cyan-300 hover:text-cyan-200">시뮬레이터로 돌아가기</Link>
        <p className="mt-12 text-xs font-black uppercase tracking-[0.25em] text-cyan-400">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
        <div className="prose-content mt-10 space-y-6 text-base leading-8 text-slate-300">
          {children}
        </div>
      </article>
    </main>
  );
}
