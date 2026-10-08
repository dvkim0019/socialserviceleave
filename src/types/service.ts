export interface ServiceConfig {
  enlistmentDate: string; // YYYY-MM-DD
  serviceMonths: number; // 기본 21개월
  dischargeDate: string; // YYYY-MM-DD (자동 계산 또는 수동)
  isCustomDischargeDate: boolean;
  excludeHolidays: boolean; // 평일 중 공휴일 제외 여부
}

export interface LeaveItem {
  totalDays: number;
  usedDays: number;
  usedHours: number; // 0 ~ 7 hours
  remainingDays: number;
  remainingHours: number; // 0 ~ 7 hours
}

export interface LeaveConfig {
  annualLeave: LeaveItem; // 연가
  sickLeave: LeaveItem; // 병가
}

export type LeaveTarget = 'combined' | 'annual' | 'sick';

export interface IntervalOptionResult {
  hoursPerUse: number; // 1, 2, 3, 4, 8 or custom
  label: string;
  totalPossibleUses: number; // 총 사용 가능 횟수
  workdayInterval: number; // 근무일 기준 며칠에 1번
  calendarInterval: number; // 달력일 기준 며칠에 1번
  weeklyFrequency: number; // 1주일에 평균 몇 회 사용 가능한지
  summaryText: string;
}

export interface CalculationResult {
  totalServiceDays: number; // 총 복무 일수 (입대일 ~ 소집해제일)
  passedDays: number; // 경과일
  remainingTotalDays: number; // 남은 달력일 (D-Day)
  remainingWorkdays: number; // 남은 평일(근무일수)
  serviceProgressRate: number; // 0 ~ 100%
  rank: {
    title: string;
    grade: string;
  };
  isDischarged: boolean;
  isBeforeEnlistment: boolean;
  
  // 가용 시간 및 일수 (연가+병가 합산)
  combinedRemainingHours: number;
  combinedRemainingDaysEquivalent: number;
  
  // 개별
  annualRemainingHours: number;
  annualRemainingDaysEquivalent: number;
  sickRemainingHours: number;
  sickRemainingDaysEquivalent: number;
  
  // 간격 계산 결과 모음 (2h, 3h, 8h, 4h, 1h 등)
  intervals: {
    combined: Record<number, IntervalOptionResult>;
    annual: Record<number, IntervalOptionResult>;
    sick: Record<number, IntervalOptionResult>;
  };
  
  // 마지막 출근일 (몰아쓰기 시뮬레이션)
  lastWorkdayIfStacked: string | null;
  stackedSavedDays: number;
}
