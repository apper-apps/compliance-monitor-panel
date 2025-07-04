import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { policyService } from '@/services/api/policyService'

const PolicyCreator = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1: Policy Type
    type: '',
    title: '',
    description: '',
    
    // Step 2: Business Information
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessCountry: '',
    businessWebsite: '',
    dataController: '',
    contactEmail: '',
    
    // Step 3: Policy Configuration
    dataCollection: {
      personalData: false,
      cookies: false,
      analytics: false,
      marketing: false,
      thirdParty: false
    },
    legalBasis: '',
    retentionPeriod: '',
    userRights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: true,
      objection: true
    },
    
    // Step 4: Customization
    additionalClauses: '',
    language: 'en',
    jurisdiction: '',
    
    // Meta
    status: 'draft'
  })

  const steps = [
    {
      id: 1,
      title: 'Policy Type',
      description: 'Choose the type of policy you want to create',
      icon: 'FileText'
    },
    {
      id: 2,
      title: 'Business Information',
      description: 'Enter your business details',
      icon: 'Building'
    },
    {
      id: 3,
      title: 'Policy Configuration',
      description: 'Configure data handling and user rights',
      icon: 'Settings'
    },
    {
      id: 4,
      title: 'Review & Customize',
      description: 'Review and customize your policy',
      icon: 'Check'
    }
  ]

  const policyTypes = [
    {
      value: 'privacy-policy',
      label: 'Privacy Policy',
      description: 'Comprehensive privacy policy for your website',
      icon: 'Shield'
    },
    {
      value: 'cookie-policy',
      label: 'Cookie Policy',
      description: 'Detailed cookie usage and tracking policy',
      icon: 'Cookie'
    },
    {
      value: 'terms-of-service',
      label: 'Terms of Service',
      description: 'Terms and conditions for your services',
      icon: 'FileText'
    },
    {
      value: 'gdpr-compliance',
      label: 'GDPR Compliance',
      description: 'GDPR specific privacy policy',
      icon: 'Lock'
    },
    {
      value: 'ccpa-compliance',
      label: 'CCPA Compliance',
      description: 'California consumer privacy compliance',
      icon: 'UserCheck'
    }
  ]

  const businessTypes = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS Platform' },
    { value: 'blog', label: 'Blog/Content Site' },
    { value: 'corporate', label: 'Corporate Website' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'agency', label: 'Digital Agency' },
    { value: 'other', label: 'Other' }
  ]

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'au', label: 'Australia' },
    { value: 'other', label: 'Other' }
  ]

  const legalBasisOptions = [
    { value: 'consent', label: 'Consent' },
    { value: 'contract', label: 'Contract' },
    { value: 'legal-obligation', label: 'Legal Obligation' },
    { value: 'vital-interests', label: 'Vital Interests' },
    { value: 'public-task', label: 'Public Task' },
    { value: 'legitimate-interests', label: 'Legitimate Interests' }
  ]

  useEffect(() => {
    if (isEditing) {
      loadPolicy()
    }
  }, [id])

  const loadPolicy = async () => {
    try {
      setError(null)
      setLoading(true)
      const policy = await policyService.getById(parseInt(id))
      setFormData(policy)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async (status = 'draft') => {
    try {
      setSaving(true)
      const policyData = {
        ...formData,
        status,
        lastUpdated: new Date().toISOString()
      }

      if (isEditing) {
        await policyService.update(parseInt(id), policyData)
        toast.success('Policy updated successfully')
      } else {
        await policyService.create(policyData)
        toast.success('Policy created successfully')
      }
      
      navigate('/policies')
    } catch (err) {
      toast.error('Failed to save policy')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    handleSave('active')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Policy Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policyTypes.map((type) => (
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
                      handleInputChange('title', type.label)
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
                  label="Policy Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter policy title"
                  required
                />
                <FormField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of this policy"
                />
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your business name"
                  required
                />
                <FormField
                  type="select"
                  label="Business Type"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  options={businessTypes}
                  required
                />
                <FormField
                  label="Business Website"
                  value={formData.businessWebsite}
                  onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  required
                />
                <FormField
                  type="select"
                  label="Country"
                  value={formData.businessCountry}
                  onChange={(e) => handleInputChange('businessCountry', e.target.value)}
                  options={countries}
                  required
                />
                <FormField
                  label="Business Address"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Full business address"
                  className="md:col-span-2"
                />
                <FormField
                  label="Data Controller"
                  value={formData.dataController}
                  onChange={(e) => handleInputChange('dataController', e.target.value)}
                  placeholder="Name of data controller"
                />
                <FormField
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="privacy@yourcompany.com"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Collection & Processing
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select the types of data you collect:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.dataCollection).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNestedChange('dataCollection', key, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Legal Basis"
                value={formData.legalBasis}
                onChange={(e) => handleInputChange('legalBasis', e.target.value)}
                options={legalBasisOptions}
                required
              />
              <FormField
                label="Data Retention Period"
                value={formData.retentionPeriod}
                onChange={(e) => handleInputChange('retentionPeriod', e.target.value)}
                placeholder="e.g., 2 years"
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">User Rights</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.userRights).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNestedChange('userRights', key, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        Right to {key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review & Customize
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Policy Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Type:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business:</span>
                    <span className="font-medium">{formData.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{formData.businessCountry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Legal Basis:</span>
                    <span className="font-medium">{formData.legalBasis}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <FormField
                label="Additional Clauses"
                value={formData.additionalClauses}
                onChange={(e) => handleInputChange('additionalClauses', e.target.value)}
                placeholder="Add any additional clauses or customizations..."
                type="textarea"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
              />
              <FormField
                label="Jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                placeholder="e.g., California, USA"
              />
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
    return <Error message={error} onRetry={loadPolicy} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Policy' : 'Create Policy'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your existing policy' : 'Create a comprehensive privacy policy'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/policies')}
        >
          <ApperIcon name="X" className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <ApperIcon name="Check" className="h-5 w-5" />
                ) : (
                  <ApperIcon name={step.icon} className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600 mt-1">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
        >
          <ApperIcon name="ChevronLeft" className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
            loading={saving}
          >
            Save Draft
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              variant="success"
              onClick={handlePublish}
              disabled={saving}
              loading={saving}
            >
              <ApperIcon name="Check" className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Policy' : 'Publish Policy'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!formData.type}
            >
              Next
              <ApperIcon name="ChevronRight" className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PolicyCreator