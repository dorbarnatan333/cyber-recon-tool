Template: Lean PM Product Requirements Document
Feature Name: Network Graph Visualization & Topology Editor
Status: Phase 1 (Visualization) + Phase 2 (Interactive Editing) + Phase 3 (Advanced Features)

1. Feature Summary
Transform the current search results list view into an interactive network graph visualization that displays endpoints as nodes and their relationships as edges. The graph will automatically organize endpoints by subnet, provide visual clustering, and enable intuitive exploration of network topology. Users can click nodes to view details, and in Phase 2, gain full editing capabilities to customize the topology, labels, and relationships. Phase 3 introduces 3D visualization and time-series playback.
Core Value:

Visual pattern recognition for network segmentation
Faster identification of anomalous connections
Intuitive subnet grouping and color-coding
Interactive topology management for documentation and planning
Advanced 3D and temporal analysis capabilities


2. Requirements
Phase 1: Visualization (Read-Only Graph)
Functional Requirements
FR1: Graph Rendering Engine

Use a Neo4j-style force-directed graph layout library (cytoscape.js recommended)
Render all endpoints from search results as nodes
Automatically cluster nodes by subnet using physics-based grouping
Support zoom, pan, and drag interactions
Render graph on canvas or WebGL for performance
Performance target: Handle up to 500 nodes smoothly (< 3 sec initial render, < 1 sec for interactions)

Reasoning: Enterprise networks typically have 100-300 critical devices; 500 provides headroom for large deployments
If >500 nodes, show warning and offer filtering options



FR2: Node Representation

Each endpoint = one node
Node label: Hostname (e.g., "WIDE-SRV-DHCP45")
Node icon: Device type icon (server, workstation, router, wireless)
Node color: Derived from subnet color
Node size: Uniform base size = 30px diameter (configurable via settings)
Node border: 2px solid, color changes on hover (4px) and selection (4px + glow)

FR3: Subnet Grouping & Visualization

Subnet Detection Logic:

Extract subnet from IP address using configurable CIDR mask
Default CIDR: /24 (user can change in settings to /16, /20, /24, /28, /32)
Settings location: Graph toolbar → "Subnet Settings" dropdown
Live update: Changing CIDR immediately re-clusters graph


Create visual cluster zones using convex hulls or shaded background regions
Assign each subnet a unique color from predefined palette
Display subnet label (e.g., "192.168.0.0/24 - Engineering")
Allow collapse/expand of subnet groups
Collapsed subnets show single meta-node with device count

FR4: Edge Representation (Connections)

Connection Data Sources (Priority Order):

Suspicious Activity Correlation: Red edges between nodes with related indicators
Switch CAM Table: Physical connections (same switch, same VLAN)
ARP Cache: Layer 2 communication detected
Syslog Communication: Layer 3/4 traffic logs
DHCP Lease History: Shared DHCP server (weaker connection)


If existing data insufficient:

Add new fields to endpoint model:

connected_devices: Array of MAC/IP addresses seen in communication
last_seen_with: Array of {mac, ip, timestamp, protocol}
switch_port_neighbors: Array of devices on same switch port


Populate from network monitoring modules during data collection


Edge Properties:

Color:

