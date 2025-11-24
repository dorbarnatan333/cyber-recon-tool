# PRD: System Information

## Overview
Comprehensive system information module displaying operating system details, hardware specifications, installed software, running processes, services, system events, and performance metrics.

## Purpose
Enable security analysts to gather detailed system-level intelligence including OS version, hardware inventory, installed applications, active processes, system services, and configuration details. Essential for baseline establishment, vulnerability assessment, and system profiling.

---

## Requirements

### REQ-SYSINFO-001: Operating System Information

**Title**: Display Operating System Details

**Description**:
Show comprehensive OS information including version, edition, architecture, installation date, and licensing.

**Acceptance Criteria**:
- Card container with header "Operating System" and OS icon
- OS details displayed:
  - OS Name and Edition (e.g., "Windows 11 Pro")
  - Version and Build number
  - Architecture (32-bit/64-bit/ARM)
  - Installation Date
  - License Status
  - Last Boot Time
  - System Uptime
  - Computer Name
  - Domain/Workgroup
- OS logo/icon based on detected OS
- Information displayed in key-value grid layout
- Card uses glass variant

**Technical Implementation**:
- OS data structure: name, edition, version, build, architecture, install_date, license_status, last_boot, uptime, computer_name, domain
- OS icon mapping based on name
- Uptime calculation from last_boot timestamp
- Grid layout for key-value pairs
- Timestamp formatter for dates

---

### REQ-SYSINFO-002: Hardware Information

**Title**: Display Hardware Specifications

**Description**:
Show detailed hardware information including CPU, memory, storage, and other components.

**Acceptance Criteria**:
- Card container with header "Hardware" and chip icon
- Hardware sections:
  - **Processor**: Name, cores, threads, speed, architecture
  - **Memory**: Total RAM, available RAM, usage percentage
  - **Storage**: Drives list with capacity, used space, free space, file system
  - **Graphics**: GPU name, VRAM, driver version
  - **Motherboard**: Manufacturer, model, BIOS version
  - **Network Hardware**: Network adapters with MAC addresses
- Memory usage with progress bar
- Storage drives with usage bars
- Card uses glass variant

**Technical Implementation**:
- Hardware data structure with nested objects for each component type
- Processor: name, cores, threads, speed_ghz, architecture
- Memory: total_gb, available_gb, usage_percent
- Storage array: drive_letter, capacity_gb, used_gb, free_gb, file_system, type
- Graphics: name, vram_gb, driver_version
- Progress bar components for memory and storage usage
- Formatting for GB values and percentages

---

### REQ-SYSINFO-003: Installed Software List

**Title**: Display Installed Applications

**Description**:
Show comprehensive list of installed software with version, publisher, install date, and size information.

**Acceptance Criteria**:
- Card container with header "Installed Software" and package icon
- Table with columns:
  - Software Name
  - Version
  - Publisher
  - Install Date
  - Size (MB/GB)
  - Install Location
- Search by name or publisher
- Filter by install date range
- Sort by name, install date, size
- Software count total
- Export list functionality
- Card uses glass variant

**Technical Implementation**:
- Software entry data structure: id, name, version, publisher, install_date, size_mb, install_location
- Search state and filter logic
- Sort state and sorting logic
- Table component with sortable columns
- Size formatter (MB/GB)
- Timestamp formatter
- Export handler (CSV/JSON)
- Software count display

---

### REQ-SYSINFO-004: Running Processes

**Title**: Display Active Processes

**Description**:
Show real-time list of running processes with resource usage, PID, and process details.

**Acceptance Criteria**:
- Card container with header "Running Processes" and activity icon
- Table with columns:
  - Process Name
  - PID (Process ID)
  - CPU Usage (%)
  - Memory Usage (MB)
  - User/Owner
  - Status (Running/Suspended)
  - Start Time
