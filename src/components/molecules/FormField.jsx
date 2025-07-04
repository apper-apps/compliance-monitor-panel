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