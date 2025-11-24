# PRD: Dashboard

## Overview
Security Operations Center (SOC) dashboard providing real-time overview of reconnaissance activities, security metrics, and system status. Central command center for monitoring all investigation activities across the cyber reconnaissance platform.

## Purpose
Enable security analysts to quickly assess current security posture, monitor active operations, and access critical information at a glance. Serves as the landing page and primary navigation hub for the entire application.

---

## Requirements

### REQ-DASH-001: Metrics Cards Display

**Title**: Implement Security Metrics Dashboard Cards

**Description**:
Create four prominent metric cards displaying key security statistics: Active Targets count, Active Scans count with breakdown, Critical Vulnerabilities count, and Security Score.

**Acceptance Criteria**:
- Display 4 metric cards in responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
- Each card contains:
  - Icon (left-aligned, colored based on metric type)
  - Title (e.g., "Active Targets")
  - Primary value (large, bold font)
  - Subtitle/trend information (optional, smaller text)
- Card styling:
  - Color-coded left border (4px width)
  - Glow effects where appropriate
- Card colors:
  - Active Targets: Blue border with primary glow
  - Active Scans: Blue border with matrix glow, pulsing icon animation
  - Critical Vulnerabilities: Red border with danger glow
  - Security Score: Amber border with warning glow
- Values should be dynamic (fetched from state/API)
- Trend indicator for Active Targets showing change (e.g., "+3 this week")
- Active Scans subtitle shows breakdown (e.g., "2 port scans, 1 vuln scan")

**Technical Implementation**:
- Use metric card component with props for title, value, subtitle, icon, trend, glow effect
- Icons: Target, Activity/Pulse, Alert/Warning, Shield (or equivalent from icon library)
- Grid: Responsive grid with appropriate column counts per breakpoint
- Support for optional trend object with value and positive/negative indicator
- Card variants may use different styling approaches (glass, solid, bordered, etc.)

---

### REQ-DASH-002: Recent Activity Timeline

**Title**: Build Recent Activity Timeline Component

**Description**:
Display chronological list of recent system activities including completed scans, detected vulnerabilities, and added targets with status indicators.

**Acceptance Criteria**:
- Display in card container with "Recent Activity" header
- Show 4 recent activity entries
- Each activity entry contains:
  - Status indicator dot (small circle, colored by status)
  - Action description (e.g., "Port scan completed")
  - Target identifier (monospace font, e.g., "192.168.1.100")
  - Timestamp (relative, e.g., "2 minutes ago")
- Entry layout: Horizontal arrangement with status dot, text content, timestamp
- Hover effect: Background highlight on entry hover
- Status color mapping:
  - Success: Green
  - Active: Blue with pulse animation
  - Critical: Red
  - Info: Blue (no animation)
- Activities sorted by most recent first

**Technical Implementation**:
- Container card with glass or translucent styling
- Vertical list layout with consistent spacing between entries
- Activity data structure should include: timestamp, action description, target name, status type
- Status indicator can be implemented as colored dot/circle element
- Hover states for interactive feedback
- Target text should use monospace font family

---

### REQ-DASH-003: Quick Actions Panel

**Title**: Create Quick Actions Panel with Primary Operations

**Description**:
Provide fast-access buttons for common operations including Add Target, Start Scan, Critical Alerts, and Generate Report.

**Acceptance Criteria**:
- Display in card container with "Quick Actions" header
- 4 action buttons arranged in 2x2 grid layout
- Top row buttons (larger size):
  - "Add Target" - Primary style with glow, Plus icon
  - "Start Scan" - Matrix/accent style with glow, Scan icon
- Bottom row buttons (medium size):
  - "Critical Alerts" - Danger/error style, Alert icon
  - "Generate Report" - Secondary style, Shield icon
- All buttons include icon + text label
- Buttons trigger appropriate actions on click (can be console log placeholders)

**Technical Implementation**:
- Card container with glass or solid styling
- Button component with support for:
  - Multiple variants (primary, secondary, danger, ghost, matrix/accent)
  - Size options (small, medium, large)
  - Glow effects
  - Icon + text layout
- Layout: Two rows with appropriate flex/grid spacing
- Click handlers for each action (placeholders acceptable)

---

### REQ-DASH-004: Security Alerts Panel

**Title**: Implement Security Alerts Display with Severity Levels

