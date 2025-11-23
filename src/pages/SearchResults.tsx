import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Filter, Copy, Eye, Download, Tag, Monitor, Server, Router, AlertTriangle, BarChart3, FileDown, Search } from 'lucide-react'
import { Button, Card, CardContent, ThreatBadge } from '@/components/ui'
import { cn } from '@/lib/utils'
import JQLSearchBar from '@/components/search/JQLSearchBar'
import { parseJQL, filterDevices, validateJQLSyntax } from '@/lib/jqlParser'
import { Device, generateEndpointsForCompany, generateAllCompaniesData, companies } from '@/data/mockEndpointData'

interface SearchState {
  query: string
  searchType: 'device' | 'company'
  timestamp: string
  jqlQuery?: string
}

interface ModalState {
  type: 'summary' | 'download' | 'favorite' | 'suspicious'
  deviceId: string
}

// Cache for generated company data
let cachedCompanyData: Record<string, Device[]> | null = null

const getCompanyDevices = (companyName: string): Device[] => {
  // Generate all company data if not cached
  if (!cachedCompanyData) {
    cachedCompanyData = generateAllCompaniesData()
  }

  // Try exact match first
  if (cachedCompanyData[companyName]) {
    return cachedCompanyData[companyName]
  }

  // Try case-insensitive partial match
  const matchingCompany = Object.keys(cachedCompanyData).find(
    name => name.toLowerCase().includes(companyName.toLowerCase())
  )

  if (matchingCompany) {
    return cachedCompanyData[matchingCompany]
  }

  // Default to first company if no match
  return cachedCompanyData[companies[0]]
}

