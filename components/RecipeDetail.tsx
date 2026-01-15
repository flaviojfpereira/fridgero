import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Flame, ChefHat, AlertCircle, Utensils, Zap, Scale } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-40 bg-app-bg flex flex-col overflow-y-auto animate-in fade-in duration-300">
      <div className="sticky top-0 bg-app-bg/95 backdrop-blur-xl p-4 flex justify-between items-center border-b border-white/10 z-20">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">
            {recipe.category}
          </span>
          <span className="text-white text-xs font-medium">Chef's Masterclass</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-3xl mx-auto w-full p-6 pb-24">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-[1.1] tracking-tight">{recipe.title}</h1>
          <p className="text-gray-400 text-xl leading-relaxed italic border-l-2 border-white/10 pl-4 py-2">
            {recipe.description}
          </p>
        </div>

        {/* Enhanced Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <Clock className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-white font-bold">{recipe.timeEstimate}</span>
            <span className="text-[10px] text-gray-500 uppercase">Prep & Cook</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <Flame className="w-5 h-5 text-orange-400 mb-1" />
            <span className="text-white font-bold">{recipe.macros.calories}</span>
            <span className="text-[10px] text-gray-500 uppercase">Calories</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <ChefHat className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-white font-bold">{recipe.macros.protein}g</span>
            <span className="text-[10px] text-gray-500 uppercase">Protein</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <Scale className="w-5 h-5 text-purple-400 mb-1" />
            <div className="text-white font-bold text-xs flex gap-2">
              <span>{recipe.macros.carbs}g C</span>
              <span>{recipe.macros.fats}g F</span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase">Macros</span>
          </div>
        </div>

        {recipe.missingIngredient && (
          <div className="mb-10 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-500 font-bold text-lg mb-1">Culinary Gap</h3>
              <p className="text-yellow-200/70">To achieve this dish's full potential, you are missing: <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{recipe.missingIngredient}</span></p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Utensils className="w-5 h-5 text-blue-500" />
              Provisions
            </h2>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex flex-col border-b border-white/5 pb-2">
                  <span className="text-gray-100 font-medium">{ing.name}</span>
                  <span className="text-gray-500 text-xs italic">{ing.amount || 'As needed'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-5 h-5 text-emerald-500" />
              Technique
            </h2>
            <div className="space-y-8">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-5 relative group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-xs shadow-lg">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 leading-[1.6] pt-1 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-white font-black mb-3 text-sm uppercase tracking-[0.2em]">Chef's Conclusion</h3>
          <p className="text-purple-100 text-lg leading-relaxed font-medium italic">
            "{recipe.tips}"
          </p>
        </div>
      </div>
    </div>
  );
};
