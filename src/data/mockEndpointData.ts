// Enhanced Mock Endpoint Data Generator
// Generates realistic endpoint data for multiple companies

export interface Device {
  device_id: string
  device_type: 'workstation' | 'server' | 'router' | 'switch' | 'iot'
  hostname: string
  ip_address: string
  mac_address: string
  operating_system: {
    name: string
    version: string
    icon: string
  }
  risk_level: 'critical' | 'high' | 'medium' | 'low' | 'none'
  risk_score: number
  last_activity: string
  users: Array<{
    username: string
    last_login: string
  }>
  open_ports: number[]
  suspicious_indicators: Array<{
    type: string
    description: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    timestamp: string
  }>
  metadata: {
    discovered_at: string
    scan_method: string
    company: string
  }
}

// Company configurations
const COMPANIES = [
  'Wide World Importers',
  'Contoso Ltd',
  'Fabrikam Inc',
  'Northwind Traders',
  'Adventure Works'
]

// MAC address vendor prefixes (OUI)
const MAC_VENDORS = [
  '00:11:22', // Dell
  '00:50:56', // VMware
  'AC:DE:48', // HP
  '00:1B:63', // Cisco
  '3C:07:54', // Apple
  '00:15:5D', // Microsoft
  '52:54:00', // Intel
  '00:0C:29', // VMware
  '08:00:27', // Oracle VirtualBox
]

// Common usernames
const FIRST_NAMES = ['john', 'jane', 'michael', 'sarah', 'david', 'emily', 'robert', 'jennifer', 'william', 'amanda', 'james', 'lisa', 'richard', 'mary', 'thomas', 'patricia', 'charles', 'linda', 'daniel', 'barbara']
const LAST_NAMES = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez', 'anderson', 'taylor', 'thomas', 'moore', 'jackson', 'martin', 'lee', 'thompson', 'white', 'harris']

// Suspicious indicators templates
const SUSPICIOUS_INDICATORS = [
  { type: 'failed_login', template: (count: number) => `${count} failed login attempts detected`, severities: ['high', 'critical'] },
  { type: 'unusual_query', template: () => 'Unusual database query patterns', severities: ['medium', 'high'] },
  { type: 'c2_connection', template: () => 'Connection to known C2 domain', severities: ['critical'] },
  { type: 'unsigned_executable', template: () => 'Unsigned executable in TEMP folder', severities: ['high', 'critical'] },
  { type: 'outdated_software', template: () => 'Outdated browser version detected', severities: ['medium', 'low'] },
  { type: 'port_scan', template: () => 'Port scan activity detected', severities: ['high'] },
  { type: 'privilege_escalation', template: () => 'Privilege escalation attempt', severities: ['critical', 'high'] },
  { type: 'unusual_traffic', template: () => 'Unusual outbound traffic volume', severities: ['medium', 'high'] },
  { type: 'after_hours', template: () => 'Login detected outside business hours', severities: ['medium', 'low'] },
  { type: 'malware_signature', template: () => 'Known malware signature detected', severities: ['critical'] },
  { type: 'dns_tunneling', template: () => 'Possible DNS tunneling detected', severities: ['high'] },
  { type: 'lateral_movement', template: () => 'Lateral movement indicators found', severities: ['critical', 'high'] },
]

