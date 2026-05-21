import React, { useState } from 'react';

export default function ReflectionModal({
  dateStr,
  onSave,
  onSkip,
  isOpen
}) {
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(ans1.trim(), ans2.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs fade-in">
      <div className="w-full max-w-[420px] bg-white rounded-[28px] p-6 shadow-xl border border-gray-150 transform transition-all">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[11px] font-semibold text-[#A060C8] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              {dateStr} 집중 회고
            </div>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">오늘 하루, 어떠셨나요?</h3>
            <p className="text-xs text-gray-400 mt-1">간단한 질문에 답하며 집중 경험을 돌아보세요.</p>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
            aria-label="닫기"
          >
            <span className="material-symbols-rounded text-lg">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              1. 집중을 방해한 요소가 있었나요?
            </label>
            <div className="relative">
              <textarea
                value={ans1}
                onChange={(e) => setAns1(e.target.value.slice(0, 200))}
                placeholder="어제 또는 오늘 집중을 방해했던 상황을 적어주세요. (선택)"
                className="w-full h-20 p-3 rounded-2xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#A060C8] focus:bg-white bg-gray-50 resize-none transition-all"
              />
              <span className="absolute bottom-2.5 right-3 text-[9px] font-mono text-gray-400">
                {ans1.length} / 200
              </span>
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              2. 내일은 무엇을 다르게 해보고 싶나요?
            </label>
            <div className="relative">
              <textarea
                value={ans2}
                onChange={(e) => setAns2(e.target.value.slice(0, 200))}
                placeholder="다음 세션에 적용해보고 싶은 팁을 적어주세요. (선택)"
                className="w-full h-20 p-3 rounded-2xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#A060C8] focus:bg-white bg-gray-50 resize-none transition-all"
              />
              <span className="absolute bottom-2.5 right-3 text-[9px] font-mono text-gray-400">
                {ans2.length} / 200
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 h-11 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              건너뛰기
            </button>
            <button
              type="submit"
              className="flex-1 h-11 text-xs font-semibold text-white bg-[#A060C8] hover:bg-[#8E51B5] rounded-2xl shadow-md transition-all active:scale-95"
            >
              회고 저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
