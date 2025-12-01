import React from 'react';
import { LayoutGrid, Settings2 } from 'lucide-react';

interface NavigationProps {
  siteName: string;
  categories: string[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenManagement: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  siteName,
  categories,
  currentFilter, 
  onFilterChange,
  onOpenManagement
}) => {
  const allCategories = ['All', ...categories];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onFilterChange('All')}>
           <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm">
             <LayoutGrid size={18} />
           </div>
           <span className="text-xl font-bold tracking-tight text-gray-900">{siteName.toUpperCase()}</span>
        </div>

        {/* Center: Filters (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          {allCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`text-sm uppercase tracking-widest transition-colors duration-200 ${
                currentFilter === filter 
                  ? 'text-black font-semibold' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenManagement}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black transition-colors"
            title="Manage Portfolio"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden w-full overflow-x-auto px-6 py-3 border-t border-gray-50 flex gap-6 scrollbar-hide">
         {allCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`text-xs uppercase tracking-widest whitespace-nowrap ${
                currentFilter === filter 
                  ? 'text-black font-bold' 
                  : 'text-gray-400'
              }`}
            >
              {filter}
            </button>
          ))}
      </div>
    </nav>
  );
};