
import { Vibe, AnalysisResult } from '../types';

export const generateRecipes = async (
  photos: string[],
  extraText: string,
  vibe: Vibe,
  staples: string[]
): Promise<AnalysisResult> => {
  
  // We now call our own secure backend endpoint.
  // The API Key is safely stored on the server and never exposed here.
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      photos,
      extraText,
      vibe,
      staples
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result = await response.json();
  return result as AnalysisResult;
};
