
import React, { useState, useMemo } from 'react';
import { INITIAL_CONFIG } from './constants';
import { PortfolioItem, SiteConfig } from './types';
import { Navigation } from './components/Navigation';
import { MasonryGrid } from './components/MasonryGrid';
import { Lightbox } from './components/Lightbox';
import { GeneratorModal } from './components/GeneratorModal';

const App: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(INITIAL_CONFIG.items);
  const [categories, setCategories] = useState<string[]>(INITIAL_CONFIG.categories);
  const [filter, setFilter] = useState<string>('All');
  
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const isCollectionMode = filter === 'All';

  // Filter Logic
  const displayItems = useMemo(() => {
    if (isCollectionMode) {
      // In "All" mode, show one cover item per category
      return categories
        .map(cat => {
          const categoryItems = items.filter(i => i.category === cat);
          if (categoryItems.length === 0) return null;
          // Prefer item marked as cover, otherwise first item
          return categoryItems.find(i => i.isCover) || categoryItems[0];
        })
        .filter((item): item is PortfolioItem => item !== null);
    }
    // In category mode, show items for that category EXCEPT those marked as covers
    return items.filter(item => item.category === filter && !item.isCover);
  }, [items, filter, categories, isCollectionMode]);

  // Lightbox Navigation Logic (Only valid when not in Collection Mode)
  const currentIndex = lightboxItem ? displayItems.findIndex(i => i.id === lightboxItem.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < displayItems.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) setLightboxItem(displayItems[currentIndex + 1]);
  };

  const handlePrev = () => {
    if (hasPrev) setLightboxItem(displayItems[currentIndex - 1]);
  };

  // Click Handler
  const handleItemClick = (item: PortfolioItem) => {
    if (isCollectionMode) {
      // If in collection mode, clicking an item opens that category
      setFilter(item.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If in category mode, clicking an item opens lightbox
      setLightboxItem(item);
    }
  };

  // Content Management
  const handleAddItem = (newItem: PortfolioItem) => {
    setItems(prev => {
      // If new item is set as cover, unset other covers in that category
      if (newItem.isCover) {
        return [
          newItem,
          ...prev.map(i => i.category === newItem.category ? { ...i, isCover: false } : i)
        ];
      }
      return [newItem, ...prev];
    });

    // If category is new, make sure it's in the list
    if (!categories.includes(newItem.category)) {
      setCategories(prev => [...prev, newItem.category]);
    }
    
    // Switch to that category to see the new item
    setFilter(newItem.category);
  };

  const handleBulkUpdate = (newItems: PortfolioItem[]) => {
    setItems(newItems);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white font-sans">
      <Navigation 
        siteName={INITIAL_CONFIG.siteName}
        categories={categories}
        currentFilter={filter} 
        onFilterChange={setFilter} 
        onOpenManagement={() => setIsManagerOpen(true)}
      />

      <main>
        <div className="max-w-[1920px] mx-auto px-6 pt-16 pb-8 text-center md:text-left">
           <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6 uppercase">
             {isCollectionMode ? "Albums" : filter}
           </h1>
           <p className="text-gray-500 max-w-xl text-lg font-light leading-relaxed">
             {isCollectionMode ? "Select a collection to view photos." : INITIAL_CONFIG.description}
           </p>
        </div>

        <MasonryGrid 
          items={displayItems} 
          onItemClick={handleItemClick}
          isCollectionMode={isCollectionMode}
        />
      </main>

      <footer className="w-full py-12 border-t border-gray-100 mt-12">
        <div className="max-w-[1920px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {INITIAL_CONFIG.siteName}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-black transition-colors">Instagram</a>
             <a href="#" className="hover:text-black transition-colors">Twitter</a>
             <a href="#" className="hover:text-black transition-colors">Email</a>
          </div>
        </div>
      </footer>

      {/* Lightbox Overlay */}
      {lightboxItem && (
        <Lightbox 
          item={lightboxItem} 
          onClose={() => setLightboxItem(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      )}

      {/* Manager / Studio Modal */}
      <GeneratorModal 
        isOpen={isManagerOpen}
        categories={categories} 
        onClose={() => setIsManagerOpen(false)}
        onAdd={handleAddItem}
        onUpdateCategories={setCategories}
        onBulkUpdate={handleBulkUpdate}
        allItems={items}
      />
    </div>
  );
};

export default App;