**Description**:
Display prioritized security alerts showing critical, high, medium, and low severity issues with timestamps.

**Acceptance Criteria**:
- Display 4 security alerts sorted by severity (Critical → High → Medium → Low)
- Each alert contains:
  - Severity indicator/badge (critical/high/medium/low)
  - Alert title (bold, prominent)
  - Description text (2-3 lines)
  - Timestamp (relative time, e.g., "2 minutes ago")
- Alert examples:
  - Critical: "SQL Injection Vulnerability" - Immediate patching required
  - High: "Suspicious Network Activity" - Unusual outbound connections
  - Medium: "Outdated Dependencies" - Security updates required
  - Low: "Certificate Expiring Soon" - 30 days warning
- Visual distinction between severity levels through color coding

**Technical Implementation**:
- Alert card component with severity-based styling
- Severity levels should map to distinct colors (red for critical, orange for high, yellow for medium, blue/gray for low)
- Vertical list layout with spacing between alerts
- Each alert can be a card or list item with appropriate padding and borders
- Section header: "Security Alerts"

---

### REQ-DASH-005: Component Showcase - Buttons

**Title**: Display Button Component Library Examples

**Description**:
Showcase all button variants available in the UI component library for developer reference.

**Acceptance Criteria**:
- Display in card container with "Buttons" header
- Show 6 button variants in horizontal row with wrapping:
  - Primary button
  - Secondary button
  - Danger/error button
  - Ghost/transparent button
  - Matrix/accent button with glow
  - Loading state button (with spinner)
- All buttons same small size for visual consistency
- Card has primary glow effect

**Technical Implementation**:
- Card container with solid variant and glow
- Horizontal flex layout with wrapping and gap spacing
- Button component examples showcasing all available variants
- Loading button should display loading spinner or animation
- Labels can be simple text matching variant name

---

### REQ-DASH-006: Component Showcase - Badge System

**Title**: Display Badge Component Library with All Variants

**Description**:
Showcase badge system including threat levels, status badges, service badges, CVE badges, and general badges.

**Acceptance Criteria**:
- Display in card container with "Badge System" header
- Organize badges in 5 subsections:
  1. **Threat Levels**: Low, Medium, High, Critical badges
  2. **Statuses**: Active, Scanning, Completed, Failed, Pending, Inactive
  3. **Services**: SSH (port 22, secure), HTTP (port 80), HTTPS (port 443, secure), MySQL (port 3306), FTP (port 21)
  4. **Vulnerabilities**: 4 CVE badges with different scores (9.8, 7.2, 4.3, 2.1) showing score-based color coding
  5. **General**: Primary, Secondary, Success, Danger (with glow), Warning, Info, Matrix (with pulse)
- Each subsection has descriptive label
- Badges arranged horizontally with wrapping
- Card uses bordered variant with matrix glow

**Technical Implementation**:
- Card container with bordered styling and glow effect
- Badge components supporting:
  - Threat level badges (with severity-based colors)
  - Status badges (with state indicators and optional animations)
  - Service badges (displaying service name, port, security indicator)
  - CVE badges (showing CVE ID and CVSS score with color coding)
  - General purpose badges (various color variants)
- Subsections organized with labels and horizontal layouts
- Color coding: Critical/high=red, Medium/warning=orange, Low/info=blue, Success=green

---

### REQ-DASH-007: Input Forms Demonstration

**Title**: Display Specialized Input Components for Targets

**Description**:
Demonstrate specialized input components including Search, IP Address, Domain, and Port Range inputs with validation.

**Acceptance Criteria**:
- Display in card container with "Target Input Forms" header
- Show 4 specialized inputs vertically stacked:
  1. **Search Input**: Label "Search Targets", placeholder "Search by IP, domain, or hostname..."
  2. **IP Input**: Label "IP Address", with validation feedback
  3. **Domain Input**: Label "Domain Name", with validation feedback
  4. **Port Input**: Label "Port Range", with validation feedback
- Each input has label above it
- Inputs have appropriate vertical spacing
- Validation callbacks trigger on input change (can log to console)

**Technical Implementation**:
- Card container with glass styling
- Specialized input components:
  - Search input with search icon and search callback
  - IP address input with format validation
  - Domain name input with format validation
  - Port range input with range validation
- Each input should have:
  - Label element
  - Placeholder text
  - Validation callback/handler
  - Visual validation feedback (optional)
