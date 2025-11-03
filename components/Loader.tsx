import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
      <p className="text-lg text-blue-300">正在分析您的视频，请稍候...</p>
    </div>
  );
};

export default Loader;