- Real-time updates or refresh button
- Search by process name
- Sort by CPU, memory, PID, start time
- Process actions: View Details, Kill Process (with confirmation)
- Highlight suspicious processes
- Card uses glass variant

**Technical Implementation**:
- Process data structure: pid, name, cpu_percent, memory_mb, user, status, start_time, executable_path
- Real-time update mechanism (WebSocket or polling)
- Search and sort state
- CPU and memory value formatting
- Status badge component
- Process actions with confirmation dialogs
- Suspicious process detection logic
- Refresh handler

---

### REQ-SYSINFO-005: System Services

**Title**: Display Windows/System Services

**Description**:
Show list of system services with status, startup type, and service details.

**Acceptance Criteria**:
- Card container with header "System Services" and service icon
- Table with columns:
  - Service Name
  - Display Name
  - Status (Running/Stopped)
  - Startup Type (Automatic/Manual/Disabled)
  - Account (LocalSystem/NetworkService/etc.)
  - Description
- Status badges: Running=green, Stopped=gray
- Filter by status, startup type
- Search by service name
- Service actions: Start, Stop, Restart (with permissions check)
- Card uses glass variant

**Technical Implementation**:
- Service data structure: name, display_name, status, startup_type, account, description, dependencies
- Status badge with conditional variant
- Filter state for status and startup type
- Search state
- Service control handlers with permission checks
- Confirmation dialogs for service actions
- Dependencies display (optional expandable)

---

### REQ-SYSINFO-006: System Events/Logs

**Title**: Display Recent System Events

**Description**:
Show recent system events and logs filtered by severity and source.

**Acceptance Criteria**:
- Card container with header "System Events" and log icon
- Event list showing:
  - Timestamp
  - Event Level (Information/Warning/Error/Critical)
  - Source
  - Event ID
  - Message/Description
- Level badges color-coded: Info=blue, Warning=yellow, Error=orange, Critical=red
- Filter by level, source, date range
- Search in message text
- Pagination or infinite scroll
- Event detail view (expandable)
- Card uses glass variant

**Technical Implementation**:
- Event data structure: id, timestamp, level, source, event_id, message, details
- Level badge with conditional variant and colors
- Filter state for level, source, date range
- Search state
- Pagination state and handlers
- Expandable detail view state
- Timestamp formatter
- Event severity icon mapping

---

### REQ-SYSINFO-007: User Accounts

**Title**: Display System User Accounts

**Description**:
Show list of user accounts with account type, status, and last logon information.

**Acceptance Criteria**:
- Card container with header "User Accounts" and user icon
- Table with columns:
  - Username
  - Full Name
  - Account Type (Administrator/Standard/Guest)
  - Status (Enabled/Disabled)
  - Last Logon
  - Password Last Set
  - Account Created
- Account type badges: Admin=red, Standard=blue, Guest=gray
- Status indicators: Enabled=green dot, Disabled=gray dot
- Filter by account type, status
- Search by username
- Card uses glass variant

**Technical Implementation**:
- User account data structure: username, full_name, account_type, status, last_logon, password_last_set, created_date, sid
- Account type badge with conditional variant
- Status indicator dot
- Filter and search state
- Timestamp formatter for dates
- SID (Security Identifier) display

---

### REQ-SYSINFO-008: Startup Programs

**Title**: Display Auto-Start Programs

**Description**:
Show programs configured to start automatically on boot.

**Acceptance Criteria**:
- Card container with header "Startup Programs" and rocket icon
- Table with columns:
  - Program Name
  - Publisher
  - Status (Enabled/Disabled)
  - Startup Impact (High/Medium/Low)
  - Location (Registry/Startup Folder/Task Scheduler)
  - Command
- Status toggle (enable/disable startup)
- Impact badges color-coded: High=red, Medium=yellow, Low=green
- Search by program name
- Location type filter
- Card uses glass variant

**Technical Implementation**:
- Startup program data structure: name, publisher, enabled, impact, location, command, registry_key
- Status toggle handler
- Impact badge with conditional variant
- Filter state for location
- Search state
- Command display (truncated with tooltip)

