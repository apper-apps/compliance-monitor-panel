import { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import SearchBar from '@/components/molecules/SearchBar'

const Support = () => {
  const [activeTab, setActiveTab] = useState('help')
  const [searchTerm, setSearchTerm] = useState('')
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    message: '',
    attachments: []
  })

  const tabs = [
    { id: 'help', label: 'Help Center', icon: 'HelpCircle' },
    { id: 'tickets', label: 'Support Tickets', icon: 'MessageSquare' },
    { id: 'contact', label: 'Contact Us', icon: 'Phone' },
    { id: 'resources', label: 'Resources', icon: 'BookOpen' }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'Getting Started with ComplianceHub',
      category: 'Getting Started',
      views: 1250,
      helpful: 95,
      content: 'Learn how to set up your account and create your first policy.'
    },
    {
      id: 2,
      title: 'Creating GDPR Compliant Policies',
      category: 'Policies',
      views: 890,
      helpful: 88,
      content: 'Step-by-step guide to creating GDPR compliant privacy policies.'
    },
    {
      id: 3,
      title: 'Deploying Cookie Banners',
      category: 'Widgets',
      views: 756,
      helpful: 92,
      content: 'How to create and deploy cookie consent banners on your website.'
    },
    {
      id: 4,
      title: 'Managing Client Accounts',
      category: 'Agency',
      views: 634,
      helpful: 85,
      content: 'Best practices for managing multiple client accounts.'
    },
    {
      id: 5,
      title: 'API Integration Guide',
      category: 'Technical',
      views: 523,
      helpful: 90,
      content: 'Technical documentation for integrating with our API.'
    },
    {
      id: 6,
      title: 'Troubleshooting Common Issues',
      category: 'Troubleshooting',
      views: 445,
      helpful: 87,
      content: 'Solutions to common problems and error messages.'
    }
  ]

  const supportTickets = [
    {
      id: 1,
      subject: 'Widget not displaying correctly',
      category: 'Technical',
      priority: 'High',
      status: 'Open',
      created: '2024-03-15T10:30:00Z',
      lastUpdate: '2024-03-15T14:20:00Z'
    },
    {
      id: 2,
      subject: 'Policy customization question',
      category: 'General',
      priority: 'Medium',
      status: 'Resolved',
      created: '2024-03-14T09:15:00Z',
      lastUpdate: '2024-03-14T16:45:00Z'
    },
    {
      id: 3,
      subject: 'Billing inquiry',
      category: 'Billing',
      priority: 'Low',
      status: 'Pending',
      created: '2024-03-13T11:20:00Z',
      lastUpdate: '2024-03-13T11:20:00Z'
    }
  ]

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    // Simulate ticket submission
    toast.success('Support ticket submitted successfully!')
    setTicketForm({
      subject: '',
      category: '',
      priority: '',
      message: '',
      attachments: []
    })
  }

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How can we help you?
              </h3>
              <SearchBar
                placeholder="Search help articles..."
                onSearch={handleSearch}
                className="max-w-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Getting Started', 'Policies', 'Widgets', 'Agency', 'Technical', 'Troubleshooting'].map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={
                          category === 'Getting Started' ? 'Rocket' :
                          category === 'Policies' ? 'Shield' :
                          category === 'Widgets' ? 'Layout' :
                          category === 'Agency' ? 'Users' :
                          category === 'Technical' ? 'Code' :
                          'Tool'
                        } 
                        className="h-4 w-4 text-primary" 
                      />
                    </div>
                    <h4 className="font-medium text-gray-900">{category}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {helpArticles.filter(article => article.category === category).length} articles
                  </p>
                </motion.div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Articles
              </h3>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {article.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <ApperIcon name="Eye" className="h-3 w-3" />
                            <span>{article.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ApperIcon name="ThumbsUp" className="h-3 w-3" />
                            <span>{article.helpful}% helpful</span>
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <ApperIcon name="ChevronRight" className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'tickets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Support Tickets
              </h3>
              <Button 
                variant="primary" 
                onClick={() => setActiveTab('contact')}
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          #{ticket.id} {ticket.subject}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.status === 'Open' ? 'bg-warning/10 text-warning' :
                          ticket.status === 'Resolved' ? 'bg-success/10 text-success' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.priority === 'High' ? 'bg-error/10 text-error' :
                          ticket.priority === 'Medium' ? 'bg-warning/10 text-warning' :
                          'bg-info/10 text-info'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{ticket.category}</span>
                        <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                        <span>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ApperIcon name="MessageSquare" className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {supportTickets.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="MessageSquare" className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No support tickets
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any support tickets yet.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('contact')}
                >
                  Create Your First Ticket
                </Button>
              </div>
            )}
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Support
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <FormField
                label="Subject"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="select"
                  label="Category"
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  options={[
                    { value: 'general', label: 'General Question' },
                    { value: 'technical', label: 'Technical Issue' },
                    { value: 'billing', label: 'Billing' },
                    { value: 'feature', label: 'Feature Request' },
                    { value: 'bug', label: 'Bug Report' }
                  ]}
                  required
                />

                <FormField
                  type="select"
                  label="Priority"
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' }
                  ]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  className="input-field"
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ApperIcon name="Upload" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop files here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary">
                  <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        )

      case 'resources':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resources & Documentation
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="BookOpen" className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Documentation</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete technical documentation for developers and integrators.
                </p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Video" className="h-5 w-5 text-success" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Video Tutorials</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Step-by-step video guides for common tasks and features.
                </p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                  Watch Videos
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Download" className="h-5 w-5 text-warning" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Templates</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Pre-built policy templates and widget configurations.
                </p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Users" className="h-5 w-5 text-info" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Community</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect with other users and share best practices.
                </p>
                <Button variant="outline" size="sm">
                  <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
                  Join Forum
                </Button>
              </div>
            </div>

            <div className="bg-gradient-primary rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Need Personal Help?</h3>
                  <p className="text-blue-100">
                    Schedule a one-on-one consultation with our compliance experts
                  </p>
                </div>
                <Button variant="secondary" size="lg">
                  <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Mail" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@compliancehub.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Phone" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Clock" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="MessageCircle" className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-1">
          Get help with ComplianceHub and find answers to your questions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sticky top-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support