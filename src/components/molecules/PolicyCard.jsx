import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const PolicyCard = ({ 
  policy, 
  onEdit, 
  onDelete, 
  onView, 
  className = '',
  ...props 
}) => {
  const statusVariants = {
    active: 'success',
    draft: 'warning',
    inactive: 'default'
  }

const typeIcons = {
    'privacy-policy': 'Lock',
    'terms-of-service': 'FileText',
    'cookie-policy': 'Cookie',
    'gdpr-compliance': 'Shield',
    'ccpa-compliance': 'UserCheck'
  }

  return (
    <motion.div 
      className={`card p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name={typeIcons[policy.type] || 'FileText'} className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
            <p className="text-sm text-gray-500">{policy.description}</p>
          </div>
        </div>
        <Badge variant={statusVariants[policy.status]}>
          {policy.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>Last updated: {format(new Date(policy.lastUpdated), 'MMM dd, yyyy')}</span>
        </div>
        
        {policy.websites && policy.websites.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Globe" className="h-4 w-4" />
            <span>{policy.websites.length} website(s)</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(policy)}
          >
            <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit?.(policy)}
          >
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete?.(policy)}
          className="text-error hover:text-error hover:bg-error/10"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

export default PolicyCard