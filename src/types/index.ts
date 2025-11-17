// Core types for the cyber reconnaissance tool

export interface Target {
  id: string
  name: string
  ipAddress: string
  domain?: string
  os?: string
  status: 'active' | 'inactive' | 'scanning' | 'error'
  lastScan?: Date
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface Scan {
  id: string
  targetId: string
  type: 'port' | 'vulnerability' | 'network' | 'service'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime: Date
  endTime?: Date
  results?: ScanResult[]
}

export interface ScanResult {
  id: string
  scanId: string
  port?: number
  service?: string
  version?: string
  vulnerability?: Vulnerability
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export interface Vulnerability {
  id: string
  cveId?: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  cvssScore?: number
  affectedSystems: string[]
  remediation: string
  discoveredAt: Date
}

export interface ActivityLog {
  id: string
  timestamp: Date
  action: string
  target?: string
  user: string
  status: 'success' | 'error' | 'warning' | 'info'
}

export interface SecurityMetrics {
  totalTargets: number
  activeScans: number
  criticalVulnerabilities: number
  securityScore: number
  trendsData: {
    vulnerabilities: number[]
    scans: number[]
    targets: number[]
  }
}

// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  glow?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
  glow?: boolean
}

// Threat levels for security context
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical'
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed'
export type TargetStatus = 'active' | 'inactive' | 'scanning' | 'error'