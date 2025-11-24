# PRD: Target Management

## Overview
Target configuration and management interface for adding, organizing, and monitoring investigation targets. Supports both individual endpoint targeting (IP, domain, computer, username) and company-wide reconnaissance campaigns.

## Purpose
Enable security analysts to configure investigation targets at various scopes - from individual devices to entire organizations. Provides dual entry points: precise endpoint investigation and broad company-wide discovery. Tracks target status, risk levels, and scan history.

---

## Requirements

### REQ-TARGET-001: Target Statistics Dashboard

**Title**: Display Target Overview Statistics

**Description**:
Show four key metrics summarizing the current target landscape: total targets, active/scanning targets, critical risk targets, and total vulnerabilities across all targets.

**Acceptance Criteria**:
- Display 4 statistic cards in responsive grid (1 column mobile → 4 columns desktop)
- Card 1: Total Targets
  - Count of all targets in system
  - Icon: Target
  - Color: Blue border
- Card 2: Active/Scanning
  - Count of targets with status 'active' or 'scanning'
  - Icon: Search with pulse animation
  - Color: Blue border
- Card 3: Critical Risk
  - Count of targets with risk level 'critical'
  - Icon: AlertTriangle
  - Color: Red/danger border
- Card 4: Total Vulnerabilities
  - Sum of all vulnerabilities across targets
  - Icon: Server
  - Color: Orange/warning border
- Statistics calculated from targets array

**Technical Implementation**:
- Card components with solid variant and colored left borders (4px)
- Grid layout: responsive columns
- Statistics calculations:
  - Total: targets.length
  - Active: filter by status in ['active', 'scanning']
  - Critical: filter by riskLevel === 'critical'
  - Vulnerabilities: sum of vulnerabilities field
- Icons from icon library with consistent sizing
- Pulse animation on active/scanning icon

---

### REQ-TARGET-002: Investigation Mode Tabs

**Title**: Create Tab Navigation for Investigation Entry Points

**Description**:
Provide tabbed interface to switch between Direct Endpoint investigation and Company-Wide discovery modes.

**Acceptance Criteria**:
- Two tabs displayed horizontally:
  1. "Direct Endpoint" with Server icon
  2. "Company-Wide" with Building icon
- Active tab styling:
  - Primary background color
  - Primary border
  - Accent text color
- Inactive tab styling:
  - Transparent/minimal background
  - Gray text
  - Hover effect for interactivity
- Clicking tab switches active form view
- Tab bar has dark background container with rounded corners
- Tabs are equal width (50% each)

**Technical Implementation**:
- State variable for active tab ('direct' | 'company')
- Tab buttons with conditional className based on active state
- Tab container with background and padding
- onClick handlers update active tab state
- Icon + text layout for each tab
- Smooth transition between tab states

---

### REQ-TARGET-003: Direct Endpoint - Target Type Selector

**Title**: Implement Target Type Selection Interface

**Description**:
Provide button grid to select type of endpoint to investigate: IP Address, Domain, Computer, or Username.

**Acceptance Criteria**:
- Display in Direct Endpoint tab
- Label: "Target Type"
- 4 target type buttons in 2x2 grid:
  1. IP Address (Network icon)
  2. Domain (Globe icon)
  3. Computer (Server icon)
  4. Username (User icon)
- Selected type styling:
  - Primary border color
  - Primary background (semi-transparent)
  - Primary/accent text color
- Unselected type styling:
  - Gray border
  - Dark background
  - Gray text
  - Hover: Lighter border and text
- Each button shows icon above label text
- Only one type selectable at a time
- Default selection: IP Address

**Technical Implementation**:
- Form state for selected target type ('ip' | 'domain' | 'computer' | 'username')
- Button grid with 2 columns
- Button elements with click handlers to update type
- Conditional className based on selected state
- Icon component with appropriate mapping
- Type data array: [{ value, label, icon }]

---

### REQ-TARGET-004: Direct Endpoint - Target Value Input

**Title**: Dynamic Input Field for Target Value

**Description**:
Display appropriate input component based on selected target type with validation.

**Acceptance Criteria**:
- Label: "Target Value"
- Input component changes based on target type:
  - **IP Address**: IP input with validation, placeholder "192.168.1.100"
  - **Domain**: Domain input with validation, placeholder "example.com"
  - **Computer**: Generic text input, placeholder "DESKTOP-ABC123"
  - **Username**: Generic text input, placeholder "john.doe"
- IP and Domain inputs show validation feedback
- Validation callbacks log results to console
- All inputs use cyber/matrix styling theme

**Technical Implementation**:
- Conditional rendering of input components based on target type
- Specialized input components for IP and Domain with onValidate callbacks
- Generic input component for Computer and Username
- Form state for target value string
- onChange handlers update target value state
- Validation callbacks: `(isValid: boolean, value: string) => void`
- Input components with cyber variant styling

---

### REQ-TARGET-005: Direct Endpoint - Start Investigation Button

**Title**: Create Start Investigation Action Button

