import React, { useState, useMemo } from 'react'
import { Download, Search, ChevronDown, ChevronRight, FileText, Archive, Code } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Download as DownloadType } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface DownloadsHistoryProps {
  downloads: DownloadType[]
}

export const DownloadsHistory: React.FC<DownloadsHistoryProps> = ({ downloads }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrowser, setSelectedBrowser] = useState<string>('all')
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter downloads
  const filteredDownloads = useMemo(() => {
    return downloads.filter(download => {
      const matchesSearch = searchTerm === '' ||
        download.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.download_url.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrowser = selectedBrowser === 'all' || download.browser === selectedBrowser

      let matchesFileType = true
      if (fileTypeFilter === 'executables') {
        matchesFileType = download.filename.endsWith('.exe') || download.filename.endsWith('.msi')
      } else if (fileTypeFilter === 'archives') {
        matchesFileType = download.filename.endsWith('.zip') || download.filename.endsWith('.rar') || download.filename.endsWith('.7z')
      } else if (fileTypeFilter === 'documents') {
        matchesFileType = download.filename.endsWith('.pdf') || download.filename.endsWith('.doc') || download.filename.endsWith('.docx') || download.filename.endsWith('.pptx')
      }

      return matchesSearch && matchesBrowser && matchesFileType
    })
  }, [downloads, searchTerm, selectedBrowser, fileTypeFilter])

  // Get unique browsers
  const browsers = Array.from(new Set(downloads.map(d => d.browser)))

  // Calculate total size
  const totalSize = filteredDownloads.reduce((sum, d) => sum + d.file_size, 0)

  // Pagination
  const totalPages = Math.ceil(filteredDownloads.length / itemsPerPage)
  const paginatedDownloads = filteredDownloads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const formatExactDate = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.exe') || filename.endsWith('.msi')) {
      return <Code className="w-4 h-4 text-purple-500" />
    }
    if (filename.endsWith('.zip') || filename.endsWith('.rar') || filename.endsWith('.7z')) {
      return <Archive className="w-4 h-4 text-amber-500" />
    }
    return <FileText className="w-4 h-4 text-blue-500" />
  }

  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }

  const toggleRow = (downloadId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(downloadId)) {
      newExpanded.delete(downloadId)
    } else {
      newExpanded.add(downloadId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center mb-4">
          <Download className="w-5 h-5 mr-2 text-blue-500" />
          Downloads History
        </h2>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative" style={{ width: '300px' }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Browser filter */}
            <select
              value={selectedBrowser}
              onChange={(e) => setSelectedBrowser(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Browsers</option>
              {browsers.map(browser => (
                <option key={browser} value={browser}>
                  {browser.charAt(0).toUpperCase() + browser.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* File type filter */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-600 dark:text-gray-400">File Types:</div>
            <div className="flex space-x-2">
              {['all', 'executables', 'archives', 'documents'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFileTypeFilter(type)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                    fileTypeFilter === type
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Table */}
        {filteredDownloads.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-gray-400">
            No downloads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300 w-8"></th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">File Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Downloaded</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Source</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-gray-300">Browser</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDownloads.map((download) => {
                  const isExpanded = expandedRows.has(download.id)
                  return (
                    <React.Fragment key={download.id}>
                      {/* Main Row */}
                      <tr
                        className={cn(
                          'border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer',
                          download.danger_type === 'dangerous' && 'bg-red-50/50 dark:bg-red-900/10'
                        )}
                        onClick={() => toggleRow(download.id)}
                      >
                        <td className="py-3 px-4">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(download.filename)}
                            <span className="font-medium text-slate-900 dark:text-gray-50 truncate max-w-xs">
                              {download.filename}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                          {formatFileSize(download.file_size)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300">
                          <span title={formatExactDate(download.start_time)} className="cursor-help">
                            {formatTimeAgo(download.start_time)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300 truncate max-w-xs">
                          {extractDomain(download.download_url)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-700 dark:text-gray-300 capitalize">
                          {download.browser}
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-gray-800/30">
                          <td colSpan={6} className="py-4 px-8">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-gray-300">Full URL:</span>
                                <p className="text-slate-600 dark:text-gray-400 break-all mt-1">{download.download_url}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-gray-300">Saved to:</span>
                                <p className="text-slate-600 dark:text-gray-400 break-all mt-1">{download.download_path}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-gray-300">File Type:</span>
                                <p className="text-slate-600 dark:text-gray-400 mt-1">{download.file_type}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-gray-300">Opened:</span>
                                <p className="text-slate-600 dark:text-gray-400 mt-1">{download.opened ? 'Yes' : 'No'}</p>
                              </div>
                              {download.file_hash && (
                                <div className="col-span-2">
                                  <span className="font-semibold text-slate-700 dark:text-gray-300">SHA-256 Hash:</span>
                                  <p className="text-slate-600 dark:text-gray-400 font-mono text-xs mt-1 break-all">
                                    {download.file_hash}
                                  </p>
                                </div>
                              )}
                              {download.danger_type === 'dangerous' && (
                                <div className="col-span-2">
                                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                    <p className="text-red-700 dark:text-red-400 font-medium">
                                      ⚠ This file has been flagged as potentially dangerous and has been quarantined.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredDownloads.length)} of{' '}
              {filteredDownloads.length} downloads
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                  currentPage === 1
                    ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                )}
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'w-8 h-8 rounded-md text-sm font-medium transition-all duration-200',
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                  currentPage === totalPages
                    ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-gray-400">
              Total {filteredDownloads.length} of {downloads.length} downloads
            </span>
            <span className="text-slate-900 dark:text-gray-50 font-medium">
              Total: {formatFileSize(totalSize)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
