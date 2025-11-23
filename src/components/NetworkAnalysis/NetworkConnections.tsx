import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Badge } from '@/components/ui'
import { Network, Search, ChevronRight, ChevronDown } from 'lucide-react'

interface Connection {
  id: string
  collection_start: string
  collection_end: string
  protocol: string
  source_ip: string
  source_port: number
  dest_ip: string
  dest_port: number
  state: string
  process_name: string
  pid: number
}

interface NetworkConnectionsData {
  connections: Connection[]
}

interface NetworkConnectionsProps {
  data: NetworkConnectionsData
}

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

export const NetworkConnections: React.FC<NetworkConnectionsProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Group connections by destination IP:port
  const groupedConnections = data.connections.reduce((acc, conn) => {
    const key = `${conn.dest_ip}:${conn.dest_port}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(conn)
    return acc
  }, {} as Record<string, Connection[]>)

  // Filter based on search
  const filteredGroups = Object.entries(groupedConnections).filter(
    ([destIpPort, connections]) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        destIpPort.toLowerCase().includes(searchLower) ||
        connections.some(
          (conn) =>
            conn.source_ip.toLowerCase().includes(searchLower) ||
            conn.process_name.toLowerCase().includes(searchLower) ||
            conn.protocol.toLowerCase().includes(searchLower)
        )
      )
    }
  )

  const toggleRow = (destIpPort: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(destIpPort)) {
      newExpanded.delete(destIpPort)
    } else {
      newExpanded.add(destIpPort)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
          <Network className="w-5 h-5 mr-2 text-blue-500" />
          Network Connections
        </h2>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Connections List */}
        <div className="space-y-3">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(([destIpPort, connections]) => {
              const isExpanded = expandedRows.has(destIpPort)
              const firstConn = connections[0]
              const lastConn = connections[connections.length - 1]

              // Calculate time range for connection group
              const startTime = new Date(connections[0].collection_start)
              const endTime = new Date(lastConn.collection_end)
              const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000) // minutes

              return (
                <div
                  key={destIpPort}
                  className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Connection Group Header */}
                  <div
                    onClick={() => toggleRow(destIpPort)}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <span className="text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-gray-200 transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="text-base font-semibold text-slate-900 dark:text-gray-50 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {destIpPort}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-gray-500">
                        Active: {formatTimestamp(connections[0].collection_start)} - {formatTimestamp(lastConn.collection_end)}
                        {duration > 0 && ` (${duration} min)`}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-gray-400">
                      ({connections.length} connection{connections.length > 1 ? 's' : ''})
                    </span>
                    <Badge
                      variant={firstConn.protocol === 'TCP' ? 'info' : 'success'}
                      className="text-xs"
                    >
                      {firstConn.protocol}
                    </Badge>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        firstConn.state === 'ESTABLISHED'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : firstConn.state === 'LISTENING'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : firstConn.state === 'TIME_WAIT'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {firstConn.state}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 py-4 bg-white dark:bg-gray-900 space-y-3">
                      {connections.map((conn) => (
                        <div
                          key={conn.id}
                          className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500 dark:text-gray-500 font-medium">
                                Start Time:
                              </span>
                              <div className="text-slate-900 dark:text-gray-50 mt-1">
                                {formatTimestamp(conn.collection_start)}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-gray-500 font-medium">
                                End Time:
                              </span>
                              <div className="text-slate-900 dark:text-gray-50 mt-1">
                                {formatTimestamp(conn.collection_end)}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-gray-500 font-medium">
                                Source:
                              </span>
                              <div className="text-blue-600 dark:text-blue-400 mt-1 font-mono">
                                {conn.source_ip}:{conn.source_port}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-gray-500 font-medium">
                                Process:
                              </span>
                              <div className="text-slate-900 dark:text-gray-50 mt-1">
                                {conn.process_name} (PID: {conn.pid})
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 px-6">
              <Network className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-2">
                No Connections Found
              </h3>
              <p className="text-slate-600 dark:text-gray-400">
                {searchQuery
                  ? `No connections matching "${searchQuery}"`
                  : 'No network connections available'}
              </p>
            </div>
          )}
        </div>

        {/* Count Footer */}
        {filteredGroups.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700 text-center text-sm text-slate-600 dark:text-gray-400">
            Showing <span className="font-semibold text-slate-900 dark:text-gray-50">{filteredGroups.length}</span>{' '}
            destination{filteredGroups.length !== 1 ? 's' : ''} with{' '}
            <span className="font-semibold text-slate-900 dark:text-gray-50">
              {filteredGroups.reduce((sum, [, conns]) => sum + conns.length, 0)}
            </span>{' '}
            total connection{filteredGroups.reduce((sum, [, conns]) => sum + conns.length, 0) !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
