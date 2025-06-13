import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Rating from '@/components/atoms/Rating';
import PriceCard from '@/components/molecules/PriceCard';
import BookCard from '@/components/molecules/BookCard';
import PriceAlertModal from '@/components/organisms/PriceAlertModal';
import ApperIcon from '@/components/ApperIcon';
import { bookService, priceDataService, userService } from '@/services';
import { toast } from 'react-toastify';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [prices, setPrices] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [savingBook, setSavingBook] = useState(false);

  useEffect(() => {
    const loadBookData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [bookData, bookPrices] = await Promise.all([
          bookService.getById(id),
          priceDataService.getByBookId(id)
        ]);
        
        setBook(bookData);
        setPrices(bookPrices);

        // Load price history for chart
        if (bookPrices.length > 0) {
          const history = await priceDataService.getPriceHistory(id, bookPrices[0].retailer);
          setPriceHistory(history);
        }

        // Load recommendations based on book genres
        const recs = await bookService.getRecommendations(bookData.genre, 4);
        setRecommendations(recs.filter(rec => rec.id !== id));

      } catch (error) {
        console.error('Failed to load book data:', error);
        toast.error('Failed to load book details');
        navigate('/discover');
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [id, navigate]);

  const handleSaveBook = async () => {
    setSavingBook(true);
    try {
      const currentUser = await userService.getCurrentUser();
      await userService.addSavedBook(currentUser.id, book.id);
      toast.success('Book saved to your library!');
    } catch (error) {
      console.error('Failed to save book:', error);
      toast.error('Failed to save book');
    } finally {
      setSavingBook(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="lg:w-1/3">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
              </div>
              <div className="lg:w-2/3 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="BookX" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Book not found</h2>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discover')} icon="ArrowLeft">
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const lowestPrice = prices.length > 0 
    ? prices.filter(p => p.inStock).reduce((min, current) => 
        current.price < min.price ? current : min, prices.find(p => p.inStock) || prices[0])
    : null;

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#FF6B35']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: priceHistory.map(p => p.date),
      labels: {
        formatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    colors: ['#FF6B35']
  };

  const chartSeries = [{
    name: 'Price',
    data: priceHistory.map(p => p.price)
  }];

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
          >
            Back
          </Button>
        </motion.div>

        {/* Book Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8 mb-12"
        >
          {/* Book Cover */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                src={book.coverUrl}
                alt={book.title}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop";
                }}
                className="w-full max-w-sm mx-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-2 break-words">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4 break-words">
                  by {book.author}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Rating 
                    value={book.rating} 
                    showValue 
                    showCount 
                    count={book.ratingCount}
                    size={18}
                  />
                  
                  {book.featured && (
                    <Badge variant="accent" size="lg">
                      <ApperIcon name="Star" size={16} className="mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {book.genre.map((genre) => (
                  <Badge key={genre} variant="primary" size="md">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display font-semibold text-xl text-gray-900 mb-3">
                  About this book
                </h2>
                <p className="text-gray-700 leading-relaxed break-words">
                  {book.description}
                </p>
              </div>

              {/* Publication Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Publication Date</span>
                  <p className="font-medium text-gray-900">
                    {new Date(book.publicationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ISBN</span>
                  <p className="font-medium text-gray-900 break-all">{book.isbn}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => setAlertModalOpen(true)}
                  icon="Bell"
                  className="flex-1"
                >
                  Set Price Alert
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSaveBook}
                  loading={savingBook}
                  icon="Heart"
                  className="flex-1"
                >
                  Save Book
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
            Where to Buy
          </h2>
          
          {prices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prices.map((price) => (
                <PriceCard
                  key={price.id}
                  priceData={price}
                  isLowest={lowestPrice && price.id === lowestPrice.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface rounded-lg">
              <ApperIcon name="ShoppingCart" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No price data available for this book</p>
            </div>
          )}
        </motion.section>

        {/* Price History Chart */}
        {priceHistory.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
              Price History
            </h2>
            
            <div className="bg-surface rounded-lg p-6">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={300}
              />
            </div>
          </motion.section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
              You might also like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((recBook) => (
                <BookCard
                  key={recBook.id}
                  book={recBook}
                  showPrice={true}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        book={book}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        lowestPrice={lowestPrice}
      />
    </div>
  );
};

export default BookDetail;