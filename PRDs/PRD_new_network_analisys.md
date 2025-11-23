# 📋 FULL PRD — Network Analysis Page (Complete Redesign)

**Feature Name:** Network Analysis Page Redesign  
**Version:** 2.0  
**Status:** Ready for Implementation  
**Priority:** HIGH

---

## 1. EXECUTIVE SUMMARY

Complete redesign of the Network Analysis page to focus on **network infrastructure and connectivity details** rather than traffic analysis. The new page displays network interfaces, saved WiFi connections, active network connections, ARP cache, and shared folders.

**Key Changes:**
- ❌ **REMOVE:** Traffic graphs, protocol distribution, connection count graphs, failed connections graph, time range selector, key metrics cards
- ✅ **KEEP:** Endpoint Summary, Anomalies Detected
- ✅ **ADD:** Network Interfaces, Saved WiFi Connections, Network Connections Table, ARP Cache, Shared Folders

---

## 2. PAGE STRUCTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│ STICKY HUD (unchanged)                                      │
│ [T] Truth | Home › Investigation › Network Analysis         │
│ 🟢 Active | [Save] [Export] [Refresh] [Settings]           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Network Analysis: CONTOSO-SRV-DB01                          │
│ Comprehensive network configuration and connectivity...     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 💻 Endpoint Summary                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🌐 Network Interfaces (Snapshot: Nov 18, 2025 9:32 PM)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📶 Saved WiFi Connections                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🔌 Network Connections                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📋 ARP Cache                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📁 Shared Folders                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Anomalies Detected (3)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTS TO REMOVE

**Delete these files entirely from codebase:**

```bash
# ❌ DELETE THESE FILES:
src/components/NetworkAnalysis/TrafficVolumeGraph.jsx
src/components/NetworkAnalysis/ConnectionCountGraph.jsx
src/components/NetworkAnalysis/ProtocolDistributionGraph.jsx
src/components/NetworkAnalysis/FailedConnectionsGraph.jsx
src/components/NetworkAnalysis/TimeRangeSelector.jsx
src/components/NetworkAnalysis/KeyMetricsCards.jsx

# ❌ DELETE THESE FUNCTIONS:
generateTrafficData()
generateConnectionData()
generateProtocolData()
calculateMetrics()

# ❌ REMOVE THESE IMPORTS (if not used elsewhere):
import { LineChart, AreaChart } from 'recharts';
```

**Components to KEEP (No Changes):**

```javascript
// ✅ KEEP AS-IS:
src/components/NetworkAnalysis/EndpointSummary.jsx
src/components/NetworkAnalysis/AnomaliesDetected.jsx
```

---

## 4. NEW COMPONENT SPECIFICATIONS

### 4.1 Network Interfaces Widget

**Purpose:** Display all network interface cards with complete configuration details at a specific snapshot timestamp.

