import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'matrix'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  glow?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, glow = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50',
          
          // Size variants
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // Variant styles
          {
            // Primary - Matrix green theme
            'bg-primary-800 text-gray-50 border border-primary-700 hover:bg-primary-700 hover:border-primary-600 rounded-md': variant === 'primary',
            
            // Secondary - Dark glass
            'bg-gray-800 text-gray-50 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 rounded-md': variant === 'secondary',
            
            // Danger - Threat red
            'bg-danger-800 text-gray-50 border border-danger-700 hover:bg-danger-700 hover:border-danger-600 rounded-md': variant === 'danger',
            
            // Ghost - Transparent
            'text-gray-300 hover:text-gray-50 hover:bg-gray-800 rounded-md': variant === 'ghost',
            
            // Matrix - Special cyber effect
            'bg-gray-900 text-cyber-matrix border border-cyber-matrix hover:bg-gray-800 rounded-md font-mono text-sm tracking-wider': variant === 'matrix',
          },
          
          // Glow effects
          {
            'shadow-glow hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]': glow && variant === 'primary',
            'shadow-glow-cyan hover:shadow-[0_0_30px_rgba(15,240,252,0.4)]': glow && variant === 'secondary',
            'shadow-glow-danger hover:shadow-[0_0_30px_rgba(225,25,0,0.4)]': glow && variant === 'danger',
            'shadow-glow hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] animate-pulse-slow': glow && variant === 'matrix',
          },
          
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className={cn(
            'animate-spin',
            {
              'mr-2 h-3 w-3': size === 'sm',
              'mr-2 h-4 w-4': size === 'md', 
              'mr-2 h-5 w-5': size === 'lg',
            }
          )} />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }