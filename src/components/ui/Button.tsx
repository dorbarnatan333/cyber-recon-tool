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
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0',
          
          // Size variants
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // Variant styles
          {
            // Primary - Modern blue gradient
            'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-500/50 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-glow-blue rounded-xl backdrop-blur-sm': variant === 'primary',
            
            // Secondary - Glass effect
            'backdrop-blur-xl bg-white/70 dark:bg-gray-700/70 text-slate-700 dark:text-gray-300 border border-slate-200/50 hover:bg-white/90 hover:text-slate-900 hover:border-slate-300/60 hover:-translate-y-0.5 hover:shadow-glass-lg rounded-xl': variant === 'secondary',
            
            // Danger - Modern red gradient
            'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-500/50 hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] rounded-xl': variant === 'danger',
            
            // Ghost - Minimal hover
            'text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:backdrop-blur-xl rounded-xl': variant === 'ghost',
            
            // Matrix - Keeping matrix theme for legacy
            'backdrop-blur-xl bg-slate-900/80 text-blue-400 border border-blue-400/30 hover:bg-slate-800/90 hover:border-blue-400/50 rounded-xl font-mono text-sm tracking-wider': variant === 'matrix',
          },
          
          // Glow effects
          {
            'shadow-glow-blue hover:shadow-glow-blue-lg': glow && variant === 'primary',
            'shadow-glass hover:shadow-glass-lg': glow && variant === 'secondary',
            'shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]': glow && variant === 'danger',
            'shadow-glow-blue hover:shadow-glow-blue-lg animate-pulse-slow': glow && variant === 'matrix',
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