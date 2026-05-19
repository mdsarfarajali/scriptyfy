# ⚡ ResearchToScript — Viral Speech & Script Showcase

ResearchToScript is a premium, high-fashion minimalist web portfolio and dynamic content management system designed for medical, scientific, and motivational scriptwriters. It provides a luxurious grid showcase for clients to explore highly researched scripts and features a built-in, high-tech admin console that automatically parses plain text script files into dynamic timelines.

---

## ✨ Key Features

### 1. Minimalist Editorial Showcase (UI Panel)
- **High-End Aesthetics:** Tailored layout inspired by editorial design grids, using pure bone whites, slate, and dynamic HSL **Forest Green** glows.
- **Micro-Animations:** Fluid, interactive hover states with elegant card-cover zooms.
- **Clean Focus:** Displays category badges, titles, generated visual covers, supporting research anchor papers, and interactive expandable timelines.
- **Accented Timeline Timestamps:** Interactive outline panels dividing timestamps, voiceover (VO) speech, visual cues (B-roll directions), and on-screen caption overlays.

### 2. High-Tech Matte-Dark Admin Dashboard (Console)
- **Distinct Space:** Features a separate visual space designed purely as a dark console (matte blacks, slate inputs, and emerald glows).
- **Metadata Controllers:** Easily upload titles, categories, and research citations.
- **Background Smart File Reader:** Drag-and-drop or select any plain script `.txt` file. The backend reads it instantly and generates a real-time **Text-Parsing Analysis HUD** displaying scene counts, word counts, and caption triggers.
- **Automatic Multi-Scene Parser:** Automatically breaks down your text based on standard timeline tags and maps visual cues and quotes into structured JSON.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 (Vite, HMR, custom styled CSS)
- **Backend:** Node.js, Express.js
- **Media Uploads:** Multer (files saved to local `/uploads` storage)
- **State Routing:** Dynamic hash-based lightweight routing (`#admin`)
- **Database:** Local JSON File DB (`scripts.json`)

---

## 🚀 Local Installation & Setup

Get the full-stack system running locally in under 3 minutes:

### 1. Install Dependencies
Run the install command with legacy peer dependencies supported for React 19 templates:
```bash
npm install --legacy-peer-deps
```

### 2. Boot the Express Backend
Start the local upload server on port `3001`:
```bash
node server.js
```

### 3. Run the Vite Frontend
Launch the dynamic visual showcase on port `5173`:
```bash
npm run dev
```

Open **`http://localhost:5173/`** in your browser to view the showcase, and **`http://localhost:5173/#admin`** to manage and upload your scripts!

---

## 📂 Directory Structure

```text
├── public/                  # Static assets & dynamic uploaded media
│   └── uploads/             # Ignored in git (locally stored media)
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx   # High-tech dark upload HUD
│   │   ├── ScriptCard.jsx   # Grid cards with timeline accordions
│   │   └── Hero.jsx         # Luxe header introductions
│   ├── data/
│   │   └── scripts.json     # Dynamic JSON speech database
│   ├── App.jsx              # Application router & base layout
│   └── index.css            # Custom fluid styling ecosystem
├── server.js                # Express API & Smart Text Parser
└── package.json
```

---

*Built with absolute scientific precision.*
