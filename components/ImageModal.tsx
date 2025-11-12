
import React from 'react';
import { DownloadIcon, RemixIcon, CloseIcon, HeartIcon } from './icons';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  onRemix: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, onRemix, onSave, isSaved }) => {
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `vibe-wallpaper-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string, disabled?: boolean }> = ({ onClick, children, label, disabled = false }) => (
    <div className="flex flex-col items-center gap-2">
        <button 
            onClick={onClick} 
            className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full transition-colors hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={disabled}
        >
            {children}
        </button>
        <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div className="relative w-full h-full p-4 md:p-8 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex-grow flex items-center justify-center">
            <img 
                src={imageUrl} 
                alt="Selected wallpaper" 
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl shadow-cyan-500/10"
            />
        </div>

        <div className="flex-shrink-0 pt-4 flex justify-center items-center gap-6">
            <ActionButton onClick={handleDownload} label="Download">
              <DownloadIcon className="w-6 h-6" />
            </ActionButton>
            <ActionButton onClick={onSave} label={isSaved ? "Saved" : "Save"} disabled={isSaved}>
              <HeartIcon className={`w-6 h-6 ${isSaved ? 'text-red-500 fill-current' : ''}`} />
            </ActionButton>
            <ActionButton onClick={onRemix} label="Remix">
              <RemixIcon className="w-6 h-6" />
            </ActionButton>
        </div>
      </div>
      
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white p-3 rounded-full transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <CloseIcon className="w-6 h-6" />
      </button>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;
