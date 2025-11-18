import React, { useState } from 'react'
import { 
  AlertTriangle, 
  Shield, 
  Filter, 
  Download, 
  RefreshCw, 
  Clock,
  Target,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Info,
  Search,
  TrendingUp,
  Database
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Badge,
  ThreatBadge,
  CVEBadge,
  SearchInput,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ActionCell
} from '@/components/ui'

interface Vulnerability {
  id: string
  cveId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  cvssScore: number
  cvssVector: string
  category: string
  affectedTargets: string[]
  affectedPorts: number[]
  discoveredAt: string
  status: 'open' | 'investigating' | 'mitigated' | 'false-positive'
  source: string
  references: string[]
  remediation?: string
  exploit?: {
    available: boolean
    complexity: 'low' | 'medium' | 'high'
    publicExploits: number
  }
}

interface VulnFilter {
  severity: string[]
  status: string[]
  category: string[]
  searchQuery: string
}

const Vulnerabilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'open' | 'recent'>('all')
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null)
  const [filters, setFilters] = useState<VulnFilter>({
    severity: [],
    status: [],
    category: [],
    searchQuery: ''
  })

  const mockVulnerabilities: Vulnerability[] = [
    {
      id: 'vuln-001',
      cveId: 'CVE-2023-34362',
      title: 'Critical SQL Injection in MOVEit Transfer',
      description: 'A SQL injection vulnerability exists in the MOVEit Transfer web application that could allow an unauthenticated attacker to gain access to MOVEit Transfer database.',
      severity: 'critical',
      cvssScore: 9.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      category: 'Injection',
      affectedTargets: ['web-server-01', '192.168.1.100'],
      affectedPorts: [80, 443],
      discoveredAt: '2 hours ago',
      status: 'open',
      source: 'Vulnerability Scanner',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2023-34362',
        'https://www.cisa.gov/news-events/alerts/2023/05/31/cisa-releases-report-moveit-transfer-critical-vulnerability'
      ],
      remediation: 'Immediately apply security patches provided by Progress Software. If patching is not immediately possible, disable the MOVEit Transfer HTTP and HTTPS traffic.',
      exploit: {
        available: true,
        complexity: 'low',
        publicExploits: 12
      }
    },
    {
      id: 'vuln-002',
      cveId: 'CVE-2023-28432',
      title: 'MinIO Information Disclosure Vulnerability',
      description: 'An information disclosure vulnerability in MinIO allows remote attackers to access sensitive information via crafted requests.',
      severity: 'high',
      cvssScore: 8.1,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
      category: 'Information Disclosure',
      affectedTargets: ['storage-server', '10.0.0.25'],
      affectedPorts: [9000, 9001],
      discoveredAt: '1 day ago',
      status: 'investigating',
      source: 'Manual Testing',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2023-28432'
      ],
      exploit: {
        available: false,
        complexity: 'medium',
        publicExploits: 0
      }
    },
    {
      id: 'vuln-003',
      cveId: 'CVE-2023-21716',
      title: 'Microsoft Exchange Server Remote Code Execution',
      description: 'A remote code execution vulnerability exists in Microsoft Exchange Server when the server fails to properly validate PowerShell commands.',
      severity: 'critical',
      cvssScore: 9.0,
      cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H',
      category: 'Remote Code Execution',
      affectedTargets: ['exchange-01.internal'],
      affectedPorts: [443, 587],
      discoveredAt: '3 days ago',
      status: 'mitigated',
      source: 'Automated Scan',
      references: [
        'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-21716'
      ],
      remediation: 'Apply the latest security updates from Microsoft Exchange Server.',
      exploit: {
        available: true,
        complexity: 'high',
        publicExploits: 3
      }
    },
    {
      id: 'vuln-004',
      cveId: 'CVE-2023-25690',
      title: 'Apache HTTP Server Request Smuggling',
      description: 'Some mod_proxy configurations on Apache HTTP Server allow a remote attacker to perform an HTTP Request Smuggling attack.',
      severity: 'medium',
      cvssScore: 6.1,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      category: 'Request Smuggling',
      affectedTargets: ['web-proxy', '192.168.1.50'],
      affectedPorts: [80, 443, 8080],
      discoveredAt: '1 week ago',
      status: 'open',
      source: 'Automated Scan',
      references: [
        'https://httpd.apache.org/security/vulnerabilities_24.html'
      ],
      exploit: {
        available: false,
        complexity: 'medium',
        publicExploits: 1
      }
    },
    {
      id: 'vuln-005',
      cveId: 'CVE-2023-1234',
      title: 'WordPress Plugin XSS Vulnerability',
      description: 'Cross-site scripting vulnerability in popular WordPress plugin allows authenticated users to inject malicious scripts.',
      severity: 'low',
      cvssScore: 3.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:N/I:L/A:N',
      category: 'Cross-Site Scripting',
      affectedTargets: ['wordpress.acme.com'],
      affectedPorts: [80, 443],
      discoveredAt: '2 weeks ago',
      status: 'false-positive',
      source: 'Manual Testing',
      references: [],
      exploit: {
        available: false,
        complexity: 'low',
        publicExploits: 0
      }
    }
  ]

  const vulnStats = {
    total: mockVulnerabilities.length,
    critical: mockVulnerabilities.filter(v => v.severity === 'critical').length,
    high: mockVulnerabilities.filter(v => v.severity === 'high').length,
    open: mockVulnerabilities.filter(v => v.status === 'open').length,
    newThisWeek: 3
  }

  const getStatusIcon = (status: string) => {
    const iconMap = {
      open: AlertCircle,
      investigating: Search,
      mitigated: CheckCircle2,
      'false-positive': Info
    }
    return iconMap[status as keyof typeof iconMap] || AlertCircle
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      open: 'text-danger-400',
      investigating: 'text-warning-400',
      mitigated: 'text-success-400',
      'false-positive': 'text-gray-400'
    }
    return colorMap[status as keyof typeof colorMap] || 'text-gray-400'
  }

  // Helper function for severity counts (currently unused but kept for future features)
  // const getSeverityCount = (severity: string) => {
  //   return mockVulnerabilities.filter(v => v.severity === severity).length
  // }

  const filteredVulns = mockVulnerabilities.filter(vuln => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'critical' && vuln.severity === 'critical') ||
      (activeTab === 'open' && vuln.status === 'open') ||
      (activeTab === 'recent' && ['2 hours ago', '1 day ago'].includes(vuln.discoveredAt))

    const matchesSearch = !filters.searchQuery || 
      vuln.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      vuln.cveId.toLowerCase().includes(filters.searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading text-h2 font-semibold text-gray-50">
            Vulnerability Management
          </h1>
          <p className="text-body-sm text-gray-400 mt-1">
            Track, analyze, and remediate security vulnerabilities across your infrastructure
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last scan: 30 minutes ago</span>
          </div>
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Vulnerability Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="solid" className="border-l-4 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Total Vulnerabilities</p>
                <p className="text-h3 font-bold text-gray-50">{vulnStats.total}</p>
              </div>
              <Database className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-danger-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Critical</p>
                <p className="text-h3 font-bold text-gray-50">{vulnStats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger-700" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-warning-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">High Severity</p>
                <p className="text-h3 font-bold text-gray-50">{vulnStats.high}</p>
              </div>
              <Shield className="w-8 h-8 text-warning-700" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-danger-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Open Issues</p>
                <p className="text-h3 font-bold text-gray-50">{vulnStats.open}</p>
              </div>
              <Target className="w-8 h-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-cyber-matrix">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">New This Week</p>
                <p className="text-h3 font-bold text-gray-50">{vulnStats.newThisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyber-matrix" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Vulnerabilities', count: vulnStats.total },
              { key: 'critical', label: 'Critical', count: vulnStats.critical },
              { key: 'open', label: 'Open', count: vulnStats.open },
              { key: 'recent', label: 'Recent', count: vulnStats.newThisWeek }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary-800 text-cyber-matrix border border-primary-700'
                    : 'text-gray-400 hover:text-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <SearchInput 
            placeholder="Search vulnerabilities..."
            onSearch={(value) => setFilters({ ...filters, searchQuery: value })}
            className="w-64"
          />
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Vulnerability Details */}
      {selectedVuln && (
        <Card variant="glass" glow glowColor="warning">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-heading text-h5 font-semibold text-gray-50">{selectedVuln.title}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <CVEBadge cveId={selectedVuln.cveId} score={selectedVuln.cvssScore} />
                  <ThreatBadge level={selectedVuln.severity} />
                  <Badge variant="secondary">{selectedVuln.category}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVuln(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="text-body font-medium text-gray-300 mb-2">Description</h4>
                  <p className="text-body-sm text-gray-400">{selectedVuln.description}</p>
                </div>

                {selectedVuln.remediation && (
                  <div>
                    <h4 className="text-body font-medium text-gray-300 mb-2">Remediation</h4>
                    <p className="text-body-sm text-gray-400">{selectedVuln.remediation}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-body font-medium text-gray-300 mb-2">References</h4>
                  <div className="space-y-1">
                    {selectedVuln.references.map((ref, index) => (
                      <a 
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-primary-400 hover:text-primary-300 flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-body font-medium text-gray-300 mb-2">Technical Details</h4>
                  <div className="space-y-2 text-body-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CVSS Score:</span>
                      <span className="text-gray-50 font-mono">{selectedVuln.cvssScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vector:</span>
                      <span className="text-gray-50 font-mono text-xs">{selectedVuln.cvssVector.split('/').slice(0, 2).join('/')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="text-gray-50">{selectedVuln.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discovered:</span>
                      <span className="text-gray-50">{selectedVuln.discoveredAt}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-body font-medium text-gray-300 mb-2">Affected Assets</h4>
                  <div className="space-y-1">
                    {selectedVuln.affectedTargets.map((target, index) => (
                      <div key={index} className="text-body-sm font-mono text-cyber-matrix">
                        {target}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedVuln.exploit && (
                  <div>
                    <h4 className="text-body font-medium text-gray-300 mb-2">Exploit Information</h4>
                    <div className="space-y-2 text-body-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available:</span>
                        <Badge variant={selectedVuln.exploit.available ? 'danger' : 'success'} size="sm">
                          {selectedVuln.exploit.available ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Complexity:</span>
                        <span className="text-gray-50 capitalize">{selectedVuln.exploit.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Public Exploits:</span>
                        <span className="text-gray-50">{selectedVuln.exploit.publicExploits}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vulnerabilities Table */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-h4 font-semibold text-gray-50">
              Vulnerability Findings
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-body-sm text-gray-400">
                Showing {filteredVulns.length} of {vulnStats.total} vulnerabilities
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vulnerability</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>CVSS</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Affected Targets</TableHead>
                <TableHead>Discovered</TableHead>
                <TableHead>Exploit</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVulns.map((vuln) => {
                const StatusIcon = getStatusIcon(vuln.status)
                return (
                  <TableRow 
                    key={vuln.id}
                    className="cursor-pointer hover:bg-gray-800/70"
                    onClick={() => setSelectedVuln(vuln)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-50">{vuln.title}</p>
                        <CVEBadge cveId={vuln.cveId} score={vuln.cvssScore} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ThreatBadge level={vuln.severity} />
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono font-bold ${
                        vuln.cvssScore >= 9 ? 'text-danger-400' :
                        vuln.cvssScore >= 7 ? 'text-warning-400' :
                        vuln.cvssScore >= 4 ? 'text-primary-400' :
                        'text-gray-400'
                      }`}>
                        {vuln.cvssScore.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(vuln.status)}`} />
                        <span className="text-gray-50 capitalize">{vuln.status.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vuln.affectedTargets.slice(0, 2).map((target, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {target}
                          </Badge>
                        ))}
                        {vuln.affectedTargets.length > 2 && (
                          <Badge variant="secondary" size="sm">
                            +{vuln.affectedTargets.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {vuln.discoveredAt}
                    </TableCell>
                    <TableCell>
                      {vuln.exploit?.available && (
                        <Badge variant="danger" size="sm" pulse>
                          Available
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionCell
                        onView={() => setSelectedVuln(vuln)}
                        actions={[
                          {
                            icon: <CheckCircle2 className="w-4 h-4" />,
                            label: 'Mark as Fixed',
                            onClick: () => {
                              console.log('Mark as fixed:', vuln.cveId)
                            },
                          },
                          {
                            icon: <ExternalLink className="w-4 h-4" />,
                            label: 'View CVE Details',
                            onClick: () => {
                              console.log('View CVE:', vuln.cveId)
                            },
                          }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Vulnerabilities