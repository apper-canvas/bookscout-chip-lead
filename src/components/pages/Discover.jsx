import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookGrid from '@/components/organisms/BookGrid';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { bookService, userService } from '@/services';
import { toast } from 'react-toastify';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [savingBook, setSavingBook] = useState(null);
  
  const [filters, setFilters] = useState({
    genres: searchParams.get('genres')?.split(',').filter(Boolean) || [],
    sortBy: searchParams.get('sortBy') || '',
    minRating: parseFloat(searchParams.get('minRating')) || 0,
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const filteredBooks = await bookService.getAll(filters);
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Failed to load books:', error);
        toast.error('Failed to load books');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.genres.length > 0) {
      params.set('genres', filters.genres.join(','));
    }
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    if (filters.minRating > 0) {
      params.set('minRating', filters.minRating.toString());
    }
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveBook = async (bookId) => {
    setSavingBook(bookId);
    try {
      const currentUser = await userService.getCurrentUser();
      await userService.addSavedBook(currentUser.id, bookId);
      toast.success('Book saved to your library!');
    } catch (error) {
      console.error('Failed to save book:', error);
      toast.error('Failed to save book');
    } finally {
      setSavingBook(null);
    }
  };

  const activeFilterCount = 
    filters.genres.length + 
    (filters.sortBy ? 1 : 0) + 
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={false}
              onClose={() => {}}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display font-bold text-2xl lg:text-3xl text-gray-900 mb-2">
                  Discover Books
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Loading books...' : `${books.length} books found`}
                  {filters.search && (
                    <span> for "{filters.search}"</span>
                  )}
                </p>
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setFilterOpen(true)}
                icon="Filter"
                className="lg:hidden relative"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap gap-2"
              >
                {filters.genres.map((genre) => (
                  <motion.button
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleFiltersChange({
                      ...filters,
                      genres: filters.genres.filter(g => g !== genre)
                    })}
                    className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
                  >
                    <span>{genre}</span>
                    <ApperIcon name="X" size={14} />
                  </motion.button>
                ))}
                
                {filters.sortBy && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleFiltersChange({ ...filters, sortBy: '' })}
                    className="flex items-center space-x-1 px-3 py-1 bg-secondary text-white rounded-full text-sm hover:bg-secondary/90 transition-colors"
                  >
                    <span>Sort: {filters.sortBy}</span>
                    <ApperIcon name="X" size={14} />
                  </motion.button>
                )}
                
                {filters.minRating > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleFiltersChange({ ...filters, minRating: 0 })}
                    className="flex items-center space-x-1 px-3 py-1 bg-warning text-white rounded-full text-sm hover:bg-warning/90 transition-colors"
                  >
                    <span>{filters.minRating}+ stars</span>
                    <ApperIcon name="X" size={14} />
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Books Grid */}
            <BookGrid
              books={books}
              loading={loading}
              onSave={handleSaveBook}
              emptyTitle={filters.search || activeFilterCount > 0 ? "No books match your criteria" : "No books found"}
              emptyDescription={filters.search || activeFilterCount > 0 ? "Try adjusting your search or filters" : "Check back later for new arrivals"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;