**Data Structure:**
```json
{
  "snapshot_timestamp": "2025-11-18T21:32:00Z",
  "interfaces": [
    {
      "id": "eth0",
      "network_type": "Ethernet",
      "description": "Realtek PCIe GbE Family Controller",
      "mac_address": "00:11:22:33:44:AA",
      "ipv4": "192.168.1.210",
      "ipv6": "fe80::a4b2:c3d4:e5f6:7890",
      "default_gateway": "192.168.1.1",
      "dns_servers": ["8.8.8.8", "8.8.4.4"],
      "dhcp_enabled": true,
      "dhcp_server": "192.168.1.1",
      "status": "connected"
    },
    {
      "id": "wlan0",
      "network_type": "WiFi",
      "description": "Intel(R) Wireless-AC 9560 160MHz",
      "mac_address": "A4:B2:C3:D4:E5:F6",
      "ipv4": null,
      "ipv6": "fe80::1234:5678:90ab:cdef",
      "default_gateway": null,
      "dns_servers": [],
      "dhcp_enabled": true,
      "dhcp_server": null,
      "status": "disconnected"
    }
  ]
}
```

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🌐 Network Interfaces                                       │
│ Snapshot: Nov 18, 2025 9:32 PM                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🟢 Ethernet - Realtek PCIe GbE Family Controller    │   │
│ │                                                       │   │
│ │ MAC Address        00:11:22:33:44:AA                 │   │
│ │ IPv4               192.168.1.210                      │   │
│ │ IPv6               fe80::a4b2:c3d4:e5f6:7890         │   │
│ │ Default Gateway    192.168.1.1                       │   │
│ │ DNS Servers        8.8.8.8, 8.8.4.4                  │   │
│ │ DHCP Server        192.168.1.1 (Enabled)             │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ⚪ WiFi - Intel(R) Wireless-AC 9560 160MHz          │   │
│ │                                                       │   │
│ │ MAC Address        A4:B2:C3:D4:E5:F6                 │   │
│ │ IPv4               Not assigned                       │   │
│ │ IPv6               fe80::1234:5678:90ab:cdef         │   │
│ │ Status             Disconnected                       │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Component Implementation:**

