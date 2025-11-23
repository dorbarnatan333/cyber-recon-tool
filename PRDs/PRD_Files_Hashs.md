# 📄 FULL PRD — File & Hash Intelligence Page

**Template:** Lean PM Product Requirements Document  
**Feature Name:** File & Hash Intelligence Investigation System

---

## 1. Feature Summary

The File & Hash Intelligence page enables penetration testers and security analysts to investigate files across the network using cryptographic hashes (MD5, SHA1, SHA256). The system provides comprehensive visibility into file distribution, threat classification, propagation patterns, and enables custom whitelisting/blacklisting for operational control.

**Core Capabilities:**
- Hash-based file lookup with threat intelligence enrichment
- Cross-network file location tracking
- File registration system with custom tagging
- Propagation timeline visualization
- Bulk hash analysis for incident response
- Automated suspicious file pattern detection

---

## 2. Requirements

### Functional Requirements

**FR1: Hash Input & Normalization**
- Accept MD5 (32 hex), SHA1 (40 hex), SHA256 (64 hex) formats
- Support direct file upload (system calculates hash)
- Auto-detect hash type based on length
- Strip whitespace, convert to uppercase
- Validate hex format before processing

**FR2: Hash Lookup & Enrichment**
- Query internal database for hash matches
- Integrate with VirusTotal API (if configured)
- Display file metadata: name, size, type, MIME type
- Show digital signature status (signed/unsigned/invalid)
- Display known malware family classification
- Show first seen / last seen timestamps
- Include prevalence score (how common across network)

**FR3: Cross-Network File Location Search**
- Search all monitored endpoints for matching hash
- Return results table with columns:
  - Hostname
  - Full file path
  - User account (owner/creator)
  - First detected timestamp
  - Last modified timestamp
  - Last accessed timestamp
  - File size
  - Execution count (if available from logs)
- Support filtering by hostname, path pattern, date range
- Clickable hostname links to endpoint details

**FR4: File Registration & Tagging System**
- Allow users to tag files with custom labels:
  - `pen-test-tool`
  - `known-malware`
  - `suspicious`
  - `approved-software`
  - `business-critical`
  - Custom tags (user-defined)
- Multi-tag support (one file can have multiple tags)
- Comments field (500 char limit) for context notes
- Display tag author and timestamp
- Team-shared registry (visible to all users)
- Tag inheritance: apply tags to all instances of hash

**FR5: Whitelisting & Blacklisting**
- Whitelist: mark hash as "known-good" → suppress alerts
- Blacklist: mark hash as "known-bad" → trigger alerts
- Whitelist/blacklist persists across all system modules
- Show whitelist/blacklist status in search results
- Auto-alert when blacklisted hash appears on new endpoint
- Audit log of all whitelist/blacklist changes

**FR6: Hash Propagation Timeline**
- Chronological graph showing file spread over time
- X-axis: time, Y-axis: number of endpoints with file
- Plot points for each new endpoint appearance
- Color-code by endpoint risk level or subnet
- Show first appearance location (ground zero)
- Display lateral movement path if detectable
- Overlay network events (user logins, file shares accessed)
- Zoomable time range (last hour, day, week, month, all time)

**FR7: Bulk Hash Analysis**
- Accept pasted list of hashes (up to 1000 per request)
- Accept CSV upload with hash column
- Process all hashes in parallel
- Return results table:
  - Hash
  - Threat status (clean/suspicious/malware/unknown)
  - Prevalence count
  - VirusTotal score (if available)
  - First seen date
  - Tags
- Support exporting results as CSV/JSON
- Show progress indicator during processing
- Handle partial failures gracefully

**FR8: Suspicious File Pattern Detection**
- Auto-flag files matching risk patterns:
  - Unsigned executables in system directories
  - Randomized filenames (regex: `^[a-z0-9]{8,}\.exe$`)
  - Double-extension files (`.pdf.exe`, `.doc.scr`)
  - Scripts in startup folders
  - Files with low prevalence (<5 endpoints)
  - Files with mismatched extensions (PE header but `.txt` extension)
- Display pattern match reason in results
- Configurable detection rules
- Allow users to suppress specific patterns

**FR9: Data Export & Reporting**
- Export single hash investigation as JSON/PDF
- Include all findings: metadata, locations, timeline, tags
- PDF includes embedded graphs and tables
- JSON structured for SIEM ingestion
- Export search history for audit purposes
- Generate IoC (Indicators of Compromise) report format

