import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "FileText",
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-12 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-surface rounded-full mb-6">
          <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            size="lg"
          >
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty