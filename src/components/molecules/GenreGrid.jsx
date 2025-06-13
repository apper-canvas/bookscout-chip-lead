import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const GenreGrid = ({ genres, className = '' }) => {
  const navigate = useNavigate();

  const genreIcons = {
    'Fiction': 'Book',
    'Science Fiction': 'Rocket',
    'Fantasy': 'Sparkles',
    'Mystery': 'Search',
    'Romance': 'Heart',
    'Thriller': 'Zap',
    'Horror': 'Ghost',
    'Biography': 'User',
    'History': 'Clock',
    'Self-Help': 'Target',
    'Business': 'Briefcase',
    'Psychology': 'Brain',
    'Philosophy': 'Lightbulb',
    'Contemporary': 'Calendar',
    'Classic': 'BookOpen',
    'Adventure': 'Map',
    'Crime': 'Shield',
    'Humor': 'Smile',
    'Drama': 'Drama',
    'Literary Fiction': 'Feather',
    'Memoir': 'FileText',
    'Education': 'GraduationCap',
    'Productivity': 'CheckCircle',
    'Finance': 'DollarSign'
  };

  const handleGenreClick = (genre) => {
    navigate(`/discover?genres=${encodeURIComponent(genre)}`);
  };

  const genreVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {genres.map((genre, index) => (
        <motion.button
          key={genre}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={genreVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleGenreClick(genre)}
          className="bg-surface rounded-lg p-6 text-center border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-3">
            <ApperIcon 
              name={genreIcons[genre] || 'Book'} 
              size={32} 
              className="mx-auto text-primary group-hover:text-accent transition-colors" 
            />
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors break-words">
            {genre}
          </h3>
        </motion.button>
      ))}
    </div>
  );
};

export default GenreGrid;