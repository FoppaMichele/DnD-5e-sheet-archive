import React, { createContext, useContext, useState, useEffect } from 'react';
import { Character, RollLog, HomebrewItem } from '../types';
import { createDefaultCharacter } from '../utils/rules5e';

interface CharacterContextType {
  characters: Character[];
  activeCharacter: Character;
  homebrewCompendium: HomebrewItem[];
  setActiveCharacterId: (id: string) => void;
  updateActiveCharacter: (updater: (prev: Character) => Character) => void;
  createCharacter: (name: string, className: string, race: string) => void;
  duplicateCharacter: (id: string) => void;
  deleteCharacter: (id: string) => void;
  addHomebrewItem: (item: HomebrewItem) => void;
  deleteHomebrewItem: (id: string) => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (file: File) => void;
  saveCharacterPdf: () => void;
  rollLogs: RollLog[];
  rollCheck: (label: string, modifier: number, damageFormula?: string) => void;
  clearRolls: () => void;
}

const STORAGE_KEY = 'dnd5e_character_forge_v1';
const HOMEBREW_KEY = 'dnd5e_homebrew_v1';

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [createDefaultCharacter()];
  });

  const [homebrewCompendium, setHomebrewCompendium] = useState<HomebrewItem[]>(() => {
    try {
      const saved = localStorage.getItem(HOMEBREW_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [activeId, setActiveId] = useState<string>(() => characters[0]?.id || '');
  const [rollLogs, setRollLogs] = useState<RollLog[]>([]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(characters)); }, [characters]);
  useEffect(() => { localStorage.setItem(HOMEBREW_KEY, JSON.stringify(homebrewCompendium)); }, [homebrewCompendium]);

  const activeCharacter = characters.find((c) => c.id === activeId) || characters[0];

  const updateActiveCharacter = (updater: (prev: Character) => Character) => {
    setCharacters((prev) => prev.map((char) => (char.id === activeCharacter.id ? updater(char) : char)));
  };

  const createCharacter = (name: string, className: string, race: string) => {
    const newChar = createDefaultCharacter(name);
    newChar.className = className;
    newChar.race = race;
    setCharacters((prev) => [...prev, newChar]);
    setActiveId(newChar.id);
  };

  const duplicateCharacter = (id: string) => {
    const target = characters.find((c) => c.id === id);
    if (!target) return;
    setCharacters((prev) => [...prev, { ...structuredClone(target), id: crypto.randomUUID(), name: target.name + ' (Copy)' }]);
  };

  const deleteCharacter = (id: string) => {
    if (characters.length <= 1) { alert('You must keep at least one character sheet.'); return; }
    const filtered = characters.filter((c) => c.id !== id);
    setCharacters(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  };

  const addHomebrewItem = (item: HomebrewItem) => setHomebrewCompendium((prev) => [...prev, item]);
  const deleteHomebrewItem = (id: string) => setHomebrewCompendium((prev) => prev.filter((i) => i.id !== id));

  const exportDatabaseJson = () => {
    const dataStr = JSON.stringify({ characters, homebrewCompendium }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dnd5e-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.characters && Array.isArray(parsed.characters)) {
          setCharacters(parsed.characters);
          setHomebrewCompendium(parsed.homebrewCompendium || []);
          setActiveId(parsed.characters[0].id);
        } else if (Array.isArray(parsed)) {
          setCharacters(parsed);
          setActiveId(parsed[0].id);
        } else { alert('Invalid backup file format.'); }
      } catch { alert('Error parsing file.'); }
    };
    reader.readAsText(file);
  };

  const saveCharacterPdf = () => {
    const originalTitle = document.title;
    document.title = activeCharacter.name + ' - 5e Sheet';
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 500);
  };

  const rollCheck = (label: string, modifier: number, damageFormula?: string) => {
    const d20Raw = Math.floor(Math.random() * 20) + 1;
    setRollLogs((prev) => [
      { id: crypto.randomUUID(), timestamp: new Date().toLocaleTimeString(), characterName: activeCharacter.name, label, d20Raw, modifier, total: d20Raw + modifier, damageResult: damageFormula },
      ...prev.slice(0, 19),
    ]);
  };

  return (
    <CharacterContext.Provider value={{
      characters,
      activeCharacter,
      homebrewCompendium,
      setActiveCharacterId: setActiveId,
      updateActiveCharacter,
      createCharacter,
      duplicateCharacter,
      deleteCharacter,
      addHomebrewItem,
      deleteHomebrewItem,
      exportDatabaseJson,
      importDatabaseJson,
      saveCharacterPdf,
      rollLogs,
      rollCheck,
      clearRolls: () => setRollLogs([]),
    }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) throw new Error('useCharacter must be used within a CharacterProvider');
  return context;
};