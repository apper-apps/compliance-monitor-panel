import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import policyService from '@/services/api/policyService'

const PolicyCreator = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [detectedCountry, setDetectedCountry] = useState(null)
  const [recommendedPolicies, setRecommendedPolicies] = useState([])
  const [geolocationLoading, setGeolocationLoading] = useState(false)
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
      thirdParty: false,
      biometric: false,
      location: false,
      financial: false
    },
    cookieConsent: {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false
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
      value: 'gdpr-compliance',
      label: 'GDPR Privacy Policy',
      description: 'Comprehensive GDPR-compliant privacy policy with all required sections',
      icon: 'Shield',
      featured: true,
      regions: ['EU', 'EEA'],
      countries: ['de', 'fr', 'it', 'es', 'nl', 'be', 'at', 'dk', 'fi', 'se', 'ie', 'pt', 'gr', 'lu', 'cy', 'mt', 'si', 'sk', 'ee', 'lv', 'lt', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr'],
      badge: 'GDPR Ready'
    },
    {
      value: 'pdpa-thailand',
      label: 'PDPA Thailand Policy',
      description: 'Personal Data Protection Act (PDPA) compliance for Thailand',
      icon: 'Shield',
      featured: true,
      regions: ['APAC'],
      countries: ['th'],
      badge: 'PDPA Ready'
    },
    {
      value: 'pdpa-singapore',
      label: 'PDPA Singapore Policy',
      description: 'Personal Data Protection Act compliance for Singapore',
      icon: 'Shield',
      featured: true,
      regions: ['APAC'],
      countries: ['sg'],
      badge: 'PDPA Ready'
    },
    {
      value: 'ccpa-compliance',
      label: 'CCPA Privacy Notice',
      description: 'California Consumer Privacy Act compliance',
      icon: 'UserCheck',
      featured: true,
      regions: ['NA'],
      countries: ['us'],
      badge: 'CCPA Ready'
    },
    {
      value: 'pipeda-canada',
      label: 'PIPEDA Privacy Policy',
      description: 'Personal Information Protection and Electronic Documents Act compliance',
      icon: 'Shield',
      featured: true,
      regions: ['NA'],
      countries: ['ca'],
      badge: 'PIPEDA Ready'
    },
    {
      value: 'terms-of-service',
      label: 'Terms of Service',
      description: 'Comprehensive terms and conditions with legal protections',
      icon: 'FileText',
      featured: true,
      regions: ['Global'],
      countries: [],
      badge: 'Universal'
    },
    {
      value: 'cookie-policy',
      label: 'Cookie Consent Policy',
      description: 'Cookie consent with granular controls',
      icon: 'Cookie',
      featured: true,
      regions: ['Global'],
      countries: [],
      badge: 'Global'
    },
    {
      value: 'privacy-policy',
      label: 'General Privacy Policy',
      description: 'Standard privacy policy for basic compliance',
      icon: 'Lock',
      regions: ['Global'],
      countries: [],
      badge: 'Basic'
    },
    {
      value: 'lgpd-brazil',
      label: 'LGPD Privacy Policy',
      description: 'Lei Geral de Proteção de Dados compliance for Brazil',
      icon: 'Shield',
      regions: ['SA'],
      countries: ['br'],
      badge: 'LGPD Ready'
    },
    {
      value: 'privacy-act-australia',
      label: 'Privacy Act Policy',
      description: 'Australian Privacy Principles compliance',
      icon: 'Shield',
      regions: ['APAC'],
      countries: ['au'],
      badge: 'APP Ready'
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
    // North America
    { value: 'us', label: 'United States', region: 'North America' },
    { value: 'ca', label: 'Canada', region: 'North America' },
    { value: 'mx', label: 'Mexico', region: 'North America' },
    
    // Europe
    { value: 'de', label: 'Germany', region: 'Europe' },
    { value: 'fr', label: 'France', region: 'Europe' },
    { value: 'uk', label: 'United Kingdom', region: 'Europe' },
    { value: 'it', label: 'Italy', region: 'Europe' },
    { value: 'es', label: 'Spain', region: 'Europe' },
    { value: 'nl', label: 'Netherlands', region: 'Europe' },
    { value: 'be', label: 'Belgium', region: 'Europe' },
    { value: 'at', label: 'Austria', region: 'Europe' },
    { value: 'ch', label: 'Switzerland', region: 'Europe' },
    { value: 'dk', label: 'Denmark', region: 'Europe' },
    { value: 'fi', label: 'Finland', region: 'Europe' },
    { value: 'se', label: 'Sweden', region: 'Europe' },
    { value: 'no', label: 'Norway', region: 'Europe' },
    { value: 'ie', label: 'Ireland', region: 'Europe' },
    { value: 'pt', label: 'Portugal', region: 'Europe' },
    { value: 'gr', label: 'Greece', region: 'Europe' },
    { value: 'pl', label: 'Poland', region: 'Europe' },
    { value: 'cz', label: 'Czech Republic', region: 'Europe' },
    { value: 'hu', label: 'Hungary', region: 'Europe' },
    { value: 'ro', label: 'Romania', region: 'Europe' },
    { value: 'bg', label: 'Bulgaria', region: 'Europe' },
    { value: 'hr', label: 'Croatia', region: 'Europe' },
    { value: 'si', label: 'Slovenia', region: 'Europe' },
    { value: 'sk', label: 'Slovakia', region: 'Europe' },
    { value: 'ee', label: 'Estonia', region: 'Europe' },
    { value: 'lv', label: 'Latvia', region: 'Europe' },
    { value: 'lt', label: 'Lithuania', region: 'Europe' },
    { value: 'lu', label: 'Luxembourg', region: 'Europe' },
    { value: 'cy', label: 'Cyprus', region: 'Europe' },
    { value: 'mt', label: 'Malta', region: 'Europe' },
    
    // Asia Pacific
    { value: 'th', label: 'Thailand', region: 'Asia Pacific' },
    { value: 'sg', label: 'Singapore', region: 'Asia Pacific' },
    { value: 'my', label: 'Malaysia', region: 'Asia Pacific' },
    { value: 'id', label: 'Indonesia', region: 'Asia Pacific' },
    { value: 'ph', label: 'Philippines', region: 'Asia Pacific' },
    { value: 'vn', label: 'Vietnam', region: 'Asia Pacific' },
    { value: 'jp', label: 'Japan', region: 'Asia Pacific' },
    { value: 'kr', label: 'South Korea', region: 'Asia Pacific' },
    { value: 'cn', label: 'China', region: 'Asia Pacific' },
    { value: 'hk', label: 'Hong Kong', region: 'Asia Pacific' },
    { value: 'tw', label: 'Taiwan', region: 'Asia Pacific' },
    { value: 'au', label: 'Australia', region: 'Asia Pacific' },
    { value: 'nz', label: 'New Zealand', region: 'Asia Pacific' },
    { value: 'in', label: 'India', region: 'Asia Pacific' },
    
    // South America
    { value: 'br', label: 'Brazil', region: 'South America' },
    { value: 'ar', label: 'Argentina', region: 'South America' },
    { value: 'cl', label: 'Chile', region: 'South America' },
    { value: 'co', label: 'Colombia', region: 'South America' },
    { value: 'pe', label: 'Peru', region: 'South America' },
    { value: 'uy', label: 'Uruguay', region: 'South America' },
    
    // Africa & Middle East
    { value: 'za', label: 'South Africa', region: 'Africa' },
    { value: 'ng', label: 'Nigeria', region: 'Africa' },
    { value: 'eg', label: 'Egypt', region: 'Africa' },
    { value: 'ae', label: 'United Arab Emirates', region: 'Middle East' },
    { value: 'sa', label: 'Saudi Arabia', region: 'Middle East' },
    { value: 'il', label: 'Israel', region: 'Middle East' },
    
    { value: 'other', label: 'Other', region: 'Other' }
  ]

const legalBasisOptions = [
    { value: 'consent', label: 'Consent (Article 6(1)(a))' },
    { value: 'contract', label: 'Contract Performance (Article 6(1)(b))' },
    { value: 'legal-obligation', label: 'Legal Obligation (Article 6(1)(c))' },
    { value: 'vital-interests', label: 'Vital Interests (Article 6(1)(d))' },
    { value: 'public-task', label: 'Public Task (Article 6(1)(e))' },
    { value: 'legitimate-interests', label: 'Legitimate Interests (Article 6(1)(f))' }
  ]

useEffect(() => {
    if (isEditing) {
      loadPolicy()
    } else {
      detectUserLocation()
    }
  }, [id])

  const detectUserLocation = async () => {
    try {
      setGeolocationLoading(true)
      const country = await policyService.detectUserCountry()
      if (country) {
        setDetectedCountry(country)
        handleInputChange('businessCountry', country)
        updateRecommendedPolicies(country)
      }
    } catch (err) {
      console.warn('Geolocation detection failed:', err.message)
    } finally {
      setGeolocationLoading(false)
    }
  }

  const updateRecommendedPolicies = (countryCode) => {
    const recommended = policyTypes.filter(type => 
      type.countries.length === 0 || type.countries.includes(countryCode)
    ).map(type => type.value)
    setRecommendedPolicies(recommended)
  }

  useEffect(() => {
    if (formData.businessCountry) {
      updateRecommendedPolicies(formData.businessCountry)
    }
  }, [formData.businessCountry])

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
            {/* Geolocation Detection Status */}
            {geolocationLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin">
                    <ApperIcon name="Globe" className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Detecting your location...</p>
                    <p className="text-xs text-blue-700">We'll recommend the best policy types for your region</p>
                  </div>
                </div>
              </div>
            )}

            {detectedCountry && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="MapPin" className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Location detected: {countries.find(c => c.value === detectedCountry)?.label}
                    </p>
                    <p className="text-xs text-green-700">Policy recommendations updated based on your location</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Policy Type
              </h3>
              
              {/* Recommended Policies Section */}
              {recommendedPolicies.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <ApperIcon name="Star" className="h-4 w-4 text-yellow-500 mr-2" />
                    Recommended for Your Location
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {policyTypes
                      .filter(type => recommendedPolicies.includes(type.value))
                      .map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100'
                          }`}
                          onClick={() => {
                            handleInputChange('type', type.value)
                            handleInputChange('title', type.label)
                            handleInputChange('description', type.description)
                          }}
                        >
                          <div className="absolute top-2 right-2">
                            <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.type === type.value
                                ? 'bg-primary text-white'
                                : 'bg-yellow-500 text-white'
                            }`}>
                              <ApperIcon name={type.icon} className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{type.label}</h4>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {type.badge}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* All Policy Types */}
              <h4 className="text-md font-medium text-gray-900 mb-3">All Policy Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policyTypes.map((type) => {
                  const isRecommended = recommendedPolicies.includes(type.value)
                  return (
                    <motion.div
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.type === type.value
                          ? 'border-primary bg-primary/5'
                          : isRecommended
                          ? 'border-yellow-200 bg-yellow-50/50 hover:border-yellow-300'
                          : type.featured
                          ? 'border-primary/30 bg-primary/5 hover:border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isRecommended ? 'opacity-60' : ''}`}
                      onClick={() => {
                        handleInputChange('type', type.value)
                        handleInputChange('title', type.label)
                        handleInputChange('description', type.description)
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.type === type.value
                              ? 'bg-primary text-white'
                              : type.featured
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <ApperIcon name={type.icon} className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{type.label}</h4>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {type.badge}
                            </span>
                          </div>
                        </div>
                        {isRecommended && (
                          <span className="text-xs text-yellow-600 font-medium">
                            ↑ Shown above
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      {type.regions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {type.regions.map(region => (
                            <span key={region} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              {region}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
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
                  Select the types of data you collect (GDPR Article 13 & 14):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {(formData.type === 'cookie-policy' || formData.type === 'gdpr-compliance') && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Cookie Consent Categories</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-4">
                    Configure cookie categories for GDPR-compliant consent banner:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.cookieConsent).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedChange('cookieConsent', key, e.target.checked)}
                          disabled={key === 'essential'}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key} {key === 'essential' && '(Required)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Primary Legal Basis (GDPR Article 6)"
                value={formData.legalBasis}
                onChange={(e) => handleInputChange('legalBasis', e.target.value)}
                options={legalBasisOptions}
                required
              />
              <FormField
                label="Data Retention Period"
                value={formData.retentionPeriod}
                onChange={(e) => handleInputChange('retentionPeriod', e.target.value)}
                placeholder="e.g., 24 months, until account deletion"
              />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Subject Rights (GDPR Chapter III)</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select the rights you provide to data subjects:
                </p>
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
                        Right to {key} {key === 'access' && '(Article 15)'}
                        {key === 'rectification' && '(Article 16)'}
                        {key === 'erasure' && '(Article 17)'}
                        {key === 'portability' && '(Article 20)'}
                        {key === 'objection' && '(Article 21)'}
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