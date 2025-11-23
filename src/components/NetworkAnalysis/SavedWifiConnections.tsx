import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Wifi, Search } from 'lucide-react'

interface WifiConnection {
  id: string
  ssid: string
  bssid: string
  security_type: string
  first_connected: string
  last_connected: string
  connection_count: number
  signal_strength: number
  frequency: string
}

interface SavedWifiConnectionsData {
  wifi_connections: WifiConnection[]
}

interface SavedWifiConnectionsProps {
  data: SavedWifiConnectionsData
}

type TimeRange = '24h' | '7d' | '30d' | 'custom'

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getSignalStrength = (dbm: number) => {
  if (dbm >= -50) return { label: 'Excellent', bars: 4, color: 'text-green-600' }
  if (dbm >= -60) return { label: 'Good', bars: 3, color: 'text-green-500' }
  if (dbm >= -70) return { label: 'Fair', bars: 2, color: 'text-yellow-500' }
  return { label: 'Weak', bars: 1, color: 'text-red-500' }
}

export const SavedWifiConnections: React.FC<SavedWifiConnectionsProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWifi = data.wifi_connections.filter(
    (wifi) =>
      wifi.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wifi.bssid.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-blue-500" />
          Saved WiFi Connections
        </h2>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['24h', '7d', '30d', 'custom'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7d' : range === '30d' ? 'Last 30d' : 'Custom'}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search WiFi networks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* WiFi List */}
        <div className="space-y-4">
          {filteredWifi.length > 0 ? (
            filteredWifi.map((wifi) => {
              const signal = getSignalStrength(wifi.signal_strength)
              return (
                <div
                  key={wifi.id}
                  className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  {/* WiFi Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {/* CSS Signal Bars */}
                      <div className="flex items-end gap-0.5" style={{ height: '20px' }}>
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 rounded-sm transition-colors ${
                              bar <= signal.bars ? signal.color.replace('text-', 'bg-') : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            style={{
                              height: `${bar * 5}px`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-base font-semibold text-slate-900 dark:text-gray-50">
                        {wifi.ssid}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        wifi.security_type.includes('WPA2-Enterprise') || wifi.security_type.includes('WPA3')
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : wifi.security_type.includes('WPA2') || wifi.security_type.includes('WPA')
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {wifi.security_type}
                    </span>
                  </div>

                  {/* WiFi Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        BSSID:
                      </span>
                      <span className="text-slate-900 dark:text-gray-50 font-mono">
                        {wifi.bssid}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        Frequency:
                      </span>
                      <span className="text-slate-900 dark:text-gray-50">{wifi.frequency}</span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        First Connected:
                      </span>
                      <span className="text-slate-900 dark:text-gray-50">
                        {formatTimestamp(wifi.first_connected)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        Last Connected:
                      </span>
                      <span className="text-slate-900 dark:text-gray-50">
                        {formatTimestamp(wifi.last_connected)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        Connection Count:
                      </span>
                      <span className="text-slate-900 dark:text-gray-50">
                        {wifi.connection_count} times
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[140px]">
                        Signal Strength:
                      </span>
                      <span className={`font-medium ${signal.color}`}>
                        {wifi.signal_strength} dBm ({signal.label})
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 px-6">
              <Wifi className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-2">
                No WiFi Connections Found
              </h3>
              <p className="text-slate-600 dark:text-gray-400">
                {searchQuery
                  ? `No WiFi connections matching "${searchQuery}"`
                  : 'No saved WiFi connections available'}
              </p>
            </div>
          )}
        </div>

        {/* Count Footer */}
        {filteredWifi.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700 text-center text-sm text-slate-600 dark:text-gray-400">
            Showing {filteredWifi.length} of {data.wifi_connections.length} WiFi connections
          </div>
        )}
      </CardContent>
    </Card>
  )
}
