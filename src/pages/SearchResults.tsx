import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Filter, Copy, Eye, Download, Tag, Monitor, Server, Router, Users } from 'lucide-react'
import { Button, Card, CardContent, Input, Badge, ThreatBadge } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Device {
  device_id: string
  device_type: 'computer' | 'server' | 'router'
  hostname: string
  ip_address: string
  mac_address: string
  operating_system: {
    name: string
    version: string
    icon: string
  }
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  risk_score: number
  last_activity: string
  users: Array<{
    username: string
    last_login: string
  }>
  open_ports: number[]
  suspicious_indicators: Array<{
    type: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: string
  }>
  metadata: {
    discovered_at: string
    scan_method: string
  }
}

interface SearchState {
  query: string
  searchType: 'device' | 'company'
  timestamp: string
}

// Mock device data generator
const generateMockDevices = (_searchQuery: string, searchType: 'device' | 'company'): Device[] => {
  if (searchType === 'device') {
    // Single device search
    return [{
      device_id: 'device-001',
      device_type: 'computer',
      hostname: 'CONTOSO-WKS-042',
      ip_address: '192.168.1.105',
      mac_address: '00:11:22:33:44:55',
      operating_system: {
        name: 'Windows 10 Pro',
        version: '10.0.19044',
        icon: 'windows'
      },
      risk_level: 'high',
      risk_score: 85,
      last_activity: '2025-11-18T14:30:00Z',
      users: [
        {
          username: 'jsmith',
          last_login: '2025-11-18T14:00:00Z'
        }
      ],
      open_ports: [22, 80, 443, 3389, 8080],
      suspicious_indicators: [
        {
          type: 'unsigned_executable',
          description: 'Unsigned executable in TEMP folder',
          severity: 'high',
          timestamp: '2025-11-18T14:27:00Z'
        },
        {
          type: 'suspicious_network',
          description: 'Connection to known C2 domain',
          severity: 'critical',
          timestamp: '2025-11-18T14:28:00Z'
        },
        {
          type: 'after_hours_login',
          description: 'Login detected outside business hours',
          severity: 'medium',
          timestamp: '2025-11-18T02:15:00Z'
        }
      ],
      metadata: {
        discovered_at: '2025-11-18T14:35:00Z',
        scan_method: 'network_scan'
      }
    }]
  }

  // Company search - multiple devices
  const devices: Device[] = [
    {
      device_id: 'device-001',
      device_type: 'computer',
      hostname: 'CONTOSO-WKS-042',
      ip_address: '192.168.1.105',
      mac_address: '00:11:22:33:44:55',
      operating_system: {
        name: 'Windows 10 Pro',
        version: '10.0.19044',
        icon: 'windows'
      },
      risk_level: 'high',
      risk_score: 85,
      last_activity: '2025-11-18T14:30:00Z',
      users: [{ username: 'jsmith', last_login: '2025-11-18T14:00:00Z' }],
      open_ports: [22, 80, 443, 3389, 8080],
      suspicious_indicators: [
        {
          type: 'unsigned_executable',
          description: 'Unsigned executable in TEMP folder',
          severity: 'high',
          timestamp: '2025-11-18T14:27:00Z'
        },
        {
          type: 'suspicious_network',
          description: 'Connection to known C2 domain',
          severity: 'critical',
          timestamp: '2025-11-18T14:28:00Z'
        }
      ],
      metadata: {
        discovered_at: '2025-11-18T14:35:00Z',
        scan_method: 'network_scan'
      }
    },
    {
      device_id: 'device-002',
      device_type: 'server',
      hostname: 'CONTOSO-SRV-DB01',
      ip_address: '192.168.1.210',
      mac_address: '00:11:22:33:44:AA',
      operating_system: {
        name: 'Windows Server 2019',
        version: '10.0.17763',
        icon: 'windows'
      },
      risk_level: 'critical',
      risk_score: 92,
      last_activity: '2025-11-18T14:00:00Z',
      users: [
        { username: 'dbadmin', last_login: '2025-11-18T13:45:00Z' },
        { username: 'backup_svc', last_login: '2025-11-18T12:00:00Z' },
        { username: 'sql_agent', last_login: '2025-11-18T14:00:00Z' }
      ],
      open_ports: [1433, 3389, 445],
      suspicious_indicators: [
        {
          type: 'failed_login',
          description: '47 failed login attempts detected',
          severity: 'high',
          timestamp: '2025-11-18T13:30:00Z'
        },
        {
          type: 'unusual_query',
          description: 'Unusual database query patterns',
          severity: 'medium',
          timestamp: '2025-11-18T13:45:00Z'
        }
      ],
      metadata: {
        discovered_at: '2025-11-18T14:35:00Z',
        scan_method: 'active_directory'
      }
    },
    {
      device_id: 'device-003',
      device_type: 'router',
      hostname: 'ROUTER-CORE-01',
      ip_address: '10.0.0.1',
      mac_address: '00:AA:BB:CC:DD:EE',
      operating_system: {
        name: 'Cisco IOS',
        version: '15.2',
        icon: 'router'
      },
      risk_level: 'low',
      risk_score: 25,
      last_activity: '2025-11-18T14:35:00Z',
      users: [{ username: 'admin', last_login: '2025-11-18T08:00:00Z' }],
      open_ports: [22, 80, 443],
      suspicious_indicators: [],
      metadata: {
        discovered_at: '2025-11-18T14:35:00Z',
        scan_method: 'network_scan'
      }
    },
    {
      device_id: 'device-004',
      device_type: 'computer',
      hostname: 'CONTOSO-WKS-015',
      ip_address: '192.168.1.115',
      mac_address: '00:11:22:33:44:BB',
      operating_system: {
        name: 'Windows 11',
        version: '10.0.22000',
        icon: 'windows'
      },
      risk_level: 'medium',
      risk_score: 60,
      last_activity: '2025-11-18T13:15:00Z',
      users: [{ username: 'mwilson', last_login: '2025-11-18T13:15:00Z' }],
      open_ports: [135, 445, 3389],
      suspicious_indicators: [
        {
          type: 'outdated_software',
          description: 'Outdated browser version detected',
          severity: 'medium',
          timestamp: '2025-11-18T12:00:00Z'
        }
      ],
      metadata: {
        discovered_at: '2025-11-18T14:35:00Z',
        scan_method: 'network_scan'
      }
    }
  ]

  return devices
}

