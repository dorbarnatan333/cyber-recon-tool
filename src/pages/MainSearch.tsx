import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button, Card, CardContent, Input, ThemeToggle } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface Company {
  company_id: string
  company_name: string
  company_domain: string
  device_count: number
  last_searched: string
  search_frequency: number
  is_pinned: boolean
}

// Search type detection function
const detectSearchType = (input: string): 'device' | 'company' => {
  const trimmedInput = input.trim()
  
  // IP Address patterns (IPv4)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(trimmedInput)) {
    return 'device'
  }
  
  // MAC Address patterns
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  if (macRegex.test(trimmedInput)) {
    return 'device'
  }
  
  // Hostname patterns (contains dashes, ends with number, etc.)
  const hostnameRegex = /^[A-Za-z0-9-]+(-\d+)?$/
  if (hostnameRegex.test(trimmedInput) && (trimmedInput.includes('-') || /\d+$/.test(trimmedInput))) {
    return 'device'
  }
  
  // Domain name pattern (contains dots and TLD)
  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
  if (domainRegex.test(trimmedInput)) {
    return 'company'
  }
  
  // Default: If all else fails, assume company search
  return 'company'
}

// Mock data for recent companies
const mockRecentCompanies: Company[] = [
  {
    company_id: 'company-001',
    company_name: 'Contoso Corporation',
    company_domain: 'contoso.com',
    device_count: 47,
    last_searched: '2025-11-18T12:00:00Z',
    search_frequency: 15,
    is_pinned: false
  },
  {
    company_id: 'company-002', 
    company_name: 'Fabrikam Inc',
    company_domain: 'fabrikam.com',
    device_count: 23,
    last_searched: '2025-11-17T15:30:00Z',
    search_frequency: 8,
    is_pinned: false
  },
  {
    company_id: 'company-003',
    company_name: 'Northwind Traders',
    company_domain: 'northwindtraders.com', 
    device_count: 89,
    last_searched: '2025-11-16T09:00:00Z',
    search_frequency: 22,
    is_pinned: true
  },
  {
    company_id: 'company-004',
    company_name: 'Adventure Works',
    company_domain: 'adventureworks.com',
    device_count: 15,
    last_searched: '2025-11-15T14:20:00Z',
    search_frequency: 5,
    is_pinned: false
  },
  {
    company_id: 'company-005',
    company_name: 'Wide World Importers',
    company_domain: 'wideworldimporters.com',
    device_count: 56,
    last_searched: '2025-11-14T11:45:00Z',
    search_frequency: 12,
    is_pinned: false
  },
  {
    company_id: 'company-006',
    company_name: 'Fourth Coffee',
    company_domain: 'fourthcoffee.com',
    device_count: 31,
    last_searched: '2025-11-13T16:10:00Z',
    search_frequency: 7,
    is_pinned: false
  },
  {
    company_id: 'company-007',
    company_name: 'Tailspin Toys',
    company_domain: 'tailspintoys.com',
    device_count: 12,
    last_searched: '2025-11-12T08:30:00Z',
    search_frequency: 3,
    is_pinned: false
  },
  {
    company_id: 'company-008',
    company_name: 'Wingtip Toys',
    company_domain: 'wingtiptoys.com',
    device_count: 67,
    last_searched: '2025-11-11T13:25:00Z',
    search_frequency: 18,
    is_pinned: false
  },
  {
    company_id: 'company-009',
    company_name: 'Proseware Inc',
    company_domain: 'proseware.com',
    device_count: 41,
    last_searched: '2025-11-10T10:15:00Z',
    search_frequency: 9,
    is_pinned: false
  }
]

const MainSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([])
  const [animationPhase, setAnimationPhase] = useState(0) // 0: hidden, 1: appearing, 2: peak, 3: settled
  const navigate = useNavigate()

  // Load recent companies from localStorage on component mount
  useEffect(() => {
    const storedCompanies = localStorage.getItem('truth_recent_companies')
    if (storedCompanies) {
      try {
        setRecentCompanies(JSON.parse(storedCompanies))
      } catch (error) {
        console.error('Failed to parse stored companies:', error)
        setRecentCompanies(mockRecentCompanies)
        localStorage.setItem('truth_recent_companies', JSON.stringify(mockRecentCompanies))
      }
    } else {
      setRecentCompanies(mockRecentCompanies)
      localStorage.setItem('truth_recent_companies', JSON.stringify(mockRecentCompanies))
    }
  }, [])

  // Trigger animation sequence on page load
  useEffect(() => {
    const timers = []
    
    // Phase 1: Start appearing (300ms delay)
    timers.push(setTimeout(() => {
      setAnimationPhase(1)
    }, 300))
    
    // Phase 2: Peak glow (700ms)
    timers.push(setTimeout(() => {
      setAnimationPhase(2)
    }, 700))
    
    // Phase 3: Settle to final state (1800ms - longer peak duration)
    timers.push(setTimeout(() => {
      setAnimationPhase(3)
    }, 1800))
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      return
    }

    setIsLoading(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const searchType = detectSearchType(searchQuery)
    
    // Store search in localStorage for company searches
    if (searchType === 'company') {
      const updatedCompanies = [...recentCompanies]
      const existingCompanyIndex = updatedCompanies.findIndex(
        company => company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   company.company_domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      if (existingCompanyIndex >= 0) {
        // Move existing company to front and update timestamp
        const [company] = updatedCompanies.splice(existingCompanyIndex, 1)
        company.last_searched = new Date().toISOString()
        company.search_frequency += 1
        updatedCompanies.unshift(company)
      }
      
      localStorage.setItem('truth_recent_companies', JSON.stringify(updatedCompanies.slice(0, 9)))
    }
    
    // Navigate to search results
    navigate('/search/results', { 
      state: { 
        query: searchQuery, 
        searchType,
        timestamp: new Date().toISOString()
      } 
    })
    
    setIsLoading(false)
  }

  const handleCompanyClick = (company: Company) => {
    setIsLoading(true)
    
    // Update company in recent list
    const updatedCompanies = [...recentCompanies]
    const companyIndex = updatedCompanies.findIndex(c => c.company_id === company.company_id)
    if (companyIndex >= 0) {
      updatedCompanies[companyIndex].last_searched = new Date().toISOString()
      updatedCompanies[companyIndex].search_frequency += 1
      
      // Move to front
      const [updatedCompany] = updatedCompanies.splice(companyIndex, 1)
      updatedCompanies.unshift(updatedCompany)
      
      localStorage.setItem('truth_recent_companies', JSON.stringify(updatedCompanies))
      setRecentCompanies(updatedCompanies)
    }
    
    navigate('/search/results', {
      state: {
        query: company.company_name,
        searchType: 'company',
        timestamp: new Date().toISOString()
      }
    })
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/60 dark:border-gray-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4h18v3H14v13h-4V7H3V4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-heading text-xl font-bold text-slate-900 dark:text-gray-50">Truth</h1>
                <p className="text-xs text-slate-500 dark:text-gray-400">Endpoint Investigation System</p>
              </div>
            </div>
            <ThemeToggle size="md" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 py-8 min-h-0">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h2 className="text-heading text-4xl lg:text-5xl font-bold text-slate-900 dark:text-gray-50 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                Start Your Investigation
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-3">
              <p className="text-body-lg text-slate-700 dark:text-gray-300 font-medium">
                Uncover digital insights with Truth's advanced reconnaissance platform
              </p>
              <p className="text-body text-slate-600 dark:text-gray-400">
                Search by Computer Name, IP Address, MAC Address, or Company Name to begin your investigation
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-12">
            <div className="relative max-w-3xl mx-auto">
              {/* Animated glow effect on page load */}
              <div 
                className={`absolute -inset-1.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl blur-lg transition-all duration-700 ease-out ${
                  animationPhase === 0 ? 'opacity-0 scale-95' :
                  animationPhase === 1 ? 'opacity-35 scale-102' :
                  animationPhase === 2 ? 'opacity-50 scale-112' :
                  'opacity-25 scale-105'
                }`}
              ></div>
              {/* Secondary inner glow for subtle depth */}
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-r from-blue-400/25 via-purple-400/25 to-blue-400/25 rounded-2xl blur-md transition-all duration-700 ease-out ${
                  animationPhase === 0 ? 'opacity-0 scale-97' :
                  animationPhase === 1 ? 'opacity-30 scale-100' :
                  animationPhase === 2 ? 'opacity-45 scale-108' :
                  'opacity-20 scale-102'
                }`}
              ></div>
              <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl border border-slate-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Search className="h-5 w-5 text-slate-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Computer Name, IP, MAC, or Company Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="relative z-10 pl-12 pr-32 h-14 text-lg w-full bg-transparent border border-transparent rounded-2xl text-slate-900 dark:text-gray-50 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-24 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <div className="absolute inset-y-0 right-2 flex items-center z-10">
                  <button
                    onClick={handleSearch}
                    disabled={searchQuery.trim().length < 2 || isLoading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 backdrop-blur-sm"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Companies Grid */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-heading text-xl font-semibold text-slate-900 dark:text-gray-50 mb-2">
                Recent Companies
              </h3>
              <p className="text-body-sm text-slate-600 dark:text-gray-400">
                Quick access to frequently investigated organizations
              </p>
            </div>

            {recentCompanies.length > 0 ? (
              <div className="grid grid-cols-3 gap-5 mt-8">
                {recentCompanies.map((company) => (
                  <div
                    key={company.company_id}
                    className="cursor-pointer backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-slate-200/50 dark:border-gray-700/50 rounded-2xl p-6 text-center hover:bg-white/80 dark:hover:bg-gray-800/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/30 dark:hover:border-blue-600/40 transition-all duration-300 shadow-lg shadow-black/5"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-50 truncate" title={company.company_name}>
                        {company.company_name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
                        {company.device_count} devices
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-500">
                      Last searched: {new Date(company.last_searched).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-slate-200/50 dark:border-gray-700/50 rounded-2xl p-8 text-center shadow-lg shadow-black/5">
                <p className="text-slate-600 dark:text-gray-400">
                  No recent companies found.
                </p>
                <p className="text-slate-500 dark:text-gray-500 text-sm mt-1">
                  Start by searching for a company above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MainSearch