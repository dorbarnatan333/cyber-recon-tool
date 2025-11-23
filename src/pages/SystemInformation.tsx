import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Network, HardDrive, Shield, Monitor, Building, FileText, Settings, Database, Info, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock, User, MapPin, Activity, Download, Save, Cog, Wifi, Globe, TrendingUp, BarChart3 } from 'lucide-react'
import { Button, Card, CardHeader, CardContent, Badge, ThreatBadge } from '@/components/ui'
import StickyHeader, { BreadcrumbItem, SystemInfo } from '@/components/StickyHeader'
import { cn } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data types based on PRD
interface MockSystemInfo {
  device: {
    id: string
    name: string
    type: 'Workstation' | 'Laptop' | 'Desktop' | 'Server' | 'Router'
    os_family: string
    classification_confidence: number
  }
  hardware: {
    cpu: {
      model: string
      cores: number
      threads: number
      clock_speed: string
      current_utilization: number
    }
    memory: {
      total_gb: number
      used_gb: number
      free_gb: number
      utilization_percent: number
      type: string
    }
    storage: Array<{
      drive: string
      total_gb: number
      used_gb: number
      free_gb: number
      utilization_percent: number
      type: 'SSD' | 'HDD'
      filesystem: string
    }>
    gpu?: {
      model: string
      vram_gb: number
    }
    system: {
      manufacturer: string
      model: string
      serial_number: string
      asset_tag?: string
    }
  }
  operating_system: {
    name: string
    edition: string
    version: string
    build: string
    architecture: string
    install_date: string
    last_boot: string
    uptime_hours: number
    timezone: string
    language: string
  }
  software: {
    total_count: number
    top_applications: Array<{
      name: string
      version: string
      install_date: string
      publisher: string
      category: 'Security' | 'Browser' | 'Business' | 'Development' | 'Other'
      icon?: string
    }>
  }
  security: {
    score: number
    score_grade: 'Excellent' | 'Good' | 'Fair' | 'Poor'
    patches: {
      up_to_date: boolean
      last_update: string
      missing_critical: number
      missing_important: number
    }
    antivirus: {
      active: boolean
      product_name: string
      definitions_current: boolean
      last_definition_update: string
      last_scan: string
    }
    firewall: {
      enabled: boolean
      profiles: {
        domain: boolean
        private: boolean
        public: boolean
      }
      active_rules: number
    }
    encryption: {
      system_drive_encrypted: boolean
      all_drives_encrypted: boolean
      encryption_method?: string
    }
    vulnerabilities: {
      critical: number
      high: number
      medium: number
      low: number
    }
  }
  network: {
    current: {
      ip_address: string
      mac_address: string
      interface_name: string
      interface_status: 'Connected' | 'Disconnected'
      connection_speed: string
      gateway: string
      dns_servers: string[]
    }
    interfaces: Array<{
      name: string
      type: 'Ethernet' | 'Wi-Fi' | 'VPN'
      status: 'Connected' | 'Disconnected' | 'Disabled'
      mac_address: string
      speed?: string
    }>
  }
  transmission: {
    last_7_days: {
      upload_gb: number
      download_gb: number
      total_gb: number
    }
    daily_data: Array<{
      date: string
      upload_mb: number
      download_mb: number
    }>
  }
  usage_context: {
    login_history: Array<{
      timestamp: string
      username: string
      login_type: 'Local' | 'RDP' | 'SSH' | 'Domain'
      status: 'Success' | 'Failed'
      source_ip?: string
      duration?: string
      logoff_reason?: string
    }>
  }
  status: {
    last_seen: string
    status: 'Online' | 'Recently Active' | 'Offline' | 'Stale'
    communication_method: string
    next_checkin?: string
  }
  user: {
    primary_user?: {
      name: string
      username: string
      email: string
      department: string
      role: string
      manager?: string
    }
    active_sessions: Array<{
      username: string
      session_type: 'Console' | 'RDP' | 'SSH' | 'RunAs'
      login_time: string
      idle_time?: string
      source_ip?: string
    }>
  }
  location: {
    current: {
      city: string
      country: string
      confidence: 'High' | 'Medium' | 'Low' | 'Unknown'
      source: string
      timezone: string
      coordinates?: {
        lat: number
        lon: number
      }
      vpn_active: boolean
      vpn_server?: string
    }
  }
}

