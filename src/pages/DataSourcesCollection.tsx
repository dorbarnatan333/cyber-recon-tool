import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Network, HardDrive, Shield, Monitor, Building, FileText, Settings, Database, Activity, TrendingUp, Wifi, BarChart3, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, TestTube, Play, Pause, Download, ExternalLink, Search, Info } from 'lucide-react'
import { Button, Card, CardHeader, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import StickyHeader, { BreadcrumbItem, SystemInfo } from '@/components/StickyHeader'

// Mock data for data sources based on PRD specifications
const mockDataSources = [
  {
    id: '1',
    name: 'CrowdStrike Falcon EDR Agent',
    type: 'EDR',
    priority: 'critical',
    version: '7.08.17506',
    status: 'healthy',
    healthScore: 98,
    lastSeen: '12 seconds ago',
    eventsCollected24h: 14230,
    dataVolume24h: '67.8 MB',
    eventRate: '9.9 events/min',
    dropRate: 0.2,
    latency: 1.3,
    enabledEventTypes: ['Process Execution', 'File Activity', 'Network Connections', 'Registry Changes', 'DNS Queries', 'Authentication Events'],
    issues: []
  },
  {
    id: '2',
    name: 'Windows Event Logs',
    type: 'System Logs',
    priority: 'critical',
    version: 'N/A',
    status: 'healthy',
    healthScore: 95,
    lastSeen: '8 seconds ago',
    eventsCollected24h: 6453,
    dataVolume24h: '42.1 MB',
    eventRate: '4.5 events/min',
    dropRate: 0.5,
    latency: 0.8,
    enabledEventTypes: ['Security', 'System', 'Application'],
    issues: []
  },
  {
    id: '3',
    name: 'Network Traffic Monitor',
    type: 'Network',
    priority: 'critical',
    version: 'Zeek 5.0.3',
    status: 'healthy',
    healthScore: 92,
    lastSeen: '3 seconds ago',
    eventsCollected24h: 2890,
    dataVolume24h: '23.4 MB',
    eventRate: '2.0 events/min',
    dropRate: 1.2,
    latency: 2.1,
    enabledEventTypes: ['Connection Logs', 'DNS', 'HTTP', 'SSL'],
    issues: []
  },
  {
    id: '4',
    name: 'DHCP Server Logs',
    type: 'Network',
    priority: 'high',
    version: 'Windows Server 2019',
    status: 'degraded',
    healthScore: 73,
    lastSeen: '8 minutes ago',
    eventsCollected24h: 782,
    dataVolume24h: '1.2 MB',
    eventRate: '0.5 events/min',
    dropRate: 8.3,
    latency: 12.5,
    enabledEventTypes: ['Lease Granted', 'Lease Renewed', 'Lease Released'],
    issues: [
      'High latency: 12.5 min average (expected <2 min)',
      'Drop rate elevated: 8.3% (threshold: 5%)'
    ]
  },
  {
    id: '5',
    name: 'Syslog Forwarder',
    type: 'System Logs',
    priority: 'medium',
    version: 'rsyslog 8.2102.0',
    status: 'offline',
    healthScore: 0,
    lastSeen: '2 hours ago',
    eventsCollected24h: 227,
    dataVolume24h: '0.4 MB',
    eventRate: '0.0 events/min',
    dropRate: 100,
    latency: null,
    enabledEventTypes: ['System Messages', 'Authentication', 'Application Logs'],
    issues: ['No data received for 2 hours 14 minutes']
  },
  {
    id: '6',
    name: 'File Integrity Monitor',
    type: 'File Monitoring',
    priority: 'medium',
    version: 'OSSEC 3.7.0',
    status: 'healthy',
    healthScore: 88,
    lastSeen: '45 seconds ago',
    eventsCollected24h: 156,
    dataVolume24h: '0.8 MB',
    eventRate: '0.1 events/min',
    dropRate: 0.0,
    latency: 3.5,
    enabledEventTypes: ['File Created', 'File Modified', 'File Deleted'],
    issues: []
  },
  {
    id: '7',
    name: 'Registry Monitor (Sysmon)',
    type: 'Registry',
    priority: 'medium',
    version: 'Sysmon 14.12',
    status: 'healthy',
    healthScore: 90,
    lastSeen: '18 seconds ago',
    eventsCollected24h: 324,
    dataVolume24h: '1.9 MB',
    eventRate: '0.2 events/min',
    dropRate: 0.8,
    latency: 2.7,
    enabledEventTypes: ['Registry Key Created', 'Registry Value Set', 'Registry Key Deleted'],
    issues: []
  }
]

// Calculate aggregate statistics
const stats = {
  activeSources: mockDataSources.length,
  eventsCollected24h: mockDataSources.reduce((sum, source) => sum + source.eventsCollected24h, 0),
  dataVolume24h: '145.3 MB',
  overallHealthScore: 98,
  healthyCount: mockDataSources.filter(s => s.status === 'healthy').length,
  degradedCount: mockDataSources.filter(s => s.status === 'degraded').length,
  offlineCount: mockDataSources.filter(s => s.status === 'offline').length
}

// Status components
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'degraded':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'offline':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-3 h-3" />
      case 'degraded':
        return <AlertTriangle className="w-3 h-3" />
      case 'offline':
        return <XCircle className="w-3 h-3" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
      getStatusStyle(status)
    )}>
      {getStatusIcon(status)}
      <span className="capitalize">{status}</span>
    </div>
  )
}

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded text-xs font-medium border",
      getPriorityStyle(priority)
    )}>
      <span className="capitalize">{priority}</span>
    </div>
  )
}

