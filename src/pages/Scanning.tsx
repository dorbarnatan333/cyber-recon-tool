import React, { useState } from 'react'
import { 
  Scan, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  Settings,
  Network,
  Shield,
  Timer
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Badge,
  StatusBadge,
  ThreatBadge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ActionCell,
  Input
} from '@/components/ui'

interface ScanJob {
  id: string
  name: string
  target: string
  type: 'port-scan' | 'vuln-scan' | 'discovery' | 'full-audit'
  status: 'running' | 'completed' | 'failed' | 'paused' | 'queued'
  progress: number
  startTime: string
  endTime?: string
  duration?: string
  findings: {
    ports: number
    vulnerabilities: number
    services: number
    risks: number
  }
  priority: 'low' | 'normal' | 'high' | 'critical'
}

interface ScanTemplate {
  id: string
  name: string
  type: 'port-scan' | 'vuln-scan' | 'discovery' | 'full-audit'
  description: string
  estimatedTime: string
  intensity: 'stealth' | 'normal' | 'aggressive'
}

const Scanning: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [targetInput, setTargetInput] = useState('')

  const mockScanJobs: ScanJob[] = [
    {
      id: 'scan-001',
      name: 'Production Server Audit',
      target: '192.168.1.100',
      type: 'full-audit',
      status: 'running',
      progress: 67,
      startTime: '2 hours ago',
      findings: { ports: 12, vulnerabilities: 3, services: 8, risks: 2 },
      priority: 'high'
    },
    {
      id: 'scan-002',
      name: 'Mail Server Port Scan',
      target: 'mail.acme.com',
      type: 'port-scan',
      status: 'completed',
      progress: 100,
      startTime: '4 hours ago',
      endTime: '3 hours ago',
      duration: '45 minutes',
      findings: { ports: 5, vulnerabilities: 1, services: 5, risks: 0 },
      priority: 'normal'
    },
    {
      id: 'scan-003',
      name: 'Network Discovery',
      target: '10.0.0.0/24',
      type: 'discovery',
      status: 'running',
      progress: 23,
      startTime: '30 minutes ago',
      findings: { ports: 45, vulnerabilities: 0, services: 18, risks: 0 },
      priority: 'normal'
    },
    {
      id: 'scan-004',
      name: 'Database Vulnerability Assessment',
      target: 'db-prod.internal',
      type: 'vuln-scan',
      status: 'failed',
      progress: 0,
      startTime: '1 day ago',
      findings: { ports: 0, vulnerabilities: 0, services: 0, risks: 0 },
      priority: 'critical'
    },
    {
      id: 'scan-005',
      name: 'Workstation Security Check',
      target: 'DESKTOP-JD123',
      type: 'port-scan',
      status: 'queued',
      progress: 0,
      startTime: 'Queued',
      findings: { ports: 0, vulnerabilities: 0, services: 0, risks: 0 },
      priority: 'low'
    }
  ]

  const scanTemplates: ScanTemplate[] = [
    {
      id: 'quick-port',
      name: 'Quick Port Scan',
      type: 'port-scan',
      description: 'Rapid scan of common ports (1-1000)',
      estimatedTime: '5-15 minutes',
      intensity: 'normal'
    },
    {
      id: 'full-port',
      name: 'Full Port Scan',
      type: 'port-scan',
      description: 'Comprehensive scan of all 65535 ports',
      estimatedTime: '30-60 minutes',
      intensity: 'aggressive'
    },
    {
      id: 'stealth-scan',
      name: 'Stealth Scan',
      type: 'port-scan',
      description: 'Low-profile scanning to avoid detection',
      estimatedTime: '20-45 minutes',
      intensity: 'stealth'
    },
    {
      id: 'vuln-assessment',
      name: 'Vulnerability Assessment',
      type: 'vuln-scan',
      description: 'Deep security analysis and CVE detection',
      estimatedTime: '1-3 hours',
      intensity: 'normal'
    },
    {
      id: 'network-discovery',
      name: 'Network Discovery',
      type: 'discovery',
      description: 'Host discovery and service enumeration',
      estimatedTime: '10-30 minutes',
      intensity: 'normal'
    },
    {
      id: 'full-audit',
      name: 'Complete Security Audit',
      type: 'full-audit',
      description: 'Comprehensive security assessment',
      estimatedTime: '2-6 hours',
      intensity: 'aggressive'
    }
  ]

  const activeScanStats = {
    running: mockScanJobs.filter(job => job.status === 'running').length,
    queued: mockScanJobs.filter(job => job.status === 'queued').length,
    completed: mockScanJobs.filter(job => job.status === 'completed').length,
    findings: mockScanJobs.reduce((sum, job) => sum + job.findings.vulnerabilities, 0)
  }

  const getScanTypeIcon = (type: string) => {
    const iconMap = {
      'port-scan': Network,
      'vuln-scan': Shield,
      'discovery': Target,
      'full-audit': AlertTriangle
    }
    return iconMap[type as keyof typeof iconMap] || Scan
  }

  const getScanTypeColor = (type: string) => {
    const colorMap = {
      'port-scan': 'text-primary-400',
      'vuln-scan': 'text-danger-400',
      'discovery': 'text-cyber-matrix',
      'full-audit': 'text-warning-400'
    }
    return colorMap[type as keyof typeof colorMap] || 'text-gray-400'
  }

  const getIntensityBadge = (intensity: string) => {
    const variants = {
      stealth: 'secondary',
      normal: 'primary',
      aggressive: 'danger'
    }
    return variants[intensity as keyof typeof variants] || 'secondary'
  }

  const formatDuration = (_startTime: string, endTime?: string) => {
    if (endTime) {
      return '45 minutes' // Mock duration calculation
    }
    return 'In progress'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading text-h2 font-semibold text-gray-50">
            Scanning Operations
          </h1>
          <p className="text-body-sm text-gray-400 mt-1">
            Monitor and manage active security scans and assessments
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Timer className="w-4 h-4" />
          <span>Last refresh: 5 seconds ago</span>
          <div className="w-2 h-2 bg-cyber-matrix rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Scanning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="solid" className="border-l-4 border-cyber-matrix">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Running Scans</p>
                <p className="text-h3 font-bold text-gray-50">{activeScanStats.running}</p>
              </div>
              <Activity className="w-8 h-8 text-cyber-matrix animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-warning-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Queued Scans</p>
                <p className="text-h3 font-bold text-gray-50">{activeScanStats.queued}</p>
              </div>
              <Clock className="w-8 h-8 text-warning-700" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-success-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">Completed Today</p>
                <p className="text-h3 font-bold text-gray-50">{activeScanStats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success-700" />
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" className="border-l-4 border-danger-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-gray-400">New Findings</p>
                <p className="text-h3 font-bold text-gray-50">{activeScanStats.findings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start Scan */}
        <Card variant="glass" glow glowColor="matrix">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-gray-50">
              Quick Start Scan
            </h2>
            <p className="text-body-sm text-gray-400">
              Launch a new security scan with predefined templates
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium text-gray-300 mb-2">
                  Target
                </label>
                <Input
                  placeholder="192.168.1.100 or domain.com"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  variant="cyber"
                />
              </div>

              <div>
                <label className="block text-body-sm font-medium text-gray-300 mb-2">
                  Scan Template
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {scanTemplates.slice(0, 3).map((template) => {
                    const Icon = getScanTypeIcon(template.type)
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                          selectedTemplate === template.id
                            ? 'border-cyber-matrix bg-cyber-matrix/10 glow-matrix'
                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${
                            selectedTemplate === template.id ? 'text-cyber-matrix' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              selectedTemplate === template.id ? 'text-cyber-matrix' : 'text-gray-50'
                            }`}>
                              {template.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">~{template.estimatedTime}</span>
                              <Badge 
                                variant={getIntensityBadge(template.intensity) as any} 
                                size="sm"
                              >
                                {template.intensity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                variant="matrix"
                size="lg"
                glow
                disabled={!targetInput || !selectedTemplate}
                className="w-full"
                onClick={() => console.log('Starting scan:', { target: targetInput, template: selectedTemplate })}
              >
                <Play className="w-4 h-4 mr-2" />
                Launch Scan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Scan Templates */}
        <Card variant="solid">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-gray-50">
              Scan Templates
            </h2>
            <p className="text-body-sm text-gray-400">
              Choose from available scanning methodologies
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanTemplates.map((template) => {
                const Icon = getScanTypeIcon(template.type)
                return (
                  <div 
                    key={template.id} 
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${getScanTypeColor(template.type)}`} />
                      <div>
                        <h3 className="text-body font-medium text-gray-50">{template.name}</h3>
                        <p className="text-xs text-gray-400">{template.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getIntensityBadge(template.intensity) as any} size="sm">
                        {template.intensity}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Scans */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-h4 font-semibold text-gray-50">
              Active Scan Jobs
            </h2>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan Job</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockScanJobs.map((job) => {
                const TypeIcon = getScanTypeIcon(job.type)
                return (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <TypeIcon className={`w-4 h-4 ${getScanTypeColor(job.type)}`} />
                        <div>
                          <p className="font-medium text-gray-50">{job.name}</p>
                          <p className="text-xs text-gray-400">{job.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-cyber-matrix">{job.target}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" size="sm">
                        {job.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status === 'running' ? 'active' : job.status === 'queued' ? 'pending' : job.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              job.status === 'running' ? 'bg-cyber-matrix animate-pulse' :
                              job.status === 'completed' ? 'bg-success-600' :
                              job.status === 'failed' ? 'bg-danger-600' :
                              'bg-gray-600'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 w-10">{job.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {job.findings.vulnerabilities > 0 && (
                          <span className="text-xs bg-danger-900/50 text-danger-300 px-2 py-1 rounded">
                            {job.findings.vulnerabilities}V
                          </span>
                        )}
                        {job.findings.ports > 0 && (
                          <span className="text-xs bg-primary-900/50 text-primary-300 px-2 py-1 rounded">
                            {job.findings.ports}P
                          </span>
                        )}
                        {job.findings.services > 0 && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {job.findings.services}S
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {job.duration || formatDuration(job.startTime, job.endTime)}
                    </TableCell>
                    <TableCell>
                      <ThreatBadge level={job.priority === 'normal' ? 'low' : job.priority as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {job.status === 'running' && (
                          <Button variant="ghost" size="sm" title="Pause">
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {job.status === 'paused' && (
                          <Button variant="ghost" size="sm" title="Resume">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <ActionCell
                          onView={() => console.log('View scan details:', job.id)}
                          actions={[
                            {
                              icon: <Square className="w-4 h-4" />,
                              label: job.status === 'running' ? 'Stop Scan' : 'Restart Scan',
                              onClick: () => console.log('Toggle scan:', job.id),
                              variant: job.status === 'running' ? 'danger' : undefined
                            }
                          ]}
                        />
                      </div>
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

export default Scanning