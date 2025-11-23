// Mock data generator for Browser Analysis page
// Generates comprehensive browser forensics data for cybersecurity investigations

export interface BrowserProfile {
  name: string
  user_email: string | null
}

export interface Browser {
  id: string
  name: string
  version: string
  icon: string
  install_path: string
  last_used: string
  data_collected: boolean
  profiles: BrowserProfile[]
  history_entries: number
  bookmarks_count: number
  extensions_count: number
}

export interface TimelineData {
  timestamp: string
  hour: number
  activity_count: number
  browser: string
}

export interface VisitDetail {
  visit_time: string
  duration: number // in seconds
}

export interface HistoryEntry {
  id: string
  browser: string
  profile: string
  url: string
  title: string
  visit_time: string
  visit_count: number
  typed_count: number
  last_visit: string
  transition: string
  flagged?: boolean
  visit_details?: VisitDetail[] // detailed visits for expandable rows
}

export interface DownloadDetail {
  timestamp: string
  status: string
  bytes_downloaded: number
}

export interface Download {
  id: string
  browser: string
  profile: string
  filename: string
  file_size: number
  file_type: string
  download_url: string
  download_path: string
  start_time: string
  end_time: string
  state: string
  danger_type: string
  opened: boolean
  referrer_url: string
  file_hash: string
  download_details?: DownloadDetail[] // detailed download progress for expandable rows
}

export interface Extension {
  id: string
  browser: string
  profile: string
  name: string
  version: string
  description: string
  enabled: boolean
  install_date: string
  update_date: string
  permissions: string[]
  risk_level: string
  from_store: boolean
  developer: string
  store_url?: string
}

export interface Bookmark {
  id: string
  browser: string
  profile: string
  title: string
  url: string
  folder_path: string
  date_added: string
  date_modified: string
}

export interface SavedCredential {
  id: string
  url: string
  username: string
  password: string
  password_strength: 'weak' | 'medium' | 'strong'
  last_used: string
  created_date: string
  browser: string
  profile: string
  is_duplicate: boolean
}

export interface SecurityArtifacts {
  saved_credentials: {
    count: number
    weak_passwords: number
    duplicate_credentials: number
  }
  autofill_data: {
    addresses: number
    credit_cards: number
    phone_numbers: number
  }
  cookies: {
    total: number
    persistent: number
    session: number
    third_party: number
    tracking: number
  }
  cache: {
    total_size: number
    entries: number
    last_cleared: string
  }
}

export interface SuspiciousActivity {
  id: string
  timestamp: string
  type: string
  severity: string
  browser: string
  profile: string
  description: string
  details: Record<string, any>
  affected_metric: string
}

export interface BrowserAnalysisData {
  endpoint: {
    endpoint_id: string
    type: string
    hostname: string
    current_ip: string
    mac_address: string
    os: string
    user: string
    last_seen: string
  }
  browsers: Browser[]
  timeline_data: TimelineData[]
  history_entries: HistoryEntry[]
  downloads: Download[]
  extensions: Extension[]
  bookmarks: Bookmark[]
  security_artifacts: SecurityArtifacts
  suspicious_activities: SuspiciousActivity[]
  saved_credentials: SavedCredential[] // new field for credentials widget
}

export function generateBrowserAnalysisMockData(deviceId: string): BrowserAnalysisData {
  return {
    endpoint: {
      endpoint_id: deviceId,
      type: "Computer",
      hostname: "CONTOSO-WKS-001",
      current_ip: "192.168.1.105",
      mac_address: "A4:B2:C3:D4:E5:F6",
      os: "Windows 11 Pro",
      user: "john.doe",
      last_seen: new Date().toISOString()
    },

    browsers: [
      {
        id: "chrome-001",
        name: "Google Chrome",
        version: "120.0.6099.130",
        icon: "chrome",
        install_path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        last_used: new Date(Date.now() - 7200000).toISOString(),
        data_collected: true,
        profiles: [
          { name: "Default", user_email: "john.doe@company.com" },
          { name: "Work Profile", user_email: "jdoe@company.com" }
        ],
        history_entries: 15423,
        bookmarks_count: 234,
        extensions_count: 12
      },
      {
        id: "edge-001",
        name: "Microsoft Edge",
        version: "120.0.2210.91",
        icon: "edge",
        install_path: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        last_used: new Date(Date.now() - 86400000).toISOString(),
        data_collected: true,
        profiles: [{ name: "Default", user_email: null }],
        history_entries: 3421,
        bookmarks_count: 67,
        extensions_count: 5
      },
      {
        id: "firefox-001",
        name: "Mozilla Firefox",
        version: "121.0",
        icon: "firefox",
        install_path: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
        last_used: new Date(Date.now() - 259200000).toISOString(),
        data_collected: true,
        profiles: [{ name: "default-release", user_email: null }],
        history_entries: 8234,
        bookmarks_count: 156,
        extensions_count: 8
      }
    ],

    timeline_data: generateTimelineData(),
    history_entries: generateHistoryEntries(250),
    downloads: generateDownloads(45),
    extensions: generateExtensions(25),
    bookmarks: generateBookmarks(234),
    security_artifacts: generateSecurityArtifacts(),
    suspicious_activities: generateSuspiciousActivities(),
    saved_credentials: generateSavedCredentials(47)
  }
}

