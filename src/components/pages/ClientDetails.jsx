import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import StatsCard from '@/components/molecules/StatsCard'
import PolicyCard from '@/components/molecules/PolicyCard'
import WidgetCard from '@/components/molecules/WidgetCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { clientService } from '@/services/api/clientService'

const ClientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'policies', label: 'Policies', icon: 'Shield' },
    { id: 'widgets', label: 'Widgets', icon: 'Layout' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ]

  useEffect(() => {
    loadClient()
  }, [id])

  const loadClient = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await clientService.getById(parseInt(id))
      setClient(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePolicy = () => {
    navigate('/policies/create')
  }

  const handleCreateWidget = () => {
    navigate('/widgets/builder')
  }

  const statusVariants = {
    active: 'success',
    inactive: 'default',
    pending: 'warning'
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadClient} />
  }

  if (!client) {
    return (
      <Empty
        title="Client not found"
        description="The client you're looking for doesn't exist"
        actionLabel="Back to Clients"
        onAction={() => navigate('/clients')}
        icon="Users"
      />
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Compliance Score"
                value={`${client.complianceScore || 85}%`}
                change="+5%"
                changeType="positive"
                icon="ShieldCheck"
              />
              <StatsCard
                title="Active Policies"
                value={client.policies?.length || 0}
                change="+2"
                changeType="positive"
                icon="FileText"
              />
              <StatsCard
                title="Deployed Widgets"
                value={client.widgets?.length || 0}
                change="+1"
                changeType="positive"
                icon="Layout"
              />
              <StatsCard
                title="Monthly Views"
                value={client.monthlyViews?.toLocaleString() || '0'}
                change="+15%"
                changeType="positive"
                icon="Eye"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {client.recentActivity?.map((activity) => (
                  <div key={activity.Id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name={activity.icon} className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compliance Checklist
              </h3>
              <div className="space-y-3">
                {[
                  { task: 'Privacy Policy Created', completed: true },
                  { task: 'Cookie Banner Deployed', completed: true },
                  { task: 'GDPR Compliance Verified', completed: false },
                  { task: 'Data Processing Agreement', completed: false },
                  { task: 'Monthly Review Scheduled', completed: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-success text-white' : 'bg-gray-200'
                    }`}>
                      {item.completed && <ApperIcon name="Check" className="h-3 w-3" />}
                    </div>
                    <span className={`text-sm ${
                      item.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'policies':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Policies
              </h3>
              <Button onClick={handleCreatePolicy} variant="primary" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </div>

            {client.policies?.length === 0 ? (
              <Empty
                title="No policies created"
                description="Create the first policy for this client"
                actionLabel="Create Policy"
                onAction={handleCreatePolicy}
                icon="Shield"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.policies?.map((policy) => (
                  <PolicyCard
                    key={policy.Id}
                    policy={policy}
                    onEdit={() => navigate(`/policies/${policy.Id}/edit`)}
                    onView={() => toast.info('Policy view functionality coming soon')}
                    onDelete={() => toast.info('Policy delete functionality coming soon')}
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'widgets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Widgets
              </h3>
              <Button onClick={handleCreateWidget} variant="primary" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Create Widget
              </Button>
            </div>

            {client.widgets?.length === 0 ? (
              <Empty
                title="No widgets deployed"
                description="Deploy the first widget for this client"
                actionLabel="Create Widget"
                onAction={handleCreateWidget}
                icon="Layout"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.widgets?.map((widget) => (
                  <WidgetCard
                    key={widget.Id}
                    widget={widget}
                    onEdit={() => navigate(`/widgets/${widget.Id}/edit`)}
                    onToggle={() => toast.info('Widget toggle functionality coming soon')}
                    onDelete={() => toast.info('Widget delete functionality coming soon')}
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Settings
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={client.name}
                      readOnly
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      value={client.website}
                      readOnly
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={client.email}
                      readOnly
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <Badge variant={statusVariants[client.status]}>
                      {client.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                    Edit Client
                  </Button>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    Send Update
                  </Button>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan
                    </label>
                    <p className="text-sm text-gray-900">{client.plan || 'Professional'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Revenue
                    </label>
                    <p className="text-sm text-gray-900">${client.monthlyRevenue || 99}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Billing
                    </label>
                    <p className="text-sm text-gray-900">{client.nextBilling || 'March 15, 2024'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <Badge variant="success">Paid</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/clients')}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">{client.website}</p>
              <Badge variant={statusVariants[client.status]}>
                {client.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button variant="primary" size="sm">
            <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
            Contact Client
          </Button>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Client Overview</h2>
            <div className="space-y-1">
              <p className="text-blue-100">
                <span className="font-medium">Industry:</span> {client.industry || 'E-commerce'}
              </p>
              <p className="text-blue-100">
                <span className="font-medium">Client Since:</span> {new Date(client.createdAt).toLocaleDateString()}
              </p>
              <p className="text-blue-100">
                <span className="font-medium">Last Activity:</span> {client.lastActivity || '2 hours ago'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{client.complianceScore || 85}%</div>
            <div className="text-blue-100">Compliance Score</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default ClientDetails