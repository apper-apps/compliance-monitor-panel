import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import aiAssistantService from '@/services/api/aiAssistantService'

function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadConversation()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const loadConversation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await aiAssistantService.getConversation()
      
      if (response.success) {
        setMessages(response.data)
      } else {
        setError(response.error)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
      setError('Failed to load conversation')
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return

    try {
      setIsTyping(true)
      setError(null)

      const fileAttachment = selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      } : null

      const response = await aiAssistantService.sendMessage(inputMessage.trim(), fileAttachment)
      
      if (response.success) {
        setMessages(response.data.conversation)
        setInputMessage('')
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        toast.success('Message sent successfully')
      } else {
        setError(response.error)
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message')
      toast.error('Failed to send message')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, DOCX, and TXT files are allowed')
        return
      }
      
      setSelectedFile(file)
      toast.success('File selected for analysis')
    }
  }

  const handleClearConversation = async () => {
    if (!window.confirm('Are you sure you want to clear the conversation? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      const response = await aiAssistantService.clearConversation()
      
      if (response.success) {
        setMessages(response.data)
        setInputMessage('')
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        toast.success('Conversation cleared')
      } else {
        toast.error('Failed to clear conversation')
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error)
      toast.error('Failed to clear conversation')
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedActions = [
    { text: 'Help with GDPR compliance', icon: 'Shield' },
    { text: 'Create privacy policy', icon: 'FileText' },
    { text: 'Cookie consent guidance', icon: 'Cookie' },
    { text: 'Data subject rights', icon: 'Users' }
  ]

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading && messages.length === 0) {
    return <Loading type="page" />
  }

  if (error && messages.length === 0) {
    return <Error message={error} onRetry={loadConversation} />
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="MessageCircle" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Legal Assistant</h1>
              <p className="text-sm text-gray-500">Get instant legal guidance and compliance help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
              disabled={isLoading}
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-primary ml-3' : 'bg-gradient-primary mr-3'
                  }`}>
                    <ApperIcon 
                      name={message.sender === 'user' ? 'User' : 'Bot'} 
                      className="h-4 w-4 text-white" 
                    />
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 max-w-full ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                    {message.fileAttachment && (
                      <div className={`mt-2 p-2 rounded-lg border ${
                        message.sender === 'user' ? 'border-blue-300 bg-blue-50/20' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Paperclip" className="h-4 w-4" />
                          <span className="text-xs font-medium">{message.fileAttachment.name}</span>
                        </div>
                      </div>
                    )}
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="Bot" className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 border-l border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInputMessage(action.text)}
                className="w-full justify-start text-left"
              >
                <ApperIcon name={action.icon} className="h-4 w-4 mr-2" />
                <span className="text-xs">{action.text}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Upload Document</h3>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, TXT (max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {selectedFile && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Paperclip" className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">{selectedFile.name}</span>
                <span className="text-xs text-blue-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about privacy laws, compliance, or upload a document for analysis..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
              rows={3}
              disabled={isTyping}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            {/* Mobile file upload button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="lg:hidden"
              disabled={isTyping}
            >
              <ApperIcon name="Paperclip" className="h-4 w-4" />
            </Button>
            
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !selectedFile) || isTyping}
              className="px-6"
            >
              {isTyping ? (
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
              ) : (
                <ApperIcon name="Send" className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Suggested Actions */}
        <div className="lg:hidden mt-3">
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInputMessage(action.text)}
                className="text-xs"
              >
                <ApperIcon name={action.icon} className="h-3 w-3 mr-1" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
        />
      </div>
    </div>
  )
}

export default AIAssistant