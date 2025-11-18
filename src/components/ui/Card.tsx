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
            // Default - subtle dark
            'bg-gray-900/50 border border-gray-800': variant === 'default',
            
            // Glass - backdrop blur with transparency
            'glass border border-gray-700/50': variant === 'glass',
            
            // Solid - full opacity dark
            'bg-gray-900 border border-gray-700': variant === 'solid',
            
            // Bordered - transparent with prominent border
            'bg-transparent border-2': variant === 'bordered',
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
            'shadow-glow hover:shadow-[0_0_25px_rgba(11,133,176,0.3)]': glowColor === 'primary',
            'shadow-glow hover:shadow-[0_0_25px_rgba(0,255,65,0.4)]': glowColor === 'matrix',
            'shadow-glow-danger hover:shadow-[0_0_25px_rgba(225,25,0,0.3)]': glowColor === 'danger',
            'shadow-[0_0_15px_rgba(125,94,33,0.2)] hover:shadow-[0_0_25px_rgba(125,94,33,0.4)]': glowColor === 'warning',
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
            <p className="text-body-sm font-medium text-gray-400">{title}</p>
            <p className="text-h3 font-bold text-gray-50 mt-1">{value}</p>
          </div>
          {icon && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              {
                'bg-primary-900': glowColor === 'primary',
                'bg-gray-800': glowColor === 'matrix',
                'bg-danger-900': glowColor === 'danger',
                'bg-warning-900': glowColor === 'warning',
              }
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {(subtitle || trend) && (
          <div className="flex items-center justify-between mt-4">
            {subtitle && (
              <span className="text-xs text-gray-400">{subtitle}</span>
            )}
            {trend && (
              <div className={cn(
                'flex items-center text-xs',
                trend.positive ? 'text-success-800' : 'text-danger-700'
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