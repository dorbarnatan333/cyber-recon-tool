import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'matrix'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  glow?: boolean
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', pulse = false, glow = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center font-medium rounded-md transition-all duration-200 border',
          
          // Size variants
          {
            'px-2 py-1 text-xs': size === 'sm',
            'px-3 py-1.5 text-sm': size === 'md',
            'px-4 py-2 text-base': size === 'lg',
          },
          
          // Variant styles
          {
            // Default
            'bg-gray-800 text-gray-300 border-gray-700': variant === 'default',
            
            // Primary - Cyber theme
            'bg-primary-900 text-primary-300 border-primary-700': variant === 'primary',
            
            // Secondary - Neutral
            'bg-gray-700 text-gray-200 border-gray-600': variant === 'secondary',
            
            // Success - Matrix green
            'bg-success-900 text-success-300 border-success-700': variant === 'success',
            
            // Danger - Threat red
            'bg-danger-900 text-danger-300 border-danger-700': variant === 'danger',
            
            // Warning - Alert amber
            'bg-warning-900 text-warning-300 border-warning-700': variant === 'warning',
            
            // Info - Information blue
            'bg-blue-900 text-blue-300 border-blue-700': variant === 'info',
            
            // Matrix - Special cyber effect
            'bg-gray-950 text-cyber-matrix border-cyber-matrix font-mono tracking-wider': variant === 'matrix',
          },
          
          // Pulse animation
          pulse && 'animate-pulse',
          
          // Glow effects
          glow && {
            'shadow-glow': variant === 'primary' || variant === 'success' || variant === 'matrix',
            'shadow-glow-danger': variant === 'danger',
            'shadow-[0_0_15px_rgba(125,94,33,0.3)]': variant === 'warning',
            'shadow-[0_0_15px_rgba(59,130,246,0.3)]': variant === 'info',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Specialized Security Badges

// Threat Level Badge
export interface ThreatBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  level: 'low' | 'medium' | 'high' | 'critical'
}

const ThreatBadge = React.forwardRef<HTMLSpanElement, ThreatBadgeProps>(
  ({ level, glow = true, pulse, className, ...props }, ref) => {
    const variants = {
      low: 'warning',
      medium: 'warning', 
      high: 'danger',
      critical: 'danger',
    } as const
    
    return (
      <Badge
        ref={ref}
        variant={variants[level]}
        glow={glow}
        pulse={level === 'critical' ? true : pulse}
        className={cn(
          // Level-specific styling
          {
            'text-yellow-200 border-yellow-600 bg-yellow-900': level === 'low',
            'text-orange-200 border-orange-600 bg-orange-900': level === 'medium',
            'text-red-200 border-red-600 bg-red-900': level === 'high',
            'text-red-100 border-red-500 bg-red-800 font-bold': level === 'critical',
          },
          className
        )}
        {...props}
      >
        {level.toUpperCase()}
      </Badge>
    )
  }
)

ThreatBadge.displayName = 'ThreatBadge'

// Status Badge for scans, targets, etc.
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'active' | 'inactive' | 'scanning' | 'completed' | 'failed' | 'pending'
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, pulse, glow, className, ...props }, ref) => {
    const statusConfig = {
      active: { variant: 'success' as const, pulse: false, glow: true },
      inactive: { variant: 'secondary' as const, pulse: false, glow: false },
      scanning: { variant: 'matrix' as const, pulse: true, glow: true },
      completed: { variant: 'success' as const, pulse: false, glow: false },
      failed: { variant: 'danger' as const, pulse: false, glow: true },
      pending: { variant: 'warning' as const, pulse: true, glow: false },
    }
    
    const config = statusConfig[status]
    
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        pulse={pulse ?? config.pulse}
        glow={glow ?? config.glow}
        className={className}
        {...props}
      >
        {status.toUpperCase()}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

// Service Badge for ports/services
export interface ServiceBadgeProps extends Omit<BadgeProps, 'children'> {
  service: string
  port?: number
  secure?: boolean
}

const ServiceBadge = React.forwardRef<HTMLSpanElement, ServiceBadgeProps>(
  ({ service, port, secure, variant, className, ...props }, ref) => {
    const serviceVariant = secure ? 'success' : variant || 'info'
    
    return (
      <Badge
        ref={ref}
        variant={serviceVariant}
        size="sm"
        className={cn('font-mono', className)}
        {...props}
      >
        {port ? `${port}/${service}` : service}
        {secure && (
          <span className="ml-1 text-xs">🔒</span>
        )}
      </Badge>
    )
  }
)

ServiceBadge.displayName = 'ServiceBadge'

// CVE Badge for vulnerabilities
export interface CVEBadgeProps extends Omit<BadgeProps, 'children'> {
  cveId: string
  score?: number
}

const CVEBadge = React.forwardRef<HTMLSpanElement, CVEBadgeProps>(
  ({ cveId, score, className, ...props }, ref) => {
    // Determine severity by CVSS score
    let variant: BadgeProps['variant'] = 'info'
    let glow = false
    
    if (score !== undefined) {
      if (score >= 9.0) {
        variant = 'danger'
        glow = true
      } else if (score >= 7.0) {
        variant = 'danger' 
      } else if (score >= 4.0) {
        variant = 'warning'
      } else {
        variant = 'info'
      }
    }
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        glow={glow}
        size="sm"
        className={cn('font-mono', className)}
        {...props}
      >
        {cveId}
        {score && (
          <span className="ml-1 text-xs opacity-75">
            {score.toFixed(1)}
          </span>
        )}
      </Badge>
    )
  }
)

CVEBadge.displayName = 'CVEBadge'

export { Badge, ThreatBadge, StatusBadge, ServiceBadge, CVEBadge }