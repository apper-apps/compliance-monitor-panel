// Mock conversation data
const mockConversations = [
  {
    Id: 1,
    message: "Hello! I'm your AI Legal Assistant. I can help you with privacy law questions, compliance guidance, and legal document analysis. What can I assist you with today?",
    sender: "assistant",
    timestamp: new Date(Date.now() - 5000).toISOString(),
    type: "text"
  }
]

let conversationId = 1

const aiAssistantService = {
  async sendMessage(message, fileAttachment = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      // Add user message
      const userMessage = {
        Id: ++conversationId,
        message: message,
        sender: "user",
        timestamp: new Date().toISOString(),
        type: fileAttachment ? "file" : "text",
        fileAttachment: fileAttachment
      }
      
      mockConversations.push(userMessage)
      
      // Generate AI response based on message content
      let aiResponse = ""
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes("gdpr") || lowerMessage.includes("privacy")) {
        aiResponse = "GDPR compliance requires several key elements: lawful basis for processing, clear consent mechanisms, data subject rights implementation, and proper documentation. Would you like me to help you create a GDPR-compliant privacy policy or explain specific requirements?"
      } else if (lowerMessage.includes("cookie") || lowerMessage.includes("consent")) {
        aiResponse = "Cookie consent requires clear, granular options for users. You need essential cookies (always active), functional cookies (optional), analytics cookies (optional), and marketing cookies (optional). Each category should have clear descriptions. Would you like me to help you implement a cookie consent banner?"
      } else if (lowerMessage.includes("policy") || lowerMessage.includes("terms")) {
        aiResponse = "I can help you create comprehensive legal policies including Privacy Policies, Terms of Service, Cookie Policies, and Data Processing Agreements. What type of policy do you need assistance with?"
      } else if (lowerMessage.includes("compliance") || lowerMessage.includes("audit")) {
        aiResponse = "For compliance auditing, I recommend checking: data mapping, consent records, privacy policy accuracy, cookie implementation, data subject request procedures, and breach response plans. Would you like me to guide you through a compliance checklist?"
      } else if (lowerMessage.includes("data") && lowerMessage.includes("request")) {
        aiResponse = "Data subject requests under GDPR include: right of access, rectification, erasure (right to be forgotten), restriction of processing, data portability, and objection. You have 30 days to respond. Would you like help setting up a data request handling process?"
      } else if (fileAttachment) {
        aiResponse = `I've analyzed your ${fileAttachment.type} document. Based on the content, I notice several areas that may need attention for compliance. The document appears to be missing specific clauses about data retention periods and user rights. Would you like me to provide specific recommendations for improvement?`
      } else {
        aiResponse = "I understand you need legal assistance. I specialize in privacy law, GDPR compliance, cookie policies, terms of service, and data protection. Could you provide more details about your specific legal question or compliance need?"
      }
      
      // Add AI response
      const assistantMessage = {
        Id: ++conversationId,
        message: aiResponse,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        type: "text"
      }
      
      mockConversations.push(assistantMessage)
      
      return {
        success: true,
        data: {
          userMessage,
          assistantMessage,
          conversation: [...mockConversations]
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send message'
      }
    }
  },

  async getConversation() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      return {
        success: true,
        data: [...mockConversations]
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to load conversation'
      }
    }
  },

  async analyzeDocument(file) {
    // Simulate document analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      const analysis = {
        Id: ++conversationId,
        fileName: file.name,
        fileSize: file.size,
        analysisResults: {
          complianceScore: Math.floor(Math.random() * 30) + 70, // 70-100%
          issues: [
            "Missing specific data retention periods",
            "Unclear cookie categorization",
            "Incomplete data subject rights section"
          ],
          recommendations: [
            "Add explicit data retention timeframes for each data category",
            "Implement granular cookie consent with clear categories",
            "Include contact information for data protection officer"
          ]
        },
        timestamp: new Date().toISOString()
      }
      
      return {
        success: true,
        data: analysis
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to analyze document'
      }
    }
  },

  async clearConversation() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      mockConversations.length = 0
      mockConversations.push({
        Id: 1,
        message: "Hello! I'm your AI Legal Assistant. I can help you with privacy law questions, compliance guidance, and legal document analysis. What can I assist you with today?",
        sender: "assistant",
        timestamp: new Date().toISOString(),
        type: "text"
      })
      conversationId = 1
      
      return {
        success: true,
        data: [...mockConversations]
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to clear conversation'
      }
    }
  }
}

export default aiAssistantService