import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTimer } from './hooks/useTimer';
import { notificationService } from './services/notificationService';
import audioSynth from './utils/audioSynth';
import { FocusProvider } from './stores/FocusContext';

import TimerPage from './pages/TimerPage';
import ReflectionPage from './pages/ReflectionPage';
import SettingsPage from './pages/SettingsPage';
import ReflectionModal from './components/ReflectionModal';

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  notificationsEnabled: false,
  autoPlaySound: false
};

const DEFAULT_TAGS = ['프로그래밍', '독서', '운동', '계획'];

export default function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const [settings, setSettings] = useLocalStorage('focusloop_settings', DEFAULT_SETTINGS);
  const [tags, setTags] = useLocalStorage('focusloop_tags', DEFAULT_TAGS);
  const [selectedTag, setSelectedTag] = useLocalStorage('focusloop_selected_tag', '');
  const [currentTrackId, setCurrentTrackId] = useLocalStorage('focusloop_sound_track', 'wind');
  const [soundVolume, setSoundVolume] = useLocalStorage('focusloop_sound_volume', 0.5);
  const [sessionsHistory, setSessionsHistory] = useLocalStorage('focusloop_sessions', []);
  const [reflectionsHistory, setReflectionsHistory] = useLocalStorage('focusloop_reflections', []);

  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [modalDateStr, setModalDateStr] = useState('');
  const [showQualityDialog, setShowQualityDialog] = useState(false);

  useEffect(() => {
    audioSynth.setVolume(soundVolume);
  }, [soundVolume]);

  const handleTimerComplete = (expiredMode, currentSessionCount) => {
    playAlarmChime();

    if (expiredMode === 'focus') {
      audioSynth.stop();
      setIsPlayingSound(false);
      setShowQualityDialog(true);
      if (settings.notificationsEnabled) {
        notificationService.show('FocusLoop', '집중 세션이 완료되었습니다! 오늘의 몰입도를 평가해주세요.');
      }
    } else {
      const breakName = expiredMode === 'shortBreak' ? '짧은 휴식' : '긴 휴식';
      if (settings.notificationsEnabled) {
        notificationService.show('FocusLoop', `${breakName}이 끝났습니다! 새로운 집중을 준비해보세요.`);
      }
      
      const newBreakLog = {
        id: Date.now().toString(),
        type: expiredMode,
        timestamp: new Date().toISOString(),
        duration: expiredMode === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration
      };
      setSessionsHistory(prev => [...prev, newBreakLog]);

      const nextCount = currentSessionCount + 1 > settings.longBreakInterval ? 1 : currentSessionCount + 1;
      timer.changeMode('focus', nextCount);
    }
  };

  const timer = useTimer(settings, handleTimerComplete);

  // Daily reflection trigger check
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('sv');
    const completedFocusSessions = sessionsHistory.filter(s => s.type === 'focus');
    if (completedFocusSessions.length === 0) return;

    const sessionDates = completedFocusSessions.map(s => s.timestamp.split('T')[0]);
    const uniqueDates = [...new Set(sessionDates)].sort((a, b) => b.localeCompare(a));
    const lastSessionDateBeforeToday = uniqueDates.find(d => d < todayStr);
    
    if (lastSessionDateBeforeToday) {
      const reflectionExists = reflectionsHistory.some(r => r.date === lastSessionDateBeforeToday);
      if (!reflectionExists) {
        setModalDateStr(lastSessionDateBeforeToday);
        setShowReflectionModal(true);
      }
    }
  }, [sessionsHistory, reflectionsHistory]);

  const playAlarmChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.5);
      osc2.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
      console.warn('Alarm chime failed: ', err);
    }
  };

  const handleQualitySelect = (quality) => {
    const newFocusLog = {
      id: Date.now().toString(),
      type: 'focus',
      timestamp: new Date().toISOString(),
      duration: settings.focusDuration,
      tag: selectedTag || '없음',
      quality: quality
    };
    const updatedHistory = [...sessionsHistory, newFocusLog];
    setSessionsHistory(updatedHistory);
    setShowQualityDialog(false);

    const completedFocusCount = updatedHistory.filter(s => s.type === 'focus').length;
    const isLongBreak = completedFocusCount > 0 && completedFocusCount % settings.longBreakInterval === 0;

    timer.changeMode(isLongBreak ? 'longBreak' : 'shortBreak', timer.sessionCount);
  };

  const handleTogglePlay = () => {
    const nextRunning = !timer.isRunning;
    timer.setIsRunning(nextRunning);

    if (nextRunning && settings.autoPlaySound && !isPlayingSound && timer.mode === 'focus') {
      audioSynth.play(currentTrackId);
      setIsPlayingSound(true);
    }
  };

  const handleManualModeChange = (targetMode) => {
    if (timer.isRunning) {
      if (!confirm('타이머가 실행 중입니다. 단계를 변경하면 진행 상황이 손실됩니다. 계속하시겠습니까?')) return;
    }
    audioSynth.stop();
    setIsPlayingSound(false);
    timer.changeMode(targetMode, timer.sessionCount);
  };

  const handleSkip = () => {
    audioSynth.stop();
    setIsPlayingSound(false);
    
    if (timer.mode === 'focus') {
      const completedFocusCount = sessionsHistory.filter(s => s.type === 'focus').length;
      const isLongBreak = (completedFocusCount + 1) % settings.longBreakInterval === 0;
      timer.changeMode(isLongBreak ? 'longBreak' : 'shortBreak', timer.sessionCount);
    } else {
      const nextCount = timer.sessionCount + 1 > settings.longBreakInterval ? 1 : timer.sessionCount + 1;
      timer.changeMode('focus', nextCount);
    }
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setSettings(DEFAULT_SETTINGS);
    setTags(DEFAULT_TAGS);
    setSelectedTag('');
    setCurrentTrackId('wind');
    setSoundVolume(0.5);
    setIsPlayingSound(false);
    audioSynth.stop();
    timer.changeMode('focus', 1);
    setSessionsHistory([]);
    setReflectionsHistory([]);
  };

  return (
    <FocusProvider>
      <div className="w-full max-w-[480px] min-h-screen mx-auto bg-[#F7F8FC] flex flex-col shadow-xl relative border-x border-gray-150">
        
        <header className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-1.5 font-sans">
                <span className="material-symbols-rounded text-2xl text-[#5B6EE1] animate-spin-slow">loop</span>
                FocusLoop
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">오늘도 한 세션만 집중합니다.</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 overflow-y-auto pb-24">
          {activeTab === 'timer' && (
            <TimerPage
              mode={timer.mode}
              sessionCount={timer.sessionCount}
              longBreakInterval={settings.longBreakInterval}
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={timer.totalSeconds}
              isRunning={timer.isRunning}
              onTogglePlay={handleTogglePlay}
              onReset={timer.resetTimer}
              onSkip={handleSkip}
              onManualModeChange={handleManualModeChange}
              tags={tags}
              setTags={setTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              currentTrackId={currentTrackId}
              setCurrentTrackId={setCurrentTrackId}
              isPlayingSound={isPlayingSound}
              setIsPlayingSound={setIsPlayingSound}
              soundVolume={soundVolume}
              setSoundVolume={setSoundVolume}
              onSoundPlay={(id) => audioSynth.play(id)}
              onSoundStop={() => audioSynth.stop()}
            />
          )}

          {activeTab === 'history' && (
            <ReflectionPage sessions={sessionsHistory} reflections={reflectionsHistory} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onSaveSettings={setSettings}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>

        <nav className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-gray-150 h-20 flex items-center justify-around z-20">
          <button onClick={() => setActiveTab('timer')} className="flex flex-col items-center justify-center flex-1 h-full relative" aria-label="타이머">
            <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${activeTab === 'timer' ? 'bg-[#E8EAFF] text-[#5B6EE1]' : 'text-gray-400 hover:text-gray-600'}`}>
              <span className="material-symbols-rounded text-[22px]">timer</span>
            </div>
            <span className={`text-[10px] font-semibold mt-1 transition-all ${activeTab === 'timer' ? 'text-[#5B6EE1]' : 'text-gray-400'}`}>타이머</span>
          </button>
          <button onClick={() => setActiveTab('history')} className="flex flex-col items-center justify-center flex-1 h-full relative" aria-label="오늘 회고">
            <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${activeTab === 'history' ? 'bg-[#F3E8FF] text-[#A060C8]' : 'text-gray-400 hover:text-gray-600'}`}>
              <span className="material-symbols-rounded text-[22px]">edit_note</span>
            </div>
            <span className={`text-[10px] font-semibold mt-1 transition-all ${activeTab === 'history' ? 'text-[#A060C8]' : 'text-gray-400'}`}>오늘 회고</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center justify-center flex-1 h-full relative" aria-label="설정">
            <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${activeTab === 'settings' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}>
              <span className="material-symbols-rounded text-[22px]">settings</span>
            </div>
            <span className={`text-[10px] font-semibold mt-1 transition-all ${activeTab === 'settings' ? 'text-gray-700' : 'text-gray-400'}`}>설정</span>
          </button>
        </nav>

        <ReflectionModal
          isOpen={showReflectionModal}
          dateStr={modalDateStr}
          onSave={(a1, a2) => {
            const newRef = { date: modalDateStr, question1: '집중 방해 요소?', answer1: a1, question2: '내일 개선할 점?', answer2: a2, skipped: false, createdAt: new Date().toISOString() };
            setReflectionsHistory([...reflectionsHistory, newRef]);
            setShowReflectionModal(false);
          }}
          onSkip={() => {
            setReflectionsHistory([...reflectionsHistory, { date: modalDateStr, skipped: true, createdAt: new Date().toISOString() }]);
            setShowReflectionModal(false);
          }}
        />

        {showQualityDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs fade-in">
            <div className="w-full max-w-[360px] bg-white rounded-[28px] p-6 shadow-xl border border-gray-100 text-center">
              <h3 className="text-base font-bold text-gray-800 leading-tight">세션 완료! 집중도 평가</h3>
              <p className="text-xs text-gray-400 mt-1">방금 완료한 세션의 집중 품질을 스탬프로 남겨보세요.</p>
              <div className="grid grid-cols-3 gap-2.5 my-5">
                <button onClick={() => handleQualitySelect('distracted')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-rounded text-3xl">sentiment_very_dissatisfied</span>
                  <span className="text-xs font-semibold">산만</span>
                </button>
                <button onClick={() => handleQualitySelect('neutral')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-amber-100 bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-rounded text-3xl">sentiment_neutral</span>
                  <span className="text-xs font-semibold">보통</span>
                </button>
                <button onClick={() => handleQualitySelect('focused')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-rounded text-3xl">sentiment_very_satisfied</span>
                  <span className="text-xs font-semibold">몰입</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-450 italic">선택하면 바로 다음 단계(휴식)로 넘어갑니다.</p>
            </div>
          </div>
        )}
      </div>
    </FocusProvider>
  );
}