- Vertical stack layout with consistent spacing

---

### REQ-DASH-008: Input Variants Showcase

**Title**: Display All Input Component Variants

**Description**:
Showcase different input variants and states including default, filled, cyber/matrix, password, error, and success states.

**Acceptance Criteria**:
- Display in card container with "Input Variants" header
- Show 6 input variants vertically stacked:
  1. Default variant with label "Default Input"
  2. Filled background variant with label "Filled Input"
  3. Cyber/matrix themed variant with label "Cyber Input"
  4. Password type input with cyber styling, label "Password Input"
  5. Error state with error message "This field is required"
  6. Success state with success message "Input validated successfully"
- Each input has appropriate placeholder text
- Consistent vertical spacing between inputs

**Technical Implementation**:
- Card container with glass styling
- Input component supporting:
  - Multiple style variants (default, filled, cyber/matrix)
  - Input types (text, password)
  - Error state with error message display
  - Success state with success message display
- Label styling should be consistent
- Error messages in red/danger color
- Success messages in green/success color

---

### REQ-DASH-009: Port Scan Results Table

**Title**: Implement Port Scan Results Data Table

**Description**:
Display latest port scan findings in a structured table showing ports, protocols, services, versions, states, and risk levels.

**Acceptance Criteria**:
- Display in card container with title "Port Scan Results" and subtitle "Latest scan results for target 192.168.1.100"
- Table columns: Port, Protocol, Service, Version, State, Risk Level
- Show 6 scan results with sample data:
  - Port 22 (SSH, OpenSSH 8.2, open, low risk)
  - Port 80 (HTTP, Apache 2.4.41, open, medium risk)
  - Port 443 (HTTPS, Apache 2.4.41, open, low risk)
  - Port 3306 (MySQL, 8.0.25, open, high risk)
  - Port 21 (FTP, vsftpd 3.0.3, closed, critical risk)
  - Port 8080 (HTTP, no version, filtered, medium risk)
- Table row actions:
  - View details action
  - Copy port number action
- State badges color coded: Open (green), Closed (gray), Filtered (orange)
- Risk badges color coded: Low (blue), Medium (yellow), High (orange), Critical (red)

**Technical Implementation**:
- Card container with glass styling
- Table component with columns for port data
- Data structure should include:
  - Port number (integer)
  - Protocol (string)
  - Service name (string)
  - Version (optional string)
  - State (enum: open/closed/filtered)
  - Risk level (enum: low/medium/high/critical)
- Action callbacks for view details and copy port
- Badge components for state and risk visualization
- Copy to clipboard functionality for port numbers

---

### REQ-DASH-010: Vulnerability Assessment Table

**Title**: Build Vulnerability Assessment Data Table

**Description**:
Display critical and high-priority vulnerabilities in table format showing CVE IDs, titles, severity, CVSS scores, affected ports, and discovery time.

**Acceptance Criteria**:
- Display in card container with title "Vulnerability Assessment" and subtitle "Critical and high-priority vulnerabilities requiring attention"
- Table columns: CVE ID, Title, Severity, CVSS Score, Affected Ports, Discovered At
- Show 4 vulnerabilities with sample data:
  - CVE-2023-1234: SQL Injection (critical, 9.8, ports 80/443/8080, 2 hours ago)
  - CVE-2023-5678: Remote Code Execution (high, 8.1, ports 80/443, 1 day ago)
  - CVE-2023-9012: XSS Vulnerability (medium, 6.1, ports 80/443, 3 days ago)
  - CVE-2023-3456: Information Disclosure (low, 3.7, port 80, 1 week ago)
- Table row actions:
  - View details action
  - Mark as fixed action
- CVE badges show ID and score with color coding
- Severity badges use threat level colors

**Technical Implementation**:
- Card container with glass styling
- Table component with columns for vulnerability data
- Data structure should include:
  - CVE ID (string)
  - Title (string)
  - Severity (enum: low/medium/high/critical)
  - CVSS score (number, 0-10)
  - Affected ports (array of integers)
  - Discovery timestamp (string or date)
- CVE badge component displaying ID and score
- Severity/threat badge component
- Action callbacks for view details and mark as fixed
- CVSS score color coding: 9.0-10.0 (red), 7.0-8.9 (orange), 4.0-6.9 (yellow), 0.0-3.9 (blue)

---

### REQ-DASH-011: Page Header and Layout

