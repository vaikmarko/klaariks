import { GoogleGenAI } from "@google/genai";

// Initialize the client. In a real app, strict error handling for missing key is needed.
// For this demo, we will fallback gracefully if key is missing.
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface OCRResult {
  vendor: string;
  amount: number;
  date: string;
  category: string;
  summary: string;
}

/**
 * Analyzes an image (receipt/invoice) using Gemini Vision capabilities.
 */
export const analyzeReceipt = async (base64Image: string): Promise<OCRResult> => {
  // Fallback for demo without API key
  if (!ai) {
    console.warn("API Key missing, returning mock OCR data");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return {
      vendor: "Mock Vendor OÜ (Demo)",
      amount: 125.50,
      date: "2023-11-01",
      category: "Bürookulud",
      summary: "Osteti kontoritarbeid ja printeripaberit."
    };
  }

  try {
    const model = "gemini-2.5-flash-image"; // Optimized for image tasks
    const prompt = `
      Analüüsi seda tšekki või arvet.
      Väljasta tulemus JSON formaadis järgmiste väljadega:
      - vendor (string): müüja nimi
      - amount (number): kogusumma (total)
      - date (string): kuupäev formaadis YYYY-MM-DD
      - category (string): pakutud raamatupidamise kulukonto (nt. Transport, Büroo, Teenused)
      - summary (string): lühike 1-lauseline kokkuvõte eesti keeles.
      
      Ära lisa markdowni märgendust (nagu \`\`\`json), väljasta ainult toores JSON string.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity in this demo wrapper
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    const text = response.text || "{}";
    // Basic cleanup if model adds markdown blocks despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as OCRResult;

  } catch (error) {
    console.error("Gemini OCR error:", error);
    throw new Error("Viga tšeki analüüsimisel.");
  }
};

/**
 * Generates financial advice based on current metrics.
 */
export const getFinancialAdvice = async (cash: number, expenses: number, dividendRatio: number = 0): Promise<string> => {
  if (!ai) {
    // Local logic for demo if no AI
    if (dividendRatio > 0.8) return "Demo: Hoiatus! Dividendide osakaal on liiga suur võrreldes palgaga. Maksuamet võib seda tõlgendada varjatud töötasuna.";
    return "Demo: Sinu finantsseis on stabiilne. Soovitame hoida vähemalt 2 kuu puhvrit ja vaadata üle käibemaksutagastused.";
  }

  try {
    const model = "gemini-3-flash-preview"; // Good for text generation
    const response = await ai.models.generateContent({
      model,
      contents: `
        Oled Eesti raamatupidaja ja finantsnõustaja.
        Ettevõtte seis: 
        Raha kontol: ${cash}€
        Igakuised kulud: ${expenses}€
        
        Kontekst: Kasutaja tahab optimeerida makse, aga vältida maksuameti auditit (OÜtamine).
        Anna 1-lauseline väga konkreetne, inimlik ja julgustav soovitus. 
        Kui raha on palju, soovita investeerida või optimeeritult dividende võtta. 
        Kui raha on vähe, soovita kulusid jälgida.
      `
    });
    return response.text || "";
  } catch (e) {
    return "Hetkel ei saa nõuandeid genereerida.";
  }
}