**Description**:
Provide button to initiate investigation on configured direct endpoint target.

**Acceptance Criteria**:
- Button text: "Start Investigation"
- Icon: Plus icon
- Primary variant with glow effect
- Large size for prominence
- Full width of form
- Disabled state when target value is empty
- Clicking button triggers investigation action
- Loading/disabled states prevent duplicate submissions

**Technical Implementation**:
- Button component with primary variant, large size, glow prop
- Full width className
- Disabled prop based on target value validation
- onClick handler function
- Handler logs target configuration or calls API
- Can show loading state during submission

---

### REQ-TARGET-006: Company-Wide - Discovery Method Selector

**Title**: Implement Company Discovery Method Selection

**Description**:
Provide button grid to select company discovery method: Company Name, Domain, or IP Range.

**Acceptance Criteria**:
- Display in Company-Wide tab
- Label: "Company Discovery Method"
- 3 method buttons in horizontal row:
  1. Company Name (Building icon)
  2. Domain (Globe icon)
  3. IP Range (Network icon)
- Selected method styling:
  - Primary border color
  - Primary background (semi-transparent)
  - Primary/accent text color
- Unselected method styling:
  - Gray border
  - Dark background
  - Gray text
  - Hover: Lighter border and text
- Each button shows icon above label text
- Only one method selectable at a time
- Default selection: Company Name

**Technical Implementation**:
- Form state for company type ('name' | 'domain' | 'range')
- Button grid with 3 columns
- Button elements with click handlers to update type
- Conditional className based on selected state
- Icon component with appropriate mapping
- Method data array: [{ value, label, icon }]

---

### REQ-TARGET-007: Company-Wide - Company Information Input

**Title**: Dynamic Input for Company Discovery Data

**Description**:
Display appropriate input component based on selected discovery method.

**Acceptance Criteria**:
- Label: "Company Information"
- Input component changes based on discovery method:
  - **Company Name**: Generic text input, placeholder "Acme Corporation"
  - **Domain**: Domain input with validation, placeholder "acme.com"
  - **IP Range**: Generic text input, placeholder "192.168.0.0/24"
- Domain input shows validation feedback
- Validation callback logs results to console
- All inputs use cyber/matrix styling theme

**Technical Implementation**:
- Conditional rendering based on company type
- Domain input component with onValidate callback for domain method
- Generic input component for name and range methods
- Form state for company value string
- onChange handlers update company value state
- Input components with cyber variant styling

---

### REQ-TARGET-008: Company-Wide - Investigation Warning

**Title**: Display Warning for Company-Wide Scans

**Description**:
Show warning message explaining the scope and duration of company-wide investigations.

**Acceptance Criteria**:
- Warning box with:
  - Warning icon (AlertTriangle)
  - Title: "Company-Wide Investigation"
  - Description: "This will perform network enumeration and may take 10-30 minutes to complete."
- Orange/warning color scheme
- Border and background with warning theme
- Positioned above submit button
- Always visible in Company-Wide tab

**Technical Implementation**:
- Container with warning background color and border
- Flex layout with icon and text content
- AlertTriangle icon with warning color
- Text elements with appropriate sizing
- Warning color scheme: orange/amber borders and backgrounds

---

### REQ-TARGET-009: Company-Wide - Start Discovery Button

**Title**: Create Start Company Discovery Action Button

**Description**:
Provide button to initiate company-wide discovery campaign.

**Acceptance Criteria**:
- Button text: "Start Company Discovery"
- Icon: Search icon
- Matrix/accent variant with glow effect
- Large size for prominence
- Full width of form
- Disabled state when company value is empty
- Clicking button triggers discovery action
- Loading/disabled states prevent duplicate submissions

**Technical Implementation**:
- Button component with matrix variant, large size, glow prop
- Full width className
- Disabled prop based on company value validation
- onClick handler function
- Handler logs company configuration or calls API
- Can show loading state during submission

---

### REQ-TARGET-010: Investigation Guidelines Panel

**Title**: Display Investigation Tips and Best Practices

**Description**:
Show informational panel explaining different investigation types and methods.

**Acceptance Criteria**:
- Card with title "Investigation Guidelines"
- Two sections:
  1. **Direct Endpoint Investigation**
     - IP Address: Direct system scanning and enumeration
     - Domain: DNS resolution and service discovery
     - Computer: NetBIOS and SMB enumeration
     - Username: Account activity and privilege analysis
  2. **Company-Wide Investigation**
     - Company Name: OSINT and public record analysis
     - Domain: Subdomain enumeration and DNS walking
     - IP Range: Network scanning and host discovery
- Info box at bottom:
  - Blue/info color scheme
  - CheckCircle icon
  - Title: "Defensive Security Focus"
  - Description: "All investigations are designed for authorized penetration testing and security assessment."
- Card uses solid variant

**Technical Implementation**:
- Card container with solid variant
- Two section headers with bold text
- Bulleted lists for each method description
- Info box with blue background and border
- CheckCircle icon with blue color
- Proper spacing between sections
- Typography: Medium headings for sections, small text for descriptions

