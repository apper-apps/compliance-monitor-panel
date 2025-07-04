import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import PolicyCard from '@/components/molecules/PolicyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { policyService } from '@/services/api/policyService'

const Policies = () => {
  const navigate = useNavigate()
  const [policies, setPolicies] = useState([])
  const [filteredPolicies, setFilteredPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filterOptions = [
    { value: 'all', label: 'All Policies' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    loadPolicies()
  }, [])

  useEffect(() => {
    filterPolicies()
  }, [policies, searchTerm, selectedFilter])

  const loadPolicies = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await policyService.getAll()
      setPolicies(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterPolicies = () => {
    let filtered = policies

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(policy => policy.status === selectedFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPolicies(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCreatePolicy = () => {
    navigate('/policies/create')
  }

  const handleEditPolicy = (policy) => {
    navigate(`/policies/${policy.Id}/edit`)
  }

  const handleDeletePolicy = async (policy) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyService.delete(policy.Id)
        setPolicies(policies.filter(p => p.Id !== policy.Id))
        toast.success('Policy deleted successfully')
      } catch (err) {
        toast.error('Failed to delete policy')
      }
    }
  }

  const handleViewPolicy = (policy) => {
    // In a real app, this would open a modal or navigate to a view page
    toast.info('Policy view functionality coming soon')
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPolicies} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policies</h1>
          <p className="text-gray-600 mt-1">
            Manage and customize your privacy compliance documents
          </p>
        </div>
        <Button onClick={handleCreatePolicy} variant="primary">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Create Policy
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <SearchBar
            placeholder="Search policies..."
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Policy Grid */}
      {filteredPolicies.length === 0 ? (
        <Empty
          title="No policies found"
          description={searchTerm || selectedFilter !== 'all' 
            ? "No policies match your current filters"
            : "Create your first privacy policy to get started with compliance"
          }
          actionLabel="Create Policy"
          onAction={handleCreatePolicy}
          icon="Shield"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <motion.div
              key={policy.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PolicyCard
                policy={policy}
                onEdit={handleEditPolicy}
                onDelete={handleDeletePolicy}
                onView={handleViewPolicy}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Policy Templates */}
      {policies.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Policy Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'GDPR Privacy Policy',
                description: 'Comprehensive privacy policy for EU compliance',
                icon: 'Shield'
              },
              {
                title: 'CCPA Privacy Policy',
                description: 'California consumer privacy compliance',
                icon: 'UserCheck'
              },
              {
                title: 'Cookie Policy',
                description: 'Detailed cookie usage and tracking policy',
                icon: 'Cookie'
              },
              {
                title: 'Terms of Service',
                description: 'Standard terms and conditions template',
                icon: 'FileText'
              },
              {
                title: 'Data Processing Agreement',
                description: 'GDPR compliant data processing terms',
                icon: 'Database'
              },
              {
                title: 'E-commerce Privacy Policy',
                description: 'Specialized for online retail businesses',
                icon: 'ShoppingCart'
              }
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={handleCreatePolicy}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name={template.icon} className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{template.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Policies