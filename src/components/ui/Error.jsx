import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mb-4">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="mb-4"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <p className="text-sm text-gray-500">
          If this problem persists, please contact support.
        </p>
      </div>
    </motion.div>
  )
}

export default Error