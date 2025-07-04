import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'input', 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder, 
  required = false, 
  error = null,
  disabled = false,
  className = '',
  ...props 
}) => {
  if (type === 'select') {
    return (
      <Select
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        required={required}
        error={error}
        disabled={disabled}
        className={className}
        {...props}
      />
    )
  }

  if (type === 'richtext') {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div
          contentEditable
          suppressContentEditableWarning={true}
          onInput={(e) => {
            if (onChange) {
              onChange(e.target.innerText || e.target.textContent)
            }
          }}
          onBlur={(e) => {
            if (onChange) {
              onChange(e.target.innerText || e.target.textContent)
            }
          }}
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors duration-200 whitespace-pre-wrap ${
            error ? 'border-error focus:border-error' : 'border-gray-200'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          style={{ 
            minHeight: '200px',
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }}
          {...props}
        >
          {value}
        </div>
        {error && (
          <p className="text-error text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }

  return (
    <Input
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      error={error}
      disabled={disabled}
      className={className}
      {...props}
    />
  )
}

export default FormField