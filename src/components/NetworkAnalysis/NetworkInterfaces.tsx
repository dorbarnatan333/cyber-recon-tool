import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Network } from 'lucide-react'

interface NetworkInterface {
  id: string
  network_type: 'Ethernet' | 'WiFi' | 'Virtual'
  description: string
  mac_address: string
  ipv4: string | null
  ipv6: string
  default_gateway: string | null
  dns_servers: string[]
  dhcp_enabled: boolean
  dhcp_server: string | null
  status: 'connected' | 'disconnected'
}

interface NetworkInterfacesData {
  snapshot_timestamp: string
  interfaces: NetworkInterface[]
}

interface NetworkInterfacesProps {
  data: NetworkInterfacesData
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const NetworkInterfaces: React.FC<NetworkInterfacesProps> = ({ data }) => {
  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
            <Network className="w-5 h-5 mr-2 text-blue-500" />
            Network Interfaces
          </h2>
          <span className="text-sm text-slate-600 dark:text-gray-400">
            Snapshot: {formatTimestamp(data.snapshot_timestamp)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.interfaces.map((iface) => (
            <div
              key={iface.id}
              className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Interface Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-gray-700">
                <span
                  className={`w-3 h-3 rounded-full ${
                    iface.status === 'connected'
                      ? 'bg-green-500 shadow-lg shadow-green-500/50'
                      : 'bg-gray-400'
                  }`}
                ></span>
                <span className="text-base font-semibold text-slate-900 dark:text-gray-50">
                  {iface.network_type}
                </span>
                <span className="text-sm text-slate-600 dark:text-gray-400 ml-auto">
                  {iface.description}
                </span>
              </div>

              {/* Interface Details Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    MAC Address
                  </span>
                  <span className="text-sm text-slate-900 dark:text-gray-50 font-mono">
                    {iface.mac_address}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    IPv4
                  </span>
                  <span
                    className={`text-sm font-mono ${
                      iface.ipv4
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 italic'
                    }`}
                  >
                    {iface.ipv4 || 'Not assigned'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    IPv6
                  </span>
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-mono">
                    {iface.ipv6}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    Default Gateway
                  </span>
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-mono">
                    {iface.default_gateway || 'None'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    DNS Servers
                  </span>
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-mono">
                    {iface.dns_servers.length > 0 ? iface.dns_servers.join(', ') : 'None'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider min-w-[140px]">
                    DHCP
                  </span>
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    {iface.dhcp_enabled
                      ? iface.dhcp_server
                        ? `${iface.dhcp_server} (Enabled)`
                        : 'Enabled'
                      : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
