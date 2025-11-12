
import React from 'react';
import { Wallpaper } from '../App';
import { TrashIcon, WallpaperIcon } from './icons';

interface GalleryProps {
  savedWallpapers: Wallpaper[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ savedWallpapers, onDelete }) => {
  if (savedWallpapers.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 p-4">
        <WallpaperIcon className="w-24 h-24 mx-auto mb-4 opacity-30" />
        <h2 className="text-2xl font-semibold mb-2">Your Gallery is Empty</h2>
        <p className="max-w-md">Save wallpapers you love, and they'll appear here for you to view and download anytime.</p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {savedWallpapers.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className="group relative aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden"
          >
            <img
              src={wallpaper.imageUrl}
              alt={`Wallpaper generated from: ${wallpaper.prompt}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
              <p className="text-white text-sm font-medium line-clamp-3">
                {wallpaper.prompt}
              </p>
            </div>
            <button
              onClick={() => onDelete(wallpaper.id)}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110"
              aria-label="Delete wallpaper"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Gallery;
