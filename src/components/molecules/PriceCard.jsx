import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PriceCard = ({ priceData, isLowest = false, className = '' }) => {
  const handleBuyClick = () => {
    window.open(priceData.url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-surface rounded-lg p-4 border ${
        isLowest ? 'border-accent ring-2 ring-accent/20' : 'border-gray-200'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">{priceData.retailer}</h3>
          {isLowest && (
            <Badge variant="accent" size="sm">
              <ApperIcon name="TrendingDown" size={12} className="mr-1" />
              Lowest Price
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            ${priceData.price}
          </span>
          {!priceData.inStock && (
            <Badge variant="error" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Updated {formatDate(priceData.lastUpdated)}
        </div>
        
        <Button
          variant={isLowest ? 'accent' : 'outline'}
          size="sm"
          onClick={handleBuyClick}
          disabled={!priceData.inStock}
          icon="ExternalLink"
          iconPosition="right"
        >
          {priceData.inStock ? 'Buy Now' : 'Unavailable'}
        </Button>
      </div>
    </motion.div>
  );
};

export default PriceCard;