import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Network, Globe, Activity, Shield, Monitor, Building, FileText, Settings, Download, Save, AlertTriangle, Clock, HardDrive, Database, Info } from 'lucide-react'
import { Button, Card, CardHeader, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import StickyHeader, { BreadcrumbItem, EndpointStatus, SystemInfo } from '@/components/StickyHeader'
import { NetworkInterfaces } from '@/components/NetworkAnalysis/NetworkInterfaces'
import { SavedWifiConnections } from '@/components/NetworkAnalysis/SavedWifiConnections'
import { NetworkConnections } from '@/components/NetworkAnalysis/NetworkConnections'
import { ArpCache } from '@/components/NetworkAnalysis/ArpCache'
import { SharedFolders } from '@/components/NetworkAnalysis/SharedFolders'
import '../styles/design-system.css'

// Types
interface NetworkEndpoint {
  endpoint_id: string
  type: 'Computer' | 'Server' | 'Router'
  hostname: string
  current_ip: string
  mac_address: string
  last_seen: string
  os?: string
  user?: string
}

interface NetworkAnomaly {
  id: string
  timestamp: string
  type: 'unusual_connection' | 'off_hours_activity' | 'shared_folder_access'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metric_value: string
  average_value: string
  affected_metric: string
}

// Mock Data Generation
const generateMockEndpoint = (deviceId: string): NetworkEndpoint => {
  return {
    endpoint_id: deviceId,
    type: 'Server',
    hostname: 'CONTOSO-SRV-DB01',
    current_ip: '192.168.1.210',
    mac_address: '00:11:22:33:44:AA',
    last_seen: new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString(),
    os: 'Windows Server 2019',
    user: 'dbadmin'
  }
}

const generateMockNetworkAnalysisData = () => {
  return {
    network_interfaces: {
      snapshot_timestamp: new Date().toISOString(),
      interfaces: [
        {
          id: 'eth0',
          network_type: 'Ethernet' as const,
          description: 'Realtek PCIe GbE Family Controller',
          mac_address: '00:11:22:33:44:AA',
          ipv4: '192.168.1.210',
          ipv6: 'fe80::a4b2:c3d4:e5f6:7890',
          default_gateway: '192.168.1.1',
          dns_servers: ['8.8.8.8', '8.8.4.4'],
          dhcp_enabled: true,
          dhcp_server: '192.168.1.1',
          status: 'connected' as const
        },
        {
          id: 'wlan0',
          network_type: 'WiFi' as const,
          description: 'Intel(R) Wireless-AC 9560 160MHz',
          mac_address: 'A4:B2:C3:D4:E5:F6',
          ipv4: null,
          ipv6: 'fe80::1234:5678:90ab:cdef',
          default_gateway: null,
          dns_servers: [],
          dhcp_enabled: true,
          dhcp_server: null,
          status: 'disconnected' as const
        }
      ]
    },

    wifi_connections: {
      wifi_connections: [
        {
          id: 'wifi-001',
          ssid: 'HomeNetwork_5G',
          bssid: 'A4:12:34:56:78:9A',
          security_type: 'WPA2-Personal',
          first_connected: '2025-11-15T14:23:00Z',
          last_connected: '2025-11-18T21:15:00Z',
          connection_count: 47,
          signal_strength: -45,
          frequency: '5GHz'
        },
        {
          id: 'wifi-002',
          ssid: 'Office-WiFi',
          bssid: 'B8:27:EB:12:34:56',
          security_type: 'WPA2-Enterprise',
          first_connected: '2025-11-17T09:00:00Z',
          last_connected: '2025-11-17T18:30:00Z',
          connection_count: 12,
          signal_strength: -62,
          frequency: '2.4GHz'
        },
        {
          id: 'wifi-003',
          ssid: 'Starbucks-WiFi',
          bssid: 'C4:23:45:67:89:AB',
          security_type: 'Open',
          first_connected: '2025-11-16T12:00:00Z',
          last_connected: '2025-11-16T13:30:00Z',
          connection_count: 1,
          signal_strength: -72,
          frequency: '2.4GHz'
        }
      ]
    },

    network_connections: {
      connections: generateNetworkConnections(50)
    },

    arp_cache: {
      arp_entries: [
        {
          id: 'arp-001',
          type: 'dynamic' as const,
          ip_address: '192.168.1.1',
          mac_address: '00:11:22:33:44:55',
          interface_name: 'eth0'
        },
        {
          id: 'arp-002',
          type: 'static' as const,
          ip_address: '192.168.1.100',
          mac_address: 'A4:B2:C3:D4:E5:F6',
          interface_name: 'eth0'
        },
        {
          id: 'arp-003',
          type: 'dynamic' as const,
          ip_address: '192.168.1.50',
          mac_address: '12:34:56:78:9A:BC',
          interface_name: 'eth0'
        },
        {
          id: 'arp-004',
          type: 'dynamic' as const,
          ip_address: '192.168.1.75',
          mac_address: 'DE:AD:BE:EF:CA:FE',
          interface_name: 'eth0'
        }
      ]
    },

    shared_folders: {
      shared_folders: [
        {
          id: 'share-001',
          name: 'Public Documents',
          path: 'C:\\Users\\Public\\Documents',
          share_name: '\\\\CONTOSO-SRV-DB01\\Public',
          permissions: 'Read',
          active_connections: 0,
          created_date: '2025-10-01T10:00:00Z'
        },
        {
          id: 'share-002',
          name: 'Company Files',
          path: 'D:\\Shares\\Company',
          share_name: '\\\\CONTOSO-SRV-DB01\\CompanyFiles',
          permissions: 'Full Control',
          active_connections: 3,
          created_date: '2025-09-15T14:30:00Z'
        }
      ]
    },

    anomalies: [
      {
        id: 'anomaly-001',
        timestamp: '2025-11-15T14:32:00Z',
        type: 'unusual_connection' as const,
        severity: 'high' as const,
        description: 'Unusual outbound connection to unknown IP',
        metric_value: '8.8.8.8:443',
        average_value: 'Known destinations',
        affected_metric: 'network_connections'
      },
      {
        id: 'anomaly-002',
        timestamp: '2025-11-16T02:15:00Z',
        type: 'off_hours_activity' as const,
        severity: 'medium' as const,
        description: 'Network activity detected during off-hours',
        metric_value: '45 connections',
        average_value: '2 connections',
        affected_metric: 'network_activity'
      },
      {
        id: 'anomaly-003',
        timestamp: '2025-11-17T09:45:00Z',
        type: 'shared_folder_access' as const,
        severity: 'medium' as const,
        description: 'Unusual access to shared folder',
        metric_value: '15 access attempts',
        average_value: '3 access attempts',
        affected_metric: 'shared_folders'
      }
    ]
  }
}

const generateNetworkConnections = (count: number) => {
  const connections = []
  const destIps = ['8.8.8.8', '142.250.191.14', '20.42.73.29', '52.96.145.88', '192.168.1.1']
  const protocols = ['TCP', 'UDP']
  const states = ['ESTABLISHED', 'TIME_WAIT', 'CLOSE_WAIT', 'LISTENING']
  const processes = ['chrome.exe', 'firefox.exe', 'sqlservr.exe', 'svchost.exe']

  for (let i = 0; i < count; i++) {
    const destIp = destIps[Math.floor(Math.random() * destIps.length)]
    const now = new Date()
    const startTime = new Date(now.getTime() - Math.random() * 3600000)

    connections.push({
      id: `conn-${i + 1}`,
      collection_start: startTime.toISOString(),
      collection_end: now.toISOString(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      source_ip: '192.168.1.210',
      source_port: 50000 + i,
      dest_ip: destIp,
      dest_port: [80, 443, 3389, 1433][Math.floor(Math.random() * 4)],
      state: states[Math.floor(Math.random() * states.length)],
      process_name: processes[Math.floor(Math.random() * processes.length)],
      pid: 1000 + Math.floor(Math.random() * 5000)
    })
  }

  return connections
}

const NetworkAnalysis: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()

  const [endpoint, setEndpoint] = useState<NetworkEndpoint | null>(null)
  const [networkData, setNetworkData] = useState<any>(null)
  const [anomalies, setAnomalies] = useState<NetworkAnomaly[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load endpoint data
  useEffect(() => {
    if (deviceId) {
      setIsLoading(true)

      setTimeout(() => {
        const mockEndpoint = generateMockEndpoint(deviceId)
        const mockData = generateMockNetworkAnalysisData()

        setEndpoint(mockEndpoint)
        setNetworkData(mockData)
        setAnomalies(mockData.anomalies)
        setIsLoading(false)
      }, 1500)
    }
  }, [deviceId])

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

  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Network Analysis'
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'Network Analysis', link: null }
  ]

  const getEndpointStatus = (): EndpointStatus | undefined => {
    if (!endpoint) return undefined

    const lastSeenTime = new Date(endpoint.last_seen)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSeenTime.getTime()) / (1000 * 60))

    if (diffMinutes < 5) {
      return {
        type: 'active',
        label: 'Active',
        lastSeen: formatTimeAgo(endpoint.last_seen)
      }
    } else if (diffMinutes < 30) {
      return {
        type: 'recent',
        label: 'Recently Active',
        lastSeen: formatTimeAgo(endpoint.last_seen)
      }
    } else if (diffMinutes < 1440) {
      return {
        type: 'inactive',
        label: 'Inactive',
        lastSeen: formatTimeAgo(endpoint.last_seen)
      }
    } else {
      return {
        type: 'offline',
        label: 'Offline',
        lastSeen: formatTimeAgo(endpoint.last_seen)
      }
    }
  }

  const handleSave = () => {
    console.log('Saving investigation for device:', deviceId)
    alert('Investigation saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting report as:', format, 'for device:', deviceId)
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleSettings = () => {
    console.log('Opening settings for device:', deviceId)
    alert('Settings panel would open here')
  }

  if (!deviceId) {
    navigate('/search/results')
    return null
  }

  const LoadingContent = () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h2 className="text-lg font-medium text-slate-900 dark:text-gray-50 mb-2">
          Loading Network Analysis
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Analyzing data for {deviceId}...
        </p>
      </div>
    </div>
  )

  return (
    <>
      <StickyHeader
        systemInfo={systemInfo}
        breadcrumbs={breadcrumbs}
        endpointStatus={getEndpointStatus()}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={isLoading}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          <nav className="flex-1 p-4 pt-6 space-y-2">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network, active: true },
              { name: 'Browser Analysis', href: `/investigate/${deviceId}/browsers`, icon: Globe },
              { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
              { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
              { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
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

          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700 dark:text-gray-300">Analysis Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 relative min-h-screen">
            {isLoading ? (
              <LoadingContent />
            ) : (
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                    Network Analysis: {endpoint?.hostname}
                  </h1>
                  <p className="text-body-sm text-slate-600 dark:text-gray-300">
                    Comprehensive network configuration and connectivity analysis for {endpoint?.type?.toLowerCase()} endpoint
                  </p>
                </div>

                {/* Endpoint Summary */}
                {endpoint && (
                  <Card variant="glass">
                    <CardHeader>
                      <h2 className="text-heading text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                        <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                        Endpoint Summary
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                          <p className="text-sm text-slate-900 dark:text-gray-50 mt-1 font-medium">{endpoint.type}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hostname</label>
                          <p className="text-sm text-slate-900 dark:text-gray-50 mt-1 font-medium">{endpoint.hostname}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</label>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-mono font-medium">{endpoint.current_ip}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">MAC Address</label>
                          <p className="text-sm text-slate-700 dark:text-gray-300 mt-1 font-mono text-xs">{endpoint.mac_address}</p>
                        </div>
                        {endpoint.os && (
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating System</label>
                            <p className="text-sm text-slate-900 dark:text-gray-50 mt-1 font-medium">{endpoint.os}</p>
                          </div>
                        )}
                        {endpoint.user && (
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User</label>
                            <p className="text-sm text-slate-900 dark:text-gray-50 mt-1 font-medium">{endpoint.user}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Seen</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{formatTimeAgo(endpoint.last_seen)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* New Components */}
                {networkData && (
                  <>
                    <NetworkInterfaces data={networkData.network_interfaces} />
                    <SavedWifiConnections data={networkData.wifi_connections} />
                    <NetworkConnections data={networkData.network_connections} />
                    <ArpCache data={networkData.arp_cache} />
                    <SharedFolders data={networkData.shared_folders} />
                  </>
                )}

                {/* Anomalies Section */}
                {anomalies.length > 0 && (
                  <Card variant="glass">
                    <CardHeader>
                      <h2 className="text-heading text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                        Anomalies Detected ({anomalies.length})
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {anomalies.map((anomaly) => (
                          <div
                            key={anomaly.id}
                            className={cn(
                              "p-4 rounded-lg border-l-4",
                              anomaly.severity === 'critical' && "bg-red-50 dark:bg-red-900/10 border-red-500",
                              anomaly.severity === 'high' && "bg-red-50 dark:bg-red-900/10 border-red-400",
                              anomaly.severity === 'medium' && "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500",
                              anomaly.severity === 'low' && "bg-blue-50 dark:bg-blue-900/10 border-blue-500"
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-base font-semibold text-slate-900 dark:text-gray-50">
                                {anomaly.description}
                              </h4>
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                                  anomaly.severity === 'critical' && "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
                                  anomaly.severity === 'high' && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                                  anomaly.severity === 'medium' && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
                                  anomaly.severity === 'low' && "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                )}
                              >
                                {anomaly.severity}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatTimeAgo(anomaly.timestamp)} • {anomaly.affected_metric}
                            </p>
                            <div className="flex items-center space-x-6 text-sm">
                              <div>
                                <span className="text-slate-500 dark:text-gray-500">Current:</span>
                                <span className="ml-1 font-medium text-slate-900 dark:text-gray-50">{anomaly.metric_value}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-gray-500">Average:</span>
                                <span className="ml-1 font-medium text-slate-700 dark:text-gray-300">{anomaly.average_value}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default NetworkAnalysis
