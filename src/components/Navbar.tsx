import React, { useRef, useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Shield, Plus, Copy, Trash2, Download, Upload, Users, FileDown, X, Moon, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { characters, activeCharacter, setActiveCharacterId, createCharacter, duplicateCharacter, deleteCharacter, exportDatabaseJson, importDatabaseJson, saveCharacterPdf } = useCharacter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <>
      <header className="bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-wider leading-none">5E SHEET</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button onClick={toggleDark} className="p-1.5 mr-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition" title="Toggle Dark Mode">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1">
              <Users className="w-3.5 h-3.5 text-stone-500 mr-2 shrink-0" />
              <select aria-label="Select Character" value={activeCharacter.id} onChange={(e) => setActiveCharacterId(e.target.value)} className="bg-transparent text-xs font-medium focus:outline-none pr-3 cursor-pointer">
                {characters.map((c) => (<option key={c.id} value={c.id} className="dark:bg-stone-900">{c.name}</option>))}
              </select>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium transition"><Plus className="w-3.5 h-3.5" /><span>New</span></button>
            <button onClick={() => duplicateCharacter(activeCharacter.id)} className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 transition" title="Duplicate Character"><Copy className="w-3.5 h-3.5" /></button>
            <button onClick={() => deleteCharacter(activeCharacter.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-stone-500 hover:text-red-600 border border-stone-200 dark:border-stone-700 transition" title="Delete Character"><Trash2 className="w-3.5 h-3.5" /></button>
            <button onClick={saveCharacterPdf} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-medium transition" title="Save PDF"><FileDown className="w-3.5 h-3.5" /><span>Save PDF</span></button>
            <button onClick={exportDatabaseJson} className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 transition" title="Export Backup"><Download className="w-3.5 h-3.5" /></button>
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 transition" title="Import Backup"><Upload className="w-3.5 h-3.5" /></button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importDatabaseJson(f); e.target.value = ""; }} />
          </div>
        </div>
      </header>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="parchment-card max-w-md w-full p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-stone-400"><X className="w-4 h-4" /></button>
            <h2 className="parchment-header">Create Character</h2>
            <form onSubmit={(e) => { e.preventDefault(); if (newName.trim()) { createCharacter(newName.trim(), "Fighter", "Human"); setNewName(""); setShowModal(false); } }} className="space-y-4 mt-4">
              <input type="text" required placeholder="Character Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="stat-input w-full" />
              <button type="submit" className="w-full py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium">Create</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};