const getDataSourceIcon = (type: string) => {
  switch (type) {
    case 'EDR':
      return <Shield className="w-5 h-5" />
    case 'Network':
      return <Wifi className="w-5 h-5" />
    case 'System Logs':
      return <FileText className="w-5 h-5" />
    case 'File Monitoring':
      return <HardDrive className="w-5 h-5" />
    case 'Registry':
      return <Settings className="w-5 h-5" />
    case 'Database':
      return <Database className="w-5 h-5" />
    default:
      return <Monitor className="w-5 h-5" />
  }
}

const getDataSourceIconColor = (type: string, status: string) => {
  if (status === 'offline' || status === 'error') return 'text-red-600 bg-red-100'
  if (status === 'degraded') return 'text-yellow-600 bg-yellow-100'
  
  switch (type) {
    case 'EDR':
      return 'text-blue-600 bg-blue-100'
    case 'Network':
      return 'text-green-600 bg-green-100'
    case 'System Logs':
      return 'text-purple-600 bg-purple-100'
    case 'File Monitoring':
      return 'text-orange-600 bg-orange-100'
    case 'Registry':
      return 'text-indigo-600 bg-indigo-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const DataSourcesCollection: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [dataSources, setDataSources] = useState(mockDataSources)
  const [selectedDataSource, setSelectedDataSource] = useState<typeof mockDataSources[0] | null>(null)
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Create system info for StickyHeader
  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Data Sources & Collection'
  }

  // Create breadcrumbs for StickyHeader
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'Data Sources', link: null } // Current page
  ]

  // StickyHeader action handlers
  const handleSave = () => {
    console.log('Saving data sources configuration for device:', deviceId)
    alert('Data sources configuration saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting data sources report as:', format, 'for device:', deviceId)
    alert(`Exporting data sources report as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleSettings = () => {
    console.log('Opening data sources settings for device:', deviceId)
    alert('Data sources settings would open here')
  }

  const toggleSourceExpansion = (sourceId: string) => {
    const newExpanded = new Set(expandedSources)
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId)
    } else {
      newExpanded.add(sourceId)
    }
    setExpandedSources(newExpanded)
  }

  const handleViewEvents = (source: typeof mockDataSources[0]) => {
    console.log('Viewing events for data source:', source.name)
    alert(`Would open event drill-down for ${source.name} (${source.eventsCollected24h} events)`)
  }

  const handleTestConnection = (source: typeof mockDataSources[0]) => {
    console.log('Testing connection for:', source.name)
    alert(`Testing connection to ${source.name}...`)
  }

  const handleRestartAgent = (source: typeof mockDataSources[0]) => {
    console.log('Restarting agent for:', source.name)
    alert(`Restarting ${source.name}...`)
  }

  const handleToggleSelection = (sourceId: string) => {
    const newSelected = new Set(selectedSources)
    if (newSelected.has(sourceId)) {
      newSelected.delete(sourceId)
    } else {
      newSelected.add(sourceId)
    }
    setSelectedSources(newSelected)
  }

  const handleSelectAll = () => {
    setSelectedSources(new Set(dataSources.map(s => s.id)))
  }

  const handleDeselectAll = () => {
    setSelectedSources(new Set())
  }

  const handleBulkExportLogs = () => {
    console.log('Bulk exporting logs for sources:', Array.from(selectedSources))
    alert(`Exporting logs for ${selectedSources.size} selected sources...`)
  }

  const handleBulkTestConnections = () => {
    console.log('Testing connections for sources:', Array.from(selectedSources))
    alert(`Testing connections for ${selectedSources.size} selected sources...`)
  }

  // Filter data sources based on search term and filters
  const filteredDataSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || source.status === statusFilter
    const matchesType = typeFilter === 'all' || source.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <>
      {/* Sticky Header */}
      <StickyHeader
        systemInfo={systemInfo}
        breadcrumbs={breadcrumbs}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={isLoading}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">

          {/* Navigation */}
          <nav className="flex-1 p-4 pt-6 space-y-2">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
              { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
              { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
              { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database, active: true },
              { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info },
              { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
              { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
              { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  onClick={() => !item.active && navigate(item.href)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700">Investigation Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                  Data Sources & Collection: {deviceId}
                </h1>
                <p className="text-body-sm text-slate-600 dark:text-gray-300">
                  Monitor and manage security data collection sources for this endpoint
                </p>
                <div className="mt-2 text-sm text-slate-500">
                  Device Info: DESKTOP-LAB-01 • IP: 192.168.1.50 • OS: Windows 10 Pro
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Last Updated: 2 minutes ago • <StatusBadge status="healthy" /> Overall Status
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card variant="glass">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Active Sources</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.activeSources}</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        {mockDataSources.filter(s => s.priority === 'critical').length} critical, {' '}
                        {mockDataSources.filter(s => s.priority !== 'critical').length} optional
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Events (24h)</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.eventsCollected24h.toLocaleString()}</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        +12% vs avg
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Data Volume</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.dataVolume24h}</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        +8% vs avg
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Health Status</p>
                        <p className="text-2xl font-bold text-green-600">{stats.overallHealthScore}%</p>
                      </div>
                      <div className="text-xs text-slate-500">
                        Healthy
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Collection Activity Timeline */}
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Collection Activity (Last 24 Hours)</h3>
                    <div className="flex items-center space-x-2">
                      <select className="px-3 py-1 border border-slate-200 rounded text-sm">
                        <option>Last 24h</option>
                        <option>Last 7d</option>
                        <option>Last 30d</option>
                      </select>
                      <Button variant="secondary" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 p-4">
                    {/* Timeline Chart */}
                    <div className="h-full relative">
                      {/* Y-Axis */}
                      <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-slate-500 pr-2">
                        <span>2000</span>
                        <span>1500</span>
                        <span>1000</span>
                        <span>500</span>
                        <span>0</span>
                      </div>
                      
                      {/* Chart Area */}
                      <div className="ml-8 h-full relative">
                        <svg className="w-full h-full">
                          {/* Grid Lines */}
                          <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Stacked Area Chart */}
                          <g>
                            {/* EDR Layer (Bottom) */}
                            <path
                              d="M0,200 L60,190 L120,180 L180,170 L240,160 L300,150 L360,140 L420,130 L480,125 L540,120 L600,115 L660,110 L720,105 L780,100 L840,95 L900,90 L960,85 L1020,80 L1020,240 L0,240 Z"
                              fill="#3b82f6"
                              opacity="0.7"
                            />
                            
                            {/* Windows Events Layer */}
                            <path
                              d="M0,200 L60,185 L120,170 L180,155 L240,140 L300,125 L360,115 L420,105 L480,100 L540,95 L600,90 L660,85 L720,80 L780,75 L840,70 L900,65 L960,60 L1020,55 L1020,80 L960,85 L900,90 L840,95 L780,100 L720,105 L660,110 L600,115 L540,120 L480,125 L420,130 L360,140 L300,150 L240,160 L180,170 L120,180 L60,190 Z"
                              fill="#10b981"
                              opacity="0.7"
                            />
                            
                            {/* Network Layer */}
                            <path
                              d="M0,200 L60,175 L120,150 L180,135 L240,120 L300,105 L360,95 L420,85 L480,80 L540,75 L600,70 L660,65 L720,60 L780,55 L840,50 L900,45 L960,40 L1020,35 L1020,55 L960,60 L900,65 L840,70 L780,75 L720,80 L660,85 L600,90 L540,95 L480,100 L420,105 L360,115 L300,125 L240,140 L180,155 L120,170 L60,185 Z"
                              fill="#8b5cf6"
                              opacity="0.7"
                            />
                            
                            {/* DHCP Layer */}
                            <path
                              d="M0,200 L60,165 L120,130 L180,115 L240,100 L300,85 L360,75 L420,65 L480,60 L540,55 L600,50 L660,45 L720,40 L780,35 L840,30 L900,25 L960,20 L1020,15 L1020,35 L960,40 L900,45 L840,50 L780,55 L720,60 L660,65 L600,70 L540,75 L480,80 L420,85 L360,95 L300,105 L240,120 L180,135 L120,150 L60,175 Z"
                              fill="#f59e0b"
                              opacity="0.7"
                            />
                            
                            {/* Others Layer (Top) */}
                            <path
                              d="M0,200 L60,155 L120,110 L180,95 L240,80 L300,65 L360,55 L420,45 L480,40 L540,35 L600,30 L660,25 L720,20 L780,15 L840,10 L900,5 L960,5 L1020,0 L1020,15 L960,20 L900,25 L840,30 L780,35 L720,40 L660,45 L600,50 L540,55 L480,60 L420,65 L360,75 L300,85 L240,100 L180,115 L120,130 L60,165 Z"
                              fill="#ef4444"
                              opacity="0.7"
                            />
                          </g>
                        </svg>
                        
                        {/* X-Axis Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 pt-2">
                          <span>00:00</span>
                          <span>06:00</span>
                          <span>12:00</span>
                          <span>18:00</span>
                          <span>23:59</span>
                        </div>
                      </div>
                      
                      {/* Y-Axis Label */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500 -translate-x-6">
                        Events/Hour
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded opacity-70"></div>
                        <span className="text-slate-600">EDR Agent (14,230 events)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded opacity-70"></div>
                        <span className="text-slate-600">Windows Events (6,453)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded opacity-70"></div>
                        <span className="text-slate-600">Network Traffic (2,890)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded opacity-70"></div>
                        <span className="text-slate-600">DHCP Logs (782)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded opacity-70"></div>
                        <span className="text-slate-600">Others (707)</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-center text-xs text-slate-500">
                      Click layer to filter • Hover for details • Drag to zoom
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bulk Selection Bar */}
              {selectedSources.size > 0 && (
                <Card variant="glass" className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-900">
                          {selectedSources.size} sources selected
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleBulkExportLogs}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export All Logs
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleBulkTestConnections}
                        >
                          <TestTube className="w-4 h-4 mr-1" />
                          Test Connections
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeselectAll}
                      >
                        Deselect All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Sources Overview */}
              <Card variant="glass">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">Data Sources Overview</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectedSources.size === dataSources.length ? handleDeselectAll : handleSelectAll}
                      >
                        {selectedSources.size === dataSources.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search and Filter Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search data sources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="healthy">Healthy</option>
                      <option value="degraded">Degraded</option>
                      <option value="offline">Offline</option>
                    </select>
                    
                    {/* Type Filter */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="EDR">EDR</option>
                      <option value="Network">Network</option>
                      <option value="System Logs">System Logs</option>
                      <option value="File Monitoring">File Monitoring</option>
                      <option value="Registry">Registry</option>
                    </select>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Results Count */}
                  <div className="mb-4 text-sm text-slate-600">
                    Showing {filteredDataSources.length} of {dataSources.length} data sources
                  </div>
                  
                  <div className="space-y-4">
                    {filteredDataSources.map((source) => (
                      <div
                        key={source.id}
                        className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white"
                      >
                        {/* Source Header */}
                        <div className="flex items-center space-x-4 mb-3">
                          {/* Checkbox for bulk selection */}
                          <input
                            type="checkbox"
                            checked={selectedSources.has(source.id)}
                            onChange={() => handleToggleSelection(source.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            getDataSourceIconColor(source.type, source.status)
                          )}>
                            {getDataSourceIcon(source.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-base font-semibold text-slate-900">{source.name}</h4>
                              <StatusBadge status={source.status} />
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <span>Type: {source.type}</span>
                              <span className="text-slate-400">•</span>
                              <PriorityBadge priority={source.priority} />
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900">Health: {source.healthScore}%</div>
                            <div className="text-xs text-slate-500">Version: {source.version}</div>
                            <div className="text-xs text-slate-500">Last Seen: {source.lastSeen}</div>
                          </div>
                        </div>

                        {/* Issues (if any) */}
                        {source.issues.length > 0 && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-900">Issues Detected:</span>
                            </div>
                            <ul className="text-sm text-red-800 space-y-1">
                              {source.issues.map((issue, index) => (
                                <li key={index}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Collection Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Events Collected (24h):</span>
                            <div className="text-slate-900 font-semibold">{source.eventsCollected24h.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="font-medium">Data Volume:</span>
                            <div className="text-slate-900 font-semibold">{source.dataVolume24h}</div>
                          </div>
                          <div>
                            <span className="font-medium">Event Rate:</span>
                            <div className="text-slate-900 font-semibold">{source.eventRate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Drop Rate:</span>
                            <div className={cn(
                              "font-semibold flex items-center space-x-1",
                              source.dropRate > 10 ? "text-red-600" : 
                              source.dropRate > 5 ? "text-orange-600" : 
                              source.dropRate > 2 ? "text-yellow-600" : "text-green-600"
                            )}>
                              {source.dropRate > 10 && <XCircle className="w-3 h-3" />}
                              {source.dropRate > 5 && source.dropRate <= 10 && <AlertTriangle className="w-3 h-3" />}
                              {source.dropRate > 2 && source.dropRate <= 5 && <AlertTriangle className="w-3 h-3" />}
                              {source.dropRate <= 2 && <CheckCircle className="w-3 h-3" />}
                              <span>{source.dropRate}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Enabled Event Types */}
                        <div className="mb-4">
                          <div className="text-sm font-medium text-slate-900 mb-2">Enabled Event Types:</div>
                          <div className="flex flex-wrap gap-2">
                            {source.enabledEventTypes.map((eventType, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {eventType}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewEvents(source)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Events ({source.eventsCollected24h.toLocaleString()})
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleSourceExpansion(source.id)}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            View Configuration
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleTestConnection(source)}
                          >
                            <TestTube className="w-4 h-4 mr-1" />
                            Test Connection
                          </Button>
                          {(source.status === 'degraded' || source.status === 'offline') && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRestartAgent(source)}
                              className="border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Restart Agent
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export Logs
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default DataSourcesCollection