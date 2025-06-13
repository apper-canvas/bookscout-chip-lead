import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Illustration */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="relative mx-auto w-32 h-32">
              <ApperIcon 
                name="BookOpen" 
                className="w-32 h-32 text-primary/30 mx-auto" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-4xl text-primary">
                  404
                </span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Oops! The page you're looking for seems to have gone missing.
            </p>
            <p className="text-gray-500">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/home')}
                icon="Home"
              >
                Go Home
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                icon="ArrowLeft"
              >
                Go Back
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/discover')}
              icon="Search"
            >
              Discover Books Instead
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500">
              Need help? Try searching for books or browse our featured collections.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;