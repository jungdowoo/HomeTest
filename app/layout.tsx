import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MyHome 청약 자격 시뮬레이터",
    template: "%s | MyHome 청약 자격 시뮬레이터",
  },
  description: "청약홈 API 단지 정보를 바탕으로 Rule Engine이 청약 전형 적합도를 계산하고 AI가 결과를 쉽게 설명하는 청약 정보 서비스입니다.",
  keywords: ["청약", "청약홈", "아파트 청약", "특별공급", "신혼부부 특별공급", "생애최초 특별공급", "청약 자격"],
  authors: [{ name: "MyHome Simulator" }],
  creator: "MyHome Simulator",
  publisher: "MyHome Simulator",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MyHome 청약 자격 시뮬레이터",
    description: "청약홈 API와 룰 엔진 기반으로 단지별 신청 가능 전형을 탐색하는 청약 정보 서비스입니다.",
    url: siteUrl,
    siteName: "MyHome 청약 자격 시뮬레이터",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

const navLinks = [
  { href: "/", label: "시뮬레이터" },
  { href: "/guide", label: "청약 가이드" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "서비스 소개" },
  { href: "/contact", label: "문의" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {adsenseClient ? (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
        <footer className="border-t border-white/10 bg-[#020617] px-6 py-10 text-sm text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black text-white">MYHOME<span className="text-cyan-400">SIM</span></p>
              <p className="mt-2 max-w-2xl leading-6">
                이 서비스는 청약 정보 탐색을 돕는 참고용 도구입니다. 실제 신청 가능 여부, 공급 일정, 경쟁률은 청약홈과 모집공고문을 반드시 확인해야 합니다.
              </p>
            </div>
            <nav className="flex flex-wrap gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-cyan-300">
                  {link.label}
                </Link>
              ))}
              <Link href="/privacy" className="hover:text-cyan-300">개인정보처리방침</Link>
              <Link href="/terms" className="hover:text-cyan-300">이용약관</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
