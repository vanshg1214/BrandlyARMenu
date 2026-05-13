import React from 'react';

const TextMenuItem = ({ dish }) => {
  return (
    <div className="mb-10 group text-left flex items-start justify-between gap-6">
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
          {dish.description}
        </p>
        {dish.meta && (
          <p className="text-xs text-[#C9A46A] mt-1 uppercase tracking-wider font-medium">
            {dish.meta}
          </p>
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
  );
};

const TextMenu = ({ dishes }) => {
  // Group dishes by category
  const groupedDishes = dishes.reduce((acc, dish) => {
    const cat = dish.category || 'MAINS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dish);
    return acc;
  }, {});

  const categoryOrder = ['STARTER', 'MAINS', 'PASTA', 'PIZZA', 'SIDES', 'DRINKS'];
  
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
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-black">
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
        <p className="text-xs tracking-[0.2em] font-light uppercase">* 5% GST to be added</p>
      </div>
    </div>
  );
};

export default TextMenu;

