import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { priceAlertService, userService } from '@/services';

const PriceAlertModal = ({ book, isOpen, onClose, lowestPrice }) => {
  const [targetPrice, setTargetPrice] = useState(lowestPrice ? (lowestPrice.price * 0.9).toFixed(2) : '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      toast.error('Please enter a valid target price');
      return;
    }

    setLoading(true);
    try {
      const currentUser = await userService.getCurrentUser();
      
      await priceAlertService.create({
        userId: currentUser.id,
        bookId: book.id,
        targetPrice: parseFloat(targetPrice),
        notifyEmail,
        notifyInApp
      });

      toast.success(
        `Price alert set for "${book.title}" at $${targetPrice}`,
        {
          icon: ({ theme, type }) => (
            <div className="animate-confetti text-accent">🎉</div>
          )
        }
      );
      
      onClose();
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast.error('Failed to create price alert');
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrices = lowestPrice ? [
    { label: '10% off', value: (lowestPrice.price * 0.9).toFixed(2) },
    { label: '20% off', value: (lowestPrice.price * 0.8).toFixed(2) },
    { label: '30% off', value: (lowestPrice.price * 0.7).toFixed(2) }
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ApperIcon name="Bell" className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-gray-900">
                      Set Price Alert
                    </h2>
                    <p className="text-sm text-gray-600 break-words">
                      for "{book?.title}"
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Current Price Info */}
              {lowestPrice && (
                <div className="bg-surface rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current lowest price:</span>
                    <div className="text-right">
                      <div className="font-semibold text-lg text-primary">
                        ${lowestPrice.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        at {lowestPrice.retailer}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Target Price */}
                <div>
                  <Input
                    label="Target Price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    icon="DollarSign"
                    placeholder="Enter target price"
                    required
                  />
                  
                  {/* Suggested Prices */}
                  {suggestedPrices.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedPrices.map((suggestion) => (
                          <button
                            key={suggestion.value}
                            type="button"
                            onClick={() => setTargetPrice(suggestion.value)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-colors"
                          >
                            ${suggestion.value} ({suggestion.label})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Notify me via:</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        className="text-primary focus:ring-primary rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Mail" size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Email notification</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyInApp}
                        onChange={(e) => setNotifyInApp(e.target.checked)}
                        className="text-primary focus:ring-primary rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Smartphone" size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">In-app notification</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="accent"
                    className="flex-1"
                    loading={loading}
                    disabled={!notifyEmail && !notifyInApp}
                    icon="Bell"
                  >
                    Set Alert
                  </Button>
                </div>
              </form>

              {/* Info */}
              <div className="mt-4 p-3 bg-info/10 rounded-lg">
                <p className="text-xs text-info">
                  <ApperIcon name="Info" size={14} className="inline mr-1" />
                  We'll check prices daily and notify you when your target is reached.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PriceAlertModal;