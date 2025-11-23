# JQL Parser Bug Testing

## Test Cases

### 1. Basic Equality
- `os = "Windows 10"`
- `device_type = "workstation"`

### 2. Contains Operator
- `os CONTAINS "Windows"`
- `users CONTAINS "admin"`

### 3. Comparison Operators
- `open_ports > 5`
- `risk_score >= 70`

### 4. Logical AND/OR
- `os CONTAINS "Windows" AND risk_level = "HIGH"`
- `device_type = "server" OR device_type = "workstation"`

### 5. Time-based Filters
- `last_activity < "7d"`
- `last_activity < "24h"`

### 6. IN Operator
- `device_type IN ["server", "workstation"]`
- `risk_level IN ["CRITICAL", "HIGH"]`

## Issues Found:

