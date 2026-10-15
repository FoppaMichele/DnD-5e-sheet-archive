import React, { createContext, useContext, useState, useEffect } from 'react';
import { Character, RollLog } from '../types';
import { createDefaultCharacter } from '../utils/rules5e';

interface CharacterContextType {
  characters: Character[];
  activeCharacter: Character;
  setActiveCharacterId: (id: string) => void;
  updateActiveCharacter: (updater: (prev: Character) => Character) => void;
  createCharacter: (name: string, className: string, race: string) => void;
  duplicateCharacter: (id: string) => void;
  deleteCharacter: (id: string) => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (file: File) => void;
  saveCharacterPdf: () => void;
  rollLogs: RollLog[];
  rollCheck: (label: string, modifier: number, damageFormula?: string) => void;
  clearRolls: () => void;
}

const STORAGE_KEY = 'dnd5e_character_forge_v1';

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load characters from localStorage:', e);
    }
    return [createDefaultCharacter()];
  });

  const [activeId, setActiveId] = useState<string>(() => characters[0]?.id || '');
  const [rollLogs, setRollLogs] = useState<RollLog[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (e) {
      console.error('Failed to save characters to localStorage:', e);
    }
  }, [characters]);

  const activeCharacter = characters.find((c) => c.id === activeId) || characters[0];

  const updateActiveCharacter = (updater: (prev: Character) => Character) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === activeCharacter.id ? updater(char) : char))
    );
  };

  const createCharacter = (name: string, className: string, race: string) => {
    const newChar = createDefaultCharacter(name || 'New Adventurer');
    newChar.className = className || 'Fighter';
    newChar.race = race || 'Human';
    newChar.level = 1;
    newChar.xp = 0;
    setCharacters((prev) => [...prev, newChar]);
    setActiveId(newChar.id);
  };

  const duplicateCharacter = (id: string) => {
    const target = characters.find((c) => c.id === id);
    if (!target) return;
    const copy: Character = {
      ...structuredClone(target),
      id: crypto.randomUUID(),
      name: `${target.name} (Copy)`,
    };
    setCharacters((prev) => [...prev, copy]);
    setActiveId(copy.id);
  };

  const deleteCharacter = (id: string) => {
    if (characters.length <= 1) {
      alert('You must keep at least one character sheet.');
      return;
    }
    const filtered = characters.filter((c) => c.id !== id);
    setCharacters(filtered);
    if (activeId === id) {
      setActiveId(filtered[0].id);
    }
  };

  const exportDatabaseJson = () => {
    const dataStr = JSON.stringify(characters, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dnd5e-roster-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].abilities) {
          setCharacters(parsed);
          setActiveId(parsed[0].id);
        } else if (parsed && parsed.abilities) {
          const importedChar = { ...parsed, id: crypto.randomUUID() };
          setCharacters((prev) => [...prev, importedChar]);
          setActiveId(importedChar.id);
        } else {
          alert('Invalid D&D 5e JSON file format.');
        }
      } catch {
        alert('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const saveCharacterPdf = () => {
    const originalTitle = document.title;
    document.title = `${activeCharacter.name} - Lvl ${activeCharacter.level} ${activeCharacter.className}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  const evaluateSimpleDice = (formula: string): string => {
    const match = formula.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!match) return formula;
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const mod = match[3] ? parseInt(match[3], 10) : 0;
    let sum = 0;
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      sum += r;
    }
    const total = sum + mod;
    return `${total} [${rolls.join('+')}${mod !== 0 ? (mod > 0 ? `+${mod}` : mod) : ''}]`;
  };

  const rollCheck = (label: string, modifier: number, damageFormula?: string) => {
    const d20Raw = Math.floor(Math.random() * 20) + 1;
    const total = d20Raw + modifier;
    const damageResult = damageFormula ? evaluateSimpleDice(damageFormula) : undefined;

    const newRoll: RollLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      characterName: activeCharacter.name,
      label,
      d20Raw,
      modifier,
      total,
      damageResult,
    };

    setRollLogs((prev) => [newRoll, ...prev.slice(0, 19)]);
  };

  const clearRolls = () => setRollLogs([]);

  return (
    <CharacterContext.Provider
      value={{
        characters,
        activeCharacter,
        setActiveCharacterId: setActiveId,
        updateActiveCharacter,
        createCharacter,
        duplicateCharacter,
        deleteCharacter,
        exportDatabaseJson,
        importDatabaseJson,
        saveCharacterPdf,
        rollLogs,
        rollCheck,
        clearRolls,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) throw new Error('useCharacter must be used within a CharacterProvider');
  return context;
};