function generateTimelineData(): TimelineData[] {
  const data: TimelineData[] = []
  for (let hour = 0; hour < 24; hour++) {
    const isBusinessHours = hour >= 9 && hour <= 17
    const baseActivity = isBusinessHours ? Math.floor(Math.random() * 300) + 200 : Math.floor(Math.random() * 50)

    data.push({
      timestamp: new Date(2025, 10, 20, hour, 0, 0).toISOString(),
      hour: hour,
      activity_count: baseActivity,
      browser: "chrome"
    })
  }
  return data
}

function generateHistoryEntries(count: number): HistoryEntry[] {
  const domains = [
    "github.com", "stackoverflow.com", "microsoft.com", "google.com",
    "linkedin.com", "company.sharepoint.com", "slack.com", "gmail.com"
  ]

  const suspiciousDomains = [
    "[redacted].onion", "suspicious-download-site.ru", "phishing-page.tk"
  ]

  const entries: HistoryEntry[] = []

  for (let i = 0; i < count; i++) {
    const isSuspicious = Math.random() < 0.02 // 2% suspicious
    const domain = isSuspicious
      ? suspiciousDomains[Math.floor(Math.random() * suspiciousDomains.length)]
      : domains[Math.floor(Math.random() * domains.length)]

    const visitCount = Math.floor(Math.random() * 50) + 1

    // Generate visit details for expandable rows
    const visit_details: VisitDetail[] = []
    for (let j = 0; j < visitCount; j++) {
      visit_details.push({
        visit_time: new Date(Date.now() - Math.random() * 604800000).toISOString(),
        duration: Math.floor(Math.random() * 3600) + 10 // 10 seconds to 1 hour
      })
    }
    // Sort by visit time descending
    visit_details.sort((a, b) => new Date(b.visit_time).getTime() - new Date(a.visit_time).getTime())

    entries.push({
      id: `hist-${i + 1}`,
      browser: ["chrome", "edge", "firefox"][Math.floor(Math.random() * 3)],
      profile: "Default",
      url: `https://${domain}/page-${i}`,
      title: `${domain.split('.')[0]} - Page ${i}`,
      visit_time: new Date(Date.now() - Math.random() * 604800000).toISOString(),
      visit_count: visitCount,
      typed_count: Math.floor(Math.random() * 5),
      last_visit: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      transition: ["link", "typed", "bookmark"][Math.floor(Math.random() * 3)],
      flagged: isSuspicious,
      visit_details: visit_details
    })
  }

  return entries
}

function generateDownloads(count: number): Download[] {
  const files = [
    { name: "company_report_q4.pdf", type: "application/pdf", danger: "safe", size: 2458736 },
    { name: "presentation.pptx", type: "application/vnd.ms-powerpoint", danger: "safe", size: 15678900 },
    { name: "data_export.csv", type: "text/csv", danger: "safe", size: 567890 },
    { name: "installer.exe", type: "application/x-msdownload", danger: "safe", size: 45678900 },
    { name: "malicious_tool.exe", type: "application/x-msdownload", danger: "dangerous", size: 856000 }
  ]

  const downloads: Download[] = []

  for (let i = 0; i < count; i++) {
    const file = files[Math.floor(Math.random() * files.length)]

    downloads.push({
      id: `dl-${i + 1}`,
      browser: ["chrome", "edge", "firefox"][Math.floor(Math.random() * 3)],
      profile: "Default",
      filename: file.name,
      file_size: file.size,
      file_type: file.type,
      download_url: `https://example.com/downloads/${file.name}`,
      download_path: `C:\\Users\\john\\Downloads\\${file.name}`,
      start_time: new Date(Date.now() - Math.random() * 604800000).toISOString(),
      end_time: new Date(Date.now() - Math.random() * 604800000 + 12000).toISOString(),
      state: "completed",
      danger_type: file.danger,
      opened: Math.random() > 0.3,
      referrer_url: "https://example.com",
      file_hash: `sha256:${Math.random().toString(36).substring(2, 15)}...`
    })
  }

  return downloads
}

