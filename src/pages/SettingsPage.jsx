import React from 'react';
import { notificationService } from '../services/notificationService';

export default function SettingsPage({
  settings,
  onSaveSettings,
  onResetAllData
}) {
  const handleChange = (key, val) => {
    onSaveSettings({
      ...settings,
      [key]: val
    });
  };

  const requestNotificationPermission = async () => {
    if (!notificationService.isSupported()) {
      alert('이 브라우저는 데스크톱 알림을 지원하지 않습니다.');
      return;
    }
    
    if (!notificationService.isGranted()) {
      const granted = await notificationService.requestPermission();
      handleChange('notificationsEnabled', granted);
    } else {
      handleChange('notificationsEnabled', !settings.notificationsEnabled);
    }
  };

  const handleResetClick = () => {
    if (confirm('정말로 모든 데이터(태그, 회고, 설정, 집중 세션 기록)를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onResetAllData();
      alert('모든 데이터가 초기화되었습니다.');
    }
  };

  return (
    <div className="space-y-4 fade-in pb-12">
      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 px-1">시간 설정</h3>

      {/* Timer Length Settings Card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        {/* Focus Duration */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">집중 시간</h4>
            <p className="text-[10px] text-gray-400">집중 세션의 기본 길이를 설정합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('focusDuration', Math.max(5, settings.focusDuration - 5))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-gray-700 w-10 text-center">
              {settings.focusDuration}분
            </span>
            <button
              onClick={() => handleChange('focusDuration', Math.min(120, settings.focusDuration + 5))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Short Break Duration */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">짧은 휴식 시간</h4>
            <p className="text-[10px] text-gray-400">매 집중 세션 완료 후 가지는 짧은 휴식 시간입니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('shortBreakDuration', Math.max(1, settings.shortBreakDuration - 1))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-gray-700 w-10 text-center">
              {settings.shortBreakDuration}분
            </span>
            <button
              onClick={() => handleChange('shortBreakDuration', Math.min(30, settings.shortBreakDuration + 1))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Long Break Duration */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">긴 휴식 시간</h4>
            <p className="text-[10px] text-gray-400">여러 집중 세션 완료 후 가지는 긴 휴식 시간입니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('longBreakDuration', Math.max(5, settings.longBreakDuration - 5))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-gray-700 w-10 text-center">
              {settings.longBreakDuration}분
            </span>
            <button
              onClick={() => handleChange('longBreakDuration', Math.min(60, settings.longBreakDuration + 5))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Long Break Interval */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">긴 휴식 간격</h4>
            <p className="text-[10px] text-gray-400">긴 휴식을 취하기 전 완료할 집중 세션 횟수입니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('longBreakInterval', Math.max(1, settings.longBreakInterval - 1))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-gray-700 w-10 text-center">
              {settings.longBreakInterval}회
            </span>
            <button
              onClick={() => handleChange('longBreakInterval', Math.min(10, settings.longBreakInterval + 1))}
              className="w-7 h-7 rounded-lg bg-gray-100 active:scale-90 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 pt-2 px-1">일반 설정</h3>

      {/* Toggles settings card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">종료 알림</h4>
            <p className="text-[10px] text-gray-400">집중이나 휴식 종료 시 브라우저 알림을 받습니다.</p>
          </div>
          <button
            onClick={requestNotificationPermission}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              settings.notificationsEnabled ? 'bg-[#5B6EE1]' : 'bg-gray-250'
            }`}
            aria-label="알림 활성화"
          >
            <span
              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Play sound Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <h4 className="text-xs font-semibold text-gray-700">사운드 자동 재생</h4>
            <p className="text-[10px] text-gray-400">집중 타이머 시작 시 사운드를 자동으로 재생합니다.</p>
          </div>
          <button
            onClick={() => handleChange('autoPlaySound', !settings.autoPlaySound)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              settings.autoPlaySound ? 'bg-[#5B6EE1]' : 'bg-gray-250'
            }`}
            aria-label="사운드 자동 재생 활성화"
          >
            <span
              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                settings.autoPlaySound ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 pt-2 px-1">위험 구역</h3>

      {/* Reset Card */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-rose-500">모든 데이터 초기화</h4>
            <p className="text-[10px] text-gray-400">저장된 모든 로컬 데이터를 삭제하고 공장 초기화합니다.</p>
          </div>
          <button
            onClick={handleResetClick}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 font-semibold text-xs active:scale-95 transition-all"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
