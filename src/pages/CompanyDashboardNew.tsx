import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Shield, Activity, AlertTriangle, Download, RefreshCw, Server, Wifi, Bug, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui'
import { Device, getCompanyData, getAllCompanies } from '@/data/mockEndpointData'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

interface DashboardData {
  totalDevices: number
  activeDevices: number
  criticalHighDevices: number
  avgSuspiciousIndicators: number
  deviceTypeBreakdown: Record<string, number>
  osDistribution: Record<string, number>
  riskLevelDistribution: Record<string, number>
  activityTimeline: Array<{ date: string; count: number }>
  topOpenPorts: Array<{ port: number; count: number }>
  topUsers: Array<{ username: string; deviceCount: number; lastSeen: string }>
  networkSegments: Record<string, number>
  topIndicators: Array<{ type: string; description: string; count: number; severity: string }>
}

// iOS/iPadOS inspired soft color palette
const COLORS = {
  primary: '#007AFF',      // iOS Blue
  success: '#34C759',      // iOS Green
  warning: '#FF9500',      // iOS Orange
  danger: '#FF3B30',       // iOS Red
  purple: '#AF52DE',       // iOS Purple
  cyan: '#5AC8FA',         // iOS Cyan
  pink: '#FF2D55',         // iOS Pink
  teal: '#5AC8FA',         // iOS Teal
  indigo: '#5856D6',       // iOS Indigo
}

// Soft pastel colors for charts
const DEVICE_COLORS = ['#007AFF', '#AF52DE', '#5AC8FA', '#34C759', '#FF9500']
const RISK_COLORS = {
  critical: '#FF3B30',
  high: '#FF9500',
  medium: '#FFCC00',
  low: '#34C759',
  none: '#8E8E93'
}

