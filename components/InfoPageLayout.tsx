"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface InfoPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const isLight = theme === "light";

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? "bg-white text-slate-900" : "bg-[#020617] text-white"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
        <Link href="/" className={`text-xl font-black tracking-tighter ${isLight ? "text-slate-950" : "text-white"}`}>
          청약<span className="text-cyan-400">비서</span>
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500 md:flex">
            <Link href="/about" className="transition-colors hover:text-cyan-400">About</Link>
            <Link href="/blog" className="transition-colors hover:text-cyan-400">Blog</Link>
            <Link href="/guide" className="transition-colors hover:text-cyan-400">Guide</Link>
            <Link href="/faq" className="transition-colors hover:text-cyan-400">FAQ</Link>
            <Link href="/privacy" className="transition-colors hover:text-cyan-400">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-cyan-400">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-cyan-400">Contact</Link>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              localStorage.setItem("theme", next);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black transition-all ${
              isLight ? "border-slate-200 bg-white text-slate-950 shadow-sm" : "border-white/10 bg-white/5 text-white"
            }`}
            aria-label="테마 전환"
          >
            {isLight ? "D" : "L"}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">
        <header className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">{subtitle}</p>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
          <div className="mt-10 h-1 w-20 bg-cyan-500" />
        </header>

        <section
          className={[
            "prose prose-slate max-w-none",
            "prose-h2:mt-14 prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-tight prose-h2:text-white",
            "prose-h3:mt-10 prose-h3:text-xl prose-h3:font-black prose-h3:text-white",
            "prose-p:my-5 prose-p:text-[16px] prose-p:leading-8 prose-p:text-slate-300",
            "prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline",
            "prose-strong:text-white",
            "prose-ul:my-6 prose-ul:space-y-3 prose-li:my-0 prose-li:leading-8",
            "prose-blockquote:border-cyan-400 prose-blockquote:bg-white/[0.03] prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:text-slate-200",
            isLight ? "" : "prose-invert",
          ].join(" ")}
        >
          {children}
        </section>

        <footer className="mt-32 border-t border-white/10 pb-20 pt-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <p className="text-sm font-medium text-slate-500">
              2026 청약비서. 청약 정보 탐색을 돕는 참고용 서비스입니다.
            </p>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <Link href="/privacy" className="hover:text-cyan-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-cyan-400">Terms of Service</Link>
              <Link href="/contact" className="hover:text-cyan-400">Contact</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
