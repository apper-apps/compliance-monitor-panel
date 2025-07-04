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
import policyService from "@/services/api/policyService";
import dashboardService from "@/services/api/dashboardService";
import widgetService from "@/services/api/widgetService";
function Dashboard() {
  const navigate = useNavigate()
  const userRole = 'agency' // This would come from auth context
  
  const [dashboardData, setDashboardData] = useState(null)
  const [recentPolicies, setRecentPolicies] = useState([])
  const [recentWidgets, setRecentWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [policiesLoading, setPoliciesLoading] = useState(false)
  const [widgetsLoading, setWidgetsLoading] = useState(false)
  
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