import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [userRole] = useState('agency') // This would come from auth context

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/policies', label: 'Policies', icon: 'Shield' },
    { path: '/widgets', label: 'Widgets', icon: 'Layout' },
    ...(userRole === 'agency' ? [
      { path: '/clients', label: 'Clients', icon: 'Users' }
    ] : []),
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/support', label: 'Support', icon: 'HelpCircle' }
  ]

  const MobileOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={onClose}
    />
  )

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name="Shield" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">ComplianceHub</h1>
            <p className="text-xs text-gray-500">Privacy Platform</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              sidebar-item ${isActive ? 'active' : ''}
            `}
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500 capitalize">{userRole} Account</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && <MobileOverlay />}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-50"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar