import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Result Route</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">결과 확인</h1>
        <p className="mt-4 leading-7 text-slate-600">
          MVP에서는 메인 화면에서 입력과 결과 확인을 한 번에 처리합니다. 추후 저장된 시뮬레이션 결과를 공유하거나 다시 열 수
          있도록 이 경로를 확장할 수 있습니다.
        </p>
        <div className="mt-6">
          <Disclaimer />
        </div>
        <Link className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white" href="/">
          시뮬레이터로 돌아가기
        </Link>
      </div>
    </main>
  );
}
