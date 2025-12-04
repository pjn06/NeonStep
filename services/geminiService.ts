import { GoogleGenAI } from "@google/genai";
import { User, Goal } from "../types";

// Initialize the client
// Ideally, in a real app, this key should be proxied through a backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMotivationalMessage = async (
  user: User,
  pendingGoals: Goal[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않았습니다. 목표를 달성하고 멋진 하루를 보내세요!";
  }

  try {
    const goalTitles = pendingGoals.map(g => g.title).join(", ");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        당신은 활기차고 긍정적인 '라이프 코치'입니다. 
        사용자의 이름은 ${user.name}이고, 현재 레벨은 ${user.level}입니다.
        사용자가 오늘 달성해야 할 목표들은 다음과 같습니다: ${goalTitles}.
        
        사용자에게 짧고 강력하며 재치 있는 응원의 메시지를 한국어로 100자 이내로 작성해주세요.
        네온 사이버펑크 감성으로, 에너지가 넘치는 말투를 사용하세요.
        이모지를 적절히 사용하세요.
      `,
    });

    return response.text || "오늘도 힘차게 나아가세요! 🚀";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "잠시 연결이 불안정하지만, 당신의 의지는 굳건합니다! 다시 시도해주세요. 💪";
  }
};

export const getSmartGoalSuggestion = async (): Promise<{title: string, type: 'STUDY' | 'OUTDOOR' | 'HEALTH' | 'SOCIAL', unit: string, value: number} | null> => {
    if (!process.env.API_KEY) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "은둔형 외톨이 극복이나 공부 의지 향상에 도움이 되는 작고 쉬운 목표 하나를 JSON으로 제안해주세요. 속성: title(문자열), type('STUDY'|'OUTDOOR'|'HEALTH'|'SOCIAL' 중 하나), unit('분' 또는 '회'), value(숫자).",
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if(text) {
            return JSON.parse(text);
        }
        return null;
    } catch (e) {
        return null;
    }
}