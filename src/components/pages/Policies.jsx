import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PolicyCard from "@/components/molecules/PolicyCard";
import SearchBar from "@/components/molecules/SearchBar";
import policyService from "@/services/api/policyService";

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
  { value: 'gdpr-compliance', label: 'GDPR Only' },
  { value: 'terms-of-service', label: 'Terms Only' },
  { value: 'cookie-policy', label: 'Cookie Only' }
];

const Policies = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([])
  const [filteredPolicies, setFilteredPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  useEffect(() => {
    loadPolicies()
  }, []);
  useEffect(() => {
    filterPolicies()
  }, [policies, selectedFilter, searchTerm]);
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
    // Ensure policies is an array before filtering
    if (!Array.isArray(policies)) {
      setFilteredPolicies([])
      return
    }

    let filtered = policies

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(policy => policy?.status === selectedFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(policy =>
        policy?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy?.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'GDPR Privacy Policy',
                description: 'Comprehensive GDPR-compliant privacy policy with all required sections',
                icon: 'Shield',
                type: 'gdpr-compliance',
                featured: true
              },
              {
                title: 'Cookie Consent Banner',
                description: 'GDPR-compliant cookie consent with granular controls',
                icon: 'Cookie',
                type: 'cookie-policy',
                featured: true
              },
              {
                title: 'Terms of Service',
                description: 'Comprehensive terms and conditions with legal protections',
                icon: 'FileText',
                type: 'terms-of-service',
                featured: true
              },
              {
                title: 'CCPA Privacy Notice',
                description: 'California consumer privacy compliance',
                icon: 'UserCheck',
                type: 'ccpa-compliance'
              },
              {
                title: 'Data Processing Agreement',
                description: 'GDPR Article 28 compliant DPA template',
                icon: 'Database',
                type: 'gdpr-compliance'
              },
              {
                title: 'E-commerce Privacy Policy',
                description: 'Specialized for online retail with payment processing',
                icon: 'ShoppingCart',
                type: 'privacy-policy'
              }
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 border-dashed rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer ${
                  template.featured 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-gray-200'
                }`}
                onClick={handleCreatePolicy}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    template.featured 
                      ? 'bg-primary text-white' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <ApperIcon name={template.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.title}</h4>
                    {template.featured && (
                      <span className="text-xs bg-success text-white px-2 py-0.5 rounded-full">
                        GDPR Ready
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <Button variant={template.featured ? "primary" : "outline"} size="sm">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  {template.featured ? 'Start GDPR Setup' : 'Use Template'}
                </Button>
              </motion.div>
            ))}
          </div>
          
          {/* GDPR Compliance Notice */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">GDPR Compliance Ready</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Our templates include all required GDPR elements: legal basis, data subject rights, 
                  controller information, retention periods, and cookie consent mechanisms.
</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Article 13 & 14</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Cookie Consent</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Data Subject Rights</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Legitimate Interest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

export default Policies