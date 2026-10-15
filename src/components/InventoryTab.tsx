import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Backpack, Coins, Plus, Scale, Trash2 } from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { activeCharacter, updateActiveCharacter } = useCharacter();

  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemWeight, setItemWeight] = useState(1);
  const [itemNotes, setItemNotes] = useState('');

  const totalWeight = activeCharacter.inventory.reduce(
    (sum, item) => sum + item.quantity * item.weight,
    0
  );
  const carryingCapacity = activeCharacter.abilities.STR * 15;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    updateActiveCharacter((prev) => ({
      ...prev,
      inventory: [
        ...prev.inventory,
        {
          id: crypto.randomUUID(),
          name: itemName.trim(),
          quantity: Math.max(1, itemQty),
          weight: Math.max(0, itemWeight),
          equipped: false,
          notes: itemNotes.trim(),
        },
      ],
    }));
    setItemName('');
    setItemQty(1);
    setItemWeight(1);
    setItemNotes('');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 parchment-card p-4">
          <h3 className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-stone-500" /> Currency
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(
              [
                { key: 'cp', label: 'CP' },
                { key: 'sp', label: 'SP' },
                { key: 'ep', label: 'EP' },
                { key: 'gp', label: 'GP' },
                { key: 'pp', label: 'PP' },
              ] as const
            ).map((coin) => (
              <div
                key={coin.key}
                className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-2.5 text-center"
              >
                <span className="text-[10px] font-semibold uppercase block text-stone-400">
                  {coin.label}
                </span>
                <input
                  type="number"
                  min={0}
                  value={activeCharacter.currency[coin.key]}
                  onChange={(e) =>
                    updateActiveCharacter((prev) => ({
                      ...prev,
                      currency: {
                        ...prev.currency,
                        [coin.key]: Math.max(0, Number(e.target.value)),
                      },
                    }))
                  }
                  className="stat-input w-full text-center font-serif font-bold text-base mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 parchment-card p-4 flex flex-col justify-between">
          <h3 className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-stone-500" /> Encumbrance
            </span>
          </h3>
          <div className="text-center my-1">
            <span className="font-serif font-bold text-xl text-stone-900">
              {totalWeight.toFixed(1)}
            </span>
            <span className="text-xs text-stone-400"> / {carryingCapacity} lbs</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden no-print">
            <div
              className={`h-full transition-all ${
                totalWeight > carryingCapacity ? 'bg-red-600' : 'bg-stone-900'
              }`}
              style={{
                width: `${Math.min(100, (totalWeight / Math.max(1, carryingCapacity)) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-stone-400 text-center mt-2">
            Capacity = STR ({activeCharacter.abilities.STR}) × 15 lbs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4 parchment-card p-4 no-print">
          <h3 className="parchment-header">Add Item</h3>
          <form onSubmit={handleAddItem} className="space-y-2.5 text-xs">
            <input
              type="text"
              required
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="stat-input w-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={1}
                placeholder="Qty"
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value))}
                className="stat-input w-full"
              />
              <input
                type="number"
                step="0.1"
                min={0}
                placeholder="Weight (lb)"
                value={itemWeight}
                onChange={(e) => setItemWeight(Number(e.target.value))}
                className="stat-input w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Notes / Properties"
              value={itemNotes}
              onChange={(e) => setItemNotes(e.target.value)}
              className="stat-input w-full"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Equipment
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 print:col-span-12 parchment-card p-4">
          <h3 className="parchment-header">
            <span className="flex items-center gap-1.5">
              <Backpack className="w-3.5 h-3.5 text-stone-500" /> Equipment List
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] uppercase text-stone-400">
                  <th className="py-2 px-2">Eqp</th>
                  <th className="py-2 px-2">Item</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-center">Weight</th>
                  <th className="py-2 px-2">Notes</th>
                  <th className="py-2 px-2 text-right no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeCharacter.inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="py-2 px-2">
                      <input
                        type="checkbox"
                        checked={item.equipped}
                        onChange={() =>
                          updateActiveCharacter((prev) => ({
                            ...prev,
                            inventory: prev.inventory.map((i) =>
                              i.id === item.id ? { ...i, equipped: !i.equipped } : i
                            ),
                          }))
                        }
                        className="accent-stone-900 cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-2 font-medium text-stone-900">{item.name}</td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          updateActiveCharacter((prev) => ({
                            ...prev,
                            inventory: prev.inventory.map((i) =>
                              i.id === item.id ? { ...i, quantity: Number(e.target.value) } : i
                            ),
                          }))
                        }
                        className="stat-input w-12 text-center py-0.5"
                      />
                    </td>
                    <td className="py-2 px-2 text-center text-stone-500">
                      {(item.quantity * item.weight).toFixed(1)} lb
                    </td>
                    <td className="py-2 px-2 text-stone-500">{item.notes}</td>
                    <td className="py-2 px-2 text-right no-print">
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveCharacter((prev) => ({
                            ...prev,
                            inventory: prev.inventory.filter((i) => i.id !== item.id),
                          }))
                        }
                        className="text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
