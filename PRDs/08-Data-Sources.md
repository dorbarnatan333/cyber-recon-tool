# PRD: Data Sources

## Overview
Data collection and integration module managing various reconnaissance data sources including system queries, network scans, browser forensics, and external intelligence feeds. Provides unified interface for data acquisition, transformation, and storage.

## Purpose
Enable security analysts to configure, monitor, and manage data collection from multiple sources. Centralizes data ingestion pipelines, handles data transformation, maintains data quality, and provides visibility into collection status and health.

---

## Requirements

### REQ-DATASOURCE-001: Data Source Registry

**Title**: Display All Configured Data Sources

**Description**:
Show list of all data sources with status, type, configuration, and collection statistics.

**Acceptance Criteria**:
- Card container with header "Data Sources" and database icon
- Table or list view of data sources
- Each source shows:
  - Source name and type (System, Network, Browser, External API)
  - Status (active/inactive/error)
  - Last collection timestamp
  - Records collected count
  - Collection frequency/schedule
  - Health indicator
- Status badges color-coded: active=green, inactive=gray, error=red
- Health indicators (good/warning/critical)
- Action buttons: Configure, Enable/Disable, Refresh
- Empty state when no sources configured
- Card uses glass variant

**Technical Implementation**:
- Data source structure: id, name, type, status, last_collection, record_count, schedule, health, config (object)
- Status badge with conditional variant
- Health indicator component (icon or badge)
- Action buttons with appropriate handlers
- Timestamp formatter
- Empty state component

---

### REQ-DATASOURCE-002: Source Type Categories

**Title**: Organize Data Sources by Category

**Description**:
Group data sources into logical categories for better organization and management.

**Acceptance Criteria**:
- Four main categories:
  1. **System Data**: OS info, processes, services, registry
  2. **Network Data**: Interfaces, connections, ARP, WiFi, shares
  3. **Browser Data**: History, downloads, bookmarks, credentials, extensions
  4. **External Data**: Threat intelligence, CVE feeds, WHOIS, DNS
- Category view with expandable sections
- Source count per category
- Category-specific actions (enable all, disable all, refresh all)
- Category health rollup (overall health of sources in category)

**Technical Implementation**:
- Category grouping logic based on source type
- Expandable category state (Set of expanded category IDs)
- Category summary calculations (count, health rollup)
- Bulk action handlers per category
- Category header component with counts and actions

---

### REQ-DATASOURCE-003: Collection Status Dashboard

**Title**: Display Data Collection Statistics and Status

**Description**:
Show dashboard of collection metrics including total sources, active collections, error counts, and recent activity.

**Acceptance Criteria**:
- Statistics cards showing:
  - Total Sources (count)
  - Active Collections (count with pulse indicator)
  - Failed Collections (error count)
  - Total Records (sum across all sources)
- Recent collection activity timeline
- Collection success rate indicator
- Data freshness metrics (oldest data timestamp)
- Card uses solid variant with appropriate borders

**Technical Implementation**:
- Statistics calculations from data sources array
- Active count: filter by status === 'active'
- Failed count: filter by status === 'error'
- Total records: sum of record_count fields
- Success rate: (successful collections / total collections) * 100
- Recent activity: sorted by last_collection timestamp
- Freshness: min of last_collection timestamps

---

### REQ-DATASOURCE-004: Source Configuration Panel

**Title**: Configure Data Source Settings

**Description**:
Provide interface to configure individual data source settings including collection frequency, filters, and parameters.

**Acceptance Criteria**:
- Modal or panel for source configuration
- Configuration options vary by source type:
  - Collection frequency (manual, interval, scheduled)
  - Filters (date ranges, specific targets, exclusions)
  - Authentication credentials (if required)
  - Data retention settings
  - Output format preferences
- Validation for required fields
- Test connection/preview button
- Save and Cancel actions
- Configuration stored per source

**Technical Implementation**:
- Modal/panel component with form
- Dynamic form fields based on source type
- Form state management
- Validation logic for required fields and formats
- Test connection handler (async)
- Save handler updating source configuration
- Cancel handler closing modal without changes

---

### REQ-DATASOURCE-005: Manual Collection Trigger

**Title**: Manually Trigger Data Collection

**Description**:
Allow analysts to manually initiate data collection from specific sources on-demand.

**Acceptance Criteria**:
- Refresh/collect button per data source
- Bulk select and collect multiple sources
- Collection progress indicator
- Real-time status updates during collection
- Success/failure notification after completion
- Collection log showing what was collected
- Option to force re-collection (overwrite existing)

**Technical Implementation**:
- Refresh button with loading state
- Bulk selection state (Set of selected source IDs)
- Collection API call with source ID
- Progress state per source
- Status update handlers (WebSocket or polling)
- Notification component for completion
- Collection log data structure

---

### REQ-DATASOURCE-006: Collection Schedule Management

**Title**: Configure Automated Collection Schedules

**Description**:
Set up recurring collection schedules for automatic data gathering at specified intervals.

**Acceptance Criteria**:
- Schedule configuration per source:
  - Frequency type (manual, interval, cron)
  - Interval: Every N minutes/hours/days
  - Cron: Custom cron expression with builder
  - Time windows (only collect during specific hours)
  - Retry policy (attempts, backoff)
- Visual cron builder for non-technical users
- Next collection time preview
- Schedule validation
- Enable/disable schedule toggle
- Schedule history and logs

