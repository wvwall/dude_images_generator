# ☕ Gemini AI Creative Studio - "The Friends" Edition

Welcome to the Gemini AI Creative Studio, a Single-Page Application (SPA) designed for generating and editing images and videos using Google's Gemini AI. The interface is styled with a fun, recognizable theme inspired by the TV series "Friends," featuring custom colors (friends-purple, friends-yellow) and iconic phrases (e.g., "How you doin'?", "PIVOT!").

This project showcases a modern Jamstack architecture with a unique client-side data persistence model.

## ✨ Features

- **Text-to-Image Generation:** Create images from simple text prompts.
- **Image-to-Image Editing:** Modify existing images by providing a reference image and a new prompt.
- **Video Generation:** Generate short videos based on text prompts.
- **Local History & Gallery:** View, download, modify, and delete previous creations saved directly in your browser.
- **Secure & Scalable Backend:** Powered by Serverless Functions to securely handle API keys.

## ⚙️ Architecture & Technology Stack

The application is built on three key architectural pillars:

### 1. Frontend (React + TypeScript)

| Technology             | Purpose                                                           |
| :--------------------- | :---------------------------------------------------------------- |
| **React & TypeScript** | Robust, type-safe development for building a complex SPA.         |
| **Vite**               | Lightning-fast development server and optimized build tool.       |
| **Tailwind CSS**       | Utility-first styling with a custom Friends-themed configuration. |
| **react-router-dom**   | Handles client-side routing and navigation.                       |

### 2. Backend (Serverless Functions)

We use Netlify Functions to manage sensitive operations and complex asynchronous tasks:

- **Security:** Hides the `GEMINI_API_KEY` from the client, preventing exposure.
- **Asynchronous Video:** Handles long-running video generation requests by initiating a job, returning an `operationName`, and using client-side **polling** (via `check-video-status` function) to track progress.

### 3. Data Persistence (SQLite + IndexedDB Magic)

The most innovative aspect is the fully client-side, serverless data model:

- **SQLite in the Browser:** We use **SQL.js** to run the complete SQLite database engine (compiled to WebAssembly) directly in the user's browser for history storage.
- **Persistence:** Since SQL.js is in-memory, we ensure persistence by exporting the entire database state as a byte array and saving it to **IndexedDB** after every change. Upon app load, the database is restored from IndexedDB.

> **Advantage:** This ensures user data privacy, eliminates server database costs, and simplifies infrastructure.
> **Note:** History is local to the specific browser and device.

## 🚀 Getting Started

_(Add your specific setup instructions here, e.g., cloning the repo, installing dependencies, setting up environment variables for the Gemini API key, and deploying the Netlify functions.)_