function generateExtensions(count: number): Extension[] {
  const safeExtensions = [
    { name: "uBlock Origin", desc: "Ad blocker", risk: "low", developer: "Raymond Hill", fromStore: true },
    { name: "LastPass", desc: "Password manager", risk: "low", developer: "LastPass", fromStore: true },
    { name: "Grammarly", desc: "Writing assistant", risk: "medium", developer: "Grammarly Inc.", fromStore: true }
  ]

  const extensions: Extension[] = []

  for (let i = 0; i < count; i++) {
    const ext = safeExtensions[i % safeExtensions.length]
    const isSuspicious = i === count - 1 // Make last one suspicious

    extensions.push({
      id: `ext-${i + 1}`,
      browser: ["chrome", "edge"][Math.floor(Math.random() * 2)],
      profile: "Default",
      name: isSuspicious ? "Unknown Extension" : ext.name,
      version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 50)}.0`,
      description: isSuspicious ? "Description not available" : ext.desc,
      enabled: true,
      install_date: new Date(Date.now() - Math.random() * 15552000000).toISOString(),
      update_date: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      permissions: isSuspicious
        ? ["tabs", "storage", "all_urls", "clipboardRead", "clipboardWrite", "downloads"]
        : ["tabs", "storage", "webNavigation"],
      risk_level: isSuspicious ? "high" : ext.risk,
      from_store: !isSuspicious,
      developer: isSuspicious ? "Unknown" : ext.developer,
      store_url: !isSuspicious ? "https://chrome.google.com/webstore/detail/..." : undefined
    })
  }

  return extensions
}

function generateBookmarks(count: number): Bookmark[] {
  const folders = ["Work/Quick Access", "Work/Resources", "Personal", "Personal/Shopping", "News"]
  const sites = [
    { title: "Company Intranet", url: "https://intranet.company.com" },
    { title: "Email Portal", url: "https://mail.company.com" },
    { title: "GitHub", url: "https://github.com" },
    { title: "Stack Overflow", url: "https://stackoverflow.com" }
  ]

  const bookmarks: Bookmark[] = []

  for (let i = 0; i < count; i++) {
    const site = sites[i % sites.length]

    bookmarks.push({
      id: `bm-${i + 1}`,
      browser: "chrome",
      profile: "Default",
      title: `${site.title}${i > sites.length ? ' ' + i : ''}`,
      url: site.url,
      folder_path: folders[Math.floor(Math.random() * folders.length)],
      date_added: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      date_modified: new Date(Date.now() - Math.random() * 2592000000).toISOString()
    })
  }

  return bookmarks
}

function generateSecurityArtifacts(): SecurityArtifacts {
  return {
    saved_credentials: {
      count: 47,
      weak_passwords: 12,
      duplicate_credentials: 5
    },
    autofill_data: {
      addresses: 3,
      credit_cards: 2,
      phone_numbers: 2
    },
    cookies: {
      total: 3421,
      persistent: 2134,
      session: 1287,
      third_party: 1876,
      tracking: 876
    },
    cache: {
      total_size: 524288000,
      entries: 5432,
      last_cleared: new Date(Date.now() - 432000000).toISOString()
    }
  }
}

function generateSuspiciousActivities(): SuspiciousActivity[] {
  return [
    {
      id: "susp-001",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: "darkweb_access",
      severity: "high",
      browser: "chrome",
      profile: "Work",
      description: "Access to Tor hidden service (.onion domain)",
      details: {
        url: "[redacted].onion",
        duration: "15 minutes",
        data_transferred: "2.3 MB"
      },
      affected_metric: "browsing_history"
    },
    {
      id: "susp-002",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: "malicious_download",
      severity: "critical",
      browser: "chrome",
      profile: "Work",
      description: "Downloaded potentially malicious executable",
      details: {
        filename: "malicious_tool.exe",
        source: "unknown-domain.ru"
      },
      affected_metric: "downloads"
    },
    {
      id: "susp-003",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: "risky_extension",
      severity: "high",
      browser: "chrome",
      profile: "Work",
      description: "Sideloaded extension with excessive permissions",
      details: {
        extension: "Unknown Extension",
        permissions: "Full access to all websites, clipboard, downloads"
      },
      affected_metric: "extensions"
    }
  ]
}

function generateSavedCredentials(count: number): SavedCredential[] {
  const websites = [
    "github.com", "gmail.com", "linkedin.com", "facebook.com", "twitter.com",
    "company.sharepoint.com", "slack.com", "jira.company.com", "aws.amazon.com",
    "azure.microsoft.com", "stackoverflow.com", "reddit.com", "netflix.com"
  ]

  const usernames = [
    "john.doe@company.com", "jdoe", "john_doe", "johnd", "john.doe@gmail.com"
  ]

  const weakPasswords = [
    "password", "123456", "qwerty", "abc123", "password1", "welcome",
    "admin", "letmein", "monkey", "dragon", "master", "sunshine"
  ]

  const mediumPasswords = [
    "Summer2024!", "Winter@Home", "MyP@ssw0rd", "Blue$ky123", "River#2024",
    "Mountain@99", "Ocean*Wave", "Forest$Green", "Desert#Sun", "Valley@Moon",
    "Cloud$Day", "Rain#Fall", "Snow*Peak", "Wind@Flow", "Storm#Sky",
    "Lake@Shore", "Beach$Sand", "Rock#Hard", "Star*Light", "Moon@Night"
  ]

  const strongPasswords = [
    "Xk9#mP2$vL7@nQ5!wR3", "aB8$dE6#fG4!hJ2@kL9", "zY7!xW5#vU3$tS1@rQ9",
    "nM4@bV6$cX8#dF0!gH2", "pO1#qW3$eR5!tY7@uI9", "iU8$oP6#aS4!dF2@gH0",
    "kL9!jK7#hG5$fD3@sA1", "mN2@bV4$cX6#zX8!aS0", "qW1#eR3$tY5!uI7@oP9",
    "aS8!dF6#gH4$jK2@lZ0", "zX9@cV7$bN5#mM3!qW1", "pL2#oK4$iJ6!uY8@tR0",
    "wE1@qA3$sD5#fG7!hJ9", "rT8#yU6$iO4!pA2@lK0", "vB9!nM7#xC5$zS3@dF1"
  ]

  const credentials: SavedCredential[] = []
  const usedPasswords = new Map<string, string>()

  for (let i = 0; i < count; i++) {
    const website = websites[i % websites.length] + (i >= websites.length ? `-${Math.floor(i / websites.length)}` : '')
    const username = usernames[i % usernames.length]

    // Determine password strength and select password accordingly
    let passwordStrength: 'weak' | 'medium' | 'strong'
    let password: string

    if (i < 12) { // First 12 are weak
      passwordStrength = 'weak'
      password = weakPasswords[i % weakPasswords.length]
    } else if (i < 12 + 20) { // Next 20 are medium
      passwordStrength = 'medium'
      password = mediumPasswords[(i - 12) % mediumPasswords.length]
    } else { // Rest are strong
      passwordStrength = 'strong'
      password = strongPasswords[(i - 32) % strongPasswords.length]
    }

    // Some passwords are duplicates (reuse previous password)
    const isDuplicate = i > 5 && Math.random() < 0.1 // 10% duplicates
    if (isDuplicate && usedPasswords.size > 0) {
      const existingPasswords = Array.from(usedPasswords.values())
      password = existingPasswords[Math.floor(Math.random() * existingPasswords.length)]
    } else {
      usedPasswords.set(`cred-${i + 1}`, password)
    }

    credentials.push({
      id: `cred-${i + 1}`,
      url: `https://${website}`,
      username: username,
      password: password,
      password_strength: passwordStrength,
      last_used: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      created_date: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      browser: ["chrome", "edge", "firefox"][Math.floor(Math.random() * 3)],
      profile: "Default",
      is_duplicate: isDuplicate
    })
  }

  return credentials
}
