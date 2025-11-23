import React, { useState, useMemo } from 'react'
import { Bookmark, Search, Folder, FolderOpen, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Bookmark as BookmarkType } from '@/data/mockBrowserData'
import { cn } from '@/lib/utils'

interface BookmarksFavoritesProps {
  bookmarks: BookmarkType[]
}

interface FolderNode {
  name: string
  path: string
  bookmarks: BookmarkType[]
  children: Map<string, FolderNode>
}

export const BookmarksFavorites: React.FC<BookmarksFavoritesProps> = ({ bookmarks }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrowser, setSelectedBrowser] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesSearch = searchTerm === '' ||
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrowser = selectedBrowser === 'all' || bookmark.browser === selectedBrowser

      return matchesSearch && matchesBrowser
    })
  }, [bookmarks, searchTerm, selectedBrowser])

  // Get unique browsers
  const browsers = Array.from(new Set(bookmarks.map(b => b.browser)))

  // Build folder tree
  const folderTree = useMemo(() => {
    const root: FolderNode = {
      name: 'Root',
      path: '',
      bookmarks: [],
      children: new Map()
    }

    filteredBookmarks.forEach(bookmark => {
      const parts = bookmark.folder_path.split('/')
      let current = root

      parts.forEach((part, index) => {
        const path = parts.slice(0, index + 1).join('/')
        if (!current.children.has(part)) {
          current.children.set(part, {
            name: part,
            path,
            bookmarks: [],
            children: new Map()
          })
        }
        current = current.children.get(part)!
      })

      current.bookmarks.push(bookmark)
    })

    return root
  }, [filteredBookmarks])

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Helper function to count all bookmarks recursively in a folder
  const countAllBookmarks = (node: FolderNode): number => {
    let count = node.bookmarks.length
    node.children.forEach(child => {
      count += countAllBookmarks(child)
    })
    return count
  }

  const renderFolderTree = (node: FolderNode, level: number = 0) => {
    if (level === 0) {
      // Root level - render children directly
      return (
        <div className="space-y-2">
          {Array.from(node.children.values()).map(child => renderFolderTree(child, level + 1))}
        </div>
      )
    }

    const isExpanded = expandedFolders.has(node.path)
    const hasChildren = node.children.size > 0
    const bookmarkCount = countAllBookmarks(node)

    return (
      <div key={node.path} className="space-y-1">
        {/* Folder header */}
        <div
          className={cn(
            'flex items-center space-x-2 p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800/60 cursor-pointer transition-colors',
            level > 1 && 'ml-4'
          )}
          onClick={() => toggleFolder(node.path)}
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )
          )}
          {!hasChildren && <div className="w-4" />}

          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-500" />
          ) : (
            <Folder className="w-4 h-4 text-blue-500" />
          )}

          <span className="font-medium text-slate-900 dark:text-gray-50">
            {node.name}
          </span>
          <span className="text-sm text-slate-500 dark:text-gray-400">
            ({bookmarkCount} bookmark{bookmarkCount !== 1 ? 's' : ''})
          </span>
        </div>

        {/* Folder contents */}
        {isExpanded && (
          <div className={cn('space-y-2', level > 0 && 'ml-8')}>
            {/* Bookmarks in this folder */}
            {node.bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex items-start space-x-3 p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 dark:text-gray-50 text-sm truncate">
                    {bookmark.title}
                  </h4>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 mt-1"
                  >
                    <span className="truncate">{bookmark.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Added: {formatDate(bookmark.date_added)}
                  </div>
                </div>
              </div>
            ))}

            {/* Child folders */}
            {Array.from(node.children.values()).map(child => renderFolderTree(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {filteredBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className="flex items-start space-x-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-gray-700/60 hover:shadow-md transition-all duration-200"
          >
            <Bookmark className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-gray-50 mb-1">
                {bookmark.title}
              </h4>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 mb-2"
              >
                <span className="truncate">{bookmark.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
              <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-gray-400">
                <span>
                  <Folder className="w-3 h-3 inline mr-1" />
                  {bookmark.folder_path}
                </span>
                <span>•</span>
                <span>Added: {formatDate(bookmark.date_added)}</span>
                <span>•</span>
                <span className="capitalize">{bookmark.browser}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center mb-4">
          <Bookmark className="w-5 h-5 mr-2 text-blue-500" />
          Bookmarks & Favorites
        </h2>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookmarks..."
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

          {/* View mode */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-600 dark:text-gray-400">View:</div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('tree')}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-1',
                  viewMode === 'tree'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                )}
              >
                <Folder className="w-3 h-3" />
                <span>Folder Tree</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-1',
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                )}
              >
                <Bookmark className="w-3 h-3" />
                <span>Flat List</span>
              </button>
            </div>

            {viewMode === 'tree' && (
              <button
                onClick={() => {
                  if (expandedFolders.size > 0) {
                    setExpandedFolders(new Set())
                  } else {
                    const allPaths = new Set<string>()
                    const collectPaths = (node: FolderNode) => {
                      if (node.path) allPaths.add(node.path)
                      node.children.forEach(child => collectPaths(child))
                    }
                    collectPaths(folderTree)
                    setExpandedFolders(allPaths)
                  }
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {expandedFolders.size > 0 ? 'Collapse All' : 'Expand All'}
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-gray-400">
            No bookmarks found
          </div>
        ) : (
          <>
            {viewMode === 'tree' ? renderFolderTree(folderTree) : renderListView()}
          </>
        )}

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
          <div className="text-sm text-slate-600 dark:text-gray-400">
            Total: {filteredBookmarks.length} bookmarks across all browsers
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
