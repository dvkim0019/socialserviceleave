import {
  CalculationResult,
  IntervalOptionResult,
  LeaveConfig,
  ServiceConfig,
} from '../types/service';
import { formatDate, isWorkingDay, parseDate } from './holidays';

/**
 * 입대일로부터 n개월 뒤 전날 (기본 21개월) 소집해제일 자동 계산
 */
export function calculateDefaultDischargeDate(enlistmentDateStr: string, months = 21): string {
  if (!enlistmentDateStr) return '';
  const d = parseDate(enlistmentDateStr);
  if (isNaN(d.getTime())) return '';

  const originalDay = d.getDate();
  const targetYear = d.getFullYear() + Math.floor((d.getMonth() + months) / 12);
  const targetMonth = (d.getMonth() + months) % 12;

  // 해당 월의 마지막 날짜 고려
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const day = Math.min(originalDay, daysInMonth);

  const targetDate = new Date(targetYear, targetMonth, day);
  targetDate.setDate(targetDate.getDate() - 1); // 전날 소집해제

  return formatDate(targetDate);
}

/**
 * 복무 개월에 따른 계급 계산 (21개월 기준)
 * 이등병: 1~2개월차
 * 일등병: 3~8개월차
 * 상등병: 9~14개월차
 * 병장: 15개월차 이후
 */
export function calculateRank(passedDays: number, totalDays: number): { title: string; grade: string } {
  const months = (passedDays / totalDays) * 21;

  if (months < 2) {
    return { title: '이등병', grade: '소집 1~2월차' };
  } else if (months < 8) {
    return { title: '일등병', grade: '소집 3~8월차' };
  } else if (months < 14) {
    return { title: '상등병', grade: '소집 9~14월차' };
  } else {
    return { title: '병장', grade: '소집 15월차~소집해제' };
  }
}

/**
 * 시간별 사용 간격 상세 계산 (근무일, 달력일, 주간 빈도)
 */
export function computeInterval(
  availableHours: number,
  hoursPerUse: number,
  label: string,
  remainingWorkdays: number,
  remainingTotalDays: number
): IntervalOptionResult {
  if (availableHours <= 0 || hoursPerUse <= 0) {
    return {
      hoursPerUse,
      label,
      totalPossibleUses: 0,
      workdayInterval: 0,
      calendarInterval: 0,
      weeklyFrequency: 0,
      summaryText: '사용 가능한 잔여 휴가가 없습니다.'
    };
  }

  const totalPossibleUses = availableHours / hoursPerUse;

  if (remainingWorkdays <= 0 || remainingTotalDays <= 0) {
    return {
      hoursPerUse,
      label,
      totalPossibleUses: Number(totalPossibleUses.toFixed(1)),
      workdayInterval: 0,
      calendarInterval: 0,
      weeklyFrequency: 0,
      summaryText: '복무가 만료되었거나 남은 일수가 없습니다.'
    };
  }

  // 근무일 기준 간격 (며칠 출근마다 1번 쓸 수 있는가)
  const workdayInterval = remainingWorkdays / totalPossibleUses;

  // 달력일 기준 간격 (주말 포함 며칠마다 1번 쓸 수 있는가)
  const calendarInterval = remainingTotalDays / totalPossibleUses;

  // 1주일(근무일 5일) 기준 몇 번 쓸 수 있는가
  const weeklyFrequency = (totalPossibleUses / remainingWorkdays) * 5;

  let summaryText = '';
  if (workdayInterval <= 1.05) {
    summaryText = `거의 매 출근일마다 (${workdayInterval.toFixed(1)}일 꼴) 사용 가능!`;
  } else {
    summaryText = `근무일 기준 ${workdayInterval.toFixed(1)}일마다 1회 (주 ${weeklyFrequency.toFixed(1)}회)`;
  }

  return {
    hoursPerUse,
    label,
    totalPossibleUses: Number(totalPossibleUses.toFixed(1)),
    workdayInterval: Number(workdayInterval.toFixed(1)),
    calendarInterval: Number(calendarInterval.toFixed(1)),
    weeklyFrequency: Number(weeklyFrequency.toFixed(1)),
    summaryText
  };
}

/**
 * 전체 복무 및 휴가 간격 종합 계산
 */
