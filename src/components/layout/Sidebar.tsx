import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Shield, 
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
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyber-matrix" />
          </div>
          <div>
            <h1 className="text-heading text-lg font-semibold text-gray-50">CyberRecon</h1>
            <p className="text-xs text-gray-400">Security Operations</p>
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
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-800 text-cyber-matrix border border-primary-700 btn-glow-matrix'
                    : 'text-gray-300 hover:text-gray-50 hover:bg-gray-800'
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
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-300">System Status</span>
          </div>
          <p className="text-xs text-gray-400">All services operational</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar