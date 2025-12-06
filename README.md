# 📺 Teleprompter

A modern, professional teleprompter app built with React and Vite, featuring Apple's **Liquid Glass** design aesthetic.

**Live Demo:** [https://rahsapr.github.io/teleprompter/](https://rahsapr.github.io/teleprompter/)

---

## ✨ Features

### Core Teleprompter
- **Smooth Auto-Scroll** — Butter-smooth scrolling with adjustable speed (0-100)
- **Fullscreen Player Mode** — Distraction-free reading experience
- **Auto-Pause at End** — Automatically stops when script finishes
- **Live/Paused Indicators** — Clear status badges show current state
- **Focus Mask** — Gradient overlay keeps your eyes on the reading line

### Script Management
- **Multi-Script Library** — Create, edit, and manage multiple scripts
- **Folder Organization** — Organize scripts into custom folders
- **Auto-Save** — All scripts saved instantly to browser localStorage
- **Search** — Find scripts quickly with built-in search
- **Bulk Operations** — Select and delete multiple scripts at once
- **Import Files** — Drag & drop `.txt` or `.md` files directly into the editor

### Voice Features *(requires network connection)*
- **Voice Typing** — Dictate scripts hands-free in the editor
- **Voice Follow-Along** — Script highlights words as you speak during playback
- **Voice Onboarding** — First-time setup explains microphone permissions

### Accessibility & Reading Modes
- **Dyslexic-Friendly Mode** — Uses OpenDyslexic font with increased line spacing
- **Light & Dark Modes** — Toggle between themes for any lighting condition
- **Text Mirroring** — Horizontal flip for beam-splitter teleprompter setups
- **Adjustable Font Size** — Scale from 20px to 150px

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Adjust scroll speed |
| `←` / `→` | Skip backward / forward |
| `Escape` | Exit player mode |
| `?` | Show help modal |

### Design & UI
- **Liquid Glass Aesthetic** — Inspired by iOS 26 glassmorphism
- **Apple Blue Accent** — Clean, non-AI-looking color palette
- **SF Pro Typography** — System fonts for native feel
- **Smooth Animations** — Refined micro-interactions on all buttons
- **Contextual Tooltips** — Hover hints on all controls
- **First-Run Onboarding** — Guided introduction for new users

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠 Tech Stack

- **React 18** — Component-based UI
- **Vite** — Lightning-fast dev server & build
- **Web Speech API** — Voice recognition (Chrome/Edge)
- **localStorage** — Persistent script storage
- **GitHub Pages** — Automatic deployment

---

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Edge
- ⚠️ Safari (limited voice features)
- ⚠️ Firefox (no voice features)

---

## 📁 Project Structure

```
teleprompter/
├── src/
│   ├── components/
│   │   ├── ControlPanel.jsx    # Player controls bar
│   │   ├── Icons.jsx           # SVG icon components
│   │   ├── PromptPlayer.jsx    # Main scrolling display
│   │   ├── Help/               # Help modal
│   │   ├── Onboarding/         # First-run onboarding
│   │   ├── Sidebar/            # Script library sidebar
│   │   ├── Studio/             # Editor components
│   │   └── Analytics/          # Stats dashboard
│   ├── hooks/
│   │   ├── useScriptManager.js # Script CRUD operations
│   │   ├── useVoiceScroll.js   # Voice follow-along logic
│   │   └── useStats.js         # Usage analytics
│   ├── App.jsx                 # Main app component
│   └── index.css               # Global Liquid Glass styles
└── public/
    └── voice-test.html         # Voice API diagnostic tool
```

---

## 🎨 Design System

### Colors (Dark Mode)
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#000000` | Page background |
| `--accent` | `#0A84FF` | Apple Blue |
| `--success` | `#30D158` | Apple Green |
| `--error` | `#FF453A` | Apple Red |

### Glassmorphism
```css
backdrop-filter: blur(20px);
background: rgba(40, 40, 45, 0.6);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 📄 License

MIT © 2025

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss major changes.
