
import React, { useState, useCallback, useEffect } from 'react';
import { generateWallpapers } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import Loader from './components/Loader';
import FilterSelector from './components/FilterSelector';
import Gallery from './components/Gallery';
import { WallpaperIcon, GalleryIcon } from './components/icons';

export interface Wallpaper {
  id: string;
  imageUrl: string;
  prompt: string;
}

const FILTERS = ['Vintage', 'Minimalist', 'Psychedelic', 'Abstract', 'Neon Punk'];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [savedWallpapers, setSavedWallpapers] = useState<Wallpaper[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedWallpapers = localStorage.getItem('vibewallpapers_gallery');
      if (storedWallpapers) {
        setSavedWallpapers(JSON.parse(storedWallpapers));
      }
    } catch (e) {
      console.error("Failed to load wallpapers from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vibewallpapers_gallery', JSON.stringify(savedWallpapers));
    } catch (e) {
      console.error("Failed to save wallpapers to localStorage", e);
    }
  }, [savedWallpapers]);

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]);
    
    try {
      const generatedImages = await generateWallpapers(currentPrompt, selectedFilter);
      setImages(generatedImages);
      setLastUsedPrompt(currentPrompt);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate images. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedFilter]);

  const handleRemix = useCallback(() => {
    if (!lastUsedPrompt) return;
    setSelectedImage(null);
    setTimeout(() => {
        handleGenerate(lastUsedPrompt);
    }, 100);
  }, [lastUsedPrompt, handleGenerate]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGenerate(prompt);
  };
  
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleSaveWallpaper = () => {
    if (!selectedImage || !lastUsedPrompt) return;
    const isAlreadySaved = savedWallpapers.some(w => w.imageUrl === selectedImage);
    if (isAlreadySaved) return;

    const newWallpaper: Wallpaper = {
      id: `${Date.now()}-${Math.random()}`,
      imageUrl: selectedImage,
      prompt: lastUsedPrompt,
    };
    setSavedWallpapers(prev => [newWallpaper, ...prev]);
  };
  
  const handleDeleteWallpaper = (id: string) => {
    setSavedWallpapers(prev => prev.filter(w => w.id !== id));
  };


  const renderMainContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="text-center bg-red-900/50 text-red-300 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">Generation Failed</h2>
          <p>{error}</p>
        </div>
      );
    }
    if (images.length > 0) {
      return <ImageGrid images={images} onImageSelect={handleImageSelect} />;
    }
    return (
      <div className="text-center text-gray-400">
        <WallpaperIcon className="w-24 h-24 mx-auto mb-4 opacity-30" />
        <h2 className="text-2xl font-semibold mb-2">Describe your vibe</h2>
        <p className="max-w-md">Enter a prompt below to generate unique wallpapers for your phone. Try "rainy cyberpunk lo-fi" or "serene magical forest".</p>
      </div>
    );
  };


  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <header className="p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WallpaperIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight">VibeWallpapers</h1>
          </div>
          <button 
            onClick={() => setIsGalleryOpen(!isGalleryOpen)} 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label={isGalleryOpen ? "Close gallery" : "Open gallery"}
          >
            <GalleryIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {isGalleryOpen ? (
        <Gallery savedWallpapers={savedWallpapers} onDelete={handleDeleteWallpaper} />
      ) : (
        <>
          <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
            {renderMainContent()}
          </main>
          
          <footer className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700">
             <div className="container mx-auto space-y-4">
                <FilterSelector 
                    filters={FILTERS}
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                />
                <PromptForm
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                />
             </div>
          </footer>
        </>
      )}
      
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={closeModal}
          onRemix={handleRemix}
          onSave={handleSaveWallpaper}
          isSaved={savedWallpapers.some(w => w.imageUrl === selectedImage)}
        />
      )}
    </div>
  );
};

export default App;
