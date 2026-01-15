import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Vibe, AnalysisResult, Recipe } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    safetyWarning: {
      type: Type.STRING,
      description: "A gentle warning if any ingredient in the photo looks spoiled. Null if safe.",
      nullable: true
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [
              "The Lazy Chef",
              "The Macro King",
              "The Surprise",
              "The One-Pot",
              "The Almost There"
            ]
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          timeEstimate: { type: Type.STRING },
          macros: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.INTEGER },
              protein: { type: Type.INTEGER },
              carbs: { type: Type.INTEGER },
              fats: { type: Type.INTEGER },
            },
            required: ["calories", "protein", "carbs", "fats"]
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING }
              }
            }
          },
          missingIngredient: { type: Type.STRING, nullable: true },
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed, professional culinary steps." },
          tips: { type: Type.STRING, description: "Professional chef's advice on flavor balancing or technique." }
        },
        required: ["id", "category", "title", "description", "timeEstimate", "macros", "ingredients", "steps", "tips"]
      }
    }
  },
  required: ["recipes"]
};

export const generateRecipes = async (
  photos: string[],
  extraText: string,
  vibe: Vibe,
  staples: string[]
): Promise<AnalysisResult> => {
  const staplesString = staples.join(", ");
  const systemPrompt = `You are a world-class Michelin-star chef and expert nutritionist. 
  Your goal is to create 5 high-end, extremely detailed recipes based ONLY on the ingredients visible in the user's photos and their invisible pantry: ${staplesString}.
  
  The user's current vibe is: ${vibe}.
  
  CULINARY STANDARDS:
  1. Write steps like a pro: focus on technique (e.g., 'emulsify', 'deglaze', 'render the fat', 'balance with acidity').
  2. Each recipe should feel like it was designed by a master, even if it's "The Lazy Chef" category.
  3. Be specific about heat levels and timing.
  4. Accuracy: Macros must be calculated based on the visible portions in the photos.
  5. The "The Almost There" category must require exactly ONE missing ingredient.
  `;

  const parts: any[] = photos.map(base64Data => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data.split(',')[1] || base64Data
    }
  }));

  parts.push({ text: `Analyze these photos and create a culinary experience. Additional context: ${extraText}` });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA,
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as AnalysisResult;
};