const SearchResults: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [jqlQuery, setJqlQuery] = useState('')
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('risk_desc')
  const [filterDeviceType, setFilterDeviceType] = useState('all')
  const [filterRiskLevel, setFilterRiskLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalState | null>(null)
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [companyName, setCompanyName] = useState('')

  const searchState = location.state as SearchState
  const itemsPerPage = 50

  useEffect(() => {
    if (searchState) {
      setIsLoading(true)
      // Simulate loading
      setTimeout(() => {
        const companyDevices = getCompanyDevices(searchState.query)
        setDevices(companyDevices)
        setFilteredDevices(companyDevices)
        setCompanyName(companyDevices[0]?.metadata.company || searchState.query)

        // Apply JQL from state if present
        if (searchState.jqlQuery) {
          setJqlQuery(searchState.jqlQuery)
        }

        setIsLoading(false)
      }, 500)
    }
  }, [searchState])

  // Apply JQL filtering
  const handleJQLSearch = () => {
    if (!jqlQuery.trim()) {
      setFilteredDevices(devices)
      setCurrentPage(1)
      return
    }

    const validation = validateJQLSyntax(jqlQuery)
    if (!validation.valid) {
      return
    }

    try {
      const filterObj = parseJQL(jqlQuery)
      if (filterObj instanceof Error) {
        console.error('JQL Parse Error:', filterObj.message)
        return
      }
      const filtered = filterDevices(devices, filterObj)
      setFilteredDevices(filtered)
      setCurrentPage(1)
    } catch (error) {
      console.error('JQL Filter Error:', error)
    }
  }

  // Apply basic filters and sorting (without debounce - handled in result count display)
  useEffect(() => {
    let filtered = [...devices]

    // Apply JQL filter if query exists
    if (jqlQuery.trim()) {
      const validation = validateJQLSyntax(jqlQuery)
      if (validation.valid) {
        try {
          const filterObj = parseJQL(jqlQuery)
          if (!(filterObj instanceof Error)) {
            filtered = filterDevices(filtered, filterObj)
          }
        } catch (error) {
          console.error('JQL Filter Error:', error)
        }
      }
    }

    // Apply device type filter
    if (filterDeviceType !== 'all') {
      filtered = filtered.filter(device => device.device_type === filterDeviceType)
    }

    // Apply risk level filter
    if (filterRiskLevel !== 'all') {
      filtered = filtered.filter(device => device.risk_level === filterRiskLevel)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'risk_desc':
          return b.risk_score - a.risk_score
        case 'risk_asc':
          return a.risk_score - b.risk_score
        case 'name_asc':
          return a.hostname.localeCompare(b.hostname)
        case 'name_desc':
          return b.hostname.localeCompare(a.hostname)
        case 'activity_desc':
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
        case 'activity_asc':
          return new Date(a.last_activity).getTime() - new Date(b.last_activity).getTime()
        default:
          return 0
      }
    })

    setFilteredDevices(filtered)
    setCurrentPage(1)
  }, [devices, jqlQuery, filterDeviceType, filterRiskLevel, sortBy])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'workstation': return Monitor
      case 'computer': return Monitor
      case 'server': return Server
      case 'router': return Router
      case 'switch': return Router
      case 'iot': return Monitor
      default: return Monitor
    }
  }

  const getDeviceIconColor = (type: string) => {
    switch (type) {
      case 'workstation': return 'text-blue-400'
      case 'computer': return 'text-blue-400'
      case 'server': return 'text-purple-400'
      case 'router': return 'text-green-400'
      case 'switch': return 'text-teal-400'
      case 'iot': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text)
    console.log('Copied to clipboard:', text)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Hostname', 'IP Address', 'MAC Address', 'OS', 'Device Type', 'Risk Level', 'Open Ports', 'Users', 'Last Activity']
    const rows = filteredDevices.map(device => [
      device.hostname,
      device.ip_address,
      device.mac_address,
      device.operating_system.name,
      device.device_type,
      device.risk_level,
      device.open_ports.join(';'),
      device.users.map(u => u.username).join(';'),
      device.last_activity
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `endpoint-search-${companyName}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredDevices, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `endpoint-search-${companyName}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Navigate to company dashboard
  const openCompanyDashboard = () => {
    navigate(`/company-dashboard/${encodeURIComponent(companyName)}`)
  }

  // Pagination
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (!searchState) {
    navigate('/search')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navigation Header */}
      <header className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4h18v3H14v13h-4V7H3V4z"/>
                </svg>
              </div>
              <span className="text-heading text-xl font-bold text-slate-900 dark:text-gray-50">Truth</span>
            </div>
            
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* JQL Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <JQLSearchBar
              value={jqlQuery}
              onChange={setJqlQuery}
              onSearch={handleJQLSearch}
              resultCount={filteredDevices.length}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50">
                {companyName || searchState.query}
              </h1>
              <p className="text-body-sm text-slate-600 dark:text-gray-400 mt-1">
                Showing {paginatedDevices.length} of {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''} •
                Total {devices.length} in company •
                Last updated: {new Date(searchState.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={openCompanyDashboard}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Company Dashboard
              </Button>
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 w-40 backdrop-blur-lg bg-white/95 dark:bg-gray-800/95 rounded-lg border border-slate-200 dark:border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-sm text-slate-700 dark:text-gray-300 rounded-t-lg"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-sm text-slate-700 dark:text-gray-300 rounded-b-lg"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        {showFilters && (
          <Card variant="solid" className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <label className="text-body-sm font-medium text-slate-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1 text-slate-900 dark:text-gray-50 text-sm shadow-sm"
                  >
                    <option value="risk_desc">Risk Level (High to Low)</option>
                    <option value="risk_asc">Risk Level (Low to High)</option>
                    <option value="name_asc">Device Name (A-Z)</option>
                    <option value="name_desc">Device Name (Z-A)</option>
                    <option value="activity_desc">Last Activity (Recent)</option>
                    <option value="activity_asc">Last Activity (Oldest)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-body-sm font-medium text-slate-700">Device Type:</label>
                  <select
                    value={filterDeviceType}
                    onChange={(e) => setFilterDeviceType(e.target.value)}
                    className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1 text-slate-900 dark:text-gray-50 text-sm shadow-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="computer">Computer</option>
                    <option value="server">Server</option>
                    <option value="router">Router</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-body-sm font-medium text-slate-700">Risk Level:</label>
                  <select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1 text-slate-900 dark:text-gray-50 text-sm shadow-sm"
                  >
                    <option value="all">All Risk</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Grid */}
        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 px-8 py-8">
            {paginatedDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.device_type)
              const iconColor = getDeviceIconColor(device.device_type)
              
              return (
                <Card key={device.device_id} variant="glass" className="relative hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 dark:border-gray-700/60 group">
                  <CardContent className="p-7">
                    {/* Hover Actions Bar */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-1.5 z-10">
                      <button 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-gray-700/50 text-slate-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveModal({ type: 'summary', deviceId: device.device_id })
                        }}
                        title="View quick summary"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      
                      <button 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-gray-700/50 text-slate-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveModal({ type: 'download', deviceId: device.device_id })
                        }}
                        title="Download information"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      
                      <button 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-gray-700/50 text-slate-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveModal({ type: 'suspicious', deviceId: device.device_id })
                        }}
                        title="View suspicious activity summary"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                      
                      <button 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 dark:border-gray-700/50 text-slate-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveModal({ type: 'favorite', deviceId: device.device_id })
                        }}
                        title="Save to favorites"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-6 pt-2 cursor-pointer" onClick={() => navigate(`/investigate/${device.device_id}`)}>
                      <DeviceIcon className={cn("w-6 h-6 hover:scale-105 transition-transform duration-200", iconColor)} />
                      <div className="flex-1">
                        <h3 className="text-body font-bold text-slate-900 dark:text-gray-50 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" title={device.hostname}>
                          {device.hostname}
                        </h3>
                      </div>
                    </div>

                    {/* Device Information */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 mb-6">
                      <div>
                        <div className="mb-5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</label>
                          <div className="flex items-center space-x-2 mt-1.5 group">
                            <span className="text-sm font-mono text-blue-600 font-medium">{device.ip_address}</span>
                            <button
                              onClick={() => copyToClipboard(device.ip_address)}
                              className="text-slate-400 hover:text-slate-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MAC Address</label>
                          <div className="flex items-center space-x-2 mt-1.5 group">
                            <span className="text-sm font-mono text-slate-700 font-medium">{device.mac_address}</span>
                            <button
                              onClick={() => copyToClipboard(device.mac_address)}
                              className="text-slate-400 hover:text-slate-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating System</label>
                          <p className="text-sm text-slate-700 mt-1.5 font-medium">{device.operating_system.name}</p>
                        </div>
                      </div>

                      <div>
                        <div className="mb-5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</label>
                          <p className="text-sm text-slate-700 mt-1.5 font-medium">{formatTimeAgo(device.last_activity)}</p>
                        </div>

                        <div className="mb-5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</label>
                          <div className="mt-1.5">
                            {device.users.length === 1 ? (
                              <p className="text-sm text-slate-700 dark:text-gray-300 font-medium">
                                {device.users[0].username}
                              </p>
                            ) : (
                              <div className="relative inline-block">
                                <p 
                                  className="text-sm text-slate-700 dark:text-gray-300 font-medium cursor-help"
                                  onMouseEnter={() => setHoveredTooltip(`users-${device.device_id}`)}
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                >
                                  {device.users.length} users
                                </p>
                                {hoveredTooltip === `users-${device.device_id}` && (
                                  <div className="absolute left-0 top-6 z-20 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    {device.users.map(user => user.username).join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Ports</label>
                          <div className="mt-1.5">
                            {device.open_ports.length === 1 ? (
                              <p className="text-sm text-slate-700 dark:text-gray-300 font-medium">
                                {device.open_ports[0]}
                              </p>
                            ) : (
                              <div className="relative inline-block">
                                <p 
                                  className="text-sm text-slate-700 dark:text-gray-300 font-medium cursor-help"
                                  onMouseEnter={() => setHoveredTooltip(`ports-${device.device_id}`)}
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                >
                                  {device.open_ports.length} ports
                                </p>
                                {hoveredTooltip === `ports-${device.device_id}` && (
                                  <div className="absolute left-0 top-6 z-20 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    {device.open_ports.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suspicious Activity */}
                    {device.suspicious_indicators.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Suspicious Activity
                          </label>
                          <ThreatBadge level={device.risk_level === 'none' ? 'low' : device.risk_level} size="sm" />
                        </div>
                        <div className="mt-1.5">
                          <p className="text-sm text-slate-700 dark:text-gray-300 font-medium mb-2">
                            {device.suspicious_indicators.length} {device.suspicious_indicators.length === 1 ? 'indicator' : 'indicators'}
                          </p>
                          <ul className="space-y-1">
                            {device.suspicious_indicators.slice(0, 2).map((indicator, index) => (
                              <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start leading-relaxed relative pl-4">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                {indicator.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card variant="solid" className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-heading text-xl font-semibold text-gray-50 mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-4">
                We couldn't find any devices matching your search criteria.
              </p>
              <div className="space-y-2 text-body-sm text-gray-500">
                <p>Try:</p>
                <ul className="space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using a different search term</li>
                  <li>• Broadening your search criteria</li>
                </ul>
              </div>
              <Button
                variant="primary"
                className="mt-6"
                onClick={() => navigate('/search')}
              >
                Try Different Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredDevices.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-body-sm text-slate-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} • Showing {paginatedDevices.length} of {filteredDevices.length} devices
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded-lg transition-colors text-sm font-medium",
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-slate-200/60 dark:border-gray-700/60">
            {activeModal.type === 'summary' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-50">Quick Summary</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-gray-400">
                  <p>Device ID: {activeModal.deviceId}</p>
                  <p>This modal will display a comprehensive summary of the selected device including:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li>System overview and specifications</li>
                    <li>Network connectivity status</li>
                    <li>Security posture and risk assessment</li>
                    <li>Recent activity timeline</li>
                    <li>Compliance status</li>
                  </ul>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">🚧 This feature will be implemented based on the PRD specifications.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal.type === 'download' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-50">Download Options</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-gray-400">
                  <p>Device ID: {activeModal.deviceId}</p>
                  <p>This modal will provide download options for device data including:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li>PDF security report</li>
                    <li>CSV data export</li>
                    <li>JSON technical details</li>
                    <li>Network configuration files</li>
                    <li>Compliance documentation</li>
                  </ul>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-4">
                    <p className="text-sm text-green-700 dark:text-green-300">🚧 Download functionality will be implemented based on the PRD specifications.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal.type === 'favorite' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-50">Save to Favorites</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-gray-400">
                  <p>Device ID: {activeModal.deviceId}</p>
                  <p>This modal will provide options to save and organize devices including:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li>Add to favorites list</li>
                    <li>Create custom tags and labels</li>
                    <li>Set monitoring alerts</li>
                    <li>Add to investigation groups</li>
                    <li>Schedule automated scans</li>
                  </ul>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mt-4">
                    <p className="text-sm text-purple-700 dark:text-purple-300">🚧 Favorites and tagging system will be implemented based on the PRD specifications.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal.type === 'suspicious' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-50">Suspicious Activity Summary</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-gray-400">
                  <p>Device ID: {activeModal.deviceId}</p>
                  <p>This modal will display a comprehensive analysis of suspicious activities including:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li>Detailed threat timeline and patterns</li>
                    <li>IOC (Indicators of Compromise) analysis</li>
                    <li>Behavioral anomaly detection results</li>
                    <li>Risk assessment and severity scoring</li>
                    <li>Recommended remediation actions</li>
                    <li>Historical suspicious activity trends</li>
                    <li>Related threat intelligence data</li>
                  </ul>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mt-4">
                    <p className="text-sm text-orange-700 dark:text-orange-300">🚧 Suspicious activity analysis dashboard will be implemented based on the PRD specifications.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 pb-6">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults