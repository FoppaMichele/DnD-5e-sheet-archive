import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Sparkles } from 'lucide-react';

export const CharacterHeader: React.FC = () => {
  const { activeCharacter, updateActiveCharacter } = useCharacter();

  const handleField = (field: keyof typeof activeCharacter, value: string | number | boolean) => {
    updateActiveCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="parchment-card p-5 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-4 flex flex-col gap-1.5 border-b lg:border-b-0 lg:border-r border-stone-200 pb-4 lg:pb-0 lg:pr-5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeCharacter.name}
              onChange={(e) => handleField('name', e.target.value)}
              className="font-serif font-bold text-2xl text-stone-900 bg-transparent border-b border-stone-300 focus:border-stone-900 focus:outline-none w-full pb-0.5"
              placeholder="Character Name"
            />
            <button
              type="button"
              onClick={() => handleField('inspiration', !activeCharacter.inspiration)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition shrink-0 ${
                activeCharacter.inspiration
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-500 border-stone-200'
              }`}
              title="Toggle Heroic Inspiration"
            >
              <Sparkles className="w-3 h-3" />
              <span>Inspired</span>
            </button>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-medium text-stone-400">
            Character Identity
          </span>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
              Class & Subclass
            </label>
            <input
              type="text"
              value={activeCharacter.className}
              onChange={(e) => handleField('className', e.target.value)}
              className="stat-input w-full text-xs font-medium"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-16">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5 text-center">
                Level
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={activeCharacter.level}
                onChange={(e) => handleField('level', Math.min(20, Math.max(1, Number(e.target.value))))}
                className="stat-input w-full text-xs font-bold text-center"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                Background
              </label>
              <input
                type="text"
                value={activeCharacter.background}
                onChange={(e) => handleField('background', e.target.value)}
                className="stat-input w-full text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
              Player Name
            </label>
            <input
              type="text"
              value={activeCharacter.playerName}
              onChange={(e) => handleField('playerName', e.target.value)}
              className="stat-input w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
              Race / Species
            </label>
            <input
              type="text"
              value={activeCharacter.race}
              onChange={(e) => handleField('race', e.target.value)}
              className="stat-input w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
              Alignment
            </label>
            <input
              type="text"
              value={activeCharacter.alignment}
              onChange={(e) => handleField('alignment', e.target.value)}
              className="stat-input w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
              Experience (XP)
            </label>
            <input
              type="number"
              min={0}
              value={activeCharacter.xp}
              onChange={(e) => handleField('xp', Math.max(0, Number(e.target.value)))}
              className="stat-input w-full text-xs font-medium"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
