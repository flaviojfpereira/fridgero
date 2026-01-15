import React from 'react';
import { Vibe } from '../types';
import { VIBE_DETAILS } from '../constants';

interface VibeSelectorProps {
  selected: Vibe | null;
  onSelect: (vibe: Vibe) => void;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full">
      <h3 className="text-gray-400 mb-4 text-center text-sm tracking-widest uppercase">Vibe Check</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.values(Vibe).map((vibe) => {
          const detail = VIBE_DETAILS[vibe];
          const isSelected = selected === vibe;
          
          return (
            <button
              key={vibe}
              onClick={() => onSelect(vibe)}
              className={`
                relative p-4 rounded-2xl border text-left transition-all duration-200
                flex flex-col gap-2
                ${isSelected 
                  ? 'bg-white text-black border-white scale-[1.02] shadow-xl' 
                  : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                }
              `}
            >
              <span className="text-2xl">{detail.emoji}</span>
              <div>
                <span className="block font-bold text-sm leading-tight mb-1">{vibe}</span>
                <span className={`text-[10px] leading-tight block ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                  {detail.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};