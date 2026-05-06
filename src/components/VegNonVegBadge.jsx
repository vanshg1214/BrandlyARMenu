import React from 'react';

const VegNonVegBadge = ({ type, className = '' }) => {
  const isVeg = type === 'veg';
  const isBoth = type === 'both';
  
  return (
    <div 
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-bold border ${className}`}
      style={{
        backgroundColor: isBoth ? 'rgba(0, 0, 0, 0.03)' : (isVeg ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'),
        borderColor: isBoth ? 'rgba(0, 0, 0, 0.1)' : (isVeg ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
        color: isBoth ? 'rgba(0, 0, 0, 0.7)' : (isVeg ? '#16a34a' : '#dc2626'),
      }}
    >
      {/* Indicator symbols */}
      <div className="flex gap-1 items-center">
        {(isVeg || isBoth) && (
          <div 
            className="w-2.5 h-2.5 rounded-sm flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: '#16a34a' }}
          >
            <span className="text-[6px]">●</span>
          </div>
        )}
        {(type === 'non-veg' || isBoth) && (
          <div 
            className="w-2.5 h-2.5 rounded-sm flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: '#dc2626' }}
          >
            <span className="text-[6px]">▲</span>
          </div>
        )}
      </div>
      <span className="font-bold tracking-wide uppercase">
        {isBoth ? 'VEG & NON-VEG' : (isVeg ? 'VEG' : 'NON-VEG')}
      </span>
    </div>
  );
};

export default VegNonVegBadge;