import React from 'react';
import SimpleARModelViewer from './SimpleARModelViewer';
import VegNonVegBadge from './VegNonVegBadge';
import { ThumbsUp, Clock, Flame, Sparkles, Users, Award, ChevronUp, ChevronDown, Maximize2, X } from 'lucide-react';

const DishCard = ({ dish, onViewModal, adaptiveSettings, activeModelId, onActivateModel, onNavigateAR, isFirst = false }) => {
  const isModelActive = activeModelId === dish.id;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  const handlePreviewTap = (e) => {
    if (e) e.stopPropagation();
    // Activate this card's 3D model if not already active
    if (!isModelActive && dish.modelUrl) {
      onActivateModel(dish.id);
    }
  };

  const handleInteractionStart = () => {
    if (!isModelActive && dish.modelUrl) {
      onActivateModel(dish.id);
    }
  };

  const handleViewOnTable = (e) => {
    e.stopPropagation();
    console.log('🔴 View on Table clicked for:', dish.name);

    if (!dish.modelUrl) {
      alert('AR model is not available for this dish yet.');
      return;
    }

    if (onNavigateAR) onNavigateAR();

    const arPageUrl =
      '/ar.html?model=' +
      encodeURIComponent(dish.modelUrl) +
      '&name=' +
      encodeURIComponent(dish.name);

    window.location.href = arPageUrl;
  };

  // Pairing suggestions data for the scrollable section
  const pairingSuggestions = [
    { name: 'Mojito', price: '€6.00', image: '/Images/pairings/mojito.jpg' },
    { name: 'Jeera Rice', price: '€7.50', image: '/Images/pairings/jeera-rice.jpg' },
    { name: 'Butter Naan', price: '€3.00', image: '/Images/pairings/butter-naan.jpg' },
    { name: 'Tandoori Mayo', price: '€2.70', image: '/Images/pairings/tandoori-mayo.png' },
  ];

  return (
    <div ref={cardRef} className="relative self-start w-full">
      <article 
        className="rounded-2xl p-4 animate-slideUp flex flex-col min-h-[520px]"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px 0 rgba(201, 164, 106, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          minHeight: '520px',
          cursor: 'default'
        }}
      >
        {/* Preview area — image by default, 3D model on tap or drag */}
        <div
          className="relative mb-4 overflow-hidden rounded-2xl aspect-[4/3] flex-shrink-0"
          onPointerDown={handleInteractionStart}
          onClick={dish.modelUrl ? handlePreviewTap : undefined}
          style={{ cursor: dish.modelUrl ? 'pointer' : 'default' }}
        >
          {isModelActive && dish.modelUrl ? (
            /* ── 3D Model (loaded only for this card) ── */
            <>
              <SimpleARModelViewer
                modelSrc={dish.modelUrl}
                dishName={dish.name}
                poster={dish.posterImage || dish.image}
                className="rounded-2xl"
              />
              {/* Active 3D badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  zIndex: 12,
                  pointerEvents: 'none',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                🧊 3D Active
              </div>
            </>
          ) : (
            /* ── Dish image (lightweight default) ── */
            <>
              <img
                src={dish.posterImage || dish.image}
                alt={dish.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: dish.posterImage ? 'contain' : 'cover',
                  display: 'block',
                  borderRadius: '12px',
                  backgroundColor: '#2a2a2a'
                }}
              />
              {/* "Tap for 3D" overlay badge */}
              {dish.modelUrl && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    pointerEvents: 'none'
                  }}
                >
                  <span style={{ fontSize: '13px' }}>🧊</span> Tap for 3D
                </div>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow">
          <div className="flex-grow space-y-2 mb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-var(--text-primary) leading-tight mb-1">
                    {dish.name}
                  </h3>
                  {/* Modern Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-[var(--accent)]/10 px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
                      <Users size={10} className="text-[var(--accent)]" />
                      <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider">Good for 2</span>
                    </div>
                    {isFirst && (
                      <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                        <Award size={10} className="text-green-600" />
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Top Rated</span>
                      </div>
                    )}
                  </div>
                </div>
                <VegNonVegBadge type={dish.type} className="flex-shrink-0" />
              </div>
            
            <p 
              className="text-sm line-clamp-2 leading-5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {dish.description}
            </p>
            
            {dish.meta && (
              <p 
                className="text-xs font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {dish.meta}
              </p>
            )}
          </div>
          
          {/* Price + Action */}
          <div className="mt-auto space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Total Price</span>
                <span className="text-2xl font-display font-bold text-black">
                  {typeof dish.price === 'number' ? `€${dish.price.toFixed(2)}` : dish.price}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleViewOnTable}
                data-track="ar_button_click"
                disabled={!dish.modelUrl}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-[0.98] focus-visible shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                style={{ 
                  backgroundColor: dish.modelUrl ? 'var(--accent)' : '#9ca3af',
                  color: 'white',
                  cursor: dish.modelUrl ? 'pointer' : 'not-allowed',
                  border: 'none',
                  outline: 'none',
                  opacity: dish.modelUrl ? 1 : 0.6
                }}
              >
                {dish.modelUrl ? 'View in your space' : 'AR Unavailable'}
              </button>
              
              <div 
                className={`flex justify-center pt-1 ${isFirst ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <button 
                  type="button"
                  onClick={() => setIsDrawerOpen(prev => !prev)}
                  className="flex flex-col items-center gap-1 text-black/40 hover:text-[var(--accent)] transition-colors group cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  {isDrawerOpen ? (
                    <ChevronUp size={20} className="group-hover:scale-110 transition-transform" />
                  ) : (
                    <ChevronDown size={20} className={isFirst ? "animate-bounce group-hover:scale-110 transition-transform" : ""} />
                  )}
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{isDrawerOpen ? 'Close Details' : 'View Details'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── Expandable Dropdown (absolutely positioned below the card) ── */}
      {isFirst && (
        <div 
          className={`relative left-0 right-0 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out z-50 mt-3 ${isDrawerOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
          style={{ 
            backgroundColor: 'var(--card-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDrawerOpen ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
            boxShadow: isDrawerOpen ? '0 12px 32px -8px rgba(201, 164, 106, 0.15)' : 'none'
          }}
        >
          <div className="p-5 space-y-6">
            {/* ── Complete Your Meal — Horizontal Scrollable Cards ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Complete your meal</h3>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {pairingSuggestions.map((item, i) => (
                  <div 
                    key={i}
                    className="flex-shrink-0 w-[130px] rounded-xl overflow-hidden border border-black/[0.04] bg-white/60 shadow-sm hover:shadow-md transition-shadow snap-start"
                  >
                    <div className="w-full h-[100px] overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2.5">
                      <span className="block text-[11px] font-bold text-black leading-tight">{item.name}</span>
                      <span className="block text-[11px] font-bold text-[var(--accent)] mt-1">{item.price}</span>
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
                  <span className="text-[11px] font-bold text-black leading-tight">{dish.reorderRate || '91%'} People</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">Reorder this</span>
                </div>
              </div>

              <div className="w-px h-8 bg-black/5"></div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent)]/5">
                  <Clock size={12} className="text-[var(--accent)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-black leading-tight">{dish.prepTime || '12m'} Mins</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">Avg. Prep</span>
                </div>
              </div>

              <div className="w-px h-8 bg-black/5"></div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent)]/5">
                  <Flame size={12} className="text-[var(--accent)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-black leading-tight">Perfect with</span>
                  <span className="text-[8px] text-black/40 font-bold uppercase tracking-wider mt-0.5">Mojito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishCard;