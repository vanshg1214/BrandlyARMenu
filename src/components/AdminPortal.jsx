import React, { useState, useEffect } from 'react';
import { Save, Download, X, Search, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';

export default function AdminPortal({ onClose }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState("Chef's Special");
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/dishes.json')
      .then(res => res.json())
      .then(data => {
        setDishes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dishes:', err);
        setLoading(false);
      });

    // Disable background scroll when admin is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...dishes];
    updated[index] = { ...updated[index], [field]: value };
    setDishes(updated);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dishes, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "dishes.json");
    dlAnchorElem.click();
    
    setSaveStatus('Exported Successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/60 tracking-widest text-sm uppercase">Loading Workspace</p>
        </div>
      </div>
    );
  }

  // Filter dishes based on the active tab and search
  const filteredDishes = dishes.map((dish, originalIndex) => ({ ...dish, originalIndex }))
    .filter(dish => {
      const isChefSpecial = !!dish.modelUrl;
      const matchesTab = activeTab === "Chef's Special" ? isChefSpecial : !isChefSpecial;
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] overflow-hidden flex flex-col text-white font-sans selection:bg-red-500/30">
      
      {/* ── Top Navigation Bar ── */}
      <div className="border-b border-white/5 bg-[#111] px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Aroma Workspace</h1>
            <p className="text-white/40 text-xs mt-0.5">Content Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {saveStatus && (
            <span className="text-green-400 text-sm font-medium animate-fadeIn px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">
              {saveStatus}
            </span>
          )}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
          >
            <Download size={16} /> Update Changes
          </button>
          <div className="w-[1px] h-8 bg-white/10 mx-2"></div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Close Workspace"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* ── Sidebar ── */}
        <div className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto custom-scrollbar" data-lenis-prevent>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-2 px-3">Categories</p>
            
            <button 
              onClick={() => setActiveTab("Chef's Special")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "Chef's Special" 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Sparkles size={18} />
              <span className="font-medium text-sm">Chef's Special</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("Menu")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "Menu" 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <BookOpen size={18} />
              <span className="font-medium text-sm">Standard Menu</span>
            </button>
          </div>
          
          <div className="mt-auto bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <p className="text-white/60 text-xs leading-relaxed">
              <strong className="text-white/80">Instruction:</strong> Edit the details on the right. Once done, click "Update Changes" to download the new JSON matrix, which you can push directly to your live environment.
            </p>
          </div>
        </div>

        {/* ── Main Edit Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
          
          {/* Toolbar */}
          <div className="px-8 py-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-semibold">{activeTab}</h2>
              <p className="text-white/40 text-sm mt-1">{filteredDishes.length} items configured</p>
            </div>
            
            <div className="relative w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white/30"
              />
            </div>
          </div>

          {/* List Scroll Area */}
          <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar" data-lenis-prevent>
            <div className="grid grid-cols-1 gap-4 max-w-5xl">
              {filteredDishes.map((dish) => (
                <div 
                  key={dish.originalIndex} 
                  className="bg-[#161616] border border-white/5 rounded-2xl p-5 flex gap-6 items-start transition-all hover:border-white/10 group"
                >
                  {/* Form Fields */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex gap-4">
                      {/* Name Field */}
                      <div className="flex-1">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5 font-medium ml-1">Dish Title</label>
                        <input 
                          type="text" 
                          value={dish.name} 
                          onChange={(e) => handleChange(dish.originalIndex, 'name', e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-[#111] transition-colors"
                        />
                      </div>
                      
                      {/* Price Field */}
                      <div className="w-40">
                        <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5 font-medium ml-1">Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-medium">₹</span>
                          <input 
                            type="number" 
                            value={dish.price} 
                            onChange={(e) => handleChange(dish.originalIndex, 'price', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-[#111] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-1.5 font-medium ml-1">Description</label>
                      <textarea 
                        value={dish.description} 
                        onChange={(e) => handleChange(dish.originalIndex, 'description', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-red-500/50 focus:bg-[#111] transition-colors h-24 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDishes.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                  <Search size={48} className="text-white/10 mb-4" />
                  <h3 className="text-white/60 text-lg font-medium">No dishes found</h3>
                  <p className="text-white/30 text-sm">Adjust your search or switch tabs.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Scrollbar styling specifically for this component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
