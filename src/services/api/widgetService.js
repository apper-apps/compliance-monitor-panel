// Simulate API delay for realistic behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock widget data (simulates database)
let widgets = [
  {
    Id: 1,
    name: 'Cookie Consent Banner',
    type: 'cookie-banner',
    status: 'active',
    description: 'GDPR compliant cookie consent banner',
    platform: 'web',
    impressions: 15420,
    config: {
      theme: 'light',
      position: 'bottom',
      size: 'medium',
      animation: 'slide-up',
      showRejectButton: true,
      acceptButtonText: 'Accept All',
      rejectButtonText: 'Reject All',
      customizeButtonText: 'Customize'
    },
    createdAt: '2024-01-10T08:00:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    deployedAt: '2024-01-15T10:30:00Z'
  },
  {
    Id: 2,
    name: 'Privacy Preference Center',
    type: 'privacy-center',
    status: 'active',
    description: 'User privacy preferences management',
    platform: 'web',
    impressions: 8930,
    config: {
      theme: 'light',
      position: 'modal',
      size: 'large',
      animation: 'fade-in',
      showCategories: true,
      allowToggle: true
    },
    createdAt: '2024-01-12T14:20:00Z',
    lastUpdated: '2024-01-14T15:45:00Z',
    deployedAt: '2024-01-14T15:45:00Z'
  },
  {
    Id: 3,
    name: 'HIPAA Privacy Notice',
    type: 'hipaa-privacy-notice',
    status: 'active',
    description: 'Healthcare privacy notice for HIPAA compliance',
    platform: 'web',
    impressions: 3250,
    config: {
      theme: 'light',
      position: 'top-banner',
      size: 'large',
      animation: 'slide-down',
      entityName: 'Healthcare Provider Inc.',
      contactInfo: 'privacy@healthcare.com',
      effectiveDate: '2024-01-01'
    },
    createdAt: '2024-01-16T09:00:00Z',
    lastUpdated: '2024-01-16T09:00:00Z',
    deployedAt: '2024-01-16T09:00:00Z'
  },
  {
    Id: 4,
    name: 'Financial Privacy Notice',
    type: 'financial-privacy-notice',
    status: 'active',
    description: 'Banking and financial privacy disclosure',
    platform: 'web',
    impressions: 5680,
    config: {
      theme: 'light',
      position: 'bottom-right',
      size: 'medium',
      animation: 'slide-up',
      entityName: 'First National Bank',
      contactInfo: 'privacy@firstnational.com',
      effectiveDate: '2024-01-01'
    },
    createdAt: '2024-01-17T11:30:00Z',
    lastUpdated: '2024-01-17T11:30:00Z',
    deployedAt: '2024-01-17T11:30:00Z'
  },
  {
    Id: 5,
    name: 'Biometric Data Notice',
    type: 'biometric-data-notice',
    status: 'draft',
    description: 'Biometric data collection and processing notice',
    platform: 'web',
    impressions: 0,
    config: {
      theme: 'light',
      position: 'center',
      size: 'large',
      animation: 'fade-in',
      entityName: 'SecureAccess Corp',
      contactInfo: 'privacy@secureaccess.com',
      effectiveDate: '2024-02-01'
    },
    createdAt: '2024-01-18T14:15:00Z',
    lastUpdated: '2024-01-18T14:15:00Z',
    deployedAt: null
  },
  {
    Id: 6,
    name: 'Data Processing Consent',
    type: 'consent-form',
    status: 'draft',
    description: 'Data processing consent form',
    platform: 'web',
    impressions: 0,
    config: {
      theme: 'light',
      position: 'inline',
      size: 'medium',
      animation: 'none',
      requireSignature: true
    },
    createdAt: '2024-01-13T09:15:00Z',
    lastUpdated: '2024-01-13T09:15:00Z',
    deployedAt: null
  }
]

class WidgetService {
  async getWidgets(filters = {}) {
    try {
      await delay(400)
      
      let filteredWidgets = [...widgets]
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        filteredWidgets = filteredWidgets.filter(w => w.status === filters.status)
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredWidgets = filteredWidgets.filter(w => w.type === filters.type)
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredWidgets = filteredWidgets.filter(w => 
          w.name.toLowerCase().includes(searchTerm) ||
          w.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Sort by last updated
      filteredWidgets.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      
      return {
        success: true,
        data: filteredWidgets,
        total: filteredWidgets.length
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch widgets'
      }
    }
  }

async getWidget(id) {
    try {
      await delay(300)
      
      const widget = widgets.find(w => w.Id === parseInt(id))
      
      if (!widget) {
        throw new Error('Widget not found')
      }
      
      return {
        success: true,
        data: widget
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch widget'
      }
    }
  }

async createWidget(widgetData) {
    try {
      await delay(800)
      
      // Validate required fields
      if (!widgetData.name || !widgetData.type) {
        throw new Error('Widget name and type are required')
      }
      
      const newId = Math.max(...widgets.map(w => w.Id), 0) + 1
      const newWidget = {
        Id: newId,
        name: widgetData.name,
        type: widgetData.type,
        status: widgetData.status || 'draft',
        description: widgetData.description || '',
        platform: widgetData.platform || 'web',
        impressions: 0,
        config: widgetData.config || {},
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        deployedAt: null
      }
      
      widgets.push(newWidget)
      
      return {
        success: true,
        data: newWidget,
        message: 'Widget created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create widget'
      }
    }
  }

async updateWidget(id, updateData) {
    try {
      await delay(600)
      
      const widgetIndex = widgets.findIndex(w => w.Id === parseInt(id))
      
      if (widgetIndex === -1) {
        throw new Error('Widget not found')
      }
      
      const updatedWidget = {
        ...widgets[widgetIndex],
        ...updateData,
        Id: parseInt(id),
        lastUpdated: new Date().toISOString()
      }
      
      widgets[widgetIndex] = updatedWidget
      
      return {
        success: true,
        data: updatedWidget,
        message: 'Widget updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update widget'
      }
    }
  }

async deleteWidget(id) {
    try {
      await delay(400)
      
      const widgetIndex = widgets.findIndex(w => w.Id === parseInt(id))
      
      if (widgetIndex === -1) {
        throw new Error('Widget not found')
      }
      
      const deletedWidget = widgets.splice(widgetIndex, 1)[0]
      
      return {
        success: true,
        data: deletedWidget,
        message: 'Widget deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete widget'
      }
    }
  }

  async toggleWidget(id) {
    try {
      await delay(500)
      
      const widgetIndex = widgets.findIndex(w => w.id === id)
      
      if (widgetIndex === -1) {
        throw new Error('Widget not found')
      }
      
      const currentStatus = widgets[widgetIndex].status
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      
      const updatedWidget = {
        ...widgets[widgetIndex],
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        deployedAt: newStatus === 'active' ? new Date().toISOString() : widgets[widgetIndex].deployedAt
      }
      
      widgets[widgetIndex] = updatedWidget
      
      return {
        success: true,
        data: updatedWidget,
        message: `Widget ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to toggle widget status'
      }
    }
  }

  async deployWidget(id) {
    try {
      await delay(700)
      
      const result = await this.updateWidget(id, {
        status: 'active',
        deployedAt: new Date().toISOString()
      })
      
      if (result.success) {
        result.message = 'Widget deployed successfully'
      }
      
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to deploy widget'
      }
    }
  }

  async duplicateWidget(id) {
    try {
      await delay(400)
      
      const originalWidget = widgets.find(w => w.id === id)
      
      if (!originalWidget) {
        throw new Error('Widget not found')
      }
      
      const duplicatedWidget = {
        ...originalWidget,
        id: `widget_${Date.now()}`,
        name: `${originalWidget.name} (Copy)`,
        status: 'inactive',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        deployedAt: null
      }
      
      widgets.push(duplicatedWidget)
      
      return {
        success: true,
        data: duplicatedWidget,
        message: 'Widget duplicated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to duplicate widget'
      }
    }
}

// Standard API methods for component compatibility
  async getAll() {
    await delay(400)
    return [...widgets]
  }

  async getById(id) {
    await delay(300)
    const widget = widgets.find(w => w.Id === parseInt(id))
    if (!widget) {
      throw new Error('Widget not found')
    }
    return widget
  }

  async create(widgetData) {
    await delay(800)
    const newId = Math.max(...widgets.map(w => w.Id), 0) + 1
    const newWidget = {
      Id: newId,
      ...widgetData,
      impressions: 0,
      lastUpdated: new Date().toISOString()
    }
    widgets.push(newWidget)
    return newWidget
  }

  async update(id, updateData) {
    await delay(600)
    const index = widgets.findIndex(w => w.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Widget not found')
    }
    widgets[index] = {
      ...widgets[index],
      ...updateData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    }
    return widgets[index]
  }

  async delete(id) {
    await delay(400)
    const index = widgets.findIndex(w => w.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Widget not found')
    }
    widgets.splice(index, 1)
    return true
  }

  async getRecent(limit = 5) {
    const result = await this.getWidgets()
    if (result.success) {
      return {
        success: true,
        data: result.data
          .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
          .slice(0, limit)
      }
    }
    return result
  }

  // Alias for Dashboard compatibility
  async getRecentWidgets(limit = 5) {
    return this.getRecent(limit)
  }
}

export const widgetService = new WidgetService()
export default widgetService