**Technical Implementation**:
- Schedule data structure: type, interval, cron_expression, time_windows, retry_config, enabled
- Cron builder component (dropdown-based or visual)
- Next run calculation from schedule
- Validation logic for schedules
- Schedule API endpoints
- History/log data structure with timestamps and results

---

### REQ-DATASOURCE-007: Data Quality Monitoring

**Title**: Monitor Data Quality and Completeness

**Description**:
Track data quality metrics including completeness, accuracy, and freshness.

**Acceptance Criteria**:
- Quality metrics per source:
  - Completeness (% of expected fields populated)
  - Freshness (time since last successful collection)
  - Error rate (failed collections / total attempts)
  - Data volume trends (records over time)
- Quality score calculation (0-100)
- Quality alerts when score drops below threshold
- Quality trend visualization (chart)
- Drilldown into specific quality issues

**Technical Implementation**:
- Quality metric calculations
- Completeness: (populated_fields / total_fields) * 100
- Freshness: current_time - last_collection_time
- Error rate: (failed_count / total_count) * 100
- Quality score algorithm combining metrics
- Threshold configuration
- Alert trigger logic
- Chart component for trends

---

### REQ-DATASOURCE-008: Source Health Checks

**Title**: Implement Health Check System for Data Sources

**Description**:
Perform periodic health checks on data sources to ensure availability and proper functioning.

**Acceptance Criteria**:
- Health check indicators:
  - Connection status (can reach source)
  - Authentication status (credentials valid)
  - Permission status (has required permissions)
  - Dependency status (required services available)
  - Performance metrics (response time, throughput)
- Overall health status: Healthy, Degraded, Critical
- Health check frequency configurable
- Manual health check trigger
- Health history and trends
- Alerts for health degradation

**Technical Implementation**:
- Health check data structure: connection, authentication, permissions, dependencies, performance, overall_status
- Health check API endpoint per source type
- Periodic health check scheduler
- Manual trigger handler
- Health status calculation logic
- History data structure with timestamps
- Alert rules and notification system

---

### REQ-DATASOURCE-009: External API Integration

**Title**: Configure External Intelligence Feed Integrations

**Description**:
Set up integrations with external threat intelligence, CVE databases, and security information sources.

**Acceptance Criteria**:
- Supported external sources:
  - Threat intelligence feeds (AlienVault OTX, MISP, etc.)
  - CVE databases (NVD, MITRE)
  - WHOIS services
  - DNS lookup services
  - IP reputation services
- API key management (secure storage)
- Rate limiting configuration
- Data mapping and transformation rules
- Cache settings for API responses
- Cost tracking for paid APIs (request counts)

**Technical Implementation**:
- External source configurations with API endpoints and auth
- Secure credential storage (encrypted)
- Rate limiter implementation
- Data transformation pipeline
- Cache layer with TTL settings
- Request counter per API
- Cost calculation based on pricing tiers

---

### REQ-DATASOURCE-010: Collection Logs and Audit Trail

**Title**: Maintain Detailed Logs of All Data Collection Activities

**Description**:
Log all collection activities for audit, troubleshooting, and compliance purposes.

**Acceptance Criteria**:
- Log entries include:
  - Timestamp
  - Source name and ID
  - Collection type (manual/scheduled)
  - Triggered by (user or system)
  - Status (success/failure)
  - Records collected count
  - Duration
  - Error messages (if failed)
- Log filtering by source, status, date range, user
- Log search functionality
- Log export (CSV, JSON)
- Log retention policy
- Detailed view with full error traces

**Technical Implementation**:
- Log entry data structure with all required fields
- Log storage (database table or logging service)
- Filter and search logic
- Export handlers
- Retention policy enforcement (delete old logs)
- Detailed view modal or panel
- Pagination for large log sets

---

## Data Requirements

**Data Source Structure**:
```typescript
{
  id: string,
  name: string,
  type: 'system' | 'network' | 'browser' | 'external',
  status: 'active' | 'inactive' | 'error',
  last_collection: string,
  record_count: number,
  schedule: {
    type: 'manual' | 'interval' | 'cron',
    interval?: number,
    cron_expression?: string,
    enabled: boolean
  },
  health: {
    status: 'healthy' | 'degraded' | 'critical',
    connection: boolean,
    authentication: boolean,
    permissions: boolean
  },
  config: object
}
```

**Collection Log Structure**:
```typescript
{
  id: string,
  timestamp: string,
  source_id: string,
  source_name: string,
  type: 'manual' | 'scheduled',
  triggered_by: string,
  status: 'success' | 'failure',
  records_collected: number,
  duration_ms: number,
  error_message?: string,
  details: object
}
```

**Quality Metrics Structure**:
```typescript
{
  source_id: string,
  completeness_score: number,
  freshness_minutes: number,
  error_rate: number,
  quality_score: number,
  last_calculated: string,
  issues: string[]
}
```

## Notes
- All data sources should support dry-run/preview mode
- Sensitive credentials must be encrypted at rest
- Rate limiting critical for external APIs to avoid blocks
- Collection failures should trigger alerts based on severity
- Large collections may need chunking or streaming
- Consider implementing data source templates for common configurations
- Health checks should not impact source performance
- Audit logs essential for compliance (GDPR, SOC2, etc.)
- Support for custom data source plugins/extensions
- Data retention policies should be configurable per source type
- Quality monitoring helps identify issues before they impact analysis
