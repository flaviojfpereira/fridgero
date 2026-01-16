import { GoogleGenAI, Type, Schema } from "@google/genai";

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
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed culinary steps." },
          tips: { type: Type.STRING, description: "Professional chef's advice." }
        },
        required: ["id", "category", "title", "description", "timeEstimate", "macros", "ingredients", "steps", "tips"]
      }
    }
  },
  required: ["recipes"]
};

export default async function handler(req: any, res: any) {
  // Vercel serverless function entry point
  
  // Set basic CORS headers to allow the frontend to call this
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("Server Error: API_KEY is missing in environment variables.");
      return res.status(500).json({ 
        error: "Server Configuration Error. API_KEY is missing. Please check Vercel settings." 
      });
    }

    const { photos, extraText, vibe, staples } = req.body;

    const ai = new GoogleGenAI({ apiKey });
    
    const staplesString = Array.isArray(staples) ? staples.join(", ") : "";
    const systemPrompt = `You are a world-class Michelin-star chef and expert nutritionist. 
    Your goal is to create 5 high-end, extremely detailed recipes based ONLY on the ingredients visible in the user's photos and their invisible pantry: ${staplesString}.
    The user's current vibe is: ${vibe}.
    CULINARY STANDARDS:
    1. Write steps like a pro: focus on technique (e.g., 'emulsify', 'deglaze').
    2. Each recipe should feel designed by a master.
    3. Accuracy: Macros must be calculated based on the visible portions.
    4. The "The Almost There" category must require exactly ONE missing ingredient.`;

    const parts: any[] = photos.map((base64Data: string) => ({
      inlineData: {
        mimeType: 'image/jpeg',
        // Handle both data URI scheme and raw base64
        data: base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
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

    if (!response.text) {
        throw new Error("Empty response from AI model");
    }

    // Return the clean JSON to the frontend
    res.status(200).json(JSON.parse(response.text));

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
