"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AiExplanationBox } from "@/components/AiExplanationBox";
import { Disclaimer } from "@/components/Disclaimer";
import { EligibilityForm } from "@/components/EligibilityForm";
import { ResultCard } from "@/components/ResultCard";
import type { ApartmentListResponse, ApartmentOffering } from "@/lib/apartments/types";
import type { ApplicantProfile } from "@/lib/eligibility/types";
import { supplyTypeLabels } from "@/lib/eligibility/types";
import { createRecommendations, type RecommendationResult } from "@/lib/recommendation/recommendationEngine";
import { formatSupplyTypes, housingTypeLabels, recruitmentStatusLabels } from "@/lib/utils/format";
import { blogPosts } from "@/lib/blog/posts";

const architecture = [
  "사용자 조건 입력",
  "실시간 단지 정보 조회",
  "Rule Engine 자격 판정",
  "Recommendation Engine 전략 추천",
  "AI 쉬운 설명 생성",
];

const filterTabs = ["전체", "접수 중", "모집 예정"] as const;

type FilterTab = (typeof filterTabs)[number];
const recentGuides = blogPosts.slice(-5).reverse();

export default function Home() {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [apartments, setApartments] = useState<ApartmentOffering[]>([]);
  const [loadingApartments, setLoadingApartments] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("전체");

  const filteredApartments = useMemo(() => {
    if (filterTab === "전체") return apartments;
    const statusMap: Record<Exclude<FilterTab, "전체">, ApartmentOffering["recruitmentStatus"]> = {
      "접수 중": "open",
      "모집 예정": "upcoming",
    };
    return apartments.filter((apartment) => apartment.recruitmentStatus === statusMap[filterTab]);
  }, [apartments, filterTab]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    async function loadApartments() {
      try {
        const response = await fetch("/api/apartments");
        const data = (await response.json()) as ApartmentListResponse;
        setApartments(data.apartments);
      } catch (error) {
        console.error("Failed to load apartments", error);
      } finally {
        setLoadingApartments(false);
      }
    }
    loadApartments();
  }, []);

  function handleCalculate(nextProfile: ApplicantProfile, apartment: ApartmentOffering) {
    setProfile(nextProfile);
    setResult(createRecommendations(nextProfile, apartment));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  const themeClass = mounted && theme === "light" ? "light bg-white text-slate-950" : "bg-[#020617] text-white";

  if (!mounted) return null;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${themeClass}`}>
      <section className="slide-hero">
        <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
          <div className={`text-xl font-black tracking-tighter ${theme === "light" ? "text-slate-950" : "text-white"}`}>
            청약<span className="text-cyan-400">비서</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 lg:flex">
              <a href="/about" className="transition-colors hover:text-cyan-400">About</a>
              <a href="/blog" className="transition-colors hover:text-cyan-400">Blog</a>
              <a href="/guide" className="transition-colors hover:text-cyan-400">Guide</a>
              <a href="/faq" className="transition-colors hover:text-cyan-400">FAQ</a>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = theme === "dark" ? "light" : "dark";
                setTheme(next);
                localStorage.setItem("theme", next);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black transition-all ${theme === "light" ? "border-slate-200 bg-white text-slate-950 shadow-sm" : "border-white/10 bg-white/5 text-white"}`}
              aria-label="테마 전환"
            >
              {theme === "light" ? "D" : "L"}
            </button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-8 pb-20 pt-10 md:min-h-[calc(100vh-120px)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="slide-kicker">Rule Engine + AI Explanation</p>
            <h1 className={`text-6xl font-black leading-[1.1] tracking-tight md:text-8xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>
              청약 판단을
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">전략 추천으로</span>
            </h1>
            <p className={`mt-10 max-w-xl text-lg font-medium leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              사용자가 입력한 조건과 선택한 단지를 기준으로 가능한 전형을 분류하고, 무주택 기간·혼인 기간·자녀 수·통장 조건까지 반영해 어떤 전형을 먼저 볼지 추천합니다.
            </p>
            <p className={`mt-5 max-w-xl text-sm leading-7 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              이 서비스는 단순한 청약 계산기가 아닙니다. 룰 엔진이 먼저 가능·주의·불가를 계산하고, 추천 엔진이 단지별 공급 유형과 조건을 함께 읽은 뒤, AI가 그 결과를 쉽게 설명합니다.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#apartments" className="primary-button inline-flex items-center gap-2">현재 청약 단지 보기</a>
              <a href="#simulator" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/10">조건 입력하기</a>
            </div>
          </div>

          <div className="slide-panel p-2">
            <div className={`${theme === "light" ? "bg-slate-50/50" : "bg-slate-900/40"} rounded-[1.8rem] p-8`}>
              <h2 className={`text-2xl font-black ${theme === "light" ? "text-slate-950" : "text-white"}`}>어떻게 추천하나요?</h2>
              <div className="grid gap-4 py-8">
                {architecture.map((item, index) => (
                  <div key={item} className="flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xs font-black text-cyan-400 ring-1 ring-cyan-500/20">{index + 1}</span>
                    <p className="text-sm font-black">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold leading-6 text-slate-500">AI는 자격을 직접 판정하지 않고, 룰 엔진이 계산한 결과를 쉬운 문장으로 설명합니다.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-4 px-8 pb-20 md:grid-cols-3">
          <div className={`rounded-3xl border p-6 ${theme === "light" ? "border-slate-200 bg-white/80" : "border-white/10 bg-white/[0.04]"}`}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">What it does</h2>
            <p className={`mt-4 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              청약홈 API와 데모 데이터를 함께 보여주고, 사용자의 조건에 맞는 전형을 빠르게 좁혀 줍니다. “지금 어떤 전형을 먼저 봐야 하나”를 정리해 주는 정보 도구입니다.
            </p>
          </div>
          <div className={`rounded-3xl border p-6 ${theme === "light" ? "border-slate-200 bg-white/80" : "border-white/10 bg-white/[0.04]"}`}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">What to trust</h2>
            <p className={`mt-4 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              화면의 가능·주의·불가 상태는 룰 엔진 계산 결과입니다. 실제 신청 가능 여부는 항상 청약홈과 모집공고문을 우선해야 합니다.
            </p>
          </div>
          <div className={`rounded-3xl border p-6 ${theme === "light" ? "border-slate-200 bg-white/80" : "border-white/10 bg-white/[0.04]"}`}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">What to read next</h2>
            <p className={`mt-4 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              가이드, FAQ, 그리고 “왜 AI가 직접 판정하지 않는가” 글을 먼저 보면 구조가 빨리 잡힙니다. 그다음 단지와 결과를 보면 훨씬 자연스럽게 읽힙니다.
            </p>
          </div>
        </div>
      </section>

      <section id="apartments" className={`slide-section px-8 py-32 transition-colors duration-500 ${theme === "light" ? "bg-slate-100" : "bg-slate-950"}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="slide-kicker">Live Listings</p>
            <h2 className={`text-5xl font-black tracking-tight md:text-6xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>분양 정보 확인</h2>
            <p className="mt-6 font-medium text-slate-500">청약홈 API 또는 샘플 데이터를 통해 접수 중·예정 단지를 확인합니다.</p>
          </div>

          <div className="mb-12 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`rounded-full px-6 py-2.5 text-xs font-black tracking-widest transition-all ${
                  filterTab === tab
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white/5 text-slate-500 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loadingApartments ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApartments.map((apartment) => (
                <article key={apartment.apartmentId} className="slide-panel group p-1">
                  <div className="inner-panel block h-full p-8 transition-all hover:bg-slate-800/60">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${
                      apartment.recruitmentStatus === "open"
                        ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20"
                        : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                    }`}>
                      {recruitmentStatusLabels[apartment.recruitmentStatus]}
                    </span>
                    <h3 className="mt-8 text-2xl font-black leading-tight group-hover:text-cyan-400">{apartment.apartmentName}</h3>
                    <div className="mt-6 space-y-3 text-sm font-medium text-slate-400">
                      <p>{apartment.region} {apartment.district}</p>
                      <p>{housingTypeLabels[apartment.housingType]}</p>
                      <p>{apartment.applicationStartDate || "일정 확인 필요"} ~ {apartment.applicationEndDate || "일정 확인 필요"}</p>
                      <p className="line-clamp-2 text-xs">{formatSupplyTypes(apartment.availableSupplyTypes)}</p>
                    </div>

                    <div className="mt-8 space-y-3">
                      {apartment.officialAnnouncementUrl ? (
                        <a
                          href={`/go/${apartment.apartmentId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center justify-between rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
                        >
                          <span>청약홈 공식 모집공고문</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-300">
                          데모 단지라 공식 모집공고문이 없습니다.
                        </div>
                      )}

                      <Link
                        href={`/apartments/${apartment.apartmentId}`}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-black text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        <span>앱 내 상세 보기</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="simulator" className={`slide-section px-8 py-32 transition-colors duration-500 ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="slide-kicker">Simulator</p>
              <h2 className={`text-5xl font-black tracking-tight md:text-6xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>자격 시뮬레이션</h2>
              <p className="mt-6 font-medium text-slate-500">조건을 입력하면 단지별 가능한 전형과 추천 우선순위를 계산합니다.</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                입력값이 일부 비어 있어도 결과는 나오지만, 소득·자산·통장·지역 조건이 정확할수록 추천 이유가 더 선명해집니다. 공고별 세부 조건은 별도로 확인해야 하므로 결과를 최종 판단 대신 출발점으로 사용하세요.
              </p>
            </div>
            <div className="md:w-1/3"><Disclaimer /></div>
          </div>
          <EligibilityForm apartments={apartments} onSubmit={handleCalculate} />
        </div>
      </section>

      <section className={`slide-section px-8 py-28 transition-colors duration-500 ${theme === "light" ? "bg-slate-100" : "bg-slate-950"}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="slide-kicker">FAQ Snapshot</p>
            <h2 className={`text-4xl font-black tracking-tight md:text-5xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>자주 묻는 핵심만 먼저</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-3xl border p-6 ${theme === "light" ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.04]"}`}>
              <h3 className="text-lg font-black">AI가 자격을 직접 판단하나요?</h3>
              <p className={`mt-3 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>아닙니다. 자격 판정은 룰 엔진이 하고, AI는 결과를 쉽게 풀어주는 역할만 합니다.</p>
            </div>
            <div className={`rounded-3xl border p-6 ${theme === "light" ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.04]"}`}>
              <h3 className="text-lg font-black">예상 경쟁률은 진짜 숫자인가요?</h3>
              <p className={`mt-3 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>아닙니다. 단지 비교를 돕는 보조 지표입니다. 실제 경쟁률은 청약홈과 공식 공고문을 기준으로 확인해야 합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`slide-section px-8 py-28 transition-colors duration-500 ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="slide-kicker">Why This Exists</p>
            <h2 className={`text-4xl font-black tracking-tight md:text-5xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>
              청약 정보를
              <span className="block text-cyan-400">한 번에 읽히게</span>
            </h2>
          </div>
          <div className={`rounded-3xl border p-8 ${theme === "light" ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/[0.04]"}`}>
            <p className={`text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
              이 서비스는 사용자가 “나한테 맞는 청약이 뭔지”를 빠르게 좁히도록 돕는 정보 도구입니다. 단순히 가능/불가만 보여주는 대신, 왜 그렇게 나왔는지 이유를 함께 보여 주기 때문에 결과를 이해하고 다음 행동으로 이어가기 쉽습니다.
            </p>
            <p className={`mt-4 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
              메인 화면에서는 단지 목록, 자격 시뮬레이션, 추천 결과, 가이드 글을 한 흐름으로 연결해 두었습니다. 사용자는 공고를 보고, 조건을 입력하고, 추천 전형을 읽고, 필요하면 청약홈 공식 모집공고문으로 이동할 수 있습니다.
            </p>
            <p className={`mt-4 text-sm leading-7 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
              이렇게 구성한 이유는 검색엔진뿐 아니라 실제 사용자가 봐도 “이 사이트가 무엇을 도와주는지”가 바로 보이게 하려는 것입니다.
            </p>
          </div>
        </div>
      </section>

      <section className={`slide-section px-8 py-32 transition-colors duration-500 ${theme === "light" ? "bg-slate-100" : "bg-slate-950"}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="slide-kicker">Latest Guides</p>
              <h2 className={`text-5xl font-black tracking-tight md:text-6xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>최근 가이드 글</h2>
              <p className="mt-6 max-w-2xl font-medium text-slate-500">검색 유입과 실제 사용자 탐색을 함께 고려해, 자주 헷갈리는 청약 전략을 글로 정리했습니다.</p>
            </div>
            <a href="/blog" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/10">
              전체 글 보기
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentGuides.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`} className="slide-panel group p-1">
                <article className="inner-panel h-full p-8 transition-all hover:bg-slate-800/60">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-400 ring-1 ring-cyan-500/20">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black leading-tight group-hover:text-cyan-400">{post.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-slate-400">{post.excerpt}</p>
                  <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-cyan-400">자세히 읽기</div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      {result && profile && (
        <section id="results" className={`slide-section px-8 py-32 transition-colors duration-500 ${theme === "light" ? "bg-slate-50" : "bg-[#020617]"}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="slide-kicker">Recommendation Report</p>
                <h2 className={`text-5xl font-black tracking-tight md:text-6xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>추천 리포트</h2>
              </div>
              {result.topRecommendations[0] && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Best Strategy</p>
                  <p className="mt-1 text-sm font-black text-cyan-400">{supplyTypeLabels[result.topRecommendations[0].recommendedSupplyType]} 우선 검토</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selected Apartment</p>
                  {result.apartment.officialAnnouncementUrl ? (
                    <a
                      href={`/go/${result.apartment.apartmentId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-xl font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
                    >
                      {result.apartment.apartmentName}
                      <span aria-hidden="true" className="text-base">↗</span>
                    </a>
                  ) : (
                    <Link href={`/apartments/${result.apartment.apartmentId}`} className="mt-2 block text-xl font-black hover:text-cyan-400">
                      {result.apartment.apartmentName}
                    </Link>
                  )}
                </div>
                <div className="h-10 w-[1px] bg-white/10 max-md:hidden" />
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
                  <span>{result.apartment.region} {result.apartment.district}</span>
                  <span>{housingTypeLabels[result.apartment.housingType]}</span>
                  <span>{recruitmentStatusLabels[result.apartment.recruitmentStatus]}</span>
                  <span>{result.apartment.applicationStartDate || "일정 확인 필요"} ~ {result.apartment.applicationEndDate || "일정 확인 필요"}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-6 text-2xl font-black">추천 전형 TOP 3</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {result.topRecommendations.map((item) => (
                    <ResultCard key={item.recommendedSupplyType} result={item} />
                  ))}
                </div>
              </div>

              <AiExplanationBox profile={profile} recommendation={result} />
            </div>
          </div>
        </section>
      )}

      {result && (
        <section id="audit" className={`slide-section px-8 py-32 transition-colors duration-500 ${theme === "light" ? "bg-slate-100" : "bg-[#020617]"}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="slide-kicker">Audit</p>
              <h2 className={`text-4xl font-black tracking-tight md:text-5xl ${theme === "light" ? "text-slate-950" : "text-white"}`}>전체 전형별 판정</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {result.allResults.map((audit) => (
                <ResultCard key={audit.recommendedSupplyType} result={audit} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
