import { AbilityKey, Character, SkillConfig } from '../types';

export const ABILITIES: { key: AbilityKey; label: string }[] = [
  { key: 'STR', label: 'Strength' },
  { key: 'DEX', label: 'Dexterity' },
  { key: 'CON', label: 'Constitution' },
  { key: 'INT', label: 'Intelligence' },
  { key: 'WIS', label: 'Wisdom' },
  { key: 'CHA', label: 'Charisma' },
];

export const DEFAULT_SKILLS: Omit<SkillConfig, 'proficient' | 'expertise'>[] = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'DEX' },
  { id: 'animal_handling', name: 'Animal Handling', ability: 'WIS' },
  { id: 'arcana', name: 'Arcana', ability: 'INT' },
  { id: 'athletics', name: 'Athletics', ability: 'STR' },
  { id: 'deception', name: 'Deception', ability: 'CHA' },
  { id: 'history', name: 'History', ability: 'INT' },
  { id: 'insight', name: 'Insight', ability: 'WIS' },
  { id: 'intimidation', name: 'Intimidation', ability: 'CHA' },
  { id: 'investigation', name: 'Investigation', ability: 'INT' },
  { id: 'medicine', name: 'Medicine', ability: 'WIS' },
  { id: 'nature', name: 'Nature', ability: 'INT' },
  { id: 'perception', name: 'Perception', ability: 'WIS' },
  { id: 'performance', name: 'Performance', ability: 'CHA' },
  { id: 'persuasion', name: 'Persuasion', ability: 'CHA' },
  { id: 'religion', name: 'Religion', ability: 'INT' },
  { id: 'sleight_of_hand', name: 'Sleight of Hand', ability: 'DEX' },
  { id: 'stealth', name: 'Stealth', ability: 'DEX' },
  { id: 'survival', name: 'Survival', ability: 'WIS' },
];

export const SPELL_PRESETS = [
  {
    name: 'Fire Bolt',
    level: 0,
    school: 'Evocation',
    castingTime: '1 Action',
    range: '120 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'Make a ranged spell attack. On a hit, the target takes 1d10 fire damage.',
  },
  {
    name: 'Mage Hand',
    level: 0,
    school: 'Conjuration',
    castingTime: '1 Action',
    range: '30 feet',
    components: 'V, S',
    duration: '1 minute',
    description: 'A spectral, floating hand appears at a point you choose within range.',
  },
  {
    name: 'Shield',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 Reaction',
    range: 'Self',
    components: 'V, S',
    duration: '1 round',
    description: 'An invisible barrier of magical force appears and protects you (+5 AC until start of next turn).',
  },
  {
    name: 'Magic Missile',
    level: 1,
    school: 'Evocation',
    castingTime: '1 Action',
    range: '120 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'Create three glowing darts of magical force. Each dart hits a creature and deals 1d4 + 1 force damage.',
  },
  {
    name: 'Misty Step',
    level: 2,
    school: 'Conjuration',
    castingTime: '1 Bonus Action',
    range: 'Self',
    components: 'V',
    duration: 'Instantaneous',
    description: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.',
  },
  {
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
    castingTime: '1 Action',
    range: '150 feet',
    components: 'V, S, M',
    duration: 'Instantaneous',
    description: 'A bright streak flashes from your pointing finger to a point you choose and blossoms into an explosion of flame (8d6 fire damage, DEX save for half).',
  },
];

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(character: Character): number {
  if (character.proficiencyOverride !== null && character.proficiencyOverride > 0) {
    return character.proficiencyOverride;
  }
  const lvl = Math.max(1, character.level || 1);
  return Math.floor((lvl - 1) / 4) + 2;
}

export function getSavingThrowBonus(character: Character, ability: AbilityKey): number {
  const mod = getAbilityModifier(character.abilities[ability]);
  const prof = character.savingThrowProficiencies[ability] ? getProficiencyBonus(character) : 0;
  return mod + prof;
}

export function getSkillBonus(character: Character, skill: SkillConfig): number {
  const mod = getAbilityModifier(character.abilities[skill.ability]);
  const profBonus = getProficiencyBonus(character);
  const prof = skill.proficient ? profBonus : 0;
  const exp = skill.expertise ? profBonus : 0;
  return mod + prof + exp;
}

export function getPassivePerception(character: Character): number {
  const perceptionSkill = character.skills.find((s) => s.id === 'perception');
  if (!perceptionSkill) {
    return 10 + getAbilityModifier(character.abilities.WIS);
  }
  return 10 + getSkillBonus(character, perceptionSkill);
}

export function getInitiative(character: Character): number {
  return getAbilityModifier(character.abilities.DEX) + (character.combat.initiativeBonus || 0);
}

export function getSpellSaveDC(character: Character): number {
  const mod = getAbilityModifier(character.abilities[character.spellcasting.ability]);
  return 8 + getProficiencyBonus(character) + mod;
}

export function getSpellAttackBonus(character: Character): number {
  const mod = getAbilityModifier(character.abilities[character.spellcasting.ability]);
  return getProficiencyBonus(character) + mod;
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function createDefaultCharacter(name = 'Theren Moonwhisper'): Character {
  return {
    id: crypto.randomUUID(),
    name,
    className: 'Evocation Wizard',
    level: 5,
    background: 'Sage',
    playerName: 'Player One',
    race: 'High Elf',
    alignment: 'Neutral Good',
    xp: 6500,
    inspiration: true,
    proficiencyOverride: null,
    abilities: {
      STR: 8,
      DEX: 16,
      CON: 14,
      INT: 18,
      WIS: 12,
      CHA: 10,
    },
    savingThrowProficiencies: {
      STR: false,
      DEX: false,
      CON: false,
      INT: true,
      WIS: true,
      CHA: false,
    },
    skills: DEFAULT_SKILLS.map((s) => ({
      ...s,
      proficient: ['arcana', 'history', 'investigation', 'perception'].includes(s.id),
      expertise: s.id === 'arcana',
    })),
    combat: {
      ac: 16,
      speed: '30 ft',
      initiativeBonus: 0,
      hpCurrent: 32,
      hpMax: 32,
      hpTemp: 0,
      hitDiceTotal: '5d6',
      hitDiceRemaining: 5,
      deathSaves: {
        successes: 0,
        failures: 0,
      },
    },
    attacks: [
      {
        id: crypto.randomUUID(),
        name: 'Elven Longsword',
        ability: 'DEX',
        proficient: true,
        magicBonus: 1,
        damageDice: '1d8+4',
        damageType: 'Slashing',
      },
      {
        id: crypto.randomUUID(),
        name: 'Fire Bolt (Cantrip)',
        ability: 'INT',
        proficient: true,
        magicBonus: 0,
        damageDice: '2d10',
        damageType: 'Fire',
      },
    ],
    proficienciesAndLanguages: {
      armor: 'None (Mage Armor active)',
      weapons: 'Longswords, Shortswords, Shortbows, Longbows, Daggers, Quarterstaffs',
      tools: 'Alchemist’s Supplies',
      languages: 'Common, Elvish, Draconic, Celestial, Deep Speech',
    },
    currency: {
      cp: 45,
      sp: 120,
      ep: 0,
      gp: 385,
      pp: 12,
    },
    inventory: [
      {
        id: crypto.randomUUID(),
        name: 'Arcane Grimoire (+1)',
        quantity: 1,
        weight: 3,
        equipped: true,
        notes: '+1 to Wizard spell attack rolls and save DCs',
      },
      {
        id: crypto.randomUUID(),
        name: 'Component Pouch',
        quantity: 1,
        weight: 2,
        equipped: true,
        notes: 'Contains bat guano, ruby dust, and feathers',
      },
      {
        id: crypto.randomUUID(),
        name: 'Potion of Greater Healing',
        quantity: 2,
        weight: 0.5,
        equipped: false,
        notes: 'Restores 4d4 + 4 HP',
      },
    ],
    spellcasting: {
      ability: 'INT',
      slots: {
        1: { max: 4, used: 1 },
        2: { max: 3, used: 1 },
        3: { max: 2, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
      },
      spells: SPELL_PRESETS.map((sp) => ({
        ...sp,
        id: crypto.randomUUID(),
        prepared: true,
      })),
    },
    features: [
      {
        id: crypto.randomUUID(),
        name: 'Sculpt Spells',
        category: 'Class Feature',
        source: 'School of Evocation (Lvl 2)',
        description: 'Create pockets of relative safety within the effects of your evocation spells. Chosen creatures automatically succeed on their saving throws and take no damage.',
      },
      {
        id: crypto.randomUUID(),
        name: 'Arcane Recovery',
        category: 'Class Feature',
        source: 'Wizard (Lvl 1)',
        description: 'Once per day when you finish a short rest, you can choose expended spell slots to recover with a combined level equal to or less than half your wizard level (rounded up).',
      },
      {
        id: crypto.randomUUID(),
        name: 'Fey Ancestry',
        category: 'Racial Trait',
        source: 'High Elf',
        description: 'You have advantage on saving throws against being charmed, and magic cannot put you to sleep.',
      },
    ],
    journal: [
      {
        id: crypto.randomUUID(),
        date: '2026-10-14',
        title: 'The Sunken Citadel of Oakhurst',
        location: 'Sunless Citadel, Sword Coast',
        npcs: 'Meepo the Kobold Keeper, Belak the Outcast',
        quests: 'Recover the Golden Apple of the Gulthias Tree; Rescue Sir Braford.',
        notes: 'We descended into the ravine using knotted hemp ropes. Negotiated safe passage with the kobold clan in exchange for retrieving their lost white dragon wyrmling, Calcryx.',
      },
    ],
  };
}