**FR10: Search History & Bookmarks**
- Store last 100 hash searches per user
- Display search history in sidebar
- Bookmark important hashes for quick access
- Share bookmarks with team members
- Search history includes timestamp and user

**FR11: Integration Points**
- Link to MAC Investigation: "Show network activity from endpoints with this file"
- Link to Live Dashboard: "Set alert if hash appears again"
- API endpoint for external tool queries
- Webhook support for automated alerts
- Export hash lists to SIEM (Splunk, ELK, etc.)

### Inputs

**Primary Inputs:**
- Hash string (MD5/SHA1/SHA256)
- File upload (binary)
- List of hashes (text or CSV)

**Optional Inputs:**
- Search filters: date range, hostname, path pattern
- Scan depth: Basic / Extended / Full History
- Tag assignments
- Whitelist/blacklist designation
- Comment text

### Outputs

**Single Hash Investigation:**
- File metadata card
- Threat classification badge
- VirusTotal score (if available)
- Endpoint location table
- Propagation timeline graph
- Tag list with authors
- Related network events
- Export files (JSON/PDF)

**Bulk Analysis:**
- Results table (sortable/filterable)
- Summary statistics (clean/suspicious/malware counts)
- CSV/JSON export

**Alerts:**
- Real-time notification when blacklisted hash detected
- Email/Slack webhook for critical findings

### Logic Notes

**Hash Normalization:**
```
Input: "aa:bb:cc:dd" or "aabbccdd" or "AABBCCDD"
Output: "AABBCCDD"
Process: Strip non-hex, convert uppercase, validate length
```

**Threat Scoring Logic:**
- VirusTotal score ≥ 5: Malware
- VirusTotal score 1-4: Suspicious
- VirusTotal score 0: Clean (if checked)
- No VirusTotal data + suspicious patterns: Unknown-Suspicious
- Whitelisted: Clean (override)

**Propagation Timeline Calculation:**
```
1. Collect all (endpoint, timestamp) tuples for hash
2. Sort by timestamp ascending
3. For each unique day:
   - Count cumulative endpoints with file
4. Plot as time-series graph
5. Mark anomalies: >10 new endpoints in 1 hour
```

**Bulk Processing:**
- Run hash lookups in parallel (max 50 concurrent)
- Timeout per hash: 5 seconds
- If VirusTotal rate limit hit: queue remainder for background processing
- Return partial results immediately with "Processing..." indicators

**Search Optimization:**
- Index hashes in database for O(1) lookup
- Cache VirusTotal results for 24 hours
- Pre-compute prevalence counts daily

### Edge Cases

**EC1: Hash Not Found**
- Display: "No records found for this hash"
- Offer: "Upload file for analysis" or "Check VirusTotal anyway"

**EC2: Partial Data Available**
- Scenario: Hash found on 3 endpoints but VirusTotal API down
- Action: Show endpoint data + warning banner: "Threat intelligence unavailable"

**EC3: Hash Collision (extremely rare)**
- MD5 collision detected (same MD5, different SHA256)
- Display warning: "Hash collision detected. Use SHA256 for verification."
- Show both conflicting files

**EC4: File Deleted from Endpoint**
- Endpoint reports "file no longer exists"
- Display with strikethrough + "Deleted: [timestamp]"
- Keep historical record

**EC5: Excessive Prevalence**
- Hash found on 10,000+ endpoints (common Windows DLL)
- Display: "Very high prevalence. Likely system file."
- Truncate location list to 100 + "Show all" button

**EC6: Invalid Hash Format**
- User inputs non-hex or wrong length
- Display inline error: "Invalid hash format. Expected 32, 40, or 64 hex characters."

**EC7: VirusTotal Rate Limit**
- Free tier: 4 requests/minute exceeded
- Queue hash for background check
- Display: "Threat intelligence pending..."
- Update UI when result available

**EC8: Conflicting Tags**
- Same hash tagged as both `approved-software` and `malware`
- Display warning: "Conflicting tags detected. Review required."
- Show all tags with timestamps for audit

**EC9: Whitelisted Malware**
- User whitelists a hash, later VirusTotal flags it as malware
- Generate alert: "Whitelisted file now classified as malware"
- Require manual review to maintain whitelist status

**EC10: File Upload Too Large**
- User uploads file >100MB
- Display: "File too large. Provide hash manually or upload smaller sample."

### Acceptance Criteria

