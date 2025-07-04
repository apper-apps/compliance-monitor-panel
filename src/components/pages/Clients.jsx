import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Policies from "@/components/pages/Policies";
import SearchBar from "@/components/molecules/SearchBar";
import ClientCard from "@/components/molecules/ClientCard";
import dashboardData from "@/services/mockData/dashboardData.json";
import policiesData from "@/services/mockData/policies.json";
import clientService from "@/services/api/clientService";

const Clients = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filterOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ]

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm, selectedFilter])

const loadClients = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await clientService.getAll()
      
      // Ensure data is always an array
      const clientsArray = Array.isArray(data) ? data : 
                          (data?.data && Array.isArray(data.data)) ? data.data : 
                          []
      
      setClients(clientsArray)
    } catch (err) {
      setError(err.message)
      setClients([]) // Ensure clients is always an array on error
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    // Ensure clients is always an array before filtering
    const clientsArray = Array.isArray(clients) ? clients : []
    let filtered = clientsArray

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(client => 
        client?.status === selectedFilter
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredClients(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCreateClient = () => {
    // In a real app, this would open a modal or navigate to a form
    toast.info('Create client functionality coming soon')
  }

  const handleViewClient = (client) => {
    navigate(`/clients/${client.Id}`)
  }

  const handleEditClient = (client) => {
    // In a real app, this would open an edit modal
    toast.info('Edit client functionality coming soon')
  }

  const handleDeleteClient = async (client) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.delete(client.Id)
        setClients(clients.filter(c => c.Id !== client.Id))
        toast.success('Client deleted successfully')
      } catch (err) {
        toast.error('Failed to delete client')
      }
    }
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your agency clients and their compliance needs
          </p>
        </div>
        <Button onClick={handleCreateClient} variant="primary">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
              <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Setup</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => {
                  const created = new Date(c.createdAt)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-info" />
            </div>
          </div>
        </div>
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
            placeholder="Search clients..."
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <Empty
          title="No clients found"
          description={searchTerm || selectedFilter !== 'all' 
            ? "No clients match your current filters"
            : "Add your first client to start managing their compliance"
          }
          actionLabel="Add Client"
          onAction={handleCreateClient}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              key={client.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ClientCard
                client={client}
                onView={handleViewClient}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {clients.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bulk Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
              Send Update
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Sync Policies
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="BarChart" className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients