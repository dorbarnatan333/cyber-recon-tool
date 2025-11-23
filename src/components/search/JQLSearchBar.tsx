import React, { useState, useEffect, useRef } from 'react'
import { Search, X, History, Bookmark, BookmarkPlus, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react'
import {
  validateJQLSyntax,
  getAutocompleteSuggestions,
  getSyntaxTokens,
  SUPPORTED_FIELDS,
  SyntaxToken
} from '@/lib/jqlParser'
import { Button } from '@/components/ui'

interface JQLSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  resultCount?: number
  isLoading?: boolean
}

interface SavedQuery {
  id: string
  query: string
  name: string
  timestamp: string
}

const QUERY_HISTORY_KEY = 'jql_query_history'
const SAVED_QUERIES_KEY = 'jql_saved_queries'
const MAX_HISTORY = 10

export const JQLSearchBar: React.FC<JQLSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  resultCount,
  isLoading
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true })
  const [showHistory, setShowHistory] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [queryHistory, setQueryHistory] = useState<string[]>([])
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false)
  const [debouncedResultCount, setDebouncedResultCount] = useState<number | undefined>(resultCount)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load history and saved queries from localStorage
  useEffect(() => {
    const history = localStorage.getItem(QUERY_HISTORY_KEY)
    if (history) {
      setQueryHistory(JSON.parse(history))
    }

    const saved = localStorage.getItem(SAVED_QUERIES_KEY)
    if (saved) {
      setSavedQueries(JSON.parse(saved))
    }
  }, [])

  // Validate query in real-time
  useEffect(() => {
    if (!value.trim()) {
      setValidation({ valid: true })
      return
    }

    const result = validateJQLSyntax(value)
    setValidation(result)
  }, [value])

  // Debounce result count display by 3 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedResultCount(resultCount)
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [resultCount])

  // Update autocomplete suggestions
  useEffect(() => {
    if (value && cursorPosition > 0) {
      const completions = getAutocompleteSuggestions(value, cursorPosition)
      setSuggestions(completions)
      setSelectedSuggestion(0)
      setShowSuggestions(completions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value, cursorPosition])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setCursorPosition(e.target.selectionStart || 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle autocomplete navigation
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev + 1) % suggestions.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        return
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        if (suggestions[selectedSuggestion]) {
          e.preventDefault()
          applySuggestion(suggestions[selectedSuggestion])
          return
        }
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false)
        return
      }
    }

    // Handle search on Enter
    if (e.key === 'Enter' && !showSuggestions) {
      e.preventDefault()
      handleSearch()
    }
  }

  const applySuggestion = (suggestion: string) => {
    const beforeCursor = value.substring(0, cursorPosition)
    const afterCursor = value.substring(cursorPosition)

    // Find last token to replace
    const tokens = beforeCursor.split(/\s+/)
    const lastToken = tokens[tokens.length - 1] || ''

    const newValue = beforeCursor.substring(0, beforeCursor.length - lastToken.length) + suggestion + ' ' + afterCursor
    onChange(newValue)
    setShowSuggestions(false)

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus()
      const newPosition = newValue.length - afterCursor.length
      inputRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handleSearch = () => {
    if (!validation.valid || !value.trim()) return

    // Add to history
    const newHistory = [value, ...queryHistory.filter(q => q !== value)].slice(0, MAX_HISTORY)
    setQueryHistory(newHistory)
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(newHistory))

    onSearch()
  }

  const handleSaveQuery = () => {
    if (!saveName.trim() || !value.trim()) return

    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      query: value,
      name: saveName,
      timestamp: new Date().toISOString()
    }

    const updated = [newQuery, ...savedQueries]
    setSavedQueries(updated)
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updated))

    setSaveName('')
    setShowSaveDialog(false)
  }

  const handleDeleteSaved = (id: string) => {
    const updated = savedQueries.filter(q => q.id !== id)
    setSavedQueries(updated)
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updated))
  }

  const handleLoadQuery = (query: string) => {
    onChange(query)
    setShowHistory(false)
    setShowSaved(false)
  }

  // Syntax highlighting
  const renderHighlightedQuery = () => {
    if (!value) return null

    const tokens = getSyntaxTokens(value)

    return (
      <div className="absolute inset-0 pointer-events-none px-4 py-3 font-mono text-sm whitespace-pre-wrap overflow-hidden">
        {tokens.map((token, i) => {
          let colorClass = 'text-slate-600 dark:text-gray-400'

          switch (token.type) {
            case 'field':
              colorClass = 'text-blue-600 dark:text-blue-400 font-semibold'
              break
            case 'operator':
              colorClass = 'text-purple-600 dark:text-purple-400 font-semibold'
              break
            case 'value':
              colorClass = 'text-green-600 dark:text-green-400'
              break
            case 'logical':
              colorClass = 'text-orange-600 dark:text-orange-400 font-bold'
              break
            case 'paren':
              colorClass = 'text-slate-400 dark:text-gray-500'
              break
          }

          return (
            <span key={i} className={colorClass}>
              {token.value}{' '}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="relative">
        {/* Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            ) : (
              <Search className="h-5 w-5 text-slate-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setCursorPosition(inputRef.current?.selectionStart || 0)}
            onClick={() => setCursorPosition(inputRef.current?.selectionStart || 0)}
            placeholder='Try: os CONTAINS "Windows" AND risk_level = "HIGH"'
            className="w-full pl-12 pr-48 py-3 font-mono text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-gray-50 caret-slate-900 dark:caret-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
            {/* Result Count */}
            {debouncedResultCount !== undefined && !isLoading && value && (
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                {debouncedResultCount} {debouncedResultCount === 1 ? 'result' : 'results'}
              </div>
            )}

            {/* Validation Status */}
            {value && !isLoading && (
              <div className="px-2">
                {validation.valid ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
            )}

            {/* History Button */}
            <button
              onClick={() => {
                setShowHistory(!showHistory)
                setShowSaved(false)
                setShowSyntaxGuide(false)
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
              title="Query history"
            >
              <History className="h-4 w-4" />
            </button>

            {/* Saved Queries Button */}
            <button
              onClick={() => {
                setShowSaved(!showSaved)
                setShowHistory(false)
                setShowSyntaxGuide(false)
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
              title="Saved queries"
            >
              <Bookmark className="h-4 w-4" />
            </button>

            {/* Save Current Query Button */}
            {value && validation.valid && (
              <button
                onClick={() => setShowSaveDialog(!showSaveDialog)}
                className="p-2 text-slate-400 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                title="Save current query"
              >
                <BookmarkPlus className="h-4 w-4" />
              </button>
            )}

            {/* Syntax Guide Button */}
            <button
              onClick={() => {
                setShowSyntaxGuide(!showSyntaxGuide)
                setShowHistory(false)
                setShowSaved(false)
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
              title="Syntax guide"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Clear Button */}
            {value && !isLoading && (
              <button
                onClick={() => onChange('')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                title="Clear query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {value && !validation.valid && (
          <div className="mt-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{validation.error}</p>
          </div>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              onClick={() => applySuggestion(suggestion)}
              className={`px-4 py-2 cursor-pointer font-mono text-sm ${
                i === selectedSuggestion
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Query History Dropdown */}
      {showHistory && queryHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300">Recent Queries</h3>
          </div>
          {queryHistory.map((query, i) => (
            <div
              key={i}
              onClick={() => handleLoadQuery(query)}
              className="px-4 py-2 cursor-pointer text-sm font-mono text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 truncate"
            >
              {query}
            </div>
          ))}
        </div>
      )}

      {/* Saved Queries Dropdown */}
      {showSaved && savedQueries.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300">Saved Queries</h3>
          </div>
          {savedQueries.map((saved) => (
            <div
              key={saved.id}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center justify-between group"
            >
              <div onClick={() => handleLoadQuery(saved.query)} className="flex-1 cursor-pointer">
                <div className="text-sm font-medium text-slate-900 dark:text-gray-50">{saved.name}</div>
                <div className="text-xs font-mono text-slate-600 dark:text-gray-400 truncate">{saved.query}</div>
              </div>
              <button
                onClick={() => handleDeleteSaved(saved.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Query Dialog */}
      {showSaveDialog && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Save Query</h3>
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveQuery()}
            placeholder="Query name..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSaveDialog(false)
                setSaveName('')
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveQuery}>
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Syntax Guide Dropdown */}
      {showSyntaxGuide && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-50">JQL Syntax Guide</h3>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-2">Supported Fields:</h4>
              <div className="flex flex-wrap gap-1">
                {SUPPORTED_FIELDS.map((field) => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-mono"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-2">Operators:</h4>
              <div className="space-y-1 text-xs font-mono">
                <div><span className="text-purple-600 dark:text-purple-400">=</span> <span className="text-slate-600 dark:text-gray-400">equals</span></div>
                <div><span className="text-purple-600 dark:text-purple-400">!=</span> <span className="text-slate-600 dark:text-gray-400">not equals</span></div>
                <div><span className="text-purple-600 dark:text-purple-400">&gt;, &lt;, &gt;=, &lt;=</span> <span className="text-slate-600 dark:text-gray-400">comparison</span></div>
                <div><span className="text-purple-600 dark:text-purple-400">CONTAINS</span> <span className="text-slate-600 dark:text-gray-400">substring match</span></div>
                <div><span className="text-purple-600 dark:text-purple-400">STARTS WITH</span> <span className="text-slate-600 dark:text-gray-400">prefix match</span></div>
                <div><span className="text-purple-600 dark:text-purple-400">IN</span> <span className="text-slate-600 dark:text-gray-400">value in list</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-2">Examples:</h4>
              <div className="space-y-2">
                <div className="bg-slate-100 dark:bg-gray-900 p-2 rounded font-mono text-xs">
                  os CONTAINS "Windows" AND risk_level = "HIGH"
                </div>
                <div className="bg-slate-100 dark:bg-gray-900 p-2 rounded font-mono text-xs">
                  ip IN ["192.168.1.0/24"] AND last_activity &lt; "7d"
                </div>
                <div className="bg-slate-100 dark:bg-gray-900 p-2 rounded font-mono text-xs">
                  device_type = "server" AND open_ports &gt; 10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JQLSearchBar
