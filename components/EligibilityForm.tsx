"use client";

import { useEffect, useMemo, useState } from "react";
import { filterApartments, getDistricts, getRegions } from "@/lib/apartments/filterApartments";
import { sampleApartments } from "@/lib/apartments/sampleApartments";
import type { ApartmentOffering } from "@/lib/apartments/types";
import type { ApplicantProfile, MaritalStatus, SupplyType } from "@/lib/eligibility/types";
import { supplyTypeLabels } from "@/lib/eligibility/types";
import { housingTypeLabels, recruitmentStatusLabels } from "@/lib/utils/format";

const supplyTypes = Object.keys(supplyTypeLabels) as SupplyType[];

const defaultProfile: ApplicantProfile = {
  age: 34,
  maritalStatus: "married",
  marriageYears: 3,
  childrenCount: 1,
  isHomeless: true,
  isHouseholder: true,
  hasSubscriptionAccount: true,
  subscriptionMonths: 24,
  paymentCount: 18,
  monthlyIncome: null,
  assetAmount: null,
  homelessPeriod: 2,
  currentRegion: "경기도",
  desiredRegion: "경기도",
  desiredDistrict: "하남시",
  preferredHousingType: "public_sale",
  interestedSupplyTypes: ["newlywed_special", "first_life_special", "general_supply"],
};

function numberOrNull(value: string) {
  return value === "" ? null : Number(value);
}

function formatWithCommas(value: number | null) {
  if (value === null) return "";
  return new Intl.NumberFormat("ko-KR").format(value);
}

function parseNumberInput(value: string) {
  const raw = value.replace(/,/g, "").replace(/[^0-9]/g, "");
  return raw === "" ? null : Number(raw);
}