// Comprehensive mock data based on PRD specifications
const generateMockSystemInfo = (deviceId: string): MockSystemInfo => {
  // Different mock data based on device ID for variety
  const isLaptop = deviceId.includes('laptop') || deviceId.includes('002')
  const isServer = deviceId.includes('server') || deviceId.includes('srv')
  
  return {
    device: {
      id: deviceId,
      name: isLaptop ? 'LAPTOP-USER-001' : isServer ? 'SERVER-DB01' : 'WORKSTATION-DEV-001',
      type: isLaptop ? 'Laptop' : isServer ? 'Server' : 'Workstation',
      os_family: isServer ? 'Server' : 'Desktop',
      classification_confidence: isServer ? 0.95 : 0.99
    },
    hardware: {
      cpu: {
        model: isLaptop ? 'Intel Core i7-1165G7' : 'Intel Core i7-10700',
        cores: isLaptop ? 4 : 8,
        threads: isLaptop ? 8 : 16,
        clock_speed: isLaptop ? '2.80GHz' : '2.90GHz',
        current_utilization: Math.floor(Math.random() * 60) + 15
      },
      memory: {
        total_gb: isLaptop ? 16 : 32,
        used_gb: isLaptop ? 8.3 : 18.7,
        free_gb: isLaptop ? 7.7 : 13.3,
        utilization_percent: isLaptop ? 52 : 58,
        type: 'DDR4'
      },
      storage: [
        {
          drive: 'C:\\',
          total_gb: isLaptop ? 512 : 1024,
          used_gb: isLaptop ? 376 : 756,
          free_gb: isLaptop ? 136 : 268,
          utilization_percent: isLaptop ? 73 : 74,
          type: 'SSD',
          filesystem: 'NTFS'
        },
        ...(isLaptop ? [] : [{
          drive: 'D:\\',
          total_gb: 2048,
          used_gb: 1640,
          free_gb: 408,
          utilization_percent: 80,
          type: 'HDD' as const,
          filesystem: 'NTFS'
        }])
      ],
      gpu: isLaptop ? {
        model: 'Intel Iris Xe Graphics',
        vram_gb: 4
      } : {
        model: 'NVIDIA GeForce RTX 3060',
        vram_gb: 12
      },
      system: {
        manufacturer: isLaptop ? 'Lenovo' : 'Dell Inc.',
        model: isLaptop ? 'ThinkPad X1 Carbon Gen 9' : 'OptiPlex 7080',
        serial_number: `ABC${Math.random().toString().slice(2, 11)}`,
        asset_tag: isLaptop ? 'IT-LAPTOP-001' : 'IT-WORKSTATION-001'
      }
    },
    operating_system: {
      name: isServer ? 'Windows Server 2019' : 'Windows 10 Pro',
      edition: isServer ? 'Standard' : 'Professional',
      version: isServer ? '1809' : '22H2',
      build: isServer ? '17763.2989' : '19045.3570',
      architecture: 'x64',
      install_date: 'January 15, 2023',
      last_boot: 'November 18, 2024 at 08:15:23',
      uptime_hours: 15.5,
      timezone: '(UTC+02:00) Jerusalem',
      language: 'English (United States)'
    },
    software: {
      total_count: isLaptop ? 67 : 87,
      top_applications: [
        {
          name: 'CrowdStrike Falcon',
          version: '7.08.17506',
          install_date: 'Sep 12, 2023',
          publisher: 'CrowdStrike Inc.',
          category: 'Security',
          icon: '🛡️'
        },
        {
          name: 'Google Chrome',
          version: '119.0.6045.160',
          install_date: 'Nov 15, 2024',
          publisher: 'Google LLC',
          category: 'Browser',
          icon: '🌐'
        },
        {
          name: 'Microsoft Office 365 ProPlus',
          version: '16.0.15225.20288',
          install_date: 'Jan 20, 2023',
          publisher: 'Microsoft Corporation',
          category: 'Business',
          icon: '💼'
        },
        {
          name: 'Mozilla Firefox',
          version: '120.0',
          install_date: 'Nov 10, 2024',
          publisher: 'Mozilla',
          category: 'Browser',
          icon: '🌐'
        },
        {
          name: 'Cisco AnyConnect VPN',
          version: '4.10.06079',
          install_date: 'Aug 5, 2023',
          publisher: 'Cisco Systems Inc.',
          category: 'Security',
          icon: '🔒'
        }
      ]
    },
    security: {
      score: isServer ? 85 : 92,
      score_grade: isServer ? 'Good' : 'Excellent',
      patches: {
        up_to_date: !isServer,
        last_update: isServer ? 'November 10, 2024 at 02:30 AM' : 'November 15, 2024 at 02:30 AM',
        missing_critical: isServer ? 2 : 0,
        missing_important: isServer ? 1 : 0
      },
      antivirus: {
        active: true,
        product_name: 'Windows Defender',
        definitions_current: true,
        last_definition_update: 'Nov 18, 2024 23:15',
        last_scan: 'November 18, 2024 at 08:00 AM (Full scan)'
      },
      firewall: {
        enabled: true,
        profiles: {
          domain: true,
          private: true,
          public: true
        },
        active_rules: 47
      },
      encryption: {
        system_drive_encrypted: true,
        all_drives_encrypted: !isLaptop,
        encryption_method: 'BitLocker (AES-256)'
      },
      vulnerabilities: {
        critical: 0,
        high: isServer ? 1 : 0,
        medium: isServer ? 3 : 2,
        low: 1
      }
    },
    status: {
      last_seen: 'November 18, 2024 at 23:45:32 UTC',
      status: 'Online',
      communication_method: 'EDR Agent Check-in (CrowdStrike Falcon)',
      next_checkin: 'November 18, 2024 at 23:50:32 UTC'
    },
    user: {
      primary_user: {
        name: 'John Smith',
        username: 'jsmith',
        email: 'john.smith@company.com',
        department: 'Engineering',
        role: 'Senior Software Developer',
        manager: 'Jane Doe'
      },
      active_sessions: [
        {
          username: 'jsmith',
          session_type: 'Console',
          login_time: 'November 18, 2024 at 08:15:23',
          idle_time: '2 minutes'
        }
      ]
    },
    location: {
      current: {
        city: 'Tel Aviv',
        country: 'Israel',
        confidence: 'High',
        source: 'Corporate Network (192.168.1.0/24)',
        timezone: 'UTC+2 (Israel Standard Time)',
        coordinates: {
          lat: 32.0853,
          lon: 34.7818
        },
        vpn_active: false
      }
    },
    network: {
      current: {
        ip_address: isLaptop ? '192.168.1.45' : '192.168.1.50',
        mac_address: '00:1A:2B:3C:4D:5E',
        interface_name: 'Ethernet0',
        interface_status: 'Connected',
        connection_speed: '1000 Mbps (Full Duplex)',
        gateway: '192.168.1.1',
        dns_servers: ['8.8.8.8', '8.8.4.4']
      },
      interfaces: [
        {
          name: 'Ethernet0',
          type: 'Ethernet',
          status: 'Connected',
          mac_address: '00:1A:2B:3C:4D:5E',
          speed: '1000 Mbps'
        },
        {
          name: isLaptop ? 'Wi-Fi0' : 'Wi-Fi Adapter',
          type: 'Wi-Fi',
          status: isLaptop ? 'Disconnected' : 'Disabled',
          mac_address: '00:1A:2B:3C:4D:5F'
        }
      ]
    },
    transmission: {
      last_7_days: {
        upload_gb: 1.8,
        download_gb: 4.2,
        total_gb: 6.0
      },
      daily_data: [
        { date: '2024-11-12', upload_mb: 250, download_mb: 580 },
        { date: '2024-11-13', upload_mb: 310, download_mb: 720 },
        { date: '2024-11-14', upload_mb: 180, download_mb: 450 },
        { date: '2024-11-15', upload_mb: 420, download_mb: 890 },
        { date: '2024-11-16', upload_mb: 290, download_mb: 650 },
        { date: '2024-11-17', upload_mb: 350, download_mb: 710 },
        { date: '2024-11-18', upload_mb: 200, download_mb: 200 }
      ]
    },
    usage_context: {
      login_history: [
        {
          timestamp: 'Nov 18, 2024 08:15',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Success',
          duration: '15h 30m (active)'
        },
        {
          timestamp: 'Nov 17, 2024 17:45',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Success',
          duration: '9h 15m',
          logoff_reason: 'User initiated'
        },
        {
          timestamp: 'Nov 15, 2024 14:30',
          username: 'admin',
          login_type: 'RDP',
          status: 'Success',
          source_ip: '10.0.0.5',
          duration: '2h 10m',
          logoff_reason: 'Session timeout'
        },
        {
          timestamp: 'Nov 14, 2024 22:15',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Failed'
        },
        {
          timestamp: 'Nov 14, 2024 22:14',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Failed'
        },
        {
          timestamp: 'Nov 14, 2024 22:13',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Failed'
        },
        {
          timestamp: 'Nov 12, 2024 09:00',
          username: 'jsmith',
          login_type: 'Local',
          status: 'Success',
          duration: '8h 45m',
          logoff_reason: 'User initiated'
        },
        {
          timestamp: 'Nov 10, 2024 13:30',
          username: 'mjones',
          login_type: 'RDP',
          status: 'Success',
          source_ip: '192.168.1.100',
          duration: '3h 20m',
          logoff_reason: 'User initiated'
        }
      ]
    }
  }
}