// Operating systems with realistic distributions
const OPERATING_SYSTEMS = {
  windows: [
    { name: 'Windows 11', version: '10.0.22000', weight: 20 },
    { name: 'Windows 10 Pro', version: '10.0.19044', weight: 25 },
    { name: 'Windows 10 Enterprise', version: '10.0.19045', weight: 10 },
    { name: 'Windows 7', version: '6.1.7601', weight: 5 },
    { name: 'Windows Server 2022', version: '10.0.20348', weight: 15 },
    { name: 'Windows Server 2019', version: '10.0.17763', weight: 15 },
    { name: 'Windows Server 2016', version: '10.0.14393', weight: 10 },
  ],
  linux: [
    { name: 'Ubuntu 22.04', version: '22.04 LTS', weight: 30 },
    { name: 'Ubuntu 20.04', version: '20.04 LTS', weight: 20 },
    { name: 'CentOS 8', version: '8.5', weight: 15 },
    { name: 'RHEL 8', version: '8.7', weight: 15 },
    { name: 'Debian 11', version: '11.6', weight: 10 },
    { name: 'Fedora 37', version: '37', weight: 10 },
  ],
  macos: [
    { name: 'macOS Ventura', version: '13.2', weight: 40 },
    { name: 'macOS Monterey', version: '12.6', weight: 35 },
    { name: 'macOS Big Sur', version: '11.7', weight: 25 },
  ],
  network: [
    { name: 'Cisco IOS', version: '15.2', weight: 40 },
    { name: 'Cisco IOS-XE', version: '17.3', weight: 30 },
    { name: 'Juniper Junos', version: '21.2', weight: 20 },
    { name: 'Aruba ArubaOS', version: '8.10', weight: 10 },
  ],
  other: [
    { name: 'FreeBSD', version: '13.1', weight: 30 },
    { name: 'ESXi', version: '7.0', weight: 40 },
    { name: 'Raspberry Pi OS', version: '11', weight: 30 },
  ]
}

// Utility functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

function weightedChoice<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of items) {
    random -= item.weight
    if (random <= 0) return item
  }

  return items[0]
}

function generateMACAddress(): string {
  const vendor = randomChoice(MAC_VENDORS)
  const random = Array.from({ length: 3 }, () =>
    randomInt(0, 255).toString(16).padStart(2, '0')
  ).join(':')
  return `${vendor}:${random}`.toUpperCase()
}

function generateIPAddress(subnet: string, octet: number): string {
  return `${subnet}.${octet}`
}

function generateUsername(): string {
  const pattern = randomInt(0, 2)
  const first = randomChoice(FIRST_NAMES)
  const last = randomChoice(LAST_NAMES)

  switch (pattern) {
    case 0: return `${first}.${last}`
    case 1: return `${first}${last}`
    case 2: return `${first[0]}${last}`
    default: return first
  }
}

function generateServiceAccount(): string {
  const types = ['admin', 'svc-backup', 'svc-sql', 'sql_agent', 'dbadmin', 'svc-monitor', 'root', 'administrator']
  return randomChoice(types)
}

function generateTimestamp(hoursAgo: number): string {
  const now = new Date()
  const past = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
  return past.toISOString()
}

function generateLastActivity(): string {
  const rand = Math.random()

  if (rand < 0.40) {
    // Recent (0-24h)
    return generateTimestamp(randomInt(0, 24))
  } else if (rand < 0.75) {
    // Active (1-7d)
    return generateTimestamp(randomInt(24, 168))
  } else if (rand < 0.95) {
    // Stale (7-30d)
    return generateTimestamp(randomInt(168, 720))
  } else {
    // Dormant (30d+)
    return generateTimestamp(randomInt(720, 2160))
  }
}

function generateOpenPorts(deviceType: string): number[] {
  const commonPorts = [80, 443, 22, 3389, 445, 139, 135, 21, 23, 25, 53, 110, 143, 3306, 5432, 1433, 27017, 6379, 8080, 8443]

  let count: number
  let ports: number[] = []

  if (deviceType === 'server') {
    count = randomInt(5, 15)
    // Servers have more common service ports
    const serverPorts = [80, 443, 22, 3389, 445, 1433, 3306, 5432, 27017, 6379, 8080, 8443, 9200, 5672, 11211]
    ports = serverPorts.slice(0, count)
  } else if (deviceType === 'workstation') {
    count = randomInt(1, 5)
    const workstationPorts = [135, 139, 445, 3389, 5357]
    ports = workstationPorts.slice(0, count)
  } else if (deviceType === 'router' || deviceType === 'switch') {
    ports = [22, 23, 80, 443, 161, 162]
  } else {
    count = randomInt(1, 3)
    ports = commonPorts.slice(0, count)
  }

  // Add some random high ports
  if (Math.random() > 0.5) {
    ports.push(randomInt(1024, 65535))
  }

  return [...new Set(ports)].sort((a, b) => a - b)
}

