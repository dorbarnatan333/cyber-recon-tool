import React from 'react'
import { Chrome, Globe } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Browser } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface InstalledBrowsersProps {
  browsers: Browser[]
}

export const InstalledBrowsers: React.FC<InstalledBrowsersProps> = ({ browsers }) => {
  const getBrowserIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'chrome':
        return <Chrome className="w-5 h-5 text-blue-500" />
      case 'edge':
        return <Globe className="w-5 h-5 text-blue-600" />
      case 'firefox':
        return <Globe className="w-5 h-5 text-orange-500" />
      default:
        return <Globe className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-500" />
          Installed Browsers
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {browsers.map((browser) => (
            <div
              key={browser.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-200/60 dark:border-gray-700/60 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getBrowserIcon(browser.icon)}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-gray-50">
                      {browser.name} v{browser.version}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {browser.install_path}
                    </p>
                  </div>
                </div>
                {browser.data_collected && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    Data Collected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-slate-600 dark:text-gray-400">Last Used:</span>
                  <span className="ml-2 text-slate-900 dark:text-gray-50 font-medium">
                    {formatTimeAgo(browser.last_used)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-gray-400">Profiles:</span>
                  <span className="ml-2 text-slate-900 dark:text-gray-50 font-medium">
                    {browser.profiles.length} profile{browser.profiles.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {browser.profiles.length > 0 && (
                <div className="mb-3 text-sm">
                  <span className="text-slate-600 dark:text-gray-400">Profile Names:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {browser.profiles.map((profile, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 text-xs"
                      >
                        {profile.name}
                        {profile.user_email && (
                          <span className="text-slate-500 dark:text-gray-500 ml-1">
                            ({profile.user_email})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200/60 dark:border-gray-700/60 pt-3">
                <div className="text-sm font-medium text-slate-900 dark:text-gray-50 mb-2">
                  Data Summary:
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 dark:text-gray-400">📜</span>
                    <span className="text-slate-900 dark:text-gray-50">
                      {browser.history_entries.toLocaleString()} history entries
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 dark:text-gray-400">🔖</span>
                    <span className="text-slate-900 dark:text-gray-50">
                      {browser.bookmarks_count} bookmarks
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 dark:text-gray-400">🧩</span>
                    <span className="text-slate-900 dark:text-gray-50">
                      {browser.extensions_count} extensions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
