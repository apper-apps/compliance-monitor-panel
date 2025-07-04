import { useState } from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
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
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`input-field ${
          error ? 'border-error focus:border-error' : 
          focused ? 'border-primary' : 'border-gray-200'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default Input