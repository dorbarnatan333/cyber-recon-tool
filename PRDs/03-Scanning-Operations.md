# PRD: Scanning Operations

## Overview
Scan management interface for creating, monitoring, and controlling security scans. Provides scan templates, real-time progress tracking, and comprehensive scan job management with support for multiple scan types and intensities.

## Purpose
Enable security analysts to launch and monitor various types of security scans (port scanning, vulnerability assessment, network discovery, full audits) against targets. Provides visibility into active scans, queued jobs, and scan results with real-time progress updates.

---

## Requirements

### REQ-SCAN-001: Scanning Statistics Dashboard

**Title**: Display Real-Time Scanning Statistics Cards

**Description**:
Show four key metrics related to scanning operations: running scans, queued scans, completed scans today, and new findings.

**Acceptance Criteria**:
- Display 4 statistic cards in responsive grid (1 column mobile → 4 columns desktop)
- Card 1: Running Scans
  - Count of currently active scans
  - Icon: Activity/pulse with animation
  - Color: Blue with matrix/cyan accent border
- Card 2: Queued Scans
  - Count of scans waiting to start
  - Icon: Clock
  - Color: Orange/warning accent border
- Card 3: Completed Today
  - Count of scans finished in current day
  - Icon: CheckCircle
  - Color: Green/success accent border
- Card 4: New Findings
  - Total count of new vulnerabilities/issues found
  - Icon: AlertTriangle
  - Color: Red/danger accent border
- All cards show icon and metric value with label
- Statistics update in real-time or on refresh

**Technical Implementation**:
- Card components with solid variant and colored left borders
- Grid layout: responsive columns (1 → 2 → 4)
- Calculated statistics from scan jobs array:
  - Running: filter by status === 'running'
  - Queued: filter by status === 'queued'
  - Completed: filter by status === 'completed' (today)
  - Findings: sum of vulnerabilities from all scans
- Icons from icon library with appropriate sizes
- Pulse animation on activity icon for running scans

---

### REQ-SCAN-002: Quick Start Scan Form

**Title**: Create Quick Scan Launch Form with Templates

**Description**:
Provide form to quickly launch a security scan with target input and template selection.

**Acceptance Criteria**:
- Form contains two sections:
  1. Target input field
  2. Scan template selector (radio/button group)
- Target Input:
  - Label: "Target"
  - Placeholder: "192.168.1.100 or domain.com"
  - Accepts IP addresses, domains, hostnames, network ranges
  - Cyber/matrix themed styling
- Template Selector:
  - Show first 3 scan templates (quick access)
  - Each template displayed as selectable card with:
    - Icon representing scan type
    - Template name
    - Description text
    - Estimated time
    - Intensity badge (stealth/normal/aggressive)
  - Selected template highlighted with accent border and background
  - Click template to select
- Launch button:
  - Text: "Launch Scan" with Play icon
  - Matrix variant with glow effect
  - Disabled when target empty or no template selected
  - Large size for prominence
  - Full width
- Form container has glass card styling with primary/matrix glow

**Technical Implementation**:
- Card container with glass variant and glow effect
- Form state for target input and selected template ID
- Target input component with cyber variant styling
- Template selection as button group with conditional styling
- Selected state changes border color, background, and text color
- Launch button handler logs scan configuration or triggers scan API
- Disabled state on button based on validation
- Template data structure includes: id, name, type, description, estimatedTime, intensity

---

### REQ-SCAN-003: Scan Templates Library

**Title**: Display All Available Scan Templates

**Description**:
Show complete list of scanning methodologies with details about each template type.

**Acceptance Criteria**:
- Display in card container with title "Scan Templates"
- Show all 6 scan templates:
  1. **Quick Port Scan**: Common ports 1-1000, 5-15 min, normal intensity
  2. **Full Port Scan**: All 65535 ports, 30-60 min, aggressive intensity
  3. **Stealth Scan**: Low-profile scanning, 20-45 min, stealth intensity
  4. **Vulnerability Assessment**: Deep security analysis, 1-3 hours, normal intensity
  5. **Network Discovery**: Host discovery and enumeration, 10-30 min, normal intensity
  6. **Complete Security Audit**: Comprehensive assessment, 2-6 hours, aggressive intensity
- Each template row shows:
  - Scan type icon with color coding
  - Template name and estimated time
  - Intensity badge
  - Settings/configure button (gear icon)
- Icon colors by type:
  - Port scan: Blue/primary
  - Vulnerability scan: Red/danger
  - Discovery: Blue/info
  - Full audit: Orange/warning
- Hoverable rows with background highlight
- Card uses solid variant

**Technical Implementation**:
- Card container with list/grid of template items
- Template item component with horizontal layout
- Icon component with color prop based on scan type
- Badge component for intensity with variant mapping:
  - Stealth → Secondary
  - Normal → Primary
  - Aggressive → Danger
- Configure button with ghost variant
- Template data array with structure: id, name, type, description, estimatedTime, intensity
- Helper functions to map type to icon and color

---

### REQ-SCAN-004: Active Scan Jobs Table

**Title**: Display Active and Recent Scan Jobs in Table

**Description**:
Show all scan jobs (active, completed, failed, queued) in comprehensive table with progress tracking and actions.

**Acceptance Criteria**:
- Table columns:
  - Scan Job (name, ID, type icon)
  - Target (IP/domain with monospace font)
  - Type (badge with scan type)
  - Status (status badge)
  - Progress (progress bar with percentage)
  - Findings (badges for vulnerabilities, ports, services counts)
  - Duration (time elapsed or "In progress")
  - Priority (threat badge: low/normal/high/critical)
  - Actions (pause/resume/stop, view details)
- Progress bar visual:
  - Width proportional to percentage (0-100%)
  - Color based on status: blue (running), green (completed), red (failed), gray (queued)
  - Animated pulse effect when running
  - Percentage text displayed next to bar
- Findings displayed as small badges:
  - Vulnerabilities count with "V" suffix (red background)
  - Ports count with "P" suffix (blue background)
  - Services count with "S" suffix (gray background)
- Status-specific action buttons:
  - Running: Pause button
  - Paused: Resume/Play button
  - All: Stop/Restart option in actions menu
- Card container with glass variant
- Header includes "Active Scan Jobs" title and "View All History" button

**Technical Implementation**:
- Table component with defined columns
- Scan job data structure:
  - id, name, target, type, status, progress, startTime, endTime, duration
  - findings: { ports, vulnerabilities, services, risks }
  - priority level
- Progress bar component:
  - Width calculated from progress percentage
  - Background color mapped from status
  - Conditional pulse animation class
- Findings as inline badge elements with counts
- Action cell with conditional button rendering based on status
- Icon helper function mapping scan type to icon component
- Color helper function mapping type to color class
- Duration formatter handling in-progress vs completed scans
- Row click or action handlers for view details, pause/resume, stop

---

### REQ-SCAN-005: Page Header and Refresh Indicator

**Title**: Create Page Header with Title and Last Refresh Time

**Description**:
Display page header with title, description, and real-time refresh indicator.

**Acceptance Criteria**:
- Header section contains:
  - Title: "Scanning Operations" (large heading)
  - Description: "Monitor and manage active security scans and assessments"
  - Last refresh indicator (right-aligned):
    - Timer icon
    - Text: "Last refresh: X seconds ago"
    - Pulsing blue dot indicator
- Header layout: Title/description on left, refresh info on right
- Refresh time updates automatically or on data refresh

**Technical Implementation**:
- Flex container with space-between layout
- Left section: Title and description with appropriate typography
- Right section: Small text with icon and pulse animation
- Timer icon from icon library
- Pulse animation on colored dot (blue, small circle)
- Refresh timestamp can be state variable updated on data fetch

---

### REQ-SCAN-006: Scan Type Icons and Colors

**Title**: Implement Consistent Icon and Color Coding for Scan Types

**Description**:
Use consistent visual indicators (icons and colors) for different scan types throughout the interface.

**Acceptance Criteria**:
- Icon mapping:
  - Port Scan → Network icon
  - Vulnerability Scan → Shield icon
  - Discovery → Target icon
  - Full Audit → AlertTriangle icon
- Color mapping:
  - Port Scan → Blue/primary
  - Vulnerability Scan → Red/danger
  - Discovery → Blue/info
  - Full Audit → Orange/warning
- Icons used in:
  - Quick start template selector
  - Template library list
  - Scan jobs table (job name column)
- Consistent sizing (~20px for table, ~24px for cards)

**Technical Implementation**:
- Helper function returning icon component based on type string
- Helper function returning color class based on type string
- Icon map object: { 'port-scan': NetworkIcon, 'vuln-scan': ShieldIcon, ... }
- Color map object: { 'port-scan': 'text-primary-400', ... }
- Reusable across components

---

### REQ-SCAN-007: Scan Intensity Badges

**Title**: Display Scan Intensity with Color-Coded Badges

**Description**:
Show scan intensity levels (stealth, normal, aggressive) with appropriately styled badges.

**Acceptance Criteria**:
- Three intensity levels:
  - Stealth: Secondary/gray badge
  - Normal: Primary/blue badge
  - Aggressive: Danger/red badge
- Badge displays intensity name
- Small size badges for compact display
- Used in template selector and template library

**Technical Implementation**:
- Badge component with variant prop
- Intensity to variant mapping:
  - stealth → secondary
  - normal → primary
  - aggressive → danger
- Capitalized or uppercase text
- Helper function for mapping intensity to badge variant

---

### REQ-SCAN-008: Scan Progress Tracking

**Title**: Real-Time Progress Bar for Running Scans

**Description**:
Display dynamic progress bars showing scan completion percentage for active scans.

**Acceptance Criteria**:
- Progress bar container with gray background
- Filled portion shows percentage complete (0-100%)
- Progress bar styling based on status:
  - Running: Blue with pulse animation
  - Completed: Green solid
  - Failed: Red solid
  - Queued/Paused: Gray solid
