import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import {
  ABILITIES,
  formatModifier,
  getAbilityModifier,
  getInitiative,
  getPassivePerception,
  getProficiencyBonus,
  getSavingThrowBonus,
  getSkillBonus,
} from '../utils/rules5e';
import { AbilityKey } from '../types';
import {
  Dices,
  Heart,
  ShieldAlert,
  Swords,
  Plus,
  Trash2,
  Eye,
  Skull,
  Award,
} from 'lucide-react';

export const CoreSheetTab: React.FC = () => {
  const { activeCharacter, updateActiveCharacter, rollCheck } = useCharacter();

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState<
    'Racial Trait' | 'Class Feature' | 'Feat' | 'Custom Action'
  >('Class Feature');
  const [newFeatureSource, setNewFeatureSource] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  const profBonus = getProficiencyBonus(activeCharacter);
  const initiative = getInitiative(activeCharacter);
  const passivePerception = getPassivePerception(activeCharacter);

  const updateAbility = (key: AbilityKey, score: number) => {
    updateActiveCharacter((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [key]: Math.max(1, Math.min(30, score)),
      },
    }));
  };

  const toggleSaveProf = (key: AbilityKey) => {
    updateActiveCharacter((prev) => ({
      ...prev,
      savingThrowProficiencies: {
        ...prev.savingThrowProficiencies,
        [key]: !prev.savingThrowProficiencies[key],
      },
    }));
  };

  const toggleSkill = (skillId: string, field: 'proficient' | 'expertise') => {
    updateActiveCharacter((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => {
        if (s.id !== skillId) return s;
        if (field === 'proficient') {
          const nextProf = !s.proficient;
          return { ...s, proficient: nextProf, expertise: nextProf ? s.expertise : false };
        } else {
          const nextExp = !s.expertise;
          return { ...s, expertise: nextExp, proficient: nextExp ? true : s.proficient };
        }
      }),
    }));
  };

  const addAttack = () => {
    updateActiveCharacter((prev) => ({
      ...prev,
      attacks: [
        ...prev.attacks,
        {
          id: crypto.randomUUID(),
          name: 'New Weapon',
          ability: 'STR',
          proficient: true,
          magicBonus: 0,
          damageDice: '1d8+3',
          damageType: 'Piercing',
        },
      ],
    }));
  };

  const addFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    updateActiveCharacter((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: crypto.randomUUID(),
          name: newFeatureName.trim(),
          category: newFeatureCategory,
          source: newFeatureSource.trim() || 'Character Sheet',
          description: newFeatureDesc.trim(),
        },
      ],
    }));
    setNewFeatureName('');
    setNewFeatureSource('');
    setNewFeatureDesc('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="parchment-card p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                Proficiency
              </span>
              <div className="flex items-center gap-1 mt-1 no-print">
                <span className="text-[10px] text-stone-400">Override:</span>
                <input
                  type="number"
                  placeholder="Auto"
                  value={activeCharacter.proficiencyOverride ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : Number(e.target.value);
                    updateActiveCharacter((prev) => ({ ...prev, proficiencyOverride: val }));
                  }}
                  className="stat-input w-12 text-[11px] py-0.5 text-center"
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-900 text-white font-serif font-bold text-base flex items-center justify-center">
              {formatModifier(profBonus)}
            </div>
          </div>

          <div className="parchment-card p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                Passive Perc.
              </span>
              <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                <Eye className="w-3 h-3" /> 10 + Bonus
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 text-stone-900 font-serif font-bold text-base flex items-center justify-center">
              {passivePerception}
            </div>
          </div>
        </div>

        <div className="parchment-card p-4">
          <h3 className="parchment-header">Ability Scores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ABILITIES.map(({ key, label }) => {
              const score = activeCharacter.abilities[key];
              const mod = getAbilityModifier(score);
              return (
                <div
                  key={key}
                  className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-2.5 flex flex-col items-center text-center"
                >
                  <span className="text-[10px] font-semibold uppercase text-stone-500">
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={() => rollCheck(`${label} Check`, mod)}
                    className="my-1.5 px-2.5 py-0.5 rounded-md bg-stone-900 hover:bg-stone-700 text-white font-serif font-semibold text-base flex items-center gap-1 transition"
                    title={`Roll ${label} Check`}
                  >
                    <span>{formatModifier(mod)}</span>
                    <Dices className="w-3 h-3 opacity-70 no-print" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={score}
                    onChange={(e) => updateAbility(key, Number(e.target.value))}
                    className="stat-input w-14 text-center font-semibold text-xs"
                    aria-label={`${label} score`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="parchment-card p-4">
          <h3 className="parchment-header">Saving Throws</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {ABILITIES.map(({ key, label }) => {
              const bonus = getSavingThrowBonus(activeCharacter, key);
              const isProf = activeCharacter.savingThrowProficiencies[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between bg-stone-50/60 px-2.5 py-1.5 rounded-md border border-stone-200/60"
                >
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                    <input
                      type="checkbox"
                      checked={isProf}
                      onChange={() => toggleSaveProf(key)}
                      className="accent-stone-900 rounded cursor-pointer"
                    />
                    <span>{label}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => rollCheck(`${label} Save`, bonus)}
                    className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-stone-200 text-stone-900 transition"
                  >
                    <span>{formatModifier(bonus)}</span>
                    <Dices className="w-3 h-3 text-stone-400 no-print" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="parchment-card p-4">
          <div className="parchment-header">
            <span>Skills</span>
            <span className="text-[10px] font-sans font-normal text-stone-400">
              Prof · Exp
            </span>
          </div>
          <div className="space-y-1">
            {activeCharacter.skills.map((skill) => {
              const bonus = getSkillBonus(activeCharacter, skill);
              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-stone-50 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      title="Proficient"
                      checked={skill.proficient}
                      onChange={() => toggleSkill(skill.id, 'proficient')}
                      className="accent-stone-900 cursor-pointer"
                    />
                    <input
                      type="checkbox"
                      title="Expertise"
                      checked={skill.expertise}
                      onChange={() => toggleSkill(skill.id, 'expertise')}
                      className="accent-amber-600 cursor-pointer"
                    />
                    <span className="font-medium text-stone-800">{skill.name}</span>
                    <span className="text-[10px] text-stone-400">({skill.ability})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => rollCheck(`${skill.name} (${skill.ability})`, bonus)}
                    className="flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded hover:bg-stone-200 text-stone-900 transition"
                  >
                    <span>{formatModifier(bonus)}</span>
                    <Dices className="w-3 h-3 text-stone-400 no-print" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="parchment-card p-3 flex flex-col items-center text-center">
            <ShieldAlert className="w-4 h-4 text-stone-400 mb-1" />
            <span className="text-[10px] font-semibold uppercase text-stone-500">Armor Class</span>
            <input
              type="number"
              value={activeCharacter.combat.ac}
              onChange={(e) =>
                updateActiveCharacter((prev) => ({
                  ...prev,
                  combat: { ...prev.combat, ac: Number(e.target.value) },
                }))
              }
              className="stat-input w-14 text-center font-serif font-bold text-lg mt-1"
            />
          </div>

          <div className="parchment-card p-3 flex flex-col items-center text-center">
            <span className="text-[10px] font-semibold uppercase text-stone-500 mt-1">Initiative</span>
            <button
              type="button"
              onClick={() => rollCheck('Initiative', initiative)}
              className="my-1 px-3 py-1 rounded-md bg-stone-900 hover:bg-stone-700 text-white font-serif font-bold text-base flex items-center gap-1"
            >
              <span>{formatModifier(initiative)}</span>
              <Dices className="w-3.5 h-3.5 no-print" />
            </button>
            <span className="text-[10px] text-stone-400">DEX</span>
          </div>

          <div className="parchment-card p-3 flex flex-col items-center text-center">
            <span className="text-[10px] font-semibold uppercase text-stone-500 mt-1">Speed</span>
            <input
              type="text"
              value={activeCharacter.combat.speed}
              onChange={(e) =>
                updateActiveCharacter((prev) => ({
                  ...prev,
                  combat: { ...prev.combat, speed: e.target.value },
                }))
              }
              className="stat-input w-16 text-center font-serif font-bold text-sm mt-2"
            />
          </div>
        </div>

        <div className="parchment-card p-4">
          <div className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-600" /> Hit Points
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase text-stone-400 mb-1">
                Current
              </label>
              <input
                type="number"
                value={activeCharacter.combat.hpCurrent}
                onChange={(e) =>
                  updateActiveCharacter((prev) => ({
                    ...prev,
                    combat: { ...prev.combat, hpCurrent: Number(e.target.value) },
                  }))
                }
                className="stat-input w-full text-center font-bold text-lg text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase text-stone-400 mb-1">
                Max
              </label>
              <input
                type="number"
                value={activeCharacter.combat.hpMax}
                onChange={(e) =>
                  updateActiveCharacter((prev) => ({
                    ...prev,
                    combat: { ...prev.combat, hpMax: Number(e.target.value) },
                  }))
                }
                className="stat-input w-full text-center font-bold text-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase text-stone-400 mb-1">
                Temp
              </label>
              <input
                type="number"
                value={activeCharacter.combat.hpTemp}
                onChange={(e) =>
                  updateActiveCharacter((prev) => ({
                    ...prev,
                    combat: { ...prev.combat, hpTemp: Number(e.target.value) },
                  }))
                }
                className="stat-input w-full text-center font-bold text-lg text-sky-700"
              />
            </div>
          </div>

          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden no-print">
            <div
              className="h-full bg-stone-900 transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    (activeCharacter.combat.hpCurrent /
                      Math.max(1, activeCharacter.combat.hpMax)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="parchment-card p-3.5">
            <h4 className="parchment-header">Hit Dice</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Total</span>
                <input
                  type="text"
                  value={activeCharacter.combat.hitDiceTotal}
                  onChange={(e) =>
                    updateActiveCharacter((prev) => ({
                      ...prev,
                      combat: { ...prev.combat, hitDiceTotal: e.target.value },
                    }))
                  }
                  className="stat-input w-full text-xs font-semibold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                  Left
                </span>
                <input
                  type="number"
                  min={0}
                  value={activeCharacter.combat.hitDiceRemaining}
                  onChange={(e) =>
                    updateActiveCharacter((prev) => ({
                      ...prev,
                      combat: { ...prev.combat, hitDiceRemaining: Number(e.target.value) },
                    }))
                  }
                  className="stat-input w-full text-xs font-semibold text-center"
                />
              </div>
            </div>
          </div>

          <div className="parchment-card p-3.5">
            <h4 className="parchment-header">
              <span>Death Saves</span>
              <Skull className="w-3.5 h-3.5 text-stone-400" />
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-600">Successes</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="checkbox"
                      checked={activeCharacter.combat.deathSaves.successes >= idx}
                      onChange={() =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          combat: {
                            ...prev.combat,
                            deathSaves: {
                              ...prev.combat.deathSaves,
                              successes:
                                prev.combat.deathSaves.successes === idx ? idx - 1 : idx,
                            },
                          },
                        }))
                      }
                      className="accent-stone-900 w-3.5 h-3.5 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-600">Failures</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="checkbox"
                      checked={activeCharacter.combat.deathSaves.failures >= idx}
                      onChange={() =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          combat: {
                            ...prev.combat,
                            deathSaves: {
                              ...prev.combat.deathSaves,
                              failures:
                                prev.combat.deathSaves.failures === idx ? idx - 1 : idx,
                            },
                          },
                        }))
                      }
                      className="accent-red-600 w-3.5 h-3.5 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="parchment-card p-4">
          <div className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-stone-500" /> Attacks
            </span>
            <button
              type="button"
              onClick={addAttack}
              className="no-print flex items-center gap-1 text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-stone-900 text-white hover:bg-stone-700"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="space-y-2.5">
            {activeCharacter.attacks.map((atk) => {
              const abilityMod = getAbilityModifier(activeCharacter.abilities[atk.ability]);
              const hitBonus =
                abilityMod + (atk.proficient ? profBonus : 0) + (atk.magicBonus || 0);

              return (
                <div
                  key={atk.id}
                  className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-2.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={atk.name}
                      onChange={(e) =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          attacks: prev.attacks.map((a) =>
                            a.id === atk.id ? { ...a, name: e.target.value } : a
                          ),
                        }))
                      }
                      className="stat-input font-semibold text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        rollCheck(`${atk.name} Attack`, hitBonus, atk.damageDice)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-700 text-white text-xs font-medium shrink-0"
                    >
                      <Dices className="w-3 h-3 no-print" />
                      <span>{formatModifier(hitBonus)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          attacks: prev.attacks.filter((a) => a.id !== atk.id),
                        }))
                      }
                      className="text-stone-400 hover:text-red-600 no-print"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <select
                      value={atk.ability}
                      onChange={(e) =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          attacks: prev.attacks.map((a) =>
                            a.id === atk.id
                              ? { ...a, ability: e.target.value as AbilityKey }
                              : a
                          ),
                        }))
                      }
                      className="stat-input text-xs"
                    >
                      {ABILITIES.map((ab) => (
                        <option key={ab.key} value={ab.key}>
                          {ab.key}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="1d8+3"
                      value={atk.damageDice}
                      onChange={(e) =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          attacks: prev.attacks.map((a) =>
                            a.id === atk.id ? { ...a, damageDice: e.target.value } : a
                          ),
                        }))
                      }
                      className="stat-input text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Slashing"
                      value={atk.damageType}
                      onChange={(e) =>
                        updateActiveCharacter((prev) => ({
                          ...prev,
                          attacks: prev.attacks.map((a) =>
                            a.id === atk.id ? { ...a, damageType: e.target.value } : a
                          ),
                        }))
                      }
                      className="stat-input text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-5">
        <div className="parchment-card p-4">
          <h3 className="parchment-header">Proficiencies & Languages</h3>
          <div className="space-y-2.5 text-xs">
            {(
              [
                { key: 'armor', label: 'Armor' },
                { key: 'weapons', label: 'Weapons' },
                { key: 'tools', label: 'Tools' },
                { key: 'languages', label: 'Languages' },
              ] as const
            ).map((item) => (
              <div key={item.key}>
                <label className="block font-semibold uppercase text-[10px] text-stone-400 mb-0.5">
                  {item.label}
                </label>
                <textarea
                  rows={2}
                  value={activeCharacter.proficienciesAndLanguages[item.key]}
                  onChange={(e) =>
                    updateActiveCharacter((prev) => ({
                      ...prev,
                      proficienciesAndLanguages: {
                        ...prev.proficienciesAndLanguages,
                        [item.key]: e.target.value,
                      },
                    }))
                  }
                  className="stat-input w-full text-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="parchment-card p-4">
          <h3 className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-stone-500" /> Features & Traits
            </span>
          </h3>

          <div className="space-y-2.5 mb-4">
            {activeCharacter.features.map((feat) => (
              <div
                key={feat.id}
                className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-3 relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    updateActiveCharacter((prev) => ({
                      ...prev,
                      features: prev.features.filter((f) => f.id !== feat.id),
                    }))
                  }
                  className="absolute top-2.5 right-2.5 text-stone-400 hover:text-red-600 no-print"
                  title="Remove Feature"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2 mb-0.5 pr-6">
                  <span className="font-serif font-semibold text-xs text-stone-900">
                    {feat.name}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                    {feat.category}
                  </span>
                </div>
                <span className="block text-[10px] text-stone-400 mb-1">
                  {feat.source}
                </span>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={addFeature}
            className="no-print bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2"
          >
            <span className="text-[10px] font-semibold uppercase text-stone-500 block">
              New Feature
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                className="stat-input text-xs"
              />
              <select
                value={newFeatureCategory}
                onChange={(e) => setNewFeatureCategory(e.target.value as any)}
                className="stat-input text-xs"
              >
                <option value="Class Feature">Class Feature</option>
                <option value="Racial Trait">Racial Trait</option>
                <option value="Feat">Feat</option>
                <option value="Custom Action">Custom Action</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Source (e.g., Wizard Lvl 2)"
              value={newFeatureSource}
              onChange={(e) => setNewFeatureSource(e.target.value)}
              className="stat-input w-full text-xs"
            />
            <textarea
              rows={2}
              placeholder="Description..."
              value={newFeatureDesc}
              onChange={(e) => setNewFeatureDesc(e.target.value)}
              className="stat-input w-full text-xs resize-none"
            />
            <button
              type="submit"
              className="w-full py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition"
            >
              + Add Feature
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
