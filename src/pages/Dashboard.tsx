import React from 'react'
import { Shield, Target, AlertTriangle, Activity, Clock, Scan, Plus } from 'lucide-react'
import { Button, MetricCard, Card, CardHeader, CardContent, AlertCard, Badge, ThreatBadge, StatusBadge, ServiceBadge, CVEBadge, Input, SearchInput, IPInput, DomainInput, PortInput, ScanResultsTable, VulnerabilityTable } from '@/components/ui'

const Dashboard: React.FC = () => {
  // Mock data for table demonstrations
  const mockScanResults = [
    { port: 22, protocol: 'tcp', service: 'SSH', version: 'OpenSSH 8.2', state: 'open' as const, risk: 'low' as const },
    { port: 80, protocol: 'tcp', service: 'HTTP', version: 'Apache 2.4.41', state: 'open' as const, risk: 'medium' as const },
    { port: 443, protocol: 'tcp', service: 'HTTPS', version: 'Apache 2.4.41', state: 'open' as const, risk: 'low' as const },
    { port: 3306, protocol: 'tcp', service: 'MySQL', version: '8.0.25', state: 'open' as const, risk: 'high' as const },
    { port: 21, protocol: 'tcp', service: 'FTP', version: 'vsftpd 3.0.3', state: 'closed' as const, risk: 'critical' as const },
    { port: 8080, protocol: 'tcp', service: 'HTTP', state: 'filtered' as const, risk: 'medium' as const },
  ]

  const mockVulnerabilities = [
    {
      cveId: 'CVE-2023-1234',
      title: 'SQL Injection in Authentication Module',
      severity: 'critical' as const,
      cvssScore: 9.8,
      affectedPorts: [80, 443, 8080],
      discoveredAt: '2 hours ago',
    },
    {
      cveId: 'CVE-2023-5678',
      title: 'Remote Code Execution via File Upload',
      severity: 'high' as const,
      cvssScore: 8.1,
      affectedPorts: [80, 443],
      discoveredAt: '1 day ago',
    },
    {
      cveId: 'CVE-2023-9012',
      title: 'Cross-Site Scripting (XSS) Vulnerability',
      severity: 'medium' as const,
      cvssScore: 6.1,
      affectedPorts: [80, 443],
      discoveredAt: '3 days ago',
    },
    {
      cveId: 'CVE-2023-3456',
      title: 'Information Disclosure in Error Messages',
      severity: 'low' as const,
      cvssScore: 3.7,
      affectedPorts: [80],
      discoveredAt: '1 week ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading text-h2 font-semibold text-slate-900 dark:text-gray-50">
            Security Operations Center
          </h1>
          <p className="text-body-sm text-slate-600 dark:text-gray-400 mt-1">
            Real-time monitoring and threat analysis dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Targets */}
        <MetricCard
          title="Active Targets"
          value="24"
          icon={<Target className="w-6 h-6 text-blue-600" />}
          trend={{ value: "+3 this week", positive: true }}
          glowColor="primary"
          className="border-l-4 border-blue-600"
        />

        {/* Running Scans */}
        <MetricCard
          title="Active Scans"
          value="3"
          subtitle="2 port scans, 1 vuln scan"
          icon={<Activity className="w-6 h-6 text-blue-500 animate-pulse" />}
          glowColor="matrix"
          className="border-l-4 border-blue-500"
        />

        {/* Critical Vulnerabilities */}
        <MetricCard
          title="Critical Vulnerabilities"
          value="12"
          subtitle="Immediate attention required"
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          glowColor="danger"
          className="border-l-4 border-red-600"
        />

        {/* Security Score */}
        <MetricCard
          title="Security Score"
          value="78/100"
          subtitle="Moderate risk level"
          icon={<Shield className="w-6 h-6 text-amber-600" />}
          glowColor="warning"
          className="border-l-4 border-amber-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Recent Activity
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 minutes ago', action: 'Port scan completed', target: '192.168.1.100', status: 'success' },
                { time: '15 minutes ago', action: 'Vulnerability scan started', target: 'web-server-01', status: 'active' },
                { time: '1 hour ago', action: 'Critical vulnerability detected', target: 'database-prod', status: 'critical' },
                { time: '2 hours ago', action: 'New target added', target: '10.0.0.50', status: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/30 hover:backdrop-blur-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-600' :
                    activity.status === 'active' ? 'bg-blue-500 animate-pulse' :
                    activity.status === 'critical' ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-slate-900 dark:text-gray-50">{activity.action}</p>
                    <p className="text-xs text-slate-600 dark:text-gray-400 text-mono">{activity.target}</p>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Quick Actions
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button variant="primary" size="lg" glow className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Target
                </Button>
                <Button variant="matrix" size="lg" glow>
                  <Scan className="w-4 h-4 mr-2" />
                  Start Scan
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button variant="danger" size="md">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Alerts
                </Button>
                <Button variant="secondary" size="md">
                  <Shield className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts & Component Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
            Security Alerts
          </h2>
          <AlertCard
            severity="critical"
            title="SQL Injection Vulnerability"
            description="Critical vulnerability detected in authentication system. Immediate patching required."
            timestamp="2 minutes ago"
          />
          <AlertCard
            severity="high"
            title="Suspicious Network Activity"
            description="Unusual outbound connections detected from production server."
            timestamp="15 minutes ago"
          />
          <AlertCard
            severity="medium"
            title="Outdated Dependencies"
            description="Multiple packages require security updates."
            timestamp="1 hour ago"
          />
          <AlertCard
            severity="low"
            title="Certificate Expiring Soon"
            description="SSL certificate expires in 30 days."
            timestamp="2 hours ago"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
            Component Showcase
          </h2>
          
          {/* Button Showcase */}
          <Card variant="solid" glow glowColor="primary">
            <CardHeader>
              <h3 className="text-body font-medium text-slate-900 dark:text-gray-50">Buttons</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="danger" size="sm">Danger</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
                <Button variant="matrix" size="sm" glow>Matrix</Button>
                <Button variant="primary" size="sm" loading>Loading</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badge Showcase */}
          <Card variant="bordered" glowColor="matrix">
            <CardHeader>
              <h3 className="text-body font-medium text-slate-900 dark:text-gray-50">Badge System</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Threat Levels */}
                <div>
                  <h4 className="text-body-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Threat Levels:</h4>
                  <div className="flex flex-wrap gap-2">
                    <ThreatBadge level="low" />
                    <ThreatBadge level="medium" />
                    <ThreatBadge level="high" />
                    <ThreatBadge level="critical" />
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  <h4 className="text-body-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Statuses:</h4>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="active" />
                    <StatusBadge status="scanning" />
                    <StatusBadge status="completed" />
                    <StatusBadge status="failed" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="inactive" />
                  </div>
                </div>

                {/* Service Badges */}
                <div>
                  <h4 className="text-body-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    <ServiceBadge service="SSH" port={22} secure />
                    <ServiceBadge service="HTTP" port={80} />
                    <ServiceBadge service="HTTPS" port={443} secure />
                    <ServiceBadge service="MySQL" port={3306} />
                    <ServiceBadge service="FTP" port={21} />
                  </div>
                </div>

                {/* CVE Badges */}
                <div>
                  <h4 className="text-body-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Vulnerabilities:</h4>
                  <div className="flex flex-wrap gap-2">
                    <CVEBadge cveId="CVE-2023-1234" score={9.8} />
                    <CVEBadge cveId="CVE-2023-5678" score={7.2} />
                    <CVEBadge cveId="CVE-2023-9012" score={4.3} />
                    <CVEBadge cveId="CVE-2023-3456" score={2.1} />
                  </div>
                </div>

                {/* General Badges */}
                <div>
                  <h4 className="text-body-sm font-medium text-slate-600 dark:text-gray-400 mb-2">General:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="danger" glow>Danger</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="matrix" pulse>Matrix</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Forms & Input Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Target Input Forms
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SearchInput 
                label="Search Targets"
                placeholder="Search by IP, domain, or hostname..."
                onSearch={(value) => console.log('Search:', value)}
              />
              
              <IPInput 
                label="IP Address"
                onValidate={(isValid, ip) => console.log('IP Valid:', isValid, ip)}
              />
              
              <DomainInput 
                label="Domain Name"
                onValidate={(isValid, domain) => console.log('Domain Valid:', isValid, domain)}
              />
              
              <PortInput 
                label="Port Range"
                onValidate={(isValid, ports) => console.log('Ports Valid:', isValid, ports)}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Input Variants
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                label="Default Input"
                placeholder="Standard dark theme input..."
                variant="default"
              />
              
              <Input 
                label="Filled Input"
                placeholder="Filled background variant..."
                variant="filled"
              />
              
              <Input 
                label="Cyber Input"
                placeholder="Matrix-themed cyber input..."
                variant="cyber"
              />
              
              <Input 
                label="Password Input"
                placeholder="Enter password..."
                type="password"
                variant="cyber"
              />
              
              <Input 
                label="Error State"
                placeholder="Input with error..."
                error="This field is required"
                variant="default"
              />
              
              <Input 
                label="Success State"
                placeholder="Valid input..."
                success="Input validated successfully"
                variant="default"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Data Tables */}
      <div className="space-y-6">
        {/* Scan Results Table */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Port Scan Results
            </h2>
            <p className="text-body-sm text-slate-600 dark:text-gray-400 mt-1">
              Latest scan results for target 192.168.1.100
            </p>
          </CardHeader>
          <CardContent>
            <ScanResultsTable
              results={mockScanResults}
              onViewDetails={(result) => console.log('View details:', result)}
              onCopyPort={(port) => {
                navigator.clipboard?.writeText(port.toString())
                console.log('Copied port:', port)
              }}
            />
          </CardContent>
        </Card>

        {/* Vulnerability Table */}
        <Card variant="glass">
          <CardHeader>
            <h2 className="text-heading text-h4 font-semibold text-slate-900 dark:text-gray-50">
              Vulnerability Assessment
            </h2>
            <p className="text-body-sm text-slate-600 dark:text-gray-400 mt-1">
              Critical and high-priority vulnerabilities requiring attention
            </p>
          </CardHeader>
          <CardContent>
            <VulnerabilityTable
              vulnerabilities={mockVulnerabilities}
              onViewDetails={(vuln) => console.log('View vulnerability:', vuln)}
              onMarkFixed={(cveId) => console.log('Mark as fixed:', cveId)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard