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
    { id: 'workspaces', label: 'Workspaces', icon: 'Building' },
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

  const [workspaces, setWorkspaces] = useState([
    { 
      Id: 1, 
      name: 'Production Website', 
      domain: 'mycompany.com', 
      customDomain: 'privacy.mycompany.com',
      cnameStatus: 'verified',
      isActive: true,
      createdAt: '2024-01-15',
      brandLogo: null
    },
    { 
      Id: 2, 
      name: 'Development Site', 
      domain: 'dev.mycompany.com', 
      customDomain: 'privacy-dev.mycompany.com',
      cnameStatus: 'pending',
      isActive: false,
      createdAt: '2024-02-01',
      brandLogo: null
    }
  ])

  const [brandLogo, setBrandLogo] = useState(null)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState(null)
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    domain: '',
    customDomain: ''
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

  const handleWorkspaceCreate = async () => {
    if (!workspaceForm.name || !workspaceForm.domain) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const newWorkspace = {
        Id: Math.max(...workspaces.map(w => w.Id)) + 1,
        name: workspaceForm.name,
        domain: workspaceForm.domain,
        customDomain: workspaceForm.customDomain || '',
        cnameStatus: workspaceForm.customDomain ? 'pending' : 'none',
        isActive: false,
        createdAt: new Date().toISOString().split('T')[0],
        brandLogo: null
      }
      setWorkspaces(prev => [...prev, newWorkspace])
      setWorkspaceForm({ name: '', domain: '', customDomain: '' })
      setShowWorkspaceModal(false)
      setLoading(false)
      toast.success('Workspace created successfully')
    }, 800)
  }

  const handleWorkspaceEdit = (workspace) => {
    setEditingWorkspace(workspace)
    setWorkspaceForm({
      name: workspace.name,
      domain: workspace.domain,
      customDomain: workspace.customDomain
    })
    setShowWorkspaceModal(true)
  }

  const handleWorkspaceUpdate = async () => {
    if (!workspaceForm.name || !workspaceForm.domain) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setWorkspaces(prev => prev.map(w => 
        w.Id === editingWorkspace.Id 
          ? { 
              ...w, 
              name: workspaceForm.name,
              domain: workspaceForm.domain,
              customDomain: workspaceForm.customDomain,
              cnameStatus: workspaceForm.customDomain && workspaceForm.customDomain !== w.customDomain ? 'pending' : w.cnameStatus
            }
          : w
      ))
      setWorkspaceForm({ name: '', domain: '', customDomain: '' })
      setEditingWorkspace(null)
      setShowWorkspaceModal(false)
      setLoading(false)
      toast.success('Workspace updated successfully')
    }, 800)
  }

  const handleWorkspaceDelete = async (workspaceId) => {
    if (!confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      setWorkspaces(prev => prev.filter(w => w.Id !== workspaceId))
      setLoading(false)
      toast.success('Workspace deleted successfully')
    }, 500)
  }

  const handleWorkspaceToggle = async (workspaceId) => {
    setLoading(true)
    setTimeout(() => {
      setWorkspaces(prev => prev.map(w => 
        w.Id === workspaceId 
          ? { ...w, isActive: !w.isActive }
          : w
      ))
      setLoading(false)
      toast.success('Workspace status updated')
    }, 500)
  }

  const handleBrandLogoUpload = () => {
    // Simulate file upload
    toast.success('Brand logo uploaded successfully')
    setBrandLogo('https://via.placeholder.com/64x64/2563EB/ffffff?text=LOGO')
  }

  const verifyCNAME = async (workspaceId) => {
    setLoading(true)
    setTimeout(() => {
      setWorkspaces(prev => prev.map(w => 
        w.Id === workspaceId 
          ? { ...w, cnameStatus: Math.random() > 0.5 ? 'verified' : 'failed' }
          : w
      ))
      setLoading(false)
      const workspace = workspaces.find(w => w.Id === workspaceId)
      toast.success(`CNAME verification completed for ${workspace?.name}`)
    }, 1500)
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

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Logo
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {brandLogo ? (
                    <img src={brandLogo} alt="Brand Logo" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <ApperIcon name="Image" className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={handleBrandLogoUpload}>
                    <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                    {brandLogo ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG or SVG recommended. Maximum file size 1MB.
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

      case 'workspaces':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Workspace Management
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your workspaces and custom domain configurations
                </p>
              </div>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => {
                  setEditingWorkspace(null)
                  setWorkspaceForm({ name: '', domain: '', customDomain: '' })
                  setShowWorkspaceModal(true)
                }}
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Workspace
              </Button>
            </div>

            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div key={workspace.Id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        workspace.isActive ? 'bg-success text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <ApperIcon name="Building" className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{workspace.name}</h4>
                        <p className="text-sm text-gray-500">{workspace.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleWorkspaceToggle(workspace.Id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          workspace.isActive 
                            ? 'bg-success/10 text-success' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {workspace.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWorkspaceEdit(workspace)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWorkspaceDelete(workspace.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {workspace.customDomain && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">Custom Domain (CNAME)</h5>
                          <p className="text-sm text-gray-600 font-mono">{workspace.customDomain}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Point your CNAME record to: <span className="font-mono">widgets.compliancehub.io</span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            workspace.cnameStatus === 'verified' 
                              ? 'bg-success/10 text-success'
                              : workspace.cnameStatus === 'pending'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-error/10 text-error'
                          }`}>
                            {workspace.cnameStatus.charAt(0).toUpperCase() + workspace.cnameStatus.slice(1)}
                          </span>
                          {workspace.cnameStatus !== 'verified' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verifyCNAME(workspace.Id)}
                            >
                              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Workspace Modal */}
            {showWorkspaceModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingWorkspace ? 'Edit Workspace' : 'Create Workspace'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowWorkspaceModal(false)
                        setEditingWorkspace(null)
                        setWorkspaceForm({ name: '', domain: '', customDomain: '' })
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      label="Workspace Name"
                      value={workspaceForm.name}
                      onChange={(e) => setWorkspaceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Production Website"
                    />
                    <FormField
                      label="Primary Domain"
                      value={workspaceForm.domain}
                      onChange={(e) => setWorkspaceForm(prev => ({ ...prev, domain: e.target.value }))}
                      placeholder="e.g., mycompany.com"
                    />
                    <FormField
                      label="Custom Domain (CNAME) - Optional"
                      value={workspaceForm.customDomain}
                      onChange={(e) => setWorkspaceForm(prev => ({ ...prev, customDomain: e.target.value }))}
                      placeholder="e.g., privacy.mycompany.com"
                    />
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <ApperIcon name="Info" className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">CNAME Setup Instructions:</p>
                          <p className="text-xs mt-1">
                            Create a CNAME record pointing your custom domain to: 
                            <span className="font-mono bg-blue-100 px-1 rounded ml-1">widgets.compliancehub.io</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowWorkspaceModal(false)
                        setEditingWorkspace(null)
                        setWorkspaceForm({ name: '', domain: '', customDomain: '' })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={editingWorkspace ? handleWorkspaceUpdate : handleWorkspaceCreate}
                      loading={loading}
                      disabled={loading}
                    >
                      {editingWorkspace ? 'Update' : 'Create'} Workspace
                    </Button>
                  </div>
                </div>
              </div>
            )}
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