**AC1:** User can paste SHA256 hash and retrieve file metadata within 2 seconds (excluding VirusTotal API time)

**AC2:** System correctly identifies file on at least 95% of monitored endpoints where file exists

**AC3:** Propagation timeline graph renders all historical data points without performance degradation (<3 second load for 1 year of data)

**AC4:** Bulk hash analysis processes 1000 hashes in <60 seconds (with cached VirusTotal data)

**AC5:** Whitelisted hash suppresses alerts across all system modules within 30 seconds of tagging

**AC6:** Exported JSON file is valid and includes all data fields specified in FR9

**AC7:** Search history persists across user sessions and displays correctly after logout/login

**AC8:** Suspicious file patterns auto-detect at least 90% of test cases (randomized names, double extensions, etc.)

**AC9:** System gracefully handles VirusTotal API failures without crashing or losing user input

**AC10:** Tag changes are visible to all team members within 10 seconds (shared registry sync)

---

## 3. UX / UI

### User Flow

**Primary Flow: Single Hash Investigation**
```
1. User lands on File & Hash Intelligence page
2. Enters hash in search bar (center of page)
3. Optionally selects scan depth dropdown (Basic/Extended/Full)
4. Clicks "Investigate" button
5. Loading indicator appears (progress spinner)
6. Results page loads with sections:
   - File Metadata Card (top)
   - Threat Classification Badge
   - Endpoint Location Table
   - Propagation Timeline Graph
   - Tags & Comments Section
   - Export Options
7. User can:
   - Add tags
   - Whitelist/blacklist
   - Click endpoints for details
   - Export report
   - Set alert
```

**Secondary Flow: Bulk Hash Analysis**
```
1. User clicks "Bulk Analysis" tab
2. Chooses input method: Paste / Upload CSV
3. Inputs hashes (validates format)
4. Clicks "Analyze All"
5. Progress bar shows X/1000 processed
6. Results table populates incrementally
7. User can:
   - Sort/filter results
   - Export CSV/JSON
   - Click individual hashes for deep dive
```

**Tertiary Flow: File Upload**
```
1. User clicks "Upload File" button
2. File picker opens
3. User selects file (<100MB)
4. System calculates MD5, SHA1, SHA256
5. Displays all three hashes
6. User selects which hash to investigate
7. Proceeds to primary flow (step 4)
```

### UI Layout

**Page Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] File & Hash Intelligence    [User] [Settings]   │
├─────────────────────────────────────────────────────────┤
│  Tabs: [Single Hash] [Bulk Analysis] [Search History]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│         ┌──────────────────────────────────┐            │
│         │  🔍 Enter hash or upload file   │            │
│         │  [_________________________]    │            │
│         │  [Browse File] [Scan Depth ▼]  │            │
│         │         [Investigate]           │            │
│         └──────────────────────────────────┘            │
│                                                          │
│  Recent Searches:                                        │
│  • SHA256:A3F8... (2 min ago) [★]                       │
│  • MD5:D41D8C... (15 min ago) [★]                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Results Page Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Search                        [Export ▼]     │
├─────────────────────────────────────────────────────────┤
│  📄 File Metadata                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Hash: A3F8D2K9E7...                    🔴 MALWARE │   │
│  │ Filename: update.exe                              │   │
│  │ Size: 2.3 MB                                      │   │
│  │ Type: PE32 executable                             │   │
│  │ Signed: ❌ Unsigned                                │   │
│  │ VirusTotal: 23/70 vendors flagged                 │   │
│  │ First Seen: 2024-11-15 08:23 UTC                  │   │
│  │ Prevalence: 8 endpoints                           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📍 Endpoint Locations (8)          [Filter ▼] [Sort ▼] │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Hostname      │ Path          │ User  │ Detected │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ DESKTOP-001   │ C:\Temp\...   │ admin │ 2d ago   │   │
│  │ LAPTOP-042    │ D:\Downloads  │ jdoe  │ 1d ago   │   │
│  │ SERVER-WEB01  │ /tmp/update   │ www   │ 4h ago   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  📈 Propagation Timeline                                 │
│  [Interactive graph: X=time, Y=endpoint count]          │
│                                                          │
│  🏷️ Tags & Comments                                     │
│  [malware] [analyzed] [+Add Tag]                        │
│  💬 "Found during pen-test. Mimikatz variant." -user1   │
│                                                          │
│  ⚙️ Actions                                              │
│  [⚠️ Blacklist] [✓ Whitelist] [🔔 Set Alert]           │
└─────────────────────────────────────────────────────────┘
```

**Bulk Analysis Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Bulk Hash Analysis                                      │
├─────────────────────────────────────────────────────────┤
│  Input Method: [Paste Hashes] [Upload CSV]              │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ Paste hashes (one per line):                   │     │
│  │ A3F8D2K9E7...                                   │     │
│  │ D41D8CD98F00...                                 │     │
│  │ 5D41402ABC4B...                                 │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  [Analyze All (3 hashes)]                                │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Processing: 3/3 (100%)   │
│                                                          │
│  Results:                                    [Export ▼]  │
│  ┌────────────────────────────────────────────────┐     │
│  │ Hash (short) │ Status     │ Prevalence │ Tags  │     │
│  ├────────────────────────────────────────────────┤     │
│  │ A3F8D2...    │ 🔴 Malware │ 8 EPs      │ [mal] │     │
│  │ D41D8C...    │ 🟢 Clean   │ 142 EPs    │ [sys] │     │
│  │ 5D4140...    │ 🟡 Unknown │ 0 EPs      │ -     │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Summary: 1 Malware, 1 Clean, 1 Unknown                 │
└─────────────────────────────────────────────────────────┘
```

