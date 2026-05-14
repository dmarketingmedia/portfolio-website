'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';

interface NavItem {
  _id?: string;
  label: string;
  path: string;
  displayOrder: number;
}

const NavigationManager: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [newItem, setNewItem] = useState<NavItem>({ label: '', path: '', displayOrder: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchNav = useCallback(async () => {
    try {
      const res = await axios.get('/api/navigation');
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching navigation:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNav();
  }, [fetchNav]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/navigation', newItem);
      setItems([...items, res.data]);
      setNewItem({ label: '', path: '', displayOrder: items.length + 1 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding nav item:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await axios.put(`/api/navigation?id=${editingItem._id}`, editingItem);
      setItems(items.map(item => item._id === editingItem._id ? res.data : item));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating nav item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    try {
      await axios.delete(`/api/navigation?id=${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting nav item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Navigation Manager</h2>
          <p className="text-zinc-400">Configure your website&apos;s main menu and links.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl gap-4 grid grid-cols-1 md:grid-cols-3 items-end animate-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Label</label>
            <input
              type="text"
              required
              value={newItem.label}
              onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="Home"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Path</label>
            <input
              type="text"
              required
              value={newItem.path}
              onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="/#home"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.sort((a, b) => a.displayOrder - b.displayOrder).map((item) => (
          <div key={item._id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
            {editingItem && editingItem._id === item._id ? (
              <form onSubmit={handleUpdate} className="flex-1 flex gap-4 items-center">
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white"
                />
                <input
                  type="text"
                  value={editingItem.path}
                  onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white"
                />
                <button type="submit" className="p-2 text-green-400 hover:text-green-300">
                  <Save size={20} />
                </button>
                <button onClick={() => setEditingItem(null)} className="p-2 text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </form>
            ) : (
              <>
                <div>
                  <h4 className="font-bold text-white">{item.label}</h4>
                  <p className="text-sm text-zinc-500">{item.path}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {items.length === 0 && !showAddForm && (
          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">No navigation items found. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationManager;
