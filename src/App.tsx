import React, { useState } from 'react';
import { CharacterProvider } from './context/CharacterContext';
import { Navbar } from './components/Navbar';
import { CharacterHeader } from './components/CharacterHeader';
import { CoreSheetTab } from './components/CoreSheetTab';
import { SpellbookTab } from './components/SpellbookTab';
import { InventoryTab } from './components/InventoryTab';
import { JournalTab } from './components/JournalTab';
import { HomebrewTab } from './components/HomebrewTab';
import { DiceTray } from './components/DiceTray';
import { Shield, Sparkles, Backpack, ScrollText, Beaker } from 'lucide-react';

type ActiveTab = 'core' | 'spells' | 'inventory' | 'journal' | 'homebrew';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('core');

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'core', label: 'Core Sheet', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'spells', label: 'Spells', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Backpack className="w-3.5 h-3.5" /> },
    { id: 'journal', label: 'Journal', icon: <ScrollText className="w-3.5 h-3.5" /> },
    { id: 'homebrew', label: 'Homebrew', icon: <Beaker className="w-3.5 h-3.5" /> },
  ];

  return (
    <CharacterProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          <CharacterHeader />
          <nav className="flex flex-wrap gap-1.5 mb-5 border-b border-stone-200 dark:border-stone-800 pb-3 no-print">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={"flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs transition " + (
                  activeTab === t.id
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                    : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700"
                )}
              >
                {t.icon}<span>{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-6">
            <div className={activeTab === 'core' ? 'block' : 'hidden print:block'}><CoreSheetTab /></div>
            <div className={activeTab === 'spells' ? 'block' : 'hidden print:block'}><SpellbookTab /></div>
            <div className={activeTab === 'inventory' ? 'block' : 'hidden print:block'}><InventoryTab /></div>
            <div className={activeTab === 'journal' ? 'block' : 'hidden'}><JournalTab /></div>
            <div className={activeTab === 'homebrew' ? 'block' : 'hidden'}><HomebrewTab /></div>
          </div>
        </main>
        <DiceTray />
      </div>
    </CharacterProvider>
  );
};
export default App;