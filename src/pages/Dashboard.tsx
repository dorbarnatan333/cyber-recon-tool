import React from 'react'
import { Shield, Target, AlertTriangle, Activity, TrendingUp, Clock } from 'lucide-react'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading text-h2 font-semibold text-gray-50">
            Security Operations Center
          </h1>
          <p className="text-body-sm text-gray-400 mt-1">
            Real-time monitoring and threat analysis dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
          <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Targets */}
        <div className="glass rounded-xl p-6 border-l-4 border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-400">Active Targets</p>
              <p className="text-h3 font-bold text-gray-50 mt-1">24</p>
            </div>
            <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-700" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <TrendingUp className="w-3 h-3 text-success-800 mr-1" />
            <span className="text-success-800">+3 this week</span>
          </div>
        </div>

        {/* Running Scans */}
        <div className="glass rounded-xl p-6 border-l-4 border-cyber-matrix">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-400">Active Scans</p>
              <p className="text-h3 font-bold text-gray-50 mt-1">3</p>
            </div>
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyber-matrix animate-pulse" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse mr-2"></div>
            <span className="text-cyber-matrix">2 port scans, 1 vuln scan</span>
          </div>
        </div>

        {/* Critical Vulnerabilities */}
        <div className="glass rounded-xl p-6 border-l-4 border-danger-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-400">Critical Vulnerabilities</p>
              <p className="text-h3 font-bold text-gray-50 mt-1">12</p>
            </div>
            <div className="w-12 h-12 bg-danger-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-danger-700" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-danger-700">Immediate attention required</span>
          </div>
        </div>

        {/* Security Score */}
        <div className="glass rounded-xl p-6 border-l-4 border-warning-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-medium text-gray-400">Security Score</p>
              <p className="text-h3 font-bold text-gray-50 mt-1">78/100</p>
            </div>
            <div className="w-12 h-12 bg-warning-900 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-warning-700" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-warning-700">Moderate risk level</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-heading text-h4 font-semibold text-gray-50 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', action: 'Port scan completed', target: '192.168.1.100', status: 'success' },
              { time: '15 minutes ago', action: 'Vulnerability scan started', target: 'web-server-01', status: 'active' },
              { time: '1 hour ago', action: 'Critical vulnerability detected', target: 'database-prod', status: 'critical' },
              { time: '2 hours ago', action: 'New target added', target: '10.0.0.50', status: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-success-800' :
                  activity.status === 'active' ? 'bg-cyber-matrix animate-pulse' :
                  activity.status === 'critical' ? 'bg-danger-700' :
                  'bg-primary-700'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-gray-50">{activity.action}</p>
                  <p className="text-xs text-gray-400 text-mono">{activity.target}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-heading text-h4 font-semibold text-gray-50 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary-900 hover:bg-primary-800 rounded-lg border border-primary-700 transition-colors group">
              <Target className="w-6 h-6 text-primary-700 mx-auto mb-2 group-hover:text-primary-600" />
              <p className="text-body-sm font-medium text-gray-50">Add Target</p>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors group">
              <Activity className="w-6 h-6 text-cyber-matrix mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-body-sm font-medium text-gray-50">Start Scan</p>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors group">
              <AlertTriangle className="w-6 h-6 text-warning-700 mx-auto mb-2" />
              <p className="text-body-sm font-medium text-gray-50">View Alerts</p>
            </button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors group">
              <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-body-sm font-medium text-gray-50">Generate Report</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard