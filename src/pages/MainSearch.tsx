import React, { useState, useEffect } from 'react'
import { Search, X, Users } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'
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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyber-matrix" />
              </div>
              <div>
                <h1 className="text-heading text-xl font-bold text-gray-50">Truth</h1>
                <p className="text-xs text-gray-400">Endpoint Investigation System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h2 className="text-heading text-3xl font-bold text-gray-50 mb-4">
              Start Your Investigation
            </h2>
            <p className="text-body text-gray-400">
              Search by Computer Name, IP Address, MAC Address, or Company Name
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by Computer Name, IP, MAC, or Company Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-16 py-4 text-lg w-full"
                variant="cyber"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <div className="absolute inset-y-0 right-12 flex items-center">
                <Button
                  onClick={handleSearch}
                  disabled={searchQuery.trim().length < 2 || isLoading}
                  loading={isLoading}
                  variant="primary"
                  size="md"
                  glow
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Examples */}
            <div className="max-w-3xl mx-auto mt-4 text-center">
              <p className="text-body-sm text-gray-500 mb-2">Examples:</p>
              <div className="flex justify-center space-x-8 text-body-sm">
                <span className="text-gray-400">
                  <strong className="text-gray-300">Computer:</strong> WORKSTATION-042, 192.168.1.100
                </span>
                <span className="text-gray-400">
                  <strong className="text-gray-300">Company:</strong> Contoso Corporation, contoso.com
                </span>
              </div>
            </div>
          </div>

          {/* Recent Companies Grid */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-heading text-xl font-semibold text-gray-50 mb-2">
                Recent Companies
              </h3>
              <p className="text-body-sm text-gray-400">
                Quick access to frequently investigated organizations
              </p>
            </div>

            {recentCompanies.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {recentCompanies.map((company) => (
                  <Card
                    key={company.company_id}
                    variant="glass"
                    className="cursor-pointer hover:border-primary-700 hover:glow-primary transition-all duration-200"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-3">
                        <h4 className="text-body font-semibold text-gray-50 truncate" title={company.company_name}>
                          {company.company_name}
                        </h4>
                        <p className="text-body-sm text-gray-400 mt-1">
                          {company.device_count} devices
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last searched: {new Date(company.last_searched).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="solid" className="text-center py-8">
                <CardContent>
                  <p className="text-gray-400">
                    No recent companies found.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Start by searching for a company above.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MainSearch