# 🌑 Echoes of the Void

> *An AI-Native Infinite Text Adventure Engine*

[![Built with Kiro IDE](https://img.shields.io/badge/Built%20with-Kiro%20IDE-6366f1?style=for-the-badge)](https://kiro.dev)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

**🎮 [Live Demo](#)** | **📹 [Video Demo](#)**

---

## 🎃 Kiroween Hackathon 2025 Submission

This project is a submission for the **Kiroween Hackathon 2025**, targeting three tracks:

### 🧟 Resurrection
Reviving the golden age of **80s text adventures** with modern LLM technology. Remember Zork? Imagine it powered by AI that actually understands context, maintains state, and generates infinite, coherent narratives. We've resurrected the genre and given it a beating heart.

### 🎭 Costume Contest
Full **CRT terminal aesthetics** that would make any retro enthusiast weep with joy:
- Authentic scanline overlays
- Phosphor glow text effects
- Screen curvature simulation
- Flicker animations
- Screen shake on damage
- Fake BIOS boot sequence

### 💀 Skeleton Crew
A **highly adaptable engine** where the entire game genre transforms by simply editing a single file. Horror? Sci-Fi? Fantasy? The skeleton is the same—the flesh is whatever you want it to be.

---

## ✨ Key Features

### 🔮 Reality Shifter (Multi-Genre Engine)
Switch between **Horror**, **Sci-Fi**, and **Fantasy** modes instantly through the in-game BIOS menu. No page reload required—the universe reboots itself.

| Protocol | Setting | Vibe |
|----------|---------|------|
| `HORROR` | The Void - Underground Complex | Lovecraftian dread |
| `SCI-FI` | Station Erebus - Derelict Space Station | Alien/Dead Space tension |
| `FANTASY` | The Abyssal Depths - Ancient Dungeon | Classic D&D crawl |

### 🎨 Contextual ASCII Art
Dynamic ASCII art with **semantic coloring**:
- 🔴 **Red** — Danger (monsters, skeletons)
- 🟡 **Gold** — Loot (chests, treasures)
- 🔵 **Cyan** — Information (doors, portals)

### 🎬 Sensory Feedback System
- **Screen Shake** — Visual feedback when taking damage
- **Typewriter Effect** — Immersive text rendering with adjustable speed
- **Text Speed Control** — Slow, Normal, Fast, or Instant
- **Atmospheric Soundscapes** — Wind, drips, combat, and screams

### 📱 Responsive Design
- Custom **BIOS-style modal** optimized for mobile
- Adaptive CRT effects that scale gracefully
- Touch-friendly controls
- Accessible with `prefers-reduced-motion` support

---

## 🔧 How to Mod (Skeleton Crew)

Want to create your own game? The engine is designed for it.

### Step 1: Edit the System Prompt
Open `src/lib/prompts.ts` and create your own theme:

```typescript
export const MY_CUSTOM_PROMPT = `You are the Game Master for "My Custom Game"...

## TONE & STYLE
- Your custom tone here...

## WORLD RULES
- Your world rules here...
`;
```

### Step 2: Add Theme Configuration
Add your theme to `THEME_CONFIG`:

```typescript
export const THEME_CONFIG: Record<ThemeKey, {...}> = {
  // ... existing themes
  mycustom: {
    displayName: 'PROTOCOL: MY CUSTOM',
    openingLine: 'The player has just arrived in your world...',
    helpMessage: `COMMAND LIST: ...`,
  },
};
```

### Step 3: Register the Theme
Add your theme key to `ThemeKey` type and `THEMES` record.

That's it. **New game, same engine.**

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS + Custom CRT CSS |
| **Animations** | Pure CSS Animations |
| **State Management** | Zustand (with session safety) |
| **AI Integration** | Vercel AI SDK + Google Gemini 2.5 Flash |
| **Validation** | Zod (Structured Outputs) |
| **Audio** | Web Audio API |

### Architecture Highlights

- **Server Actions** — AI calls happen server-side for security
- **Structured Outputs** — Zod schemas ensure consistent AI responses
- **Session Tracking** — Race condition protection during theme switches
- **Graceful Error Handling** — Themed error messages that stay in character

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- A Google AI API key ([Get one here](https://aistudio.google.com/apikey))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/echoes-of-the-void.git
cd echoes-of-the-void

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter The Void.

---

## 🎮 How to Play

| Command | Action |
|---------|--------|
| `look` | Inspect your surroundings |
| `check inventory` | See what you're carrying |
| `take [item]` | Pick up an object |
| `use [item]` | Use an item |
| `north/south/east/west` | Move in a direction |
| `help` | Show command list |

**Pro tip:** The AI understands natural language. Try anything. The Void responds to creativity.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/          # Server actions (AI integration)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main game page
├── components/
│   ├── RetroTerminal.tsx # CRT container with effects
│   ├── NarrativeLog.tsx  # Story display with typewriter
│   ├── CommandInput.tsx  # Player input handling
│   ├── StatusBar.tsx     # Health & inventory display
│   ├── ASCIIRenderer.tsx # Contextual ASCII art
│   └── GameOverScreen.tsx# Death screen
├── lib/
│   ├── prompts.ts        # 🎯 Theme definitions (mod this!)
│   ├── schema.ts         # Zod validation schemas
│   ├── ascii.ts          # ASCII art library
│   ├── sound-manager.ts  # Audio system
│   └── typewriter.ts     # Text animation utilities
├── store/
│   └── game-store.ts     # Zustand state management
├── styles/
│   └── crt.css           # CRT visual effects
└── types/
    └── game.ts           # TypeScript definitions
```

---

## 🙏 Acknowledgments

- **Kiro IDE** — For making AI-assisted development a joy
- **Zork & Infocom** — For pioneering the genre we're resurrecting
- **The 80s** — For the aesthetic that never dies

---

<p align="center">
  <strong>POWERED BY KIRO IDE // KIROWEEN 2025</strong>
  <br />
  <em>The Void awaits. Will you answer?</em>
</p>
