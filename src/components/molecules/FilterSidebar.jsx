import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { bookService } from '@/services';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose,
  className = '' 
}) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await bookService.getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGenres();
  }, []);

  const handleGenreToggle = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const handleSortChange = (sortBy) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleRatingChange = (minRating) => {
    onFiltersChange({ ...filters, minRating });
  };

  const clearFilters = () => {
    onFiltersChange({
      genres: [],
      sortBy: '',
      minRating: 0,
      search: filters.search || ''
    });
  };

  const hasActiveFilters = filters.genres.length > 0 || filters.sortBy || filters.minRating > 0;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-display font-semibold text-lg text-gray-900">Filters</h2>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              icon="X"
            >
              Clear
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
          <div className="space-y-2">
            {[
              { value: '', label: 'Relevance' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'newest', label: 'Newest' },
              { value: 'title', label: 'Title A-Z' },
              { value: 'author', label: 'Author A-Z' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
          <div className="space-y-2">
            {[
              { value: 0, label: 'Any Rating' },
              { value: 3, label: '3+ Stars' },
              { value: 4, label: '4+ Stars' },
              { value: 4.5, label: '4.5+ Stars' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="minRating"
                  value={option.value}
                  checked={filters.minRating === option.value}
                  onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Genres</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="text-primary focus:ring-primary rounded"
                  />
                  <span className="text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  if (!isOpen) {
    return (
      <div className={`hidden lg:block w-64 ${className}`}>
        {sidebarContent}
      </div>
    );
  }

  // Mobile overlay
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 z-50 lg:hidden shadow-xl"
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;