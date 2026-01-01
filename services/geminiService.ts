
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not be available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-3-flash-preview';

export const generateLetter = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `Generate a professional office letter based on the following request. Do not include a subject line unless requested. Start directly with the letter content. Request: "${prompt}"`;
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    return response.text ?? "Could not generate content.";
  } catch (error) {
    console.error("Error generating letter:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const improveText = async (text: string, instruction: string): Promise<string> => {
  try {
    const fullPrompt = `Rewrite the following text to be ${instruction}. Only return the rewritten text, without any additional commentary. Text: "${text}"`;
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    return response.text ?? text;
  } catch (error) {
    console.error("Error improving text:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const fullPrompt = `Summarize the following letter in a few bullet points. Text: "${text}"`;
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });
    return response.text ?? "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not set.");
  }
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    const textPart = {
      text: 'Extract all text content from this image. Present the text exactly as it appears in the image, preserving line breaks. Do not add any commentary or formatting.'
    };
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
    });
    return response.text ?? "Could not extract text from image.";
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error("Failed to communicate with the AI model for image extraction.");
  }
};

const fileToGenerativePart = (file: File): Promise<{inlineData: {data: string, mimeType: string}}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      if (base64Data) {
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API_KEY is not set.");
    }

    if (!file.type.startsWith('image/')) {
        // The current Gemini API setup is optimized for images. PDFs would require a different process.
        console.warn(`Unsupported file type: ${file.type}. Only images are supported for text extraction.`);
        throw new Error("Unsupported file type. Please upload an image (PNG, JPG, etc.). PDF import is not yet supported.");
    }
    
    try {
        const imagePart = await fileToGenerativePart(file);
        const textPart = {
            text: 'Extract all text content from this image. Present the text exactly as it appears, preserving line breaks. Do not add any commentary or formatting.'
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text ?? `Could not extract text from ${file.name}.`;
    } catch (error) {
        console.error("Error extracting text from file:", error);
        throw new Error("Failed to communicate with the AI model for file extraction.");
    }
};

export interface AnalysisResult {
  tone: string;
  sentiment: string;
  suggestions: string[];
}

export const analyzeDocument = async (text: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not set.");
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the following document. Determine its tone and sentiment, and provide a list of actionable suggestions for improvement. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonText = response.text?.trim() ?? '{}';
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw new Error("Failed to communicate with the AI model for document analysis.");
  }
};

export interface EmailComposition {
  subject: string;
  body: string;
}

export const generateEmail = async (prompt: string): Promise<EmailComposition> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not set.");
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a professional email based on the following request. Provide a concise subject line and a well-formatted body. Request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text?.trim() ?? '{}';
    const parsed = JSON.parse(jsonText) as EmailComposition;
    // The body might contain newline characters as \\n, so we need to replace them
    parsed.body = parsed.body.replace(/\\n/g, '\n');
    return parsed;
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Failed to communicate with the AI model for email generation.");
  }
};
