import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Download, RefreshCw, Settings, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  link?: string
}

export interface EndpointStatus {
  type: 'active' | 'recent' | 'inactive' | 'offline'
  label: string
  lastSeen: string
}

export interface SystemInfo {
  avatar: string
  name: string
  context: string
}

export interface StickyHeaderProps {
  systemInfo: SystemInfo
  breadcrumbs: BreadcrumbItem[]
  endpointStatus?: EndpointStatus
  onSave?: () => void
  onExport?: (format: 'json' | 'pdf' | 'csv' | 'email') => void
  onRefresh?: () => void
  onSettings?: () => void
  isLoading?: boolean
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  systemInfo,
  breadcrumbs,
  endpointStatus,
  onSave,
  onExport,
  onRefresh,
  onSettings,
  isLoading = false
}) => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false)
      }
    }

    if (exportOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [exportOpen])


  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.link) {
      navigate(item.link)
    }
  }

  const handleExportClick = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    if (onExport) {
      onExport(format)
    }
    setExportOpen(false)
  }

  const getStatusColor = (type: EndpointStatus['type']) => {
    switch (type) {
      case 'active':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'recent':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'inactive':
        return 'bg-gray-50 border-gray-200 text-gray-600'
      case 'offline':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  const getStatusIndicatorColor = (type: EndpointStatus['type']) => {
    switch (type) {
      case 'active':
        return 'bg-green-500 shadow-green-200'
      case 'recent':
        return 'bg-yellow-500 shadow-yellow-200'
      case 'inactive':
        return 'bg-gray-400 shadow-gray-200'
      case 'offline':
        return 'bg-red-500 shadow-red-200'
      default:
        return 'bg-gray-400 shadow-gray-200'
    }
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/60 z-[1100] transition-all duration-200",
        scrolled && "shadow-lg shadow-slate-900/5"
      )}
    >
      <div className="h-full flex items-center w-full">
        
        {/* Fixed Left: System Info Card - Positioned over sidebar */}
        <div className="absolute left-6 flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-50/90 to-slate-100/80 border border-slate-200/60 rounded-lg shadow-sm z-10">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md text-white font-semibold text-base">
            {systemInfo.avatar}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {systemInfo.name}
            </div>
            <div className="text-xs text-slate-600 truncate">
              {systemInfo.context}
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Starts after sidebar */}
        <div className="flex-1 flex items-center justify-between" style={{ paddingLeft: '280px', paddingRight: '24px' }}>
          {/* Left: Breadcrumb - Right after sidebar */}
          <nav className="breadcrumb flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-slate-400 select-none">/</span>
                )}
                {item.link ? (
                  <button
                    onClick={() => handleBreadcrumbClick(item)}
                    className="text-slate-500 hover:text-blue-600 hover:underline transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-slate-900 font-semibold whitespace-nowrap" title={item.label}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          {/* Right Side: Actions + Status */}
          <div className="flex items-center gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden md:inline">Save</span>
                </button>
              )}
              
              {onExport && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setExportOpen(!exportOpen)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden md:inline">Export</span>
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      exportOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {exportOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[200px] z-[1200] opacity-100 transform translate-y-0 transition-all duration-150">
                      <div className="py-1">
                        <button
                          onClick={() => handleExportClick('json')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-base">📄</span>
                          <span>Export as JSON</span>
                        </button>
                        <button
                          onClick={() => handleExportClick('pdf')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-base">📋</span>
                          <span>Export as PDF</span>
                        </button>
                        <button
                          onClick={() => handleExportClick('csv')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-base">📊</span>
                          <span>Export as CSV</span>
                        </button>
                        <div className="h-px bg-slate-200 my-1" />
                        <button
                          onClick={() => handleExportClick('email')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-base">📧</span>
                          <span>Email Report</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-slate-600 hover:text-slate-900"
                >
                  <RefreshCw className={cn(
                    "w-4 h-4",
                    isLoading && "animate-spin"
                  )} />
                </button>
              )}
              
              {onSettings && (
                <button
                  onClick={onSettings}
                  disabled={isLoading}
                  className="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-slate-600 hover:text-slate-900"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Status Badge - Rightmost Position */}
            {endpointStatus && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold",
                getStatusColor(endpointStatus.type)
              )}>
                <span 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    getStatusIndicatorColor(endpointStatus.type),
                    "shadow-md"
                  )}
                />
                <span>{endpointStatus.label}</span>
                <span className="text-current/70">• {endpointStatus.lastSeen}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default StickyHeader