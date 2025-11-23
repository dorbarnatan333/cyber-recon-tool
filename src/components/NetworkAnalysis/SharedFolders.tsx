import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { FolderOpen } from 'lucide-react'

interface SharedFolder {
  id: string
  name: string
  path: string
  share_name: string
  permissions: string
  active_connections: number
  created_date: string
}

interface SharedFoldersData {
  shared_folders: SharedFolder[]
}

interface SharedFoldersProps {
  data: SharedFoldersData
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const SharedFolders: React.FC<SharedFoldersProps> = ({ data }) => {
  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
          <FolderOpen className="w-5 h-5 mr-2 text-blue-500" />
          Shared Folders
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.shared_folders.length > 0 ? (
            data.shared_folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                {/* Folder Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📁</span>
                    <span className="text-base font-semibold text-slate-900 dark:text-gray-50">
                      {folder.name}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                    {folder.permissions}
                  </span>
                </div>

                {/* Folder Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[160px]">
                      Local Path:
                    </span>
                    <span className="text-slate-900 dark:text-gray-50 font-mono">
                      {folder.path}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[160px]">
                      Share Name:
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">
                      {folder.share_name}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[160px]">
                      Active Connections:
                    </span>
                    <span className="text-slate-900 dark:text-gray-50 flex items-center gap-2">
                      {folder.active_connections}
                      {folder.active_connections > 0 && (
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-slate-500 dark:text-gray-500 font-medium min-w-[160px]">
                      Created:
                    </span>
                    <span className="text-slate-900 dark:text-gray-50">
                      {formatDate(folder.created_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-6">
              <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 mb-2">
                No Shared Folders
              </h3>
              <p className="text-slate-600 dark:text-gray-400">
                No shared folders found on this endpoint
              </p>
            </div>
          )}
        </div>

        {/* Count Footer */}
        {data.shared_folders.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700 text-center text-sm text-slate-600 dark:text-gray-400">
            {data.shared_folders.length} shared folder{data.shared_folders.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
