import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Compass, MapPin, Plus, ScrollText, Search, Trash2, Users } from 'lucide-react';

export const JournalTab: React.FC = () => {
  const { activeCharacter, updateActiveCharacter } = useCharacter();

  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [npcs, setNpcs] = useState('');
  const [quests, setQuests] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateActiveCharacter((prev) => ({
      ...prev,
      journal: [
        {
          id: crypto.randomUUID(),
          date,
          title: title.trim(),
          location: location.trim() || 'Unknown Realm',
          npcs: npcs.trim(),
          quests: quests.trim(),
          notes: notes.trim(),
        },
        ...prev.journal,
      ],
    }));
    setTitle('');
    setLocation('');
    setNpcs('');
    setQuests('');
    setNotes('');
  };

  const filteredEntries = activeCharacter.journal.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.location.toLowerCase().includes(q) ||
      entry.npcs.toLowerCase().includes(q) ||
      entry.quests.toLowerCase().includes(q) ||
      entry.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-4 parchment-card p-4 no-print">
        <h3 className="parchment-header">
          <span className="flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5 text-stone-500" /> New Session Entry
          </span>
        </h3>

        <form onSubmit={handleAddEntry} className="space-y-2.5 text-xs">
          <input
            type="text"
            required
            placeholder="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="stat-input w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="stat-input w-full"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="stat-input w-full"
            />
          </div>

          <input
            type="text"
            placeholder="Key NPCs Encountered"
            value={npcs}
            onChange={(e) => setNpcs(e.target.value)}
            className="stat-input w-full"
          />

          <input
            type="text"
            placeholder="Active Quests"
            value={quests}
            onChange={(e) => setQuests(e.target.value)}
            className="stat-input w-full"
          />

          <textarea
            rows={5}
            required
            placeholder="Session notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="stat-input w-full resize-none"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Save Entry
          </button>
        </form>
      </div>

      <div className="lg:col-span-8 space-y-4">
        <div className="parchment-card p-3 flex items-center gap-2 no-print">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Filter session logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full text-xs focus:outline-none text-stone-900"
          />
        </div>

        {filteredEntries.length === 0 ? (
          <div className="parchment-card p-8 text-center text-stone-400 text-xs">
            No matching session logs found.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <article key={entry.id} className="parchment-card p-5 relative">
              <button
                type="button"
                onClick={() =>
                  updateActiveCharacter((prev) => ({
                    ...prev,
                    journal: prev.journal.filter((j) => j.id !== entry.id),
                  }))
                }
                className="absolute top-4 right-4 text-stone-400 hover:text-red-600 no-print"
                title="Delete Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 font-medium mb-1">
                <span className="px-2 py-0.5 rounded bg-stone-100">{entry.date}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {entry.location}
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
                {entry.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                {entry.npcs && (
                  <div className="bg-stone-50 p-2 rounded border border-stone-200/70 flex items-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[10px] uppercase text-stone-400">
                        NPCs
                      </strong>
                      <span>{entry.npcs}</span>
                    </div>
                  </div>
                )}
                {entry.quests && (
                  <div className="bg-stone-50 p-2 rounded border border-stone-200/70 flex items-start gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[10px] uppercase text-stone-400">
                        Quests
                      </strong>
                      <span>{entry.quests}</span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {entry.notes}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
