import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import WidgetCard from '@/components/molecules/WidgetCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { widgetService } from '@/services/api/widgetService'

const Widgets = () => {
  const navigate = useNavigate()
  const [widgets, setWidgets] = useState([])
  const [filteredWidgets, setFilteredWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filterOptions = [
    { value: 'all', label: 'All Widgets' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    loadWidgets()
  }, [])

  useEffect(() => {
    filterWidgets()
  }, [widgets, searchTerm, selectedFilter])

  const loadWidgets = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await widgetService.getAll()
      setWidgets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterWidgets = () => {
    let filtered = widgets

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(widget => widget.status === selectedFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(widget =>
        widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredWidgets(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCreateWidget = () => {
    navigate('/widgets/builder')
  }

  const handleEditWidget = (widget) => {
    navigate(`/widgets/${widget.Id}/edit`)
  }

  const handleToggleWidget = async (widget) => {
    try {
      const newStatus = widget.status === 'active' ? 'inactive' : 'active'
      await widgetService.update(widget.Id, { ...widget, status: newStatus })
      setWidgets(widgets.map(w => 
        w.Id === widget.Id ? { ...w, status: newStatus } : w
      ))
      toast.success(`Widget ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch (err) {
      toast.error('Failed to update widget status')
    }
  }

  const handleDeleteWidget = async (widget) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      try {
        await widgetService.delete(widget.Id)
        setWidgets(widgets.filter(w => w.Id !== widget.Id))
        toast.success('Widget deleted successfully')
      } catch (err) {
        toast.error('Failed to delete widget')
      }
    }
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadWidgets} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Widgets</h1>
          <p className="text-gray-600 mt-1">
            Deploy and manage your privacy compliance widgets
          </p>
        </div>
        <Button onClick={handleCreateWidget} variant="primary">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Create Widget
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <SearchBar
            placeholder="Search widgets..."
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Widget Grid */}
      {filteredWidgets.length === 0 ? (
        <Empty
          title="No widgets found"
          description={searchTerm || selectedFilter !== 'all' 
            ? "No widgets match your current filters"
            : "Create your first compliance widget to get started"
          }
          actionLabel="Create Widget"
          onAction={handleCreateWidget}
          icon="Layout"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map((widget) => (
            <motion.div
              key={widget.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WidgetCard
                widget={widget}
                onEdit={handleEditWidget}
                onDelete={handleDeleteWidget}
                onToggle={handleToggleWidget}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Widget Templates */}
      {widgets.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Widget Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Cookie Banner',
                description: 'GDPR compliant cookie consent banner',
                icon: 'Cookie'
              },
              {
                title: 'Privacy Center',
                description: 'User privacy preference center',
                icon: 'Shield'
              },
              {
                title: 'Consent Form',
                description: 'Data processing consent form',
                icon: 'CheckSquare'
              },
              {
                title: 'Preference Center',
                description: 'Marketing preference management',
                icon: 'Settings'
              },
              {
                title: 'Data Request Form',
                description: 'User data request and deletion form',
                icon: 'FileText'
              },
              {
                title: 'CCPA Notice',
                description: 'California consumer privacy notice',
                icon: 'AlertTriangle'
              }
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={handleCreateWidget}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name={template.icon} className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{template.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Guide */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Need Help Integrating?</h3>
            <p className="text-blue-100">
              Our step-by-step integration guides make it easy to deploy widgets on any platform
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Globe" className="h-5 w-5" />
                <span>Web Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Wordpress" className="h-5 w-5" />
                <span>WordPress Plugin</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="ShoppingBag" className="h-5 w-5" />
                <span>Shopify App</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button variant="secondary" size="lg">
              <ApperIcon name="BookOpen" className="h-5 w-5 mr-2" />
              View Guides
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Widgets