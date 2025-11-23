import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Database } from 'lucide-react'

interface ArpEntry {
  id: string
  type: 'dynamic' | 'static'
  ip_address: string
  mac_address: string
  interface_name: string
}

interface ArpCacheData {
  arp_entries: ArpEntry[]
}

interface ArpCacheProps {
  data: ArpCacheData
}

export const ArpCache: React.FC<ArpCacheProps> = ({ data }) => {
  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-500" />
          ARP Cache
        </h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50 border-b-2 border-slate-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  MAC Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  Interface
                </th>
              </tr>
            </thead>
            <tbody>
              {data.arp_entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.type === 'dynamic'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 font-mono">
                    {entry.ip_address}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-gray-50 font-mono">
                    {entry.mac_address}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-gray-300">
                    {entry.interface_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.arp_entries.length === 0 && (
            <div className="text-center py-12 px-6">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-2">
                No ARP Entries
              </h3>
              <p className="text-slate-600 dark:text-gray-400">
                No ARP cache entries available
              </p>
            </div>
          )}
        </div>

        {/* Count Footer */}
        {data.arp_entries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700 text-center text-sm text-slate-600 dark:text-gray-400">
            {data.arp_entries.length} ARP entr{data.arp_entries.length === 1 ? 'y' : 'ies'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
