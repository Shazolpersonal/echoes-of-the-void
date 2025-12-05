# 🌑 Echoes of the Void

**The Infinite Reality-Shifting Text Adventure Engine.**

🚀 **Live Demo:** https://echoes-of-the-void-eight.vercel.app
💻 **GitHub Repo:** https://github.com/Shazolpersonal/echoes-of-the-void

![Built with Kiro IDE](https://img.shields.io/badge/Built%20with-Kiro%20IDE-blueviolet)
![Powered by Gemini 2.5](https://img.shields.io/badge/Powered%20by-Gemini%202.5-blue)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black)

---

## 🎮 About The Project

**Echoes of the Void** is an AI-Native engine that resurrects the golden era of 80s text adventures for the modern age. This isn't just a game—it's a living, breathing narrative engine where every playthrough is unique.

At its core, **Google Gemini** acts as a **Living Dungeon Master**, dynamically generating stories while tracking your health, inventory, and game logic in real-time. Every decision matters. Every action has consequences. The void remembers.

---

## ✨ Key Features

🌌 **Reality Shifter (Skeleton Crew)**
Instantly switch genres mid-game via the BIOS settings. Horror → Sci-Fi → Fantasy → Noir. The engine adapts your narrative, enemies, and atmosphere instantly while preserving your progress.

🧠 **Aggressive AI**
This isn't your friendly tutorial AI. Gemini punishes risky moves with health damage and delivers menacing, atmospheric descriptions. Survival is earned, not given.

📺 **Immersive CRT UI**
Authentic retro aesthetics with scanlines, screen curvature, phosphor glow, and a visceral **Screen Shake Effect** when you take damage. Feel every hit.

🎨 **Contextual ASCII Art**
Dynamic, color-coded ASCII visuals that respond to game state—Red for danger, Gold for loot, Cyan for information. The terminal comes alive.

⚡ **Accessibility First**
Text speed controls (Slow → Normal → Fast → Instant) and a mobile-optimized UI ensure everyone can experience the void.

---

## 🏆 Hackathon Tracks

This project is submitted for the **Kiroween Hackathon 2025** targeting:

- 🪦 **Resurrection** — Bringing back the classic text adventure genre with modern AI
- 💀 **Skeleton Crew** — Modular theme system allows anyone to create new game worlds
- 🎃 **Costume Contest** — Immersive CRT aesthetics and polished retro UI

---

## 🛠️ How to Mod (Skeleton Crew Guide)

Want to create your own game world? It's simple:

1. Open `src/lib/prompts.ts`
2. Find the `THEME_CONFIG` object
3. Add or modify a theme with your own:
   - `name` — Display name for your theme
   - `systemPrompt` — The AI's personality and world rules
   - `initialScenario` — Where the player's journey begins
   - `atmosphere` — Visual and tonal descriptors

The engine handles the rest. Your imagination is the only limit.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **IDE** | Kiro (Spec-Driven Development) |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS |
| **State Management** | Zustand (Session persistence across themes) |
| **AI Engine** | Vercel AI SDK + Google Gemini |
| **Validation** | Zod |

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Shazolpersonal/echoes-of-the-void.git
cd echoes-of-the-void

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add your Google Gemini API key to `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

```bash
# Run the development server
npm run dev
```

Open http://localhost:3000 and enter the void.

---

## 📜 License

MIT License — Fork it, mod it, make it yours.

---

**The void awaits. Will you answer?** 🌌
