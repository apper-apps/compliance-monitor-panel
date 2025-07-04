import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'status-badge active',
    inactive: 'status-badge inactive',
    pending: 'status-badge pending',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    info: 'bg-info/10 text-info border-info/20',
    primary: 'bg-primary/10 text-primary border-primary/20'
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base'
  }
  
  const classes = `status-badge ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge