import React from 'react';

interface AnalysisResultProps {
  result: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  // Simple paragraph formatting
  const formattedResult = result.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-4 last:mb-0">
      {paragraph}
    </p>
  ));

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-green-300">分析结果</h2>
      <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-green-300 max-w-none text-gray-300">
        {formattedResult}
      </div>
    </div>
  );
};

export default AnalysisResult;