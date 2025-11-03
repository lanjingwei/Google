import React from 'react';

interface PromptSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const suggestions = [
  '总结视频的要点。',
  '识别视频中的所有人物。',
  '描述视频的场景设置。',
  '这个视频传达了什么样的情绪或基调？',
  '为这个视频生成一个适合在社交媒体上发布的简短描述。',
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectSuggestion }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">或尝试一个建议：</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelectSuggestion(suggestion)}
            className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
