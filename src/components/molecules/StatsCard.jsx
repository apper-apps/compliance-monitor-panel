import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  className = '',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-gray-600'
  }

  return (
    <motion.div 
      className={`card p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {change && (
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatsCard