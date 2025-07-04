import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookieConsent')
    if (!hasConsent) {
      setTimeout(() => setIsVisible(true), 1000) // Show after 1 second
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const rejected = {
      essential: true, // Essential cookies cannot be rejected
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(rejected))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(savedPreferences))
    setIsVisible(false)
    setShowSettings(false)
  }

  const handlePreferenceChange = (category, value) => {
    if (category === 'essential') return // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const cookieCategories = [
    {
      key: 'essential',
      title: 'Essential Cookies',
      description: 'Required for basic website functionality and cannot be disabled.',
      required: true
    },
    {
      key: 'functional',
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality like chat widgets and personalization.'
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website to improve user experience.'
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to track visitors and show relevant advertisements.'
    },
    {
      key: 'preferences',
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for future visits.'
    }
  ]

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="cookie-consent-banner"
      >
        <div className="bg-white border border-gray-200 rounded-t-xl shadow-2xl max-w-4xl mx-auto">
          {!showSettings ? (
            // Basic consent banner
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Cookie" className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We use essential cookies to make our website work. We'd also like to set optional cookies 
                    to help us improve our website and analyze how it's used. We won't set optional cookies 
                    unless you enable them.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none"
                    >
                      Accept All Cookies
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none"
                    >
                      Reject Optional
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSettings(true)}
                      className="flex-1 sm:flex-none"
                    >
                      <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Detailed settings panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {cookieCategories.map((category) => (
                  <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{category.title}</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[category.key]}
                          onChange={(e) => handlePreferenceChange(category.key, e.target.checked)}
                          disabled={category.required}
                          className="sr-only peer"
                        />
                        <div className={`relative w-11 h-6 rounded-full transition-colors ${
                          preferences[category.key] 
                            ? 'bg-primary' 
                            : 'bg-gray-200'
                        } ${category.required ? 'opacity-50' : ''}`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                            preferences[category.key] ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    {category.required && (
                      <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Always Active
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={handleSavePreferences}
                  className="flex-1 sm:flex-none"
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none"
                >
                  Accept All
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  For more information about how we use cookies, please see our{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/cookie-policy" className="text-primary hover:underline">
                    Cookie Policy
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieConsentBanner