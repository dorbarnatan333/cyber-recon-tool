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
          
          // Size variants - Enhanced spacing
          {
            'px-2.5 py-1 text-xs': size === 'sm',
            'px-3.5 py-1.5 text-sm': size === 'md',
            'px-4 py-2 text-base': size === 'lg',
          },
          
          // Variant styles
          {
            // Default - Modern glass
            'backdrop-blur-lg bg-slate-100/80 text-slate-700 border-slate-200/60': variant === 'default',
            
            // Primary - Blue theme
            'backdrop-blur-lg bg-blue-100/80 text-blue-800 border-blue-200/60': variant === 'primary',
            
            // Secondary - Neutral glass
            'backdrop-blur-lg bg-white/60 text-slate-600 border-slate-200/50': variant === 'secondary',
            
            // Success - Green glass
            'backdrop-blur-lg bg-green-100/80 text-green-800 border-green-200/60': variant === 'success',
            
            // Danger - Red glass
            'backdrop-blur-lg bg-red-100/80 text-red-800 border-red-200/60': variant === 'danger',
            
            // Warning - Amber glass
            'backdrop-blur-lg bg-amber-100/80 text-amber-800 border-amber-200/60': variant === 'warning',
            
            // Info - Cyan glass
            'backdrop-blur-lg bg-cyan-100/80 text-cyan-800 border-cyan-200/60': variant === 'info',
            
            // Matrix - Special tech effect
            'backdrop-blur-lg bg-slate-900/80 text-blue-400 border-blue-400/30 font-mono tracking-wider': variant === 'matrix',
          },
          
          // Pulse animation
          pulse && 'animate-pulse',
          
          // Glow effects
          glow && {
            'shadow-glow': variant === 'primary' || variant === 'success' || variant === 'matrix',
            'shadow-glow-danger': variant === 'danger',
            'shadow-[0_0_15px_rgba(125,94,33,0.3)]': variant === 'warning',
            'shadow-[0_0_15px_rgba(6,182,212,0.3)]': variant === 'info',
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
          // Level-specific styling - Modern glass design with dark mode
          {
            'backdrop-blur-lg bg-green-100/80 dark:bg-green-900/60 text-green-800 dark:text-green-300 border border-green-200/80 dark:border-green-700/60 font-bold text-xs tracking-wider shadow-sm': level === 'low',
            'backdrop-blur-lg bg-amber-100/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-700/60 font-bold text-xs tracking-wider shadow-sm': level === 'medium',
            'backdrop-blur-lg bg-red-100/80 dark:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200/80 dark:border-red-700/60 font-bold text-xs tracking-wider shadow-sm': level === 'high',
            'backdrop-blur-lg bg-red-200/90 dark:bg-red-800/80 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-600 font-bold text-xs tracking-wider shadow-lg': level === 'critical',
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