// Simulate API delay for realistic behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock client data (simulates database)
let clients = [
  {
    id: 'client_1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    website: 'https://techcorp.com',
    status: 'active',
    industry: 'Technology',
    country: 'United States',
    companySize: 'Large (500+ employees)',
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z'
    },
    stats: {
      totalPolicies: 12,
      activePolicies: 8,
      totalWidgets: 5,
      activeWidgets: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    lastActive: '2024-01-15T14:22:00Z'
  },
  {
    id: 'client_2',
    name: 'E-Commerce Plus',
    email: 'info@ecommerceplus.com',
    website: 'https://ecommerceplus.com',
    status: 'active',
    industry: 'E-commerce',
    country: 'Canada',
    companySize: 'Medium (50-499 employees)',
    subscription: {
      plan: 'Professional',
      status: 'active',
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-07-15T23:59:59Z'
    },
    stats: {
      totalPolicies: 6,
      activePolicies: 4,
      totalWidgets: 3,
      activeWidgets: 2
    },
    createdAt: '2024-01-15T00:00:00Z',
    lastUpdated: '2024-01-15T09:15:00Z',
    lastActive: '2024-01-15T13:45:00Z'
  },
  {
    id: 'client_3',
    name: 'StartupHub Inc',
    email: 'hello@startuphub.com',
    website: 'https://startuphub.com',
    status: 'pending',
    industry: 'SaaS',
    country: 'United Kingdom',
    companySize: 'Small (1-49 employees)',
    subscription: {
      plan: 'Basic',
      status: 'trial',
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-01-24T23:59:59Z'
    },
    stats: {
      totalPolicies: 2,
      activePolicies: 1,
      totalWidgets: 1,
      activeWidgets: 0
    },
    createdAt: '2024-01-10T00:00:00Z',
    lastUpdated: '2024-01-10T00:00:00Z',
    lastActive: '2024-01-14T16:30:00Z'
  }
]

class ClientService {
  async getClients(filters = {}) {
    try {
      await delay(400)
      
      let filteredClients = [...clients]
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        filteredClients = filteredClients.filter(c => c.status === filters.status)
      }
      
      if (filters.industry && filters.industry !== 'all') {
        filteredClients = filteredClients.filter(c => c.industry === filters.industry)
      }
      
      if (filters.plan && filters.plan !== 'all') {
        filteredClients = filteredClients.filter(c => c.subscription.plan === filters.plan)
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredClients = filteredClients.filter(c => 
          c.name.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.website.toLowerCase().includes(searchTerm)
        )
      }
      
      // Sort by last updated
      filteredClients.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      
      return {
        success: true,
        data: filteredClients,
        total: filteredClients.length
      }
} catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      }
    }
  }

  async getClient(id) {
    try {
      await delay(300);
      
      const client = clients.find(c => c.id === id);
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Add additional details for client view
      const clientDetails = {
        ...client,
        policies: [
          {
            id: 'policy_1',
            name: 'Privacy Policy',
            type: 'privacy-policy',
            status: 'active',
            lastUpdated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'policy_2',
            name: 'Cookie Policy',
            type: 'cookie-policy',
            status: 'active',
            lastUpdated: '2024-01-14T15:45:00Z'
          }
        ],
        widgets: [
          {
            id: 'widget_1',
            name: 'Cookie Consent Banner',
            type: 'cookie-banner',
            status: 'active',
            lastUpdated: '2024-01-15T10:30:00Z'
          },
          {
            id: 'widget_2',
            name: 'Privacy Center',
            type: 'privacy-center',
            status: 'active',
            lastUpdated: '2024-01-14T15:45:00Z'
          }
        ]
      };
      
      return {
        success: true,
        data: clientDetails
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch client'
      };
    }
  }

  // Standard API methods for component compatibility
  async getAll(filters = {}) {
    return this.getClients(filters);
  }

  async getRecent(limit = 5) {
    try {
      const result = await this.getClients();
      if (!result.success) {
        return result;
      }
      
      const sortedClients = result.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedClients,
        total: sortedClients.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch recent clients'
      };
    }
  }

  async createClient(clientData) {
    try {
      await delay(800)
      
      // Validate required fields
      if (!clientData.name || !clientData.email) {
        throw new Error('Client name and email are required')
      }
      
      // Check for duplicate email
      const existingClient = clients.find(c => c.email === clientData.email)
      if (existingClient) {
        throw new Error('Client with this email already exists')
      }
      
      const newClient = {
        id: `client_${Date.now()}`,
        ...clientData,
        status: clientData.status || 'pending',
        stats: {
          totalPolicies: 0,
          activePolicies: 0,
          totalWidgets: 0,
          activeWidgets: 0
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
      
      clients.push(newClient)
      
      return {
        success: true,
        data: newClient,
        message: 'Client created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create client'
      }
    }
  }

  async updateClient(id, updateData) {
    try {
      await delay(600)
      
      const clientIndex = clients.findIndex(c => c.id === id)
      
      if (clientIndex === -1) {
        throw new Error('Client not found')
      }
      
      // Check for duplicate email if email is being updated
      if (updateData.email && updateData.email !== clients[clientIndex].email) {
        const existingClient = clients.find(c => c.email === updateData.email && c.id !== id)
        if (existingClient) {
          throw new Error('Client with this email already exists')
        }
      }
      
      const updatedClient = {
        ...clients[clientIndex],
        ...updateData,
        lastUpdated: new Date().toISOString()
      }
      
      clients[clientIndex] = updatedClient
      
      return {
        success: true,
        data: updatedClient,
        message: 'Client updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update client'
      }
    }
  }

  async deleteClient(id) {
    try {
      await delay(400)
      
      const clientIndex = clients.findIndex(c => c.id === id)
      
      if (clientIndex === -1) {
        throw new Error('Client not found')
      }
      
      const deletedClient = clients.splice(clientIndex, 1)[0]
      
      return {
        success: true,
        data: deletedClient,
        message: 'Client deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      }
    }
  }

  async activateClient(id) {
    try {
      await delay(500)
      
const clientIndex = clients.findIndex(c => c.id === id);
      
      if (clientIndex === -1) {
        throw new Error('Client not found');
      }
      
      const updatedClient = {
        ...clients[clientIndex],
        status: 'active',
        subscription: {
          ...clients[clientIndex].subscription,
          status: 'active'
        },
        lastUpdated: new Date().toISOString()
      };
      
      clients[clientIndex] = updatedClient;
      
return {
        success: true,
        data: updatedClient,
        message: 'Client activated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to activate client'
      }
    }
  }

  async deactivateClient(id) {
    try {
      await delay(500)
      
const clientIndex = clients.findIndex(c => c.id === id);
      
      if (clientIndex === -1) {
        throw new Error('Client not found');
      }
      
      const updatedClient = {
        ...clients[clientIndex],
        status: 'inactive',
        subscription: {
          ...clients[clientIndex].subscription,
          status: 'inactive'
        },
        lastUpdated: new Date().toISOString()
      };
      
      clients[clientIndex] = updatedClient;
      
return {
        success: true,
        data: updatedClient,
        message: 'Client deactivated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to deactivate client'
      }
    }
}
}

export const clientService = new ClientService();
export default clientService;