function generateSuspiciousIndicators(riskLevel: string): Array<{
  type: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
}> {
  if (riskLevel === 'none') return []

  const counts = {
    critical: randomInt(3, 6),
    high: randomInt(2, 4),
    medium: randomInt(1, 3),
    low: randomInt(0, 2),
  }

  const count = counts[riskLevel as keyof typeof counts] || 0
  const indicators: Array<any> = []

  for (let i = 0; i < count; i++) {
    const template = randomChoice(SUSPICIOUS_INDICATORS)
    const severity = randomChoice(template.severities) as 'critical' | 'high' | 'medium' | 'low'

    indicators.push({
      type: template.type,
      description: template.type === 'failed_login'
        ? template.template(randomInt(5, 100))
        : typeof template.template === 'function' ? template.template(0) : String(template.template),
      severity,
      timestamp: generateTimestamp(randomInt(1, 48))
    })
  }

  return indicators
}

function generateRiskLevel(): 'critical' | 'high' | 'medium' | 'low' | 'none' {
  const rand = Math.random()

  if (rand < 0.05) return 'critical'
  if (rand < 0.20) return 'high'
  if (rand < 0.50) return 'medium'
  if (rand < 0.90) return 'low'
  return 'none'
}

function getRiskScore(riskLevel: string): number {
  const ranges = {
    critical: [90, 100],
    high: [70, 89],
    medium: [40, 69],
    low: [10, 39],
    none: [0, 9],
  }

  const [min, max] = ranges[riskLevel as keyof typeof ranges] || [0, 100]
  return randomInt(min, max)
}

function selectOS(deviceType: string): { name: string; version: string; icon: string } {
  let osCategory: string

  if (deviceType === 'router' || deviceType === 'switch') {
    osCategory = 'network'
  } else if (deviceType === 'iot') {
    osCategory = 'other'
  } else {
    const rand = Math.random()
    if (rand < 0.60) osCategory = 'windows'
    else if (rand < 0.85) osCategory = 'linux'
    else if (rand < 0.93) osCategory = 'macos'
    else osCategory = 'other'
  }

  const osList = OPERATING_SYSTEMS[osCategory as keyof typeof OPERATING_SYSTEMS]
  const selected = weightedChoice(osList)

  const icon = osCategory === 'windows' ? 'windows'
    : osCategory === 'linux' ? 'linux'
    : osCategory === 'macos' ? 'apple'
    : osCategory === 'network' ? 'router'
    : 'server'

  return {
    name: selected.name,
    version: selected.version,
    icon
  }
}

function generateUsers(deviceType: string): Array<{ username: string; last_login: string }> {
  if (deviceType === 'router' || deviceType === 'switch') {
    return [{ username: 'admin', last_login: generateTimestamp(randomInt(1, 168)) }]
  }

  if (deviceType === 'server') {
    return [
      { username: generateServiceAccount(), last_login: generateTimestamp(randomInt(1, 24)) }
    ]
  }

  if (deviceType === 'iot') {
    return [{ username: 'root', last_login: generateTimestamp(randomInt(24, 720)) }]
  }

  // Workstation
  const userCount = randomInt(1, 3)
  return Array.from({ length: userCount }, () => ({
    username: generateUsername(),
    last_login: generateTimestamp(randomInt(1, 48))
  }))
}

