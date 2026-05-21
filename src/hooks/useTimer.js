import { useState, useEffect, useRef } from 'react';

export function useTimer(settings, onTimerComplete) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [sessionCount, setSessionCount] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.focusDuration * 60);
  const [totalSeconds, setTotalSeconds] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef(null);

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onTimerComplete(mode, sessionCount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, sessionCount, onTimerComplete]);

  // Sync remaining seconds when settings change (if not running)
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'focus') {
        setRemainingSeconds(settings.focusDuration * 60);
        setTotalSeconds(settings.focusDuration * 60);
      } else if (mode === 'shortBreak') {
        setRemainingSeconds(settings.shortBreakDuration * 60);
        setTotalSeconds(settings.shortBreakDuration * 60);
      } else if (mode === 'longBreak') {
        setRemainingSeconds(settings.longBreakDuration * 60);
        setTotalSeconds(settings.longBreakDuration * 60);
      }
    }
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration, mode, isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setRemainingSeconds(settings.focusDuration * 60);
      setTotalSeconds(settings.focusDuration * 60);
    } else if (mode === 'shortBreak') {
      setRemainingSeconds(settings.shortBreakDuration * 60);
      setTotalSeconds(settings.shortBreakDuration * 60);
    } else if (mode === 'longBreak') {
      setRemainingSeconds(settings.longBreakDuration * 60);
      setTotalSeconds(settings.longBreakDuration * 60);
    }
  };

  const changeMode = (newMode, newSessionCount = sessionCount) => {
    setIsRunning(false);
    setMode(newMode);
    setSessionCount(newSessionCount);
    if (newMode === 'focus') {
      setRemainingSeconds(settings.focusDuration * 60);
      setTotalSeconds(settings.focusDuration * 60);
    } else if (newMode === 'shortBreak') {
      setRemainingSeconds(settings.shortBreakDuration * 60);
      setTotalSeconds(settings.shortBreakDuration * 60);
    } else if (newMode === 'longBreak') {
      setRemainingSeconds(settings.longBreakDuration * 60);
      setTotalSeconds(settings.longBreakDuration * 60);
    }
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      const isLongBreak = sessionCount % settings.longBreakInterval === 0;
      changeMode(isLongBreak ? 'longBreak' : 'shortBreak', sessionCount);
    } else {
      const nextCount = sessionCount + 1 > settings.longBreakInterval ? 1 : sessionCount + 1;
      changeMode('focus', nextCount);
    }
  };

  return {
    mode,
    sessionCount,
    remainingSeconds,
    totalSeconds,
    isRunning,
    setIsRunning,
    setSessionCount,
    changeMode,
    resetTimer,
    skipPhase
  };
}
