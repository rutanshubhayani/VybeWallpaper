
import React from 'react';

interface FilterSelectorProps {
  filters: string[];
  selectedFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ filters, selectedFilter, onSelectFilter }) => {
  const allFilters = [null, ...filters]; // Add 'All' option

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {allFilters.map((filter, index) => {
        const isSelected = filter === selectedFilter;
        const label = filter === null ? 'None' : filter;
        
        return (
          <button
            key={index}
            onClick={() => onSelectFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
              isSelected
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        );
      })}
       <style>{`
        .overflow-x-auto::-webkit-scrollbar {
            display: none;
        }
        .overflow-x-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}</style>
    </div>
  );
};

export default FilterSelector;
