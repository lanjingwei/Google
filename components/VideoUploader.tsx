import React, { useState, useCallback, useRef, useEffect } from 'react';

interface VideoUploaderProps {
  onFileChange: (file: File | null) => void;
}

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
  </svg>
);

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileChange }) => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    if (file) {
      setFileName(file.name);
      setVideoPreviewUrl(URL.createObjectURL(file));
      onFileChange(file);
    } else {
      setFileName('');
      setVideoPreviewUrl(null);
      onFileChange(null);
    }
  }, [onFileChange, videoPreviewUrl]);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files?.[0] || null;
      if (file && file.type.startsWith('video/')) {
        if(fileInputRef.current) {
          fileInputRef.current.files = event.dataTransfer.files;
          handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
        }
      }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {!videoPreviewUrl ? (
        <div 
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">点击上传</span> 或拖放文件</p>
            <p className="text-xs text-gray-500">MP4, AVI, MOV 或其他视频格式</p>
          </div>
          <input ref={fileInputRef} id="dropzone-file" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="mt-4">
          <video controls src={videoPreviewUrl} className="w-full max-h-96 rounded-lg bg-black" />
          <div className="text-center mt-4">
            <p className="text-sm text-gray-300 truncate">已选择: {fileName}</p>
            <button onClick={handleClick} className="mt-2 text-sm text-blue-400 hover:text-blue-300">
              更换视频
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;