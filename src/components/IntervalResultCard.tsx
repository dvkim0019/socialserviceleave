import React from 'react';
import { Sparkles, Calendar, Clock, Timer, ArrowRight, Zap, Coffee, BatteryCharging } from 'lucide-react';
import { CalculationResult, LeaveTarget } from '../types/service';

interface IntervalResultCardProps {
  result: CalculationResult;
}

export const IntervalResultCard: React.FC<IntervalResultCardProps> = ({ result }) => {
  const [target, setTarget] = React.useState<LeaveTarget>('combined');

  const currentIntervals = result.intervals[target] || {};

  // 2시간, 3시간, 8시간(종일), 4시간(반차), 1시간
  const twoHour = currentIntervals[2];
  const threeHour = currentIntervals[3];
  const fullDay = currentIntervals[8];
  const halfDay = currentIntervals[4];
  const oneHour = currentIntervals[1];

  const targetHours =
    target === 'combined'
      ? result.combinedRemainingHours
      : target === 'annual'
      ? result.annualRemainingHours
      : result.sickRemainingHours;

  const targetDays =
    target === 'combined'
      ? result.combinedRemainingDaysEquivalent
      : target === 'annual'
      ? result.annualRemainingDaysEquivalent
      : result.sickRemainingDaysEquivalent;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Header with Leave Target Tabs */}
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              휴가 사용 주기 계산 결과 (며칠 꼴로 쓸 수 있을까?)
            </h2>
            <p className="text-xs text-neutral-500">
              남은 복무기간(평일 {result.remainingWorkdays}일) 동안 휴가를 균등하게 소진할 때의 주기입니다.
            </p>
          </div>
        </div>

        {/* Target Tabs (합산 vs 연가만 vs 병가만) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTarget('combined')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              target === 'combined'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            연가 + 병가 합산
          </button>
          <button
            type="button"
            onClick={() => setTarget('annual')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              target === 'annual'
                ? 'bg-white text-indigo-800 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            연가만
          </button>
          <button
            type="button"
            onClick={() => setTarget('sick')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              target === 'sick'
                ? 'bg-white text-rose-800 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            병가만
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Current Target Summary Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-neutral-100/70 rounded-lg text-xs text-neutral-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              현재 계산 대상: {target === 'combined' ? '연가+병가 합산' : target === 'annual' ? '연가 단독' : '병가 단독'}
            </span>
            <span aria-hidden="true">·</span>
            <span>가용 일수: <strong className="font-mono text-neutral-900">{targetDays}일</strong></span>
            <span aria-hidden="true">·</span>
            <span>총 가용 시간: <strong className="font-mono text-neutral-900">{targetHours}시간</strong></span>
          </div>
          <div className="text-neutral-500 font-mono text-[11px]">
            남은 출근일(근무일): {result.remainingWorkdays}일 / 총 달력일: {result.remainingTotalDays}일
          </div>
        </div>

        {/* 세로 한 줄(1 Column)로 이어지는 휴가 사용 주기 목록 */}
        <div className="space-y-4">
          {/* 1. 하루 2시간 사용 시 */}
          <div className="relative p-5 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/20 hover:border-emerald-500/50 transition-all shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    추천 1순위
                  </span>
                  <h4 className="text-base font-bold text-neutral-900">
                    하루 2시간 사용 시 (16:00 조퇴 or 11:00 지참)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  총 <span className="font-mono font-bold text-emerald-700">{twoHour?.totalPossibleUses || 0}회</span> 분할 사용 가능
                </p>
              </div>

              {/* Main metric */}
              <div className="flex flex-wrap items-baseline gap-2 bg-white/90 px-4 py-2 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500">실제 출근일 기준:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight tabular-nums">
                  {twoHour?.workdayInterval || 0}일
                </span>
                <span className="text-sm font-semibold text-neutral-700">마다 1회</span>
                <span className="text-xs text-neutral-400 mx-1">|</span>
                <span className="text-xs font-medium text-emerald-700 font-mono">
                  주 {twoHour?.weeklyFrequency || 0}회 (약 {Math.round(twoHour?.weeklyFrequency || 0)}번/주)
                </span>
                <span className="text-xs text-neutral-500">
                  (달력 {twoHour?.calendarInterval || 0}일마다)
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-white/80 rounded-lg border border-emerald-100 text-xs text-neutral-700">
              💡 <span className="font-medium">체감 꿀팁:</span>{' '}
              {(twoHour?.workdayInterval || 0) <= 2
                ? `출근 2일마다 1번 이상 (주 ${(twoHour?.weeklyFrequency || 0).toFixed(1)}일) 2시간 일찍 퇴근할 수 있는 여유가 있습니다!`
                : `약 ${(twoHour?.workdayInterval || 0).toFixed(1)}일 출근할 때마다 1번씩 2시간 조퇴를 쓰면 소집해제일까지 알맞게 소진됩니다.`}
            </div>
          </div>

          {/* 2. 하루 3시간 사용 시 */}
          <div className="relative p-5 rounded-xl border-2 border-indigo-500/30 bg-indigo-50/20 hover:border-indigo-500/50 transition-all shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    추천 2순위
                  </span>
                  <h4 className="text-base font-bold text-neutral-900">
                    하루 3시간 사용 시 (15:00 조기퇴근 or 12:00 출근)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  총 <span className="font-mono font-bold text-indigo-700">{threeHour?.totalPossibleUses || 0}회</span> 분할 사용 가능
                </p>
              </div>

              {/* Main metric */}
              <div className="flex flex-wrap items-baseline gap-2 bg-white/90 px-4 py-2 rounded-lg border border-indigo-100 shadow-2xs">
                <span className="text-xs font-semibold text-neutral-500">실제 출근일 기준:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight tabular-nums">
                  {threeHour?.workdayInterval || 0}일
                </span>
                <span className="text-sm font-semibold text-neutral-700">마다 1회</span>
                <span className="text-xs text-neutral-400 mx-1">|</span>
                <span className="text-xs font-medium text-indigo-700 font-mono">
                  주 {threeHour?.weeklyFrequency || 0}회 (약 {Math.round(threeHour?.weeklyFrequency || 0)}번/주)
                </span>
                <span className="text-xs text-neutral-500">
                  (달력 {threeHour?.calendarInterval || 0}일마다)
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-white/80 rounded-lg border border-indigo-100 text-xs text-neutral-700">
              💡 <span className="font-medium">체감 꿀팁:</span>{' '}
              {(threeHour?.workdayInterval || 0) <= 3
                ? `매주 ${(threeHour?.weeklyFrequency || 0).toFixed(1)}회씩 오후 3시에 넉넉하게 퇴근할 수 있는 페이스입니다!`
                : `약 ${(threeHour?.workdayInterval || 0).toFixed(1)}일 출근 시 1번 3시간 조퇴를 쓰면 딱 맞습니다.`}
            </div>
          </div>

          {/* 3. 하루 종일 (8시간 연가/병가) */}
          <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                    하루 종일 (8시간 전일 사용)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  총 <span className="font-mono font-semibold text-neutral-800">{fullDay?.totalPossibleUses || 0}일(회)</span> 전일 휴가 사용 가능
                </p>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 bg-white px-3.5 py-2 rounded-lg border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">실제 출근일 기준:</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                  {fullDay?.workdayInterval || 0}일
                </span>
                <span className="text-xs font-semibold text-neutral-700">마다 1일</span>
                <span className="text-xs text-neutral-300 mx-1">|</span>
                <span className="text-xs font-medium text-emerald-700 font-mono">
                  주 {(fullDay?.weeklyFrequency || 0).toFixed(1)}일 (월 약 {((fullDay?.weeklyFrequency || 0) * 4.3).toFixed(1)}일)
                </span>
                <span className="text-xs text-neutral-500">
                  (달력 {fullDay?.calendarInterval || 0}일마다)
                </span>
              </div>
            </div>
          </div>

          {/* 4. 반차 (4시간 오전 or 오후) */}
          <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                    반차 (4시간 오전 or 오후 사용)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  총 <span className="font-mono font-semibold text-neutral-800">{halfDay?.totalPossibleUses || 0}회</span> 반차 사용 가능
                </p>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 bg-white px-3.5 py-2 rounded-lg border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">실제 출근일 기준:</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                  {halfDay?.workdayInterval || 0}일
                </span>
                <span className="text-xs font-semibold text-neutral-700">마다 1회</span>
                <span className="text-xs text-neutral-300 mx-1">|</span>
                <span className="text-xs font-medium text-blue-700 font-mono">
                  주 {(halfDay?.weeklyFrequency || 0).toFixed(1)}회 반차 가능
                </span>
                <span className="text-xs text-neutral-500">
                  (달력 {halfDay?.calendarInterval || 0}일마다)
                </span>
              </div>
            </div>
          </div>

          {/* 5. 1시간 조기퇴근/지참 */}
          <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-neutral-600" />
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                    1시간 사용 시 (17:00 조퇴 or 10:00 출근)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  총 <span className="font-mono font-semibold text-neutral-800">{oneHour?.totalPossibleUses || 0}회</span> 분할 사용 가능
                </p>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 bg-white px-3.5 py-2 rounded-lg border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">실제 출근일 기준:</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                  {oneHour?.workdayInterval || 0}일
                </span>
                <span className="text-xs font-semibold text-neutral-700">마다 1회</span>
                <span className="text-xs text-neutral-300 mx-1">|</span>
                <span className="text-xs font-medium text-neutral-700 font-mono">
                  주 {(oneHour?.weeklyFrequency || 0).toFixed(1)}회 1시간 일찍 퇴근
                </span>
                <span className="text-xs text-neutral-500">
                  (달력 {oneHour?.calendarInterval || 0}일마다)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guide / Interpretation Footer */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
          <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
            수치 해석 기준 안내
          </div>
          <p>
            • <strong>근무일 기준</strong>: 출근하지 않는 토요일·일요일{result.remainingWorkdays > 0 ? ' 및 공휴일' : ''}을 제외한 <span className="text-neutral-900 underline underline-offset-2">실제 복무기관 출근일 기준</span>입니다. 예: '2.5일마다 1회'는 출근 2~3일마다 1번 쓸 수 있다는 의미입니다.
          </p>
          <p>
            • <strong>달력일 기준</strong>: 주말을 포함하여 달력상 며칠마다 한 번 꼴인지 나타냅니다.
          </p>
          <p>
            • 병역법령상 지참·조퇴·외출은 시간 단위로 계산하며, <strong>누적 8시간이 되면 연가 또는 병가 1일</strong>로 차감됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
