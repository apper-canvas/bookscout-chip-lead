import { useState, forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  icon,
  iconPosition = 'left',
  error,
  helperText,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = props.value || props.defaultValue;
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const inputClasses = `
    w-full px-4 py-3 text-base border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'border-gray-300'}
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${icon && iconPosition === 'right' || isPasswordType ? 'pr-12' : ''}
    ${className}
  `.trim();

  const labelClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    ${focused || hasValue 
      ? 'top-0 -translate-y-1/2 text-xs bg-white px-2 text-primary' 
      : 'top-1/2 -translate-y-1/2 text-gray-500'
    }
  `.trim();

  return (
    <div className={`relative ${containerClassName}`}>
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={20} />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}

        {/* Right Icon or Password Toggle */}
        {(icon && iconPosition === 'right') || isPasswordType ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
              </button>
            ) : (
              <div className="text-gray-400">
                <ApperIcon name={icon} size={20} />
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;