### UI Components

**File Metadata Card:**
- White background, subtle border
- Hash displayed in monospace font with copy button
- Threat badge: Red (Malware), Yellow (Suspicious), Green (Clean), Gray (Unknown)
- VirusTotal score as clickable link (opens VT report in new tab)
- All timestamps in user's local timezone
- Expandable "Raw Metadata" section (JSON format)

**Endpoint Location Table:**
- Sortable columns (click header)
- Filterable via search box above table
- Clickable hostname → opens endpoint detail page
- Path truncated with tooltip on hover
- Color-coded last detected: <1h (green), <24h (yellow), >24h (red)
- Pagination: 25 results per page

**Propagation Timeline Graph:**
- Interactive line chart (Chart.js or similar)
- Hover tooltip shows exact timestamp + endpoint count
- Click data point → filter endpoint table to that timeframe
- Zoom controls for time range selection
- Export graph as PNG button

**Tags Section:**
- Tag pills with remove (×) button
- Color-coded by category: blue (approved), red (malware), gray (custom)
- "+Add Tag" opens dropdown with suggestions + free text input
- Tag author shown on hover
- Comments displayed as chat bubbles with timestamps

**Actions Toolbar:**
- Large buttons with icons
- "Blacklist" button: red, shows confirmation modal
- "Whitelist" button: green, shows confirmation modal
- "Set Alert" button: opens modal to configure alert rules
- Disabled state if user lacks permissions

**Search History Sidebar (collapsible):**
- Last 100 searches, newest first
- Shows: truncated hash, timestamp, star (bookmark) icon
- Click entry → loads that investigation
- Star icon → adds to bookmarks (top of list)
- "Clear History" button at bottom

**Export Dropdown:**
- Options: Export as JSON, Export as PDF, Export IoCs (STIX format)
- Shows file size estimate before download
- Progress indicator for large exports

### Visual Design Notes

**Color Palette:**
- Background: #F5F7FA (light gray)
- Primary: #2563EB (blue)
- Success: #10B981 (green)
- Warning: #F59E0B (yellow)
- Danger: #EF4444 (red)
- Text: #1F2937 (dark gray)
- Borders: #E5E7EB (light gray)

**Typography:**
- Headers: 20px bold, sans-serif
- Body: 14px regular, sans-serif
- Code/Hashes: 12px monospace (Courier or Consolas)

**Spacing:**
- Section padding: 24px
- Element margins: 16px
- Button padding: 12px 24px

**Responsiveness:**
- Desktop-first design (min-width 1280px)
- Table scrolls horizontally on smaller screens
- Graph scales proportionally
- Mobile: stack sections vertically

### Interaction Patterns

**Hash Input Field:**
- Real-time validation (green checkmark / red X)
- Auto-format on paste (strip whitespace)
- Placeholder text: "Enter MD5, SHA1, or SHA256 hash"
- Clear button (×) appears when text entered

**File Upload:**
- Drag-and-drop zone (dashed border)
- Click to browse alternative
- Shows file name + size after selection
- Progress bar during hash calculation

