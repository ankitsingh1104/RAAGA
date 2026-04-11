# 🎧 Raaga – AI-Powered Music Streaming Web App

Raaga is a modern, responsive, AI-enhanced music streaming web application built using a frontend-only architecture. It allows users to search, play, and discover music seamlessly with a clean UI and intelligent recommendations.

---

## 🚀 Features

### 🎵 Core Music Features
- 🔍 Search songs using YouTube Data API
- ▶️ Play / Pause / Seek music using YouTube IFrame Player
- 🎧 Global music player (persistent across pages)
- 📀 Discover and Albums pages
- 🧭 Smooth navigation with SPA (Single Page Application)

---

### 🤖 AI-Based Recommendations
- Tracks user listening behavior
- Stores play history in localStorage
- Detects time of day (morning / evening / night)
- Suggests songs based on:
  - Preferred genres
  - Listening patterns
  - Time-based mood
- Dynamic **“Recommended For You”** section

---

### 📂 Library Features
- ❤️ Favorite songs
- 🕒 Recently played songs
- 🔥 Most played songs
- 📁 Create and manage playlists

---

### 👤 User Features
- 🔐 Login system with validation
- Password must be minimum 8 characters
- Session stored using localStorage
- Logout functionality

---

### 🎨 UI/UX Features
- Dark theme with orange accent
- Fully responsive design
- Figma-based UI implementation
- Smooth transitions and hover effects
- Sidebar navigation with active highlighting

---

## 🏗️ Tech Stack

### Frontend
- React.js (or Lovable-generated framework)
- HTML5 / CSS3 / JavaScript
- React Router (SPA navigation)

### APIs
- YouTube Data API v3 (search)
- YouTube IFrame Player API (playback)

### Storage
- localStorage (for:
  - user session
  - play history
  - favorites
  - playlists)

---

## ⚙️ Architecture
- SPA-based routing (no page reloads)
- Single global player instance
- Centralized state for playback

---

## 🧠 AI Recommendation Logic

The recommendation system is based on:

1. **User Behavior Tracking**
   - Tracks songs played
   - Stores timestamps

2. **Genre Preference Detection**
   - Counts frequency of genres

3. **Time-Based Filtering**
   - Morning → Energetic songs
   - Evening → Chill music
   - Night → Lo-fi / soft tracks

4. **Scoring System**