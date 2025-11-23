import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Shield, Activity, AlertTriangle, Download, RefreshCw, Clock, Server, Users, Network, Bug } from 'lucide-react'
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Device, getCompanyData, getAllCompanies } from '@/data/mockEndpointData'

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

const CompanyDashboard: React.FC = () => {
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
      // Try to find company by partial match
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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
    }, 60000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Calculate dashboard data
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

    // Total and active devices
    const totalDevices = filteredDevices.length
    const activeDevices = filteredDevices.filter(d => {
      const lastActivity = new Date(d.last_activity)
      return now.getTime() - lastActivity.getTime() < 24 * 60 * 60 * 1000
    }).length

    // Critical/High risk devices
    const criticalHighDevices = filteredDevices.filter(d =>
      d.risk_level === 'critical' || d.risk_level === 'high'
    ).length

    // Average suspicious indicators
    const totalIndicators = filteredDevices.reduce((sum, d) =>
      sum + d.suspicious_indicators.length, 0
    )
    const avgSuspiciousIndicators = totalDevices > 0
      ? Math.round((totalIndicators / totalDevices) * 10) / 10
      : 0

    // Device type breakdown
    const deviceTypeBreakdown: Record<string, number> = {}
    filteredDevices.forEach(d => {
      deviceTypeBreakdown[d.device_type] = (deviceTypeBreakdown[d.device_type] || 0) + 1
    })

    // OS distribution
    const osDistribution: Record<string, number> = {}
    filteredDevices.forEach(d => {
      const osName = d.operating_system.name
      osDistribution[osName] = (osDistribution[osName] || 0) + 1
    })

    // Risk level distribution
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

    // Activity timeline (last 30 days)
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

    // Top open ports
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

    // Top users
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

    // Network segments
    const networkSegments: Record<string, number> = {}
    filteredDevices.forEach(d => {
      const subnet = d.ip_address.split('.').slice(0, 3).join('.') + '.0/24'
      networkSegments[subnet] = (networkSegments[subnet] || 0) + 1
    })

    // Top suspicious indicators
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
        type: description.split(' ')[0],
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

  const exportDashboard = () => {
    const exportData = {
      company: companyName,
      exportedAt: new Date().toISOString(),
      timeRange,
      summary: {
        totalDevices: dashboardData.totalDevices,
        activeDevices: dashboardData.activeDevices,
        criticalHighDevices: dashboardData.criticalHighDevices,
        avgSuspiciousIndicators: dashboardData.avgSuspiciousIndicators
      },
      deviceTypeBreakdown: dashboardData.deviceTypeBreakdown,
      osDistribution: dashboardData.osDistribution,
      riskLevelDistribution: dashboardData.riskLevelDistribution,
      topOpenPorts: dashboardData.topOpenPorts,
      topUsers: dashboardData.topUsers,
      networkSegments: dashboardData.networkSegments,
      topIndicators: dashboardData.topIndicators
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-${companyName}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/60 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-50">
                  {decodeURIComponent(companyName || '')}
                </h1>
                <p className="text-sm text-slate-600 dark:text-gray-400">Company Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-gray-50"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>

              {/* Auto-refresh Toggle */}
              <Button
                variant={autoRefresh ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                title="Auto-refresh every 60s"
              >
                <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
              </Button>

              {/* Export */}
              <Button variant="ghost" size="sm" onClick={exportDashboard}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card variant="glass" className="hover:-translate-y-1 transition-all cursor-pointer" onClick={() => drillDown('')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-gray-50 mb-1">
                {dashboardData.totalDevices}
              </div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Total Endpoints</div>
            </CardContent>
          </Card>

          <Card variant="glass" className="hover:-translate-y-1 transition-all cursor-pointer" onClick={() => drillDown('last_activity < "24h"')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-gray-50 mb-1">
                {dashboardData.activeDevices}
              </div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Active (24h)</div>
            </CardContent>
          </Card>

          <Card variant="glass" className="hover:-translate-y-1 transition-all cursor-pointer" onClick={() => drillDown('risk_level IN ["CRITICAL", "HIGH"]')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <Shield className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-gray-50 mb-1">
                {dashboardData.criticalHighDevices}
              </div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Critical/High Risk</div>
            </CardContent>
          </Card>

          <Card variant="glass" className="hover:-translate-y-1 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Bug className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-gray-50 mb-1">
                {dashboardData.avgSuspiciousIndicators}
              </div>
              <div className="text-sm text-slate-600 dark:text-gray-400">Avg Indicators/Device</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Device Type Breakdown */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Device Type Distribution</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(dashboardData.deviceTypeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => {
                    const percentage = (count / dashboardData.totalDevices) * 100
                    return (
                      <div key={type} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => drillDown(`device_type = "${type}"`)}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300 capitalize">{type}</span>
                          <span className="text-sm text-slate-600 dark:text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* OS Distribution */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Operating System Distribution</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(dashboardData.osDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([os, count]) => {
                    const percentage = (count / dashboardData.totalDevices) * 100
                    return (
                      <div key={os} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => drillDown(`os CONTAINS "${os}"`)}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{os}</span>
                          <span className="text-sm text-slate-600 dark:text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Distribution */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Risk Level Distribution</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(dashboardData.riskLevelDistribution)
                  .filter(([_, count]) => count > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([level, count]) => {
                    const percentage = (count / dashboardData.totalDevices) * 100
                    const colorClass = {
                      critical: 'bg-red-600 dark:bg-red-500',
                      high: 'bg-orange-600 dark:bg-orange-500',
                      medium: 'bg-yellow-600 dark:bg-yellow-500',
                      low: 'bg-blue-600 dark:bg-blue-500',
                      none: 'bg-green-600 dark:bg-green-500'
                    }[level] || 'bg-slate-600'

                    return (
                      <div key={level} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => drillDown(`risk_level = "${level.toUpperCase()}"`)}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300 capitalize">{level}</span>
                          <span className="text-sm text-slate-600 dark:text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`${colorClass} h-2 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Top Open Ports */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Top Open Ports</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {dashboardData.topOpenPorts.map(({ port, count }) => {
                  const maxCount = Math.max(...dashboardData.topOpenPorts.map(p => p.count))
                  const percentage = (count / maxCount) * 100
                  const portName = {
                    22: 'SSH',
                    80: 'HTTP',
                    443: 'HTTPS',
                    3389: 'RDP',
                    445: 'SMB',
                    1433: 'SQL Server',
                    3306: 'MySQL',
                    5432: 'PostgreSQL'
                  }[port] || ''

                  return (
                    <div key={port} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => drillDown(`open_ports CONTAINS "${port}"`)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                          Port {port} {portName && <span className="text-slate-500 dark:text-gray-500">({portName})</span>}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-gray-400">{count} devices</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Users */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Top Users by Device Count</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-700">
                      <th className="text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Username</th>
                      <th className="text-right text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Devices</th>
                      <th className="text-right text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                    {dashboardData.topUsers.map((user, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => drillDown(`users CONTAINS "${user.username}"`)}>
                        <td className="py-3 text-sm font-medium text-slate-900 dark:text-gray-50">{user.username}</td>
                        <td className="py-3 text-sm text-slate-600 dark:text-gray-400 text-right">{user.deviceCount}</td>
                        <td className="py-3 text-sm text-slate-600 dark:text-gray-400 text-right">
                          {new Date(user.lastSeen).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Network Segments */}
          <Card variant="glass">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Network Segmentation</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(dashboardData.networkSegments)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([subnet, count]) => {
                    const maxCount = Math.max(...Object.values(dashboardData.networkSegments))
                    const percentage = (count / maxCount) * 100

                    return (
                      <div key={subnet} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 p-2 rounded transition-colors" onClick={() => drillDown(`ip IN ["${subnet}"]`)}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300 font-mono">{subnet}</span>
                          <span className="text-sm text-slate-600 dark:text-gray-400">{count} devices</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Suspicious Indicators */}
        <Card variant="glass">
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Top Suspicious Indicators</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Indicator</th>
                    <th className="text-center text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Severity</th>
                    <th className="text-right text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider pb-2">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {dashboardData.topIndicators.map((indicator, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => drillDown(`indicators CONTAINS "${indicator.description}"`)}>
                      <td className="py-3 text-sm text-slate-900 dark:text-gray-50">{indicator.description}</td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={
                            indicator.severity === 'critical' ? 'danger' :
                            indicator.severity === 'high' ? 'warning' :
                            indicator.severity === 'medium' ? 'secondary' :
                            'default'
                          }
                          size="sm"
                        >
                          {indicator.severity.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-slate-600 dark:text-gray-400 text-right font-medium">{indicator.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompanyDashboard
