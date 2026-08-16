# 🐾 TAILORY — International Dog Day AI Experience & Keepsake

> **"Every dog has a story. We just help you tell it."**  
> *Built for the Google AI Studio & Hackathon Showcase — Celebrating International Dog Day 2026.*

---

## 🌟 Quick Links & Deployment

- **Live Application**: [Launch TAILORY Live App](https://ais-pre-vfnndg2hhbm7prqkr3uvp3-123668770786.europe-west2.run.app)
- **Development App**: [Live Dev Preview](https://ais-dev-vfnndg2hhbm7prqkr3uvp3-123668770786.europe-west2.run.app)
- **Occasion**: International Dog Day (August 26, 2026)

---

## 📋 Executive Summary & Submission Details

### Short Description (1-liner / Elevator Pitch)
**TAILORY** turns any dog's photo, personality quirks, and cherished memories into an interactive spoken companion, a personalized literary story, and a permanent cryptographic Dog Day keepsake certificate.

### The Problem We Solve
Almost every existing digital pet application is purely utilitarian: medical trackers, weight logs, calorie counting, or automated breed detectors. None celebrate the **emotional core of pet guardianship**—the bizarre daily habits, the muddy-paw adventures, the shoe-stealing rituals, and the unspoken language of unconditional companionship.

### The Solution
TAILORY creates a 5-step interactive journey:
1. **Meet Your Dog**: Upload a real dog photo or pick a one-click preset (*Bruno, Luna, Barnaby*).
2. **Google AI Personality Interpretation**: Gemini Flash analyses visual features and 5 playful questions to construct a unique character profile and signature superpower (*"Professional Snack Hunter"*).
3. **Spoken Canine Companion**: Ask the dog anything (*"Why did you steal my socks?"*) and listen to the voice response generated via ElevenLabs / Web Speech API.
4. **Storycraft Engine**: Weaves 4 heartfelt memories into a structured, narrative-rich Dog Day story with drop-caps and narration.
5. **International Dog Day Keepsake**: Renders a keepsake certificate with PNG canvas export, print styling, and permanent Solana blockchain verification.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │             USER CLIENT                │
                               │  (React 19, Tailwind CSS, Motion)      │
                               └──────────────────┬─────────────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      │                                                       │
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │   Interactive UI Stages   │                           │    Client-Side Engine     │
        │ • Multi-Step Story Flow   │                           │ • HTML5 2D Canvas Export  │
        │ • Interactive Chat Stage  │                           │ • Web Audio Synthesizer   │
        │ • Keepsake Certificate    │                           │ • Confetti Celebration    │
        │ • Dog Kingdom Insights    │                           │ • Responsive Media Engine │
        └─────────────┬─────────────┘                           └─────────────┬─────────────┘
                      │                                                       │
                      └───────────────────────────┬───────────────────────────┘
                                                  │
                                                  ▼
                               ┌─────────────────────────────────────┐
                               │       EXPRESS BACKEND SERVER        │
                               │        (server.ts / Node.js)        │
                               └──────────────────┬──────────────────┘
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 │                                │                                │
                 ▼                                ▼                                ▼
    ┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
    │     GOOGLE GEMINI AI    │      │    ELEVENLABS VOICE     │      │     SOLANA DEVNET       │
    │  (@google/genai SDK)    │      │      (TTS Engine)       │      │  (Permanent Ledger)     │
    │                         │      │                         │      │                         │
    │ • Multimodal Analysis   │      │ • Natural Spoken Voice  │      │ • SHA-256 Digest        │
    │ • Character Persona     │      │ • Playful Expressiveness│      │ • Slot & Transaction ID │
    │ • Dynamic Chat Engine   │      │ • Web Speech Fallback   │      │ • Solana Explorer Link  │
    │ • Storycraft Generator  │      │                         │      │                         │
    └─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 🐾 Step-by-Step Experience Walkthrough

### 1. Welcome & Dog Introduction
- Beautiful natural aesthetic using warm editorial typography and gentle ambient cues.
- Supports drag-and-drop image upload (JPEG, PNG, WEBP) or quick-demo pre-loaded canine profiles.

### 2. Five Fun Personality Dimensions
- **Happiest Moment**: What makes them do their signature tail-wag?
- **Audacious Household Crime**: Slipper theft, couch chewing, or 2 AM phantom barking?
- **Energy Profile**: From *"Professional Couch Potato"* to *"Perpetual Kinetic Hurricane"*.
- **Social Style**: Thinks every stranger is their long-lost soulmate.
- **The Secret**: What quirky habit only the human knows about?

### 3. Google AI Multimodal Interpretation
- Evaluates photo cues (ear floppiness, eye sincerity, posture) combined with user answers.
- Assigns traits (*Affectionate, Mischievous, Loyal*), an archetype, and a signature superpower.
- Adheres strictly to non-veterinary safety guidelines (entertainment & emotional keepsake only).

### 4. Interactive Spoken Canine Companion
- Conversational chat stage where users can ask real questions.
- Voice narration plays automatically or on-demand.
- Interactive animation: the dog portrait reacts with audio soundwave indicators and bounces when speaking.

### 5. Storycraft Engine
- Weaves personal memories (*how we met, unforgettable days, funny moments, and owner's message*) into an emotional literary short story.
- Formatted with editorial drop-cap styling and memorable pull-quotes.
- Built-in *"Listen Aloud"* audio narration.

### 6. Official 2026 Keepsake Certificate & Solana Preservation
- Gold-embossed Dog Day 2026 certificate with a unique Memory ID (`DOGDAY-2026-...`).
- **High-Resolution PNG Canvas Export**: Generates an 800x1100 digital print in 1 click.
- **Print / PDF Layout**: Clean print stylesheet.
- **Permanent Solana Preservation**: Hashes the keepsake memory onto Solana Devnet, issuing an immutable cryptographic receipt with a live Solana Explorer verification URL.

---

## 🎥 3-Minute Demo Video Presentation Script

| Timestamp | Scene / Screen | Script & Narration |
|---|---|---|
| **0:00 - 0:35** | **Landing Page** | *"Welcome to TAILORY. Every dog has a story, and this International Dog Day 2026, we built a digital home to celebrate them. Today, let's introduce Bruno, a loyal golden mix."* |
| **0:35 - 1:10** | **Meet & Personality Input** | *"We upload Bruno's photo and answer 5 quick questions about his favorite habits and funny crimes. With one click, Google Gemini AI analyzes the photo and crafts Bruno's unique character profile: Executive Snack Strategist."* |
| **1:10 - 1:55** | **Spoken Companion Interaction** | *"Now we can talk directly to Bruno! Let's ask: 'Why did you steal my socks?' Hear his hilarious voice generated via ElevenLabs: 'Those weren't socks, they were emergency foot blankets I inspected for safety.' The avatar reacts with live audio waves!"* |
| **1:55 - 2:35** | **Storycraft Engine** | *"Next, we enter our 4 favorite memories of Bruno. Google AI weaves them into a beautiful, heartwarming Dog Day story complete with pull-quotes and a read-aloud narrator."* |
| **2:35 - 3:00** | **Keepsake Certificate & Solana** | *"Finally, TAILORY generates an official International Dog Day Keepsake Card. We can download a high-res PNG, print it, or preserve it forever as an immutable cryptographic record on the Solana blockchain."* |

---

## 🏆 Hackathon Evaluation Criteria Alignment

| Evaluation Pillar | Implementation in TAILORY |
|---|---|
| **Innovation & Concept** | Reframes digital pet software from utilitarian telemetry to an emotional, interactive storytelling and memory-preservation companion. |
| **Google AI Mastery** | Deep `@google/genai` integration with multimodal reasoning (image + text), strict safety framing, and real-time character dialogues. |
| **Audio & Voice UX** | Seamless hybrid voice engine: ElevenLabs TTS API combined with intelligent Web Speech synthesis and sound effects. |
| **Visual & UI Polish** | Natural editorial styling (Warm Cream, Deep Forest Green, Honey Amber) with fluid Motion animations and accessible contrast. |
| **Full-Stack Craft** | Production-ready Express + Vite backend, Canvas 2D image rendering, and Solana blockchain devnet integration. |

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19, TypeScript, Tailwind CSS, `motion/react`, `lucide-react`, `canvas-confetti`
- **Backend**: Express (v4), Node.js, `tsx`, `esbuild`
- **AI & ML**: `@google/genai` (`gemini-3.7-flash`), ElevenLabs REST API
- **Web3 / Preservation**: Solana Devnet Transaction & Hash Verification Layer

---

## ⚙️ Environment Variables Setup

Create a `.env` file or configure via platform settings:

```env
# Google Gemini AI Key (Required for server-side AI)
GEMINI_API_KEY="your-gemini-api-key"

# ElevenLabs (Optional — Web Speech fallback is active by default)
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"

# Solana Devnet Configuration
SOLANA_NETWORK="devnet"
SOLANA_RPC_URL="https://api.devnet.solana.com"
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Compile and verify production build
npm run build
npm start
```

---

*Made with 💛 and endless ear scratches for International Dog Day 2026.*
