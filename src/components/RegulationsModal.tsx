import React from 'react';
import { X, BookOpen, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface RegulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationsModal: React.FC<RegulationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-neutral-900">
              사회복무요원 연가·병가 복무규정 핵심 가이드
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-neutral-700 leading-relaxed">
          {/* 1. 연가 규정 */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              1. 연가 (Annual Leave) 규정 (병역법 시행령 제59조)
            </h4>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <p>• <strong>복무기간 21개월 총 28일</strong> 부여</p>
              <p>• <strong>복무 1년차 (소집일 ~ 1년)</strong>: 15일</p>
              <p>• <strong>복무 2년차 (1년 초과 ~ 소집해제)</strong>: 13일</p>
              <p>• 1년차에 남은 연가는 원칙적으로 2년차로 이월되지 않으므로 1년차 기간 내에 소진 권장</p>
              <p>• 반일연가(반차 4시간) 및 시간제 연가(지참·조퇴·외출) 분할 사용 가능</p>
            </div>
          </div>

          {/* 2. 병가 규정 */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              2. 병가 (Sick Leave) 규정
            </h4>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <p>• <strong>총 30일 이내</strong>: 공무상 질병 또는 부상 외의 질병/부상으로 출근 곤란 시 유급 병가 인정</p>
              <p>• <strong>3일 이내 병가</strong>: 진료확인서, 처방전, 소견서 중 1개 제출 가능 (기관 규정에 따름)</p>
              <p>• <strong>4일 이상 연속 병가</strong>: 의사 진단서 제출 필수</p>
              <p>• <strong>30일 초과 시</strong>: 30일을 초과하는 일수만큼 소집해제일이 연장(연장복무)됩니다.</p>
              <p>• 공상(공무상 부상·질병)으로 인한 병가는 30일 제한 없이 인정됩니다.</p>
            </div>
          </div>

          {/* 3. 시간 단위 차감 원칙 */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. 지참·조퇴·외출 및 시간단위 계산 규칙
            </h4>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <p>• <strong>8시간 누적 = 1일 공제</strong>: 지참·조퇴·외출의 누적 시간을 합산하여 8시간이 될 때마다 연가 또는 병가 1일로 계산합니다.</p>
              <p>• 8시간 미만의 잔여 시간은 계산상 이월하여 다음 차감에 합산됩니다.</p>
              <p>• 병가도 병원 진료 목적일 경우 2시간, 3시간 등 시간 단위 분할 병가 사용이 가능합니다.</p>
            </div>
          </div>

          {/* 4. 기타 휴가 안내 */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-600" />
              4. 포상휴가 및 청원휴가
            </h4>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <p>• <strong>특별휴가(포상)</strong>: 복무기관장 표창 등 최대 연간 5일 이내 추가 가능 (본 계산기의 연가 총일수에 더하여 계산 가능)</p>
              <p>• <strong>청원휴가</strong>: 본인 결혼(5일), 부모/배우자 상(5일) 등은 별도 청원휴가 인정 (연가 미차감)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
