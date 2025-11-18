import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Monitor, Activity, Shield, Network, Building, FileText, Settings } from 'lucide-react'
import { Button, Card, CardHeader, CardContent } from '@/components/ui'

const Investigation: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Dedicated Sidebar for Investigation */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search/results', { state: { fromInvestigation: true } })}
            className="flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-cyber-matrix" />
            </div>
            <div>
              <h1 className="text-heading text-lg font-semibold text-gray-50">Truth</h1>
              <p className="text-xs text-gray-400">Deep Investigation</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor, active: true },
            { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
            { name: 'System Activity', href: `/investigate/${deviceId}/activity`, icon: Activity },
            { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
            { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
            { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
            { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'bg-primary-800 text-cyber-matrix border border-primary-700 btn-glow-matrix'
                    : 'text-gray-300 hover:text-gray-50 hover:bg-gray-800 cursor-pointer'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            )
          })}
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-300">Investigation Active</span>
            </div>
            <p className="text-xs text-gray-400">Device: {deviceId}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-heading text-2xl font-bold text-gray-50 mb-2">
                Device Investigation Overview
              </h1>
              <p className="text-body-sm text-gray-400">
                Deep analysis and investigation tools for device: {deviceId}
              </p>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-gray-50">
                    🚧 Investigation Tools
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-900/20 border border-primary-700/50 rounded-lg">
                      <h3 className="text-body font-medium text-primary-300 mb-2">Coming in Next Phase</h3>
                      <ul className="space-y-2 text-body-sm text-gray-400">
                        <li>• Real-time system monitoring</li>
                        <li>• Network traffic analysis</li>
                        <li>• File system investigation</li>
                        <li>• Process and service analysis</li>
                        <li>• User activity timeline</li>
                        <li>• Security event correlation</li>
                      </ul>
                    </div>
                    
                    <Button variant="primary" disabled className="w-full">
                      <Activity className="w-4 h-4 mr-2" />
                      Start Deep Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-gray-50">
                    📊 Investigation Scope
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-gray-300">System Analysis</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Network className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-gray-300">Network Forensics</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-gray-300">Security Events</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Building className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-body-sm font-medium text-gray-300">Company Context</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-warning-900/20 border border-warning-700/50 rounded-lg">
                      <p className="text-body-sm text-warning-300 text-center">
                        Comprehensive investigation tools will be available in the next development phase
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card variant="solid">
                <CardHeader>
                  <h2 className="text-heading text-h4 font-semibold text-gray-50">
                    Quick Actions
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="secondary" disabled>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="secondary" disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Security Scan
                    </Button>
                    <Button variant="secondary" disabled>
                      <Network className="w-4 h-4 mr-2" />
                      Network Trace
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/search/results')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Search Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Investigation