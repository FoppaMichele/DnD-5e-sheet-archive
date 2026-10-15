export type AbilityKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface SkillConfig {
  id: string;
  name: string;
  ability: AbilityKey;
  proficient: boolean;
  expertise: boolean;
}

export interface AttackItem {
  id: string;
  name: string;
  ability: AbilityKey;
  proficient: boolean;
  magicBonus: number;
  damageDice: string;
  damageType: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  equipped: boolean;
  notes: string;
}

export interface SpellSlotLevel {
  max: number;
  used: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  prepared: boolean;
  description: string;
}

export interface FeatureTrait {
  id: string;
  name: string;
  category: 'Racial Trait' | 'Class Feature' | 'Feat' | 'Custom Action';
  source: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  location: string;
  npcs: string;
  quests: string;
  notes: string;
}

export interface Character {
  id: string;
  name: string;
  className: string;
  level: number;
  background: string;
  playerName: string;
  race: string;
  alignment: string;
  xp: number;
  inspiration: boolean;
  proficiencyOverride: number | null;

  abilities: Record<AbilityKey, number>;
  savingThrowProficiencies: Record<AbilityKey, boolean>;
  skills: SkillConfig[];

  combat: {
    ac: number;
    speed: string;
    initiativeBonus: number;
    hpCurrent: number;
    hpMax: number;
    hpTemp: number;
    hitDiceTotal: string;
    hitDiceRemaining: number;
    deathSaves: {
      successes: number;
      failures: number;
    };
  };

  attacks: AttackItem[];

  proficienciesAndLanguages: {
    armor: string;
    weapons: string;
    tools: string;
    languages: string;
  };

  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };

  inventory: InventoryItem[];

  spellcasting: {
    ability: AbilityKey;
    slots: Record<number, SpellSlotLevel>;
    spells: Spell[];
  };

  features: FeatureTrait[];
  journal: JournalEntry[];
}

export interface RollLog {
  id: string;
  timestamp: string;
  characterName: string;
  label: string;
  d20Raw: number;
  modifier: number;
  total: number;
  damageResult?: string;
}
