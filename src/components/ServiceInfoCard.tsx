import React from 'react';
import { Calendar, Clock, Award, ShieldCheck, Edit3, CheckCircle2 } from 'lucide-react';
import { CalculationResult, ServiceConfig } from '../types/service';

interface ServiceInfoCardProps {
  service: ServiceConfig;
  result: CalculationResult;
  onUpdateService: (updater: (prev: ServiceConfig) => ServiceConfig) => void;
}

export const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({
  service,
  result,
  onUpdateService,
}) => {
  const [isEditingDischarge, setIsEditingDischarge] = React.useState(service.isCustomDischargeDate);

  const addCalendarMonths = (dateString: string, months: number): Date | '' => {
    if (!dateString) return '';

    const [year, month] = dateString.split('-').map(Number);

    return new Date(year, month - 1 + months, 1);
  };

  const formatMonthDay = (date: Date | '') => {
    if (!date) return '-';
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const promotionDates = {
    privateFirstClass: addCalendarMonths(service.enlistmentDate, 2),
    corporal: addCalendarMonths(service.enlistmentDate, 8),
    sergeant: addCalendarMonths(service.enlistmentDate, 14),
  };

  const handleEnlistmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnlist = e.target.value;
    onUpdateService((prev) => ({
      ...prev,
      enlistmentDate: newEnlist,
    }));
  };

  const handleMonthsChange = (delta: number) => {
    onUpdateService((prev) => {
      const nextMonths = Math.max(1, Math.min(36, prev.serviceMonths + delta));
      return {
        ...prev,
        serviceMonths: nextMonths,
      };
    });
  };

  const handleCustomDischargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdateService((prev) => ({
      ...prev,
      dischargeDate: val,
      isCustomDischargeDate: true,
    }));
  };

  const toggleCustomDischarge = () => {
    if (service.isCustomDischargeDate) {
      // Revert to auto
      onUpdateService((prev) => ({
        ...prev,
        isCustomDischargeDate: false,
      }));
      setIsEditingDischarge(false);
    } else {
      setIsEditingDischarge(true);
    }
  };

  const toggleExcludeHolidays = () => {
    onUpdateService((prev) => ({
      ...prev,
      excludeHolidays: !prev.excludeHolidays,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-semibold text-neutral-900">복무 기본 정보 및 기간</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-800">{result.rank.title}</span>
          <span aria-hidden="true">·</span>
          <span>{result.rank.grade}</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 입대일(소집일) 입력 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              소집(입대)일자
            </label>
            <div className="relative">
              <input
                type="date"
                value={service.enlistmentDate}
                onChange={handleEnlistmentChange}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-colors"
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              훈련소 입소일 또는 사회복무 소집 시작일
            </p>
          </div>

          {/* 복무기간 (기본 21개월) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700">
                복무기간 (기본 21개월)
              </label>
              <span className="text-[11px] text-neutral-500 font-mono">
                {service.serviceMonths}개월
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleMonthsChange(-1)}
                className="px-2.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                title="1개월 감소"
              >
                -1개월
              </button>
              <div className="flex-1 text-center py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-800 font-mono">
                {service.serviceMonths} 개월
              </div>
              <button
                type="button"
                onClick={() => handleMonthsChange(1)}
                className="px-2.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                title="1개월 증가"
              >
                +1개월
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              현행 사회복무요원 기준 복무기간 21개월
            </p>
          </div>

          {/* 소집해제일 (자동 계산 또는 직접 수정) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700">
                소집해제일 (복무만료일)
              </label>
              <button
                type="button"
                onClick={toggleCustomDischarge}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 underline font-medium"
              >
                {service.isCustomDischargeDate ? '자동계산으로 복원' : '직접 수정'}
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                value={service.dischargeDate}
                onChange={handleCustomDischargeChange}
                disabled={!service.isCustomDischargeDate && !isEditingDischarge}
                className={`w-full px-3 py-2 text-sm border rounded-lg font-mono transition-colors ${
                  service.isCustomDischargeDate
                    ? 'bg-amber-50/50 border-amber-300 text-neutral-900 focus:ring-2 focus:ring-amber-500/20'
                    : 'bg-neutral-100/70 border-neutral-200 text-neutral-700 cursor-not-allowed'
                }`}
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              {service.isCustomDischargeDate
                ? '사용자 직접 지정 상태 (연장/단축 복무)'
                : '입대일 기준 21개월 후 전날 자동 산출'}
            </p>
          </div>
        </div>

        {/* 복무 현황 및 카운트다운 배너 */}
          {service.enlistmentDate && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="space-y-1.5 text-sm text-neutral-800">
              <div>
                <span className="font-semibold">일병진급일 :</span>{' '}
                <span>{formatMonthDay(promotionDates.privateFirstClass)}</span>
              </div>

              <div>
                <span className="font-semibold">상병진급일 :</span>{' '}
                <span>{formatMonthDay(promotionDates.corporal)}</span>
              </div>

              <div>
                <span className="font-semibold">병장진급일 :</span>{' '}
                <span>{formatMonthDay(promotionDates.sergeant)}</span>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 bg-neutral-900 text-white rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Discharge D-Day
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  {result.isDischarged
                    ? '소집해제 완료'
                    : result.isBeforeEnlistment
                    ? '입대 대기'
                    : `D-${result.remainingTotalDays - 1 === 0 ? 'Day' : result.remainingTotalDays}`}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono tabular-nums text-white">
                  {result.remainingTotalDays.toLocaleString()}
                </span>
                <span className="text-neutral-400 text-sm">일 남음</span>
                <span className="text-neutral-500 text-xs">(총 달력일 기준)</span>
              </div>
            </div>

            {/* 실제 남은 출근일 (근무일) */}
            <div className="sm:text-right">
              <div className="text-xs text-neutral-400">실제 출근해야 하는 평일</div>
              <div className="mt-1 flex items-baseline sm:justify-end gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
                  {result.remainingWorkdays.toLocaleString()}
                </span>
                <span className="text-neutral-300 text-sm">출근일 남음</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                주말 {service.excludeHolidays ? '& 법정공휴일' : ''} 제외
              </div>
            </div>
          </div>

          {/* 복무율 프로그레스 바 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                복무 진행률
              </span>
              <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                {result.serviceProgressRate}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${result.serviceProgressRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>복무한 날: {result.passedDays}일</span>
              <span>총 복무기간: {result.totalServiceDays}일</span>
            </div>
          </div>

          {/* 하단 옵션: 공휴일 제외 체크 */}
          <div className="pt-1 flex items-center justify-between text-xs text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={service.excludeHolidays}
                onChange={toggleExcludeHolidays}
                className="w-3.5 h-3.5 text-emerald-500 rounded border-neutral-700 focus:ring-emerald-500/20"
              />
              <span>대한민국 법정공휴일 및 대체공휴일 자동 제외 (실제 출근일만 정밀 계산)</span>
            </label>
            <span className="hidden md:inline text-[11px] text-neutral-500">
              1일 = 8시간 정규근무 기준
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
