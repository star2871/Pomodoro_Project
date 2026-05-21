import React from 'react';

export default function CircularTimer({
  remainingSeconds,
  totalSeconds,
  mode,
  isRunning,
  onTogglePlay
}) {
  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  
  // SVG Circle details
  const radius = 110;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Set colors based on the current mode
  let strokeColor = '#64748B'; // Idle/default
  let bgTrackColor = '#EEF1F7';
  let modeLabel = '시작 대기';
  let modeTextColor = 'text-[#64748B]';

  if (isRunning || remainingSeconds < totalSeconds) {
    if (mode === 'focus') {
      strokeColor = '#5B6EE1'; // Primary
      bgTrackColor = '#E8EAFF'; // Primary Container
      modeLabel = '집중 중';
      modeTextColor = 'text-[#5B6EE1]';
    } else if (mode === 'shortBreak') {
      strokeColor = '#2F9E8F'; // Secondary
      bgTrackColor = '#DDF7F2'; // Secondary Container
      modeLabel = '짧은 휴식';
      modeTextColor = 'text-[#2F9E8F]';
    } else if (mode === 'longBreak') {
      strokeColor = '#A060C8'; // Tertiary
      bgTrackColor = '#F3E8FF'; // Tertiary Container
      modeLabel = '긴 휴식';
      modeTextColor = 'text-[#A060C8]';
    }
  }

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-4 fade-in">
      {/* SVG Circular Progress Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
        {/* Background Track Circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          className="transition-colors duration-500"
          stroke={bgTrackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active Progress Circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Internal Text and Control */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-[-8px]">
        {/* Mode Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white shadow-xs border border-gray-100 ${modeTextColor}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: strokeColor }}></span>
          {modeLabel}
        </div>

        {/* Digital Time */}
        <div className="text-5xl font-bold tracking-tight text-[#1F2937] font-mono mt-2.5">
          {formatTime(remainingSeconds)}
        </div>

        {/* Total Time Divider */}
        <div className="text-xs font-medium text-gray-400 mt-1">
          / {formatTime(totalSeconds)}
        </div>

        {/* Pause/Play Inner Button */}
        <button
          onClick={onTogglePlay}
          className="absolute bottom-7 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-md border border-gray-150 hover:bg-gray-50 active:scale-95 transition-all text-[#1F2937]"
          aria-label={isRunning ? '일시정지' : '시작'}
        >
          <span className="material-symbols-rounded text-2xl font-bold">
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>
    </div>
  );
}
