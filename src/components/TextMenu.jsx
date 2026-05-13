import React, { useState } from 'react';
import { Sparkles, ThumbsUp, Clock, Flame, ChevronDown, ChevronUp } from 'lucide-react';

const TextMenuItem = ({ dish }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const pairingSuggestions = [
    { name: 'Mojito', price: '£6.00', image: '/Images/menu/mojito.png' },
    { name: 'Jeera Rice', price: '£7.50', image: '/Images/menu/jeera_rice.png' },
    { name: 'Butter Naan', price: '£3.00', image: '/Images/menu/butter_naan.png' },
    { name: 'Tandoori Mayo', price: '£2.70', image: '/Images/menu/tandoori_mayo.png' }
  ];

  // ONLY show details for Kebabs dish as requested
  const hasDetails = dish.id === 'bong-kebab';

  return (
    <div className="mb-10 group text-left">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-baseline gap-4 mb-1">
            <h3 className="text-lg font-sans font-bold tracking-tight text-black group-hover:text-[#C9A46A] transition-colors duration-300">
              {dish.name}
              <span className="flex items-center gap-1.5 ml-2 mb-1 inline-flex">
                {(dish.type === 'veg' || dish.type === 'both') && (
                  <span className="text-[10px] inline-block border border-green-600 p-[1px] leading-none">
                    <span className="block w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  </span>
                )}
                {(dish.type === 'non-veg' || dish.type === 'both') && (
                  <span className="text-[10px] inline-block border border-red-600 p-[1px] leading-none">
                    <span className="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  </span>
                )}
              </span>
            </h3>
            <span className="text-lg font-sans font-bold text-black whitespace-nowrap">
              {typeof dish.price === 'number' ? `₹${dish.price}` : dish.price}
            </span>
          </div>
          <p className="text-sm text-black/70 leading-relaxed max-w-[90%] font-light">
            {dish.description.split(' ').length > 12 
              ? dish.description.split(' ').slice(0, 12).join(' ') + '...' 
              : dish.description}
          </p>
          {dish.meta && (
            <p className="text-xs text-[#C9A46A] mt-1 tracking-wider font-medium">
              {dish.meta}
            </p>
          )}
          
          {hasDetails && (
            <button 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex items-center gap-1.5 mt-3 text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {isDrawerOpen ? 'Close Details' : 'View More'}
              </span>
              {isDrawerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
        
        {/* Image Placeholder */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[#F2EADF] rounded-full flex items-center justify-center border border-black/5 shadow-sm overflow-hidden relative group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
          <span className="text-[10px] uppercase tracking-widest text-black/40 font-medium">Image</span>
          {dish.image && (
            <img src={dish.image} alt={dish.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>

      {/* ── Collapsible Details Drawer ── */}
      {hasDetails && (
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isDrawerOpen ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0 pointer-events-none'}`}
        >
          <div className="p-5 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-6">
            {/* ── Complete Your Meal ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Complete your meal</h3>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scroll-smooth scrollbar-hide">
                {pairingSuggestions.map((item, i) => (
                  <div 
                    key={i}
                    className="flex-shrink-0 w-[120px] sm:w-[130px] rounded-xl overflow-hidden border border-black/[0.04] bg-white shadow-sm snap-start"
                  >
                    <div className="w-full h-[80px] sm:h-[100px] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <span className="block text-[10px] sm:text-[11px] font-bold text-black leading-tight">{item.name}</span>
                      <span className="block text-[10px] sm:text-[11px] font-bold text-[var(--accent)] mt-0.5">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="flex items-center justify-between pt-6 border-t border-black/5">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent)]/5">
                  <ThumbsUp size={12} className="text-[var(--accent)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] font-bold text-black leading-tight">{dish.reorderRate || '91%'} People</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">Reorder this</span>
                </div>
              </div>

              <div className="w-px h-8 bg-black/5"></div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent)]/5">
                  <Clock size={12} className="text-[var(--accent)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] font-bold text-black leading-tight">{dish.prepTime || '12m'} Mins</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">Avg. Prep</span>
                </div>
              </div>

              <div className="w-px h-8 bg-black/5"></div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent)]/5">
                  <Flame size={12} className="text-[var(--accent)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] font-bold text-black leading-tight">Perfect with</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">{dish.pairing || 'Mojito'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TextMenu = ({ dishes }) => {
  // Group dishes by category
  const groupedDishes = dishes.reduce((acc, dish) => {
    const cat = dish.category || 'Mains';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dish);
    return acc;
  }, {});

  const categoryOrder = ['Starter', 'Mains', 'Pasta', 'Pizza', 'Sides', 'Drinks'];
  
  const sortedCategories = Object.keys(groupedDishes).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 text-black text-center">
      {/* Categories */}
      {sortedCategories.map((category) => {
        const items = groupedDishes[category];
        
        return (
          <div key={category} className="mb-24">
            <div className="flex items-center justify-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] text-black">
                {category}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              {items.map((dish) => (
                <TextMenuItem key={dish.id} dish={dish} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="text-center mt-20 pt-10 border-t border-black/10 opacity-50">
        <p className="text-xs tracking-[0.2em] font-light">* 5% GST to be added</p>
      </div>
    </div>
  );
};

export default TextMenu;

