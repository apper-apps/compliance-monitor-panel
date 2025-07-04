import policiesData from "@/services/mockData/policies.json";

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
      
      const policy = policies.find(p => p.Id === parseInt(id))
      
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
      if (!policyData.title || !policyData.type) {
        throw new Error('Policy title and type are required')
      }
      
      const newId = Math.max(...policies.map(p => p.Id), 0) + 1
      const newPolicy = {
        Id: newId,
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
      
      const policyIndex = policies.findIndex(p => p.Id === parseInt(id))
      
      if (policyIndex === -1) {
        throw new Error('Policy not found')
      }
      
      const updatedPolicy = {
        ...policies[policyIndex],
        ...updateData,
        Id: parseInt(id),
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

  async deletePolicy(id, updateData) {
    try {
      await delay(400)
      
      const policyIndex = policies.findIndex(p => p.Id === parseInt(id))
      
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
      
      const originalPolicy = policies.find(p => p.Id === parseInt(id))
      
      if (!originalPolicy) {
        throw new Error('Policy not found')
      }
      
const duplicatedPolicy = {
        ...originalPolicy,
        Id: Math.max(...policies.map(p => p.Id), 0) + 1,
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

// Standard API methods for component compatibility
  async getAll() {
    await delay(400)
    return [...policies]
  }

  async getById(id) {
    await delay(300)
    const policy = policies.find(p => p.Id === parseInt(id))
    if (!policy) {
      throw new Error('Policy not found')
    }
    return policy
  }

  async create(policyData) {
    await delay(800)
    const newId = Math.max(...policies.map(p => p.Id), 0) + 1
    const newPolicy = {
      Id: newId,
      ...policyData,
      lastUpdated: new Date().toISOString()
    }
    policies.push(newPolicy)
    return newPolicy
  }

  async update(id, updateData) {
    await delay(600)
    const index = policies.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Policy not found')
    }
    policies[index] = {
      ...policies[index],
      ...updateData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    }
    return policies[index]
  }

  async delete(id) {
    await delay(400)
    const index = policies.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Policy not found')
    }
    policies.splice(index, 1)
    return true
  }

  async getRecent(limit = 5) {
    const result = await this.getPolicies()
    if (result.success) {
      const sortedPolicies = result.data
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, limit)
      return {
        success: true,
        data: sortedPolicies,
        total: sortedPolicies.length
      }
    }
    return result
  }

  // Alias method for Dashboard component compatibility
  async getRecentPolicies(limit = 5) {
return this.getRecent(limit)
  }

  // Geolocation and policy recommendation methods
  async detectUserCountry() {
    try {
      // Try browser geolocation first
      if (navigator.geolocation) {
        try {
          const position = await this.getCurrentPosition()
          const country = await this.getCountryFromCoordinates(position.coords.latitude, position.coords.longitude)
          if (country) return country
        } catch (geoError) {
          console.warn('Browser geolocation failed:', geoError.message)
        }
      }

      // Fallback to IP-based detection
      return await this.getCountryFromIP()
    } catch (error) {
      console.warn('Country detection failed:', error.message)
      return null
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false
      })
    })
  }

  async getCountryFromCoordinates(lat, lon) {
    // Simple country detection based on coordinate ranges
    // In a real app, you'd use a proper geocoding service
    const countryRanges = {
      'us': { latMin: 24, latMax: 49, lonMin: -125, lonMax: -66 },
      'ca': { latMin: 41, latMax: 70, lonMin: -141, lonMax: -52 },
      'uk': { latMin: 49, latMax: 61, lonMin: -8, lonMax: 2 },
      'de': { latMin: 47, latMax: 55, lonMin: 5, lonMax: 16 },
      'fr': { latMin: 41, latMax: 51, lonMin: -5, lonMax: 10 },
      'th': { latMin: 5, latMax: 21, lonMin: 97, lonMax: 106 },
      'sg': { latMin: 1, latMax: 2, lonMin: 103, lonMax: 104 },
      'au': { latMin: -44, latMax: -10, lonMin: 113, lonMax: 154 },
      'jp': { latMin: 24, latMax: 46, lonMin: 123, lonMax: 146 },
      'br': { latMin: -34, latMax: 5, lonMin: -74, lonMax: -34 }
    }

    for (const [country, range] of Object.entries(countryRanges)) {
      if (lat >= range.latMin && lat <= range.latMax && 
          lon >= range.lonMin && lon <= range.lonMax) {
        return country
      }
    }
    return null
  }

  async getCountryFromIP() {
    try {
      await delay(200)
      
      // Simulate IP-based country detection
      // In a real app, you'd call an IP geolocation service like ipapi.co or ipinfo.io
      const mockDetection = {
        // Simulate different countries for testing
        'us': 0.3,
        'de': 0.15,
        'uk': 0.1,
        'fr': 0.1,
        'th': 0.1,
        'sg': 0.05,
        'ca': 0.05,
        'au': 0.05,
        'br': 0.05,
        'jp': 0.05
      }

      const random = Math.random()
      let cumulative = 0
      for (const [country, probability] of Object.entries(mockDetection)) {
        cumulative += probability
        if (random <= cumulative) {
          return country
        }
      }
      
      return 'us' // fallback
    } catch (error) {
      throw new Error('IP-based detection failed')
    }
  }

  getRecommendedPoliciesForCountry(countryCode) {
    const countryToRegulations = {
      // European Union countries - GDPR
      'de': ['gdpr-compliance'],
      'fr': ['gdpr-compliance'],
      'it': ['gdpr-compliance'],
      'es': ['gdpr-compliance'],
      'nl': ['gdpr-compliance'],
      'be': ['gdpr-compliance'],
      'at': ['gdpr-compliance'],
      'dk': ['gdpr-compliance'],
      'fi': ['gdpr-compliance'],
      'se': ['gdpr-compliance'],
      'ie': ['gdpr-compliance'],
      'pt': ['gdpr-compliance'],
      'gr': ['gdpr-compliance'],
      'lu': ['gdpr-compliance'],
      'cy': ['gdpr-compliance'],
      'mt': ['gdpr-compliance'],
      'si': ['gdpr-compliance'],
      'sk': ['gdpr-compliance'],
      'ee': ['gdpr-compliance'],
      'lv': ['gdpr-compliance'],
      'lt': ['gdpr-compliance'],
      'pl': ['gdpr-compliance'],
      'cz': ['gdpr-compliance'],
      'hu': ['gdpr-compliance'],
      'ro': ['gdpr-compliance'],
      'bg': ['gdpr-compliance'],
      'hr': ['gdpr-compliance'],
      
      // United Kingdom - GDPR equivalent
      'uk': ['gdpr-compliance'],
      
      // United States - CCPA
      'us': ['ccpa-compliance'],
      
      // Canada - PIPEDA
      'ca': ['pipeda-canada'],
      
      // Thailand - PDPA
      'th': ['pdpa-thailand'],
      
      // Singapore - PDPA
      'sg': ['pdpa-singapore'],
      
      // Australia - Privacy Act
      'au': ['privacy-act-australia'],
// Brazil - LGPD
      'br': ['lgpd-brazil']
    }

    return countryToRegulations[countryCode] || ['privacy-policy']
  }

  // AI Text Processing Methods
  async rewriteText(text) {
    try {
      await delay(1500)
      
      // Simulate AI rewriting with enhanced clarity and professionalism
      const rewrittenTexts = [
        text.replace(/\b(we|our|us)\b/gi, 'the company')
          .replace(/\b(you|your)\b/gi, 'users')
          .replace(/collect/gi, 'gather')
          .replace(/information/gi, 'data'),
        
        text.replace(/\b(may|might)\b/gi, 'will')
          .replace(/\b(can|could)\b/gi, 'are able to')
          .replace(/sometimes/gi, 'occasionally'),
        
        text.replace(/\b(help|assist)\b/gi, 'support')
          .replace(/\b(use|utilize)\b/gi, 'employ')
          .replace(/\b(get|obtain)\b/gi, 'acquire')
      ]
      
      const randomRewrite = rewrittenTexts[Math.floor(Math.random() * rewrittenTexts.length)]
      
      return {
        success: true,
        data: {
          originalText: text,
          improvedText: randomRewrite,
          changes: ['Enhanced clarity', 'Improved professional tone', 'Strengthened language']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to rewrite text'
      }
    }
  }

  async improveWriting(text) {
    try {
      await delay(1200)
      
      // Simulate AI writing improvement
      let improved = text
        .replace(/\b(good|nice|great)\b/gi, 'excellent')
        .replace(/\b(bad|poor)\b/gi, 'inadequate')
        .replace(/\b(big|large)\b/gi, 'substantial')
        .replace(/\b(small|little)\b/gi, 'minimal')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Add transitional phrases for better flow
      if (!improved.includes('Furthermore') && !improved.includes('Additionally')) {
        const transitions = ['Furthermore, ', 'Additionally, ', 'Moreover, ', 'In addition, ']
        const randomTransition = transitions[Math.floor(Math.random() * transitions.length)]
        improved = randomTransition + improved.charAt(0).toLowerCase() + improved.slice(1)
      }
      
      return {
        success: true,
        data: {
          originalText: text,
          improvedText: improved,
          changes: ['Enhanced vocabulary', 'Improved flow', 'Added clarity']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to improve writing'
      }
    }
  }

  async fixGrammar(text) {
    try {
      await delay(800)
      
      // Simulate grammar and spelling fixes
      let corrected = text
        .replace(/\b(there|their|they're)\b/gi, (match, p1, offset, string) => {
          const beforeWord = string.charAt(offset - 1)
          const afterWord = string.charAt(offset + match.length)
          if (beforeWord === ' ' && afterWord === ' ') return 'their'
          return match
        })
        .replace(/\b(its|it's)\b/gi, (match) => {
          return Math.random() > 0.5 ? 'its' : "it's"
        })
        .replace(/\b(affect|effect)\b/gi, 'impact')
        .replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => {
          return punct + ' ' + letter.toUpperCase()
        })
        .replace(/\s+/g, ' ')
        .trim()
      
      // Ensure proper capitalization
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1)
      
      return {
        success: true,
        data: {
          originalText: text,
          improvedText: corrected,
          changes: ['Fixed capitalization', 'Corrected common errors', 'Improved punctuation']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fix grammar'
      }
    }
  }

  async makeShorter(text) {
    try {
      await delay(1000)
      
      // Simulate text condensation
      let shortened = text
        .replace(/\b(in order to|so as to)\b/gi, 'to')
        .replace(/\b(due to the fact that|because of the fact that)\b/gi, 'because')
        .replace(/\b(at this point in time|at the present time)\b/gi, 'now')
        .replace(/\b(for the purpose of|for the reason that)\b/gi, 'for')
        .replace(/\b(with regard to|in regard to|with respect to)\b/gi, 'regarding')
        .replace(/\b(it is important to note that|it should be noted that)\b/gi, '')
        .replace(/\b(please be advised that|please note that)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Remove redundant phrases
      shortened = shortened
        .split('. ')
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 10)
        .slice(0, Math.ceil(shortened.split('. ').length * 0.7))
        .join('. ')
      
      return {
        success: true,
        data: {
          originalText: text,
          improvedText: shortened,
          changes: ['Removed redundancy', 'Condensed phrases', 'Streamlined content']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to shorten text'
      }
    }
  }

  async makeLonger(text) {
    try {
      await delay(1300)
      
      // Simulate text expansion with additional details
      const expansions = [
        ' This process is designed to ensure compliance with applicable regulations and industry best practices.',
        ' We take this matter seriously and have implemented comprehensive measures to address all relevant concerns.',
        ' Our commitment to transparency means we continuously review and update our procedures as needed.',
        ' These guidelines are in accordance with current legal requirements and regulatory standards.',
        ' We maintain detailed records of all such activities to ensure full accountability and traceability.'
      ]
      
      let expanded = text
      const sentences = expanded.split('. ')
      
      // Add random expansions to sentences
      const expandedSentences = sentences.map(sentence => {
        if (sentence.trim().length > 20 && Math.random() > 0.6) {
          const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)]
          return sentence + randomExpansion
        }
        return sentence
      })
      
      expanded = expandedSentences.join('. ')
      
      // Add clarifying phrases
      expanded = expanded
        .replace(/\b(we|our company)\b/gi, 'we, as a responsible organization,')
        .replace(/\b(data|information)\b/gi, 'data and related information')
        .replace(/\b(users|customers)\b/gi, 'users and valued customers')
      
      return {
        success: true,
        data: {
          originalText: text,
          improvedText: expanded,
          changes: ['Added detail', 'Enhanced explanations', 'Provided context']
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to expand text'
      }
    }
  }
}

export const policyService = new PolicyService()