function generateDeviceType(): 'workstation' | 'server' | 'router' | 'switch' | 'iot' {
  const rand = Math.random()

  if (rand < 0.60) return 'workstation'
  if (rand < 0.85) return 'server'
  if (rand < 0.92) return 'router'
  if (rand < 0.95) return 'switch'
  return 'iot'
}

function generateHostname(company: string, deviceType: string, index: number): string {
  const companyPrefix = company.split(' ')[0].toUpperCase()

  const typeMap: Record<string, string> = {
    workstation: 'WKS',
    server: 'SRV',
    router: 'RTR',
    switch: 'SW',
    iot: 'IOT',
  }

  const typeCode = typeMap[deviceType] || 'DEV'

  if (deviceType === 'server') {
    const serverTypes = ['DB', 'WEB', 'APP', 'FILE', 'DC', 'MAIL', 'DNS', 'DHCP']
    return `${companyPrefix}-${typeCode}-${randomChoice(serverTypes)}${String(index).padStart(2, '0')}`
  }

  return `${companyPrefix}-${typeCode}-${String(index).padStart(3, '0')}`
}

function assignSubnet(deviceType: string, companyIndex: number): string {
  const baseNetwork = `192.168.${companyIndex * 10}`

  if (deviceType === 'server') {
    return `${baseNetwork}`
  } else if (deviceType === 'workstation') {
    return `192.168.${companyIndex * 10 + 1}`
  } else if (deviceType === 'router' || deviceType === 'switch') {
    return '10.0.0'
  } else {
    return `192.168.${companyIndex * 10 + 5}`
  }
}

// Main generator function
export function generateEndpointsForCompany(companyName: string): Device[] {
  const companyIndex = COMPANIES.indexOf(companyName)
  if (companyIndex === -1) {
    throw new Error(`Unknown company: ${companyName}`)
  }

  const deviceCount = randomInt(50, 200)
  const devices: Device[] = []
  const usedIPs = new Set<string>()
  const usedMACs = new Set<string>()

  for (let i = 0; i < deviceCount; i++) {
    const deviceType = generateDeviceType()
    const subnet = assignSubnet(deviceType, companyIndex)

    // Generate unique IP
    let ip: string
    do {
      ip = generateIPAddress(subnet, randomInt(1, 254))
    } while (usedIPs.has(ip))
    usedIPs.add(ip)

    // Generate unique MAC
    let mac: string
    do {
      mac = generateMACAddress()
    } while (usedMACs.has(mac))
    usedMACs.add(mac)

    const riskLevel = generateRiskLevel()
    const lastActivity = generateLastActivity()

    const device: Device = {
      device_id: `${companyName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      device_type: deviceType,
      hostname: generateHostname(companyName, deviceType, i + 1),
      ip_address: ip,
      mac_address: mac,
      operating_system: selectOS(deviceType),
      risk_level: riskLevel,
      risk_score: getRiskScore(riskLevel),
      last_activity: lastActivity,
      users: generateUsers(deviceType),
      open_ports: generateOpenPorts(deviceType),
      suspicious_indicators: generateSuspiciousIndicators(riskLevel),
      metadata: {
        discovered_at: generateTimestamp(randomInt(1, 720)),
        scan_method: randomChoice(['network_scan', 'active_directory', 'dhcp_logs', 'arp_cache', 'switch_cam']),
        company: companyName
      }
    }

    devices.push(device)
  }

  return devices
}

// Generate all companies' data
export function generateAllCompaniesData(): Record<string, Device[]> {
  const allData: Record<string, Device[]> = {}

  for (const company of COMPANIES) {
    allData[company] = generateEndpointsForCompany(company)
  }

  return allData
}

// Export companies list
export { COMPANIES }
export const companies = COMPANIES

// Generate and cache data on module load
const cachedData = generateAllCompaniesData()

export function getCompanyData(companyName: string): Device[] {
  return cachedData[companyName] || []
}

export function getAllCompanies(): string[] {
  return COMPANIES
}
