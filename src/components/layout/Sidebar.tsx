import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  MessageCircle, 
  Target, 
  Scan, 
  AlertTriangle, 
  FileText,
  Activity,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Targets', href: '/targets', icon: Target },
  { name: 'Scanning', href: '/scanning', icon: Scan },
  { name: 'Vulnerabilities', href: '/vulnerabilities', icon: AlertTriangle },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-heading text-lg font-semibold text-slate-900 dark:text-gray-50">Truth</h1>
            <p className="text-xs text-slate-600 dark:text-gray-400">Security Operations</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50 hover:bg-white/60 hover:backdrop-blur-lg'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-slate-200/60">
        <div className="backdrop-blur-lg bg-blue-50/80 rounded-xl p-3 border border-blue-200/50">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-700">System Status</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400">All services operational</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar