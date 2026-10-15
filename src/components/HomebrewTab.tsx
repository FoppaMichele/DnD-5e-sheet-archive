import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { HomebrewItem } from '../types';
import { Beaker, Plus, Sword, Trash2, ArrowRight } from 'lucide-react';

export const HomebrewTab: React.FC = () => {
  const { homebrewCompendium, addHomebrewItem, deleteHomebrewItem, updateActiveCharacter } = useCharacter();

  const [name, setName] = useState('');
  const [type, setType] = useState<HomebrewItem['type']>('Wondrous Item');
  const [rarity, setRarity] = useState<HomebrewItem['rarity']>('Uncommon');
  const [attunement, setAttunement] = useState(false);
  const [weight, setWeight] = useState(1);
  const [mechanics, setMechanics] = useState('');
  const [description, setDescription] = useState('');

  const handleCraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHomebrewItem({ id: crypto.randomUUID(), name: name.trim(), type, rarity, attunement, weight, mechanics: mechanics.trim(), description: description.trim() });
    setName(''); setMechanics(''); setDescription('');
  };

  const injectToInventory = (item: HomebrewItem) => {
    updateActiveCharacter(prev => ({
      ...prev,
      inventory: [{ id: crypto.randomUUID(), name: item.name, quantity: 1, weight: item.weight, equipped: false, notes: `${item.rarity} ${item.type}. ${item.mechanics}` }, ...prev.inventory]
    }));
    alert(`${item.name} added to inventory!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-4 parchment-card p-4 no-print">
        <h3 className="parchment-header"><span className="flex items-center gap-1.5"><Beaker className="w-3.5 h-3.5" /> Forge Homebrew Item</span></h3>
        <form onSubmit={handleCraft} className="space-y-3 text-xs">
          <input type="text" required placeholder="Artifact Name" value={name} onChange={(e) => setName(e.target.value)} className="stat-input w-full font-serif font-bold" />
          <div className="grid grid-cols-2 gap-2">
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="stat-input w-full">
              <option>Weapon</option><option>Armor</option><option>Wondrous Item</option><option>Potion</option><option>Ring</option><option>Scroll</option>
            </select>
            <select value={rarity} onChange={(e) => setRarity(e.target.value as any)} className="stat-input w-full">
              <option>Common</option><option>Uncommon</option><option>Rare</option><option>Very Rare</option><option>Legendary</option><option>Artifact</option>
            </select>
          </div>
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-950 p-2 rounded-md border border-stone-200 dark:border-stone-800">
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300">
              <input type="checkbox" checked={attunement} onChange={(e) => setAttunement(e.target.checked)} className="accent-stone-900" />
              Requires Attunement
            </label>
            <div className="flex items-center gap-1 border-l border-stone-300 dark:border-stone-700 pl-3">
              <span className="text-stone-500">Weight:</span>
              <input type="number" min={0} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="stat-input w-12 text-center py-0.5" />
            </div>
          </div>
          <input type="text" placeholder="Mechanical Stats (e.g. +1 to Hit, 1d8 Fire)" value={mechanics} onChange={(e) => setMechanics(e.target.value)} className="stat-input w-full" />
          <textarea rows={4} required placeholder="Lore and magical effects description..." value={description} onChange={(e) => setDescription(e.target.value)} className="stat-input w-full resize-none" />
          <button type="submit" className="w-full py-2 rounded-md bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs flex items-center justify-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Save to Compendium
          </button>
        </form>
      </div>

      <div className="lg:col-span-8 parchment-card p-4">
        <h3 className="parchment-header"><span className="flex items-center gap-1.5"><Sword className="w-3.5 h-3.5" /> Global Homebrew Compendium</span></h3>
        {homebrewCompendium.length === 0 ? (
          <div className="text-center text-stone-400 dark:text-stone-600 text-xs py-8">Your homebrew forge is empty. Craft an item to see it here.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {homebrewCompendium.map((item) => (
              <div key={item.id} className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 relative flex flex-col justify-between">
                <div>
                  <button onClick={() => deleteHomebrewItem(item.id)} className="absolute top-3 right-3 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 pr-6">{item.name}</h4>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 italic mb-2">
                    {item.type} · {item.rarity} {item.attunement && '· Attunement'}
                  </div>
                  {item.mechanics && <div className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">{item.mechanics}</div>}
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mb-3">{item.description}</p>
                </div>
                <button onClick={() => injectToInventory(item)} className="w-full mt-auto py-1.5 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition">
                  Inject to Active Character <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
