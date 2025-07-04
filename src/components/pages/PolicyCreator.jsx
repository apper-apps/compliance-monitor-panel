import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import RichTextEditor from "@/components/molecules/RichTextEditor";
import { policyService } from "@/services/api/policyService";

const PolicyCreator = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [aiProcessing, setAiProcessing] = useState(false)
  const editorRef = useRef(null)
  const [selectedText, setSelectedText] = useState('')
  const [showAiToolbar, setShowAiToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  
const [policyData, setPolicyData] = useState({
    title: '',
    type: 'privacy-policy',
    content: "# Privacy Policy\n\n## 1. Information We Collect\n\nWe collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.\n\n### Personal Information\n- Name and contact information\n- Email address and phone number\n- Billing and shipping address\n- Payment information\n\n### Automatically Collected Information\n- Device information and IP address\n- Browser type and operating system\n- Pages visited and time spent on our site\n- Cookies and similar tracking technologies\n\n## 2. How We Use Your Information\n\nWe use the information we collect to:\n- Provide, maintain, and improve our services\n- Process transactions and send related information\n- Send technical notices and support messages\n- Respond to your comments and questions\n- Communicate about products, services, and events\n\n## 3. Information Sharing\n\nWe do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.\n\n### Service Providers\nWe may share your information with trusted third-party service providers who assist us in operating our website and conducting our business.\n\n### Legal Requirements\nWe may disclose your information when required by law or to protect our rights, property, or safety.\n\n## 4. Data Security\n\nWe implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\n## 5. Your Rights\n\nDepending on your location, you may have certain rights regarding your personal information, including:\n- The right to access your data\n- The right to correct inaccurate information\n- The right to delete your information\n- The right to data portability\n\n## 6. Contact Us\n\nIf you have any questions about this Privacy Policy, please contact us at privacy@company.com.\n\n*Last updated: " + new Date().toLocaleDateString() + "*",
    status: 'draft',
    lastUpdated: new Date().toISOString()
  })

  // AI writing tools configuration
  const aiTools = [
    { id: 'rewrite', label: 'Rewrite', icon: 'RefreshCw', description: 'Rewrite selected text' },
    { id: 'improve', label: 'Improve Writing', icon: 'Sparkles', description: 'Enhance clarity and flow' },
    { id: 'grammar', label: 'Fix Grammar', icon: 'CheckCircle', description: 'Correct grammar and spelling' },
    { id: 'shorter', label: 'Make Shorter', icon: 'Minimize2', description: 'Condense the text' },
    { id: 'longer', label: 'Make Longer', icon: 'Maximize2', description: 'Expand with more detail' }
  ]

  useEffect(() => {
    if (isEditing) {
      loadPolicy()
    }
  }, [id])

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection.toString().trim()
      
      if (text && text.length > 0 && editorRef.current?.contains(selection.anchorNode)) {
        setSelectedText(text)
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        
        setToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        })
        setShowAiToolbar(true)
      } else {
        setShowAiToolbar(false)
        setSelectedText('')
      }
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [])

const loadPolicy = async () => {
    try {
      setError(null)
      setLoading(true)
      const policy = await policyService.getById(parseInt(id))
      
      // Validate policy structure to prevent runtime errors
      if (!policy || typeof policy !== 'object') {
        throw new Error('Invalid policy data received')
      }
      
      // Ensure all required properties exist with defaults
      const validatedPolicy = {
        title: policy.title || '',
        type: policy.type || 'privacy-policy',
        content: policy.content || '',
        status: policy.status || 'draft',
        lastUpdated: policy.lastUpdated || new Date().toISOString(),
        ...policy
      }
      
      setPolicyData(validatedPolicy)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (content) => {
    setPolicyData(prev => ({
      ...prev,
      content,
      lastUpdated: new Date().toISOString()
    }))
  }

  const handleAiAction = async (action) => {
    if (!selectedText) return

    try {
      setAiProcessing(true)
      setShowAiToolbar(false)
      
      const result = await policyService[`${action}Text`](selectedText)
      
      if (result.success) {
        // Replace selected text with AI-improved version
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(document.createTextNode(result.data.improvedText))
          
          // Update content in state
          const updatedContent = editorRef.current.innerText
          handleContentChange(updatedContent)
        }
        
        toast.success(`Text ${action === 'rewrite' ? 'rewritten' : action === 'improve' ? 'improved' : action === 'grammar' ? 'corrected' : action === 'shorter' ? 'shortened' : 'expanded'} successfully`)
      } else {
        toast.error(result.error || 'AI processing failed')
      }
    } catch (err) {
      toast.error('Failed to process text with AI')
    } finally {
      setAiProcessing(false)
      setSelectedText('')
    }
  }

  const handleSave = async (status = 'draft') => {
    try {
      setSaving(true)
      const saveData = {
        ...policyData,
        status,
        lastUpdated: new Date().toISOString()
      }

      if (isEditing) {
        await policyService.update(parseInt(id), saveData)
        toast.success('Policy updated successfully')
      } else {
        await policyService.create(saveData)
        toast.success('Policy created successfully')
      }
      
      navigate('/policies')
    } catch (err) {
      toast.error('Failed to save policy')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    handleSave('active')
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadPolicy} />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Policy' : 'Create Policy'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your policy content with AI assistance' : 'Create a comprehensive policy with AI-powered writing tools'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/policies')}
          >
            <ApperIcon name="X" className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FormField
                type="input"
                placeholder="Policy Title"
                value={policyData.title}
                onChange={(e) => setPolicyData(prev => ({ ...prev, title: e.target.value }))}
                className="w-64"
              />
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ApperIcon name="Clock" className="h-4 w-4" />
                <span>Auto-saved • {new Date(policyData.lastUpdated).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                policyData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {policyData.status === 'active' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

{/* Editor */}
        <div className="relative">
          <RichTextEditor
            value={policyData.content}
            onChange={handleContentChange}
            placeholder="Start writing your policy..."
            className="border-0"
            minHeight="600px"
            ref={editorRef}
          />
          {/* AI Toolbar */}
          <AnimatePresence>
            {showAiToolbar && selectedText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2"
                style={{
                  left: toolbarPosition.x - 150,
                  top: toolbarPosition.y - 60,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-center space-x-1">
                  {aiTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAiAction(tool.id)}
                      disabled={aiProcessing}
                      className="text-xs px-2 py-1 hover:bg-purple-50 hover:text-purple-700"
                      title={tool.description}
                    >
                      <ApperIcon name={tool.icon} className="h-3 w-3 mr-1" />
                      {tool.label}
                    </Button>
                  ))}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Processing Overlay */}
          {aiProcessing && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                <div className="animate-spin">
                  <ApperIcon name="Sparkles" className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">AI is improving your text...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
<div className="text-sm text-gray-500">
              {policyData?.content?.length || 0} characters • Select text to see AI writing tools
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saving}
              loading={saving}
            >
              Save Draft
            </Button>
            
            <Button
              variant="success"
              onClick={handlePublish}
              disabled={saving || !policyData.title || !policyData.content}
              loading={saving}
            >
              <ApperIcon name="Check" className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Policy' : 'Publish Policy'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Writing Assistant</h3>
            <p className="text-gray-600 mb-4">
              Select any text in your policy to access powerful AI writing tools. Get instant improvements for clarity, grammar, length, and tone.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {aiTools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name={tool.icon} className="h-4 w-4 text-purple-500" />
                  <span>{tool.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyCreator