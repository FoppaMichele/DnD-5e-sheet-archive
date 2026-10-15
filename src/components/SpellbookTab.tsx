import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import {
  ABILITIES,
  SPELL_PRESETS,
  formatModifier,
  getSpellAttackBonus,
  getSpellSaveDC,
} from '../utils/rules5e';
import { AbilityKey } from '../types';
import { BookOpen, Dices, Plus, Sparkles, Trash2 } from 'lucide-react';

export const SpellbookTab: React.FC = () => {
  const { activeCharacter, updateActiveCharacter, rollCheck } = useCharacter();

  const [spellName, setSpellName] = useState('');
  const [spellLevel, setSpellLevel] = useState(1);
  const [spellSchool, setSpellSchool] = useState('Evocation');
  const [spellTime, setSpellTime] = useState('1 Action');
  const [spellRange, setSpellRange] = useState('60 feet');
  const [spellComp, setSpellComp] = useState('V, S');
  const [spellDuration, setSpellDuration] = useState('Instantaneous');
  const [spellDesc, setSpellDesc] = useState('');

  const saveDC = getSpellSaveDC(activeCharacter);
  const attackBonus = getSpellAttackBonus(activeCharacter);

  const handleAddSpell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spellName.trim()) return;
    updateActiveCharacter((prev) => ({
      ...prev,
      spellcasting: {
        ...prev.spellcasting,
        spells: [
          ...prev.spellcasting.spells,
          {
            id: crypto.randomUUID(),
            name: spellName.trim(),
            level: spellLevel,
            school: spellSchool,
            castingTime: spellTime,
            range: spellRange,
            components: spellComp,
            duration: spellDuration,
            prepared: true,
            description: spellDesc.trim(),
          },
        ],
      },
    }));
    setSpellName('');
    setSpellDesc('');
  };

  const handleAddPreset = (presetName: string) => {
    const preset = SPELL_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    updateActiveCharacter((prev) => ({
      ...prev,
      spellcasting: {
        ...prev.spellcasting,
        spells: [
          ...prev.spellcasting.spells,
          {
            ...preset,
            id: crypto.randomUUID(),
            prepared: true,
          },
        ],
      },
    }));
  };

  return (
    <div className="space-y-5">
      <div className="parchment-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="flex flex-col items-center text-center p-2">
          <span className="text-[10px] font-semibold uppercase text-stone-400">
            Spellcasting Ability
          </span>
          <select
            value={activeCharacter.spellcasting.ability}
            onChange={(e) =>
              updateActiveCharacter((prev) => ({
                ...prev,
                spellcasting: {
                  ...prev.spellcasting,
                  ability: e.target.value as AbilityKey,
                },
              }))
            }
            className="stat-input mt-1 font-serif font-semibold text-sm text-center"
          >
            {ABILITIES.map((ab) => (
              <option key={ab.key} value={ab.key}>
                {ab.label} ({ab.key})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center text-center p-2">
          <span className="text-[10px] font-semibold uppercase text-stone-400">Spell Save DC</span>
          <span className="font-serif font-bold text-2xl text-stone-900 mt-0.5">
            {saveDC}
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-2">
          <span className="text-[10px] font-semibold uppercase text-stone-400">
            Spell Attack Bonus
          </span>
          <button
            type="button"
            onClick={() => rollCheck('Spell Attack Roll', attackBonus)}
            className="mt-1 px-3.5 py-1 rounded-md bg-stone-900 hover:bg-stone-700 text-white font-serif font-bold text-base flex items-center gap-1.5"
          >
            <span>{formatModifier(attackBonus)}</span>
            <Dices className="w-3.5 h-3.5 no-print" />
          </button>
        </div>
      </div>

      <div className="parchment-card p-4">
        <div className="parchment-header">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" /> Spell Slots
          </span>
          <button
            type="button"
            onClick={() =>
              updateActiveCharacter((prev) => {
                const resetSlots = { ...prev.spellcasting.slots };
                for (let lvl = 1; lvl <= 9; lvl++) {
                  resetSlots[lvl] = { ...resetSlots[lvl], used: 0 };
                }
                return {
                  ...prev,
                  spellcasting: { ...prev.spellcasting, slots: resetSlots },
                };
              })
            }
            className="no-print text-[11px] font-sans font-medium px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
          >
            Restore All Slots
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
            const slot = activeCharacter.spellcasting.slots[lvl] || { max: 0, used: 0 };
            return (
              <div
                key={lvl}
                className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-2 flex flex-col items-center text-center"
              >
                <span className="font-serif font-semibold text-xs text-stone-800 mb-1">
                  Lvl {lvl}
                </span>
                <div className="flex items-center gap-1 mb-1.5">
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={slot.max}
                    onChange={(e) => {
                      const maxVal = Math.max(0, Number(e.target.value));
                      updateActiveCharacter((prev) => ({
                        ...prev,
                        spellcasting: {
                          ...prev.spellcasting,
                          slots: {
                            ...prev.spellcasting.slots,
                            [lvl]: {
                              max: maxVal,
                              used: Math.min(slot.used, maxVal),
                            },
                          },
                        },
                      }));
                    }}
                    className="stat-input w-11 text-center text-xs py-0.5 font-semibold"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: slot.max }).map((_, idx) => {
                    const isUsed = idx < slot.used;
                    return (
                      <input
                        key={idx}
                        type="checkbox"
                        checked={isUsed}
                        onChange={() =>
                          updateActiveCharacter((prev) => ({
                            ...prev,
                            spellcasting: {
                              ...prev.spellcasting,
                              slots: {
                                ...prev.spellcasting.slots,
                                [lvl]: {
                                  ...slot,
                                  used: isUsed ? idx : idx + 1,
                                },
                              },
                            },
                          }))
                        }
                        className="w-3.5 h-3.5 accent-stone-900 cursor-pointer"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4 parchment-card p-4 space-y-3 no-print">
          <h3 className="parchment-header">Add Spell</h3>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-stone-400 mb-1">
              SRD Presets
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="stat-input w-full text-xs"
            >
              <option value="" disabled>
                -- Select Standard Spell --
              </option>
              {SPELL_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.level === 0 ? 'Cantrip' : `Lvl ${p.level}`})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAddSpell} className="space-y-2.5 text-xs border-t border-stone-200 pt-3">
            <input
              type="text"
              required
              placeholder="Spell Name"
              value={spellName}
              onChange={(e) => setSpellName(e.target.value)}
              className="stat-input w-full"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={spellLevel}
                onChange={(e) => setSpellLevel(Number(e.target.value))}
                className="stat-input w-full"
              >
                <option value={0}>Cantrip (0)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
              <select
                value={spellSchool}
                onChange={(e) => setSpellSchool(e.target.value)}
                className="stat-input w-full"
              >
                {[
                  'Abjuration',
                  'Conjuration',
                  'Divination',
                  'Enchantment',
                  'Evocation',
                  'Illusion',
                  'Necromancy',
                  'Transmutation',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Casting Time"
                value={spellTime}
                onChange={(e) => setSpellTime(e.target.value)}
                className="stat-input w-full"
              />
              <input
                type="text"
                placeholder="Range"
                value={spellRange}
                onChange={(e) => setSpellRange(e.target.value)}
                className="stat-input w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Components"
                value={spellComp}
                onChange={(e) => setSpellComp(e.target.value)}
                className="stat-input w-full"
              />
              <input
                type="text"
                placeholder="Duration"
                value={spellDuration}
                onChange={(e) => setSpellDuration(e.target.value)}
                className="stat-input w-full"
              />
            </div>

            <textarea
              rows={3}
              value={spellDesc}
              onChange={(e) => setSpellDesc(e.target.value)}
              className="stat-input w-full resize-none"
              placeholder="Spell description..."
            />

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Spell
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 print:col-span-12 parchment-card p-4">
          <h3 className="parchment-header">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-500" /> Spells (
              {activeCharacter.spellcasting.spells.length})
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCharacter.spellcasting.spells
              .slice()
              .sort((a, b) => a.level - b.level)
              .map((spell) => (
                <div
                  key={spell.id}
                  className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-serif font-semibold text-sm text-stone-900 block">
                          {spell.name}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} · {spell.school}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1 text-[10px] font-medium uppercase bg-stone-200/70 px-2 py-0.5 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={spell.prepared}
                            onChange={() =>
                              updateActiveCharacter((prev) => ({
                                ...prev,
                                spellcasting: {
                                  ...prev.spellcasting,
                                  spells: prev.spellcasting.spells.map((s) =>
                                    s.id === spell.id ? { ...s, prepared: !s.prepared } : s
                                  ),
                                },
                              }))
                            }
                            className="accent-stone-900"
                          />
                          <span>Prep</span>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveCharacter((prev) => ({
                              ...prev,
                              spellcasting: {
                                ...prev.spellcasting,
                                spells: prev.spellcasting.spells.filter(
                                  (s) => s.id !== spell.id
                                ),
                              },
                            }))
                          }
                          className="text-stone-400 hover:text-red-600 no-print"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-500 my-2 bg-white p-1.5 rounded border border-stone-200/60">
                      <span>Time: {spell.castingTime}</span>
                      <span>Range: {spell.range}</span>
                      <span>Comp: {spell.components}</span>
                      <span>Dur: {spell.duration}</span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">
                      {spell.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
