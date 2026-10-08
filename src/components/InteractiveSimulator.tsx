import React from 'react';
import { Sliders, CalendarDays, Award, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CalculationResult } from '../types/service';
import { computeInterval } from '../utils/calculator';

interface InteractiveSimulatorProps {
  result: CalculationResult;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({ result }) => {
  // 1. Custom Hours
  const [customHours, setCustomHours] = React.useState<number>(2.5);

  // 2. Routine simulation
  const [routineDaysPerWeek, setRoutineDaysPerWeek] = React.useState<number>(1); // 주 n회
  const [routineHoursPerDay, setRoutineHoursPerDay] = React.useState<number>(2); // 1회당 n시간

  const customInterval = computeInterval(
    result.combinedRemainingHours,
    customHours,
    `하루 ${customHours}시간 사용`,
    result.remainingWorkdays,
    result.remainingTotalDays
  );

  // Routine calculations
  // 남은 주(Weeks) 수
  const remainingWeeks = result.remainingWorkdays > 0 ? result.remainingWorkdays / 5 : 0;
  // 주당 소모 시간
  const weeklyConsumption = routineDaysPerWeek * routineHoursPerDay;
  // 총 소요 시간
  const totalRoutineNeededHours = Math.round(weeklyConsumption * remainingWeeks);
  // 남는 또는 부족한 시간
  const diffHours = result.combinedRemainingHours - totalRoutineNeededHours;
  const isSustainable = diffHours >= 0;
  // 지속 가능한 최대 주 수
  const sustainableWeeks = weeklyConsumption > 0
    ? Math.floor(result.combinedRemainingHours / weeklyConsumption)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-neutral-800" />
        <h2 className="text-base font-semibold text-neutral-900">
          커스텀 시뮬레이터 & 실전 루틴 플래너
        </h2>
      </div>

      <div className="p-5 space-y-6">
        {/* Section 1: Custom Hours Slider */}
        <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-neutral-800 block">
                자유 시간 설정 (1~7시간 조퇴·지참 간격)
              </span>
              <span className="text-[11px] text-neutral-500">
                원하는 시간 단위를 직접 지정하여 사용 주기를 확인할 수 있습니다.
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                하루 {customHours}시간
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <input
              type="range"
              min="0.5"
              max="7.5"
              step="0.5"
              value={customHours}
              onChange={(e) => setCustomHours(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
              <span>0.5시간(30분)</span>
              <span>2시간</span>
              <span>3시간</span>
              <span>4시간(반차)</span>
              <span>6시간</span>
              <span>7.5시간</span>
            </div>
          </div>

          {/* Result bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 block">출근일(근무일) 주기</span>
              <div className="text-lg font-bold font-mono text-neutral-900 mt-0.5">
                {customInterval.workdayInterval} 근무일마다
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                주 {customInterval.weeklyFrequency}회 사용 가능
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 block">달력일(주말 포함) 주기</span>
              <div className="text-lg font-bold font-mono text-neutral-900 mt-0.5">
                {customInterval.calendarInterval}일마다
              </div>
              <span className="text-[11px] text-neutral-500">
                총 {customInterval.totalPossibleUses}회 분할 가능
              </span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 block">요약 분석</span>
              <div className="text-xs text-neutral-700 font-medium mt-1">
                {customInterval.summaryText}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 주간 고정 루틴 시뮬레이터 (예: 매주 금요일 2시간 조퇴) */}
        <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-4">
          <div>
            <span className="text-xs font-semibold text-neutral-800 block">
              주간 고정 루틴 시뮬레이터 (예: "매주 금요일 2시간씩 조퇴하면?")
            </span>
            <span className="text-[11px] text-neutral-500">
              일정한 요일마다 규칙적으로 조퇴나 반차를 사용할 때 소집해제일까지 유지가 가능한지 판별합니다.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                일주일에 몇 번 쓰실 계획인가요?
              </label>
              <select
                value={routineDaysPerWeek}
                onChange={(e) => setRoutineDaysPerWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={1}>주 1회 (예: 매주 금요일)</option>
                <option value={2}>주 2회 (예: 화요일, 목요일)</option>
                <option value={3}>주 3회 (예: 월, 수, 금)</option>
                <option value={4}>주 4회</option>
                <option value={5}>주 5회 (매일 출근일마다)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                1회당 몇 시간 쓰실 계획인가요?
              </label>
              <select
                value={routineHoursPerDay}
                onChange={(e) => setRoutineHoursPerDay(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={1}>1시간 조기퇴근 (17:00 퇴근)</option>
                <option value={2}>2시간 조기퇴근 (16:00 퇴근)</option>
                <option value={3}>3시간 조기퇴근 (15:00 퇴근)</option>
                <option value={4}>4시간 반차 (오전 or 오후)</option>
                <option value={8}>8시간 종일 연가</option>
              </select>
            </div>
          </div>

          {/* Routine Status Output */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isSustainable
                ? 'bg-emerald-50/50 border-emerald-200 text-neutral-800'
                : 'bg-amber-50/50 border-amber-200 text-neutral-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSustainable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-neutral-900">
                  {isSustainable
                    ? `소집해제일까지 완벽하게 유지 가능! (총 ${diffHours}시간 여유 남음)`
                    : `소집해제일까지 유지하려면 시간이 부족합니다. (약 ${Math.abs(diffHours)}시간 부족)`}
                </div>
                <p className="text-neutral-600">
                  남은 복무 약 {remainingWeeks.toFixed(1)}주 동안 주당 {weeklyConsumption}시간씩 사용 시 총 {totalRoutineNeededHours}시간이 필요합니다.
                  (현재 보유 합산 잔여: {result.combinedRemainingHours}시간)
                </p>
                <p className="font-medium text-neutral-800">
                  현재 보유량 기준 <span className="underline decoration-emerald-500 font-bold">{sustainableWeeks}주 동안</span> 이 루틴을 계속 유지할 수 있습니다!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 몰아쓰기 조기 퇴근일 계산 (사회복무요원 필수 기능) */}
        {result.lastWorkdayIfStacked && (
          <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                말년 몰아쓰기 시뮬레이션
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs text-neutral-400 block">
                  남은 휴가(연가+병가 {result.stackedSavedDays}일)를 복무 마지막에 몰아쓸 경우:
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
                  마지막 실제 출근일: {result.lastWorkdayIfStacked}
                </span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                소집해제일보다 약 {result.stackedSavedDays} 근무일 일찍 복무지 퇴근 가능
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