```jsx
// src/components/NetworkAnalysis/NetworkInterfaces.jsx
export function NetworkInterfaces({ data }) {
  return (
    <div className="network-interfaces">
      <div className="interfaces-header">
        <h2 className="interfaces-title">
          <span>🌐</span>
          Network Interfaces
        </h2>
        <span className="snapshot-timestamp">
          Snapshot: {formatTimestamp(data.snapshot_timestamp)}
        </span>
      </div>
      
      <div className="interfaces-list">
        {data.interfaces.map((iface) => (
          <div key={iface.id} className="interface-card">
            <div className="interface-header">
              <span className={`interface-status ${iface.status}`}></span>
              <span className="interface-type">{iface.network_type}</span>
              <span className="interface-description">{iface.description}</span>
            </div>
            
            <div className="interface-details">
              <div className="detail-row">
                <span className="detail-label">MAC Address</span>
                <span className="detail-value">{iface.mac_address}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">IPv4</span>
                <span className={`detail-value ${!iface.ipv4 ? 'not-assigned' : ''}`}>
                  {iface.ipv4 || 'Not assigned'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">IPv6</span>
                <span className="detail-value">{iface.ipv6}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Default Gateway</span>
                <span className="detail-value">{iface.default_gateway}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">DNS Servers</span>
                <span className="detail-value">
                  {iface.dns_servers.join(', ')}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">DHCP</span>
                <span className="detail-value">
                  {iface.dhcp_enabled 
                    ? `${iface.dhcp_server} (Enabled)` 
                    : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**CSS Specifications:**

```css
.network-interfaces {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.interfaces-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.interfaces-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.snapshot-timestamp {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.interface-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: box-shadow 150ms ease;
}

.interface-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.interface-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.interface-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.interface-status.connected {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.interface-status.disconnected {
  background: #9ca3af;
}

.interface-type {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.interface-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

.interface-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 32px;
}

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 140px;
}

.detail-value {
  font-size: 13px;
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
}

.detail-value.not-assigned {
  color: #9ca3af;
  font-style: italic;
}
```

---

### 4.2 Saved WiFi Connections Widget

**Purpose:** Display all WiFi networks the endpoint has connected to within a selected time range, with search functionality.

**Data Structure:**
```json
{
  "wifi_connections": [
    {
      "id": "wifi-001",
      "ssid": "HomeNetwork_5G",
      "bssid": "A4:12:34:56:78:9A",
      "security_type": "WPA2-Personal",
      "first_connected": "2025-11-15T14:23:00Z",
      "last_connected": "2025-11-18T21:15:00Z",
      "connection_count": 47,
      "signal_strength": -45,
      "frequency": "5GHz"
    },
    {
      "id": "wifi-002",
      "ssid": "Office-WiFi",
      "bssid": "B8:27:EB:12:34:56",
      "security_type": "WPA2-Enterprise",
      "first_connected": "2025-11-17T09:00:00Z",
      "last_connected": "2025-11-17T18:30:00Z",
      "connection_count": 12,
      "signal_strength": -62,
      "frequency": "2.4GHz"
    }
  ]
}
```

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ 📶 Saved WiFi Connections                                   │
│                                                              │
│ [Last 24h] [Last 7d✓] [Last 30d] [Custom]  [🔍 Search...]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 📶📶📶 HomeNetwork_5G                    WPA2-Personal │   │
│ │                                                       │   │
│ │ BSSID: A4:12:34:56:78:9A          Frequency: 5GHz    │   │
│ │ First Connected: Nov 15, 2:23 PM                     │   │
│ │ Last Connected: Nov 18, 9:15 PM                      │   │
│ │ Connection Count: 47 times                           │   │
│ │ Signal Strength: -45 dBm (Excellent)                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Showing 2 of 2 WiFi connections                             │
└─────────────────────────────────────────────────────────────┘
```

**Component Implementation:**

```jsx
// src/components/NetworkAnalysis/SavedWifiConnections.jsx
import { useState } from 'react';

export function SavedWifiConnections({ data }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredWifi = data.wifi_connections.filter(wifi =>
    wifi.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wifi.bssid.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getSignalStrength = (dbm) => {
    if (dbm >= -50) return { label: 'Excellent', bars: 4 };
    if (dbm >= -60) return { label: 'Good', bars: 3 };
    if (dbm >= -70) return { label: 'Fair', bars: 2 };
    return { label: 'Weak', bars: 1 };
  };
  
  return (
    <div className="saved-wifi-connections">
      <div className="wifi-header">
        <h2 className="wifi-title">
          <span>📶</span>
          Saved WiFi Connections
        </h2>
      </div>
      
      <div className="wifi-filters">
        <div className="time-range-buttons">
          <button 
            className={timeRange === '24h' ? 'active' : ''}
            onClick={() => setTimeRange('24h')}
          >
            Last 24h
          </button>
          <button 
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            Last 7d
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            Last 30d
          </button>
          <button 
            className={timeRange === 'custom' ? 'active' : ''}
            onClick={() => setTimeRange('custom')}
          >
            Custom
          </button>
        </div>
        
        <div className="wifi-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search WiFi networks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="wifi-list">
        {filteredWifi.length > 0 ? (
          filteredWifi.map((wifi) => {
            const signal = getSignalStrength(wifi.signal_strength);
            return (
              <div key={wifi.id} className="wifi-card">
                <div className="wifi-card-header">
                  <div className="wifi-name">
                    <span className="signal-bars">
                      {'📶'.repeat(signal.bars)}
                    </span>
                    <span className="ssid">{wifi.ssid}</span>
                  </div>
                  <span className="security-badge">{wifi.security_type}</span>
                </div>
                
                <div className="wifi-details">
                  <div className="wifi-detail-row">
                    <span className="label">BSSID:</span>
                    <span className="value">{wifi.bssid}</span>
                    <span className="label">Frequency:</span>
                    <span className="value">{wifi.frequency}</span>
                  </div>
                  
                  <div className="wifi-detail-row">
                    <span className="label">First Connected:</span>
                    <span className="value">{formatTimestamp(wifi.first_connected)}</span>
                  </div>
                  
                  <div className="wifi-detail-row">
                    <span className="label">Last Connected:</span>
                    <span className="value">{formatTimestamp(wifi.last_connected)}</span>
                  </div>
                  
                  <div className="wifi-detail-row">
                    <span className="label">Connection Count:</span>
                    <span className="value">{wifi.connection_count} times</span>
                  </div>
                  
                  <div className="wifi-detail-row">
                    <span className="label">Signal Strength:</span>
                    <span className="value">
                      {wifi.signal_strength} dBm ({signal.label})
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No WiFi connections found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {filteredWifi.length > 0 && (
        <div className="wifi-count">
          Showing {filteredWifi.length} of {data.wifi_connections.length} WiFi connections
        </div>
      )}
    </div>
  );
}
```

**CSS:**

```css
.saved-wifi-connections {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.wifi-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.time-range-buttons {
  display: flex;
  gap: 8px;
}

.time-range-buttons button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 150ms ease;
}

.time-range-buttons button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.wifi-search {
  flex: 1;
  position: relative;
}

.wifi-search .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.wifi-search input {
  width: 100%;
  padding: 8px 14px 8px 38px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.wifi-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.wifi-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.wifi-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ssid {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.security-badge {
  padding: 4px 10px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.wifi-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wifi-detail-row {
  display: grid;
  grid-template-columns: 140px 1fr 140px 1fr;
  gap: 12px;
  font-size: 13px;
}

.wifi-detail-row .label {
  color: #6b7280;
  font-weight: 500;
}

.wifi-detail-row .value {
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
}

.wifi-count {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
```

---

### 4.3 Network Connections Table

**Purpose:** Display all active network connections with collapsible rows grouped by destination IP.

**Data Structure:**
```json
{
  "connections": [
    {
      "id": "conn-001",
      "collection_start": "2025-11-18T20:00:00Z",
      "collection_end": "2025-11-18T21:00:00Z",
      "protocol": "TCP",
      "source_ip": "192.168.1.210",
      "source_port": 54321,
      "dest_ip": "8.8.8.8",
      "dest_port": 443,
      "state": "ESTABLISHED",
      "process_name": "chrome.exe",
      "pid": 1234
    }
  ]
}
```

**UI Layout with Collapsible Rows:**

```
┌──────────────────────────────────────────────────────────────┐
│ 🔌 Network Connections                                       │
│                                                               │
│ [🔍 Search connections...]                                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ [▼] 8.8.8.8:443 (2 connections)                              │
│     Protocol: TCP | State: ESTABLISHED                       │
│     ┌────────────────────────────────────────────────────┐  │
│     │ Start: Nov 18, 8:00 PM | End: Nov 18, 9:00 PM    │  │
│     │ Source: 192.168.1.210:54321                       │  │
│     │ Process: chrome.exe (PID: 1234)                   │  │
│     └────────────────────────────────────────────────────┘  │
│                                                               │
│ [▶] 142.250.191.14:443 (1 connection)                        │
│     Protocol: TCP | State: TIME_WAIT                         │
└──────────────────────────────────────────────────────────────┘
```

**Component Implementation:**

```jsx
// src/components/NetworkAnalysis/NetworkConnections.jsx
import { useState } from 'react';

export function NetworkConnections({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Group connections by destination IP:port
  const groupedConnections = data.connections.reduce((acc, conn) => {
    const key = `${conn.dest_ip}:${conn.dest_port}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(conn);
    return acc;
  }, {});
  
  // Filter based on search
  const filteredGroups = Object.entries(groupedConnections).filter(
    ([destIpPort, connections]) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        destIpPort.toLowerCase().includes(searchLower) ||
        connections.some(conn =>
          conn.source_ip.toLowerCase().includes(searchLower) ||
          conn.process_name.toLowerCase().includes(searchLower) ||
          conn.protocol.toLowerCase().includes(searchLower)
        )
      );
    }
  );
  
  const toggleRow = (destIpPort) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(destIpPort)) {
      newExpanded.delete(destIpPort);
    } else {
      newExpanded.add(destIpPort);
    }
    setExpandedRows(newExpanded);
  };
  
  return (
    <div className="network-connections">
      <div className="connections-header">
        <h2 className="connections-title">
          <span>🔌</span>
          Network Connections
        </h2>
      </div>
      
      <div className="connections-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="connections-table">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(([destIpPort, connections]) => {
            const isExpanded = expandedRows.has(destIpPort);
            const firstConn = connections[0];
            
            return (
              <div key={destIpPort} className="connection-group">
                <div 
                  className="connection-group-header"
                  onClick={() => toggleRow(destIpPort)}
                >
                  <span className="expand-icon">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <span className="dest-ip">{destIpPort}</span>
                  <span className="connection-count">
                    ({connections.length} connection{connections.length > 1 ? 's' : ''})
                  </span>
                  <span className="protocol-badge">{firstConn.protocol}</span>
                  <span className="state-badge">{firstConn.state}</span>
                </div>
                
                {isExpanded && (
                  <div className="connection-details-list">
                    {connections.map((conn) => (
                      <div key={conn.id} className="connection-detail-card">
                        <div className="detail-grid">
                          <div className="detail-item">
                            <span className="label">Start Time:</span>
                            <span className="value">
                              {formatTimestamp(conn.collection_start)}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">End Time:</span>
                            <span className="value">
                              {formatTimestamp(conn.collection_end)}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Source:</span>
                            <span className="value">
                              {conn.source_ip}:{conn.source_port}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Process:</span>
                            <span className="value">
                              {conn.process_name} (PID: {conn.pid})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No connections found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {filteredGroups.length > 0 && (
        <div className="connections-count">
          Showing {filteredGroups.reduce((sum, [, conns]) => sum + conns.length, 0)} connections
        </div>
      )}
    </div>
  );
}
```

**CSS:**

```css
.network-connections {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.connections-search {
  position: relative;
  margin-bottom: 20px;
}

.connections-search .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.connections-search input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.connection-group {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.connection-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  cursor: pointer;
  transition: background 150ms ease;
}

.connection-group-header:hover {
  background: #f3f4f6;
}

.expand-icon {
  font-size: 12px;
  color: #6b7280;
  width: 16px;
}

.dest-ip {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
}

.connection-count {
  font-size: 13px;
  color: #6b7280;
}

.protocol-badge {
  padding: 4px 10px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.state-badge {
  padding: 4px 10px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.connection-details-list {
  padding: 16px;
  background: white;
}

.connection-detail-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.connection-detail-card:last-child {
  margin-bottom: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.detail-item .value {
  font-size: 13px;
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
}
```

---

### 4.4 ARP Cache Table

**Purpose:** Display Address Resolution Protocol cache entries.

**Data Structure:**
```json
{
  "arp_entries": [
    {
      "id": "arp-001",
      "type": "dynamic",
      "ip_address": "192.168.1.1",
      "mac_address": "00:11:22:33:44:55",
      "interface_name": "eth0"
    },
    {
      "id": "arp-002",
      "type": "static",
      "ip_address": "192.168.1.100",
      "mac_address": "A4:B2:C3:D4:E5:F6",
      "interface_name": "eth0"
    }
  ]
}
```

**Component Implementation:**

```jsx
// src/components/NetworkAnalysis/ArpCache.jsx
export function ArpCache({ data }) {
  return (
    <div className="arp-cache">
      <div className="arp-header">
        <h2 className="arp-title">
          <span>📋</span>
          ARP Cache
        </h2>
      </div>
      
      <div className="arp-table-container">
        <table className="arp-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>IP Address</th>
              <th>MAC Address</th>
              <th>Interface</th>
            </tr>
          </thead>
          <tbody>
            {data.arp_entries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <span className={`type-badge ${entry.type}`}>
                    {entry.type}
                  </span>
                </td>
                <td className="monospace">{entry.ip_address}</td>
                <td className="monospace">{entry.mac_address}</td>
                <td>{entry.interface_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="arp-count">
        {data.arp_entries.length} ARP entr{data.arp_entries.length === 1 ? 'y' : 'ies'}
      </div>
    </div>
  );
}
```

**CSS:**

```css
.arp-cache {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.arp-table {
  width: 100%;
  border-collapse: collapse;
}

.arp-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.arp-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.arp-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.arp-table tbody tr:hover {
  background: #f9fafb;
}

.arp-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
}

.type-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.type-badge.dynamic {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.static {
  background: #fef3c7;
  color: #92400e;
}

.monospace {
  font-family: 'JetBrains Mono', monospace;
}
```

---

### 4.5 Shared Folders Widget

**Purpose:** Display folders shared from the endpoint.

**Data Structure:**
```json
{
  "shared_folders": [
    {
      "id": "share-001",
      "name": "Public Documents",
      "path": "C:\\Users\\Public\\Documents",
      "share_name": "\\\\CONTOSO-SRV-DB01\\Public",
      "permissions": "Read",
      "active_connections": 0,
      "created_date": "2025-10-01T10:00:00Z"
    },
    {
      "id": "share-002",
      "name": "Company Files",
      "path": "D:\\Shares\\Company",
      "share_name": "\\\\CONTOSO-SRV-DB01\\CompanyFiles",
      "permissions": "Full Control",
      "active_connections": 3,
      "created_date": "2025-09-15T14:30:00Z"
    }
  ]
}
```

**Component Implementation:**

```jsx
// src/components/NetworkAnalysis/SharedFolders.jsx
export function SharedFolders({ data }) {
  return (
    <div className="shared-folders">
      <div className="folders-header">
        <h2 className="folders-title">
          <span>📁</span>
          Shared Folders
        </h2>
      </div>
      
      <div className="folders-list">
        {data.shared_folders.length > 0 ? (
          data.shared_folders.map((folder) => (
            <div key={folder.id} className="folder-card">
              <div className="folder-card-header">
                <div className="folder-name">
                  <span>📁</span>
                  <span>{folder.name}</span>
                </div>
                <span className="permissions-badge">
                  {folder.permissions}
                </span>
              </div>
              
              <div className="folder-details">
                <div className="folder-detail-row">
                  <span className="label">Local Path:</span>
                  <span className="value">{folder.path}</span>
                </div>
                
                <div className="folder-detail-row">
                  <span className="label">Share Name:</span>
                  <span className="value">{folder.share_name}</span>
                </div>
                
                <div className="folder-detail-row">
                  <span className="label">Active Connections:</span>
                  <span className="value">
                    {folder.active_connections}
                    {folder.active_connections > 0 && (
                      <span className="active-indicator">🟢</span>
                    )}
                  </span>
                </div>
                
                <div className="folder-detail-row">
                  <span className="label">Created:</span>
                  <span className="value">
                    {formatDate(folder.created_date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No shared folders found on this endpoint</p>
          </div>
        )}
      </div>
      
      {data.shared_folders.length > 0 && (
        <div className="folders-count">
          {data.shared_folders.length} shared folder{data.shared_folders.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
```

**CSS:**

```css
.shared-folders {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.folder-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.folder-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.folder-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.permissions-badge {
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.folder-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.folder-detail-row {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.folder-detail-row .label {
  color: #6b7280;
  font-weight: 500;
  min-width: 140px;
}

.folder-detail-row .value {
  color: #111827;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  gap: 6px;
}

.active-indicator {
  font-size: 10px;
}
```

---

## 5. UPDATED PAGE COMPONENT

```jsx
// src/pages/NetworkAnalysisPage.jsx
import { AppLayout } from '@/layouts/AppLayout';
import { EndpointSummary } from '@/components/NetworkAnalysis/EndpointSummary';
import { NetworkInterfaces } from '@/components/NetworkAnalysis/NetworkInterfaces';
import { SavedWifiConnections } from '@/components/NetworkAnalysis/SavedWifiConnections';
import { NetworkConnections } from '@/components/NetworkAnalysis/NetworkConnections';
import { ArpCache } from '@/components/NetworkAnalysis/ArpCache';
import { SharedFolders } from '@/components/NetworkAnalysis/SharedFolders';
import { AnomaliesDetected } from '@/components/NetworkAnalysis/AnomaliesDetected';

export function NetworkAnalysisPage({ deviceId }) {
  const { data, isLoading } = useNetworkAnalysisData(deviceId);
  
  if (isLoading) {
    return (
      <AppLayout currentPage="network-analysis">
        <ContentLoadingState 
          title="Network Analysis"
          description="Loading network configuration data..."
        />
      </AppLayout>
    );
  }
  
  return (
    <AppLayout currentPage="network-analysis">
      <div className="network-analysis-page">
        <header className="page-header">
          <h1>Network Analysis: {data.endpoint.hostname}</h1>
          <p className="page-description">
            Comprehensive network configuration and connectivity analysis for {data.endpoint.type.toLowerCase()} endpoint
          </p>
        </header>
        
        <EndpointSummary data={data.endpoint} />
        
        <NetworkInterfaces data={data.network_interfaces} />
        
        <SavedWifiConnections data={data.wifi_connections} />
        
        <NetworkConnections data={data.network_connections} />
        
        <ArpCache data={data.arp_cache} />
        
        <SharedFolders data={data.shared_folders} />
        
        <AnomaliesDetected anomalies={data.anomalies} />
      </div>
    </AppLayout>
  );
}
```

---

## 6. MOCK DATA GENERATION

```javascript
// src/utils/mockData/networkAnalysisData.js

export function generateNetworkAnalysisMockData(deviceId) {
  return {
    endpoint: {
      endpoint_id: deviceId,
      type: "Server",
      hostname: "CONTOSO-SRV-DB01",
      current_ip: "192.168.1.210",
      mac_address: "00:11:22:33:44:AA",
      os: "Windows Server 2019",
      user: "dbadmin",
      last_seen: new Date().toISOString()
    },
    
    network_interfaces: {
      snapshot_timestamp: new Date().toISOString(),
      interfaces: [
        {
          id: "eth0",
          network_type: "Ethernet",
          description: "Realtek PCIe GbE Family Controller",
          mac_address: "00:11:22:33:44:AA",
          ipv4: "192.168.1.210",
          ipv6: "fe80::a4b2:c3d4:e5f6:7890",
          default_gateway: "192.168.1.1",
          dns_servers: ["8.8.8.8", "8.8.4.4"],
          dhcp_enabled: true,
          dhcp_server: "192.168.1.1",
          status: "connected"
        },
        {
          id: "wlan0",
          network_type: "WiFi",
          description: "Intel(R) Wireless-AC 9560 160MHz",
          mac_address: "A4:B2:C3:D4:E5:F6",
          ipv4: null,
          ipv6: "fe80::1234:5678:90ab:cdef",
          default_gateway: null,
          dns_servers: [],
          dhcp_enabled: true,
          dhcp_server: null,
          status: "disconnected"
        }
      ]
    },
    
    wifi_connections: {
      wifi_connections: [
        {
          id: "wifi-001",
          ssid: "HomeNetwork_5G",
          bssid: "A4:12:34:56:78:9A",
          security_type: "WPA2-Personal",
          first_connected: "2025-11-15T14:23:00Z",
          last_connected: "2025-11-18T21:15:00Z",
          connection_count: 47,
          signal_strength: -45,
          frequency: "5GHz"
        },
        {
          id: "wifi-002",
          ssid: "Office-WiFi",
          bssid: "B8:27:EB:12:34:56",
          security_type: "WPA2-Enterprise",
          first_connected: "2025-11-17T09:00:00Z",
          last_connected: "2025-11-17T18:30:00Z",
          connection_count: 12,
          signal_strength: -62,
          frequency: "2.4GHz"
        },
        {
          id: "wifi-003",
          ssid: "Starbucks-WiFi",
          bssid: "C4:23:45:67:89:AB",
          security_type: "Open",
          first_connected: "2025-11-16T12:00:00Z",
          last_connected: "2025-11-16T13:30:00Z",
          connection_count: 1,
          signal_strength: -72,
          frequency: "2.4GHz"
        }
      ]
    },
    
    network_connections: {
      connections: generateNetworkConnections(50)
    },
    
    arp_cache: {
      arp_entries: [
        {
          id: "arp-001",
          type: "dynamic",
          ip_address: "192.168.1.1",
          mac_address: "00:11:22:33:44:55",
          interface_name: "eth0"
        },
        {
          id: "arp-002",
          type: "static",
          ip_address: "192.168.1.100",
          mac_address: "A4:B2:C3:D4:E5:F6",
          interface_name: "eth0"
        },
        {
          id: "arp-003",
          type: "dynamic",
          ip_address: "192.168.1.50",
          mac_address: "12:34:56:78:9A:BC",
          interface_name: "eth0"
        }
      ]
    },
    
    shared_folders: {
      shared_folders: [
        {
          id: "share-001",
          name: "Public Documents",
          path: "C:\\Users\\Public\\Documents",
          share_name: "\\\\CONTOSO-SRV-DB01\\Public",
          permissions: "Read",
          active_connections: 0,
          created_date: "2025-10-01T10:00:00Z"
        },
        {
          id: "share-002",
          name: "Company Files",
          path: "D:\\Shares\\Company",
          share_name: "\\\\CONTOSO-SRV-DB01\\CompanyFiles",
          permissions: "Full Control",
          active_connections: 3,
          created_date: "2025-09-15T14:30:00Z"
        }
      ]
    },
    
    anomalies: [
      {
        id: "anomaly-001",
        timestamp: "2025-11-15T14:32:00Z",
        type: "unusual_connection",
        severity: "high",
        description: "Unusual outbound connection to unknown IP",
        metric_value: "8.8.8.8:443",
        average_value: "Known destinations",
        affected_metric: "network_connections"
      },
      {
        id: "anomaly-002",
        timestamp: "2025-11-16T02:15:00Z",
        type: "off_hours_activity",
        severity: "medium",
        description: "Network activity detected during off-hours",
        metric_value: "45 connections",
        average_value: "2 connections",
        affected_metric: "network_activity"
      },
      {
        id: "anomaly-003",
        timestamp: "2025-11-17T09:45:00Z",
        type: "shared_folder_access",
        severity: "medium",
        description: "Unusual access to shared folder",
        metric_value: "15 access attempts",
        average_value: "3 access attempts",
        affected_metric: "shared_folders"
      }
    ]
  };
}

function generateNetworkConnections(count) {
  const connections = [];
  const destIps = ["8.8.8.8", "142.250.191.14", "20.42.73.29", "52.96.145.88", "192.168.1.1"];
  const protocols = ["TCP", "UDP"];
  const states = ["ESTABLISHED", "TIME_WAIT", "CLOSE_WAIT", "LISTENING"];
  const processes = ["chrome.exe", "firefox.exe", "sqlservr.exe", "svchost.exe"];
  
  for (let i = 0; i < count; i++) {
    const destIp = destIps[Math.floor(Math.random() * destIps.length)];
    const now = new Date();
    const startTime = new Date(now.getTime() - Math.random() * 3600000);
    
    connections.push({
      id: `conn-${i + 1}`,
      collection_start: startTime.toISOString(),
      collection_end: now.toISOString(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      source_ip: "192.168.1.210",
      source_port: 50000 + i,
      dest_ip: destIp,
      dest_port: [80, 443, 3389, 1433][Math.floor(Math.random() * 4)],
      state: states[Math.floor(Math.random() * states.length)],
      process_name: processes[Math.floor(Math.random() * processes.length)],
      pid: 1000 + Math.floor(Math.random() * 5000)
    });
  }
  
  return connections;
}
```

---

**END OF PRD**

This complete redesign removes all traffic analysis visualizations and replaces them with detailed network configuration and connectivity information. All unnecessary widgets have been identified for removal to keep the codebase clean.