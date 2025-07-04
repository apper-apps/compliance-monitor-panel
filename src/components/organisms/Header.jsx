import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuToggle }) => {
  const location = useLocation()
  const [notifications] = useState([
    { id: 1, text: 'New policy update available', type: 'info', unread: true },
    { id: 2, text: 'Widget deployment successful', type: 'success', unread: true },
    { id: 3, text: 'Client approval required', type: 'warning', unread: false }
  ])

  const getPageTitle = () => {
    const pathTitles = {
      '/': 'Dashboard',
      '/policies': 'Policies',
      '/policies/create': 'Create Policy',
      '/widgets': 'Widgets',
      '/widgets/builder': 'Widget Builder',
      '/clients': 'Clients',
      '/settings': 'Settings',
      '/support': 'Support'
    }
    return pathTitles[location.pathname] || 'ComplianceHub'
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-500">Manage your privacy compliance</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar 
              placeholder="Search policies, clients..." 
              className="w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <ApperIcon name="Bell" className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

{/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Policy
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/ai-assistant'}>
              <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="primary" size="sm">
              <ApperIcon name="Layout" className="h-4 w-4 mr-2" />
              Deploy Widget
            </Button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <ApperIcon name="ChevronDown" className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header