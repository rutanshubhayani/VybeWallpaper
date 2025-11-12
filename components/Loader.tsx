
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl animate-pulse">
        {[...Array(4)].map((_, index) => (
            <div
            key={index}
            className="aspect-[9/16] bg-gray-800 rounded-xl"
            />
        ))}
        </div>
        <p className="mt-6 text-lg text-gray-400 font-medium">Generating your vibe...</p>
    </div>
  );
};

export default Loader;
