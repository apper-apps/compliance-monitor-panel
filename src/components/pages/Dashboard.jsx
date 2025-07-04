import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Policies from "@/components/pages/Policies";
import Widgets from "@/components/pages/Widgets";
import PolicyCard from "@/components/molecules/PolicyCard";
import StatsCard from "@/components/molecules/StatsCard";
import WidgetCard from "@/components/molecules/WidgetCard";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";
import policyService from "@/services/api/policyService";
import dashboardService from "@/services/api/dashboardService";
import widgetService from "@/services/api/widgetService";
function Dashboard() {
  const navigate = useNavigate()
  const userRole = 'agency' // This would come from auth context
  
const [dashboardData, setDashboardData] = useState(null)
  const [recentPolicies, setRecentPolicies] = useState([])
  const [recentWidgets, setRecentWidgets] = useState([])
  const [policyAlerts, setPolicyAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [policiesLoading, setPoliciesLoading] = useState(false)
  const [widgetsLoading, setWidgetsLoading] = useState(false)
  const [alertsExpanded, setAlertsExpanded] = useState(false)
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [dashboardResponse, policiesResponse, widgetsResponse] = await Promise.all([
        dashboardService.getStats(),
        policyService.getRecentPolicies(),
        widgetService.getRecentWidgets()
      ])
      
      // Handle dashboard stats
      if (dashboardResponse?.success) {
        setDashboardData(dashboardResponse.data)
        // Extract intelligent policy alerts
        if (dashboardResponse.data?.policyAlerts) {
          setPolicyAlerts(dashboardResponse.data.policyAlerts)
        }
      } else {
        console.error('Failed to load dashboard stats:', dashboardResponse?.error)
      }
      
      // Handle recent policies - extract data from response
      if (policiesResponse?.success && Array.isArray(policiesResponse.data)) {
        setRecentPolicies(policiesResponse.data)
      } else if (Array.isArray(policiesResponse)) {
        // Fallback for direct array response
        setRecentPolicies(policiesResponse)
      } else {
        console.error('Failed to load recent policies:', policiesResponse?.error)
        setRecentPolicies([])
      }
      
      // Handle recent widgets - extract data from response
      if (widgetsResponse?.success && Array.isArray(widgetsResponse.data)) {
        setRecentWidgets(widgetsResponse.data)
      } else if (Array.isArray(widgetsResponse)) {
        // Fallback for direct array response
        setRecentWidgets(widgetsResponse)
      } else {
        console.error('Failed to load recent widgets:', widgetsResponse?.error)
        setRecentWidgets([])
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleAlertAction = async (alert, action) => {
    try {
      switch (action) {
        case 'review':
          if (alert.policyId) {
            navigate(`/policies/${alert.policyId}/edit`)
          } else {
            navigate('/policies')
          }
          break
        case 'dismiss':
          setPolicyAlerts(prev => prev.filter(a => a.Id !== alert.Id))
          toast.success('Alert dismissed')
          break
        case 'update':
          if (alert.policyId) {
            navigate(`/policies/${alert.policyId}/edit`)
          }
          break
        case 'view_all':
          navigate('/policies?alerts=true')
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Failed to handle alert action')
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'expiring': return 'Clock'
      case 'regulatory': return 'AlertTriangle'
      case 'compliance': return 'ShieldAlert'
      case 'recommendation': return 'Lightbulb'
      case 'update': return 'RefreshCw'
      default: return 'Info'
    }
  }

  const getAlertVariant = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'info'
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
            onClick={() => navigate('/ai-assistant')}
            className="flex-col space-y-2 h-auto py-6"
          >
            <ApperIcon name="MessageCircle" className="h-8 w-8" />
            <span>AI Assistant</span>
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
            </Button>
          </div>
          
          <div className="space-y-4">
            {loading || policiesLoading ? (
              <Loading />
            ) : error ? (
              <Error message="Failed to load recent policies" />
            ) : !Array.isArray(recentPolicies) || recentPolicies.length === 0 ? (
              <Empty message="No recent policies available" />
            ) : (
              recentPolicies.slice(0, 3).map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onEdit={handlePolicyEdit}
                  showActions={false}
                  className="mb-4 last:mb-0"
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
            </Button>
          </div>
          
          <div className="space-y-4">
            {loading || widgetsLoading ? (
              <Loading />
            ) : error ? (
              <Error message="Failed to load recent widgets" />
            ) : !Array.isArray(recentWidgets) || recentWidgets.length === 0 ? (
              <Empty message="No recent widgets available" />
            ) : (
              recentWidgets.slice(0, 3).map((widget) => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  onEdit={handleWidgetEdit}
                  showActions={false}
                  variant="compact"
                />
              ))
            )}
          </div>
        </div>
      </div>

{/* Intelligent Policy Updates & Alerts */}
      {policyAlerts && policyAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Intelligent Policy Alerts
              </h3>
              <Badge variant="info" className="text-xs">
                {policyAlerts.length} Active
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAlertAction({}, 'view_all')}
              >
                View All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertsExpanded(!alertsExpanded)}
              >
                <ApperIcon 
                  name={alertsExpanded ? 'ChevronUp' : 'ChevronDown'} 
                  className="h-4 w-4" 
                />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {(alertsExpanded ? policyAlerts : policyAlerts.slice(0, 3)).map((alert) => (
              <motion.div
                key={alert.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border rounded-lg p-4 ${
                  alert.priority === 'high' ? 'border-red-200 bg-red-50' :
                  alert.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.priority === 'high' ? 'bg-red-100' :
                    alert.priority === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <ApperIcon 
                      name={getAlertIcon(alert.type)} 
                      className={`h-4 w-4 ${
                        alert.priority === 'high' ? 'text-red-600' :
                        alert.priority === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {alert.title}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.description}
                        </p>
                        {alert.policyName && (
                          <p className="text-xs text-gray-500 mb-2">
                            Policy: {alert.policyName}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{alert.timestamp}</span>
                          {alert.deadline && (
                            <span className="text-red-600 font-medium">
                              Deadline: {alert.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1 ml-4">
                        <Badge variant={getAlertVariant(alert.priority)} size="sm">
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {alert.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      {alert.actions?.map((action) => (
                        <Button
                          key={action.type}
                          variant={action.type === 'primary' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleAlertAction(alert, action.action)}
                          className="text-xs"
                        >
                          <ApperIcon name={action.icon} className="h-3 w-3 mr-1" />
                          {action.label}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAlertAction(alert, 'dismiss')}
                        className="text-xs text-gray-500"
                      >
                        <ApperIcon name="X" className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {!alertsExpanded && policyAlerts.length > 3 && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertsExpanded(true)}
                className="text-sm text-gray-600"
              >
                Show {policyAlerts.length - 3} more alerts
                <ApperIcon name="ChevronDown" className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard