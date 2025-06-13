import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FeaturedSection from '@/components/organisms/FeaturedSection';
import BookCard from '@/components/molecules/BookCard';
import GenreGrid from '@/components/molecules/GenreGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { bookService, userService } from '@/services';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingBook, setSavingBook] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [trending, genreList] = await Promise.all([
          bookService.getTrending(),
          bookService.getGenres()
        ]);
        
        setTrendingBooks(trending);
        setGenres(genreList.slice(0, 12)); // Show first 12 genres
      } catch (error) {
        console.error('Failed to load home data:', error);
        toast.error('Failed to load home content');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

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

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Featured Section */}
        <section>
          <FeaturedSection />
        </section>

        {/* Trending Books */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-gray-900 mb-2">
                Trending Now
              </h2>
              <p className="text-gray-600">
                Discover what everyone's reading this week
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate('/discover')}
              icon="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookCard 
                    book={book}
                    onSave={handleSaveBook}
                    showPrice={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Browse by Genre */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-gray-900 mb-2">
                Browse by Genre
              </h2>
              <p className="text-gray-600">
                Find your next favorite book by exploring different categories
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-lg p-6 text-center border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                </motion.div>
              ))}
            </div>
          ) : (
            <GenreGrid genres={genres} />
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <ApperIcon name="Bell" className="w-16 h-16 text-accent mx-auto mb-4" />
            </div>
            
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">
              Never Miss a Deal
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Set price alerts for your favorite books and get notified when they go on sale.
              Compare prices across multiple retailers and save money on every purchase.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/discover')}
                icon="Search"
              >
                Discover Books
              </Button>
              
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/dashboard')}
                icon="Bell"
              >
                My Alerts
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;