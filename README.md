# 🎰 Casino Bonus Tracker Dashboard

A sleek React dashboard for tracking daily social casino bonus resets.  
Designed with a **dark theme**, **glowing interactive buttons**, and a **sticky header** for a polished mobile‑first experience.

---

## 🚀 Project Checkpoints

*   **Commit:** 4bf80a7 - **Date:** 2025-11-24 - Initial project checkpoint.

---

## ✨ Features

- **Editable casino list** with local persistence (saved in `localStorage`)
- **Daily reset countdowns** using styled pill‑shaped timers
- **Add/Delete casinos** with glowing blue/red buttons
- **Sticky glowing header** that stays visible while scrolling
- **Mobile‑optimized layout** (blocks at 80% width, capped at 480px)
- **Modular CSS** (`Dashboard.css`) for clean component‑scoped styling

---

## screens
![Screenshot](https://github.com/tahp/casinobonustracker/blob/3d3fb437b6c6c354b5af9a1dbb6dbbdb2185abb3/Screenshot_20251128_194240_Chrome.jpg?raw=true)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repo
git clone https://github.com/tahp/casinobonustracker.git

# Enter project directory
cd casinobonustracker

# Install dependencies
npm install
```

### Run locally
```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🛠 Project Structure

```
src/
  components/
    Dashboard.jsx   # Main dashboard component
    Dashboard.css   # Component-scoped styles
  index.js          # App entry point
  index.css         # Global styles
```

---

## 🎨 Design Notes

- **Dark theme** for readability and focus
- **Glowing shadows** for interactive feedback:
  - Blue glow → Add Casino button
  - Red glow → Delete button
  - Sticky header glow intensifies when scrolled
- **Responsive layout** optimized for portrait and landscape

---

## 📦 Deployment

You can deploy easily with [GitHub Pages](https://pages.github.com/) or [Vercel](https://vercel.com/):

```bash
npm run build
```

Then upload the `build/` folder to your hosting provider.

---

## 📜 License

MIT License — feel free to use, modify, and share.

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you’d like to change.

---

## 🙌 Acknowledgements

- Built with React
- Styled with modular CSS
- Inspired by the need for **frictionless daily bonus tracking**
