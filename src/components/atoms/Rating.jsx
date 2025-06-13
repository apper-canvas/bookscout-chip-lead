import ApperIcon from '@/components/ApperIcon';

const Rating = ({ 
  value = 0, 
  max = 5, 
  size = 16, 
  showValue = true,
  showCount = false,
  count = 0,
  className = '' 
}) => {
  const stars = [];
  
  for (let i = 1; i <= max; i++) {
    const filled = i <= Math.floor(value);
    const halfFilled = i === Math.ceil(value) && value % 1 !== 0;
    
    stars.push(
      <div key={i} className="relative">
        <ApperIcon 
          name="Star" 
          size={size} 
          className="text-gray-300" 
        />
        {(filled || halfFilled) && (
          <ApperIcon 
            name="Star" 
            size={size} 
            className={`absolute inset-0 text-warning ${
              halfFilled ? 'w-1/2 overflow-hidden' : ''
            }`}
            fill="currentColor"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {showCount && count > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default Rating;