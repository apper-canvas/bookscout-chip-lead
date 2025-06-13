import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import Rating from '@/components/atoms/Rating';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { priceDataService } from '@/services';

const BookCard = ({ book, showPrice = true, onSave, className = '' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lowestPrice, setLowestPrice] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Load lowest price on mount
  useState(() => {
    if (showPrice) {
      const loadPrice = async () => {
        try {
          const price = await priceDataService.getLowestPrice(book.id);
          setLowestPrice(price);
        } catch (error) {
          console.error('Failed to load price:', error);
        }
      };
      loadPrice();
    }
  }, [book.id, showPrice]);

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (onSave) {
      setLoading(true);
      try {
        await onSave(book.id);
      } catch (error) {
        console.error('Failed to save book:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`book-card bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageError ? defaultImage : book.coverUrl}
          alt={book.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Price Badge */}
        {showPrice && lowestPrice && (
          <div className="absolute top-2 right-2">
            <Badge variant="price" size="sm">
              ${lowestPrice.price}
            </Badge>
          </div>
        )}

        {/* Save Button */}
        {onSave && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={loading}
            className="absolute top-2 left-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <ApperIcon 
              name={loading ? "Loader2" : "Heart"} 
              size={16} 
              className={`${loading ? 'animate-spin' : ''} text-primary`}
            />
          </motion.button>
        )}

        {/* Featured Badge */}
        {book.featured && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="accent" size="sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 mb-1 break-words">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 break-words">
            by {book.author}
          </p>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <Rating 
            value={book.rating} 
            showValue 
            showCount 
            count={book.ratingCount}
            size={14}
          />
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="default" size="sm">
              {genre}
            </Badge>
          ))}
          {book.genre.length > 2 && (
            <Badge variant="default" size="sm">
              +{book.genre.length - 2}
            </Badge>
          )}
        </div>

        {/* Price Info */}
        {showPrice && lowestPrice && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              from <span className="font-semibold text-primary">${lowestPrice.price}</span>
            </div>
            <div className="text-xs text-gray-500">
              at {lowestPrice.retailer}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;