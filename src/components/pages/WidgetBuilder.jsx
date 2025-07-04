import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import widgetService from '@/services/api/widgetService'

const WidgetBuilder = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
const [activeTab, setActiveTab] = useState('type')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Settings
    name: '',
    type: '',
    description: '',
    
    // Appearance
    appearance: {
      theme: 'light',
      primaryColor: '#2563EB',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '8',
      position: 'bottom-right',
      size: 'medium',
      animation: 'slide-up'
    },
    
    // Content
    content: {
      title: '',
      message: '',
      acceptText: 'Accept',
      declineText: 'Decline',
      manageText: 'Manage Preferences',
      privacyPolicyUrl: '',
      cookiePolicyUrl: ''
    },
    
    // Behavior
    behavior: {
      showOnLoad: true,
      showOnScroll: false,
      scrollPercentage: 50,
      showOnExit: false,
      autoHide: false,
      autoHideDelay: 5000,
      rememberChoice: true,
      blockingMode: false
    },
    
    // Targeting
    targeting: {
      countries: [],
      devices: ['desktop', 'mobile', 'tablet'],
      pages: [],
      excludePages: []
    },
    
    // Integration
    platform: 'web',
    integrationCode: '',
    
    // Meta
    status: 'inactive',
    createdAt: new Date().toISOString()
  })

  const tabs = [
    { id: 'type', label: 'Widget Type', icon: 'Layout' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'content', label: 'Content', icon: 'Type' },
    { id: 'behavior', label: 'Behavior', icon: 'Settings' },
    { id: 'targeting', label: 'Targeting', icon: 'Target' },
    { id: 'integration', label: 'Integration', icon: 'Code' }
  ]

const widgetTypes = [
    {
      value: 'cookie-banner',
      label: 'Cookie Banner',
      description: 'GDPR compliant cookie consent banner',
      icon: 'Cookie'
    },
    {
      value: 'privacy-center',
      label: 'Privacy Center',
      description: 'User privacy preference center',
      icon: 'Shield'
    },
    {
      value: 'consent-form',
      label: 'Consent Form',
      description: 'Data processing consent form',
      icon: 'CheckSquare'
    },
    {
      value: 'preference-center',
      label: 'Preference Center',
      description: 'Marketing preference management',
      icon: 'Settings'
    },
    {
      value: 'hipaa-privacy-notice',
      label: 'HIPAA Privacy Notice',
      description: 'HIPAA-compliant privacy notice for healthcare entities',
      icon: 'Heart'
    },
    {
      value: 'financial-privacy-notice',
      label: 'Financial Privacy Notice',
      description: 'Financial privacy notice for banking and finance',
      icon: 'DollarSign'
    },
    {
      value: 'biometric-data-notice',
      label: 'Biometric Data Notice',
      description: 'Biometric data collection and processing notice',
      icon: 'Fingerprint'
    }
  ]

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' }
  ]

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' },
    { value: 'top-banner', label: 'Top Banner' },
    { value: 'bottom-banner', label: 'Bottom Banner' }
  ]

  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ]

  const animations = [
    { value: 'none', label: 'None' },
    { value: 'fade-in', label: 'Fade In' },
    { value: 'slide-up', label: 'Slide Up' },
    { value: 'slide-down', label: 'Slide Down' },
    { value: 'scale-in', label: 'Scale In' }
  ]

  const platforms = [
    { value: 'web', label: 'Web/HTML' },
    { value: 'wordpress', label: 'WordPress' },
    { value: 'shopify', label: 'Shopify' },
    { value: 'wix', label: 'Wix' },
    { value: 'squarespace', label: 'Squarespace' }
  ]

  useEffect(() => {
    if (isEditing) {
      loadWidget()
    }
  }, [id])

  useEffect(() => {
    generateIntegrationCode()
  }, [formData.type, formData.appearance, formData.content, formData.behavior])

  const loadWidget = async () => {
    try {
      setError(null)
      setLoading(true)
      const widget = await widgetService.getById(parseInt(id))
      setFormData(widget)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateIntegrationCode = () => {
    const code = `<!-- ComplianceHub Widget -->
<script src="https://cdn.compliancehub.com/widgets/widget.js"></script>
<script>
  ComplianceHub.init({
    type: '${formData.type}',
    theme: '${formData.appearance.theme}',
    position: '${formData.appearance.position}',
    primaryColor: '${formData.appearance.primaryColor}',
    title: '${formData.content.title}',
    message: '${formData.content.message}',
    acceptText: '${formData.content.acceptText}',
    declineText: '${formData.content.declineText}',
    privacyPolicyUrl: '${formData.content.privacyPolicyUrl}',
    showOnLoad: ${formData.behavior.showOnLoad},
    rememberChoice: ${formData.behavior.rememberChoice}
  });
</script>`
    
    setFormData(prev => ({ ...prev, integrationCode: code }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleSave = async (status = 'inactive') => {
    try {
      setSaving(true)
      const widgetData = {
        ...formData,
        status,
        lastUpdated: new Date().toISOString()
      }

      if (isEditing) {
        await widgetService.update(parseInt(id), widgetData)
        toast.success('Widget updated successfully')
      } else {
        await widgetService.create(widgetData)
        toast.success('Widget created successfully')
      }
      
      navigate('/widgets')
    } catch (err) {
      toast.error('Failed to save widget')
    } finally {
      setSaving(false)
    }
  }

  const handleDeploy = () => {
    handleSave('active')
}

  const getContentPlaceholder = (field) => {
    const placeholders = {
      'hipaa-privacy-notice': {
        title: 'HIPAA Privacy Notice',
        message: 'This notice describes how medical information about you may be used and disclosed...',
        policyUrl: 'https://yoursite.com/hipaa-privacy',
        secondaryUrl: 'https://yoursite.com/patient-rights'
      },
      'financial-privacy-notice': {
        title: 'Financial Privacy Notice',
        message: 'We collect and use your personal financial information to provide banking services...',
        policyUrl: 'https://yoursite.com/financial-privacy',
        secondaryUrl: 'https://yoursite.com/opt-out'
      },
      'biometric-data-notice': {
        title: 'Biometric Data Notice',
        message: 'We collect biometric data for security and identification purposes...',
        policyUrl: 'https://yoursite.com/biometric-privacy',
        secondaryUrl: 'https://yoursite.com/biometric-consent'
      }
    }
    
    const defaults = {
      title: 'We use cookies',
      message: 'We use cookies to improve your experience on our website...',
      policyUrl: 'https://yoursite.com/privacy',
      secondaryUrl: 'https://yoursite.com/cookies'
    }
    
    return placeholders[formData.type]?.[field] || defaults[field]
  }

  const getContentLabel = (field) => {
    const labels = {
      'hipaa-privacy-notice': {
        policyUrl: 'HIPAA Privacy Policy URL',
        secondaryUrl: 'Patient Rights URL'
      },
      'financial-privacy-notice': {
        policyUrl: 'Financial Privacy Policy URL',
        secondaryUrl: 'Opt-Out URL'
      },
      'biometric-data-notice': {
        policyUrl: 'Biometric Privacy Policy URL',
        secondaryUrl: 'Consent Form URL'
      }
    }
    
    const defaults = {
      policyUrl: 'Privacy Policy URL',
      secondaryUrl: 'Cookie Policy URL'
    }
    
    return labels[formData.type]?.[field] || defaults[field]
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case 'type':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Widget Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {widgetTypes.map((type) => (
                  <motion.div
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      handleInputChange('type', type.value)
                      handleInputChange('name', type.label)
                      handleInputChange('description', type.description)
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.type === type.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <ApperIcon name={type.icon} className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{type.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {formData.type && (
              <div className="space-y-4">
                <FormField
                  label="Widget Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter widget name"
                  required
                />
                <FormField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this widget"
                />
              </div>
            )}
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customize Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    type="select"
                    label="Theme"
                    value={formData.appearance.theme}
                    onChange={(e) => handleNestedChange('appearance', 'theme', e.target.value)}
                    options={themes}
                  />
                  
                  <FormField
                    type="select"
                    label="Position"
                    value={formData.appearance.position}
                    onChange={(e) => handleNestedChange('appearance', 'position', e.target.value)}
                    options={positions}
                  />
                  
                  <FormField
                    type="select"
                    label="Size"
                    value={formData.appearance.size}
                    onChange={(e) => handleNestedChange('appearance', 'size', e.target.value)}
                    options={sizes}
                  />
                  
                  <FormField
                    type="select"
                    label="Animation"
                    value={formData.appearance.animation}
                    onChange={(e) => handleNestedChange('appearance', 'animation', e.target.value)}
                    options={animations}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={formData.appearance.primaryColor}
                      onChange={(e) => handleNestedChange('appearance', 'primaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={formData.appearance.backgroundColor}
                      onChange={(e) => handleNestedChange('appearance', 'backgroundColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={formData.appearance.textColor}
                      onChange={(e) => handleNestedChange('appearance', 'textColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  
                  <FormField
                    label="Border Radius (px)"
                    type="number"
                    value={formData.appearance.borderRadius}
                    onChange={(e) => handleNestedChange('appearance', 'borderRadius', e.target.value)}
                    placeholder="8"
                  />
                </div>
              </div>
            </div>
          </div>
        )

case 'content':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Widget Content
              </h3>
              <div className="space-y-4">
                <FormField
                  label="Title"
                  value={formData.content.title}
                  onChange={(e) => handleNestedChange('content', 'title', e.target.value)}
                  placeholder={getContentPlaceholder('title')}
                />
                
                <FormField
                  label="Message"
                  value={formData.content.message}
                  onChange={(e) => handleNestedChange('content', 'message', e.target.value)}
                  placeholder={getContentPlaceholder('message')}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Accept Button Text"
                    value={formData.content.acceptText}
                    onChange={(e) => handleNestedChange('content', 'acceptText', e.target.value)}
                    placeholder="Accept"
                  />
                  
                  <FormField
                    label="Decline Button Text"
                    value={formData.content.declineText}
                    onChange={(e) => handleNestedChange('content', 'declineText', e.target.value)}
                    placeholder="Decline"
                  />
                  
                  <FormField
                    label="Learn More Button Text"
                    value={formData.content.manageText}
                    onChange={(e) => handleNestedChange('content', 'manageText', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={getContentLabel('policyUrl')}
                    value={formData.content.privacyPolicyUrl}
                    onChange={(e) => handleNestedChange('content', 'privacyPolicyUrl', e.target.value)}
                    placeholder={getContentPlaceholder('policyUrl')}
                  />
                  
                  <FormField
                    label={getContentLabel('secondaryUrl')}
                    value={formData.content.cookiePolicyUrl}
                    onChange={(e) => handleNestedChange('content', 'cookiePolicyUrl', e.target.value)}
                    placeholder={getContentPlaceholder('secondaryUrl')}
                  />
                </div>

                {/* Specialized Content for Compliance Notices */}
                {(formData.type === 'hipaa-privacy-notice' || 
                  formData.type === 'financial-privacy-notice' || 
                  formData.type === 'biometric-data-notice') && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">Compliance Information</h4>
                    <div className="space-y-4">
                      <FormField
                        label="Entity Name"
                        value={formData.content.entityName || ''}
                        onChange={(e) => handleNestedChange('content', 'entityName', e.target.value)}
                        placeholder="Your Organization Name"
                      />
                      <FormField
                        label="Contact Information"
                        value={formData.content.contactInfo || ''}
                        onChange={(e) => handleNestedChange('content', 'contactInfo', e.target.value)}
                        placeholder="Privacy Officer contact details"
                      />
                      <FormField
                        label="Effective Date"
                        type="date"
                        value={formData.content.effectiveDate || ''}
                        onChange={(e) => handleNestedChange('content', 'effectiveDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'behavior':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Widget Behavior
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Display Triggers</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.showOnLoad}
                        onChange={(e) => handleNestedChange('behavior', 'showOnLoad', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Show immediately on page load</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.showOnScroll}
                        onChange={(e) => handleNestedChange('behavior', 'showOnScroll', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Show on scroll</span>
                    </label>
                    
                    {formData.behavior.showOnScroll && (
                      <div className="ml-7">
                        <FormField
                          label="Scroll Percentage"
                          type="number"
                          value={formData.behavior.scrollPercentage}
                          onChange={(e) => handleNestedChange('behavior', 'scrollPercentage', parseInt(e.target.value))}
                          placeholder="50"
                        />
                      </div>
                    )}
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.showOnExit}
                        onChange={(e) => handleNestedChange('behavior', 'showOnExit', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Show on exit intent</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Auto-Hide Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.autoHide}
                        onChange={(e) => handleNestedChange('behavior', 'autoHide', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Auto-hide after delay</span>
                    </label>
                    
                    {formData.behavior.autoHide && (
                      <div className="ml-7">
                        <FormField
                          label="Auto-hide Delay (ms)"
                          type="number"
                          value={formData.behavior.autoHideDelay}
                          onChange={(e) => handleNestedChange('behavior', 'autoHideDelay', parseInt(e.target.value))}
                          placeholder="5000"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Other Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.rememberChoice}
                        onChange={(e) => handleNestedChange('behavior', 'rememberChoice', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Remember user choice</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.behavior.blockingMode}
                        onChange={(e) => handleNestedChange('behavior', 'blockingMode', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Blocking mode (disable page until consent)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'targeting':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Targeting Rules
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Device Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {['desktop', 'mobile', 'tablet'].map((device) => (
                      <label key={device} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.targeting.devices.includes(device)}
                          onChange={(e) => {
                            const devices = e.target.checked
                              ? [...formData.targeting.devices, device]
                              : formData.targeting.devices.filter(d => d !== device)
                            handleNestedChange('targeting', 'devices', devices)
                          }}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 capitalize">{device}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <FormField
                    label="Target Countries (comma-separated)"
                    value={formData.targeting.countries.join(', ')}
                    onChange={(e) => handleNestedChange('targeting', 'countries', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                    placeholder="US, CA, GB, DE"
                  />
                </div>
                
                <div>
                  <FormField
                    label="Target Pages (comma-separated paths)"
                    value={formData.targeting.pages.join(', ')}
                    onChange={(e) => handleNestedChange('targeting', 'pages', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                    placeholder="/home, /products, /about"
                  />
                </div>
                
                <div>
                  <FormField
                    label="Exclude Pages (comma-separated paths)"
                    value={formData.targeting.excludePages.join(', ')}
                    onChange={(e) => handleNestedChange('targeting', 'excludePages', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                    placeholder="/admin, /login"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'integration':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Integration Code
              </h3>
              <div className="space-y-4">
                <FormField
                  type="select"
                  label="Platform"
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  options={platforms}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Code
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.integrationCode}
                      readOnly
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(formData.integrationCode)
                        toast.success('Code copied to clipboard!')
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded border hover:bg-gray-50"
                    >
                      <ApperIcon name="Copy" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Integration Instructions</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>1. Copy the integration code above</p>
                    <p>2. Paste it before the closing &lt;/body&gt; tag on your website</p>
                    <p>3. Save and publish your changes</p>
                    <p>4. Test the widget on your live site</p>
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadWidget} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Widget' : 'Create Widget'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your existing widget' : 'Build and deploy your compliance widget'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/widgets')}
        >
          <ApperIcon name="X" className="h-4 w-4 mr-2" />
          Cancel
        </Button>
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

          {/* Widget Preview */}
          {formData.type && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Widget Preview
              </h3>
              <div className="bg-gray-100 rounded-lg p-8 relative min-h-[300px]">
                <div 
                  className="absolute bg-white rounded-lg shadow-lg border p-4 max-w-sm"
                  style={{
                    backgroundColor: formData.appearance.backgroundColor,
                    color: formData.appearance.textColor,
                    borderRadius: `${formData.appearance.borderRadius}px`,
                    ...(formData.appearance.position.includes('right') && { right: '20px' }),
                    ...(formData.appearance.position.includes('left') && { left: '20px' }),
                    ...(formData.appearance.position.includes('top') && { top: '20px' }),
                    ...(formData.appearance.position.includes('bottom') && { bottom: '20px' }),
                    ...(formData.appearance.position === 'center' && { 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)' 
                    })
                  }}
                >
                  {formData.content.title && (
                    <h4 className="font-semibold mb-2">{formData.content.title}</h4>
                  )}
                  {formData.content.message && (
                    <p className="text-sm mb-4">{formData.content.message}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm rounded font-medium text-white"
                      style={{ backgroundColor: formData.appearance.primaryColor }}
                    >
                      {formData.content.acceptText}
                    </button>
                    <button className="px-3 py-1 text-sm rounded font-medium border">
                      {formData.content.declineText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
)}

          {/* Preview Modal */}
          {showPreview && formData.type && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Widget Preview</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-100 rounded-lg p-8 relative min-h-[400px]">
                    <div 
                      className="absolute bg-white rounded-lg shadow-xl border p-6 max-w-md"
                      style={{
                        backgroundColor: formData.appearance.backgroundColor,
                        color: formData.appearance.textColor,
                        borderRadius: `${formData.appearance.borderRadius}px`,
                        ...(formData.appearance.position.includes('right') && { right: '20px' }),
                        ...(formData.appearance.position.includes('left') && { left: '20px' }),
                        ...(formData.appearance.position.includes('top') && { top: '20px' }),
                        ...(formData.appearance.position.includes('bottom') && { bottom: '20px' }),
                        ...(formData.appearance.position === 'center' && { 
                          top: '50%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)' 
                        })
                      }}
                    >
                      {formData.content.title && (
                        <h4 className="text-lg font-semibold mb-3">{formData.content.title}</h4>
                      )}
                      {formData.content.message && (
                        <p className="text-sm mb-4 leading-relaxed">{formData.content.message}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="px-4 py-2 text-sm rounded font-medium text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: formData.appearance.primaryColor }}
                        >
                          {formData.content.acceptText}
                        </button>
                        <button className="px-4 py-2 text-sm rounded font-medium border border-gray-300 hover:bg-gray-50">
                          {formData.content.declineText}
                        </button>
                        {formData.content.manageText && (
                          <button className="px-4 py-2 text-sm rounded font-medium text-blue-600 hover:underline">
                            {formData.content.manageText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Live preview of your {formData.type.replace('-', ' ')} widget
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSave('inactive')}
                disabled={saving}
                loading={saving}
              >
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            
            <Button
              variant="success"
              onClick={handleDeploy}
              disabled={saving || !formData.type}
              loading={saving}
            >
              <ApperIcon name="Rocket" className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Widget' : 'Deploy Widget'}
            </Button>
          </div>
<Button
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                Preview
              </Button>
        </div>
      </div>
    </div>
  )
}

export default WidgetBuilder