import React from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function ReflectionPage({ sessions = [], reflections = [] }) {
  // 1. Calculate Statistics
  const totalSessions = sessions.length;
  const completedFocusSessions = sessions.filter(s => s.type === 'focus');
  
  // Calculate total focus time in hours and minutes
  const totalFocusMinutes = completedFocusSessions.reduce((acc, s) => acc + (s.duration || 25), 0);
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;
  
  // Calculate focus quality ratios
  const qualities = completedFocusSessions.map(s => s.quality).filter(Boolean);
  const totalQualitiesCount = qualities.length;
  const focusedCount = qualities.filter(q => q === 'focused').length;
  const neutralCount = qualities.filter(q => q === 'neutral').length;
  const distractedCount = qualities.filter(q => q === 'distracted').length;
  
  const focusRatio = totalQualitiesCount > 0 
    ? Math.round(((focusedCount + neutralCount * 0.5) / totalQualitiesCount) * 100)
    : 0;

  // 2. Generate Weekly Chart Data (Last 7 days)
  const getWeeklyChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = WEEKDAYS[d.getDay()];
      
      // Filter focus sessions completed on this date
      const count = completedFocusSessions.filter(s => {
        const sDate = s.timestamp.split('T')[0];
        return sDate === dateStr;
      }).length;
      
      data.push({ dateStr, dayName, count });
    }
    return data;
  };

  const chartData = getWeeklyChartData();
  const maxCount = Math.max(...chartData.map(d => d.count), 4); // Min ceiling of 4 for better proportions

  return (
    <div className="space-y-5 fade-in pb-12">
      {/* 1. Statistics Cards Grid */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 px-1">집중 통계</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-center">
            <p className="text-[10px] font-semibold text-gray-400">총 집중 시간</p>
            <p className="text-base font-bold text-[#5B6EE1] mt-1">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-center">
            <p className="text-[10px] font-semibold text-gray-400">총 완료 세션</p>
            <p className="text-base font-bold text-[#2F9E8F] mt-1">{totalSessions}회</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-center">
            <p className="text-[10px] font-semibold text-gray-400">집중 몰입도</p>
            <p className="text-base font-bold text-[#A060C8] mt-1">{focusRatio}%</p>
          </div>
        </div>
      </div>

      {/* 2. Weekly Bar Chart Card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
        <h4 className="text-xs font-bold text-gray-700 mb-4 flex items-center gap-1">
          <span className="material-symbols-rounded text-base text-[#5B6EE1]">bar_chart</span>
          <span>최근 7일 집중 기록</span>
        </h4>
        
        {/* Bars Container */}
        <div className="flex items-end justify-between h-28 px-2 pb-1 border-b border-gray-150">
          {chartData.map((d, idx) => {
            const barHeightPercent = (d.count / maxCount) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-14 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-mono z-10">
                  {d.count}세션
                </div>
                {/* Bar */}
                <div 
                  className={`w-4 rounded-t-sm transition-all duration-500 ${
                    d.count > 0 ? 'bg-[#5B6EE1]' : 'bg-gray-100'
                  }`}
                  style={{ height: `${Math.max(barHeightPercent, 4)}%` }}
                />
                {/* Day label */}
                <span className="text-[10px] font-semibold text-gray-400 mt-2">{d.dayName}</span>
              </div>
            );
          })}
        </div>

        {/* Quality Distribution Pills */}
        {totalQualitiesCount > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>몰입: {Math.round((focusedCount / totalQualitiesCount) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>보통: {Math.round((neutralCount / totalQualitiesCount) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>산만: {Math.round((distractedCount / totalQualitiesCount) * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Reflection History Log */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 px-1">하루 회고 로그</h3>
        
        {reflections.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs text-center">
            <span className="material-symbols-rounded text-gray-300 text-3xl">edit_note</span>
            <p className="text-xs text-gray-400 mt-1">저장된 회고 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reflections.slice().reverse().map((r, index) => (
              <div key={index} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-bold text-gray-400">{r.date}</span>
                  {r.skipped ? (
                    <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">건너뜀</span>
                  ) : (
                    <span className="text-[9px] font-semibold text-[#A060C8] bg-[#F3E8FF] px-2 py-0.5 rounded-full">완료</span>
                  )}
                </div>

                {!r.skipped ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-semibold text-gray-500">Q1. 집중을 방해한 요소</p>
                      <p className="text-gray-700 mt-0.5 font-sans leading-relaxed bg-gray-50 p-2 rounded-xl border border-gray-100">
                        {r.answer1 || <span className="text-gray-400 italic">내용 없음</span>}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">Q2. 내일 다르게 해볼 행동</p>
                      <p className="text-gray-700 mt-0.5 font-sans leading-relaxed bg-gray-50 p-2 rounded-xl border border-gray-100">
                        {r.answer2 || <span className="text-gray-400 italic">내용 없음</span>}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">이 날의 회고 작성을 건너뛰었습니다.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