Gray (#CCCCCC) = normal connection
Red (#D0021B) = suspicious activity
Blue (#4A90E2) = same switch/VLAN
Green (#7ED321) = communication detected


Thickness: 1-3px based on connection strength/frequency
Edge label (hover): Connection type + last seen timestamp


Edge Directionality:

Undirected by default (two-way line)
Directed arrow if clear initiator (e.g., client → server in syslog)



FR5: Device Type Icon Mapping

Server (purple icon 🖥️):

OS contains: "Windows Server", "RHEL", "Ubuntu Server", "CentOS", "Debian Server"
OR hostname contains: "SRV", "SERVER"
OR device_type field = "server"


Workstation (blue icon 💻):

OS contains: "Windows 10", "Windows 11", "macOS", "Ubuntu Desktop"
OR hostname contains: "WKS", "DESK", "LAPTOP"
OR device_type field = "workstation"


Router (orange icon 🔀):

Hostname contains: "RTR", "ROUTER", "GATEWAY", "FW", "FIREWALL"
OR device_type field = "router" or "gateway"
OR has 3+ network interfaces


Wireless (green icon 📡):

Device_type field = "wireless" or "access_point"
OR hostname contains: "AP", "WIRELESS"
OR has wireless interface detected


Unknown (gray icon ❓):

No OS or device type detected
Fallback for all unclassified devices



FR6: Subnet Color Palette

Predefined palette of 12 distinct colors:

#4A90E2 (Blue), #50E3C2 (Teal), #F5A623 (Orange), #BD10E0 (Purple)
#7ED321 (Green), #D0021B (Red), #F8E71C (Yellow), #8B572A (Brown)
#9013FE (Violet), #417505 (Dark Green), #FF6B6B (Coral), #4ECDC4 (Cyan)


Color Assignment Logic:

Hash subnet CIDR → Map to palette index (consistent across sessions)
If >12 subnets, cycle through palette with slight shade variations


Store subnet-color mapping in localStorage
Avoid red for subnets (reserved for suspicious activity edges)

FR7: Subnet Naming & Configuration

Default subnet name: CIDR notation (e.g., "192.168.1.0/24")
Subnet Settings UI:

Graph toolbar → "Subnet Settings" button
Modal with:

CIDR Mask Selector: /16 | /20 | /24 | /28 | /32 (radio buttons)
Apply button → Re-clusters graph immediately


Settings persisted in localStorage: graph_settings.subnet_cidr


Display subnet name in cluster label with device count

FR8: Node Interactivity

Click node: Open existing device detail panel (same as current card click)

Panel slides in from right
Shows full endpoint metadata
Includes "View on Graph" button if opened from list view


Hover node: Show tooltip with:

Hostname
IP Address
MAC Address
Last Activity (relative time)
Risk Level (if CRITICAL, show in red)


Double-click node: Center graph on node and highlight all connected edges
Right-click node (Phase 2): Context menu for editing

FR9: Layout Controls

Layout algorithm: Force-directed with subnet gravity

Node repulsion: Strong (prevent overlap)
Edge attraction: Medium (keep connected nodes closer)
Subnet gravity: Strong (pull subnet members into clusters)
Center force: Weak (prevent drift off-screen)


Manual layout: Drag nodes to reposition

Dragged node position saved in session (persists until page refresh)
Pin icon appears on manually positioned nodes


Control buttons (bottom-right overlay):

🔍+ Zoom In
🔍- Zoom Out
⊡ Fit to Screen (zoom/pan to show all nodes)
↻ Reset Layout (re-run physics simulation, clear manual positions)



FR10: Graph Filters & Overlays

Filter Panel (left sidebar, collapsible):

Risk Level: All | CRITICAL | High | Medium | Low (checkboxes)
Device Type: All | Server | Workstation | Router | Wireless (checkboxes)
Subnet: Multi-select dropdown of all detected subnets
Activity: All | Active (< 24h) | Inactive (> 7 days)
Suspicious Activity: Show only nodes with indicators (toggle)


Search Box (top bar):

Search by hostname, IP, or MAC
Matching nodes highlight with pulsing blue border
Non-matching nodes fade to 30% opacity


Suspicious Activity Overlay (toggle button):

Highlights all red edges
Dims normal edges to 20% opacity
Connected suspicious nodes glow red



FR11: Mock Data Generation

Mock Dataset Specifications:

Total endpoints: 80-120 (simulates mid-size enterprise)
Subnets: 6-8 distinct subnets
Device distribution:

Servers: 15-20% (12-24 nodes)
Workstations: 50-60% (40-72 nodes)
Routers: 5-10% (4-12 nodes)
Wireless: 10-15% (8-18 nodes)
Unknown: 5-10% (4-12 nodes)


Risk levels:

CRITICAL: 8-12% (7-14 nodes)
High: 15-20%
Medium: 40-50%
Low: 20-30%


Connections: 120-200 edges

Normal (gray): 65-70%
Same switch/VLAN (blue): 15-20%
Communication (green): 10-15%
Suspicious (red): 8-12%




Realistic Data Patterns:

Servers have 5-15 connections each (hubs)
Workstations have 2-5 connections
Routers connect multiple subnets (cross-subnet edges)
Suspicious nodes form small clusters (2-4 connected)


Mock Data Fields:

All existing endpoint fields (IP, MAC, hostname, OS, ports, users, activity)
Added connection fields: connected_devices, last_seen_with


Data Generation Script:

Create /mock-data/graph-data-generator.js
Export function: generateGraphMockData(nodeCount, subnetCount)
Include realistic hostnames (WIDE-SRV-, WIDE-WKS-, WIDE-RTR-*)
Ensure subnet IP ranges don't overlap



FR12: View Toggle

Toggle Button (top-right):

Icons: List View 📋 | Graph View 🕸️
Position: Next to "Company Dashboard" button
Default: List View (maintains current behavior)


State Preservation:

Filters, search query, selected endpoint persist across view switches
If endpoint selected in list → Highlight in graph
If endpoint clicked in graph → Same detail panel opens


Graph View Replaces: Entire results area (below search bar)


Phase 2: Interactive Editing (Full Topology Management)
Functional Requirements
FR13: Edit Mode Activation

Button: "Edit Topology" (top-right, next to view toggle)
Edit Mode UI Changes:

Yellow 4px border appears around graph canvas
Yellow badge: "Edit Mode" (top-left corner)
Undo/Redo buttons appear (top-right): ↶ Undo | ↷ Redo
Additional buttons appear:

"+ Add Endpoint"
"⤴ Add Connection"
"💾 Save Topology"
"✓ Done Editing"




Auto-save: All changes saved to localStorage every 2 seconds (debounced)
Exit Edit Mode: Click "Done Editing" → Yellow border/badge disappear

FR14: Endpoint Name Editing

Trigger: Right-click node → "Edit Name"
UI:

Inline text input appears on node label
Input pre-filled with current hostname
Max length: 30 characters
Validation: No special characters except hyphen, underscore


Actions:

Enter: Save and close
Esc: Cancel and revert
Click outside: Save and close


Update: Node label updates immediately, saved to localStorage
Undo: Ctrl+Z reverts to previous name

FR15: Add New Endpoint

Trigger: Click "+ Add Endpoint" button
Modal Form:

  ┌─────────────────────────────────────┐
  │ Add New Endpoint                    │
  ├─────────────────────────────────────┤
  │ Hostname: [________________] *      │
  │ IP Address: [___.___.___.___ ] *    │
  │ MAC Address: [__:__:__:__:__:__]    │
  │ Device Type: [Server ▼]             │
  │ Subnet: [Auto: 192.168.1.0/24 ▼]    │
  │ Risk Level: [Low ▼]                 │
  │                                     │
  │          [Cancel] [Add Endpoint]    │
  └─────────────────────────────────────┘

Field Validation:

Hostname: Required, 3-30 chars, alphanumeric + hyphen/underscore
IP Address: Required, valid IPv4 format (xxx.xxx.xxx.xxx)
MAC Address: Optional, valid MAC format (any standard notation)
Device Type: Dropdown (Server, Workstation, Router, Wireless, Unknown)
Subnet: Auto-detected from IP based on current CIDR setting, editable dropdown
Risk Level: Dropdown (Low, Medium, High, CRITICAL)


On Add:

New node appears in appropriate subnet cluster
Default metadata: Last Activity = "Just Added", Open Ports = 0
Node animates in (fade + scale)
Graph re-runs layout for affected cluster


Undo: Ctrl+Z removes newly added endpoint

FR16: Change Endpoint Subnet

Trigger: Right-click node → "Move to Subnet"
Modal:

  ┌─────────────────────────────────────┐
  │ Move [WIDE-SRV-WEB110] to Subnet    │
  ├─────────────────────────────────────┤
  │ Select Subnet:                      │
  │ ○ 192.168.0.0/24 - Management       │
  │ ○ 192.168.1.0/24 - Engineering      │
  │ ○ 10.0.0.0/24 - Guest Wi-Fi         │
  │ ○ + Create New Subnet               │
  │                                     │
  │ □ Update IP address to match subnet │
  │                                     │
  │          [Cancel] [Move]            │
  └─────────────────────────────────────┘

If "Update IP" checked:

Prompt for new IP within subnet range
Validate IP doesn't conflict with existing endpoints


On Move:

Node animates to new cluster (smooth transition, 500ms)
Graph re-runs layout for both old and new clusters
Node color changes to new subnet color


Create New Subnet:

Opens mini-form: Subnet CIDR, Name, Color
Adds subnet to graph, moves node


Undo: Ctrl+Z moves node back to original subnet

FR17: Subnet Name Editing

Trigger: Click subnet label (in cluster)
UI:

Inline text input replaces label
Pre-filled with current name (or CIDR if default)
Max length: 50 characters


Actions:

Enter: Save
Esc: Cancel
Click outside: Save


Update: Cluster label updates immediately, saved to localStorage
Display: Custom name shown everywhere (labels, tooltips, modals)

FR18: Subnet Color Customization

Trigger: Right-click subnet cluster → "Change Color"
Modal:

  ┌─────────────────────────────────────┐
  │ Change Color: 192.168.0.0/24        │
  ├─────────────────────────────────────┤
  │ [Color Picker Widget]               │
  │ Palette: [●●●●●●●●●●●●]             │
  │ Custom Hex: [#______]               │
  │                                     │
  │          [Cancel] [Apply]           │
  └─────────────────────────────────────┘

Color Picker: Use react-color or similar library
On Apply:

All nodes in subnet update to new color (border)
Cluster background updates to new color (20% opacity)
Saved to localStorage


Validation: Ensure sufficient contrast with background (warn if too light/dark)

FR19: Add Connections Between Endpoints

Trigger: Click "⤴ Add Connection" button
Interaction Flow:

Cursor changes to crosshair (+)
Instructions appear: "Click source node, then target node"
User clicks first node → Node highlights (pulsing border)
User clicks second node → Connection dialog opens


Connection Dialog:

  ┌─────────────────────────────────────┐
  │ Add Connection                      │
  │ From: WIDE-SRV-DHCP45               │
  │ To: WIDE-WKS-091                    │
  ├─────────────────────────────────────┤
  │ Connection Type: [Custom ▼]         │
  │   Options: Same VLAN, Switch Port,  │
  │            Communication, Custom    │
  │ Description: [___________________]  │
  │   Max 100 chars                     │
  │ Color: [🎨 Color Picker]            │
  │   Default: Gray                     │
  │ Directionality: [Undirected ▼]      │
  │   Options: Undirected, Source→Target│
  │                                     │
  │          [Cancel] [Add Connection]  │
  └─────────────────────────────────────┘

On Add:

Edge appears with specified properties
Edge animates in (fade + thickness pulse)
Saved to localStorage as custom edge
Undo available (Ctrl+Z)


Validation: Prevent duplicate connections (warn if exists)

FR20: Edit/Delete Connections

Trigger: Click edge → Context menu appears
Context Menu:

  ─────────────────
  Edit Description
  Change Color
  Change Type
  Delete Connection
  ─────────────────

Edit Description:

Inline text input on edge label
Max 100 chars


Change Color:

Small color picker popup
Apply immediately


Change Type:

Dropdown with connection types


Delete Connection:

Confirmation prompt: "Delete connection between [A] and [B]?"
Options: "Delete" | "Cancel"
If auto-detected edge: Can only hide (filter), not delete permanently
If custom edge: Delete permanently from localStorage


Undo: All edit actions reversible with Ctrl+Z

FR21: Delete Endpoint

Trigger: Right-click node → "Delete Endpoint"
Confirmation Modal:

  ┌─────────────────────────────────────┐
  │ Delete Endpoint?                    │
  ├─────────────────────────────────────┤
  │ Delete: WIDE-SRV-WEB110             │
  │ IP: 192.168.0.97                    │
  │                                     │
  │ This will remove:                   │
  │ • The endpoint from the graph       │
  │ • All custom connections (3)        │
  │                                     │
  │ Note: Auto-detected endpoints will  │
  │ reappear on next data refresh.      │
  │                                     │
  │          [Cancel] [Delete]          │
  └─────────────────────────────────────┘

On Delete:

If auto-detected: Only hide from graph (filter), flag as "user_hidden" in localStorage
If custom: Delete permanently from localStorage
Remove all custom edges connected to node
Animate out (fade + shrink)
Graph re-runs layout for affected cluster


Undo: Ctrl+Z restores node and connections

FR22: Save/Load Custom Topologies

Save Topology (Button: "💾 Save Topology"):

Modal:



    ┌─────────────────────────────────────┐
    │ Save Topology                       │
    ├─────────────────────────────────────┤
    │ Filename: [________________.json]   │
    │ Description: [________________]     │
    │                                     │
    │ Save to:                            │
    │ ○ Download as file                  │
    │ ○ Browser storage (localStorage)    │
    │                                     │
    │          [Cancel] [Save]            │
    └─────────────────────────────────────┘

Saved Data (JSON structure):

json    {
      "version": "1.0",
      "saved_at": "2025-11-23T10:30:00Z",
      "description": "Production Network Audit Nov 2025",
      "settings": {
        "subnet_cidr": "/24",
        "view_mode": "graph"
      },
      "custom_nodes": [
        {
          "id": "custom_ep1",
          "hostname": "NEW-SERVER-01",
          "ip": "192.168.2.50",
          "mac": "AA:BB:CC:DD:EE:FF",
          "device_type": "server",
          "subnet": "192.168.2.0/24",
          "risk_level": "low"
        }
      ],
      "node_positions": {
        "ep1": {"x": 100, "y": 200},
        "ep2": {"x": 350, "y": 180}
      },
      "custom_names": {
        "ep1": "Primary DHCP Server",
        "192.168.0.0/24": "Management VLAN"
      },
      "subnet_colors": {
        "192.168.0.0/24": "#4A90E2",
        "192.168.1.0/24": "#50E3C2"
      },
      "custom_edges": [
        {
          "id": "edge1",
          "source": "ep1",
          "target": "ep5",
          "type": "custom",
          "description": "Database replication",
          "color": "#0000FF",
          "directionality": "undirected"
        }
      ],
      "hidden_nodes": ["ep15", "ep23"]
    }
```
  - **On Save:**
    - If "Download": Trigger browser download (filename.json)
    - If "Browser storage": Save to localStorage key `saved_topologies`
    - Toast notification: "Topology saved successfully"
- **Load Topology (Button: "📂 Load Topology"):**
  - Modal:
```
    ┌─────────────────────────────────────┐
    │ Load Topology                       │
    ├─────────────────────────────────────┤
    │ Load from:                          │
    │ ○ Upload file (.json)               │
    │ ○ Browser storage                   │
    │                                     │
    │ [Saved Topologies List]             │
    │ • Prod Network Audit (Nov 23)       │
    │ • Test Lab Config (Nov 20)          │
    │                                     │
    │          [Cancel] [Load]            │
    └─────────────────────────────────────┘
```
  - **On Load:**
    - Parse JSON file
    - Merge with current auto-detected data:
      - Custom nodes added
      - Custom names/colors applied
      - Custom edges added
      - Node positions restored
      - Hidden nodes filtered out
    - If conflict (auto-detected endpoint deleted in topology):
      - Prompt: "Auto-detected device [hostname] was deleted in topology. Keep deleted or restore?"
      - Options: "Restore All" | "Keep Custom" | "Review Each"
    - Graph re-renders with merged data
    - Toast: "Topology loaded successfully"
- **Auto-save to localStorage:**
  - Key: `current_graph_state`
  - Updates every 2 seconds while in edit mode
  - Includes all custom data, positions, settings
  - Restored on page refresh

**FR23: Undo/Redo**
- **Functionality:**
  - Track all editing actions in undo stack
  - Max stack depth: 20 actions
  - Actions include:
    - Edit name, move subnet, add/delete endpoint
    - Add/edit/delete connection
    - Change subnet name/color
    - Node position changes (debounced, grouped)
- **Keyboard Shortcuts:**
  - Ctrl+Z (Cmd+Z on Mac): Undo last action
  - Ctrl+Y (Cmd+Y on Mac): Redo last undone action
  - Ctrl+Shift+Z: Alternative redo
- **UI Buttons:**
  - ↶ Undo (disabled if stack empty, shows tooltip with last action)
  - ↷ Redo (disabled if no redo available)
- **Visual Feedback:**
  - Action executed → Brief toast: "Action undone/redone"
  - Button press → Ripple effect
- **Edge Cases:**
  - Undo after page refresh: Stack cleared, show toast "Undo history cleared"
  - Undo stack overflow: Drop oldest action (FIFO)

**FR24: Export Graph**
- **Button:** "Export ▼" (dropdown)
- **Options:**
  - Export as PNG Image
  - Export as JSON Data
- **Export as PNG:**
  - Capture current graph view as high-res image (2x scale)
  - Filename: `network_graph_YYYYMMDD_HHMMSS.png`
  - Include: Nodes, edges, subnet labels, legend
  - Exclude: UI controls, tooltips
  - Trigger browser download
- **Export as JSON:**
  - Same structure as Save Topology (FR22)
  - Filename: `network_graph_data_YYYYMMDD_HHMMSS.json`
  - Includes all visible nodes, edges, settings
  - Trigger browser download

---

### Phase 3: Advanced Features (3D & Time-Series)

#### Functional Requirements

**FR25: 3D Graph Visualization**
- **Activation:** Toggle button "3D View" (appears after enabling in settings)
- **Rendering Library:** three.js + 3d-force-graph
- **3D Layout:**
  - Nodes positioned in 3D space using force-directed algorithm
  - Z-axis represents subnet hierarchy or risk level (configurable)
  - Camera controls: Rotate (drag), zoom (scroll), pan (right-drag)
- **Node Representation:**
  - 3D spheres colored by subnet
  - Device icons rendered as textures or sprites
  - Node size proportional to connection count
- **Edge Representation:**
  - 3D lines between nodes
  - Line tubes for suspicious connections (thicker, red)
  - Animated particles flowing along edges (optional)
- **Subnet Clustering:**
  - 3D convex hulls or transparent planes
  - Subnet planes positioned at different Z-levels
- **Interactivity:**
  - Click node: Same detail panel
  - Hover: Tooltip follows cursor in 3D space
  - Double-click: Focus camera on node
- **Performance:**
  - Optimize for up to 300 nodes in 3D
  - If >300, show warning and limit to top nodes by risk
- **Toggle:** Switch between 2D and 3D view preserves filters and state

**FR26: Time-Series Playback**
- **Activation:** Button "⏯ Time-Series" (top bar)
- **Time-Series Panel (Bottom Drawer):**
```
  ┌─────────────────────────────────────────────────────────────┐
  │ Network Topology Timeline                                   │
  │ ┌─────────────────────────────────────────────────────────┐ │
  │ │ ◄◄  ◄  ⏸  ►  ►►         Speed: [1x ▼]                 │ │
  │ └─────────────────────────────────────────────────────────┘ │
  │ Timeline: [████████░░░░░░░░░░░░░░░░░░░░░░] Nov 1 - Nov 23  │
  │           ↑ Currently viewing: Nov 15, 2025, 3:00 PM        │
  └─────────────────────────────────────────────────────────────┘

Data Requirements:

Historical endpoint data with timestamps
Track changes: New devices, removed devices, IP changes, connections added/removed
Data source: Existing network monitoring logs
Store snapshots: Daily snapshots of network state


Playback Controls:

◄◄ Jump to start
◄ Previous day/hour (configurable granularity)
⏸ Pause
► Next day/hour
►► Jump to end (current state)
Speed: 1x, 2x, 5x, 10x


Visualization During Playback:

Nodes appear/disappear based on activity timestamps
Edges fade in/out as connections detected/lost
Color changes animate (e.g., risk level increases)
Subnet clusters reorganize as devices move


Timeline Scrubber:

Drag slider to jump to specific date/time
Hover over timeline: Show tooltip with event count
Mark significant events: New device added, suspicious activity spike


Event Annotations:

Display event markers on timeline: "⚠ 5 suspicious connections detected"
Click marker: Jump to that time, highlight affected nodes


Filters During Playback:

All standard filters apply to historical data
Additional filter: "Show only changes" (hide static nodes)


Export:

Export playback as video (MP4) or GIF (future enhancement)
For now: Export snapshots at key timestamps as PNG series




Inputs
Phase 1:

Search results dataset (current endpoint list)
Subnet detection configuration (CIDR mask from settings)
Connection data from existing modules (ARP, CAM, syslog, suspicious activity)
Mock data generator parameters

Phase 2:

User actions: Click, right-click, drag, text input, color picker, file upload
Topology JSON file (load)
localStorage data (auto-save/restore)

Phase 3:

Historical endpoint data (timestamped snapshots)
Network monitoring logs (connection history)
3D view preferences (Z-axis mode, camera angle)


Outputs
Phase 1:

Interactive 2D network graph visualization
Subnet-clustered topology
Device detail panel (on node click)
Filtered graph views (by risk, type, subnet, activity)

Phase 2:

Updated endpoint metadata (custom names, subnets)
Custom edge definitions (connections with descriptions/colors)
Topology JSON file (save/export as file or localStorage)
PNG graph export
Undo/redo history

Phase 3:

3D network graph visualization
Time-series playback animation
Historical snapshots (PNG series)
Event timeline with annotations


Logic Notes
Graph Layout Algorithm:

Force-directed layout (cytoscape-cola or d3-force)
Physics parameters:

Node repulsion strength: 5000 (high, prevent overlap)
Edge attraction strength: 50 (medium, keep connected nodes near)
Subnet cluster gravity: 200 (strong, group subnet members)
Damping factor: 0.9 (smooth animation)


Run simulation for max 1000 iterations or until stable (velocity < threshold)
Manual node drag: Pin node position, disable physics for that node

Subnet Detection & Re-clustering:

On CIDR change: Re-calculate all subnet assignments
Algorithm:

Parse all IPs
Apply CIDR mask (e.g., 192.168.1.180 with /24 → 192.168.1.0/24)
Group endpoints by resulting subnet
Assign colors, create cluster zones
Re-run layout with new clusters


Handle edge cases:

IPs with no subnet (localhost, link-local): Place in "Unassigned" cluster (gray)
Overlapping subnets (e.g., /16 and /24): Prefer most specific (smallest CIDR)



Connection Auto-Detection Logic:

Query existing modules in parallel (max 5 sec timeout each)
Merge results:

Suspicious activity: Highest priority, always create red edge
CAM table: If MAC seen on same switch port, create blue edge
ARP cache: If ARP entry exists, create green edge
Syslog: If communication logged, create green edge (merge with ARP if duplicate)
DHCP lease: Weakest connection, only if no other data (dotted gray edge)


Remove duplicate edges: Keep highest priority connection type
Edge strength/thickness: Based on connection frequency (if available)

Phase 2 Data Merge Logic (Load Topology):

Custom data takes precedence over auto-detected defaults
Merge steps:

Load auto-detected endpoints from current search results
Apply custom names, colors from loaded topology
Add custom nodes (if not in auto-detected set)
Apply node positions (if saved)
Add custom edges
Hide endpoints marked as "user_hidden"
If conflict (auto-detected node deleted in topology):

Show prompt with 3 options
User choice determines final graph state





Phase 3 Time-Series Data Structure:

Store daily snapshots of network state:

json  {
    "snapshot_date": "2025-11-15T00:00:00Z",
    "endpoints": [ /* full endpoint list at this time */ ],
    "connections": [ /* active connections at this time */ ],
    "events": [
      {
        "timestamp": "2025-11-15T14:23:00Z",
        "type": "new_device",
        "device_id": "ep50",
        "description": "New workstation detected"
      },
      {
        "timestamp": "2025-11-15T16:45:00Z",
        "type": "suspicious_connection",
        "source": "ep12",
        "target": "ep23",
        "description": "Lateral movement detected"
      }
    ]
  }
```
- Playback interpolates between snapshots
- Event markers displayed on timeline

---

### Edge Cases

**EC1: No Search Results**
- Display empty state: "No devices found. Run a search to visualize."
- Hide graph view toggle until results exist

**EC2: Single Endpoint**
- Show single node in center
- Display message: "Add more devices or run broader search to see connections."

**EC3: Large Dataset (>500 Nodes)**
- Performance warning modal:
```
  ┌─────────────────────────────────────┐
  │ Large Dataset Detected              │
  ├─────────────────────────────────────┤
  │ Your search returned 732 devices.   │
  │ Displaying all may cause slowness.  │
  │                                     │
  │ Options:                            │
  │ ○ Show top 500 by risk level        │
  │ ○ Filter by subnet (select below)   │
  │ ○ Continue with all (may be slow)   │
  │                                     │
  │          [Apply Filter] [Continue]  │
  └─────────────────────────────────────┘
```
- If user chooses "Continue," show loading indicator
- If too slow (>5 sec render), suggest switching to WebGL renderer

**EC4: No Connections Between Endpoints**
- Display nodes in subnet clusters (no edges)
- Message: "No connections detected. Add custom connections or check data sources."
- Suggest: "Enable 'Show all potential connections' to see subnet-based grouping"

**EC5: Overlapping Subnet Ranges (Different CIDR Masks)**
- If IP belongs to multiple subnets (e.g., 192.168.1.5 matches both /16 and /24):
  - Assign to most specific (smallest) subnet
  - Show info icon on node: Hover displays "Also belongs to 192.168.0.0/16"

**EC6: Custom Topology Merge Conflict (Phase 2)**
- Prompt appears on load:
```
  ┌─────────────────────────────────────┐
  │ Topology Conflict                   │
  ├─────────────────────────────────────┤
  │ The loaded topology has 3 devices   │
  │ that no longer exist in current     │
  │ search results:                     │
  │ • WIDE-SRV-OLD01                    │
  │ • WIDE-WKS-RETIRED                  │
  │ • WIDE-RTR-LEGACY                   │
  │                                     │
  │ Action:                             │
  │ ○ Restore all (add to graph)        │
  │ ○ Keep custom (ignore missing)      │
  │ ○ Review each individually          │
  │                                     │
  │          [Cancel] [Apply]           │
  └─────────────────────────────────────┘
```
- If "Review each": Show list with checkboxes to restore individually

**EC7: Invalid Input in Add Endpoint (Phase 2)**
- **Invalid IP format:**
  - Error message below field: "Invalid IP address format"
  - Highlight field in red
  - Disable "Add Endpoint" button until valid
- **Duplicate IP:**
  - Warning modal: "IP 192.168.1.50 already exists on [hostname]. Continue?"
  - Options: "Edit Existing" | "Add Anyway" | "Cancel"
- **Invalid MAC format:**
  - Auto-format as user types (add colons)
  - Error if invalid characters: "MAC must be hexadecimal"

**EC8: Delete Endpoint with Connections (Phase 2)**
- Confirmation modal:
```
  ┌─────────────────────────────────────┐
  │ Delete Endpoint?                    │
  ├─────────────────────────────────────┤
  │ Deleting WIDE-SRV-WEB110 will       │
  │ remove 5 connections:               │
  │ • 3 custom connections              │
  │ • 2 auto-detected connections       │
  │                                     │
  │ Auto-detected data will return on   │
  │ next refresh.                       │
  │                                     │
  │          [Cancel] [Delete]          │
  └─────────────────────────────────────┘
```
- If only auto-detected connections: "This device will be hidden (can restore via filters)"

**EC9: Circular Connection / Self-Edge (Phase 2)**
- When adding connection, if source === target:
  - Warning modal: "This creates a self-connection (loopback). Continue?"
  - Options: "Add Anyway" | "Cancel"
  - If added: Display as circular edge around node

**EC10: Undo After Page Refresh (Phase 2)**
- On page load, check if `current_graph_state` exists in localStorage
- If exists: Restore state (custom nodes, edges, positions, settings)
- Undo stack cleared: Show toast "Undo history cleared. Last saved state restored."
- User can continue editing, new undo stack starts fresh

**EC11: CIDR Change with Custom Positions (Phase 2)**
- If user changes CIDR in settings while nodes have custom positions:
  - Warning modal: "Changing CIDR will reset node positions. Continue?"
  - Options: "Reset Positions" | "Keep Positions" | "Cancel"
  - If "Reset": Clear positions, re-run layout
  - If "Keep": Maintain positions, but subnet clusters may not align

**EC12: 3D View Performance Degradation (Phase 3)**
- If 3D rendering FPS drops below 15:
  - Show toast: "3D performance low. Reduce node count or switch to 2D."
  - Auto-disable animations (no edge particles)
  - Offer "Simplified 3D" mode (no textures, basic shapes)

**EC13: Time-Series Data Not Available (Phase 3)**
- If no historical snapshots exist:
  - Display message: "No historical data available. Time-series requires daily snapshots."
  - Show current state only
  - Suggest: "Enable network monitoring to start collecting historical data."

**EC14: Time-Series Playback with Custom Topology (Phase 3)**
- Custom topology only reflects current state
- During playback: Only show auto-detected historical data
- Warning: "Custom nodes/edges hidden during playback (historical data only)"

---

## 3. UX / UI

### User Flow (Phase 1)

1. **Search & View Toggle:**
   - User runs search (existing flow)
   - Results appear in List View (default)
   - User clicks "Graph View 🕸️" toggle button (top-right)
   - Loading indicator: "Generating network graph..."
   - Graph renders with animation (nodes fade in, settle into clusters over 2 seconds)

2. **Initial Exploration:**
   - User sees full topology: Nodes clustered by subnet, edges connecting devices
   - User pans by dragging canvas
   - User zooms with mouse wheel or pinch gesture
   - User drags individual node → Node position updates, others readjust

3. **Hover & Click:**
   - User hovers over node → Tooltip appears near cursor
   - User clicks node → Device detail panel slides in from right (same as list view)
   - User double-clicks node → Graph centers on node, highlights connected edges (red glow)

4. **Filtering:**
   - User clicks "Filters ▼" button → Filter panel slides in from left
   - User checks "CRITICAL only" → Graph updates: Non-critical nodes fade out
   - User selects subnet "192.168.1.0/24" → Only that subnet visible
   - User searches "DHCP" → Matching nodes highlight with pulsing blue border

5. **Subnet Interaction:**
   - User clicks subnet label "Engineering" → All nodes in subnet highlight
   - User right-clicks subnet cluster → Context menu: "Collapse Subnet" | "Expand Subnet"
   - User selects "Collapse" → Subnet becomes single meta-node showing device count

6. **Layout Controls:**
   - User clicks "Fit to Screen ⊡" → Graph zooms/pans to show all nodes
   - User manually drags 10 nodes to custom positions
   - User clicks "Reset Layout ↻" → Confirmation: "Reset layout? Custom positions will be lost."
   - User confirms → Graph re-runs physics, nodes animate to new positions

7. **Suspicious Activity Overlay:**
   - User toggles "Suspicious Activity" button → Red edges highlight, normal edges dim
   - User clicks red edge → Detail panel shows: "Lateral movement detected between [A] and [B]"

8. **Switch Views:**
   - User clicks "List View 📋" toggle → Returns to original list
   - Filters, search, and selected endpoint persist
   - If endpoint was selected in graph, same endpoint highlighted in list

---

### User Flow (Phase 2)

1. **Activate Edit Mode:**
   - User clicks "Edit Topology" button (top-right)
   - Yellow border appears around graph
   - Toast: "Edit mode activated. Changes auto-save to browser storage."
   - Edit buttons appear: "+ Add Endpoint", "⤴ Add Connection", etc.

2. **Edit Endpoint Name:**
   - User right-clicks node "WIDE-SRV-DHCP45" → Context menu appears
   - User selects "Edit Name"
   - Inline text input appears on node label, pre-filled with "WIDE-SRV-DHCP45"
   - User types "Primary DHCP Server", presses Enter
   - Node label updates immediately
   - Toast (subtle, bottom-right): "Name updated"

3. **Add New Endpoint:**
   - User clicks "+ Add Endpoint" button
   - Modal form appears (centered)
   - User fills: Hostname "TEST-SERVER-01", IP "192.168.2.50", Type "Server"
   - User clicks "Add Endpoint"
   - Modal closes
   - New node animates in (fade + scale) in "192.168.2.0/24" cluster
   - Toast: "Endpoint added"

4. **Move Endpoint to Different Subnet:**
   - User right-clicks node "TEST-SERVER-01" → "Move to Subnet"
   - Modal shows subnet list
   - User selects "192.168.0.0/24 - Management"
   - Checkbox "Update IP address" checked by default
   - User clicks "Move"
   - Node animates to new cluster (smooth 500ms transition)
   - IP updates to "192.168.0.50" (auto-incremented to next available)
   - Toast: "Endpoint moved to Management subnet"

5. **Customize Subnet:**
   - User right-clicks "Engineering" subnet cluster → "Change Color"
   - Color picker modal appears
   - User selects bright orange (#FF5722)
   - User clicks "Apply"
   - All nodes in subnet update border color
   - Cluster background updates to orange (20% opacity)
   - Toast: "Subnet color updated"

6. **Add Custom Connection:**
   - User clicks "⤴ Add Connection" button
   - Cursor changes to crosshair, instructions appear at top
   - User clicks "WIDE-SRV-DHCP45" → Node highlights (pulsing)
   - User clicks "WIDE-WKS-091" → Connection dialog opens
   - User enters: Type "Custom", Description "Backup sync", Color blue
   - User clicks "Add Connection"
   - Blue edge appears between nodes with animation (fade in + thickness pulse)
   - Toast: "Connection added"

7. **Edit Connection:**
   - User clicks blue edge between nodes
   - Context menu: "Edit Description" | "Change Color" | "Delete Connection"
   - User selects "Edit Description"
   - Inline text input appears on edge label
   - User changes to "Primary backup sync", presses Enter
   - Edge label updates
   - Toast: "Connection updated"

8. **Undo Action:**
   - User presses Ctrl+Z
   - Last action (connection edit) reverts
   - Toast: "Action undone"
   - Undo button shows previous action in tooltip: "Undo: Move endpoint"

9. **Save Topology:**
   - User clicks "💾 Save Topology" button
   - Modal appears: "Save Topology"
   - User enters filename "Prod_Network_Audit_Nov2025"
   - User selects "Download as file"
   - User clicks "Save"
   - Browser downloads `Prod_Network_Audit_Nov2025.json`
   - Toast: "Topology saved successfully"

10. **Exit Edit Mode:**
    - User clicks "✓ Done Editing"
    - Yellow border disappears
    - Edit buttons hide
    - Toast: "Changes saved to browser storage"
    - User can continue viewing/filtering graph in read-only mode

---

### User Flow (Phase 3)

**3D View:**

1. **Enable 3D:**
   - User clicks "3D View" toggle button (top-right, next to 2D/3D selector)
   - Loading: "Rendering 3D graph..."
   - Graph transforms: Nodes animate to 3D positions (2 second transition)
   - Camera positioned at 45° angle, centered on graph

2. **Navigate 3D Space:**
   - User drags canvas → Camera rotates around graph center
   - User scrolls → Camera zooms in/out
   - User right-drags → Camera pans (X/Y movement)
   - User double-clicks node → Camera focuses on node (smooth animation)

3. **Interact in 3D:**
   - User hovers node → Tooltip appears, follows cursor in screen space
   - User clicks node → Detail panel opens (same as 2D)
   - User clicks edge → Edge highlights, shows tooltip with connection type
   - Subnet clusters: Transparent 3D hulls or planes at different Z-levels

4. **Switch Back to 2D:**
   - User clicks "2D View" toggle
   - Graph animates back to 2D layout (nodes flatten to Z=0)
   - All filters, selections preserved

**Time-Series Playback:**

1. **Open Time-Series Panel:**
   - User clicks "⏯ Time-Series" button (top bar)
   - Bottom drawer slides up (30% of screen height)
   - Timeline appears: Spanning earliest to latest data (e.g., Nov 1 - Nov 23)
   - Playback controls centered
   - Current view: Latest state (Nov 23, paused)

2. **Scrub Timeline:**
   - User drags slider to Nov 10
   - Graph updates: Nodes disappear if not active on Nov 10, edges adjust
   - Tooltip shows: "Nov 10, 2025 - 45 active devices, 2 new connections"

3. **Play Animation:**
   - User clicks "►" play button
   - Timeline advances (1 day per second at 1x speed)
   - Graph animates: Nodes appear/disappear, edges fade in/out, colors change
   - Event markers pass: "⚠ Nov 15: Suspicious activity spike"

4. **Investigate Event:**
   - User clicks event marker "⚠ Nov 15"
   - Playback pauses
   - Graph jumps to Nov 15, affected nodes highlight red
   - Detail panel opens: "5 suspicious connections detected at 2:30 PM"

5. **Adjust Speed:**
   - User clicks speed dropdown → Selects "5x"
   - Playback continues at 5 days per second
   - User can pause, jump to start/end, or scrub at any time

6. **Close Time-Series:**
   - User clicks "✕" close button on panel
   - Panel slides down
   - Graph returns to current state (Nov 23)

---

### UI Components (Detailed)

**Top Bar (Graph View):**
```
┌───────────────────────────────────────────────────────────────────────────┐
│ [← Back] [List 📋 | Graph 🕸️] [🔍 Search____________] [Filters ▼]        │
│                    [Subnet Settings ▼] [Export ▼] [Edit Topology]        │
│                    [🎛️ Company Dashboard]                                 │
└───────────────────────────────────────────────────────────────────────────┘
```

**Graph Controls (Bottom-Right Overlay):**
```
┌─────────────┐
│ 🔍+ Zoom In │
│ 🔍- Zoom Out│
│ ⊡ Fit Screen│
│ ↻ Reset     │
│ [2D | 3D]   │
│ ⏯ Timeline  │
└─────────────┘
```

**Edit Mode Controls (Top-Right):**
```
┌──────────────────────────────────────────────────────────┐
│ [+ Add Endpoint] [⤴ Add Connection]                     │
│ [↶ Undo] [↷ Redo] [💾 Save] [📂 Load] [✓ Done Editing] │
└──────────────────────────────────────────────────────────┘
```

**Filter Panel (Left Sidebar, Collapsible):**
```
┌───────────────────────────┐
│ Filters              [✕]  │
├───────────────────────────┤
│ Risk Level:               │
│ ☑ CRITICAL                │
│ ☑ High                    │
│ ☑ Medium                  │
│ ☑ Low                     │
│                           │
│ Device Type:              │
│ ☑ Server                  │
│ ☑ Workstation             │
│ ☑ Router                  │
│ ☑ Wireless                │
│ ☑ Unknown                 │
│                           │
│ Subnet:                   │
│ [Select subnets... ▼]     │
│                           │
│ Activity:                 │
│ ○ All                     │
│ ○ Active (< 24h)          │
│ ○ Inactive (> 7 days)     │
│                           │
│ ☐ Suspicious Only         │
│                           │
│ [Apply Filters]           │
└───────────────────────────┘
```

**Node Tooltip (Hover):**
```
┌─────────────────────────────┐
│ WIDE-SRV-DHCP45             │
│ IP: 192.168.0.20            │
│ MAC: 52:54:00:44:45:02      │
│ Last Activity: 19 hours ago │
│ Risk: 🔴 CRITICAL           │
│ Open Ports: 13              │
│ Connections: 8              │
└─────────────────────────────┘
```

**Subnet Cluster Label:**
```
┌──────────────────────────────────────┐
│ 192.168.0.0/24 - Engineering         │
│ 12 devices  [✏ Edit] [▼ Collapse]    │
└──────────────────────────────────────┘
```

**Right-Click Context Menu (Node):**
```
────────────────────
View Details
Edit Name
Move to Subnet
Delete Endpoint
Add Connection
────────────────────
```

**Right-Click Context Menu (Edge):**
```
────────────────────
Edit Description
Change Color
Change Type
Delete Connection
────────────────────
```

**Right-Click Context Menu (Subnet Cluster):**
```
────────────────────
Edit Subnet Name
Change Color
Collapse Subnet
Expand Subnet
────────────────────
```

**Add Endpoint Modal:**
```
┌─────────────────────────────────────┐
│ Add New Endpoint              [✕]   │
├─────────────────────────────────────┤
│ Hostname: *                         │
│ [_________________________________] │
│                                     │
│ IP Address: *                       │
│ [___.___.___.___ ]                  │
│                                     │
│ MAC Address:                        │
│ [__:__:__:__:__:__]                 │
│                                     │
│ Device Type:                        │
│ [Server ▼]                          │
│                                     │
│ Subnet:                             │
│ [Auto: 192.168.1.0/24 ▼]            │
│                                     │
│ Risk Level:                         │
│ [Low ▼]                             │
│                                     │
│           [Cancel] [Add Endpoint]   │
└─────────────────────────────────────┘
```

**Add Connection Modal:**
```
┌─────────────────────────────────────┐
│ Add Connection                [✕]   │
│ From: WIDE-SRV-DHCP45               │
│ To: WIDE-WKS-091                    │
├─────────────────────────────────────┤
│ Connection Type:                    │
│ [Custom ▼]                          │
│   • Same VLAN                       │
│   • Switch Port                     │
│   • Communication                   │
│   • Custom                          │
│                                     │
│ Description:                        │
│ [_________________________________] │
│ Max 100 characters                  │
│                                     │
│ Color:                              │
│ [🎨 ________] (Color picker)        │
│                                     │
│ Directionality:                     │
│ [Undirected ▼]                      │
│   • Undirected (⟺)                │
│   • Source → Target                 │
│                                     │
│          [Cancel] [Add Connection]  │
└─────────────────────────────────────┘
```

**Subnet Settings Modal:**
```
┌─────────────────────────────────────┐
│ Subnet Settings               [✕]   │
├─────────────────────────────────────┤
│ CIDR Mask:                          │
│ ○ /16 (Class B)                     │
│ ○ /20 (16 subnets)                  │
│ ● /24 (256 hosts) ← Default         │
│ ○ /28 (16 hosts)                    │
│ ○ /32 (Single host)                 │
│                                     │
│ ⚠ Changing CIDR will re-cluster     │
│   the graph and reset custom        │
│   node positions.                   │
│                                     │
│              [Cancel] [Apply]       │
└─────────────────────────────────────┘
```

**Save Topology Modal:**
```
┌─────────────────────────────────────┐
│ Save Topology                 [✕]   │
├─────────────────────────────────────┤
│ Filename:                           │
│ [_________________________.json]    │
│                                     │
│ Description: (optional)             │
│ [_________________________________] │
│ [_________________________________] │
│                                     │
│ Save to:                            │
│ ○ Download as file                  │
│ ○ Browser storage (localStorage)    │
│                                     │
│              [Cancel] [Save]        │
└─────────────────────────────────────┘
```

**Time-Series Panel (Bottom Drawer):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Network Topology Timeline                                         [✕]   │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [◄◄] [◄] [⏸] [►] [►►]     Speed: [1x ▼]        [⚙ Settings]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Timeline:                                                               │
│ Nov 1                                               Nov 23              │
│ ├────────────────█████████░░░░░░░░░░░░░░░░░░░░░░░░────────────────────┤ │
│ │                ↑                        ⚠        ⚠                    │ │
│ │                Nov 15, 2025             Event    Event                │ │
│ │                3:00 PM                  markers                       │
│ │                                                                       │ │
│ Viewing: Nov 15, 2025, 3:00 PM - 67 active devices, 142 connections    │
│ Events: ⚠ Suspicious activity spike (5 devices), 🆕 2 new devices added │
└─────────────────────────────────────────────────────────────────────────┘
```

**3D View Controls (Overlay):**
```
┌──────────────────┐
│ Camera Controls: │
│ Drag: Rotate     │
│ Scroll: Zoom     │
│ Right-drag: Pan  │
│                  │
│ [Reset Camera]   │
│ [Top View]       │
│ [Side View]      │
└──────────────────┘

Visual Design Notes
Graph Canvas:

Background:

Light mode: #F5F5F5 (light gray)
Dark mode: #1E1E1E (dark gray)


Grid (optional toggle):

Subtle dotted grid lines, 10% opacity


Subnet Clusters:

Background: Subnet color at 20% opacity
Border: 2px solid subnet color
Convex hull shape or rounded rectangle



Nodes:

Shape: Circle
Radius: 30px (can be adjusted in settings)
Icon:

Centered, 16x16px
White or contrasting color
SVG or icon font (e.g., Font Awesome, Material Icons)


Label:

Position: Below node, 12px font
Truncate at 15 characters with ellipsis
Font: Sans-serif, medium weight


Border:

Default: 2px solid subnet color
Hover: 4px solid, brighter shade
Selected: 4px solid + box-shadow glow (0 0 10px color)


Risk Indicator (Optional):

Small badge on top-right of node showing risk level (for CRITICAL only)
Red circle with "!" icon



Edges:

Default (Normal connection):

1px solid #CCCCCC (light gray)


Suspicious:

2px solid #D0021B (red)


Same Switch/VLAN:

1.5px solid #4A90E2 (blue)


Communication:

1.5px solid #7ED321 (green)


Custom:

2px solid, user-defined color


Hover:

Increase thickness by 1px
Show label (connection type + description)


Directionality:

Undirected: Simple line
Directed: Arrow at target end



Subnet Color Palette (12 colors):

#4A90E2 (Blue)
#50E3C2 (Teal)
#F5A623 (Orange)
#BD10E0 (Purple)
#7ED321 (Green)
#F8E71C (Yellow)
#8B572A (Brown)
#9013FE (Violet)
#417505 (Dark Green)
#FF6B6B (Coral)
#4ECDC4 (Cyan)
#95A5A6 (Gray)

Edit Mode Indicator:

Canvas Border: 4px solid #FFD700 (gold/yellow)
Badge (Top-Left):

"Edit Mode" text
Yellow background, black text
Rounded corners



Tooltips:

Background: Semi-transparent dark gray (#333333E6, 90% opacity)
Text: White, 12px font
Border: None
Shadow: 0 2px 8px rgba(0,0,0,0.2)
Animation: Fade in 200ms

Modals:

Background: White (light mode) or #2C2C2C (dark mode)
Overlay: Black at 50% opacity
Border: None
Shadow: 0 4px 20px rgba(0,0,0,0.3)
Animation: Scale in from 0.95 to 1.0, 300ms ease-out

Buttons:

Primary (Add, Save, Apply):

Background: #4A90E2 (blue)
Text: White
Hover: Darken by 10%
Active: Darken by 20%


Secondary (Cancel):

Background: #CCCCCC (gray)
Text: #333333
Hover: Darken by 10%


Destructive (Delete):

Background: #D0021B (red)
Text: White
Hover: Darken by 10%


Icon Buttons (Zoom, Reset):

Background: White with 80% opacity
Icon: Dark gray
Border: 1px solid #CCCCCC
Hover: Background 100% opacity



Loading Indicators:

Graph Render:

Spinner in center of canvas
Text: "Generating network graph..."


Playback Loading:

Progress bar below timeline
Text: "Loading historical data..."




Accessibility & Performance
Accessibility:

Keyboard Navigation:

Tab: Cycle through nodes (focus ring)
Enter: Open detail panel for focused node
Arrow keys: Pan graph canvas
+/-: Zoom in/out
Esc: Close modals, exit edit mode


Screen Reader:

Announce node labels, risk levels, connection types
Describe graph structure: "X devices in Y subnets, Z connections"
Announce filter changes: "Showing 12 critical devices"


High Contrast Mode:

Increase edge thickness to 3px
Use high-contrast colors (black/white/yellow/red)
Add patterns to edges (dashed, dotted) to distinguish types


Focus Indicators:

2px blue outline on focused elements
Ensure visible on all backgrounds



Performance Optimization:

Rendering Strategy:

Up to 300 nodes: Canvas 2D (cytoscape.js)
300-500 nodes: WebGL (sigma.js or three.js with 2D sprites)


500 nodes: Show warning, offer filtering or pagination




Layout Calculation:

Run in Web Worker (off main thread)
Max 1000 iterations or 3 seconds, whichever comes first
Use requestAnimationFrame for smooth animation


Data Loading:

Lazy load node details (fetch on click, not on render)
Cache connection data in memory
Debounce layout recalculation (300ms after manual drag)


State Management:

Use localStorage for custom data (< 5MB limit)
Compress JSON before storage (gzip via library)
Clear old topologies if storage full (FIFO)


3D Optimization (Phase 3):

Use instanced rendering for nodes (reduce draw calls)
Limit to 300 nodes in 3D
Disable shadows and complex lighting
Use LOD (Level of Detail) for distant nodes




Mock Data Structure (Phase 1)
Full Mock Dataset (100 Endpoints, 6 Subnets):
json{
  "generated_at": "2025-11-23T10:00:00Z",
  "total_endpoints": 100,
  "total_subnets": 6,
  "total_connections": 150,
  "endpoints": [
    {
      "id": "ep1",
      "hostname": "WIDE-SRV-DHCP45",
      "ip": "192.168.0.20",
      "mac": "52:54:00:44:45:02",
      "os": "Windows Server 2019",
      "device_type": "server",
      "subnet": "192.168.0.0/24",
      "last_activity": "2025-11-22T19:00:00Z",
      "risk_level": "CRITICAL",
      "open_ports": 13,
      "users": ["svc-backup"],
      "suspicious_activity": [
        "Possible DNS tunneling detected",
        "Connection to known C2 domain"
      ],
      "connected_devices": ["08:00:27:A2:5C:1D", "3C:07:54:BF:0C:F4"],
      "last_seen_with": [
        {"mac": "08:00:27:A2:5C:1D", "ip": "192.168.1.180", "timestamp": "2025-11-22T18:30:00Z", "protocol": "ARP"},
        {"mac": "3C:07:54:BF:0C:F4", "ip": "192.168.0.96", "timestamp": "2025-11-22T17:00:00Z", "protocol": "syslog"}
      ],
      "switch_port_neighbors": ["ep2", "ep15"]
    },
    {
      "id": "ep2",
      "hostname": "WIDE-WKS-091",
      "ip": "192.168.1.180",
      "mac": "08:00:27:A2:5C:1D",
      "os": "RHEL 8",
      "device_type": "workstation",
      "subnet": "192.168.1.0/24",
      "last_activity": "2025-11-22T18:00:00Z",
      "risk_level": "CRITICAL",
      "open_ports": 3,
      "users": ["user1", "user2"],
      "suspicious_activity": [
        "Connection to known C2 domain",
        "Lateral movement indicators found"
      ],
      "connected_devices": ["52:54:00:44:45:02"],
      "last_seen_with": [
        {"mac": "52:54:00:44:45:02", "ip": "192.168.0.20", "timestamp": "2025-11-22T18:30:00Z", "protocol": "ARP"}
      ],
      "switch_port_neighbors": ["ep1"]
    },
    // ... 98 more endpoints across 6 subnets
  ],
  "connections": [
    {
      "id": "conn1",
      "source": "ep1",
      "target": "ep2",
      "type": "communication",
      "description": "ARP detected",
      "color": "#7ED321",
      "suspicious": false,
      "strength": 0.8,
      "last_seen": "2025-11-22T18:30:00Z"
    },
    {
      "id": "conn2",
      "source": "ep2",
      "target": "ep15",
      "type": "suspicious",
      "description": "Lateral movement detected",
      "color": "#D0021B",
      "suspicious": true,
      "strength": 1.0,
      "last_seen": "2025-11-22T16:00:00Z"
    },
    {
      "id": "conn3",
      "source": "ep1",
      "target": "ep15",
      "type": "same_switch",
      "description": "Same switch port",
      "color": "#4A90E2",
      "suspicious": false,
      "strength": 0.6,
      "last_seen": "2025-11-22T17:00:00Z"
    }
    // ... 147 more connections
  ],
  "subnets": [
    {
      "cidr": "192.168.0.0/24",
      "name": "Management Network",
      "color": "#4A90E2",
      "device_count": 18,
      "description": "Core infrastructure and management"
    },
    {
      "cidr": "192.168.1.0/24",
      "name": "Engineering",
      "color": "#50E3C2",
      "device_count": 25,
      "description": "Engineering workstations and dev servers"
    },
    {
      "cidr": "10.0.0.0/24",
      "name": "Guest Wi-Fi",
      "color": "#F5A623",
      "device_count": 12,
      "description": "Guest wireless network"
    },
    {
      "cidr": "172.16.0.0/24",
      "name": "DMZ",
      "color": "#BD10E0",
      "device_count": 8,
      "description": "Public-facing services"
    },
    {
      "cidr": "192.168.100.0/24",
      "name": "IoT Devices",
      "color": "#7ED321",
      "device_count": 20,
      "description": "Smart building and IoT sensors"
    },
    {
      "cidr": "192.168.50.0/24",
      "name": "VoIP Network",
      "color": "#F8E71C",
      "device_count": 17,
      "description": "Voice over IP phones and PBX"
    }
  ]
}
```

**Mock Data Generation Script Path:**
- `/mock-data/graph-data-generator.js`
- Export function: `generateGraphMockData(nodeCount = 100, subnetCount = 6)`
- Include realistic: Hostnames, IP ranges, MAC addresses, OS versions, device types, risk levels, connections

---

## 4. Technical Implementation Notes

### Recommended Libraries

**Phase 1 (2D Graph):**
- **Primary:** `cytoscape.js` v3.x
  - Pros: Flexible, excellent docs, good performance, large community
  - Layouts: `cytoscape-cola` (force-directed with constraints)
  - Extensions: `cytoscape-context-menus`, `cytoscape-panzoom`
- **Alternative:** `vis-network` v9.x
  - Pros: Simpler API, Neo4j-like out of the box
  - Cons: Less customization, fewer layout options
- **High-performance (if >300 nodes):** `sigma.js` v2.x
  - Pros: WebGL rendering, handles 1000+ nodes smoothly
  - Cons: Steeper learning curve, fewer built-in features

**Phase 2 (Editing):**
- **Context Menu:** `react-contextmenu` or `@szhsin/react-menu`
- **Color Picker:** `react-color` v2.x
- **Modals:** `react-modal` or headlessui `Dialog`
- **Tooltips:** `react-tooltip` or `tippy.js`
- **File Upload:** Native HTML5 input + FileReader API
- **Undo/Redo:** Custom implementation with state stack or `use-undo` library

**Phase 3 (3D & Time-Series):**
- **3D Graph:** `three.js` + `3d-force-graph` v1.x
  - Force-directed layout in 3D space
  - Camera controls via `OrbitControls`
- **Time-Series Playback:** Custom implementation
  - Slider: HTML5 range input + custom styling
  - Animation: `requestAnimationFrame` loop
  - Data: Store snapshots in IndexedDB for larger datasets

**UI Components:**
- **React** v18.x
- **State Management:** Zustand or Context API
- **Styling:** Tailwind CSS or styled-components
- **Icons:** `react-icons` (Font Awesome, Material Icons)

---

### Data Flow Architecture

**Phase 1 (Read-Only):**
```
Search Results (List) 
  ↓
Graph Data Transformer (map endpoints + connections)
  ↓
Cytoscape Graph Component
  ↓
Layout Engine (force-directed physics)
  ↓
Rendered Graph Canvas
  ↓
User Interactions (hover, click, filter)
  ↓
Update Graph State (highlight, zoom, filter)
```

**Phase 2 (Editing):**
```
User Edit Action (right-click, button click)
  ↓
Edit Modal/Context Menu
  ↓
Update Local State (Zustand store)
  ↓
Push to Undo Stack
  ↓
Auto-save to localStorage (debounced 2sec)
  ↓
Re-render Graph with Updated Data
```

**Phase 3 (Time-Series):**
```
Historical Data Snapshots (backend API)
  ↓
IndexedDB (client-side cache)
  ↓
Timeline Scrubber (user interaction)
  ↓
Load Snapshot for Selected Timestamp
  ↓
Render Graph with Historical State
  ↓
Animate Transitions (fade in/out nodes/edges)

LocalStorage Data Structure
Key: current_graph_state
json{
  "version": "1.0",
  "last_updated": "2025-11-23T10:30:00Z",
  "settings": {
    "subnet_cidr": "/24",
    "view_mode": "graph",
    "layout": "force-directed"
  },
  "custom_nodes": [ /* array of custom endpoints */ ],
  "node_positions": {
    "ep1": {"x": 100, "y": 200, "pinned": true},
    "ep2": {"x": 350, "y": 180, "pinned": false}
  },
  "custom_names": {
    "ep1": "Primary DHCP Server",
    "192.168.0.0/24": "Management VLAN"
  },
  "subnet_colors": {
    "192.168.0.0/24": "#4A90E2",
    "192.168.1.0/24": "#50E3C2"
  },
  "custom_edges": [ /* array of custom connections */ ],
  "hidden_nodes": ["ep15", "ep23"],
  "undo_stack": [ /* last 20 actions */ ],
  "redo_stack": [ /* undone actions */ ]
}
Key: saved_topologies
json{
  "topologies": [
    {
      "id": "topo1",
      "filename": "Prod_Network_Audit_Nov2025",
      "description": "Production network audit",
      "saved_at": "2025-11-23T10:00:00Z",
      "data": { /* full topology JSON */ }
    },
    {
      "id": "topo2",
      "filename": "Test_Lab_Config_Nov2025",
      "description": "Test lab configuration",
      "saved_at": "2025-11-20T14:30:00Z",
      "data": { /* full topology JSON */ }
    }
  ]
}

Backend API Requirements (Phase 3)
For Time-Series Playback:
Endpoint: GET /api/network/history/snapshots

Query Params:

start_date: ISO timestamp
end_date: ISO timestamp
granularity: "hourly" | "daily"


Response:

json  {
    "snapshots": [
      {
        "timestamp": "2025-11-15T00:00:00Z",
        "endpoints": [ /* full endpoint list at this time */ ],
        "connections": [ /* active connections */ ],
        "events": [
          {
            "timestamp": "2025-11-15T14:23:00Z",
            "type": "new_device",
            "device_id": "ep50",
            "description": "New workstation detected"
          }
        ]
      }
    ]
  }
Endpoint: GET /api/network/history/events

Query Params:

start_date: ISO timestamp
end_date: ISO timestamp
event_types: Array of event types to filter


Response:

json  {
    "events": [
      {
        "timestamp": "2025-11-15T16:45:00Z",
        "type": "suspicious_connection",
        "source": "ep12",
        "target": "ep23",
        "description": "Lateral movement detected",
        "severity": "critical"
      }
    ]
  }

5. Acceptance Criteria
Phase 1 (Visualization)
✅ AC1: User can toggle between List View and Graph View without losing filter/search state
✅ AC2: Graph displays all search result endpoints as nodes with correct device type icons
✅ AC3: Nodes are automatically clustered by subnet with colored backgrounds and labels
✅ AC4: Subnet CIDR is configurable (/16, /20, /24, /28, /32) via settings modal
✅ AC5: Clicking a node opens the existing device detail panel with full metadata
✅ AC6: Hovering a node shows tooltip with IP, MAC, last activity, risk level, connection count
✅ AC7: Edges are drawn between connected endpoints using auto-detected data (ARP, CAM, syslog, suspicious)
✅ AC8: Suspicious connections are rendered in red (2px) with thicker lines
✅ AC9: User can zoom (scroll), pan (drag canvas), drag individual nodes, and reset layout
✅ AC10: Filters applied in List View persist when switching to Graph View
✅ AC11: Graph performs smoothly with 100 nodes (< 2 sec initial render)
✅ AC12: Warning appears for >500 nodes with filtering options
✅ AC13: Mock data includes 80-120 endpoints across 6-8 subnets with realistic connections
✅ AC14: Subnet collapse/expand functionality works (meta-node with device count)
✅ AC15: Search highlights matching nodes with pulsing border, dims non-matching nodes
✅ AC16: Suspicious activity overlay highlights red edges and dims normal edges
Phase 2 (Editing)
✅ AC17: User can activate edit mode via "Edit Topology" button with visual indicators (yellow border, badge)
✅ AC18: User can right-click node and edit hostname inline (Enter saves, Esc cancels)
✅ AC19: User can add new endpoint via modal with full validation (IP format, duplicate check)
✅ AC20: User can move endpoint to different subnet via right-click menu with IP update option
✅ AC21: User can rename subnet by clicking cluster label (inline edit)
✅ AC22: User can change subnet color via right-click menu on cluster with color picker
✅ AC23: User can add custom connection between two nodes (crosshair mode, connection dialog)
✅ AC24: Custom connections have description (max 100 chars), color, and directionality
✅ AC25: User can click edge and edit/delete via context menu
✅ AC26: User can delete endpoint with confirmation (removes custom connections, hides auto-detected)
✅ AC27: User can save topology as JSON file (download or localStorage)
✅ AC28: User can load saved topology from file or localStorage with merge logic
✅ AC29: Merge conflict prompt appears if loaded topology has deleted auto-detected endpoints
✅ AC30: Undo/Redo works for all editing actions (Ctrl+Z, Ctrl+Y, max 20 stack depth)
✅ AC31: Edit mode auto-saves to localStorage every 2 seconds
✅ AC32: User can export graph as PNG image (high-res, 2x scale)
✅ AC33: User can export graph data as JSON (same structure as save topology)
✅ AC34: All changes persist across page refresh (loaded from localStorage)
✅ AC35: Undo stack clears on refresh with toast notification
Phase 3 (Advanced Features)
✅ AC36: User can toggle 3D view with smooth transition from 2D layout
✅ AC37: 3D graph supports camera rotation (drag), zoom (scroll), pan (right-drag)
✅ AC38: 3D nodes are colored by subnet, show device icons, maintain interactivity (click, hover)
✅ AC39: 3D subnet clusters use transparent planes or convex hulls at different Z-levels
✅ AC40: 3D performance is smooth with up to 300 nodes (>30 FPS)
✅ AC41: Warning appears for >300 nodes in 3D with option to reduce or switch to 2D
✅ AC42: User can open time-series panel with timeline spanning available historical data
✅ AC43: User can scrub timeline to specific date/time, graph updates to show historical state
✅ AC44: User can play/pause time-series animation with adjustable speed (1x, 2x, 5x, 10x)
✅ AC45: Nodes appear/disappear during playback based on activity timestamps
✅ AC46: Edges fade in/out as connections detected/lost over time
✅ AC47: Event markers appear on timeline (new device, suspicious activity spike)
✅ AC48: Clicking event marker pauses playback and jumps to that timestamp
✅ AC49: Time-series works with auto-detected data only (custom topology hidden during playback)
✅ AC50: User can export time-series snapshots as PNG series at key timestamps

6. Open Questions for Stakeholders

Performance Threshold: Confirmed 500 nodes as upper limit. Should we implement pagination for >500 or only filtering? ✅ Answered: Filtering only, show warning
Connection Auto-Detection: Confirmed pulling from existing modules (ARP, CAM, syslog). Should we add new endpoint fields or extend existing ones? ✅ Answered: Add new fields (connected_devices, last_seen_with, switch_port_neighbors)
Subnet Detection: Confirmed user-configurable CIDR. Default /24 acceptable? ✅ Answered: Yes, default /24 with settings UI
Phase 2 Priority: Confirmed all editing features together. Any specific features to prioritize within Phase 2?
Data Persistence: Confirmed localStorage for now. Max storage size estimate? (~5MB typical, need compression?)
Export Format: Confirmed both PNG and JSON. Should PNG include legend/timestamp?
Backend Integration (Phase 3): What's the plan for historical data collection? Daily snapshots via cron job?
3D View Z-Axis: Should Z-axis represent subnet hierarchy, risk level, or user-configurable?
Time-Series Granularity: Daily snapshots sufficient, or need hourly for recent data?
Access Control: Should any editing features require admin role, or open to all authenticated users?


7. Future Enhancements (Beyond Phase 3)

Real-Time Updates: WebSocket connection for live graph updates
Path Analysis: Shortest path algorithm between two endpoints
Anomaly Detection: AI-powered auto-flagging of unusual topology patterns
Templates: Pre-configured topology templates (DMZ, corporate, guest)
Collaboration: Multi-user real-time editing with presence indicators
AI Suggestions: Auto-suggest optimal subnet organization based on communication patterns
Export Video: Export time-series playback as MP4 or animated GIF
Network Simulation: "What-if" scenarios (e.g., "What if device X goes offline?")
Compliance Mapping: Overlay compliance zones (PCI-DSS, HIPAA) on topology
Mobile App: Dedicated mobile app for graph visualization and monitoring

