# 📋 FULL PRD — Network Analysis for Endpoints

**Template:** Lean PM Product Requirements Document  
**Feature Name:** Network Analysis per Endpoint (Computer / Server / Router)  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## 1. Feature Summary

This feature enables cybersecurity analysts and network teams to investigate a specific endpoint (computer, server, or router) by displaying its most popular network activity data and time-based graphs to identify patterns and unusual spikes.

The system will:
- Accept an endpoint identifier (hostname, IP, or MAC)
- Display endpoint type-specific metrics and statistics
- Visualize time-series graphs with user-selected time ranges (default: last 7 days)
- Automatically detect and highlight anomalies
- Pull data from multiple network sources (using mock data for initial implementation)

---

## 2. Requirements

### 2.1 Functional Requirements

**FR1: Endpoint Identification**
- User inputs endpoint identifier (hostname, IP, or MAC)
- System validates input format
- System looks up endpoint in mock database
- System retrieves endpoint type (Computer / Server / Router)

**FR2: Data Source Integration (Mock Data)**
- DHCP logs (lease history, IP assignments, lease duration)
- ARP cache (MAC-IP mappings, timestamps)
- NetFlow / sFlow (traffic volume, protocols, source/destination)
- Syslogs (security events, authentication attempts, errors)
- Traffic capture metadata (connection counts, packet stats)
- EDR/XDR telemetry (process activity, file access, user sessions)

**FR3: Endpoint Type-Specific Metrics**

**For Computers:**
- Current IP address and hostname
- DHCP lease history (last 10 leases within time range)
- Total bandwidth usage (inbound/outbound in GB/MB)
- Active connections count
- Top 5 connected destinations (IPs/domains)
- Protocol breakdown (HTTP, HTTPS, SMB, DNS, etc.) - percentage distribution
- Failed connection attempts
- DNS query count
- User session information (last login, active sessions)

**For Servers:**
- All Computer metrics +
- Inbound connection count and unique source IPs
- Service port activity breakdown (port 80, 443, 22, 3389, 3306, etc.)
- Failed authentication attempts (SSH, RDP, HTTP auth)
- Top 10 client IPs connecting to server
- Request rate (requests per hour)
- Error rate percentage
- Uptime information

**For Routers:**
- Total traffic throughput (packets forwarded)
- Interface utilization per interface
- Top 10 talkers (devices sending most traffic through router)
- Routing table change count
- Dropped packets count
- ICMP traffic volume
- BGP/OSPF events (if applicable)
- Interface error count

**FR4: Time-Series Graphs with Calendar Selection**
- **Default time range:** Last 7 days
- **Quick presets:** Last 24 hours, Last 7 days, Last 30 days
- **Custom range:** Calendar widget for start/end date selection
- **Automatic granularity adjustment:**
  - Last 24 hours → 5-minute intervals
  - Last 7 days → hourly intervals
  - Last 30 days → daily intervals
  - Custom range > 30 days → daily intervals

**Graphs to display:**
1. Traffic Volume (inbound/outbound bytes over time)
2. Connection Count (active connections over time)
3. Protocol Distribution (stacked area chart showing protocol usage over time)
4. Failed Connection Attempts (line chart over time)

**FR5: Anomaly Detection (Auto-Detection with Mock Data)**
- System automatically flags anomalies based on predefined rules:
  - **Traffic spike:** Traffic volume exceeds 200% of time range average
  - **Connection surge:** Connection count exceeds 300% of time range average
  - **Off-hours activity:** Activity detected between 11 PM - 5 AM local time
  - **Protocol shift:** Sudden increase (>150%) in unusual protocol usage (SMB, RDP, etc.)
  - **Failed authentication spike:** Failed auth attempts exceed 10 per hour
  - **Geographic anomaly:** Connections from unexpected countries (for servers)

**Anomaly data structure:**
```json
{
  "timestamp": "2024-11-15T14:32:00Z",
  "type": "traffic_spike",
  "severity": "high",
  "description": "Traffic volume 325% above average",
  "metric_value": "2.3 GB/hour",
  "average_value": "0.7 GB/hour",
  "affected_metric": "bandwidth"
}
```

**FR6: Export Functionality**
- Export formats: JSON, PDF
- Export includes:
  - Endpoint summary
  - Selected time range
  - All metrics for the time range
  - Graph images (for PDF)
  - Anomaly list
  - Raw events table (top 1000 records)