const CompanyDashboardNew: React.FC = () => {
  const { companyName } = useParams<{ companyName: string }>()
  const navigate = useNavigate()
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    if (!companyName) {
      navigate('/search')
      return
    }

    const decodedName = decodeURIComponent(companyName)
    const companyDevices = getCompanyData(decodedName)

    if (!companyDevices || companyDevices.length === 0) {
      const allCompanies = getAllCompanies()
      const matchedCompany = allCompanies.find(c =>
        c.toLowerCase().includes(decodedName.toLowerCase())
      )

      if (matchedCompany) {
        setDevices(getCompanyData(matchedCompany))
      }
    } else {
      setDevices(companyDevices)
    }

    setIsLoading(false)
  }, [companyName, navigate])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
    }, 60000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const dashboardData: DashboardData = useMemo(() => {
    const now = new Date()
    const timeRangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      'all': Infinity
    }[timeRange] || Infinity

    const filteredDevices = devices.filter(device => {
      const deviceTime = new Date(device.last_activity)
      return now.getTime() - deviceTime.getTime() <= timeRangeMs
    })

    const totalDevices = filteredDevices.length
    const activeDevices = filteredDevices.filter(d => {
      const lastActivity = new Date(d.last_activity)
      return now.getTime() - lastActivity.getTime() < 24 * 60 * 60 * 1000
    }).length

    const criticalHighDevices = filteredDevices.filter(d =>
      d.risk_level === 'critical' || d.risk_level === 'high'
    ).length

    const totalIndicators = filteredDevices.reduce((sum, d) =>
      sum + d.suspicious_indicators.length, 0
    )
    const avgSuspiciousIndicators = totalDevices > 0
      ? Math.round((totalIndicators / totalDevices) * 10) / 10
      : 0

    const deviceTypeBreakdown: Record<string, number> = {}
    filteredDevices.forEach(d => {
      deviceTypeBreakdown[d.device_type] = (deviceTypeBreakdown[d.device_type] || 0) + 1
    })

    const osDistribution: Record<string, number> = {}
    filteredDevices.forEach(d => {
      const osName = d.operating_system.name
      osDistribution[osName] = (osDistribution[osName] || 0) + 1
    })

    const riskLevelDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      none: 0
    }
    filteredDevices.forEach(d => {
      riskLevelDistribution[d.risk_level]++
    })

    const activityTimeline: Array<{ date: string; count: number }> = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = filteredDevices.filter(d => {
        const deviceDate = new Date(d.last_activity)
        return deviceDate >= date && deviceDate < nextDate
      }).length

      activityTimeline.push({
        date: date.toISOString().split('T')[0],
        count
      })
    }

    const portCounts: Record<number, number> = {}
    filteredDevices.forEach(d => {
      d.open_ports.forEach(port => {
        portCounts[port] = (portCounts[port] || 0) + 1
      })
    })
    const topOpenPorts = Object.entries(portCounts)
      .map(([port, count]) => ({ port: Number(port), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const userDevices: Record<string, { count: number; lastSeen: string }> = {}
    filteredDevices.forEach(d => {
      d.users.forEach(user => {
        if (!userDevices[user.username]) {
          userDevices[user.username] = { count: 0, lastSeen: user.last_login }
        }
        userDevices[user.username].count++
        if (new Date(user.last_login) > new Date(userDevices[user.username].lastSeen)) {
          userDevices[user.username].lastSeen = user.last_login
        }
      })
    })
    const topUsers = Object.entries(userDevices)
      .map(([username, data]) => ({
        username,
        deviceCount: data.count,
        lastSeen: data.lastSeen
      }))
      .sort((a, b) => b.deviceCount - a.deviceCount)
      .slice(0, 10)

    const networkSegments: Record<string, number> = {}
    filteredDevices.forEach(d => {
      const subnet = d.ip_address.split('.').slice(0, 3).join('.') + '.0/24'
      networkSegments[subnet] = (networkSegments[subnet] || 0) + 1
    })

    const indicatorCounts: Record<string, { count: number; severity: string }> = {}
    filteredDevices.forEach(d => {
      d.suspicious_indicators.forEach(indicator => {
        const key = indicator.description
        if (!indicatorCounts[key]) {
          indicatorCounts[key] = { count: 0, severity: indicator.severity }
        }
        indicatorCounts[key].count++
      })
    })
    const topIndicators = Object.entries(indicatorCounts)
      .map(([description, data]) => ({
        type: description.split(' ')[0].toLowerCase(),
        description,
        count: data.count,
        severity: data.severity
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalDevices,
      activeDevices,
      criticalHighDevices,
      avgSuspiciousIndicators,
      deviceTypeBreakdown,
      osDistribution,
      riskLevelDistribution,
      activityTimeline,
      topOpenPorts,
      topUsers,
      networkSegments,
      topIndicators
    }
  }, [devices, timeRange])

  const drillDown = (filter: string) => {
    navigate('/search/results', {
      state: {
        query: decodeURIComponent(companyName || ''),
        searchType: 'company',
        timestamp: new Date().toISOString(),
        jqlQuery: filter
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Convert data for Recharts
  const deviceTypeData = Object.entries(dashboardData.deviceTypeBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  const osData = Object.entries(dashboardData.osDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  const riskData = Object.entries(dashboardData.riskLevelDistribution)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
      color: RISK_COLORS[name as keyof typeof RISK_COLORS]
    }))

  const portsData = dashboardData.topOpenPorts.map(p => ({
    port: `Port ${p.port}`,
    devices: p.count
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - iOS style */}
      <header className="backdrop-blur-2xl bg-white/80 border-b border-gray-200/60 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {decodeURIComponent(companyName || '')}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Company Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 shadow-sm hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>

              <Button
                variant={autoRefresh ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span>{autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 py-8">
        {/* Summary Cards - 4 across - iOS Style */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Total Endpoints</p>
                <h3 className="text-4xl font-semibold text-gray-900">{dashboardData.totalDevices}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Active (24h)</p>
                <h3 className="text-4xl font-semibold text-gray-900">{dashboardData.activeDevices}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Critical/High Risk</p>
                <h3 className="text-4xl font-semibold text-gray-900">{dashboardData.criticalHighDevices}</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">Avg Indicators/Device</p>
                <h3 className="text-4xl font-semibold text-gray-900">{dashboardData.avgSuspiciousIndicators}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Bug className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts - 3 per row - iOS Style */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Device Type Distribution - Pie Chart */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* OS Distribution - Bar Chart */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={osData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.8)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#111827'
                  }}
                />
                <Bar dataKey="value" fill={COLORS.cyan} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution - Pie Chart */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row - 3 charts */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Activity Timeline - Area Chart */}
          <div className="col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline (30 Days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dashboardData.activityTimeline}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.8)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Ports - Bar Chart */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Open Ports</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={portsData.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.8)" />
                <XAxis type="number" tick={{ fill: '#6B7280' }} />
                <YAxis dataKey="port" type="category" tick={{ fill: '#6B7280', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#111827'
                  }}
                />
                <Bar dataKey="devices" fill={COLORS.warning} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third Row - 3 more sections - iOS Style */}
        <div className="grid grid-cols-3 gap-5">
          {/* Top Users Table */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {dashboardData.topUsers.slice(0, 8).map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">{user.username}</p>
                    <p className="text-gray-500 text-xs">{user.deviceCount} devices</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{user.deviceCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Segments */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Segments</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {Object.entries(dashboardData.networkSegments)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([subnet, count], i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                        <Wifi className="w-4 h-4 text-cyan-500" />
                      </div>
                      <p className="text-gray-900 font-mono text-sm">{subnet}</p>
                    </div>
                    <span className="text-cyan-600 font-semibold text-sm">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Threats */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Threats</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {dashboardData.topIndicators.slice(0, 6).map((indicator, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-gray-900 text-sm font-medium truncate flex-1">{indicator.description}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      indicator.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      indicator.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                      indicator.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {indicator.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{indicator.count} occurrences</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboardNew
