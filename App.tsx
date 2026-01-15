import React, { useState, useEffect } from 'react';
import { Camera, X, Settings as SettingsIcon, AlertTriangle, ChevronRight, Sparkles, Scale, Flame, Dumbbell } from 'lucide-react';
import { Vibe, Recipe, AppState } from './types';
import { DEFAULT_STAPLES } from './constants';
import { generateRecipes } from './services/geminiService';
import { VibeSelector } from './components/VibeSelector';
import { RecipeDetail } from './components/RecipeDetail';
import { SettingsDrawer } from './components/SettingsDrawer';

const MAX_PHOTOS = 4;

function App() {
  const [state, setState] = useState<AppState>({
    photos: [],
    extraText: '',
    selectedVibe: null,
    staples: DEFAULT_STAPLES,
    isLoading: false,
    result: null,
    error: null,
  });
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  useEffect(() => {
    const savedStaples = localStorage.getItem('fridgero_staples');
    if (savedStaples) {
      setState(prev => ({ ...prev, staples: JSON.parse(savedStaples) }));
    }
  }, []);

  const updateStaples = (newStaples: string[]) => {
    setState(prev => ({ ...prev, staples: newStaples }));
    localStorage.setItem('fridgero_staples', JSON.stringify(newStaples));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (state.photos.length >= MAX_PHOTOS) return;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setState(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleGenerate = async () => {
    if (state.photos.length === 0 && !state.extraText) return;
    if (!state.selectedVibe) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await generateRecipes(state.photos, state.extraText, state.selectedVibe, state.staples);
      setState(prev => ({ ...prev, isLoading: false, result }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message || "Something went wrong. Please check your API key." }));
    }
  };

  const resetApp = () => {
    setState(prev => ({ ...prev, photos: [], extraText: '', result: null, error: null }));
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans selection:bg-white/20 pb-10">
      <header className="p-6 flex justify-between items-center sticky top-0 z-30 bg-app-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xl">F</span>
          </div>
          <span className="font-bold text-xl tracking-tighter">FRIDGERO</span>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <SettingsIcon className="w-5 h-5 text-gray-300" />
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {state.isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse-fast"></div>
              <Sparkles className="w-16 h-16 text-white animate-spin-slow relative z-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white italic">Designing your Masterpiece...</h2>
            <p className="text-gray-400 max-w-xs mx-auto">Consulting our internal Michelin database for your specific ingredients.</p>
          </div>
        ) : state.result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-4xl font-black text-white">THE MENU</h2>
              <button onClick={resetApp} className="text-xs font-bold text-gray-500 hover:text-white transition uppercase tracking-widest">Rescan</button>
            </div>
            
            {state.result.safetyWarning && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-3xl mb-8 flex gap-4 items-start border-l-4 border-l-red-500">
                <AlertTriangle className="text-red-500 w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-red-500 font-bold uppercase text-xs tracking-widest">Freshness Alert</h3>
                  <p className="text-red-200/80 text-sm mt-1">{state.result.safetyWarning}</p>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              {state.result.recipes.map((recipe, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="group bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-white/20 p-6 rounded-[2rem] transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                      {recipe.category}
                    </span>
                    <span className="text-white font-black text-xl tracking-tighter italic">{recipe.timeEstimate}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{recipe.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs font-bold text-gray-300">{recipe.macros.calories} Cal</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-bold text-gray-300">{recipe.macros.protein}g Pro</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Scale className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-bold text-gray-300">{recipe.macros.carbs}g Carb</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-gray-300">{recipe.macros.fats}g Fat</span>
                    </div>
                  </div>

                  {recipe.missingIngredient && (
                     <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Requires 1 shop: {recipe.missingIngredient}
                     </div>
                  )}
                  <ChevronRight className="absolute right-6 bottom-6 text-white/10 w-8 h-8 group-hover:text-white/40 transition-all" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Pretty Hero Title */}
            <div className="text-center py-6 sm:py-10">
              <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter italic">CHEF'S VISION.</h1>
              <p className="text-gray-500 text-lg sm:text-xl font-medium max-w-md mx-auto leading-tight">
                Snap your fridge. Get a Michelin-level menu. <span className="text-white">Zero waste, zero stress.</span>
              </p>
            </div>

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="text-red-500 w-5 h-5" />
                <span className="text-red-200 font-medium text-sm">{state.error}</span>
              </div>
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-400 text-xs tracking-widest uppercase font-bold">Provisions ({state.photos.length}/{MAX_PHOTOS})</h3>
                 <p className="text-[10px] text-gray-600">The clearer the photo, the better the chef.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {state.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={photo} alt="Ingredient" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {state.photos.length < MAX_PHOTOS && (
                  <label htmlFor="photo-upload" className="aspect-[3/4] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer group">
                    <Camera className="w-10 h-10 text-gray-600 mb-2 group-hover:text-white transition-colors" />
                    <span className="text-xs text-gray-600 font-bold uppercase tracking-tighter">Snap</span>
                    <input id="photo-upload" name="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              
              <div className="mt-8">
                <input
                  id="extra-text"
                  name="extra-text"
                  type="text"
                  value={state.extraText}
                  onChange={(e) => setState(prev => ({ ...prev, extraText: e.target.value }))}
                  placeholder="Special requests or hidden items?"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all text-lg"
                />
              </div>
            </section>

            <VibeSelector 
              selected={state.selectedVibe} 
              onSelect={(vibe) => setState(prev => ({ ...prev, selectedVibe: vibe }))} 
            />

            <div className="pt-10 pb-20">
              <button
                onClick={handleGenerate}
                disabled={(state.photos.length === 0 && !state.extraText) || !state.selectedVibe}
                className={`
                  w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]
                  ${(state.photos.length > 0 || state.extraText) && state.selectedVibe
                    ? 'bg-white text-black translate-y-0 opacity-100 hover:shadow-white/10' 
                    : 'bg-white/5 text-gray-700 translate-y-10 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-6 h-6" />
                COMPOSE MENU
              </button>
            </div>
          </div>
        )}
      </main>

      <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} staples={state.staples} setStaples={updateStaples} />
    </div>
  );
}

export default App;