- Filename format: `endpoint_analysis_{hostname}_{timestamp}.{json|pdf}`

**FR7: Investigation History**
- Store each investigation in local storage / database
- History includes:
  - Endpoint identifier
  - Investigation timestamp
  - Selected time range
  - Quick link to re-run investigation

**FR8: Raw Events Table**
- Paginated table (50 records per page)
- Columns: Timestamp, Event Type, Source, Details, Severity
- Filterable by: Event Type, Source, Severity
- Sortable by: Timestamp (default: newest first)
- Export table data as CSV

---

### 2.2 Inputs

| Input | Type | Validation | Required |
|-------|------|------------|----------|
| Endpoint Identifier | String | Hostname, IPv4/IPv6, or MAC address format | Yes |
| Time Range Preset | Enum | "24h", "7d", "30d" | No (default: "7d") |
| Custom Start Date | ISO Date | Cannot be future date | No |
| Custom End Date | ISO Date | Must be after start date | No |

---

### 2.3 Outputs

| Output | Type | Description |
|--------|------|-------------|
| Endpoint Summary | Object | Type, current IP, MAC, hostname, last seen |
| Key Metrics | Object | Type-specific metrics for selected time range |
| Traffic Graph Data | Array | Time-series data for traffic volume |
| Connection Graph Data | Array | Time-series data for connection counts |
| Protocol Graph Data | Array | Time-series data for protocol distribution |
| Failed Connection Graph Data | Array | Time-series data for failed connections |
| Anomaly List | Array | Detected anomalies with metadata |
| Raw Events | Array | Paginated network events |
| Export File | JSON/PDF | Complete investigation report |

---

### 2.4 Logic Notes

**Endpoint Type Determination:**
- System stores endpoint type in mock database
- No auto-detection logic needed
- Endpoint type determines which metrics to display

**Time Range Handling:**
- On page load: default to last 7 days
- User selects preset → update graphs and metrics immediately
- User selects custom range → validate dates → update graphs and metrics
- All calculations (averages, totals) based on selected time range only

**Graph Data Aggregation:**
- Query mock data source for selected time range
- Determine interval based on time range duration
- Aggregate data points into intervals
- Return array of `{timestamp, value}` objects

**Anomaly Detection Logic:**
```javascript
// Pseudocode
function detectAnomalies(metrics, timeRange) {
  const anomalies = [];
  const avgTraffic = calculateAverage(metrics.traffic);
  
  metrics.traffic.forEach(point => {
    if (point.value > avgTraffic * 2) {
      anomalies.push({
        type: "traffic_spike",
        timestamp: point.timestamp,
        severity: "high",
        description: `Traffic ${Math.round(point.value/avgTraffic*100)}% above average`
      });
    }
  });
  
  // Similar logic for other anomaly types
  return anomalies;
}
```

---

### 2.5 Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Endpoint not found | Display "Endpoint not found in database" message with search suggestions |
| No data in selected time range | Display "No network activity recorded during this period" |
| Custom date range > 90 days | Show warning: "Large time ranges may take longer to load" |
| Future date selected | Disable "Apply" button, show validation error |
| End date before start date | Disable "Apply" button, show validation error |
| Zero anomalies detected | Display "No anomalies detected during this period" |
| Mock data source timeout | Show partial results with warning banner |
| Export file too large (>10 MB) | Prompt user to select smaller time range |

---

### 2.6 Acceptance Criteria

✅ AC1: User can input hostname, IP, or MAC and see endpoint analysis page  
✅ AC2: Default view shows last 7 days of data  
✅ AC3: User can select quick presets (24h, 7d, 30d) and graphs update immediately  
✅ AC4: User can select custom date range via calendar widget  
✅ AC5: Graph granularity adjusts automatically based on time range  
✅ AC6: System displays endpoint type-specific metrics correctly  
✅ AC7: Four time-series graphs are displayed (traffic, connections, protocols, failed attempts)  
✅ AC8: Anomalies are auto-detected and displayed in anomaly panel  
✅ AC9: Raw events table is paginated, filterable, and sortable  
✅ AC10: User can export investigation as JSON or PDF  
✅ AC11: Investigation is saved to history with quick re-run link  
✅ AC12: All edge cases are handled gracefully with user-friendly messages  

---

## 3. UX / UI

### 3.1 User Flow

