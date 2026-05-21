import React, { useState } from 'react';

const DEFAULT_TAGS = ['프로그래밍', '독서', '운동', '계획'];

export default function TagInput({
  tags = DEFAULT_TAGS,
  setTags,
  selectedTag,
  setSelectedTag,
  disabled
}) {
  const [newTagVal, setNewTagVal] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddTag = () => {
    const trimmed = newTagVal.trim().replace(/^#/, '');
    if (!trimmed) return;
    
    // Add to tags if not exists
    if (!tags.includes(trimmed)) {
      const updated = [trimmed, ...tags.filter(t => !DEFAULT_TAGS.includes(t))].slice(0, 5); // Max 5 custom tags
      const newTagsList = [...DEFAULT_TAGS, ...updated];
      setTags(newTagsList);
      setSelectedTag(trimmed);
    } else {
      setSelectedTag(trimmed);
    }
    
    setNewTagVal('');
    setShowInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-xs mb-4 fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-[#1F2937] font-semibold text-sm">
          <span className="material-symbols-rounded text-lg text-gray-500">sell</span>
          <span>태그 <span className="text-xs font-normal text-gray-400">(선택 사항)</span></span>
        </div>
        {disabled && (
          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full">
            <span className="material-symbols-rounded text-xs">lock</span>
            집중 중 변경 불가
          </span>
        )}
      </div>

      {/* Chip List */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              disabled={disabled}
              onClick={() => setSelectedTag(isSelected ? '' : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 border ${
                isSelected
                  ? 'bg-[#E8EAFF] border-[#5B6EE1] text-[#5B6EE1]'
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600 disabled:opacity-50'
              }`}
            >
              <span>#{tag}</span>
              {isSelected && (
                <span className="material-symbols-rounded text-[13px] font-bold">check</span>
              )}
            </button>
          );
        })}

        {/* Add custom tag trigger chip */}
        {!showInput && !disabled && (
          <button
            onClick={() => setShowInput(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-gray-300 hover:bg-gray-50 text-gray-400 flex items-center justify-center"
            aria-label="태그 추가"
          >
            <span className="material-symbols-rounded text-[14px]">add</span>
          </button>
        )}
      </div>

      {/* Tag Input Field */}
      {showInput && !disabled && (
        <div className="flex items-center gap-2 fade-in">
          <input
            type="text"
            placeholder="태그 입력 후 Enter 또는 클릭"
            value={newTagVal}
            onChange={(e) => setNewTagVal(e.target.value)}
            onKeyDown={handleKeyPress}
            maxLength={12}
            className="flex-1 h-9 px-3 rounded-xl border border-gray-200 text-xs font-sans text-gray-700 bg-gray-50 focus:outline-none focus:border-[#5B6EE1] focus:bg-white transition-all"
          />
          <button
            onClick={handleAddTag}
            className="h-9 px-3 bg-[#E8EAFF] hover:bg-[#5B6EE1] text-[#5B6EE1] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center"
          >
            추가
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setNewTagVal('');
            }}
            className="h-9 w-9 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center transition-all"
            aria-label="취소"
          >
            <span className="material-symbols-rounded text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
