import { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'billing', label: 'Billing', icon: 'CreditCard' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'integrations', label: 'Integrations', icon: 'Link' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ]

  const [accountData, setAccountData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'ComplianceHub Agency',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    role: 'Agency Owner'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      policyUpdates: true,
      clientActivity: true,
      systemAlerts: true,
      weeklyReports: false,
      marketingEmails: false
    },
    browser: {
      realTimeAlerts: true,
      clientRequests: true,
      systemNotifications: true
    },
    mobile: {
      pushNotifications: true,
      urgentAlerts: true,
      dailyDigest: false
    }
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    ipWhitelist: '',
    apiKeyRotation: 'monthly'
  })

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  const handleAccountChange = (field, value) => {
    setAccountData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (category, field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={accountData.name}
                  onChange={(e) => handleAccountChange('name', e.target.value)}
                />
                <FormField
                  label="Email Address"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => handleAccountChange('email', e.target.value)}
                />
                <FormField
                  label="Company Name"
                  value={accountData.company}
                  onChange={(e) => handleAccountChange('company', e.target.value)}
                />
                <FormField
                  label="Phone Number"
                  value={accountData.phone}
                  onChange={(e) => handleAccountChange('phone', e.target.value)}
                />
                <FormField
                  type="select"
                  label="Timezone"
                  value={accountData.timezone}
                  onChange={(e) => handleAccountChange('timezone', e.target.value)}
                  options={[
                    { value: 'America/New_York', label: 'Eastern Time' },
                    { value: 'America/Chicago', label: 'Central Time' },
                    { value: 'America/Denver', label: 'Mountain Time' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time' },
                    { value: 'Europe/London', label: 'GMT' },
                    { value: 'Europe/Paris', label: 'Central European Time' }
                  ]}
                />
                <FormField
                  label="Role"
                  value={accountData.role}
                  disabled
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Picture
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                    Change Picture
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF. Maximum file size 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Plan
              </h3>
              <div className="bg-gradient-primary rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold">Professional Plan</h4>
                    <p className="text-blue-100">Perfect for growing agencies</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$99</div>
                    <div className="text-blue-100">/month</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-blue-100">Clients</div>
                      <div className="font-semibold">25 / 50</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Policies</div>
                      <div className="font-semibold">Unlimited</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Widgets</div>
                      <div className="font-semibold">Unlimited</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">Support</div>
                      <div className="font-semibold">Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <ApperIcon name="CreditCard" className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing History
              </h3>
              <div className="space-y-3">
                {[
                  { date: 'Mar 1, 2024', amount: '$99.00', status: 'Paid' },
                  { date: 'Feb 1, 2024', amount: '$99.00', status: 'Paid' },
                  { date: 'Jan 1, 2024', amount: '$99.00', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center">
                        <ApperIcon name="Check" className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-gray-500">{invoice.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-success">{invoice.status}</span>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Email Notifications
              </h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.email).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {key === 'policyUpdates' && 'Get notified when policies are updated'}
                        {key === 'clientActivity' && 'Receive updates on client activity'}
                        {key === 'systemAlerts' && 'Important system notifications'}
                        {key === 'weeklyReports' && 'Weekly performance reports'}
                        {key === 'marketingEmails' && 'Product updates and marketing content'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Browser Notifications
              </h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.browser).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNotificationChange('browser', key, e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mobile Notifications
              </h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings.mobile).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNotificationChange('mobile', key, e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Integrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Google Analytics', description: 'Track compliance widget performance', icon: 'BarChart', connected: true },
                  { name: 'Slack', description: 'Receive notifications in your Slack workspace', icon: 'MessageSquare', connected: false },
                  { name: 'Zapier', description: 'Connect with 2000+ apps', icon: 'Zap', connected: false },
                  { name: 'Webhook', description: 'Custom webhook integration', icon: 'Link', connected: true },
                  { name: 'WordPress', description: 'WordPress plugin integration', icon: 'Globe', connected: true },
                  { name: 'Shopify', description: 'Shopify app integration', icon: 'ShoppingBag', connected: false }
                ].map((integration) => (
                  <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name={integration.icon} className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "primary"}
                        size="sm"
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API Keys
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Production API Key</h4>
                      <p className="text-sm text-gray-500 font-mono">pk_live_****************************</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Copy" className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Test API Key</h4>
                      <p className="text-sm text-gray-500 font-mono">pk_test_****************************</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Copy" className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Two-Factor Authentication
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      securitySettings.twoFactorAuth ? 'bg-success text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <ApperIcon name="Shield" className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-500">
                        {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={securitySettings.twoFactorAuth ? "outline" : "primary"}
                    size="sm"
                    onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                  >
                    {securitySettings.twoFactorAuth ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Session Management
              </h3>
              <div className="space-y-4">
                <FormField
                  type="select"
                  label="Session Timeout (minutes)"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  options={[
                    { value: 15, label: '15 minutes' },
                    { value: 30, label: '30 minutes' },
                    { value: 60, label: '1 hour' },
                    { value: 240, label: '4 hours' },
                    { value: 480, label: '8 hours' }
                  ]}
                />
                <FormField
                  label="IP Whitelist (comma-separated)"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                />
                <FormField
                  type="select"
                  label="API Key Rotation"
                  value={securitySettings.apiKeyRotation}
                  onChange={(e) => handleSecurityChange('apiKeyRotation', e.target.value)}
                  options={[
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'manual', label: 'Manual' }
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Login', location: 'New York, NY', time: '2 hours ago', ip: '192.168.1.1' },
                  { action: 'Password Changed', location: 'New York, NY', time: '1 day ago', ip: '192.168.1.1' },
                  { action: 'API Key Generated', location: 'New York, NY', time: '3 days ago', ip: '192.168.1.1' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-info/10 rounded flex items-center justify-center">
                        <ApperIcon name="Activity" className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.location} • {activity.ip}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Interface Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Switch to dark theme</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Compact View</p>
                    <p className="text-sm text-gray-500">Show more items per page</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-save</p>
                    <p className="text-sm text-gray-500">Automatically save form changes</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Language & Region
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="select"
                  label="Language"
                  value="en"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' }
                  ]}
                />
                <FormField
                  type="select"
                  label="Date Format"
                  value="MM/DD/YYYY"
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Export
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Export Account Data</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Download all your account data including policies, widgets, and client information.
                  </p>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                    Request Export
                  </Button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="danger" size="sm">
                    <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sticky top-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {renderTabContent()}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              loading={loading}
              disabled={loading}
              variant="primary"
            >
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings