import { motion } from 'framer-motion'

const Loading = ({ type = 'default', className = '' }) => {
  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer" />
                <div className="h-3 bg-gray-200 rounded w-3/4 shimmer" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded shimmer" />
              <div className="h-3 bg-gray-200 rounded w-5/6 shimmer" />
              <div className="h-3 bg-gray-200 rounded w-4/6 shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 shimmer" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 shimmer" />
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 shimmer" />
                  <div className="h-8 bg-gray-200 rounded w-1/2 shimmer" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl shimmer" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 shimmer" />
              <div className="h-64 bg-gray-200 rounded shimmer" />
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 shimmer" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default Loading