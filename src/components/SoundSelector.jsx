import React from 'react';

export const TRACKS = [
  {
    id: 'wind',
    name: '숲속 바람',
    desc: '자연의 소리',
    image: '/images/forest_wind.png'
  },
  {
    id: 'rain',
    name: '빗소리',
    desc: '토닥토닥 빗소리',
    image: '/images/rain_sound.png'
  },
  {
    id: 'noise',
    name: '백색소음',
    desc: '차분한 백색소음',
    image: '/images/white_noise.png'
  }
];

export default function SoundSelector({
  currentTrackId,
  setCurrentTrackId,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  onPlay,
  onStop
}) {
  const currentTrackIndex = TRACKS.findIndex(t => t.id === currentTrackId);
  const currentTrack = TRACKS[currentTrackIndex >= 0 ? currentTrackIndex : 0];

  const handlePrev = () => {
    const nextIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    const track = TRACKS[nextIdx];
    setCurrentTrackId(track.id);
    if (isPlaying) {
      onPlay(track.id);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    const track = TRACKS[nextIdx];
    setCurrentTrackId(track.id);
    if (isPlaying) {
      onPlay(track.id);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      onStop();
      setIsPlaying(false);
    } else {
      onPlay(currentTrack.id);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div className="w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-xs mb-4 fade-in">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5 text-[#1F2937] font-semibold text-sm">
          <span className="material-symbols-rounded text-lg text-gray-500">volume_up</span>
          <span>집중 음악 선택</span>
        </div>
        {isPlaying && (
          <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            재생 중
          </span>
        )}
      </div>

      {/* Music Card Wrapper */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
        {/* Thumbnail & Title info */}
        <div className="flex items-center gap-3">
          <img
            src={currentTrack.image}
            alt={currentTrack.name}
            className="w-12 h-12 rounded-xl object-cover shadow-xs border border-gray-100"
          />
          <div>
            <h4 className="font-semibold text-sm text-gray-800 leading-tight">{currentTrack.name}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{currentTrack.desc}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full hover:bg-gray-200 active:scale-90 transition-all flex items-center justify-center text-gray-500"
            aria-label="이전 곡"
          >
            <span className="material-symbols-rounded text-xl">skip_previous</span>
          </button>

          {/* Toggle Play Button */}
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-full bg-[#5B6EE1] hover:bg-[#4A5CD0] active:scale-95 transition-all flex items-center justify-center text-white shadow-xs"
            aria-label={isPlaying ? '정지' : '재생'}
          >
            <span className="material-symbols-rounded text-xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full hover:bg-gray-200 active:scale-90 transition-all flex items-center justify-center text-gray-500"
            aria-label="다음 곡"
          >
            <span className="material-symbols-rounded text-xl">skip_next</span>
          </button>
        </div>
      </div>

      {/* Volume Slider Section */}
      <div className="flex items-center gap-2 mt-3.5 px-1">
        <span className="material-symbols-rounded text-gray-400 text-lg">
          {volume === 0 ? 'volume_off' : volume < 0.4 ? 'volume_down' : 'volume_up'}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B6EE1] focus:outline-none"
          style={{
            background: `linear-gradient(to right, #5B6EE1 0%, #5B6EE1 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
          }}
          aria-label="음량 조절"
        />
        <span className="text-[10px] text-gray-400 font-mono w-6 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
