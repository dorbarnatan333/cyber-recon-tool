import React, { useState } from 'react'
import { Target, Search, Plus, Server, Building, Globe, User, Network, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Input, 
  SearchInput, 
  IPInput, 
  DomainInput,
  Badge,
  StatusBadge,
  ThreatBadge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ActionCell
} from '@/components/ui'

interface TargetEntry {
  id: string
  name: string
  type: 'ip' | 'domain' | 'computer' | 'username' | 'company' | 'range'
  value: string
  status: 'active' | 'scanning' | 'completed' | 'failed' | 'pending'
  lastScanned: string
  vulnerabilities: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  os?: string
  ports?: number[]
}

const Targets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'direct' | 'company'>('direct')
  const [formData, setFormData] = useState({
    target: '',
    targetType: 'ip',
    company: '',
    companyType: 'name'
  })

  // Mock targets data
  const mockTargets: TargetEntry[] = [
    {
      id: 'tgt-001',
      name: 'Web Server',
      type: 'ip',
      value: '192.168.1.100',
      status: 'active',
      lastScanned: '2 hours ago',
      vulnerabilities: 3,
      riskLevel: 'high',
      os: 'Ubuntu 20.04',
      ports: [22, 80, 443, 3306]
    },
    {
      id: 'tgt-002',
      name: 'Mail Server',
      type: 'domain',
      value: 'mail.acme.com',
      status: 'completed',
      lastScanned: '1 day ago',
      vulnerabilities: 1,
      riskLevel: 'medium',
      os: 'Windows Server 2019',
      ports: [25, 110, 143, 993, 995]
    },
    {
      id: 'tgt-003',
      name: 'John Doe Workstation',
      type: 'computer',
      value: 'DESKTOP-JD123',
      status: 'scanning',
      lastScanned: '5 minutes ago',
      vulnerabilities: 0,
      riskLevel: 'low',
      os: 'Windows 11',
      ports: [135, 445, 3389]
    },
    {
      id: 'tgt-004',
      name: 'Database Server',
      type: 'ip',
      value: '10.0.0.50',
      status: 'failed',
      lastScanned: '3 days ago',
      vulnerabilities: 8,
      riskLevel: 'critical',
      os: 'CentOS 7',
      ports: [22, 3306, 5432]
    },
    {
      id: 'tgt-005',
      name: 'Admin User',
      type: 'username',
      value: 'admin',
      status: 'pending',
      lastScanned: 'Never',
      vulnerabilities: 0,
      riskLevel: 'low'
    }
  ]

  const handleAddTarget = () => {
    if (activeTab === 'direct') {
      console.log('Adding direct target:', formData.target)
      // TODO: Implement target addition logic
    } else {
      console.log('Starting company investigation:', formData.company)
      // TODO: Implement company investigation logic
    }
  }

  const getTargetIcon = (type: string) => {
    const iconMap = {
      ip: Network,
      domain: Globe,
      computer: Server,
      username: User,
      company: Building,
      range: Network
    }
    return iconMap[type as keyof typeof iconMap] || Target
  }

  const stats = {
    total: mockTargets.length,
    active: mockTargets.filter(t => t.status === 'active' || t.status === 'scanning').length,
    critical: mockTargets.filter(t => t.riskLevel === 'critical').length,
    vulnerabilities: mockTargets.reduce((sum, t) => sum + t.vulnerabilities, 0)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading text-h2 font-semibold text-slate-900 dark:text-gray-50">
            Target Management
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-gray-400 mt-1">
            Configure investigation targets and monitor scanning progress
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 30 seconds ago</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="solid" className="border-l-4 border-blue-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-slate-600 dark:text-gray-400">Total Targets</p>
                <p className="text-h3 font-bold text-slate-900 dark:text-gray-50">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-slate-600 dark:text-gray-400">Active/Scanning</p>
                <p className="text-h3 font-bold text-slate-900 dark:text-gray-50">{stats.active}</p>
              </div>
              <Search className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-danger-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-slate-600 dark:text-gray-400">Critical Risk</p>
                <p className="text-h3 font-bold text-slate-900 dark:text-gray-50">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger-700" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-warning-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-slate-600 dark:text-gray-400">Total Vulns</p>
                <p className="text-h3 font-bold text-slate-900 dark:text-gray-50">{stats.vulnerabilities}</p>
              </div>
              <Server className="w-8 h-8 text-warning-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Target Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investigation Entry Points */}
        <Card variant="glass" glow glowColor="primary">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Add Investigation Target
            </h2>
            <p className="text-body-sm text-slate-600 dark:text-gray-400">
              Choose your investigation starting point
            </p>
          </CardHeader>
          <CardContent>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('direct')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'direct'
                    ? 'bg-primary-800 text-blue-500 border border-primary-700'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50'
                }`}
              >
                <Server className="w-4 h-4 inline mr-2" />
                Direct Endpoint
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'company'
                    ? 'bg-primary-800 text-blue-500 border border-primary-700'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50'
                }`}
              >
                <Building className="w-4 h-4 inline mr-2" />
                Company-Wide
              </button>
            </div>

            {/* Direct Endpoint Form */}
            {activeTab === 'direct' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-medium text-gray-300 mb-2">
                    Target Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'ip', label: 'IP Address', icon: Network },
                      { value: 'domain', label: 'Domain', icon: Globe },
                      { value: 'computer', label: 'Computer', icon: Server },
                      { value: 'username', label: 'Username', icon: User }
                    ].map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, targetType: type.value })}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            formData.targetType === type.value
                              ? 'border-primary-700 bg-primary-900/20 text-blue-500'
                              : 'border-gray-600 bg-gray-800/50 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50 hover:border-gray-500'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-xs font-medium">{type.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-body-sm font-medium text-gray-300 mb-2">
                    Target Value
                  </label>
                  {formData.targetType === 'ip' && (
                    <IPInput
                      placeholder="192.168.1.100"
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      onValidate={(isValid, ip) => console.log('IP validation:', isValid, ip)}
                    />
                  )}
                  {formData.targetType === 'domain' && (
                    <DomainInput
                      placeholder="example.com"
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      onValidate={(isValid, domain) => console.log('Domain validation:', isValid, domain)}
                    />
                  )}
                  {(formData.targetType === 'computer' || formData.targetType === 'username') && (
                    <Input
                      placeholder={formData.targetType === 'computer' ? 'DESKTOP-ABC123' : 'john.doe'}
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      variant="cyber"
                    />
                  )}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  glow
                  onClick={handleAddTarget}
                  disabled={!formData.target}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Investigation
                </Button>
              </div>
            )}

            {/* Company-Wide Form */}
            {activeTab === 'company' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-medium text-gray-300 mb-2">
                    Company Discovery Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'name', label: 'Company Name', icon: Building },
                      { value: 'domain', label: 'Domain', icon: Globe },
                      { value: 'range', label: 'IP Range', icon: Network }
                    ].map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, companyType: type.value })}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            formData.companyType === type.value
                              ? 'border-primary-700 bg-primary-900/20 text-blue-500'
                              : 'border-gray-600 bg-gray-800/50 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-gray-50 hover:border-gray-500'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-xs font-medium">{type.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-body-sm font-medium text-gray-300 mb-2">
                    Company Information
                  </label>
                  {formData.companyType === 'name' && (
                    <Input
                      placeholder="Acme Corporation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      variant="cyber"
                    />
                  )}
                  {formData.companyType === 'domain' && (
                    <DomainInput
                      placeholder="acme.com"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      onValidate={(isValid, domain) => console.log('Domain validation:', isValid, domain)}
                    />
                  )}
                  {formData.companyType === 'range' && (
                    <Input
                      placeholder="192.168.0.0/24"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      variant="cyber"
                    />
                  )}
                </div>

                <div className="bg-warning-900/20 border border-warning-700/50 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-warning-300">Company-Wide Investigation</p>
                      <p className="text-xs text-warning-400 mt-1">
                        This will perform network enumeration and may take 10-30 minutes to complete.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="matrix"
                  size="lg"
                  glow
                  onClick={handleAddTarget}
                  disabled={!formData.company}
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start Company Discovery
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investigation Tips */}
        <Card variant="solid">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Investigation Guidelines
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-body font-medium text-gray-300 mb-2">Direct Endpoint Investigation</h3>
                <ul className="text-body-sm text-slate-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>IP Address:</strong> Direct system scanning and enumeration</li>
                  <li>• <strong>Domain:</strong> DNS resolution and service discovery</li>
                  <li>• <strong>Computer:</strong> NetBIOS and SMB enumeration</li>
                  <li>• <strong>Username:</strong> Account activity and privilege analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="text-body font-medium text-gray-300 mb-2">Company-Wide Investigation</h3>
                <ul className="text-body-sm text-slate-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Company Name:</strong> OSINT and public record analysis</li>
                  <li>• <strong>Domain:</strong> Subdomain enumeration and DNS walking</li>
                  <li>• <strong>IP Range:</strong> Network scanning and host discovery</li>
                </ul>
              </div>

              <div className="bg-primary-900/20 border border-primary-700/50 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-500">Defensive Security Focus</p>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                      All investigations are designed for authorized penetration testing and security assessment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Targets Table */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Current Targets
            </h2>
            <div className="flex items-center space-x-2">
              <SearchInput 
                placeholder="Search targets..."
                onSearch={(value) => console.log('Search targets:', value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead>Last Scanned</TableHead>
                <TableHead>OS</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTargets.map((target) => {
                const IconComponent = getTargetIcon(target.type)
                return (
                  <TableRow key={target.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 text-slate-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-gray-50">{target.name}</p>
                          <p className="text-xs text-slate-600 dark:text-gray-400 font-mono">{target.value}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" size="sm">
                        {target.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={target.status} />
                    </TableCell>
                    <TableCell>
                      <ThreatBadge level={target.riskLevel} />
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono font-bold ${
                        target.vulnerabilities > 5 ? 'text-danger-400' :
                        target.vulnerabilities > 2 ? 'text-warning-400' :
                        'text-slate-600 dark:text-gray-400'
                      }`}>
                        {target.vulnerabilities}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-gray-400 text-xs">
                      {target.lastScanned}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-gray-400 text-xs">
                      {target.os || '-'}
                    </TableCell>
                    <TableCell>
                      <ActionCell
                        onView={() => console.log('View target:', target.id)}
                        actions={[
                          {
                            icon: <Search className="w-4 h-4" />,
                            label: 'Start Scan',
                            onClick: () => console.log('Start scan:', target.id),
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

export default Targets