const SystemInformation: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['system-info', 'network-info', 'transmission', 'usage-context']))
  const [systemInfo, setSystemInfo] = useState<MockSystemInfo | null>(null)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d')
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  // Date validation error state
  const [customDateError, setCustomDateError] = useState<string>('')
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (deviceId) {
      // Simulate loading delay
      setTimeout(() => {
        setSystemInfo(generateMockSystemInfo(deviceId))
      }, 500)
    }
  }, [deviceId])

  // Device type check - implement PRD classification logic
  const canShowSystemInfo = (device: MockSystemInfo['device']) => {
    // ALLOW computers
    if (['Workstation', 'Laptop', 'Desktop'].includes(device.type)) {
      if (device.os_family === 'Desktop') {
        return { allowed: true, reason: '' }
      }
    }
    
    // DENY servers
    if (device.type === 'Server' || device.os_family === 'Server') {
      return { 
        allowed: false, 
        reason: 'This page is only available for computer endpoints.',
        deviceType: device.type,
        deviceName: device.name
      }
    }
    
    // DENY network infrastructure
    if (['Router', 'Switch', 'Firewall'].includes(device.type)) {
      return { 
        allowed: false, 
        reason: 'This page is only available for computer endpoints.',
        deviceType: device.type,
        deviceName: device.name
      }
    }
    
    return { allowed: true, reason: '' }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleTimeRangeChange = async (range: '24h' | '7d' | '30d' | 'custom') => {
    if (range === 'custom') {
      setShowCustomRangePicker(true)
      return
    }
    
    setIsLoadingData(true)
    setTimeRange(range)
    
    // Simulate API call delay for better UX demonstration
    setTimeout(() => {
      setIsLoadingData(false)
      console.log(`Data loaded for ${range}`)
    }, 800)
  }

  const validateDateRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) {
      return { isValid: false, error: 'Please select both start and end dates' }
    }

    const startDate = new Date(startStr)
    const endDate = new Date(endStr)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    
    // End date must be after start date
    if (endDate <= startDate) {
      return { isValid: false, error: 'End date must be after start date' }
    }
    
    // Cannot select future dates
    if (startDate > today || endDate > today) {
      return { isValid: false, error: 'Cannot select future dates' }
    }
    
    // Calculate days difference
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Minimum range check
    if (dayDiff < 1) {
      return { isValid: false, error: 'Date range must be at least 1 day' }
    }
    
    // Maximum range check (90 days)
    if (dayDiff > 90) {
      return { isValid: false, error: 'Maximum date range is 90 days' }
    }
    
    return { isValid: true, error: '', dayCount: dayDiff }
  }

  const applyCustomRange = () => {
    const validation = validateDateRange(customStartDate, customEndDate)
    
    if (!validation.isValid) {
      setCustomDateError(validation.error)
      return
    }
    
    // Clear any previous errors
    setCustomDateError('')
    
    // Set loading state and close modal
    setIsLoadingData(true)
    setShowCustomRangePicker(false)
    setTimeRange('custom')
    
    // Simulate API call delay for better UX demonstration
    setTimeout(() => {
      setIsLoadingData(false)
      console.log(`Data loaded from ${customStartDate} to ${customEndDate} (${validation.dayCount} days)`)
    }, 800)
  }

  // Set date constraints
  const getDateConstraints = () => {
    const today = new Date()
    const maxDate = today.toISOString().split('T')[0] // Today in YYYY-MM-DD format
    const minDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // 1 year ago
    
    return { maxDate, minDate }
  }

  const getTimeRangeLabel = () => {
    if (timeRange === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const end = new Date(customEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${start} - ${end}`
    }
    
    switch (timeRange) {
      case '24h': return 'Last 24 Hours'
      case '7d': return 'Last 7 Days'
      case '30d': return 'Last 30 Days'
      default: return 'Last 7 Days'
    }
  }

  // Generate mock data based on time range
  const generateTransmissionData = (range: string, startDate?: string, endDate?: string) => {
    let dataPoints: any[] = []
    let currentTimeRange = range
    
    switch (range) {
      case '24h':
        // Generate 24 hourly data points
        for (let i = 0; i < 24; i++) {
          const date = new Date()
          date.setHours(date.getHours() - (23 - i))
          dataPoints.push({
            date: date.toISOString(),
            upload_mb: Math.floor(Math.random() * 200) + 50, // 50-250 MB
            download_mb: Math.floor(Math.random() * 400) + 100 // 100-500 MB
          })
        }
        break
        
      case '7d':
        // Use existing daily data (7 days)
        dataPoints = systemInfo?.transmission.daily_data || []
        break
        
      case '30d':
        // Generate 30 daily data points
        for (let i = 0; i < 30; i++) {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          dataPoints.push({
            date: date.toISOString().split('T')[0],
            upload_mb: Math.floor(Math.random() * 600) + 200, // 200-800 MB
            download_mb: Math.floor(Math.random() * 1200) + 400 // 400-1600 MB
          })
        }
        break
        
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate)
          const end = new Date(endDate)
          const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
          
          for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(start)
            date.setDate(start.getDate() + i)
            dataPoints.push({
              date: date.toISOString().split('T')[0],
              upload_mb: Math.floor(Math.random() * 500) + 150, // 150-650 MB
              download_mb: Math.floor(Math.random() * 900) + 300 // 300-1200 MB
            })
          }
        }
        break
    }
    
    return dataPoints
  }

  // Format data for Recharts based on time range
  const formatChartData = (data: any[], range: string) => {
    return data.map(day => {
      let dateLabel: string
      
      if (range === '24h') {
        // Show hourly format: "14:00", "15:00"
        dateLabel = new Date(day.date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      } else {
        // Show daily format: "Nov 12", "Nov 13"
        dateLabel = new Date(day.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
      
      return {
        date: dateLabel,
        fullDate: day.date,
        upload: (day.upload_mb / 1000).toFixed(2),
        download: (day.download_mb / 1000).toFixed(2),
        uploadMB: day.upload_mb,
        downloadMB: day.download_mb
      }
    })
  }

  // Get current chart data based on selected time range
  const getCurrentChartData = () => {
    if (!systemInfo) return []
    
    let rawData: any[] = []
    
    if (timeRange === 'custom' && customStartDate && customEndDate) {
      rawData = generateTransmissionData('custom', customStartDate, customEndDate)
    } else {
      rawData = generateTransmissionData(timeRange)
    }
    
    return formatChartData(rawData, timeRange)
  }

  // Calculate totals for summary cards
  const calculateTotals = (data: any[]) => {
    const totalUploadMB = data.reduce((sum, day) => sum + day.uploadMB, 0)
    const totalDownloadMB = data.reduce((sum, day) => sum + day.downloadMB, 0)
    
    return {
      upload_gb: (totalUploadMB / 1000).toFixed(1),
      download_gb: (totalDownloadMB / 1000).toFixed(1),
      total_gb: ((totalUploadMB + totalDownloadMB) / 1000).toFixed(1)
    }
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-600">
          <div className="text-sm font-medium mb-1">
            {new Date(data.fullDate).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Upload: {data.upload} GB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Download: {data.download} GB</span>
            </div>
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-600">
              <span>Total: {(parseFloat(data.upload) + parseFloat(data.download)).toFixed(2)} GB</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Recently Active':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Offline':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Stale':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      case 'Recently Active':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      case 'Offline':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      case 'Stale':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    if (score >= 50) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getSecurityScoreIcon = (grade: string) => {
    switch (grade) {
      case 'Excellent':
        return <CheckCircle className="w-4 h-4" />
      case 'Good':
        return <CheckCircle className="w-4 h-4" />
      case 'Fair':
        return <AlertTriangle className="w-4 h-4" />
      case 'Poor':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  // Create system info for StickyHeader
  const headerSystemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'System Information'
  }

  // Create breadcrumbs for StickyHeader
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'System Information', link: null }
  ]

  // StickyHeader action handlers
  const handleSave = () => {
    console.log('Saving system information for device:', deviceId)
    alert('System information saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting system information as:', format, 'for device:', deviceId)
    alert(`Exporting system information as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    console.log('Refreshing system information for device:', deviceId)
    setSystemInfo(null)
    setTimeout(() => {
      if (deviceId) {
        setSystemInfo(generateMockSystemInfo(deviceId))
      }
    }, 500)
  }

  const handleSettings = () => {
    console.log('Opening system information settings for device:', deviceId)
    alert('System information settings would open here')
  }

  if (!systemInfo) {
    return (
      <>
        <StickyHeader
          systemInfo={headerSystemInfo}
          breadcrumbs={breadcrumbs}
          onSave={handleSave}
          onExport={handleExport}
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          isLoading={true}
        />
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
          <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
            {/* Navigation */}
            <nav className="flex-1 p-4 pt-6 space-y-2">
              {[
                { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
                { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
                { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
                { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
                { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
                { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info, active: true },
                { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
                { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
                { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium",
                      item.active
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-400 dark:text-gray-500'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden ml-64">
            <main className="flex-1 overflow-auto p-6 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-600">Loading system information...</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }

  // Check device type access
  const accessCheck = canShowSystemInfo(systemInfo.device)
  
  if (!accessCheck.allowed) {
    return (
      <>
        <StickyHeader
          systemInfo={headerSystemInfo}
          breadcrumbs={breadcrumbs}
          onSave={handleSave}
          onExport={handleExport}
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          isLoading={false}
        />
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
          <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
            {/* Navigation */}
            <nav className="flex-1 p-4 pt-6 space-y-2">
              {[
                { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
                { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
                { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
                { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
                { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
                { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info, active: true },
                { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
                { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
                { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.name}
                    onClick={() => !item.active && navigate(item.href)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      item.active
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden ml-64">
            <main className="flex-1 overflow-auto p-6 min-h-screen">
              <div className="max-w-4xl mx-auto">
                <Card variant="solid" className="border-orange-200 bg-orange-50">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-orange-900 mb-2">
                      System Information Not Available
                    </h2>
                    <p className="text-orange-800 mb-4">
                      {accessCheck.reason}
                    </p>
                    <div className="bg-white/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-orange-700">
                        <strong>Device Type:</strong> {accessCheck.deviceType}<br />
                        <strong>Device Name:</strong> {accessCheck.deviceName}
                      </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate(`/investigate/${deviceId}`)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        View Basic Device Info
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={() => navigate(`/investigate/${deviceId}/network`)}
                      >
                        Go to Network Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Sticky Header */}
      <StickyHeader
        systemInfo={headerSystemInfo}
        breadcrumbs={breadcrumbs}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={false}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 p-4 pt-6 space-y-2">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
              { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive },
              { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
              { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
              { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info, active: true },
              { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
              { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
              { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  onClick={() => !item.active && navigate(item.href)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(systemInfo.status.status)}
                <span className="text-xs font-medium text-slate-700">Investigation Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                  System Information: {systemInfo.device.name}
                </h1>
                <p className="text-body-sm text-slate-600 dark:text-gray-300">
                  Comprehensive device profiling and system analysis
                </p>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Last Seen Status */}
                <Card variant="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-slate-500" />
                      {getStatusIcon(systemInfo.status.status)}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Last Seen</span>
                    </div>
                    <div className="mb-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getStatusColor(systemInfo.status.status)
                      )}>
                        {systemInfo.status.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      2 minutes ago
                    </div>
                  </CardContent>
                </Card>

                {/* Primary User */}
                <Card variant="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <User className="w-5 h-5 text-slate-500" />
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mb-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Primary User</span>
                    </div>
                    <div className="mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {systemInfo.user.primary_user?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {systemInfo.user.primary_user?.username || 'No user assigned'}
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card variant="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <span className="text-xs text-green-600 font-medium">
                        Confidence: {systemInfo.location.current.confidence}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Location</span>
                    </div>
                    <div className="mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {systemInfo.location.current.city}, {systemInfo.location.current.country}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {systemInfo.location.current.source.split('(')[0].trim()}
                    </div>
                  </CardContent>
                </Card>

                {/* Health Status */}
                <Card variant="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-slate-500" />
                      {getSecurityScoreIcon(systemInfo.security.score_grade)}
                    </div>
                    <div className="mb-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Health Status</span>
                    </div>
                    <div className="mb-1">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getSecurityScoreColor(systemInfo.security.score)
                      )}>
                        {systemInfo.security.score}/100 {systemInfo.security.score_grade}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Security Score
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Information Section */}
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('system-info')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">
                      System Information
                    </h3>
                    {expandedSections.has('system-info') ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.has('system-info') && (
                  <CardContent>
                    {/* Hardware Specifications */}
                    <div className="mb-8">
                      <h4 className="text-md font-semibold text-slate-800 mb-4 flex items-center">
                        <Monitor className="w-4 h-4 mr-2" />
                        Hardware Specifications
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {/* CPU */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="text-sm font-medium text-slate-700 mb-2">CPU</div>
                            <div className="text-sm text-slate-900 mb-1">
                              {systemInfo.hardware.cpu.model} @ {systemInfo.hardware.cpu.clock_speed}
                            </div>
                            <div className="text-xs text-slate-600">
                              {systemInfo.hardware.cpu.cores} cores, {systemInfo.hardware.cpu.threads} threads • Current load: {systemInfo.hardware.cpu.current_utilization}%
                            </div>
                          </div>

                          {/* Memory */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="text-sm font-medium text-slate-700 mb-2">RAM</div>
                            <div className="text-sm text-slate-900 mb-1">
                              {systemInfo.hardware.memory.total_gb} GB {systemInfo.hardware.memory.type}
                            </div>
                            <div className="text-xs text-slate-600 mb-2">
                              {systemInfo.hardware.memory.used_gb} GB used ({systemInfo.hardware.memory.utilization_percent}%) • {systemInfo.hardware.memory.free_gb} GB free
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${systemInfo.hardware.memory.utilization_percent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* GPU */}
                          {systemInfo.hardware.gpu && (
                            <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                              <div className="text-sm font-medium text-slate-700 mb-2">GPU</div>
                              <div className="text-sm text-slate-900 mb-1">
                                {systemInfo.hardware.gpu.model}
                              </div>
                              <div className="text-xs text-slate-600">
                                {systemInfo.hardware.gpu.vram_gb} GB VRAM
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Storage */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="text-sm font-medium text-slate-700 mb-3">Storage</div>
                            <div className="space-y-3">
                              {systemInfo.hardware.storage.map((drive, index) => (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="text-sm text-slate-900">
                                      {drive.drive} {drive.total_gb} GB {drive.type} ({drive.filesystem})
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      {drive.utilization_percent}% full
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-600 mb-1">
                                    {drive.used_gb} GB used, {drive.free_gb} GB free
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                      className={cn(
                                        "h-2 rounded-full",
                                        drive.utilization_percent > 90 ? "bg-red-500" :
                                        drive.utilization_percent > 70 ? "bg-yellow-500" : "bg-green-500"
                                      )}
                                      style={{ width: `${drive.utilization_percent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* System Info */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="text-sm font-medium text-slate-700 mb-2">System</div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div><strong>Manufacturer:</strong> {systemInfo.hardware.system.manufacturer}</div>
                              <div><strong>Model:</strong> {systemInfo.hardware.system.model}</div>
                              <div><strong>Serial:</strong> {systemInfo.hardware.system.serial_number}</div>
                              {systemInfo.hardware.system.asset_tag && (
                                <div><strong>Asset Tag:</strong> {systemInfo.hardware.system.asset_tag}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operating System */}
                    <div className="mb-8">
                      <h4 className="text-md font-semibold text-slate-800 mb-4 flex items-center">
                        <Cog className="w-4 h-4 mr-2" />
                        Operating System
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Operating System</div>
                              <div className="text-sm font-medium text-slate-900">
                                {systemInfo.operating_system.name} ({systemInfo.operating_system.version})
                              </div>
                              <div className="text-xs text-slate-600">
                                Build: {systemInfo.operating_system.build} • {systemInfo.operating_system.architecture}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Install Information</div>
                              <div className="text-sm text-slate-600">
                                Installed: {systemInfo.operating_system.install_date}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">System Status</div>
                              <div className="text-sm text-slate-600">
                                Last Boot: {systemInfo.operating_system.last_boot}
                              </div>
                              <div className="text-sm text-slate-600">
                                Uptime: {Math.floor(systemInfo.operating_system.uptime_hours)} hours, {Math.round((systemInfo.operating_system.uptime_hours % 1) * 60)} minutes
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Localization</div>
                              <div className="text-sm text-slate-600">
                                Time Zone: {systemInfo.operating_system.timezone}
                              </div>
                              <div className="text-sm text-slate-600">
                                Language: {systemInfo.operating_system.language}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Installed Software */}
                    <div className="mb-8">
                      <h4 className="text-md font-semibold text-slate-800 mb-4 flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Installed Software
                      </h4>
                      
                      <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-slate-600">
                            Showing {systemInfo.software.top_applications.length} of {systemInfo.software.total_count} applications
                          </div>
                          <Button variant="outline" size="sm">
                            Show All Applications ({systemInfo.software.total_count})
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {systemInfo.software.top_applications.map((app, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{app.icon}</span>
                                <div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {app.name} ({app.version})
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    Installed: {app.install_date} • Vendor: {app.publisher}
                                  </div>
                                </div>
                              </div>
                              <Badge 
                                variant={app.category === 'Security' ? 'success' : 'secondary'}
                                size="sm"
                              >
                                {app.category}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Security Posture */}
                    <div>
                      <h4 className="text-md font-semibold text-slate-800 mb-4 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Posture
                        <span className={cn(
                          "ml-3 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2",
                          getSecurityScoreColor(systemInfo.security.score)
                        )}>
                          {getSecurityScoreIcon(systemInfo.security.score_grade)}
                          <span>Score: {systemInfo.security.score}/100 {systemInfo.security.score_grade}</span>
                        </span>
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {/* Patches */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-slate-700">Patches</div>
                              {systemInfo.security.patches.up_to_date ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>
                                Status: {systemInfo.security.patches.up_to_date ? 'Up to date' : 'Updates pending'}
                              </div>
                              <div>Last Update: {systemInfo.security.patches.last_update}</div>
                              {!systemInfo.security.patches.up_to_date && (
                                <div>Missing: {systemInfo.security.patches.missing_critical} critical, {systemInfo.security.patches.missing_important} important patches</div>
                              )}
                            </div>
                          </div>

                          {/* Antivirus */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-slate-700">Antivirus</div>
                              {systemInfo.security.antivirus.active ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>{systemInfo.security.antivirus.product_name} - {systemInfo.security.antivirus.active ? 'Active' : 'Inactive'}</div>
                              <div>Definitions: {systemInfo.security.antivirus.definitions_current ? 'Current' : 'Outdated'} (Updated: {systemInfo.security.antivirus.last_definition_update})</div>
                              <div>Last Scan: {systemInfo.security.antivirus.last_scan}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Firewall */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-slate-700">Firewall</div>
                              {systemInfo.security.firewall.enabled ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>
                                Domain: {systemInfo.security.firewall.profiles.domain ? '✓ On' : '✗ Off'} • 
                                Private: {systemInfo.security.firewall.profiles.private ? '✓ On' : '✗ Off'} • 
                                Public: {systemInfo.security.firewall.profiles.public ? '✓ On' : '✗ Off'}
                              </div>
                              <div>Active Rules: {systemInfo.security.firewall.active_rules}</div>
                            </div>
                          </div>

                          {/* Disk Encryption */}
                          <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium text-slate-700">Disk Encryption</div>
                              {systemInfo.security.encryption.system_drive_encrypted ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>System Drive: {systemInfo.security.encryption.system_drive_encrypted ? 'Encrypted' : 'Not Encrypted'}</div>
                              {systemInfo.security.encryption.encryption_method && (
                                <div>Method: {systemInfo.security.encryption.encryption_method}</div>
                              )}
                              {!systemInfo.security.encryption.all_drives_encrypted && systemInfo.hardware.storage.length > 1 && (
                                <div className="text-orange-600">⚠️ Some drives not encrypted</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vulnerabilities */}
                      {(systemInfo.security.vulnerabilities.critical + systemInfo.security.vulnerabilities.high + systemInfo.security.vulnerabilities.medium + systemInfo.security.vulnerabilities.low) > 0 && (
                        <div className="mt-4 bg-orange-50/50 rounded-lg p-4 border border-orange-200/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-orange-800">Known Vulnerabilities</div>
                            <Button variant="outline" size="sm">
                              View Vulnerabilities
                            </Button>
                          </div>
                          <div className="text-xs text-orange-700">
                            {systemInfo.security.vulnerabilities.critical} Critical • {systemInfo.security.vulnerabilities.high} High • {systemInfo.security.vulnerabilities.medium} Medium • {systemInfo.security.vulnerabilities.low} Low
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Network Information Section */}
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('network-info')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                      <Network className="w-5 h-5 mr-2" />
                      Network Information
                    </h3>
                    {expandedSections.has('network-info') ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.has('network-info') && (
                  <CardContent>
                    {/* Current Network Configuration */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-slate-800 mb-4">Current Network Configuration</h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">IP Address</div>
                              <div className="text-sm font-medium text-slate-900">
                                {systemInfo.network.current.ip_address} (DHCP)
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">MAC Address</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.network.current.mac_address}
                              </div>
                              <div className="text-xs text-slate-600">Intel Corporation</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Interface</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.network.current.interface_name} - {systemInfo.network.current.interface_status}
                              </div>
                              <div className="text-xs text-slate-600">
                                Speed: {systemInfo.network.current.connection_speed}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Gateway</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.network.current.gateway}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">DNS Servers</div>
                              <div className="text-sm text-slate-900">
                                Primary: {systemInfo.network.current.dns_servers[0]}
                              </div>
                              <div className="text-sm text-slate-900">
                                Secondary: {systemInfo.network.current.dns_servers[1]}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Network Interfaces</div>
                              <div className="space-y-1">
                                {systemInfo.network.interfaces.map((iface, index) => (
                                  <div key={index} className="text-xs">
                                    <span className={cn(
                                      "inline-block w-2 h-2 rounded-full mr-2",
                                      iface.status === 'Connected' ? 'bg-green-500' : 'bg-gray-400'
                                    )}></span>
                                    {iface.name} ({iface.type}) - {iface.status}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <Button variant="outline">
                          View Full Network History →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Data Transmission Section */}
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('transmission')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Data Transmission ({getTimeRangeLabel()})
                    </h3>
                    {expandedSections.has('transmission') ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.has('transmission') && (
                  <CardContent>
                    {/* Time Range Selector */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm font-medium text-slate-700 mr-3 py-2">Time Range:</span>
                        <Button
                          variant={timeRange === '24h' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => handleTimeRangeChange('24h')}
                          disabled={isLoadingData}
                          className={`text-xs ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isLoadingData && timeRange === '24h' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Last 24 Hours'
                          )}
                        </Button>
                        <Button
                          variant={timeRange === '7d' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => handleTimeRangeChange('7d')}
                          disabled={isLoadingData}
                          className={`text-xs ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isLoadingData && timeRange === '7d' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Last 7 Days'
                          )}
                        </Button>
                        <Button
                          variant={timeRange === '30d' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => handleTimeRangeChange('30d')}
                          disabled={isLoadingData}
                          className={`text-xs ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isLoadingData && timeRange === '30d' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Last 30 Days'
                          )}
                        </Button>
                        <Button
                          variant={timeRange === 'custom' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => handleTimeRangeChange('custom')}
                          disabled={isLoadingData}
                          className={`text-xs ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isLoadingData && timeRange === 'custom' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Custom Range'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {(() => {
                        const chartData = getCurrentChartData()
                        const totals = calculateTotals(chartData)
                        
                        return (
                          <>
                            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-blue-600 uppercase tracking-wide font-medium">Upload</span>
                              </div>
                              <div className="text-lg font-semibold text-blue-900">
                                {totals.upload_gb} GB
                              </div>
                            </div>

                            <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
                              <div className="flex items-center space-x-2 mb-2">
                                <Download className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600 uppercase tracking-wide font-medium">Download</span>
                              </div>
                              <div className="text-lg font-semibold text-green-900">
                                {totals.download_gb} GB
                              </div>
                            </div>

                            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200/50">
                              <div className="flex items-center space-x-2 mb-2">
                                <Activity className="w-4 h-4 text-purple-600" />
                                <span className="text-xs text-purple-600 uppercase tracking-wide font-medium">Total</span>
                              </div>
                              <div className="text-lg font-semibold text-purple-900">
                                {totals.total_gb} GB
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    {/* Professional Recharts Implementation */}
                    <div className="bg-white/50 rounded-lg p-6 border border-slate-200/50 relative">
                      <h4 className="text-md font-medium text-slate-800 mb-6">
                        {timeRange === '24h' ? 'Hourly Data Transfer' : 'Daily Data Transfer'}
                      </h4>
                      
                      {/* Loading Overlay */}
                      {isLoadingData && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-slate-600 font-medium">Loading data...</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Recharts Line Chart */}
                      <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={getCurrentChartData()}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              tickLine={{ stroke: '#64748b' }}
                              axisLine={{ stroke: '#64748b' }}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis 
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              tickLine={{ stroke: '#64748b' }}
                              axisLine={{ stroke: '#64748b' }}
                              label={{ value: 'GB', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                              domain={[0, 'dataMax + 0.2']}
                              tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                              iconType="circle"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="upload" 
                              stroke="#3b82f6" 
                              strokeWidth={4}
                              dot={{ fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff', r: 5 }}
                              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                              name="Upload"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="download" 
                              stroke="#10b981" 
                              strokeWidth={4}
                              dot={{ fill: '#10b981', strokeWidth: 2, stroke: '#ffffff', r: 5 }}
                              activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 2, fill: '#10b981' }}
                              name="Download"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Summary Stats Below Chart */}
                      {(() => {
                        const chartData = getCurrentChartData()
                        const totals = calculateTotals(chartData)
                        
                        return (
                          <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-slate-600 font-medium">Upload: {totals.upload_gb} GB total</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-slate-600 font-medium">Download: {totals.download_gb} GB total</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Enhanced Custom Date Range Picker Modal */}
                    {showCustomRangePicker && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                          {/* Modal Header */}
                          <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">Select Custom Date Range</h3>
                            <button
                              onClick={() => {
                                setShowCustomRangePicker(false)
                                setCustomDateError('')
                              }}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Modal Body */}
                          <div className="p-6">
                            <div className="space-y-4">
                              {/* Start Date */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Start Date
                                </label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={customStartDate}
                                    min={getDateConstraints().minDate}
                                    max={getDateConstraints().maxDate}
                                    onChange={(e) => {
                                      setCustomStartDate(e.target.value)
                                      setCustomDateError('') // Clear errors on change
                                    }}
                                    className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              
                              {/* End Date */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  End Date
                                </label>
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={customEndDate}
                                    min={customStartDate || getDateConstraints().minDate}
                                    max={getDateConstraints().maxDate}
                                    onChange={(e) => {
                                      setCustomEndDate(e.target.value)
                                      setCustomDateError('') // Clear errors on change
                                    }}
                                    className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Error Message */}
                              {customDateError && (
                                <div className="flex items-center p-3 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                                  <svg className="flex-shrink-0 inline w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <span>{customDateError}</span>
                                </div>
                              )}
                              
                              {/* Info Message */}
                              <div className="flex items-center p-3 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-200">
                                <svg className="flex-shrink-0 inline w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <span className="font-medium">Constraints:</span>
                                  <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                                    <li>Maximum range: 90 days</li>
                                    <li>Cannot select future dates</li>
                                    <li>Minimum range: 1 day</li>
                                  </ul>
                                </div>
                              </div>
                              
                              {/* Range Preview */}
                              {customStartDate && customEndDate && !customDateError && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-center text-sm text-green-800">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">
                                      Range: {validateDateRange(customStartDate, customEndDate).dayCount} days selected
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Modal Footer */}
                          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setShowCustomRangePicker(false)
                                setCustomDateError('')
                                setCustomStartDate('')
                                setCustomEndDate('')
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={applyCustomRange}
                              disabled={!customStartDate || !customEndDate || !!customDateError}
                            >
                              Apply Range
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Usage Context Section */}
              <Card variant="glass" className="mb-6">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('usage-context')}
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Usage Context
                    </h3>
                    {expandedSections.has('usage-context') ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.has('usage-context') && (
                  <CardContent>
                    {/* Current User Details */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-slate-800 mb-4">Current User Details</h4>
                      
                      <div className="bg-white/50 rounded-lg p-4 border border-slate-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Name</div>
                              <div className="text-sm font-medium text-slate-900">
                                {systemInfo.user.primary_user?.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Username</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.user.primary_user?.username}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Email</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.user.primary_user?.email}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Department</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.user.primary_user?.department}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Role</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.user.primary_user?.role}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide">Manager</div>
                              <div className="text-sm text-slate-900">
                                {systemInfo.user.primary_user?.manager}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Login History */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold text-slate-800">Recent Login History</h4>
                        <Button variant="outline" size="sm">
                          View All Login Events →
                        </Button>
                      </div>
                      
                      <div className="bg-white/50 rounded-lg border border-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50/50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Timestamp</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Duration</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Source</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/50">
                              {systemInfo.usage_context.login_history.slice(0, 8).map((login, index) => (
                                <tr key={index} className="hover:bg-slate-50/30">
                                  <td className="px-4 py-2 text-slate-900">{login.timestamp}</td>
                                  <td className="px-4 py-2 text-slate-900">{login.username}</td>
                                  <td className="px-4 py-2">
                                    <Badge variant="secondary" size="sm">
                                      {login.login_type}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={cn(
                                      "inline-flex items-center space-x-1 text-xs",
                                      login.status === 'Success' ? 'text-green-600' : 'text-red-600'
                                    )}>
                                      {login.status === 'Success' ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <XCircle className="w-3 h-3" />
                                      )}
                                      <span>{login.status}</span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-slate-600">{login.duration || '-'}</td>
                                  <td className="px-4 py-2 text-slate-600">{login.source_ip || 'Console'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Failed Login Alert */}
                        <div className="bg-orange-50/50 border-t border-orange-200/50 p-4">
                          <div className="flex items-center space-x-2 text-orange-700">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Alert: 3 consecutive failed login attempts for 'jsmith' on Nov 14
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default SystemInformation