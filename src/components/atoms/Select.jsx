import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  required = false, 
  error = null,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`input-field pr-10 appearance-none ${
            error ? 'border-error focus:border-error' : 
            focused ? 'border-primary' : 'border-gray-200'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default Select