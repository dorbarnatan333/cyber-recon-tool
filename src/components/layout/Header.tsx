import React from 'react'
import { Bell, Search, User, Wifi } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search targets, vulnerabilities, scans..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Network Status */}
        <div className="flex items-center space-x-2 text-xs">
          <Wifi className="w-4 h-4 text-cyber-matrix" />
          <span className="text-gray-300">Connected</span>
          <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse"></div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-50 rounded-lg hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-700 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right text-xs">
            <p className="text-gray-50 font-medium">Security Analyst</p>
            <p className="text-gray-400">admin@cyberrecon.local</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-50 rounded-lg hover:bg-gray-800 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header