- Percentage text displayed next to bar (e.g., "67%")
- Bar width animates smoothly when progress updates
- Compact size (~64px width, ~8px height)

**Technical Implementation**:
- Progress container with rounded background
- Inner progress element with dynamic width style
- Width calculated: `${progress}%`
- Conditional class for color and animation based on status
- Transition animation for width changes
- Percentage text element with fixed width for alignment

---

### REQ-SCAN-009: Scan Findings Badges

**Title**: Display Scan Findings as Inline Badges

**Description**:
Show counts of discovered items (vulnerabilities, ports, services) as compact inline badges in scan table.

**Acceptance Criteria**:
- Three finding types displayed:
  - Vulnerabilities: Red/danger background, count + "V" suffix
  - Ports: Blue/primary background, count + "P" suffix
  - Services: Gray/secondary background, count + "S" suffix
- Badges only shown when count > 0
- Small, compact badges (extra small size)
- Displayed horizontally with small gaps
- Example: "3V" "12P" "8S"

**Technical Implementation**:
- Inline badge elements with conditional rendering
- Background colors mapped to finding type
- Text content: count + suffix letter
- Small padding for compact display
- Horizontal flex layout with gap spacing
- Badge visibility conditional on count > 0

---

### REQ-SCAN-010: Scan Control Actions

**Title**: Implement Scan Control Buttons (Pause, Resume, Stop)

**Description**:
Provide action buttons to control scan execution (pause running scans, resume paused scans, stop/restart scans).

**Acceptance Criteria**:
- Action buttons conditional on scan status:
  - **Running scans**: Show Pause button (pause icon)
  - **Paused scans**: Show Resume/Play button (play icon)
  - **All scans**: Show Stop/Restart in actions dropdown/menu
- Pause button:
  - Ghost/minimal variant
  - Pause icon
  - Small size
  - Tooltip: "Pause"
- Resume button:
  - Ghost/minimal variant
  - Play icon
  - Small size
  - Tooltip: "Resume"
- Action menu includes:
  - View details option
  - Stop/Restart option (red/danger color for stop)
- Clicking actions logs to console or triggers scan API

**Technical Implementation**:
- Conditional button rendering based on status
- Button components with ghost variant and small size
- Icon-only buttons with icons from icon library
- Action cell/menu component with dropdown options
- Click handlers for pause, resume, stop actions
- Console logging or API calls for scan control

---

### REQ-SCAN-011: Template Selection State

**Title**: Visual Selection State for Scan Templates

**Description**:
Highlight selected template with distinct visual styling to show active selection.

**Acceptance Criteria**:
- Unselected template:
  - Gray border
  - Dark/translucent background
  - Gray text color
  - Hover: Lighter border
- Selected template:
  - Accent/primary border color
  - Accent/primary background (semi-transparent)
  - Accent/primary text color for title
  - Glow effect (optional)
- Smooth transition between states
- Only one template selectable at a time

**Technical Implementation**:
- Selection state stored in component state
- Conditional className based on selected comparison
- Button element for template card
- onClick handler updates selected template ID
- Transition classes for smooth color changes
- Border color, background color, text color changes
- Template ID comparison: `selectedTemplate === template.id`

---

## Data Requirements

**Scan Job Structure**:
```typescript
{
  id: string,              // 'scan-001'
  name: string,            // 'Production Server Audit'
  target: string,          // '192.168.1.100' or 'mail.acme.com'
  type: 'port-scan' | 'vuln-scan' | 'discovery' | 'full-audit',
  status: 'running' | 'completed' | 'failed' | 'paused' | 'queued',
  progress: number,        // 0-100
  startTime: string,       // '2 hours ago' or ISO timestamp
  endTime?: string,        // '3 hours ago' or ISO timestamp
  duration?: string,       // '45 minutes'
  findings: {
    ports: number,
    vulnerabilities: number,
    services: number,
    risks: number
  },
  priority: 'low' | 'normal' | 'high' | 'critical'
}
```

**Scan Template Structure**:
```typescript
{
  id: string,
  name: string,
  type: 'port-scan' | 'vuln-scan' | 'discovery' | 'full-audit',
  description: string,
  estimatedTime: string,   // '5-15 minutes'
  intensity: 'stealth' | 'normal' | 'aggressive'
}
```

**Statistics Calculation**:
```typescript
{
  running: scanJobs.filter(j => j.status === 'running').length,
  queued: scanJobs.filter(j => j.status === 'queued').length,
  completed: scanJobs.filter(j => j.status === 'completed').length,
  findings: scanJobs.reduce((sum, j) => sum + j.findings.vulnerabilities, 0)
}
```

## Notes
- All mock data is hardcoded for demonstration - replace with real-time API polling in production
- Scan progress should update via WebSocket or polling mechanism in real implementation
- Duration calculation should handle both completed scans and in-progress scans
- Pause/resume functionality requires backend support for scan process control
- Template configuration (gear icon) is placeholder for future feature
- Refresh timestamp can be updated on data fetch or with interval timer
- Action handlers currently log to console - should integrate with scan management API
- Consider adding filters for scan status, scan type, or date range in future iterations
