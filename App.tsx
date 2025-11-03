import React, { useState, useCallback } from 'react';
import { analyzeVideo } from './services/geminiService';
import VideoUploader from './components/VideoUploader';
import AnalysisResult from './components/AnalysisResult';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("详细描述这个视频。关键物体、动作和整体主题或信息是什么？");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setVideoFile(file);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!videoFile) {
      setError("请先选择一个视频文件。");
      return;
    }
    
    if(!prompt.trim()) {
      setError("请输入分析提示。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeVideo(videoFile, prompt);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析过程中发生未知错误。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini 视频分析器
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            上传一个视频，让 Gemini Pro 为您提供详细分析。
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">1. 上传您的视频</h2>
            <VideoUploader onFileChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-2 text-center">为获得最佳效果，请使用较短的视频片段（1分钟以内）。</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">2. 设置您的提示</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
              placeholder="例如，这个视频的情感是什么？"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={!videoFile || isLoading}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {isLoading ? '分析中...' : '分析视频'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
              <p><strong>错误：</strong> {error}</p>
            </div>
          )}

          {isLoading && <Loader />}
          
          {analysisResult && <AnalysisResult result={analysisResult} />}
        </main>
      </div>
    </div>
  );
};

export default App;