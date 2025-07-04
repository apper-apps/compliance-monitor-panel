import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatsCard from '@/components/molecules/StatsCard'
import PolicyCard from '@/components/molecules/PolicyCard'
import WidgetCard from '@/components/molecules/WidgetCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { dashboardService } from '@/services/api/dashboardService'
import { policyService } from '@/services/api/policyService'
import { widgetService } from '@/services/api/widgetService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [recentPolicies, setRecentPolicies] = useState([])
  const [recentWidgets, setRecentWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRole] = useState('agency') // This would come from auth context

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const [dashboard, policies, widgets] = await Promise.all([
        dashboardService.getOverview(),
        policyService.getRecent(),
        widgetService.getRecent()
      ])
      
      setDashboardData(dashboard)
      setRecentPolicies(policies)
      setRecentWidgets(widgets)
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

  const handlePolicyEdit = (policy) => {
    navigate(`/policies/${policy.Id}/edit`)
  }

  const handleWidgetEdit = (widget) => {
    navigate(`/widgets/${widget.Id}/edit`)
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  const getStatsCards = () => {
    if (userRole === 'agency') {
      return [
        {
          title: 'Total Clients',
          value: dashboardData?.totalClients || 0,
          change: '+12%',
          changeType: 'positive',
          icon: 'Users'
        },
        {
          title: 'Active Policies',
          value: dashboardData?.activePolicies || 0,
          change: '+8%',
          changeType: 'positive',
          icon: 'Shield'
        },
        {
          title: 'Deployed Widgets',
          value: dashboardData?.deployedWidgets || 0,
          change: '+15%',
          changeType: 'positive',
          icon: 'Layout'
        },
        {
          title: 'Monthly Revenue',
          value: `$${dashboardData?.monthlyRevenue?.toLocaleString() || 0}`,
          change: '+22%',
          changeType: 'positive',
          icon: 'DollarSign'
        }
      ]
    }

    return [
      {
        title: 'Compliance Score',
        value: `${dashboardData?.complianceScore || 0}%`,
        change: '+5%',
        changeType: 'positive',
        icon: 'ShieldCheck'
      },
      {
        title: 'Active Policies',
        value: dashboardData?.activePolicies || 0,
        change: '+2',
        changeType: 'positive',
        icon: 'FileText'
      },
      {
        title: 'Widget Impressions',
        value: dashboardData?.widgetImpressions?.toLocaleString() || 0,
        change: '+18%',
        changeType: 'positive',
        icon: 'Eye'
      },
      {
        title: 'Data Requests',
        value: dashboardData?.dataRequests || 0,
        change: '+3',
        changeType: 'positive',
        icon: 'Database'
      }
    ]
  }

  const statsCards = getStatsCards()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {dashboardData?.userName || 'User'}!
            </h2>
            <p className="text-blue-100 text-lg">
              {userRole === 'agency' 
                ? 'Manage your clients and grow your compliance business'
                : 'Your privacy compliance is up to date'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCreatePolicy}
            className="flex-col space-y-2 h-auto py-6"
          >
            <ApperIcon name="Plus" className="h-8 w-8" />
            <span>Create Policy</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleCreateWidget}
            className="flex-col space-y-2 h-auto py-6"
          >
            <ApperIcon name="Layout" className="h-8 w-8" />
            <span>Deploy Widget</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/policies')}
            className="flex-col space-y-2 h-auto py-6"
          >
            <ApperIcon name="FileText" className="h-8 w-8" />
            <span>View Policies</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/support')}
            className="flex-col space-y-2 h-auto py-6"
          >
            <ApperIcon name="HelpCircle" className="h-8 w-8" />
            <span>Get Help</span>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Policies */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Policies</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/policies')}
            >
              View All
              <ApperIcon name="ChevronRight" className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentPolicies.length === 0 ? (
              <Empty
                title="No policies yet"
                description="Create your first privacy policy to get started"
                actionLabel="Create Policy"
                onAction={handleCreatePolicy}
                icon="FileText"
              />
            ) : (
              recentPolicies.slice(0, 3).map((policy) => (
                <PolicyCard
                  key={policy.Id}
                  policy={policy}
                  onEdit={handlePolicyEdit}
                  className="shadow-sm"
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Widgets */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Widgets</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/widgets')}
            >
              View All
              <ApperIcon name="ChevronRight" className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentWidgets.length === 0 ? (
              <Empty
                title="No widgets yet"
                description="Deploy your first compliance widget"
                actionLabel="Deploy Widget"
                onAction={handleCreateWidget}
                icon="Layout"
              />
            ) : (
              recentWidgets.slice(0, 3).map((widget) => (
                <WidgetCard
                  key={widget.Id}
                  widget={widget}
                  onEdit={handleWidgetEdit}
                  className="shadow-sm"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Compliance Alerts
          </h3>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert) => (
              <motion.div
                key={alert.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-warning/10' : 'bg-info/10'
                }`}
              >
                <ApperIcon 
                  name={alert.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                  className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-warning' : 'text-info'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard