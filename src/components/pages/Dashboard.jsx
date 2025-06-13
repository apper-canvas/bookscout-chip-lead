import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import BookCard from '@/components/molecules/BookCard';
import ApperIcon from '@/components/ApperIcon';
import { userService, bookService, priceAlertService, priceDataService } from '@/services';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved');
  const [savedBooks, setSavedBooks] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingAlert, setDeletingAlert] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        
        // Load saved books
        const savedBookIds = await userService.getSavedBooks(currentUser.id);
        const bookPromises = savedBookIds.map(id => bookService.getById(id));
        const books = await Promise.all(bookPromises);
        setSavedBooks(books);

        // Load alerts
        const [active, triggered] = await Promise.all([
          priceAlertService.getActiveAlerts(currentUser.id),
          priceAlertService.getTriggeredAlerts(currentUser.id)
        ]);
        
        setActiveAlerts(active);
        setTriggeredAlerts(triggered);
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDeleteAlert = async (alertId) => {
    setDeletingAlert(alertId);
    try {
      await priceAlertService.delete(alertId);
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setTriggeredAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted successfully');
    } catch (error) {
      console.error('Failed to delete alert:', error);
      toast.error('Failed to delete alert');
    } finally {
      setDeletingAlert(null);
    }
  };

  const handleRemoveSavedBook = async (bookId) => {
    try {
      const currentUser = await userService.getCurrentUser();
      await userService.removeSavedBook(currentUser.id, bookId);
      setSavedBooks(prev => prev.filter(book => book.id !== bookId));
      toast.success('Book removed from saved books');
    } catch (error) {
      console.error('Failed to remove saved book:', error);
      toast.error('Failed to remove book');
    }
  };

  const tabs = [
    { id: 'saved', label: 'Saved Books', icon: 'Heart', count: savedBooks.length },
    { id: 'active', label: 'Active Alerts', icon: 'Bell', count: activeAlerts.length },
    { id: 'triggered', label: 'Alert History', icon: 'History', count: triggeredAlerts.length }
  ];

  const AlertCard = ({ alert, onDelete }) => {
    const [book, setBook] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
      const loadAlertData = async () => {
        try {
          const [bookData, priceData] = await Promise.all([
            bookService.getById(alert.bookId),
            priceDataService.getLowestPrice(alert.bookId)
          ]);
          setBook(bookData);
          setCurrentPrice(priceData);
        } catch (error) {
          console.error('Failed to load alert data:', error);
        } finally {
          setLoadingData(false);
        }
      };

      loadAlertData();
    }, [alert.bookId]);

    if (loadingData) {
      return (
        <div className="bg-surface rounded-lg p-4 border border-gray-200 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      );
    }

    if (!book) return null;

    const isTriggered = alert.triggered;
    const isPriceMet = currentPrice && currentPrice.price <= alert.targetPrice;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-surface rounded-lg p-4 border ${
          isTriggered ? 'border-success bg-success/5' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Book Cover */}
          <img
            src={book.coverUrl}
            alt={book.title}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop";
            }}
            className="w-16 h-20 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/book/${book.id}`)}
          />

          {/* Alert Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 
                  className="font-semibold text-gray-900 truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">by {book.author}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {isTriggered && (
                  <Badge variant="success" size="sm">
                    <ApperIcon name="Check" size={12} className="mr-1" />
                    Triggered
                  </Badge>
                )}
                
                <button
                  onClick={() => onDelete(alert.id)}
                  disabled={deletingAlert === alert.id}
                  className="p-1 text-gray-400 hover:text-error transition-colors"
                >
                  <ApperIcon 
                    name={deletingAlert === alert.id ? "Loader2" : "Trash2"} 
                    size={16}
                    className={deletingAlert === alert.id ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Target Price:</span>
                <p className="font-semibold text-accent">${alert.targetPrice.toFixed(2)}</p>
              </div>
              
              <div>
                <span className="text-gray-600">
                  {isTriggered ? 'Price when triggered:' : 'Current Price:'}
                </span>
                <p className={`font-semibold ${
                  isPriceMet ? 'text-success' : 'text-primary'
                }`}>
                  {currentPrice ? `$${currentPrice.price.toFixed(2)}` : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              {isTriggered 
                ? `Triggered ${new Date(alert.triggeredAt).toLocaleDateString()}`
                : `Created ${new Date(alert.createdAt).toLocaleDateString()}`
              }
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your saved books and price alerts
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <Badge 
                      variant={activeTab === tab.id ? 'primary' : 'default'} 
                      size="sm"
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="aspect-[3/4] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Saved Books Tab */}
                {activeTab === 'saved' && (
                  <div>
                    {savedBooks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedBooks.map((book) => (
                          <BookCard
                            key={book.id}
                            book={book}
                            showPrice={true}
                            onSave={() => handleRemoveSavedBook(book.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-16"
                      >
                        <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                          No saved books yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start building your reading list by saving books you're interested in
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/discover')}
                          icon="Search"
                        >
                          Discover Books
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Active Alerts Tab */}
                {activeTab === 'active' && (
                  <div>
                    {activeAlerts.length > 0 ? (
                      <div className="space-y-4">
                        {activeAlerts.map((alert) => (
                          <AlertCard
                            key={alert.id}
                            alert={alert}
                            onDelete={handleDeleteAlert}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-16"
                      >
                        <ApperIcon name="Bell" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                          No active alerts
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Set up price alerts to get notified when your favorite books go on sale
                        </p>
                        <Button
                          variant="accent"
                          onClick={() => navigate('/discover')}
                          icon="Bell"
                        >
                          Set Your First Alert
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Triggered Alerts Tab */}
                {activeTab === 'triggered' && (
                  <div>
                    {triggeredAlerts.length > 0 ? (
                      <div className="space-y-4">
                        {triggeredAlerts.map((alert) => (
                          <AlertCard
                            key={alert.id}
                            alert={alert}
                            onDelete={handleDeleteAlert}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-16"
                      >
                        <ApperIcon name="History" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                          No triggered alerts yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Your successful price alerts will appear here when they're triggered
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('active')}
                          icon="ArrowLeft"
                        >
                          View Active Alerts
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;