```
1. User enters endpoint identifier (hostname/IP/MAC)
   ↓
2. System validates input
   ↓
3. System retrieves endpoint data and type
   ↓
4. Loading state (progress spinner)
   ↓
5. Results page displays with default 7-day view:
   - Endpoint Summary Card
   - Key Metrics Panel
   - Time Range Selector (calendar widget)
   - Time-Series Graphs (4 graphs)
   - Anomalies Panel
   - Raw Events Table
   - Quick Actions (Export, Save, Back)
   ↓
6. User interacts with time range selector
   ↓
7. Graphs and metrics update based on selected range
   ↓
8. User reviews anomalies and raw events
   ↓
9. User exports report or saves investigation
```

---

### 3.2 UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  [← Back to Results]   Network Analysis: laptop-034              │
│                                                        [Export ▾] │
├──────────────────────────────────────────────────────────────────┤
│  📊 ENDPOINT SUMMARY                                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Type: Computer                                             │ │
│  │ Hostname: laptop-034                                       │ │
│  │ IP: 10.0.5.23          MAC: AA:BB:CC:DD:EE:FF             │ │
│  │ Last Seen: 2 minutes ago                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  🔢 KEY METRICS (Last 7 Days)                                    │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ Total Traffic│  Connections │ Top Protocol │Failed Conn.  │ │
│  │  16.2 GB     │    1,234     │ HTTPS (78%)  │     12       │ │
│  │ ↑12.5 ↓3.7   │   45 active  │              │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  📈 TIME RANGE SELECTION                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [Last 24h] [Last 7d ✓] [Last 30d] [Custom Range]          │ │
│  │ [📅 Start: Nov 11] [📅 End: Nov 18] [Apply]               │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  📊 TRAFFIC VOLUME OVER TIME                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │        [Interactive Line Chart]                            │ │
│  │        Inbound (blue) / Outbound (orange)                  │ │
│  │        Granularity: Hourly                                 │ │
│  │        ⚠️ Spike detected: Nov 15, 14:32                    │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  🔌 CONNECTION COUNT OVER TIME                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │        [Interactive Line Chart]                            │ │
│  │        Active connections                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  🌐 PROTOCOL DISTRIBUTION OVER TIME                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │        [Stacked Area Chart]                                │ │
│  │        HTTPS, HTTP, SMB, DNS, Other                        │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  ❌ FAILED CONNECTION ATTEMPTS OVER TIME                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │        [Line Chart]                                        │ │
│  │        Failed connection attempts                          │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  ⚠️  ANOMALIES DETECTED (3)                      [View All →]   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Nov 15, 14:32 - Traffic Spike                          │ │
│  │    Traffic volume 325% above average (2.3 GB/hour)        │ │
│  │                                                            │ │
│  │ 🟡 Nov 16, 02:15 - Off-Hours Activity                     │ │
│  │    DNS queries detected during off-hours                  │ │
│  │                                                            │ │
│  │ 🟠 Nov 17, 09:45 - Protocol Shift                         │ │
│  │    SMB usage increased by 400%                            │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  📋 RAW EVENTS                                   [Export CSV ↓]  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Filters: [Event Type ▾] [Source ▾] [Severity ▾]           │ │
│  │                                                            │ │
│  │ Timestamp        │Event Type│Source    │Details │Severity │ │
│  │ Nov 18 17:42:15 │Connection│NetFlow   │...     │Low      │ │
│  │ Nov 18 17:41:03 │DHCP Lease│DHCP Log  │...     │Info     │ │
│  │ Nov 18 17:39:47 │Failed Con│Syslog    │...     │Medium   │ │
│  │                                                            │ │
│  │ Showing 1-50 of 1,234    [< Prev] [Next >]                │ │
│  └────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                                   │
│  [💾 Save Investigation] [📄 Generate Report] [🔍 Deep Analysis]│
└──────────────────────────────────────────────────────────────────┘
```

---

### 3.3 UI Components

**Calendar Widget:**
- Date picker library (e.g., react-datepicker)
- Two date inputs: Start Date, End Date
- Date format: MMM DD, YYYY (e.g., "Nov 11, 2024")
- Validation: Real-time error messages below inputs
- Apply button: Enabled only when valid range selected

**Graph Components:**
- Charting library: Chart.js or Recharts
- Interactive: Hover to see exact values
- Zoom: Click and drag to zoom into specific time period
- Reset zoom button
- Legend: Show/hide data series
- Responsive: Adjust to container width

**Anomaly Cards:**
- Color-coded severity: Red (High), Orange (Medium), Yellow (Low)
- Icon indicating anomaly type
- Expandable: Click to see full details
- "View All" link opens full anomaly report page

**Raw Events Table:**
- Sortable columns (click header to sort)
- Filter dropdowns with multi-select
- Search box for text search across all columns
- Pagination controls: Previous, Next, Page number
- Row click: Expand to see full event details

---

### 3.4 Interaction Patterns

**Time Range Selection:**
1. User clicks quick preset button → Graphs update immediately with fade-in animation
2. User clicks "Custom Range" → Calendar widget expands
3. User selects start date → End date picker becomes active
4. User selects end date → "Apply" button becomes active
5. User clicks "Apply" → Loading spinner on graphs → Graphs update

**Graph Interactions:**
1. Hover over graph → Tooltip shows exact values at that point
2. Click spike indicator → Jump to anomaly details
3. Click legend item → Toggle visibility of that data series
4. Click and drag → Zoom into selected time period
5. Click "Reset Zoom" → Return to full time range view

**Anomaly Review:**
1. Anomaly panel shows top 3 by severity
2. Click "View All" → Navigate to full anomaly report page
3. Click individual anomaly → Expand to show:
   - Full description
   - Related events
   - Affected metrics graph
   - "Investigate Further" button

---

## 4. Mock Data Structure

### 4.1 Endpoint Data

```json
{
  "endpoint_id": "device-002",
  "type": "Computer",
  "hostname": "laptop-034",
  "current_ip": "10.0.5.23",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "last_seen": "2024-11-18T17:42:00Z",
  "os": "Windows 11",
  "user": "john.doe"
}
```

### 4.2 DHCP Log Data

```json
[
  {
    "timestamp": "2024-11-18T08:30:00Z",
    "mac": "AA:BB:CC:DD:EE:FF",
    "ip_assigned": "10.0.5.23",
    "lease_duration": "86400",
    "dhcp_server": "10.0.1.1"
  }
]
```

### 4.3 Traffic Data

```json
[
  {
    "timestamp": "2024-11-18T17:00:00Z",
    "source_ip": "10.0.5.23",
    "bytes_in": 1048576,
    "bytes_out": 524288,
    "connections": 15,
    "protocols": {
      "https": 65,
      "http": 20,
      "dns": 10,
      "smb": 5
    }
  }
]
```

### 4.4 Anomaly Data

```json
[
  {
    "id": "anomaly-001",
    "timestamp": "2024-11-15T14:32:00Z",
    "type": "traffic_spike",
    "severity": "high",
    "description": "Traffic volume 325% above average",
    "metric_value": "2.3 GB/hour",
    "average_value": "0.7 GB/hour",
    "affected_metric": "bandwidth"
  }
]
```

---

## 5. Technical Notes for Claude Code Agent

### 5.1 Implementation Priority

**Phase 1 (MVP):**
1. Endpoint lookup and validation
2. Mock data generation for all sources
3. Endpoint summary display
4. Key metrics calculation
5. Time range selector with calendar widget
6. Traffic volume graph
7. Basic anomaly detection

**Phase 2:**
1. Remaining 3 graphs (connections, protocols, failed attempts)
2. Anomaly panel with details
3. Raw events table with pagination
4. Export functionality (JSON)

**Phase 3:**
1. PDF export
2. Investigation history
3. Advanced filtering
4. Deep analysis features

### 5.2 Data Generation Guidelines

- Generate realistic mock data for 90 days of history
- Use seeded random for reproducible results
- Include realistic patterns:
  - Higher traffic during business hours (9 AM - 5 PM)
  - Lower traffic during off-hours
  - Weekend traffic differs from weekday
  - Inject 2-3 anomalies per endpoint per 30 days
- Different patterns for different endpoint types

### 5.3 Technology Recommendations

**Frontend:**
- React for UI components
- Chart.js or Recharts for graphs
- react-datepicker for calendar widget
- Tailwind CSS for styling

**Data Storage:**
- IndexedDB for investigation history
- In-memory store for mock data
- JSON files for mock data seed

**Export:**
- json-export for JSON download
- jsPDF for PDF generation
- html2canvas for graph screenshots in PDF

---


