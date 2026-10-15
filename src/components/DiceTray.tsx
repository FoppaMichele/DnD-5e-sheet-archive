import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { formatModifier } from '../utils/rules5e';
import { Dices, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const DiceTray: React.FC = () => {
  const { rollLogs, rollCheck, clearRolls } = useCharacter();
  const [isOpen, setIsOpen] = useState(true);

  if (rollLogs.length === 0) return null;

  const latest = rollLogs[0];

  return (
    <aside className="fixed bottom-4 right-4 z-40 w-72 max-w-[calc(100vw-2rem)] bg-white border border-stone-200 rounded-xl shadow-lg text-stone-900 overflow-hidden">
      <div className="bg-stone-50 px-3 py-2 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-1.5">
          <Dices className="w-3.5 h-3.5 text-stone-700" />
          <span className="font-serif font-semibold text-xs uppercase tracking-wider text-stone-800">
            Rolls
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => rollCheck('d20 Roll', 0)}
            className="text-[10px] bg-stone-900 hover:bg-stone-700 text-white px-2 py-0.5 rounded font-medium"
          >
            + d20
          </button>
          <button
            type="button"
            onClick={clearRolls}
            className="p-1 text-stone-400 hover:text-red-600"
            title="Clear Roll History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-stone-500 hover:text-stone-900"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-3 flex items-center justify-between border-b border-stone-100">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-medium block">
            {latest.timestamp}
          </span>
          <span className="font-serif font-semibold text-sm text-stone-900 block">
            {latest.label}
          </span>
          <span className="text-xs text-stone-500">
            d20 ({latest.d20Raw}) {formatModifier(latest.modifier)}
          </span>
          {latest.damageResult && (
            <span className="block text-xs text-amber-700 font-medium mt-0.5">
              Dmg: {latest.damageResult}
            </span>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-lg font-serif font-bold text-lg flex items-center justify-center border ${
            latest.d20Raw === 20
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : latest.d20Raw === 1
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-stone-900 border-stone-900 text-white'
          }`}
        >
          {latest.total}
        </div>
      </div>

      {isOpen && rollLogs.length > 1 && (
        <div className="max-h-36 overflow-y-auto divide-y divide-stone-100 px-3 py-1 text-xs">
          {rollLogs.slice(1).map((r) => (
            <div key={r.id} className="py-1.5 flex items-center justify-between text-stone-600">
              <div>
                <span className="font-medium text-stone-800">{r.label}</span>
                <span className="text-[10px] text-stone-400 ml-1">
                  ({r.d20Raw}{formatModifier(r.modifier)})
                </span>
              </div>
              <span className="font-semibold text-stone-900">{r.total}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
