
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, AlertCircle, Copy, Check, Save } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { GenerationConfig, PortfolioItem } from '../types';

interface ManageModalProps {
  isOpen: boolean;
  categories: string[];
  onClose: () => void;
  onAdd: (item: PortfolioItem) => void;
  onUpdateCategories: (categories: string[]) => void;
  onBulkUpdate: (items: PortfolioItem[]) => void;
  allItems: PortfolioItem[];
}

type Tab = 'create' | 'add_url' | 'config';

export const GeneratorModal: React.FC<ManageModalProps> = ({ 
  isOpen, 
  categories,
  onClose, 
  onAdd,
  onUpdateCategories,
  onBulkUpdate,
  allItems
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('add_url');
  
  // AI State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<GenerationConfig['aspectRatio']>('3:4');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Manual Add State
  const [manualUrl, setManualUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState(categories[0] || 'Photography');
  const [newCategory, setNewCategory] = useState('');
  const [isCover, setIsCover] = useState(false);

  // Config State
  const [configJson, setConfigJson] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // -- Handlers --

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const imageUrl = await generateImage(prompt, { aspectRatio });
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setAiError("Failed to generate. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAi = () => {
    if (generatedImage) {
      onAdd({
        id: Date.now().toString(),
        url: generatedImage,
        title: prompt.slice(0, 20),
        category: 'AI Art',
        isAiGenerated: true,
      });
      setGeneratedImage(null);
      setPrompt('');
      onClose();
    }
  };

  const handleManualAdd = () => {
    if (!manualUrl.trim() || !manualTitle.trim()) return;
    onAdd({
      id: Date.now().toString(),
      url: manualUrl,
      title: manualTitle,
      category: manualCategory,
      isCover: isCover
    });
    setManualUrl('');
    setManualTitle('');
    setIsCover(false);
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onUpdateCategories([...categories, newCategory]);
      setManualCategory(newCategory);
      setNewCategory('');
    }
  };

  const handleLoadConfig = () => {
    setConfigJson(JSON.stringify(allItems, null, 2));
  };

  const handleImportConfig = () => {
    try {
      const items = JSON.parse(configJson);
      if (Array.isArray(items)) {
        onBulkUpdate(items);
        onClose();
      }
    } catch (e) {
      alert("Invalid JSON format");
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(allItems, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Tabs */}
        <div className="px-6 pt-6 pb-0 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Manage Content</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex gap-6 text-sm font-medium">
             <button 
               onClick={() => setActiveTab('add_url')}
               className={`pb-3 border-b-2 transition-colors ${activeTab === 'add_url' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               Add Photo
             </button>
             <button 
               onClick={() => setActiveTab('create')}
               className={`pb-3 border-b-2 transition-colors ${activeTab === 'create' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               AI Studio
             </button>
             <button 
               onClick={() => { setActiveTab('config'); handleLoadConfig(); }}
               className={`pb-3 border-b-2 transition-colors ${activeTab === 'config' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               Data Source
             </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* TAB: Add Photo */}
          {activeTab === 'add_url' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                Paste a direct link to your image. From Google Photos, right-click the image and select "Copy Image Address".
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Summer Vacation"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page / Category</label>
                <div className="flex gap-2">
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Add new category inline */}
                <div className="flex gap-2 mt-2">
                   <input 
                     type="text"
                     value={newCategory}
                     onChange={(e) => setNewCategory(e.target.value)}
                     placeholder="New Category..."
                     className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                   />
                   <button 
                     onClick={handleAddCategory}
                     disabled={!newCategory}
                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium disabled:opacity-50"
                   >
                     Add
                   </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isCover"
                  checked={isCover}
                  onChange={(e) => setIsCover(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isCover" className="text-sm text-gray-700 select-none">
                  Use as Album Cover
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleManualAdd}
                  disabled={!manualUrl || !manualTitle}
                  className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Photo
                </button>
              </div>
            </div>
          )}

          {/* TAB: AI Studio */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {!generatedImage ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your vision..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none resize-none h-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                    <div className="flex gap-3">
                      {(['1:1', '3:4', '4:3', '16:9'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-4 py-2 text-sm rounded-md border transition-all ${
                            aspectRatio === ratio
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                  {aiError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{aiError}</div>
                  )}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleAiGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      Generate
                    </button>
                  </div>
                </>
              ) : (
                 <div className="flex flex-col items-center gap-4">
                   <img src={generatedImage} alt="Generated" className="rounded-lg shadow-md max-h-[40vh]" />
                   <div className="flex gap-3">
                     <button 
                       onClick={() => setGeneratedImage(null)}
                       className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
                     >
                       Discard
                     </button>
                     <button 
                       onClick={handleSaveAi}
                       className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
                     >
                       Save to Portfolio
                     </button>
                   </div>
                 </div>
              )}
            </div>
          )}

          {/* TAB: Config */}
          {activeTab === 'config' && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">How to save permanently:</p>
                  <p>Changes made in this app are temporary. To save them, copy the JSON below and paste it into <code>constants.ts</code> in your project source code.</p>
                </div>
              </div>
              <textarea
                value={configJson}
                readOnly
                className="flex-1 w-full p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-lg outline-none resize-none min-h-[200px]"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">Current Items: {allItems.length}</span>
                <button
                  onClick={handleCopyConfig}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
