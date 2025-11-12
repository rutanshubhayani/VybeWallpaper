
import React from 'react';

interface ImageGridProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
      {images.map((img, index) => (
        <div
          key={index}
          className="aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden cursor-pointer group relative transition-transform duration-300 ease-in-out hover:scale-105"
          onClick={() => onImageSelect(img)}
        >
          <img
            src={img}
            alt={`Generated wallpaper ${index + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onLoad={(e) => e.currentTarget.style.opacity = '1'}
            style={{ opacity: 0 }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white font-semibold text-lg">View</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
