export enum Vibe {
  CLEAN_LEAN = 'Clean & Lean',
  BULK = 'The Bulk',
  SPEED_RUN = 'Speed Run',
  COMFORT = 'Comfort',
  SCAVENGER = 'The Scavenger',
}

export interface Ingredient {
  name: string;
  amount?: string;
}

export enum RecipeCategory {
  LAZY_CHEF = 'The Lazy Chef',
  MACRO_KING = 'The Macro King',
  SURPRISE = 'The Surprise',
  ONE_POT = 'The One-Pot',
  ALMOST_THERE = 'The Almost There',
}

export interface Recipe {
  id: string;
  category: RecipeCategory;
  title: string;
  description: string;
  timeEstimate: string; // e.g., "15 MIN"
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  ingredients: Ingredient[];
  missingIngredient?: string; // Only for "Almost There"
  steps: string[];
  tips: string;
}

export interface AnalysisResult {
  safetyWarning: string | null;
  recipes: Recipe[];
}

export interface AppState {
  photos: string[]; // Base64 strings
  extraText: string;
  selectedVibe: Vibe | null;
  staples: string[];
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
}