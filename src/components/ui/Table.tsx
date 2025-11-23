import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, MoreHorizontal, ExternalLink, Copy, Trash2, CheckCircle2 } from 'lucide-react'
import { Badge, StatusBadge, ThreatBadge } from './Badge'
import { Button } from './Button'

// Base Table Components
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-xl border border-slate-200/60 backdrop-blur-xl bg-white/60">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('border-b border-slate-200/60 backdrop-blur-lg bg-white/40', className)}
      {...props}
    />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t border-slate-200/60 bg-white/30/30 font-medium', className)}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-gray-800 transition-colors hover:bg-white/30/50 data-[state=selected]:bg-primary-900/20',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}>(
  ({ className, sortable = false, sortDirection = null, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-300 [&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer hover:text-slate-900 dark:text-gray-50 transition-colors',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp 
              className={cn(
                'h-3 w-3 transition-colors',
                sortDirection === 'asc' ? 'text-cyber-matrix' : 'text-gray-600'
              )} 
            />
            <ChevronDown 
              className={cn(
                'h-3 w-3 -mt-1 transition-colors',
                sortDirection === 'desc' ? 'text-cyber-matrix' : 'text-gray-600'
              )} 
            />
          </div>
        )}
      </div>
    </th>
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-slate-900 dark:text-gray-50', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

// Action Cell Component for tables
interface ActionCellProps {
  onView?: () => void
  onCopy?: () => void
  onDelete?: () => void
  onExternal?: () => void
  actions?: Array<{
    icon: React.ReactNode
    label: string
    onClick: () => void
    variant?: 'default' | 'danger'
  }>
}

const ActionCell: React.FC<ActionCellProps> = ({ 
  onView, 
  onCopy, 
  onDelete, 
  onExternal, 
  actions = [] 
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const defaultActions = [
    ...(onView ? [{ icon: <MoreHorizontal className="w-4 h-4" />, label: 'View Details', onClick: onView }] : []),
    ...(onCopy ? [{ icon: <Copy className="w-4 h-4" />, label: 'Copy', onClick: onCopy }] : []),
    ...(onExternal ? [{ icon: <ExternalLink className="w-4 h-4" />, label: 'Open External', onClick: onExternal }] : []),
    ...(onDelete ? [{ icon: <Trash2 className="w-4 h-4" />, label: 'Delete', onClick: onDelete, variant: 'danger' as const }] : []),
    ...actions,
  ]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-slate-200/60 bg-white/30 shadow-lg">
            {defaultActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center space-x-2 px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors',
                  action.variant === 'danger' ? 'text-danger-400 hover:text-danger-300' : 'text-gray-300 hover:text-slate-900 dark:text-gray-50',
                  index === 0 && 'rounded-t-md',
                  index === defaultActions.length - 1 && 'rounded-b-md'
                )}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Specialized Security Tables

// Scan Results Table
interface ScanResult {
  port: number
  protocol: string
  service: string
  version?: string
  state: 'open' | 'closed' | 'filtered'
  risk: 'low' | 'medium' | 'high' | 'critical'
}

interface ScanResultsTableProps {
  results: ScanResult[]
  onViewDetails?: (result: ScanResult) => void
  onCopyPort?: (port: number) => void
}

const ScanResultsTable: React.FC<ScanResultsTableProps> = ({ 
  results, 
  onViewDetails, 
  onCopyPort 
}) => {
  const [sortField, setSortField] = React.useState<keyof ScanResult>('port')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (field: keyof ScanResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * direction
    }
    
    return String(aVal).localeCompare(String(bVal)) * direction
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            sortable 
            sortDirection={sortField === 'port' ? sortDirection : null}
            onSort={() => handleSort('port')}
          >
            Port
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'protocol' ? sortDirection : null}
            onSort={() => handleSort('protocol')}
          >
            Protocol
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'service' ? sortDirection : null}
            onSort={() => handleSort('service')}
          >
            Service
          </TableHead>
          <TableHead>Version</TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'state' ? sortDirection : null}
            onSort={() => handleSort('state')}
          >
            State
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'risk' ? sortDirection : null}
            onSort={() => handleSort('risk')}
          >
            Risk
          </TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedResults.map((result, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono text-cyber-matrix">
              {result.port}
            </TableCell>
            <TableCell className="font-mono">
              {result.protocol.toUpperCase()}
            </TableCell>
            <TableCell>
              {result.service}
            </TableCell>
            <TableCell className="text-slate-600 dark:text-gray-400">
              {result.version || '-'}
            </TableCell>
            <TableCell>
              <StatusBadge 
                status={result.state === 'open' ? 'active' : result.state === 'closed' ? 'inactive' : 'pending'} 
              />
            </TableCell>
            <TableCell>
              <ThreatBadge level={result.risk} />
            </TableCell>
            <TableCell>
              <ActionCell
                onView={() => onViewDetails?.(result)}
                onCopy={() => onCopyPort?.(result.port)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Vulnerability Table
interface Vulnerability {
  cveId: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  cvssScore: number
  affectedPorts: number[]
  discoveredAt: string
}

interface VulnerabilityTableProps {
  vulnerabilities: Vulnerability[]
  onViewDetails?: (vuln: Vulnerability) => void
  onMarkFixed?: (cveId: string) => void
}

const VulnerabilityTable: React.FC<VulnerabilityTableProps> = ({
  vulnerabilities,
  onViewDetails,
  onMarkFixed
}) => {
  const [sortField, setSortField] = React.useState<keyof Vulnerability>('cvssScore')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof Vulnerability) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedVulns = [...vulnerabilities].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * direction
    }
    
    return String(aVal).localeCompare(String(bVal)) * direction
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            sortable 
            sortDirection={sortField === 'cveId' ? sortDirection : null}
            onSort={() => handleSort('cveId')}
          >
            CVE ID
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'title' ? sortDirection : null}
            onSort={() => handleSort('title')}
          >
            Vulnerability
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'severity' ? sortDirection : null}
            onSort={() => handleSort('severity')}
          >
            Severity
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'cvssScore' ? sortDirection : null}
            onSort={() => handleSort('cvssScore')}
          >
            CVSS Score
          </TableHead>
          <TableHead>Affected Ports</TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'discoveredAt' ? sortDirection : null}
            onSort={() => handleSort('discoveredAt')}
          >
            Discovered
          </TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedVulns.map((vuln, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono">
              <Badge variant="info" size="sm">
                {vuln.cveId}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate" title={vuln.title}>
                {vuln.title}
              </div>
            </TableCell>
            <TableCell>
              <ThreatBadge level={vuln.severity} />
            </TableCell>
            <TableCell>
              <span className={cn(
                'font-mono font-bold',
                vuln.cvssScore >= 9 && 'text-danger-400',
                vuln.cvssScore >= 7 && vuln.cvssScore < 9 && 'text-warning-400',
                vuln.cvssScore < 7 && 'text-slate-600 dark:text-gray-400'
              )}>
                {vuln.cvssScore.toFixed(1)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {vuln.affectedPorts.slice(0, 3).map((port) => (
                  <Badge key={port} variant="secondary" size="sm">
                    {port}
                  </Badge>
                ))}
                {vuln.affectedPorts.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{vuln.affectedPorts.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-slate-600 dark:text-gray-400 text-xs">
              {vuln.discoveredAt}
            </TableCell>
            <TableCell>
              <ActionCell
                onView={() => onViewDetails?.(vuln)}
                actions={[
                  {
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    label: 'Mark as Fixed',
                    onClick: () => onMarkFixed?.(vuln.cveId),
                  }
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell,
  ActionCell,
  ScanResultsTable,
  VulnerabilityTable
}