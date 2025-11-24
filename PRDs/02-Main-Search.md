# PRD: Main Search

## Overview
Primary search interface serving as the main entry point for investigations. Provides intelligent search type detection and quick access to recently investigated companies. Features a prominent search bar with visual effects and a grid of recent company cards.

## Purpose
Enable security analysts to quickly initiate investigations by searching for devices (IP, MAC, computer name) or companies (company name, domain). Streamlines the investigation workflow by providing quick access to frequently searched organizations and automatically detecting the search type based on input patterns.

---

## Requirements

### REQ-SEARCH-001: Main Search Input

**Title**: Implement Primary Search Input with Visual Effects

**Description**:
Create a prominent search input field as the central element of the page, featuring animated glow effects, clear button, and search button.

**Acceptance Criteria**:
- Large search input (height ~56px, large text size ~18px)
- Placeholder text: "Search by Computer Name, IP, MAC, or Company Name"
- Search icon on left side of input
- Clear button (X icon) appears when input has text, positioned before search button
- Search button on right side with text "Search" or "Searching..." when loading
- Search button disabled when input length < 2 characters
- Animated glow effect on page load:
  - Initial state: Hidden/faded
  - Animation sequence: Appear → Peak glow → Settle to subtle glow
  - Gradient glow using blue and purple colors
  - Multiple glow layers for depth effect
- Input supports Enter key to trigger search
- Auto-focus on page load
- Rounded corners with modern styling
- Translucent background with backdrop blur effect

**Technical Implementation**:
- Container with multiple animated glow layers (outer blur, inner blur)
- Animation phases controlled by state (0: hidden, 1: appearing, 2: peak, 3: settled)
- Timeouts for animation sequence: 300ms → 700ms → 1800ms
- Input element with transparent background and focus ring
- Clear button conditional rendering based on input value
- Search button with gradient background and shadow
- Button disabled state with reduced opacity
- Responsive max-width container (~768px)

---

### REQ-SEARCH-002: Intelligent Search Type Detection

**Title**: Auto-Detect Search Type Based on Input Pattern

**Description**:
Automatically determine whether the search query is for a device (IP, MAC, hostname) or company (domain, company name) based on pattern matching.

**Acceptance Criteria**:
- Detection logic executes before search navigation
- Supported patterns:
  - **IPv4 Address**: xxx.xxx.xxx.xxx format → Device search
  - **MAC Address**: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX format → Device search
  - **Hostname**: Contains dashes or ends with numbers → Device search
  - **Domain**: Contains dots and TLD (e.g., .com, .org) → Company search
  - **Default**: Company search for all other inputs
- Detection result passed to search results page via navigation state
- Search type used to determine result display format

**Technical Implementation**:
- Detection function using regex patterns:
  - IPv4: `/^(\d{1,3}\.){3}\d{1,3}$/`
  - MAC: `/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/`
  - Hostname: `/^[A-Za-z0-9-]+(-\d+)?$/` with dash or trailing number check
  - Domain: `/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/`
- Function returns 'device' or 'company' as search type
- Trimmed input before pattern matching

---

### REQ-SEARCH-003: Recent Companies Grid

**Title**: Display Recently Searched Companies in Grid Layout

**Description**:
Show grid of up to 9 recently searched companies with company name, device count, and last searched date. Companies are clickable to initiate new search.

**Acceptance Criteria**:
- Display companies in 3-column grid on desktop
- Each company card shows:
  - Company name (large, bold, truncated if too long)
  - Device count (e.g., "47 devices")
  - Last searched date (formatted as locale date string)
- Cards have hover effects:
  - Slight elevation/lift
  - Border color change to blue accent
  - Shadow enhancement
- Clicking card initiates search for that company
- Empty state message when no recent companies exist
- Grid responsive: 3 columns desktop → 2 columns tablet → 1 column mobile
- Section header: "Recent Companies" with description "Quick access to frequently investigated organizations"

**Technical Implementation**:
- Grid layout with 3 columns and gap spacing
- Card component with:
  - Translucent background with backdrop blur
  - Border with hover state changes
  - Click handler for navigation
  - Hover transform (translate Y) and shadow transitions
- Company data structure:
  - company_id (string)
  - company_name (string)
  - company_domain (string)
  - device_count (number)
  - last_searched (ISO date string)
  - search_frequency (number)
  - is_pinned (boolean)
- Empty state with centered message and suggestion text

---

