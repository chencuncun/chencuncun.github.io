
import React, { useState, useEffect, useMemo } from 'react';
import { PortfolioItem } from '../types';
import { ZoomIn, Sparkles, FolderOpen } from 'lucide-react';

interface MasonryGridProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
  isCollectionMode?: boolean;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onItemClick, isCollectionMode = false }) => {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    // Set initial columns
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute items across columns (Left-to-Right filling)
  const columns = useMemo(() => {
    const cols: PortfolioItem[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols;
  }, [items, columnCount]);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-6 py-12">
      {/* Flex container representing the grid columns */}
      <div className="flex gap-6 items-start">
        {columns.map((colItems, colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
            {colItems.map((item) => {
              // Calculate aspect ratio from constants if available
              const ratioStyle = (item.width && item.height) 
                 ? { aspectRatio: `${item.width} / ${item.height}` } 
                 : undefined;

              return (
                <div 
                  key={item.id} 
                  className="group relative cursor-pointer block"
                  onClick={() => onItemClick(item)}
                >
                  <div className="relative overflow-hidden bg-gray-100 rounded-sm w-full">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      loading="lazy"
                      style={ratioStyle}
                      className="w-full h-auto object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-105 block"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
                              {isCollectionMode ? "Collection" : item.category}
                            </p>
                            <h3 className="text-white text-xl font-medium">
                              {isCollectionMode ? item.category : item.title}
                            </h3>
                          </div>
                          {item.isAiGenerated && !isCollectionMode && (
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white" title="AI Generated">
                              <Sparkles size={16} />
                            </div>
                          )}
                          {isCollectionMode && (
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white">
                              <FolderOpen size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover Icon Centered */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                       <div className="bg-white/90 p-3 rounded-full shadow-lg">
                          {isCollectionMode ? (
                              <FolderOpen size={20} className="text-black" />
                          ) : (
                              <ZoomIn size={20} className="text-black" />
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
          <p className="text-lg">No items found.</p>
        </div>
      )}
    </div>
  );
};
