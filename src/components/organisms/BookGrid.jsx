import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '@/components/molecules/BookCard';
import ApperIcon from '@/components/ApperIcon';

const BookGrid = ({ 
  books, 
  loading = false, 
  onSave,
  emptyTitle = "No books found",
  emptyDescription = "Try adjusting your search or filters",
  className = '' 
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              
              <div className="flex space-x-1">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!books || books.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="BookOpen" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          {emptyTitle}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {emptyDescription}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  // Book grid
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BookCard 
              book={book} 
              onSave={onSave}
              showPrice={true}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default BookGrid;