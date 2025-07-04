import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ClientCard = ({ 
  client, 
  onView, 
  onEdit, 
  onDelete, 
  className = '',
  ...props 
}) => {
  const statusVariants = {
    active: 'success',
    inactive: 'default',
    pending: 'warning'
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
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.website}</p>
          </div>
        </div>
        <Badge variant={statusVariants[client.status]}>
          {client.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span>Created: {format(new Date(client.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="FileText" className="h-4 w-4" />
          <span>{client.policies?.length || 0} policies</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Layout" className="h-4 w-4" />
          <span>{client.widgets?.length || 0} widgets</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(client)}
          >
            <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit?.(client)}
          >
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete?.(client)}
          className="text-error hover:text-error hover:bg-error/10"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

export default ClientCard