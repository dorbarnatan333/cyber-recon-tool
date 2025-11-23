import React from 'react'
import { Bell, Search, User, Wifi } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="h-16 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/60 flex items-center justify-between px-6 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search targets, vulnerabilities, scans..."
            className="w-full backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/60 focus:bg-white/90 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Network Status */}
        <div className="flex items-center space-x-2 text-xs">
          <Wifi className="w-4 h-4 text-blue-500" />
          <span className="text-slate-600 dark:text-gray-400">Connected</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-100 rounded-xl hover:bg-white/60 hover:backdrop-blur-lg transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right text-xs">
            <p className="text-slate-900 dark:text-gray-100 font-medium">Security Analyst</p>
            <p className="text-slate-600 dark:text-gray-400">admin@truth.local</p>
          </div>
          <button className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-100 rounded-xl hover:bg-white/60 hover:backdrop-blur-lg transition-all duration-200">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header