---

### REQ-TARGET-011: Current Targets Table

**Title**: Display Table of All Configured Targets

**Description**:
Show comprehensive table of all targets with search, filtering, and action capabilities.

**Acceptance Criteria**:
- Card container with header and search
- Header: "Current Targets" title with search input on right
- Search input placeholder: "Search targets..."
- Table columns:
  - Target (icon, name, value with monospace)
  - Type (badge with uppercase type)
  - Status (status badge)
  - Risk Level (threat badge)
  - Vulnerabilities (count with color coding)
  - Last Scanned (relative time)
  - OS (operating system or dash if empty)
  - Actions (view, start scan)
- Target icons by type:
  - IP: Network icon
  - Domain: Globe icon
  - Computer: Server icon
  - Username: User icon
  - Company: Building icon
  - Range: Network icon
- Vulnerability count color coding:
  - > 5: Red/danger
  - > 2: Orange/warning
  - Else: Gray
- Action menu includes:
  - View target details
  - Start scan

**Technical Implementation**:
- Card with glass variant
- Table component with defined columns
- Search input in header section
- Target data structure:
  - id, name, type, value, status, lastScanned, vulnerabilities, riskLevel, os, ports
- Icon helper function mapping type to icon
- Badge components for type, status, risk level
- Conditional text coloring for vulnerability count
- Action cell component with view callback and actions array
- Search handler for filtering (can be placeholder)

---

### REQ-TARGET-012: Page Header with Refresh Indicator

**Title**: Create Page Header with Title and Update Status

**Description**:
Display page header with title, description, and last updated indicator.

**Acceptance Criteria**:
- Header section contains:
  - Title: "Target Management" (large heading)
  - Description: "Configure investigation targets and monitor scanning progress"
  - Last updated indicator (right-aligned):
    - Clock icon
    - Text: "Last updated: X seconds ago"
    - Pulsing blue dot indicator
- Header layout: Title/description on left, update info on right
- Update time shows relative time since last refresh

**Technical Implementation**:
- Flex container with space-between layout
- Left section: Title and description
- Right section: Small text with icon and pulse animation
- Clock icon from icon library
- Pulse animation on colored dot (blue)
- Timestamp can be state variable or static for demo

---

### REQ-TARGET-013: Form Container Layout

**Title**: Organize Add Target Forms in Grid Layout

**Description**:
Display investigation form and guidelines panel side-by-side on desktop, stacked on mobile.

**Acceptance Criteria**:
- Two-column grid on desktop (tablet and up)
- Left column: Investigation form (Direct/Company tabs)
- Right column: Investigation Guidelines
- Single column stack on mobile
- Form card has glass variant with primary/accent glow
- Guidelines card has solid variant
- Both cards have appropriate headers and padding

**Technical Implementation**:
- Grid container: 1 column mobile → 2 columns desktop
- Form card with glass variant and glow effect
- Guidelines card with solid variant
- Card headers with titles and descriptions
- Responsive grid breakpoints
- Gap spacing between cards

---

## Data Requirements

**Target Entry Structure**:
```typescript
{
  id: string,                    // 'tgt-001'
  name: string,                  // 'Web Server'
  type: 'ip' | 'domain' | 'computer' | 'username' | 'company' | 'range',
  value: string,                 // '192.168.1.100'
  status: 'active' | 'scanning' | 'completed' | 'failed' | 'pending',
  lastScanned: string,           // '2 hours ago' or ISO timestamp
  vulnerabilities: number,       // 3
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  os?: string,                   // 'Ubuntu 20.04'
  ports?: number[]               // [22, 80, 443, 3306]
}
```

**Form State Structure**:
```typescript
{
  // Direct endpoint
  target: string,           // User input value
  targetType: 'ip' | 'domain' | 'computer' | 'username',

  // Company-wide
  company: string,          // User input value
  companyType: 'name' | 'domain' | 'range'
}
```

**Target Type Options**:
```typescript
[
  { value: 'ip', label: 'IP Address', icon: Network },
  { value: 'domain', label: 'Domain', icon: Globe },
  { value: 'computer', label: 'Computer', icon: Server },
  { value: 'username', label: 'Username', icon: User }
]
```

**Company Discovery Methods**:
```typescript
[
  { value: 'name', label: 'Company Name', icon: Building },
  { value: 'domain', label: 'Domain', icon: Globe },
  { value: 'range', label: 'IP Range', icon: Network }
]
```

## Notes
- Form submissions currently log to console - integrate with target management API
- Search functionality is placeholder - implement filtering logic in production
- Target validation should occur before submission (IP format, domain format, etc.)
- Company-wide investigations may spawn multiple sub-targets/scans
- Investigation duration estimates should be configurable
- Risk levels can be calculated based on vulnerabilities, open ports, and other factors
- OS detection requires active scanning - may not be available for all targets
- Port arrays limited to display first N ports or show count
- Action handlers should navigate to detail views or trigger scan operations
- Consider adding bulk operations (select multiple targets, batch scan) in future iterations
