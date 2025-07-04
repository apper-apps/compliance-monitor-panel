import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const WidgetCard = ({ 
  widget, 
  onEdit, 
  onDelete, 
  onToggle, 
  className = '',
  ...props 
}) => {
  const statusVariants = {
    active: 'success',
    inactive: 'default'
  }

const typeIcons = {
    'cookie-banner': 'Cookie',
    'privacy-center': 'Shield',
    'consent-form': 'CheckSquare',
    'preference-center': 'Settings',
    'hipaa-privacy-notice': 'Heart',
    'financial-privacy-notice': 'DollarSign',
    'biometric-data-notice': 'Fingerprint'
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
            <ApperIcon name={typeIcons[widget.type] || 'Layout'} className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{widget.name}</h3>
            <p className="text-sm text-gray-500">{widget.description}</p>
          </div>
        </div>
        <Badge variant={statusVariants[widget.status]}>
          {widget.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>Created: {format(new Date(widget.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Globe" className="h-4 w-4" />
          <span>{widget.platform}</span>
        </div>
        
        {widget.impressions && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Eye" className="h-4 w-4" />
            <span>{widget.impressions.toLocaleString()} impressions</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle?.(widget)}
          >
            <ApperIcon name={widget.status === 'active' ? 'Pause' : 'Play'} className="h-4 w-4 mr-2" />
            {widget.status === 'active' ? 'Pause' : 'Activate'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit?.(widget)}
          >
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete?.(widget)}
          className="text-error hover:text-error hover:bg-error/10"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

export default WidgetCard