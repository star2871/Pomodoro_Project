import React from 'react';

export default function ControlButtons({
  isRunning,
  onTogglePlay,
  onReset,
  onSkip
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 w-full max-w-[360px] mx-auto mt-2 mb-4 fade-in">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#6B7280] font-medium text-sm transition-all active:scale-95 border border-transparent"
        aria-label="타이머 리셋"
      >
        <span className="material-symbols-rounded text-[20px]">restart_alt</span>
        <span>리셋</span>
      </button>

      {/* Main Start / Pause Button */}
      <button
        onClick={onTogglePlay}
        className={`flex-[1.5] flex items-center justify-center gap-1.5 h-12 rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-md ${
          isRunning
            ? 'bg-[#EEF1F7] hover:bg-gray-200 text-[#1F2937]'
            : 'bg-[#5B6EE1] hover:bg-[#4A5CD0] text-white'
        }`}
        aria-label={isRunning ? '타이머 일시정지' : '타이머 시작'}
      >
        <span className="material-symbols-rounded text-[20px]">
          {isRunning ? 'pause' : 'play_arrow'}
        </span>
        <span>{isRunning ? '일시정지' : '시작'}</span>
      </button>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#6B7280] font-medium text-sm transition-all active:scale-95 border border-transparent"
        aria-label="다음 단계로 건너뛰기"
      >
        <span className="material-symbols-rounded text-[20px]">skip_next</span>
        <span>다음</span>
      </button>
    </div>
  );
}