export function EligibilityForm({
  apartments,
  onSubmit,
}: {
  apartments?: ApartmentOffering[];
  onSubmit: (profile: ApplicantProfile, apartment: ApartmentOffering) => void;
}) {
  const availableApartments = apartments && apartments.length > 0 ? apartments : sampleApartments;
  const firstApartment = availableApartments[0];
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState<number | "">(currentYear - (defaultProfile.age ?? 30));
  const [incomeDisplay, setIncomeDisplay] = useState(formatWithCommas(defaultProfile.monthlyIncome));
  const [assetDisplay, setAssetDisplay] = useState(formatWithCommas(defaultProfile.assetAmount));
  const [homelessPeriodDisplay, setHomelessPeriodDisplay] = useState(formatWithCommas(defaultProfile.homelessPeriod));

  const [profile, setProfile] = useState<ApplicantProfile>(() => ({
    ...defaultProfile,
    desiredRegion: firstApartment?.region ?? defaultProfile.desiredRegion,
    desiredDistrict: firstApartment?.district ?? defaultProfile.desiredDistrict,
    preferredHousingType: firstApartment?.housingType ?? defaultProfile.preferredHousingType,
  }));

  const regions = getRegions(availableApartments);
  const districts = getDistricts(profile.desiredRegion, availableApartments);
  const filteredApartments = useMemo(
    () => filterApartments(profile.desiredRegion, profile.desiredDistrict, availableApartments),
    [availableApartments, profile.desiredRegion, profile.desiredDistrict],
  );
  const [apartmentId, setApartmentId] = useState(firstApartment?.apartmentId ?? "");
  const selectedApartment = filteredApartments.find((apartment) => apartment.apartmentId === apartmentId) ?? filteredApartments[0] ?? firstApartment;

  useEffect(() => {
    if (birthYear !== "") {
      const age = currentYear - birthYear;
      setProfile((previous) => (previous.age === age ? previous : { ...previous, age }));
    } else {
      setProfile((previous) => (previous.age === null ? previous : { ...previous, age: null }));
    }
  }, [birthYear, currentYear]);

  useEffect(() => {
    if (!availableApartments.some((apartment) => apartment.apartmentId === apartmentId)) {
      const nextApartment = availableApartments[0];
      if (nextApartment) {
        setApartmentId(nextApartment.apartmentId);
        setProfile((previous) => ({
          ...previous,
          desiredRegion: nextApartment.region,
          desiredDistrict: nextApartment.district,
          preferredHousingType: nextApartment.housingType,
        }));
      }
    }
  }, [apartmentId, availableApartments]);

  function update<K extends keyof ApplicantProfile>(field: K, value: ApplicantProfile[K]) {
    setProfile((previous) => ({ ...previous, [field]: value }));
  }

  function handleRegion(region: string) {
    const nextDistrict = getDistricts(region, availableApartments)[0] ?? "";
    const nextApartment = filterApartments(region, nextDistrict, availableApartments)[0];
    setProfile((previous) => ({ ...previous, desiredRegion: region, desiredDistrict: nextDistrict }));
    setApartmentId(nextApartment?.apartmentId ?? "");
  }

  function handleDistrict(district: string) {
    const nextApartment = filterApartments(profile.desiredRegion, district, availableApartments)[0];
    setProfile((previous) => ({ ...previous, desiredDistrict: district }));
    setApartmentId(nextApartment?.apartmentId ?? "");
  }

  function toggleSupplyType(type: SupplyType) {
    setProfile((previous) => {
      const exists = previous.interestedSupplyTypes.includes(type);
      return {
        ...previous,
        interestedSupplyTypes: exists
          ? previous.interestedSupplyTypes.filter((item) => item !== type)
          : [...previous.interestedSupplyTypes, type],
      };
    });
  }

  return (
    <form
      className="slide-panel p-1"
      onSubmit={(event) => {
        event.preventDefault();
        if (selectedApartment) onSubmit({ ...profile, preferredHousingType: selectedApartment.housingType }, selectedApartment);
      }}
    >
      <div className="inner-panel p-8 md:p-12">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Simulation Console</p>
            <h2 className="mt-4 text-3xl font-black">조건을 입력하세요</h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed opacity-60">
              실제 청약 단지와 사용자 조건을 조합해 가능한 전형과 추천 전략을 룰 엔진으로 계산합니다.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-50">
            ApplyHome API Ready
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Field label="출생연도">
            <select className="input appearance-none" value={birthYear} onChange={(event) => setBirthYear(Number(event.target.value))}>
              {Array.from({ length: 61 }, (_, index) => 2010 - index).map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </Field>
          <Field label="혼인 여부">
            <select className="input appearance-none" value={profile.maritalStatus} onChange={(event) => update("maritalStatus", event.target.value as MaritalStatus)}>
              <option value="single">미혼</option>
              <option value="married">기혼</option>
              <option value="divorced">이혼</option>
              <option value="widowed">사별</option>
            </select>
          </Field>
          <Field label="혼인 기간(년)">
            <input className="input" min={0} type="number" value={profile.marriageYears ?? ""} onChange={(event) => update("marriageYears", numberOrNull(event.target.value))} />
          </Field>
          <Field label="자녀 수">
            <input className="input" min={0} type="number" value={profile.childrenCount} onChange={(event) => update("childrenCount", Number(event.target.value))} />
          </Field>
          <Field label="청약통장 가입 기간(개월)">
            <input className="input" min={0} type="number" value={profile.subscriptionMonths ?? ""} onChange={(event) => update("subscriptionMonths", numberOrNull(event.target.value))} />
          </Field>
          <Field label="납입 횟수">
            <input className="input" min={0} type="number" value={profile.paymentCount ?? ""} onChange={(event) => update("paymentCount", numberOrNull(event.target.value))} />
          </Field>
          <Field label="월평균 소득">
            <MoneyInput value={incomeDisplay} onChange={(value) => { const next = parseNumberInput(value); setIncomeDisplay(formatWithCommas(next)); update("monthlyIncome", next); }} />
          </Field>
          <Field label="자산 금액">
            <MoneyInput value={assetDisplay} onChange={(value) => { const next = parseNumberInput(value); setAssetDisplay(formatWithCommas(next)); update("assetAmount", next); }} />
          </Field>
          <Field label="무주택 기간">
            <div className="relative">
              <input
                className="input pr-16"
                min={0}
                type="text"
                placeholder="예: 2"
                value={homelessPeriodDisplay}
                onChange={(event) => {
                  const next = parseNumberInput(event.target.value);
                  setHomelessPeriodDisplay(formatWithCommas(next));
                  update("homelessPeriod", next);
                }}
              />
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">년</span>
            </div>
          </Field>
          <Field label="현재 거주 지역">
            <input className="input" value={profile.currentRegion} onChange={(event) => update("currentRegion", event.target.value)} />
          </Field>
          <Field label="희망 시/도">
            <select className="input appearance-none" value={profile.desiredRegion} onChange={(event) => handleRegion(event.target.value)}>
              {regions.map((region) => <option key={region}>{region}</option>)}
            </select>
          </Field>
          <Field label="희망 시/군/구">
            <select className="input appearance-none" value={profile.desiredDistrict} onChange={(event) => handleDistrict(event.target.value)}>
              {districts.map((district) => <option key={district}>{district}</option>)}
            </select>
          </Field>
          <Field label="아파트 단지 선택">
            <select className="input appearance-none" value={selectedApartment?.apartmentId ?? ""} onChange={(event) => setApartmentId(event.target.value)}>
              {filteredApartments.map((apartment) => (
                <option key={apartment.apartmentId} value={apartment.apartmentId}>
                  [{recruitmentStatusLabels[apartment.recruitmentStatus]}] {apartment.apartmentName}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Toggle label="무주택 세대" checked={profile.isHomeless} onChange={(checked) => update("isHomeless", checked)} />
          <Toggle label="세대주 여부" checked={profile.isHouseholder} onChange={(checked) => update("isHouseholder", checked)} />
          <Toggle label="청약통장 보유" checked={profile.hasSubscriptionAccount} onChange={(checked) => update("hasSubscriptionAccount", checked)} />
        </div>

        <div className="mt-12 space-y-10">
          <ChoiceGroup title="희망 주택 유형">
            {Object.entries(housingTypeLabels).map(([value, label]) => (
              <button key={value} type="button" onClick={() => update("preferredHousingType", value as ApplicantProfile["preferredHousingType"])} className={`choice-chip ${profile.preferredHousingType === value ? "choice-chip-active" : ""}`}>{label}</button>
            ))}
          </ChoiceGroup>
          <ChoiceGroup title="관심 공급 유형">
            {supplyTypes.map((type) => (
              <button key={type} type="button" onClick={() => toggleSupplyType(type)} className={`choice-chip ${profile.interestedSupplyTypes.includes(type) ? "choice-chip-active" : ""}`}>{supplyTypeLabels[type]}</button>
            ))}
          </ChoiceGroup>
        </div>

        <div className="mt-16 border-t border-white/5 pt-10">
          <button type="submit" className="primary-button flex w-full items-center justify-center gap-3 py-5 text-lg">청약 자격 시뮬레이션 실행</button>
          <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Rule Engine으로 계산합니다</p>
        </div>
      </div>
    </form>
  );
}

function MoneyInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <input className="input pr-16" type="text" placeholder="선택 입력" value={value} onChange={(event) => onChange(event.target.value)} />
      <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">만원</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">{label}</span><div className="relative">{children}</div></label>;
}

function ChoiceGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">{title}</p><div className="flex flex-wrap gap-3">{children}</div></div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className={`toggle-card ${checked ? "toggle-card-active" : ""}`}>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
