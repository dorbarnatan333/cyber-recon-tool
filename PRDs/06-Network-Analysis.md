# PRD: Network Analysis

## Overview
Comprehensive network reconnaissance module displaying network configuration, active connections, ARP cache, WiFi profiles, and shared resources. Provides detailed view of target's network footprint and connectivity patterns.

## Purpose
Enable security analysts to investigate network-level artifacts including network adapters, IP/MAC mappings, active connections with process information, saved WiFi credentials, and network shares. Essential for understanding network topology, identifying lateral movement opportunities, and discovering network-based indicators of compromise.

---

## Requirements

### REQ-NETANALYSIS-001: Network Interfaces Display

**Title**: Show All Network Adapters with Configuration Details

**Description**:
Display all network interfaces (Ethernet, WiFi, Virtual) with complete configuration including IP addresses, MAC addresses, gateway, DNS servers, and DHCP settings.

**Acceptance Criteria**:
- Card container with header "Network Interfaces" and Network icon
- Header displays snapshot timestamp
- Each interface displayed as card within container
- Interface card header shows:
  - Connection status indicator (green dot if connected, gray if disconnected)
  - Network type (Ethernet/WiFi/Virtual)
  - Description text
- Interface details in two-column grid:
  - MAC Address (monospace font)
  - IPv4 address (blue/primary color, monospace, or "Not assigned" if null)
  - IPv6 address (monospace font)
  - Default Gateway (monospace, or "None" if null)
  - DNS Servers (comma-separated list, monospace, or "None" if empty)
  - DHCP status (shows DHCP server IP if enabled, "Disabled" otherwise)
- Status indicator with shadow/glow effect when connected
- Hover effect on interface cards
- Card uses glass variant

**Technical Implementation**:
- Card component with glass variant
- Timestamp formatter converting ISO date to readable format
- Interface data structure: id, network_type, description, mac_address, ipv4 (nullable), ipv6, default_gateway (nullable), dns_servers (array), dhcp_enabled, dhcp_server (nullable), status
- Grid layout for details with 2 columns
- Status dot with conditional styling
- Conditional text color for IPv4
- DNS servers array joined with comma separator
- DHCP display logic based on enabled flag and server value

---

### REQ-NETANALYSIS-002: ARP Cache Table

**Title**: Display ARP Cache Entries

**Description**:
Show ARP (Address Resolution Protocol) table entries mapping IP addresses to MAC addresses with entry type (dynamic/static) and interface information.

**Acceptance Criteria**:
- Card container with header "ARP Cache" and Database icon
- Table with columns: Type, IP Address, MAC Address, Interface
- Type badges color-coded: dynamic=blue, static=yellow
- IP and MAC addresses in monospace font
- IP addresses in blue/primary color
- Table rows with hover effect
- Empty state when no ARP entries showing icon, title, and description
- Count footer showing total entries with proper pluralization
- Card uses glass variant

**Technical Implementation**:
- Table component with responsive styling
- ARP entry data structure: id, type ('dynamic' | 'static'), ip_address, mac_address, interface_name
- Badge component with conditional variant
- Monospace font classes for addresses
- Hover background transitions
- Conditional rendering for table vs empty state
- Footer with entry count calculation

---

### REQ-NETANALYSIS-003: Network Connections Display

**Title**: Show Active Network Connections Grouped by Destination

**Description**:
Display active network connections grouped by destination IP:port with expandable details, search functionality, and process information.

**Acceptance Criteria**:
- Card container with header "Network Connections" and Network icon
- Search input at top with placeholder "Search connections..."
- Connections grouped by destination IP:port
- Connection group header shows:
  - Expand/collapse chevron icon
  - Destination IP:port (monospace, bold)
  - Active time range with duration
  - Connection count
  - Protocol badge (TCP=blue, UDP=green)
  - State badge with color coding (Established=green, Listening=blue, TimeWait=yellow, other=red)
- Clicking header toggles expansion
- Expanded view shows individual connections with start/end time, source IP:port, process name and PID
- Search filters by destination IP:port, source IP, process name, protocol
- Empty state for no connections or no search results
- Count footer showing filtered groups and total connections
- Card uses glass variant

