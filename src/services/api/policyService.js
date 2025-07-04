import policiesData from '@/services/mockData/policies.json'

// Simulate API delay for realistic behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for policies (simulates database)
let policies = [...policiesData]

class PolicyService {
  async getPolicies(filters = {}) {
    try {
      await delay(400)
      
      let filteredPolicies = [...policies]
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        filteredPolicies = filteredPolicies.filter(p => p.status === filters.status)
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredPolicies = filteredPolicies.filter(p => p.type === filters.type)
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredPolicies = filteredPolicies.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Sort by last updated
      filteredPolicies.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      
      return {
        success: true,
        data: filteredPolicies,
        total: filteredPolicies.length
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch policies'
      }
    }
  }

  async getPolicy(id) {
    try {
      await delay(300)
      
      const policy = policies.find(p => p.id === id)
      
      if (!policy) {
        throw new Error('Policy not found')
      }
      
      return {
        success: true,
        data: policy
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch policy'
      }
    }
  }

  async createPolicy(policyData) {
    try {
      await delay(800)
      
      // Validate required fields
      if (!policyData.name || !policyData.type) {
        throw new Error('Policy name and type are required')
      }
      
      const newPolicy = {
        id: `policy_${Date.now()}`,
        ...policyData,
        status: policyData.status || 'draft',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: 1
      }
      
      policies.push(newPolicy)
      
      return {
        success: true,
        data: newPolicy,
        message: 'Policy created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create policy'
      }
    }
  }

  async updatePolicy(id, updateData) {
    try {
      await delay(600)
      
      const policyIndex = policies.findIndex(p => p.id === id)
      
      if (policyIndex === -1) {
        throw new Error('Policy not found')
      }
      
      const updatedPolicy = {
        ...policies[policyIndex],
        ...updateData,
        lastUpdated: new Date().toISOString(),
        version: (policies[policyIndex].version || 1) + 1
      }
      
      policies[policyIndex] = updatedPolicy
      
      return {
        success: true,
        data: updatedPolicy,
        message: 'Policy updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update policy'
      }
    }
  }

  async deletePolicy(id) {
    try {
      await delay(400)
      
      const policyIndex = policies.findIndex(p => p.id === id)
      
      if (policyIndex === -1) {
        throw new Error('Policy not found')
      }
      
      const deletedPolicy = policies.splice(policyIndex, 1)[0]
      
      return {
        success: true,
        data: deletedPolicy,
        message: 'Policy deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete policy'
      }
    }
  }

  async publishPolicy(id) {
    try {
      await delay(500)
      
      const result = await this.updatePolicy(id, {
        status: 'active',
        publishedAt: new Date().toISOString()
      })
      
      if (result.success) {
        result.message = 'Policy published successfully'
      }
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to publish policy'
      }
    }
  }

  async duplicatePolicy(id) {
    try {
      await delay(400)
      
      const originalPolicy = policies.find(p => p.id === id)
      
      if (!originalPolicy) {
        throw new Error('Policy not found')
      }
      
      const duplicatedPolicy = {
        ...originalPolicy,
        id: `policy_${Date.now()}`,
        name: `${originalPolicy.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: 1,
        publishedAt: null
      }
      
      policies.push(duplicatedPolicy)
      
      return {
        success: true,
        data: duplicatedPolicy,
        message: 'Policy duplicated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to duplicate policy'
      }
    }
  }
}

export const policyService = new PolicyService()
export default policyService