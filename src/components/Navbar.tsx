import React, { useRef, useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import {
  Shield,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Users,
  FileDown,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    characters,
    activeCharacter,
    setActiveCharacterId,
    createCharacter,
    duplicateCharacter,
    deleteCharacter,
    exportDatabaseJson,
    importDatabaseJson,
    saveCharacterPdf,
  } = useCharacter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('Paladin');
  const [newRace, setNewRace] = useState('Dragonborn');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createCharacter(newName.trim(), newClass.trim(), newRace.trim());
    setNewName('');
    setShowModal(false);
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 text-stone-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-stone-900 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-wider text-stone-900 leading-none">
                5E SHEET
              </h1>
              <span className="text-[11px] text-stone-500">
                Minimalist Fifth Edition Manager
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1">
              <Users className="w-3.5 h-3.5 text-stone-500 mr-2 shrink-0" />
              <select
                aria-label="Select Active Character"
                value={activeCharacter.id}
                onChange={(e) => setActiveCharacterId(e.target.value)}
                className="bg-transparent text-xs font-medium text-stone-900 focus:outline-none pr-3 cursor-pointer"
              >
                {characters.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white text-stone-900">
                    {c.name} · Lvl {c.level} {c.className}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition"
              title="Create New Character"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            <button
              onClick={() => duplicateCharacter(activeCharacter.id)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 border border-stone-200 transition"
              title="Duplicate Active Character"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => deleteCharacter(activeCharacter.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200 transition"
              title="Delete Active Character"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

            <button
              onClick={saveCharacterPdf}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-medium transition shadow-sm"
              title="Save Complete Sheet as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Save PDF</span>
            </button>

            <button
              onClick={exportDatabaseJson}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition"
              title="Export Roster JSON Backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition"
              title="Import Roster JSON Backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importDatabaseJson(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="parchment-card max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="parchment-header">Create Character</h2>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vex'ahlia"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="stat-input w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                    Race / Species
                  </label>
                  <input
                    type="text"
                    value={newRace}
                    onChange={(e) => setNewRace(e.target.value)}
                    className="stat-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600 mb-1">
                    Class & Subclass
                  </label>
                  <input
                    type="text"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="stat-input w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium"
                >
                  Create Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