export function calculateAll(
  service: ServiceConfig,
  leave: LeaveConfig,
  currentDate: Date = new Date()
): CalculationResult {
  const enlistment = parseDate(service.enlistmentDate);
  const discharge = parseDate(service.dischargeDate);
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;

  const isInvalid = isNaN(enlistment.getTime()) || isNaN(discharge.getTime());
  if (isInvalid || discharge < enlistment) {
    return createEmptyResult();
  }

  // 총 복무일수
  const totalServiceDays = Math.round((discharge.getTime() - enlistment.getTime()) / msPerDay) + 1;

  // 경과일 & 남은 일수
  const isDischarged = today > discharge;
  const isBeforeEnlistment = today < enlistment;

  let passedDays = 0;
  let remainingTotalDays = 0;

  if (isBeforeEnlistment) {
    passedDays = 0;
    remainingTotalDays = totalServiceDays;
  } else if (isDischarged) {
    passedDays = totalServiceDays;
    remainingTotalDays = 0;
  } else {
    // 복무 진행 중
    passedDays = Math.round((today.getTime() - enlistment.getTime()) / msPerDay) + 1;
    remainingTotalDays = Math.round((discharge.getTime() - today.getTime()) / msPerDay) + 1;
  }

  const serviceProgressRate = totalServiceDays > 0
    ? Math.min(100, Math.max(0, Number(((passedDays / totalServiceDays) * 100).toFixed(1))))
    : 0;

  const rank = calculateRank(passedDays, totalServiceDays);

  // 남은 평일(근무일수) 카운트: 오늘(또는 입대일)부터 소집해제일까지
  let remainingWorkdays = 0;
  if (!isDischarged) {
    const startDate = isBeforeEnlistment ? new Date(enlistment) : new Date(today);
    const cur = new Date(startDate);
    while (cur <= discharge) {
      if (isWorkingDay(cur, service.excludeHolidays)) {
        remainingWorkdays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  // 연가/병가 잔여 계산
  const annualTotalHours = leave.annualLeave.totalDays * 8;
  const annualUsedTotalHours = leave.annualLeave.usedDays * 8 + leave.annualLeave.usedHours;
  const annualRemainingHours = Math.max(
    0,
    leave.annualLeave.remainingDays * 8 + leave.annualLeave.remainingHours
  );
  const annualRemainingDaysEquivalent = Number((annualRemainingHours / 8).toFixed(2));

  const sickTotalHours = leave.sickLeave.totalDays * 8;
  const sickUsedTotalHours = leave.sickLeave.usedDays * 8 + leave.sickLeave.usedHours;
  const sickRemainingHours = Math.max(
    0,
    leave.sickLeave.remainingDays * 8 + leave.sickLeave.remainingHours
  );
  const sickRemainingDaysEquivalent = Number((sickRemainingHours / 8).toFixed(2));

  const combinedRemainingHours = annualRemainingHours + sickRemainingHours;
  const combinedRemainingDaysEquivalent = Number((combinedRemainingHours / 8).toFixed(2));

  // 시간 옵션별 계산 (1h, 2h, 3h, 4h 반차, 8h 전일)
  const hourOptions = [
    { hours: 8, label: '하루 종일 (8시간 연가/병가)' },
    { hours: 4, label: '반차 (4시간)' },
    { hours: 3, label: '3시간 조퇴·외출' },
    { hours: 2, label: '2시간 조퇴·외출' },
    { hours: 1, label: '1시간 조퇴·지참' }
  ];

  const intervalsCombined: Record<number, IntervalOptionResult> = {};
  const intervalsAnnual: Record<number, IntervalOptionResult> = {};
  const intervalsSick: Record<number, IntervalOptionResult> = {};

  for (const opt of hourOptions) {
    intervalsCombined[opt.hours] = computeInterval(
      combinedRemainingHours,
      opt.hours,
      opt.label,
      remainingWorkdays,
      remainingTotalDays
    );
    intervalsAnnual[opt.hours] = computeInterval(
      annualRemainingHours,
      opt.hours,
      opt.label,
      remainingWorkdays,
      remainingTotalDays
    );
    intervalsSick[opt.hours] = computeInterval(
      sickRemainingHours,
      opt.hours,
      opt.label,
      remainingWorkdays,
      remainingTotalDays
    );
  }

  // 몰아쓰기 시 마지막 실출근일 계산 (연가+병가 일수만큼 소집해제일부터 역산)
  let lastWorkdayIfStacked: string | null = null;
  const stackedSavedDays = Math.floor(combinedRemainingDaysEquivalent);

  if (!isDischarged && stackedSavedDays > 0 && remainingWorkdays > 0) {
    let daysToCount = stackedSavedDays;
    const cur = new Date(discharge);

    // 소집해제일부터 거꾸로 근무일을 차감
    while (daysToCount > 0 && cur >= (isBeforeEnlistment ? enlistment : today)) {
      if (isWorkingDay(cur, service.excludeHolidays)) {
        daysToCount--;
        if (daysToCount === 0) {
          // 마지막 실근무일은 그 직전 근무일
          const prev = new Date(cur);
          prev.setDate(prev.getDate() - 1);
          while (prev >= (isBeforeEnlistment ? enlistment : today) && !isWorkingDay(prev, service.excludeHolidays)) {
            prev.setDate(prev.getDate() - 1);
          }
          if (prev >= (isBeforeEnlistment ? enlistment : today)) {
            lastWorkdayIfStacked = formatDate(prev);
          } else {
            lastWorkdayIfStacked = '당장 오늘/즉시 휴가 돌입 가능';
          }
          break;
        }
      }
      cur.setDate(cur.getDate() - 1);
    }
  }

  return {
    totalServiceDays,
    passedDays,
    remainingTotalDays,
    remainingWorkdays,
    serviceProgressRate,
    rank,
    isDischarged,
    isBeforeEnlistment,
    combinedRemainingHours,
    combinedRemainingDaysEquivalent,
    annualRemainingHours,
    annualRemainingDaysEquivalent,
    sickRemainingHours,
    sickRemainingDaysEquivalent,
    intervals: {
      combined: intervalsCombined,
      annual: intervalsAnnual,
      sick: intervalsSick
    },
    lastWorkdayIfStacked,
    stackedSavedDays
  };
}

function createEmptyResult(): CalculationResult {
  return {
    totalServiceDays: 0,
    passedDays: 0,
    remainingTotalDays: 0,
    remainingWorkdays: 0,
    serviceProgressRate: 0,
    rank: { title: '사회복무요원', grade: '복무 준비' },
    isDischarged: false,
    isBeforeEnlistment: false,
    combinedRemainingHours: 0,
    combinedRemainingDaysEquivalent: 0,
    annualRemainingHours: 0,
    annualRemainingDaysEquivalent: 0,
    sickRemainingHours: 0,
    sickRemainingDaysEquivalent: 0,
    intervals: {
      combined: {},
      annual: {},
      sick: {}
    },
    lastWorkdayIfStacked: null,
    stackedSavedDays: 0
  };
}