### REQ-SEARCH-004: Search Execution and Navigation

**Title**: Handle Search Execution and Navigate to Results

**Description**:
Execute search query, update recent companies list if applicable, and navigate to search results page with query data.

**Acceptance Criteria**:
- Minimum search query length: 2 characters
- Search triggered by:
  - Click on search button
  - Press Enter key in input field
- Loading state during search (simulated 1.5 second delay)
- Search button shows "Searching..." text during loading
- Navigation to `/search/results` route with state:
  - query (search string)
  - searchType ('device' or 'company')
  - timestamp (ISO date string)
- For company searches, update recent companies list
- Search execution disabled during loading state

**Technical Implementation**:
- Loading state boolean
- Search handler with async delay (simulated API call)
- Navigation with react-router or equivalent
- State passed via navigation state object
- Button disabled when loading or query length < 2
- Enter key handler on input element

---

### REQ-SEARCH-005: Recent Companies Management

**Title**: Persist and Manage Recent Companies in LocalStorage

**Description**:
Store recently searched companies in browser localStorage, update on new searches, and manage list size (max 9 companies).

**Acceptance Criteria**:
- Load recent companies from localStorage on component mount
- Storage key: 'truth_recent_companies' (or configurable key)
- Store up to 9 companies maximum
- When searching existing company:
  - Move company to front of list
  - Update last_searched timestamp
  - Increment search_frequency counter
- When clicking recent company card:
  - Update last_searched timestamp
  - Increment search_frequency
  - Move to front of list
  - Save updated list to localStorage
- Handle localStorage errors gracefully (use fallback mock data)
- Parse JSON data safely with error handling

**Technical Implementation**:
- UseEffect hook for loading on mount
- LocalStorage operations:
  - getItem() with JSON.parse()
  - setItem() with JSON.stringify()
  - Try-catch for error handling
- Company list operations:
  - Find existing company by name or domain match
  - Splice to remove from current position
  - Unshift to add to front
  - Slice to limit to 9 items
- Fallback mock data array with 9 sample companies

---

### REQ-SEARCH-006: Page Header with Branding

**Title**: Create Header with Logo, Title, and Theme Toggle

**Description**:
Display persistent header with application branding (logo, name, tagline) and theme toggle button.

**Acceptance Criteria**:
- Header with translucent background and backdrop blur
- Bottom border for separation
- Header contains:
  - Logo icon (left side) - "T" symbol in blue gradient circle
  - App name: "Truth" (bold)
  - Tagline: "Endpoint Investigation System" (small text)
  - Theme toggle button (right side)
- Header uses max-width container with padding
- Sticky or fixed positioning at top of page
- Header content arranged horizontally with space-between layout

**Technical Implementation**:
- Header element with backdrop blur and translucent background
- Border bottom with semi-transparent color
- Logo container with gradient background and rounded corners
- SVG or icon for logo symbol
- Theme toggle component positioned on right
- Flexbox layout for horizontal arrangement
- Max-width container (~1280px) with responsive padding
- Typography: Large bold for app name, small for tagline

---

### REQ-SEARCH-007: Main Content Layout

**Title**: Implement Centered Layout with Title and Sections

**Description**:
Create main content area with centered layout, page title, description, and organized sections for search and recent companies.

**Acceptance Criteria**:
- Vertically centered content on page (flexbox centering)
- Max-width container (~1024px) centered horizontally
- Page title section:
  - Large heading: "Start Your Investigation" with gradient text effect (blue to purple)
  - Decorative underline (gradient line, centered)
  - Primary description: "Uncover digital insights with Truth's advanced reconnaissance platform"
  - Secondary description: "Search by Computer Name, IP Address, MAC Address, or Company Name to begin your investigation"
- Content sections in order:
  1. Page title and descriptions
  2. Search input (with spacing)
  3. Recent companies section (with spacing)
- Consistent vertical spacing between sections
- Background gradient from slate to blue

**Technical Implementation**:
- Page container with min-height screen and flex column layout
- Main content area with flex-1 and centered content
- Max-width wrapper for content (~1024px)
- Title with gradient background clipped to text
- Gradient: blue-600 to purple-600 (light mode), blue-400 to purple-400 (dark mode)
- Decorative line: 24px width, gradient from blue to purple
- Vertical spacing between sections: 48px for title, 48px for search, standard spacing for recent
- Background: gradient from slate-50 to blue-50 (light), gray-950 to gray-900 (dark)

