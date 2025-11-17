# Cyber Reconnaissance Tool

A professional security operations center (SOC) interface for cyber security researchers and penetration testing teams.

## 🛡️ Features

- **Real-time Dashboard** - Monitor active scans, targets, and vulnerabilities
- **Target Management** - Add and manage reconnaissance targets
- **Vulnerability Assessment** - Track and prioritize security findings
- **Security Metrics** - Visual analytics and reporting
- **Dark Theme Interface** - Optimized for security operations

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6

## 🎨 Design System

Custom design system extracted from Figma with:
- **Typography**: Poppins (headings), DM Sans (body), JetBrains Mono (code)
- **Colors**: Cyber security themed with matrix green accents
- **Components**: Professional SOC interface patterns
- **Animations**: Subtle scanning effects and real-time updates

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Fix npm permissions** (if needed):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Base UI components
│   ├── features/     # Security-specific components
│   └── layout/       # Layout components
├── pages/            # Main views/screens
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
├── styles/           # Global styles & CSS
├── assets/           # Images & static files
└── types/            # TypeScript definitions
```

## 🔒 Security Note

This tool is designed for **defensive security purposes only**:
- ✅ Security analysis of your own infrastructure
- ✅ Authorized penetration testing
- ✅ Security monitoring and assessment
- ❌ Unauthorized access attempts
- ❌ Malicious reconnaissance

## 🎯 Usage

1. **Dashboard**: Monitor overall security status
2. **Targets**: Add systems for analysis  
3. **Scanning**: Initiate security scans
4. **Vulnerabilities**: Review and prioritize findings
5. **Reports**: Generate security assessments

## 📊 Features Roadmap

- [ ] Target discovery and enumeration
- [ ] Port scanning interface
- [ ] Vulnerability assessment modules
- [ ] Network topology visualization
- [ ] Security reporting system
- [ ] Real-time monitoring dashboard

## 🤝 Contributing

This is a prototype for security research. Ensure all usage complies with applicable laws and organizational policies.

## 📄 License

For authorized security research and testing purposes only.