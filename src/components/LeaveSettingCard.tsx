import React from 'react';
import { CalendarCheck, HeartPulse, Plus, Minus, Info, Calculator, CheckCircle2 } from 'lucide-react';
import { LeaveConfig, CalculationResult } from '../types/service';

interface LeaveSettingCardProps {
  leave: LeaveConfig;
  result: CalculationResult;
  onUpdateLeave: (updater: (prev: LeaveConfig) => LeaveConfig) => void;
}

export const LeaveSettingCard: React.FC<LeaveSettingCardProps> = ({
  leave,
  result,
  onUpdateLeave,
}) => {
  // 입력 방식 모드: 'remaining' (잔여일수 직접 입력) vs 'used' (사용한 일수 입력하여 차감)
  const [inputMode, setInputMode] = React.useState<'remaining' | 'used'>('remaining');

  // 연가 총일수 변경

const handleAnnualTotalChange = (val: number) => {
  const total = Math.max(0, val);
  onUpdateLeave((prev) => {
    const usedTotalH =
      prev.annualLeave.usedDays * 8 +
      prev.annualLeave.usedHours;
    const totalH = total * 8;
    const remainingTotalH = Math.max(0, totalH - usedTotalH);
    return {
      ...prev,
      annualLeave: {
        ...prev.annualLeave,
        totalDays: total,
        // 사용자가 입력한 사용량은 그대로 유지
        usedDays: prev.annualLeave.usedDays,
        usedHours: prev.annualLeave.usedHours,
        // 남은 양만 다시 계산
        remainingDays: Math.floor(remainingTotalH / 8),
        remainingHours: remainingTotalH % 8,
      },

    };

  });

};

  // 병가 총일수 변경
  const handleSickTotalChange = (val: number) => {
  const total = Math.max(0, val);
  onUpdateLeave((prev) => {
    const usedTotalH =
      prev.sickLeave.usedDays * 8 +
      prev.sickLeave.usedHours;
    const totalH = total * 8;
    const remainingTotalH = Math.max(0, totalH - usedTotalH);
    return {
      ...prev,
      sickLeave: {
        ...prev.sickLeave,
        totalDays: total,
        // 사용자가 입력한 사용량은 그대로 유지
        usedDays: prev.sickLeave.usedDays,
        usedHours: prev.sickLeave.usedHours,
        // 남은 양만 다시 계산
        remainingDays: Math.floor(remainingTotalH / 8),
        remainingHours: remainingTotalH % 8,
      },

    };

  });

};

  // 연가 잔여일수/시간 업데이트 (Remaining Mode)
  const handleAnnualRemainingChange = (days: number, hours: number) => {
    onUpdateLeave((prev) => {
      const d = Math.max(0, Math.min(prev.annualLeave.totalDays, days));
      const h = Math.max(0, Math.min(7, hours));
      const totalH = prev.annualLeave.totalDays * 8;
      const remainH = d * 8 + h;
      const usedTotalH = Math.max(0, totalH - remainH);
      return {
        ...prev,
        annualLeave: {
          ...prev.annualLeave,
          remainingDays: d,
          remainingHours: h,
          usedDays: Math.floor(usedTotalH / 8),
          usedHours: usedTotalH % 8,
        },
      };
    });
  };

  // 연가 사용일수/시간 업데이트 (Used Mode)
  const handleAnnualUsedChange = (days: number, hours: number) => {
    onUpdateLeave((prev) => {
      const d = Math.max(0, days);
      const h = Math.max(0, Math.min(7, hours));
      const totalH = prev.annualLeave.totalDays * 8;
      const usedH = d * 8 + h;
      const remainTotalH = Math.max(0, totalH - usedH);
      return {
        ...prev,
        annualLeave: {
          ...prev.annualLeave,
          usedDays: d,
          usedHours: h,
          remainingDays: Math.floor(remainTotalH / 8),
          remainingHours: remainTotalH % 8,
        },
      };
    });
  };

  // 병가 잔여일수/시간 업데이트 (Remaining Mode)
  const handleSickRemainingChange = (days: number, hours: number) => {
    onUpdateLeave((prev) => {
      const d = Math.max(0, Math.min(prev.sickLeave.totalDays, days));
      const h = Math.max(0, Math.min(7, hours));
      const totalH = prev.sickLeave.totalDays * 8;
      const remainH = d * 8 + h;
      const usedTotalH = Math.max(0, totalH - remainH);
      return {
        ...prev,
        sickLeave: {
          ...prev.sickLeave,
          remainingDays: d,
          remainingHours: h,
          usedDays: Math.floor(usedTotalH / 8),
          usedHours: usedTotalH % 8,
        },
      };
    });
  };

  // 병가 사용일수/시간 업데이트 (Used Mode)
  const handleSickUsedChange = (days: number, hours: number) => {
    onUpdateLeave((prev) => {
      const d = Math.max(0, days);
      const h = Math.max(0, Math.min(7, hours));
      const totalH = prev.sickLeave.totalDays * 8;
      const usedH = d * 8 + h;
      const remainTotalH = Math.max(0, totalH - usedH);
      return {
        ...prev,
        sickLeave: {
          ...prev.sickLeave,
          usedDays: d,
          usedHours: h,
          remainingDays: Math.floor(remainTotalH / 8),
          remainingHours: remainTotalH % 8,
        },
      };
    });
  };

  // 빠른 프리셋 적용
  const applyPreset = (type: 'fresh' | 'half' | 'annual_only') => {
    onUpdateLeave((prev) => {
      if (type === 'fresh') {
        return {
          annualLeave: { ...prev.annualLeave, usedDays: 0, usedHours: 0, remainingDays: prev.annualLeave.totalDays, remainingHours: 0 },
          sickLeave: { ...prev.sickLeave, usedDays: 0, usedHours: 0, remainingDays: prev.sickLeave.totalDays, remainingHours: 0 },
        };
      } else if (type === 'half') {
        const annRemain = Math.floor(prev.annualLeave.totalDays / 2);
        const sickRemain = Math.floor(prev.sickLeave.totalDays / 2);
        return {
          annualLeave: { ...prev.annualLeave, usedDays: prev.annualLeave.totalDays - annRemain, usedHours: 0, remainingDays: annRemain, remainingHours: 0 },
          sickLeave: { ...prev.sickLeave, usedDays: prev.sickLeave.totalDays - sickRemain, usedHours: 0, remainingDays: sickRemain, remainingHours: 0 },
        };
      } else {
        // 연가만 전액 소진 예시
        return {
          ...prev,
          annualLeave: { ...prev.annualLeave, usedDays: 10, usedHours: 0, remainingDays: prev.annualLeave.totalDays - 10, remainingHours: 0 },
        };
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Header with Mode Selector */}
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-neutral-900">연가 및 병가 일수 설정</h2>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setInputMode('remaining')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              inputMode === 'remaining'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            현재 남은 휴가 직접 입력
          </button>
          <button
            type="button"
            onClick={() => setInputMode('used')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              inputMode === 'used'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            사용한 휴가 입력 (자동 차감)
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100">
          <span className="text-xs text-neutral-500 font-medium">빠른 일수 채우기:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('fresh')}
              className="px-2.5 py-1 text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
            >
              전부 미사용(신규)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('half')}
              className="px-2.5 py-1 text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
            >
              절반(50%) 남음
            </button>
            <button
              type="button"
              onClick={() => {
                handleAnnualTotalChange(28);
                handleSickTotalChange(30);
              }}
              className="px-2.5 py-1 text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
            >
              규정 기본값(연가28/병가30) 복원
            </button>
          </div>
        </div>

        {/* 2 Column Grid: 연가 & 병가 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. 연가 설정 카드 */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h3 className="font-semibold text-neutral-900 text-sm">연가 (Annual Leave)</h3>
              </div>
              <span className="text-xs text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded font-medium">
                규정 기준 28일 (1차년 15일 + 2차년 13일)
              </span>
            </div>

            {/* 총 일수 수정 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700">
                  부여된 총 연가 일수
                </label>
                <span className="text-[11px] text-neutral-400">포상·특휴 추가 시 변경</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAnnualTotalChange(leave.annualLeave.totalDays - 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={leave.annualLeave.totalDays}
                    onChange={(e) => handleAnnualTotalChange(Number(e.target.value))}
                    className="w-full text-center py-1.5 px-3 bg-white border border-neutral-300 rounded-lg text-sm font-semibold font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAnnualTotalChange(leave.annualLeave.totalDays + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 일수 & 시간 입력부 (Mode에 따라) */}
            {inputMode === 'remaining' ? (
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">
                    현재 남은 연가 (일 + 시간)
                  </span>
                  <span className="text-[11px] text-indigo-600 font-mono">
                    총 {result.annualRemainingHours}시간 남음
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">남은 일수</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={leave.annualLeave.totalDays}
                        value={leave.annualLeave.remainingDays}
                        onChange={(e) =>
                          handleAnnualRemainingChange(Number(e.target.value), leave.annualLeave.remainingHours)
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">남은 시간 (0~7시간)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={leave.annualLeave.remainingHours}
                        onChange={(e) =>
                          handleAnnualRemainingChange(leave.annualLeave.remainingDays, Number(e.target.value))
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">시간</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 pt-1 flex justify-between">
                  <span>사용한 연가: {leave.annualLeave.usedDays}일 {leave.annualLeave.usedHours}시간</span>
                  <span>(1일 = 8시간 기준)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">
                    사용한 연가 (일 + 시간)
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    남은 일수 자동 계산
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">사용한 일수</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={leave.annualLeave.totalDays}
                        value={leave.annualLeave.usedDays}
                        onChange={(e) =>
                          handleAnnualUsedChange(Number(e.target.value), leave.annualLeave.usedHours)
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">사용한 시간 (0~7시간)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={leave.annualLeave.usedHours}
                        onChange={(e) =>
                          handleAnnualUsedChange(leave.annualLeave.usedDays, Number(e.target.value))
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">시간</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-600 font-medium pt-1">
                  남은 연가: {leave.annualLeave.remainingDays}일 {leave.annualLeave.remainingHours}시간 ({result.annualRemainingHours}시간)
                </div>
              </div>
            )}
          </div>

          {/* 2. 병가 설정 카드 */}
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <h3 className="font-semibold text-neutral-900 text-sm">병가 (Sick Leave)</h3>
              </div>
              <span className="text-xs text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded font-medium">
                규정 기준 30일 이내 (유급 보장)
              </span>
            </div>

            {/* 총 일수 수정 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700">
                  부여된 총 병가 일수
                </label>
                <span className="text-[11px] text-neutral-400">기관 승인 한도</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSickTotalChange(leave.sickLeave.totalDays - 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={leave.sickLeave.totalDays}
                    onChange={(e) => handleSickTotalChange(Number(e.target.value))}
                    className="w-full text-center py-1.5 px-3 bg-white border border-neutral-300 rounded-lg text-sm font-semibold font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSickTotalChange(leave.sickLeave.totalDays + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-50 active:bg-neutral-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 일수 & 시간 입력부 (Mode에 따라) */}
            {inputMode === 'remaining' ? (
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">
                    현재 남은 병가 (일 + 시간)
                  </span>
                  <span className="text-[11px] text-rose-600 font-mono">
                    총 {result.sickRemainingHours}시간 남음
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">남은 일수</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={leave.sickLeave.totalDays}
                        value={leave.sickLeave.remainingDays}
                        onChange={(e) =>
                          handleSickRemainingChange(Number(e.target.value), leave.sickLeave.remainingHours)
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">남은 시간 (0~7시간)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={leave.sickLeave.remainingHours}
                        onChange={(e) =>
                          handleSickRemainingChange(leave.sickLeave.remainingDays, Number(e.target.value))
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">시간</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 pt-1 flex justify-between">
                  <span>사용한 병가: {leave.sickLeave.usedDays}일 {leave.sickLeave.usedHours}시간</span>
                  <span>(30일 초과 시 연장복무)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800">
                    사용한 병가 (일 + 시간)
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    남은 일수 자동 계산
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">사용한 일수</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max={leave.sickLeave.totalDays}
                        value={leave.sickLeave.usedDays}
                        onChange={(e) =>
                          handleSickUsedChange(Number(e.target.value), leave.sickLeave.usedHours)
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">사용한 시간 (0~7시간)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={leave.sickLeave.usedHours}
                        onChange={(e) =>
                          handleSickUsedChange(leave.sickLeave.usedDays, Number(e.target.value))
                        }
                        className="w-full py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-semibold font-mono text-neutral-900"
                      />
                      <span className="absolute right-3 top-2 text-xs text-neutral-400">시간</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-rose-600 font-medium pt-1">
                  남은 병가: {leave.sickLeave.remainingDays}일 {leave.sickLeave.remainingHours}시간 ({result.sickRemainingHours}시간)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 합산 요약 배너 */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-700 block">
                총 사용 가능한 합산 휴가 (연가 + 병가)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                  {result.combinedRemainingDaysEquivalent}일
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  (총 {result.combinedRemainingHours}시간 가용)
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-500 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
            <div>연가: <span className="font-semibold text-neutral-800 font-mono">{leave.annualLeave.remainingDays}일 {leave.annualLeave.remainingHours}h</span></div>
            <div>병가: <span className="font-semibold text-neutral-800 font-mono">{leave.sickLeave.remainingDays}일 {leave.sickLeave.remainingHours}h</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
