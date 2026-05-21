import React from 'react';
import CircularTimer from '../components/CircularTimer';
import ControlButtons from '../components/ControlButtons';
import TagInput from '../components/TagInput';
import SoundSelector from '../components/SoundSelector';

export default function TimerPage({
  mode,
  sessionCount,
  longBreakInterval,
  remainingSeconds,
  totalSeconds,
  isRunning,
  onTogglePlay,
  onReset,
  onSkip,
  onManualModeChange,
  tags,
  setTags,
  selectedTag,
  setSelectedTag,
  currentTrackId,
  setCurrentTrackId,
  isPlayingSound,
  setIsPlayingSound,
  soundVolume,
  setSoundVolume,
  onSoundPlay,
  onSoundStop
}) {
  let activeCardBadgeText = '집중 중';
  if (mode === 'shortBreak') activeCardBadgeText = '짧은 휴식';
  else if (mode === 'longBreak') activeCardBadgeText = '긴 휴식';

  return (
    <div className="space-y-4 fade-in">
      {/* Top Mode Segmented Buttons */}
      <div className="flex bg-gray-200/60 p-1 rounded-2xl gap-1 border border-gray-150">
        <button
          onClick={() => onManualModeChange('focus')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'focus'
              ? 'bg-white text-[#5B6EE1] shadow-xs'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          집중
        </button>
        <button
          onClick={() => onManualModeChange('shortBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'shortBreak'
              ? 'bg-white text-[#2F9E8F] shadow-xs'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          짧은 휴식
        </button>
        <button
          onClick={() => onManualModeChange('longBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            mode === 'longBreak'
              ? 'bg-white text-[#A060C8] shadow-xs'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          긴 휴식
        </button>
      </div>

      {/* Session Indicator Subtitle */}
      <div className="text-center mt-2.5">
        <p className="text-sm font-semibold text-gray-750">
          {mode === 'focus' ? '집중 중' : activeCardBadgeText} · {sessionCount} / {longBreakInterval}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          ({longBreakInterval}회 집중 완료 후 긴 휴식 전환)
        </p>
      </div>

      {/* Core Circular Timer Card */}
      <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-xs flex flex-col items-center">
        <CircularTimer
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          mode={mode}
          isRunning={isRunning}
          onTogglePlay={onTogglePlay}
        />
        
        <p className="text-xs text-gray-400 mt-2 italic">
          {mode === 'focus' && '집중해서 성취해요! 🚀'}
          {mode === 'shortBreak' && '잠시 커피 한 잔과 함께 쉬어가세요 ☕'}
          {mode === 'longBreak' && '충분히 쉬고 에너지를 회복하세요 🌳'}
        </p>
      </div>

      <ControlButtons
        isRunning={isRunning}
        onTogglePlay={onTogglePlay}
        onReset={onReset}
        onSkip={onSkip}
      />

      <TagInput
        tags={tags}
        setTags={setTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        disabled={isRunning && mode === 'focus'}
      />

      <SoundSelector
        currentTrackId={currentTrackId}
        setCurrentTrackId={setCurrentTrackId}
        isPlaying={isPlayingSound}
        setIsPlaying={setIsPlayingSound}
        volume={soundVolume}
        setVolume={setSoundVolume}
        onPlay={onSoundPlay}
        onStop={onSoundStop}
      />
    </div>
  );
}