**Title**: Create Dashboard Page Header and Layout Structure

**Description**:
Implement page header with title, description, and last updated timestamp. Organize all dashboard sections in responsive grid layout.

**Acceptance Criteria**:
- Page header contains:
  - Title: "Security Operations Center" (large, bold heading)
  - Description: "Real-time monitoring and threat analysis dashboard"
  - Last updated timestamp with clock icon and pulse indicator
- Layout sections in order:
  1. Metrics Cards (4-column grid)
  2. Recent Activity + Quick Actions (2-column grid on desktop)
  3. Security Alerts + Component Showcase (2-column grid on desktop)
  4. Input Forms (2-column grid on desktop)
  5. Port Scan Results Table (full width)
  6. Vulnerability Assessment Table (full width)
- All sections use consistent vertical spacing (24px recommended)
- Responsive: Stack to single column on mobile devices

**Technical Implementation**:
- Page container with vertical spacing between sections
- Header structure:
  - Large heading for title
  - Smaller text for description
  - Right-aligned last updated section with clock icon and animated pulse dot
- Layout grids:
  - Metrics: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
  - Two-column sections: 1 column (mobile) → 2 columns (desktop)
  - Tables: Full width on all breakpoints
- Responsive breakpoints at typical mobile/tablet/desktop widths
- Clock icon and pulse animation indicator for last updated timestamp

---

## Data Requirements

**Mock Data Structures**:

```typescript
// Metrics
{
  activeTargets: 24,
  activeTargetsChange: "+3 this week",
  activeScans: 3,
  activeScanBreakdown: "2 port scans, 1 vuln scan",
  criticalVulnerabilities: 12,
  securityScore: 78
}

// Recent Activities
[
  { time: '2 minutes ago', action: 'Port scan completed', target: '192.168.1.100', status: 'success' },
  { time: '15 minutes ago', action: 'Vulnerability scan started', target: 'web-server-01', status: 'active' },
  { time: '1 hour ago', action: 'Critical vulnerability detected', target: 'database-prod', status: 'critical' },
  { time: '2 hours ago', action: 'New target added', target: '10.0.0.50', status: 'info' }
]

// Port Scan Results
[
  { port: 22, protocol: 'tcp', service: 'SSH', version: 'OpenSSH 8.2', state: 'open', risk: 'low' },
  { port: 80, protocol: 'tcp', service: 'HTTP', version: 'Apache 2.4.41', state: 'open', risk: 'medium' },
  { port: 443, protocol: 'tcp', service: 'HTTPS', version: 'Apache 2.4.41', state: 'open', risk: 'low' },
  { port: 3306, protocol: 'tcp', service: 'MySQL', version: '8.0.25', state: 'open', risk: 'high' },
  { port: 21, protocol: 'tcp', service: 'FTP', version: 'vsftpd 3.0.3', state: 'closed', risk: 'critical' },
  { port: 8080, protocol: 'tcp', service: 'HTTP', state: 'filtered', risk: 'medium' }
]

// Vulnerabilities
[
  {
    cveId: 'CVE-2023-1234',
    title: 'SQL Injection in Authentication Module',
    severity: 'critical',
    cvssScore: 9.8,
    affectedPorts: [80, 443, 8080],
    discoveredAt: '2 hours ago'
  },
  {
    cveId: 'CVE-2023-5678',
    title: 'Remote Code Execution via File Upload',
    severity: 'high',
    cvssScore: 8.1,
    affectedPorts: [80, 443],
    discoveredAt: '1 day ago'
  },
  {
    cveId: 'CVE-2023-9012',
    title: 'Cross-Site Scripting (XSS) Vulnerability',
    severity: 'medium',
    cvssScore: 6.1,
    affectedPorts: [80, 443],
    discoveredAt: '3 days ago'
  },
  {
    cveId: 'CVE-2023-3456',
    title: 'Information Disclosure in Error Messages',
    severity: 'low',
    cvssScore: 3.7,
    affectedPorts: [80],
    discoveredAt: '1 week ago'
  }
]
```

## Notes
- All mock data is hardcoded for demonstration purposes
- Future implementation should replace with API calls or state management
- Component showcase sections are for developer reference and may be hidden/removed in production builds
- Console log callbacks are placeholders for future functionality
- Naming conventions in technical implementation are suggestions - actual component names may vary
- Focus is on functionality and user experience rather than exact implementation details
