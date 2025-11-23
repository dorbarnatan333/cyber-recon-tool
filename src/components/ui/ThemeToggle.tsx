import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, size = 'md' }) => {
  const { theme, toggleTheme } = useTheme()
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative rounded-xl transition-all duration-200 backdrop-blur-xl border shadow-sm',
        'hover:shadow-lg hover:scale-105 active:scale-95',
        // Light mode styles
        'bg-white/80 border-slate-200/60 text-slate-700 hover:bg-white/90',
        // Dark mode styles  
        'dark:bg-gray-800/80 dark:border-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-800/90',
        sizeClasses[size],
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon className={cn('transition-all duration-200', iconSizes[size])} />
        ) : (
          <Sun className={cn('transition-all duration-200', iconSizes[size])} />
        )}
      </div>
    </button>
  )
}

export default ThemeToggle