
import { GoogleGenAI, Type } from "@google/genai";
import { Job, JobStatus, Priority } from "../types";

export async function analyzeSLARisk(jobs: Job[]) {
  // Initialize inside function to ensure environment variables are loaded
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    Analyze the following list of active emergency power jobs and identify high-risk SLA violations.
    Current Time: ${new Date().toISOString()}
    Jobs: ${JSON.stringify(jobs)}
    
    Criteria for risk:
    1. Critical priority jobs not in 'MOVING' or 'AT_GATE' status within 15 minutes.
    2. Jobs stuck in 'REQUESTED' status for more than 5 minutes.
    
    Return a list of risks with a short explanation and suggested mitigation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              jobId: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              message: { type: Type.STRING },
              mitigation: { type: Type.STRING }
            },
            required: ['jobId', 'riskLevel', 'message']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return [];
  }
}

export async function generatePriceEstimate(capacity: number, urgency: Priority) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `Calculate a fair market price for ${capacity}kVA mobile power with ${urgency} priority in Indian Rupees (INR). Consider base (approx ₹40/kVA), fuel surcharge, and urgency surcharge. Return only a JSON object with base, surcharge, and total as numbers.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            base: { type: Type.NUMBER },
            surcharge: { type: Type.NUMBER },
            total: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (e) {
    // Standard INR fallback rates
    const base = capacity * 40;
    const surcharge = urgency === Priority.CRITICAL ? 2000 : 500;
    return { base, surcharge, total: base + surcharge };
  }
}