const SearchResults: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [persistentQuery, setPersistentQuery] = useState('')
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [_isLoading, _setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('risk_desc')
  const [filterDeviceType, setFilterDeviceType] = useState('all')
  const [filterRiskLevel, setFilterRiskLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const searchState = location.state as SearchState

  useEffect(() => {
    if (searchState) {
      const mockDevices = generateMockDevices(searchState.query, searchState.searchType)
      setDevices(mockDevices)
      setFilteredDevices(mockDevices)
    }
  }, [searchState])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...devices]

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
  }, [devices, filterDeviceType, filterRiskLevel, sortBy])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'computer': return Monitor
      case 'server': return Server
      case 'router': return Router
      default: return Monitor
    }
  }

  const getDeviceIconColor = (type: string) => {
    switch (type) {
      case 'computer': return 'text-blue-400'
      case 'server': return 'text-purple-400'
      case 'router': return 'text-green-400'
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
    // TODO: Add toast notification
    console.log('Copied to clipboard:', text)
  }

  const handlePersistentSearch = () => {
    if (persistentQuery.trim().length < 2) return

    _setIsLoading(true)
    // Simulate search
    setTimeout(() => {
      navigate('/search/results', {
        state: {
          query: persistentQuery,
          searchType: persistentQuery.includes('.') || /^\d+\.\d+\.\d+\.\d+$/.test(persistentQuery) ? 'device' : 'company',
          timestamp: new Date().toISOString()
        }
      })
      _setIsLoading(false)
    }, 1000)
  }

  if (!searchState) {
    navigate('/search')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-800 rounded-md flex items-center justify-center">
                <Users className="w-5 h-5 text-cyber-matrix" />
              </div>
              <span className="text-heading text-lg font-bold text-gray-50">Truth</span>
            </div>
            
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Persistent Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search for specific device..."
              value={persistentQuery}
              onChange={(e) => setPersistentQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePersistentSearch()}
              className="pl-12 pr-16 py-3 w-full"
              variant="cyber"
            />
            {persistentQuery && (
              <button
                onClick={() => setPersistentQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading text-2xl font-bold text-gray-50">
                Search Results: "{searchState.query}"
              </h1>
              <p className="text-body-sm text-gray-400 mt-1">
                Found {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''} • 
                Last updated: {new Date(searchState.timestamp).toLocaleString()}
              </p>
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

        {/* Filters & Sort */}
        {showFilters && (
          <Card variant="solid" className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <label className="text-body-sm font-medium text-gray-300">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-gray-50 text-sm"
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
                  <label className="text-body-sm font-medium text-gray-300">Device Type:</label>
                  <select
                    value={filterDeviceType}
                    onChange={(e) => setFilterDeviceType(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-gray-50 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="computer">Computer</option>
                    <option value="server">Server</option>
                    <option value="router">Router</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-body-sm font-medium text-gray-300">Risk Level:</label>
                  <select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-gray-50 text-sm"
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
          <div className="grid grid-cols-3 gap-6">
            {filteredDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.device_type)
              const iconColor = getDeviceIconColor(device.device_type)
              
              return (
                <Card key={device.device_id} variant="glass" className="hover:border-primary-700 transition-colors">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon className={cn("w-12 h-12", iconColor)} />
                        <div className="flex-1">
                          <h3 className="text-body font-bold text-gray-50 truncate" title={device.hostname}>
                            {device.hostname}
                          </h3>
                        </div>
                      </div>
                      <ThreatBadge level={device.risk_level} />
                    </div>

                    {/* Device Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="mb-4">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">IP Address</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-body-sm font-mono text-cyber-matrix">{device.ip_address}</span>
                            <button
                              onClick={() => copyToClipboard(device.ip_address)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">MAC Address</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-body-sm font-mono text-gray-300">{device.mac_address}</span>
                            <button
                              onClick={() => copyToClipboard(device.mac_address)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Operating System</label>
                          <p className="text-body-sm text-gray-300 mt-1">{device.operating_system.name}</p>
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last Activity</label>
                          <p className="text-body-sm text-gray-300 mt-1">{formatTimeAgo(device.last_activity)}</p>
                        </div>

                        <div className="mb-4">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Users</label>
                          <p className="text-body-sm text-gray-300 mt-1">
                            {device.users.length === 1 
                              ? device.users[0].username 
                              : `${device.users.length} users`}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Open Ports</label>
                          <p className="text-body-sm text-gray-300 mt-1">{device.open_ports.length} ports</p>
                        </div>
                      </div>
                    </div>

                    {/* Suspicious Indicators */}
                    {device.suspicious_indicators.length > 0 && (
                      <div className="mb-6 p-3 bg-danger-900/20 border border-danger-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="danger" size="sm">
                            ⚠️ Suspicious Activity Detected
                          </Badge>
                        </div>
                        <ul className="space-y-1">
                          {device.suspicious_indicators.slice(0, 3).map((indicator, index) => (
                            <li key={index} className="text-body-sm text-danger-300 flex items-start">
                              <span className="inline-block w-1 h-1 bg-danger-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {indicator.description}
                            </li>
                          ))}
                          {device.suspicious_indicators.length > 3 && (
                            <li className="text-body-sm text-danger-400">
                              +{device.suspicious_indicators.length - 3} more indicators
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        variant="primary"
                        size="lg"
                        glow
                        className="w-full"
                        onClick={() => navigate(`/investigate/${device.device_id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Investigate
                      </Button>
                      
                      <div className="flex justify-center space-x-4">
                        <Button variant="ghost" size="sm" title="Quick Summary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Export Info">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Add Tag">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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

        {filteredDevices.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-body-sm text-gray-400">
              Showing {filteredDevices.length} of {devices.length} devices
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults