import React, { useState } from 'react';
import {
  Calendar,
  HelpCircle,
  RotateCcw,
  Share2,
  Check,
} from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenGuide,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('링크 복사 실패:', error);
    }
  };

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">

        {/* 앱 이름 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="min-w-0">
            <span className="font-semibold text-neutral-900 text-sm sm:text-base tracking-tight block truncate">
              사회복무요원 연가·병가 계산기
            </span>

            <span className="text-xs text-neutral-500 hidden sm:inline">
              복무일수 및 연가·병가 사용 주기 시뮬레이터
            </span>
          </div>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="flex items-center gap-2 shrink-0">

          {/* 규정 안내 */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            title="복무 규정 가이드"
          >
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span className="hidden sm:inline">
              규정 안내
            </span>
          </button>

          {/* 공유 */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            title="링크 복사"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-700">
                  복사됨
                </span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">
                  공유
                </span>
              </>
            )}
          </button>

          {/* 초기화 */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="기본값 복원"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">
              초기화
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};