import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid' | 'bordered'
  glow?: boolean
  glowColor?: 'primary' | 'matrix' | 'danger' | 'warning'
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = false, glowColor = 'primary', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl transition-all duration-300',
          
          // Variant styles
          {
            // Default - Modern glass
            'backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-slate-200/50 dark:border-gray-700/50 hover:border-slate-300/60 dark:hover:border-gray-600/60 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-glass hover:shadow-glass-lg transition-all duration-300': variant === 'default',
            
            // Glass - Enhanced glass morphism
            'backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-slate-200/50 dark:border-gray-700/50 hover:border-blue-300/40 dark:hover:border-blue-600/40 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-glass hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300': variant === 'glass',
            
            // Solid - Clean white
            'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 shadow-glass hover:shadow-glass-lg transition-all duration-300': variant === 'solid',
            
            // Bordered - Minimal with emphasis
            'bg-white/50 dark:bg-gray-800/50 border-2 border-slate-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-blue-500': variant === 'bordered',
          },
          
          // Border colors for bordered variant
          variant === 'bordered' && {
            'border-primary-700': glowColor === 'primary',
            'border-cyber-matrix': glowColor === 'matrix',
            'border-danger-700': glowColor === 'danger',
            'border-warning-700': glowColor === 'warning',
          },
          
          // Glow effects
          glow && {
            'shadow-glow-blue hover:shadow-glow-blue-lg': glowColor === 'primary',
            'shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]': glowColor === 'matrix',
            'shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]': glowColor === 'danger',
            'shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]': glowColor === 'warning',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pb-3', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component  
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-3 border-t border-gray-700/50', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Specialized Security Card Components

// Metric Card for dashboard statistics
export interface MetricCardProps extends Omit<CardProps, 'children'> {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, subtitle, icon, trend, variant = 'glass', glow = false, glowColor = 'primary', className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant={variant}
        glow={glow}
        glowColor={glowColor}
        className={cn('p-6', className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-sm font-medium text-slate-600 dark:text-gray-400">{title}</p>
            <p className="text-h3 font-bold text-slate-900 dark:text-gray-50 mt-1">{value}</p>
          </div>
          {icon && (
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
              {
                'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25': glowColor === 'primary',
                'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-slate-500/25': glowColor === 'matrix',
                'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/25': glowColor === 'danger',
                'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/25': glowColor === 'warning',
              }
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {(subtitle || trend) && (
          <div className="flex items-center justify-between mt-4">
            {subtitle && (
              <span className="text-xs text-slate-500">{subtitle}</span>
            )}
            {trend && (
              <div className={cn(
                'flex items-center text-xs font-medium',
                trend.positive ? 'text-green-600' : 'text-red-600'
              )}>
                <span>{trend.value}</span>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }
)

MetricCard.displayName = 'MetricCard'

// Alert Card for security notifications
export interface AlertCardProps extends Omit<CardProps, 'children'> {
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp?: string
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({ severity, title, description, timestamp, className, ...props }, ref) => {
    const severityConfig = {
      low: { border: 'border-l-4 border-threat-low', bg: 'bg-yellow-500/5' },
      medium: { border: 'border-l-4 border-threat-medium', bg: 'bg-orange-500/5' },
      high: { border: 'border-l-4 border-threat-high', bg: 'bg-red-500/5' },
      critical: { border: 'border-l-4 border-threat-critical', bg: 'bg-red-600/10' },
    }
    
    const config = severityConfig[severity]
    
    return (
      <Card
        ref={ref}
        variant="glass"
        className={cn('p-4', config.border, config.bg, className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-body font-medium text-gray-50">{title}</h3>
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded',
                {
                  'bg-threat-low text-gray-900': severity === 'low',
                  'bg-threat-medium text-gray-900': severity === 'medium', 
                  'bg-threat-high text-gray-50': severity === 'high',
                  'bg-threat-critical text-gray-50': severity === 'critical',
                }
              )}>
                {severity.toUpperCase()}
              </span>
            </div>
            <p className="text-body-sm text-gray-400 mt-2">{description}</p>
            {timestamp && (
              <p className="text-xs text-gray-500 mt-3">{timestamp}</p>
            )}
          </div>
        </div>
      </Card>
    )
  }
)

AlertCard.displayName = 'AlertCard'

export { Card, CardHeader, CardContent, CardFooter, MetricCard, AlertCard }