import React, { useState, useEffect, useMemo } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

import { Header } from './components/Header';
import { ServiceInfoCard } from './components/ServiceInfoCard';
import { LeaveSettingCard } from './components/LeaveSettingCard';
import { IntervalResultCard } from './components/IntervalResultCard';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { RegulationsModal } from './components/RegulationsModal';

import { LeaveConfig, ServiceConfig } from './types/service';
import {
  calculateAll,
  calculateDefaultDischargeDate,
} from './utils/calculator';
import { formatDate } from './utils/holidays';

const STORAGE_KEY_SERVICE = 'social_service_config_v1';
const STORAGE_KEY_LEAVE = 'social_service_leave_v1';

// 기본 복무 정보
const getDefaultServiceConfig = (): ServiceConfig => {
  const today = new Date();

  const sampleEnlist = new Date(
    today.getFullYear(),
    today.getMonth() - 7,
    15
  );

  const enlistStr = formatDate(sampleEnlist);

  const dischargeStr = calculateDefaultDischargeDate(
    enlistStr,
    21
  );

  return {
    enlistmentDate: enlistStr,
    serviceMonths: 21,
    dischargeDate: dischargeStr,
    isCustomDischargeDate: false,
    excludeHolidays: true,
  };
};

// 기본 연가·병가 정보
const getDefaultLeaveConfig = (): LeaveConfig => {
  return {
    annualLeave: {
      totalDays: 28,
      usedDays: 8,
      usedHours: 0,
      remainingDays: 20,
      remainingHours: 0,
    },

    sickLeave: {
      totalDays: 30,
      usedDays: 6,
      usedHours: 0,
      remainingDays: 24,
      remainingHours: 0,
    },
  };
};

function MainCalculator() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Android 뒤로가기 버튼
  useEffect(() => {
    const listener = CapacitorApp.addListener(
      'backButton',
      () => {
        // 규정 창이 열려 있으면 창만 닫기
        if (isGuideOpen) {
          setIsGuideOpen(false);
          return;
        }

        // 메인 화면에서는 앱 종료
        CapacitorApp.exitApp();
      }
    );

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [isGuideOpen]);

  // 복무 정보 불러오기
  const [service, setService] = useState<ServiceConfig>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEY_SERVICE
      );

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(
        '복무 정보 불러오기 실패:',
        e
      );
    }

    return getDefaultServiceConfig();
  });

  // 연가·병가 정보 불러오기
  const [leave, setLeave] = useState<LeaveConfig>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEY_LEAVE
      );

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(
        '휴가 정보 불러오기 실패:',
        e
      );
    }

    return getDefaultLeaveConfig();
  });

  // 소집일 또는 복무개월 변경 시
  // 소집해제일 자동 계산
  useEffect(() => {
    if (
      !service.isCustomDischargeDate &&
      service.enlistmentDate
    ) {
      const calculated =
        calculateDefaultDischargeDate(
          service.enlistmentDate,
          service.serviceMonths
        );

      if (
        calculated &&
        calculated !== service.dischargeDate
      ) {
        setService((prev) => ({
          ...prev,
          dischargeDate: calculated,
        }));
      }
    }
  }, [
    service.enlistmentDate,
    service.serviceMonths,
    service.isCustomDischargeDate,
  ]);

  // 복무 정보 → 휴대폰 내부에 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SERVICE,
        JSON.stringify(service)
      );
    } catch (e) {
      console.error(
        '복무 정보 저장 실패:',
        e
      );
    }
  }, [service]);

  // 연가·병가 정보 → 휴대폰 내부에 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_LEAVE,
        JSON.stringify(leave)
      );
    } catch (e) {
      console.error(
        '휴가 정보 저장 실패:',
        e
      );
    }
  }, [leave]);

  // 종합 계산
  const calculationResult = useMemo(() => {
    return calculateAll(
      service,
      leave,
      new Date()
    );
  }, [service, leave]);

  // 전체 초기화
  const handleReset = () => {
    if (
      window.confirm(
        '모든 입력 데이터를 기본값으로 복원하시겠습니까?'
      )
    ) {
      const defaultService =
        getDefaultServiceConfig();

      const defaultLeave =
        getDefaultLeaveConfig();

      setService(defaultService);
      setLeave(defaultLeave);

      localStorage.removeItem(
        STORAGE_KEY_SERVICE
      );

      localStorage.removeItem(
        STORAGE_KEY_LEAVE
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">

      {/* 상단 */}
      <Header
        onReset={handleReset}
        onOpenGuide={() =>
          setIsGuideOpen(true)
        }
      />

      {/* 메인 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* 안내 */}
        <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70 text-xs text-neutral-700">
          입력한 복무 정보와 연가·병가 정보는
          서버로 전송되지 않고 이 기기에만 자동 저장됩니다.
        </div>

        {/* 제목 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              사회복무요원 잔여 휴가·병가 주기 계산기
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              소집일을 기준으로 복무만료일까지 남은
              출근일을 계산하고, 연가 및 병가를 며칠마다
              사용할 수 있는지 계산합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 self-start md:self-auto font-mono">
            <span>
              오늘 기준일: {formatDate(new Date())}
            </span>
          </div>
        </div>

        {/* 복무 기본 정보 */}
        <section aria-label="복무 기본 정보">
          <ServiceInfoCard
            service={service}
            result={calculationResult}
            onUpdateService={setService}
          />
        </section>

        {/* 연가·병가 */}
        <section aria-label="연가 및 병가 일수 설정">
          <LeaveSettingCard
            leave={leave}
            result={calculationResult}
            onUpdateLeave={setLeave}
          />
        </section>

        {/* 계산 결과 */}
        <section aria-label="휴가 사용 주기 계산 결과">
          <IntervalResultCard
            result={calculationResult}
          />
        </section>

        {/* 시뮬레이터 */}
        <section aria-label="실전 시뮬레이터 및 루틴 플래너">
          <InteractiveSimulator
            result={calculationResult}
          />
        </section>
      </main>

      {/* 규정 안내 */}
      <RegulationsModal
        isOpen={isGuideOpen}
        onClose={() =>
          setIsGuideOpen(false)
        }
      />

      {/* 하단 */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-xs text-neutral-500">
          <span>
            입력 데이터는 이 기기에만 저장됩니다. 문의:dvkim0119@naver.com
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <MainCalculator />;
}