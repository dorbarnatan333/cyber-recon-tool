import React from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Search, AlertCircle, CheckCircle2 } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'cyber'
  validation?: 'none' | 'error' | 'success' | 'warning'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    success, 
    helperText, 
    startIcon, 
    endIcon, 
    variant = 'default', 
    validation = 'none',
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    // Determine validation state
    const validationState = error ? 'error' : success ? 'success' : validation

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {startIcon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              // Base styles
              'w-full rounded-lg transition-all duration-200 placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950',
              
              // Size and spacing
              'px-4 py-3 text-sm',
              startIcon && 'pl-10',
              (endIcon || isPassword) && 'pr-10',
              
              // Variant styles
              {
                // Default - dark with border
                'bg-gray-800 border border-gray-700 text-gray-50 focus:border-primary-600 focus:ring-primary-800': variant === 'default',
                
                // Filled - darker background
                'bg-gray-900 border border-gray-800 text-gray-50 focus:border-primary-600 focus:ring-primary-800': variant === 'filled',
                
                // Cyber - matrix themed
                'bg-gray-950 border border-cyber-matrix/30 text-cyber-matrix placeholder:text-cyber-matrix/50 font-mono focus:border-cyber-matrix focus:ring-cyber-matrix/20 focus:shadow-glow': variant === 'cyber',
              },
              
              // Validation states
              {
                'border-danger-600 focus:border-danger-500 focus:ring-danger-800': validationState === 'error',
                'border-success-600 focus:border-success-500 focus:ring-success-800': validationState === 'success',
                'border-warning-600 focus:border-warning-500 focus:ring-warning-800': validationState === 'warning',
              },
              
              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed',
              
              className
            )}
            disabled={disabled}
            {...props}
          />
          
          {/* End Icon / Password Toggle */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            ) : endIcon ? (
              <div className="text-gray-400">
                {endIcon}
              </div>
            ) : validationState === 'error' ? (
              <AlertCircle className="w-4 h-4 text-danger-500" />
            ) : validationState === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-success-500" />
            ) : null}
          </div>
        </div>
        
        {/* Helper Text */}
        {(error || success || helperText) && (
          <div className="text-xs">
            {error && (
              <span className="text-danger-400 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {error}
              </span>
            )}
            {success && !error && (
              <span className="text-success-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {success}
              </span>
            )}
            {helperText && !error && !success && (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'startIcon' | 'type'> {
  onSearch?: (value: string) => void
  clearable?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, clearable = true, className, ...props }, ref) => {
    const [value, setValue] = React.useState('')
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onSearch?.(newValue)
    }
    
    const handleClear = () => {
      setValue('')
      onSearch?.('')
    }
    
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        startIcon={<Search className="w-4 h-4" />}
        endIcon={clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        )}
        placeholder="Search..."
        className={className}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

// IP Address Input with validation
export interface IPInputProps extends Omit<InputProps, 'type'> {
  onValidate?: (isValid: boolean, ip: string) => void
}

const IPInput = React.forwardRef<HTMLInputElement, IPInputProps>(
  ({ onValidate, onChange, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    
    const validateIP = (ip: string): boolean => {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      return ipRegex.test(ip)
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const valid = value === '' ? null : validateIP(value)
      setIsValid(valid)
      onValidate?.(valid === true, value)
      onChange?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="text"
        variant="cyber"
        placeholder="192.168.1.100"
        validation={isValid === null ? 'none' : isValid ? 'success' : 'error'}
        error={isValid === false ? 'Invalid IP address format' : undefined}
        success={isValid === true ? 'Valid IP address' : undefined}
        helperText="Enter IPv4 address (e.g., 192.168.1.1)"
        onChange={handleChange}
        {...props}
      />
    )
  }
)

IPInput.displayName = 'IPInput'

// Domain Input with validation
export interface DomainInputProps extends Omit<InputProps, 'type'> {
  onValidate?: (isValid: boolean, domain: string) => void
}

const DomainInput = React.forwardRef<HTMLInputElement, DomainInputProps>(
  ({ onValidate, onChange, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    
    const validateDomain = (domain: string): boolean => {
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      return domainRegex.test(domain)
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const valid = value === '' ? null : validateDomain(value)
      setIsValid(valid)
      onValidate?.(valid === true, value)
      onChange?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="text"
        variant="cyber"
        placeholder="example.com"
        validation={isValid === null ? 'none' : isValid ? 'success' : 'error'}
        error={isValid === false ? 'Invalid domain format' : undefined}
        success={isValid === true ? 'Valid domain' : undefined}
        helperText="Enter domain name (e.g., example.com)"
        onChange={handleChange}
        {...props}
      />
    )
  }
)

DomainInput.displayName = 'DomainInput'

// Port Range Input
export interface PortInputProps extends Omit<InputProps, 'type'> {
  onValidate?: (isValid: boolean, ports: string) => void
  allowRange?: boolean
}

const PortInput = React.forwardRef<HTMLInputElement, PortInputProps>(
  ({ onValidate, allowRange = true, onChange, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    
    const validatePorts = (ports: string): boolean => {
      if (!ports) return true
      
      // Single port: 1-65535
      const singlePortRegex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      
      // Port range: 80-443
      const rangeRegex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])-([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      
      // Port list: 80,443,8080
      const listRegex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])(,([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))*$/
      
      if (singlePortRegex.test(ports)) return true
      if (allowRange && rangeRegex.test(ports)) {
        const [start, end] = ports.split('-').map(Number)
        return start < end
      }
      if (allowRange && listRegex.test(ports)) return true
      
      return false
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const valid = value === '' ? null : validatePorts(value)
      setIsValid(valid)
      onValidate?.(valid === true, value)
      onChange?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="text"
        variant="cyber"
        placeholder={allowRange ? "80,443,8080 or 1000-2000" : "80"}
        validation={isValid === null ? 'none' : isValid ? 'success' : 'error'}
        error={isValid === false ? 'Invalid port format' : undefined}
        success={isValid === true ? 'Valid port specification' : undefined}
        helperText={allowRange ? "Single port, range (80-443), or list (80,443,8080)" : "Port number (1-65535)"}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

PortInput.displayName = 'PortInput'

export { Input, SearchInput, IPInput, DomainInput, PortInput }