**Loading States:**
- Skeleton screens for table rows (shimmer effect)
- Spinner for graph rendering
- "Processing..." text for bulk analysis
- Disable buttons during operations

**Error Handling:**
- Inline error messages below inputs (red text)
- Toast notifications for network errors (top-right)
- Retry buttons for failed operations
- Detailed error logs available in console (for developers)

**Success Feedback:**
- Green toast notification: "Hash investigation complete"
- Button state change: "Investigate" → "✓ Complete" (2 sec)
- Table rows fade in as results populate

### Accessibility

- All interactive elements keyboard-navigable (tab order)
- ARIA labels for screen readers
- High contrast mode support
- Focus indicators (blue outline)
- Alt text for all icons
- Tooltips for abbreviations

---

## 4. Data Sources & Integration

**Required Data Sources:**
- **EDR/Endpoint Agents**: File creation/modification logs, execution events
- **Network File Shares**: SMB/NFS activity logs
- **Email Gateway**: Attachment hashes from quarantine logs
- **Web Proxy**: Downloaded file hashes from HTTP/HTTPS traffic
- **SIEM**: Aggregated file events from multiple sources
- **Asset Inventory**: Hostname-to-IP mappings, system metadata

**External APIs:**
- **VirusTotal API**: Threat intelligence lookups
- **MalwareBazaar**: Additional malware classification
- **Hybrid Analysis**: Sandbox execution reports (optional)

**Database Schema Notes:**
```sql
Table: file_hashes
- hash_md5 (string, indexed)
- hash_sha1 (string, indexed)
- hash_sha256 (string, primary key)
- filename (string)
- size_bytes (integer)
- mime_type (string)
- first_seen (timestamp)
- last_seen (timestamp)
- prevalence_count (integer)
- vt_score (integer, nullable)
- vt_cached_at (timestamp, nullable)
- is_whitelisted (boolean, default false)
- is_blacklisted (boolean, default false)

Table: file_locations
- id (uuid, primary key)
- hash_sha256 (foreign key)
- endpoint_id (foreign key)
- file_path (string)
- user_account (string)
- detected_at (timestamp)
- last_modified (timestamp)
- last_accessed (timestamp)
- is_deleted (boolean)

Table: file_tags
- id (uuid, primary key)
- hash_sha256 (foreign key)
- tag_name (string)
- created_by (user_id)
- created_at (timestamp)
- comment (text, nullable)

Table: search_history
- id (uuid, primary key)
- user_id (foreign key)
- hash_searched (string)
- searched_at (timestamp)
- is_bookmarked (boolean)
```

---

## 5. Performance Requirements

- Hash lookup: <2 seconds (95th percentile)
- Endpoint location search: <3 seconds for 1000 endpoints
- Propagation graph rendering: <3 seconds for 1 year of data
- Bulk analysis throughput: 1000 hashes in <60 seconds
- VirusTotal API timeout: 10 seconds per hash
- Page load time: <1.5 seconds (excluding API calls)
- Database query optimization: Use indexes on hash columns

---

## 6. Security & Privacy

- Role-based access control (RBAC): Admin, Analyst, Read-only
- Audit logging: All whitelist/blacklist changes, tag modifications
- API authentication: JWT tokens with 1-hour expiry
- Rate limiting: 100 hash lookups per user per hour (prevent abuse)
- Data retention: Search history 90 days, file locations indefinite
- PII handling: Usernames anonymized in exports (if configured)
- VirusTotal privacy: Do not submit hashes of sensitive internal files

---

## 7. Testing Strategy

**Unit Tests:**
- Hash normalization logic
- Threat scoring calculations
- Bulk processing queue management

**Integration Tests:**
- VirusTotal API integration (mock responses)
- Database query performance
- Export file generation

**E2E Tests:**
- Complete investigation flow (hash input → results display)
- Bulk analysis with 1000 hashes
- Whitelist/blacklist functionality
- Timeline graph interactions

**Load Tests:**
- 100 concurrent users running hash lookups
- Database performance with 10M file_locations records

**Security Tests:**
- SQL injection attempts in hash input
- Authorization bypass attempts
- Rate limit enforcement

---

## 8. Future Enhancements (Out of Scope)

- YARA rule scanning integration
- Automated malware sandboxing
- Machine learning-based anomaly scoring
- File binary diffing tool
- Network graph visualization (file → endpoints → users)
- Integration with ticketing systems (Jira, ServiceNow)
- Mobile app support

---

**END OF PRD**