**Technical Implementation**:
- Search state variable controlling filter
- Connection grouping logic using reduce operation keyed by destination
- Expandable rows state using Set data structure
- Connection data structure: id, collection_start, collection_end, protocol, source_ip, source_port, dest_ip, dest_port, state, process_name, pid
- Timestamp formatter function
- Duration calculation in minutes
- Protocol and state badge components with conditional variants
- Chevron icon conditional rendering
- Filter function checking multiple fields
- Empty state with conditional messaging

---

### REQ-NETANALYSIS-004: Saved WiFi Connections Display

**Title**: Show Saved WiFi Network Profiles

**Description**:
Display saved WiFi network profiles including SSID, authentication type, password visibility status, connection history, and security details.

**Acceptance Criteria**:
- Card container with header "Saved WiFi Connections" and WiFi icon
- Each WiFi profile displayed as card
- Profile shows: SSID, security type badge, authentication type, password (with show/hide toggle), last connected, auto-connect status, network type
- Security type color coding: WPA3=green, WPA2=blue, WPA=yellow, Open=red
- Empty state when no saved profiles
- Card uses glass variant

**Technical Implementation**:
- WiFi profile data structure: id, ssid, authentication_type, security_type, password (nullable), last_connected, auto_connect, network_type
- Security badge with conditional variant
- Password visibility toggle state
- Timestamp formatter
- Boolean display for auto-connect
- Empty state component

---

### REQ-NETANALYSIS-005: Shared Folders Display

**Title**: Show Network Shares and Folders

**Description**:
Display shared folders/resources accessible on the network including share name, path, permissions, and description.

**Acceptance Criteria**:
- Card container with header "Shared Folders" and Folder icon
- Each share shows: share name, UNC path (monospace), permissions badges, description, share type
- Permission badges color-coded: Full Control=red, Write=orange, Read=blue
- Empty state when no shares
- Card uses glass variant

**Technical Implementation**:
- Share data structure: id, share_name, share_path, permissions (array), description, share_type
- Permission badges mapping array to badge components
- UNC path in monospace font
- Empty state with icon and message
- List or table layout

---

### REQ-NETANALYSIS-006: Page Layout

**Title**: Organize Network Analysis Components

**Description**:
Arrange all network analysis sections in vertical layout with appropriate spacing.

**Acceptance Criteria**:
- Sections in order: Network Interfaces, ARP Cache, Network Connections, Saved WiFi Connections, Shared Folders
- Vertical spacing between sections
- Full-width or max-width container
- Responsive layout

**Technical Implementation**:
- Page container with vertical stack
- Gap spacing between components
- Each section as independent component with data prop
- Max-width wrapper if needed

---

## Data Requirements

**Network Interface Structure**:
```typescript
{
  snapshot_timestamp: string,
  interfaces: [{
    id: string,
    network_type: 'Ethernet' | 'WiFi' | 'Virtual',
    description: string,
    mac_address: string,
    ipv4: string | null,
    ipv6: string,
    default_gateway: string | null,
    dns_servers: string[],
    dhcp_enabled: boolean,
    dhcp_server: string | null,
    status: 'connected' | 'disconnected'
  }]
}
```

**ARP Cache Structure**:
```typescript
{
  arp_entries: [{
    id: string,
    type: 'dynamic' | 'static',
    ip_address: string,
    mac_address: string,
    interface_name: string
  }]
}
```

**Network Connection Structure**:
```typescript
{
  connections: [{
    id: string,
    collection_start: string,
    collection_end: string,
    protocol: string,
    source_ip: string,
    source_port: number,
    dest_ip: string,
    dest_port: number,
    state: string,
    process_name: string,
    pid: number
  }]
}
```

## Notes
- All data from API responses or transformed data
- Consistent timestamp formatting across application
- Network connections may be large datasets - consider pagination
- WiFi passwords should be masked by default
- Shared folders may include administrative shares
- Connection grouping improves readability
- Empty states improve UX
- Monospace fonts for addresses and ports
