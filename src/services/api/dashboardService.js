import dashboardData from '@/services/mockData/dashboardData.json'
import policiesData from '@/services/mockData/policies.json'

// Simulate API delay for realistic behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DashboardService {
  async getStats() {
    try {
      await delay(500) // Simulate API call delay
      
      // Calculate dynamic stats based on mock data
      const totalPolicies = policiesData.length
      const activePolicies = policiesData.filter(p => p.status === 'active').length
      const draftPolicies = policiesData.filter(p => p.status === 'draft').length
      
      return {
        success: true,
        data: {
          ...dashboardData.stats,
          totalPolicies,
          activePolicies,
          draftPolicies,
          policyComplianceRate: Math.round((activePolicies / totalPolicies) * 100)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard stats'
      }
    }
  }

  async getRecentPolicies(limit = 5) {
    try {
      await delay(300)
      
      const recentPolicies = policiesData
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, limit)
      
      return {
        success: true,
        data: recentPolicies
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch recent policies'
      }
    }
  }

  async getRecentWidgets(limit = 5) {
    try {
      await delay(300)
      
      // Mock widget data since we don't have a widgets.json file
      const mockWidgets = [
        {
          id: 'w1',
          name: 'Cookie Consent Banner',
          type: 'cookie-banner',
          status: 'active',
          lastUpdated: '2024-01-15T10:30:00Z',
          deployedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'w2',
          name: 'Privacy Preference Center',
          type: 'privacy-center',
          status: 'active',
          lastUpdated: '2024-01-14T15:45:00Z',
          deployedAt: '2024-01-14T15:45:00Z'
        }
      ]
      
      return {
        success: true,
        data: mockWidgets.slice(0, limit)
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch recent widgets'
      }
    }
  }

  async getOverview() {
    try {
      await delay(600)
      
      const [stats, recentPolicies, recentWidgets] = await Promise.all([
        this.getStats(),
        this.getRecentPolicies(3),
        this.getRecentWidgets(3)
      ])
      
      if (!stats.success || !recentPolicies.success || !recentWidgets.success) {
        throw new Error('Failed to fetch overview data')
      }
      
      return {
        success: true,
        data: {
          stats: stats.data,
          recentPolicies: recentPolicies.data,
          recentWidgets: recentWidgets.data,
          lastUpdated: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard overview'
      }
    }
  }
}

export const dashboardService = new DashboardService()
export default dashboardService