---

### REQ-SYSINFO-009: Environment Variables

**Title**: Display System Environment Variables

**Description**:
Show system and user environment variables.

**Acceptance Criteria**:
- Card container with header "Environment Variables" and variable icon
- Two sections: System Variables and User Variables
- Each variable shows:
  - Variable Name
  - Value (truncated with expand button for long values)
  - Scope (System/User)
- Search by variable name
- Expandable values for PATH and other long variables
- Card uses glass variant

**Technical Implementation**:
- Environment variable data structure: name, value, scope
- System and user variable arrays
- Search state
- Expandable value state (Set of expanded variable names)
- Value truncation logic
- Expand/collapse handlers

---

### REQ-SYSINFO-010: System Performance Metrics

**Title**: Display Real-Time System Performance

**Description**:
Show current system performance metrics including CPU, memory, disk, and network usage.

**Acceptance Criteria**:
- Card container with header "Performance Metrics" and chart icon
- Metric displays:
  - CPU Usage (%) with gauge or progress bar
  - Memory Usage (GB and %) with progress bar
  - Disk I/O (Read/Write MB/s)
  - Network I/O (Upload/Download Mbps)
- Real-time updates or refresh
- Historical charts (line charts showing trends over time)
- Color coding: <60%=green, 60-80%=yellow, >80%=red
- Card uses glass variant

**Technical Implementation**:
- Performance data structure: cpu_percent, memory_percent, memory_used_gb, memory_total_gb, disk_read_mbps, disk_write_mbps, network_up_mbps, network_down_mbps
- Real-time update mechanism (WebSocket or polling)
- Progress bar components with percentage
- Gauge components for CPU
- Chart components for historical data
- Color thresholds for usage levels
- Formatting for MB/GB and Mbps values

---

## Data Requirements

**OS Information Structure**:
```typescript
{
  name: string,
  edition: string,
  version: string,
  build: string,
  architecture: string,
  install_date: string,
  license_status: string,
  last_boot: string,
  uptime_hours: number,
  computer_name: string,
  domain: string
}
```

**Hardware Information Structure**:
```typescript
{
  processor: {
    name: string,
    cores: number,
    threads: number,
    speed_ghz: number,
    architecture: string
  },
  memory: {
    total_gb: number,
    available_gb: number,
    usage_percent: number
  },
  storage: [{
    drive_letter: string,
    capacity_gb: number,
    used_gb: number,
    free_gb: number,
    file_system: string,
    type: 'HDD' | 'SSD' | 'Network'
  }],
  graphics: {
    name: string,
    vram_gb: number,
    driver_version: string
  }
}
```

**Process Structure**:
```typescript
{
  pid: number,
  name: string,
  cpu_percent: number,
  memory_mb: number,
  user: string,
  status: 'running' | 'suspended',
  start_time: string,
  executable_path: string
}
```

**Service Structure**:
```typescript
{
  name: string,
  display_name: string,
  status: 'running' | 'stopped',
  startup_type: 'automatic' | 'manual' | 'disabled',
  account: string,
  description: string,
  dependencies: string[]
}
```

**System Event Structure**:
```typescript
{
  id: string,
  timestamp: string,
  level: 'information' | 'warning' | 'error' | 'critical',
  source: string,
  event_id: number,
  message: string,
  details: string
}
```

## Notes
- System information requires elevated privileges on most platforms
- Real-time data (processes, performance) should update every 1-5 seconds
- Process kill operations require admin rights and confirmation
- Service control operations require appropriate permissions
- Large datasets (installed software, events) need pagination
- Performance metrics historical data should be limited (last hour/day)
- Environment variables may contain sensitive information
- Startup program modifications require admin privileges
- Consider cross-platform compatibility (Windows/Linux/macOS)
- Export functionality useful for documentation and reporting
