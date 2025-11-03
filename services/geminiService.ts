import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the Base64 prefix, which we need to remove.
        // e.g., "data:video/mp4;base64,AAAA..."
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error("无法将文件读取为数据 URL。"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function analyzeVideo(file: File, prompt: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API 密钥未配置。请设置您的环境变量。");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-pro';

    try {
        const videoPart = await fileToGenerativePart(file);

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { text: prompt },
                    videoPart,
                ],
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("分析视频时出错:", error);
        if (error instanceof Error) {
            throw new Error(`使用 Gemini API 分析视频失败: ${error.message}`);
        }
        throw new Error("与 Gemini API 通信时发生未知错误。");
    }
}