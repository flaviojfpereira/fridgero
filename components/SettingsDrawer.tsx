import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  staples: string[];
  setStaples: (staples: string[]) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, staples, setStaples }) => {
  const [newItem, setNewItem] = useState('');

  const addStaple = () => {
    if (newItem.trim()) {
      setStaples([...staples, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeStaple = (index: number) => {
    const newStaples = [...staples];
    newStaples.splice(index, 1);
    setStaples(newStaples);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-app-surface h-full shadow-2xl p-6 flex flex-col transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Invisible Pantry</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <p className="text-gray-400 mb-6 text-sm">
          Fridgero assumes you ALWAYS have these items. We won't list them as "missing".
        </p>

        <div className="flex gap-2 mb-6">
          <input 
            id="staple-input"
            name="staple-input"
            type="text" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStaple()}
            placeholder="Add staple (e.g. Cumin)"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
          />
          <button 
            onClick={addStaple}
            className="bg-white text-black px-4 rounded-xl font-bold flex items-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {staples.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-200">{item}</span>
              <button onClick={() => removeStaple(idx)} className="text-gray-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
