import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Rating from '@/components/atoms/Rating';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { bookService, priceDataService } from '@/services';
import { toast } from 'react-toastify';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowestPrices, setLowestPrices] = useState({});

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const books = await bookService.getFeatured();
        setFeaturedBooks(books);
        
        // Load prices for featured books
        const prices = {};
        for (const book of books) {
          try {
            const price = await priceDataService.getLowestPrice(book.id);
            if (price) {
              prices[book.id] = price;
            }
          } catch (error) {
            console.error(`Failed to load price for book ${book.id}:`, error);
          }
        }
        setLowestPrices(prices);
      } catch (error) {
        console.error('Failed to load featured books:', error);
        toast.error('Failed to load featured books');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  useEffect(() => {
    if (featuredBooks.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === featuredBooks.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredBooks.length]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? featuredBooks.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === featuredBooks.length - 1 ? 0 : currentIndex + 1);
  };

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-32 h-4 bg-gray-300 rounded mx-auto"></div>
            <div className="w-48 h-6 bg-gray-300 rounded mx-auto"></div>
            <div className="w-24 h-4 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredBooks.length === 0) {
    return null;
  }

  const currentBook = featuredBooks[currentIndex];
  const currentPrice = lowestPrices[currentBook.id];

  return (
    <div className="relative h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Book Cover */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src={currentBook.coverUrl}
                  alt={currentBook.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop";
                  }}
                />
                {currentPrice && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="price" size="lg">
                      ${currentPrice.price}
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Book Info */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="accent" size="lg" className="mb-4">
                  <ApperIcon name="Star" size={16} className="mr-1" />
                  Featured Book
                </Badge>
                
                <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-2 break-words">
                  {currentBook.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-4 break-words">
                  by {currentBook.author}
                </p>

                <div className="mb-4">
                  <Rating 
                    value={currentBook.rating} 
                    showValue 
                    showCount 
                    count={currentBook.ratingCount}
                    size={20}
                  />
                </div>

                <p className="text-gray-700 mb-6 line-clamp-2 break-words">
                  {currentBook.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleViewBook(currentBook.id)}
                    icon="Book"
                  >
                    View Details
                  </Button>
                  
                  {currentPrice && (
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={() => window.open(currentPrice.url, '_blank')}
                      icon="ExternalLink"
                    >
                      Buy from ${currentPrice.price}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Arrows */}
      {featuredBooks.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors z-10"
          >
            <ApperIcon name="ChevronLeft" size={24} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors z-10"
          >
            <ApperIcon name="ChevronRight" size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {featuredBooks.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSection;