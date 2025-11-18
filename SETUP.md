# 🚀 Quick Setup Instructions

## Step 1: Fix npm permissions (run this once)
```bash
sudo chown -R $(whoami) ~/.npm
```

## Step 2: Install dependencies
```bash
npm install
```

## Step 3: Start development server
```bash
npm run dev
```

## Step 4: Open your browser
Navigate to: http://localhost:3000

---

## 🛠️ Alternative if npm issues persist:

### Option 1: Use different npm cache
```bash
npm install --cache /tmp/.npm
```

### Option 2: Clear and reinstall npm
```bash
npm cache clean --force
npm install
```

### Option 3: Use npx for one-time run
```bash
npx vite
```

---

## ✅ You should see:
- Dark cyber-themed interface
- Security Operations Center dashboard
- Matrix green accents and glow effects
- Professional navigation sidebar
- Real-time metrics cards

Ready to continue building!