---

### REQ-SEARCH-008: Company Card Click Handler

**Title**: Handle Recent Company Card Clicks

**Description**:
When user clicks a recent company card, update that company's metadata and navigate to search results for that company.

**Acceptance Criteria**:
- Card click triggers:
  - Loading state (visual feedback)
  - Update company's last_searched to current timestamp
  - Increment company's search_frequency
  - Move company to front of recent list
  - Save updated list to localStorage
  - Navigate to `/search/results` with company data
- Navigation state includes:
  - query: company name
  - searchType: 'company'
  - timestamp: current ISO timestamp
- Loading state shows during navigation

**Technical Implementation**:
- Click handler function receiving company object
- Loading state boolean for UI feedback
- Company list operations:
  - Find company by ID in list
  - Update timestamps and frequency
  - Reorder list (remove and insert at front)
  - Save to localStorage
  - Update component state
- Navigation with company name as query
- State object structure matching search execution

---

### REQ-SEARCH-009: Search Input Clear Function

**Title**: Clear Search Input Button

**Description**:
Provide button to clear search input text when input contains value.

**Acceptance Criteria**:
- Clear button (X icon) appears when search input has text
- Button positioned inside input field, before search button
- Clicking clear button:
  - Clears input value
  - Hides clear button
  - Keeps focus on input (optional)
- Button has hover effect (color change)
- Button icon size ~20px

**Technical Implementation**:
- Conditional rendering based on search query length
- Click handler to reset search query state to empty string
- Button positioned absolutely within input container
- Icon from icon library (X or Close icon)
- Hover color transition
- Prevent button click from triggering input focus issues

---

### REQ-SEARCH-010: Empty State for Recent Companies

**Title**: Display Empty State When No Recent Companies

**Description**:
Show helpful message when recent companies list is empty.

**Acceptance Criteria**:
- Displayed when recent companies array length is 0
- Empty state card with:
  - Primary message: "No recent companies found."
  - Secondary message: "Start by searching for a company above."
  - Card has same styling as company cards
  - Centered text alignment
- Card takes full width of grid

**Technical Implementation**:
- Conditional rendering based on array length
- Card component with translucent background and border
- Text elements with appropriate sizing and color
- Same border radius and styling as recent company cards
- Padding for comfortable spacing

---

### REQ-SEARCH-011: Keyboard Navigation Support

**Title**: Support Enter Key for Search Submission

**Description**:
Allow users to submit search by pressing Enter key while focused on search input.

**Acceptance Criteria**:
- Pressing Enter key in search input triggers search
- Same behavior as clicking search button
- Works only when search query length >= 2 characters
- Does not submit when search is already loading

**Technical Implementation**:
- KeyPress or KeyDown event handler on input element
- Check for Enter key (key === 'Enter' or keyCode === 13)
- Call same search handler function as button click
- Respect same validation rules (min length, not loading)

---

## Data Requirements

**Mock Data for Recent Companies**:
```typescript
[
  {
    company_id: 'company-001',
    company_name: 'Contoso Corporation',
    company_domain: 'contoso.com',
    device_count: 47,
    last_searched: '2025-11-18T12:00:00Z',
    search_frequency: 15,
    is_pinned: false
  },
  {
    company_id: 'company-002',
    company_name: 'Fabrikam Inc',
    company_domain: 'fabrikam.com',
    device_count: 23,
    last_searched: '2025-11-17T15:30:00Z',
    search_frequency: 8,
    is_pinned: false
  },
  // ... up to 9 total companies
]
```

**Navigation State Structure**:
```typescript
{
  query: string,           // "192.168.1.1" or "Contoso Corporation"
  searchType: 'device' | 'company',
  timestamp: string        // ISO date string
}
```

**LocalStorage Key**:
- Key: `'truth_recent_companies'` (or application-specific prefix)
- Value: JSON stringified array of Company objects

## Notes
- Search delay (1.5 seconds) is simulated for demo purposes - replace with actual API call
- Recent companies limited to 9 for optimal grid display (3x3)
- LocalStorage fallback to mock data ensures page works without prior searches
- Animation timings (300ms, 700ms, 1800ms) create smooth glow effect on page load
- Detection logic prioritizes more specific patterns (IP, MAC) before general patterns (hostname, domain)
- Component names and structure are suggestions - actual implementation may vary
- Theme toggle component should be reusable across application
- Page works as standalone component or integrated into larger application routing
