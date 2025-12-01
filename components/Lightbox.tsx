import React, { useEffect } from 'react';
import { PortfolioItem } from '../types';
import { X, ChevronLeft, ChevronRight, Share2, Download } from 'lucide-react';

interface LightboxProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({ 
  item, 
  onClose, 
  onNext, 
  onPrev,
  hasNext, 
  hasPrev 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };

    if (item) {
      document.body.classList.add('no-scroll');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('no-scroll');
    };
  }, [item, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm animate-fade-in">
      
      {/* Controls */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-sm font-medium">
          {item.title} <span className="text-gray-400 mx-2">/</span> {item.category}
        </div>
        <div className="flex gap-4">
           <a 
             href={item.url} 
             download={`hagen-${item.title}.png`}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             title="Download"
           >
             <Download size={20} />
           </a>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
           >
             <X size={24} />
           </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {hasPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 p-4 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {hasNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 p-4 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Main Image */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-12 cursor-zoom-out" onClick={onClose}>
        <img 
          src={item.url} 
          alt={item.title} 
          className="max-w-full max-h-full object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
        />
      </div>
    </div>
  );
};