# CLAUDE.md - AI Assistant Guide

## Project Overview

**Dude - AI Creative Studio** (The Friends Edition) is a Single-Page Application (SPA) for generating and editing images and videos using Google's Gemini AI. The interface features a fun "Friends" TV show theme with custom colors and iconic phrases.

**Key Innovation**: The app uses a fully client-side SQLite database (via SQL.js compiled to WebAssembly) persisted to IndexedDB, ensuring user data privacy while eliminating server database costs.

---

## Architecture

### Three-Tier Architecture

1. **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
2. **Backend**: Netlify Serverless Functions (secure API key handling)
3. **Data Layer**: SQLite (SQL.js) + IndexedDB (client-side persistence)

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19.2.1 | Component-based UI |
| **Language** | TypeScript 5.8.2 | Type-safe development |
| **Build Tool** | Vite 6.4.1 | Fast dev server & optimized builds |
| **Styling** | Tailwind CSS 3.4.18 | Utility-first CSS with custom Friends theme |
| **Routing** | react-router-dom 6.14.1 | Client-side navigation |
| **AI Integration** | @google/genai 1.30.0 | Gemini AI SDK (server-side only) |
| **Database** | SQL.js 1.8.0 | SQLite in-browser via WebAssembly |
| **Icons** | lucide-react 0.554.0 | Icon library |
| **Tour** | @reactour/tour 3.8.0 | Feature onboarding |
| **Serverless** | Netlify Functions | API key security & async video handling |
| **PWA** | vite-plugin-pwa 1.2.0 | Progressive Web App capabilities |

---

## Directory Structure

```
dude_images_generator/
├── src/
│   ├── components/          # React components (feature-organized)
│   │   ├── AspectRatioSelector/
│   │   ├── AudioPlayer/     # Friends-themed audio phrases
│   │   ├── BottomBar/       # Navigation bar
│   │   ├── FeatureTour/     # Onboarding tour
│   │   ├── Header/          # App header
│   │   ├── ImageCard/       # Gallery item display
│   │   ├── ImageHistory/    # History grid
│   │   ├── ImageUploadArea/ # Drag-and-drop upload
│   │   ├── InputForm.tsx    # Main generation form
│   │   ├── InputHeader/     # Header for input section
│   │   ├── InputPanel/      # Container for input controls
│   │   ├── ModeSelector/    # Text/Image/Video mode switcher
│   │   ├── ModelSelectorDropdown/ # AI model selector
│   │   ├── PivotButton/     # Friends-themed generate button
│   │   ├── PreviewPanel.tsx # Result preview
│   │   ├── PromptInput/     # Text prompt input
│   │   └── PullToRefresh/   # Pull-to-refresh (currently disabled)
│   ├── hooks/
│   │   └── useGenerationLogic.ts  # Core state & logic for generation
│   ├── pages/
│   │   ├── Gallery.tsx      # Gallery view (route: /gallery)
│   │   ├── Home.tsx         # Main generation page (route: /)
│   │   ├── ImageView.tsx    # Single image detail (route: /image/:id)
│   │   └── LoadingPage.tsx  # DB initialization screen
│   ├── services/
│   │   ├── geminiService.ts # API calls to Netlify functions
│   │   └── sqliteService.ts # SQLite/IndexedDB persistence
│   ├── types/
│   │   └── sql-wasm.d.ts    # Type definitions for SQL.js
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── App.tsx              # Root component (routing setup)
│   ├── index.tsx            # Entry point
│   └── index.css            # Global CSS & Tailwind directives
├── netlify/functions/       # Serverless backend
│   ├── generate-image.js    # Image generation endpoint
│   ├── generate-video.js    # Video generation (async job start)
│   └── check-video-status.js # Video polling endpoint
├── public/                  # Static assets (audio, images, PWA)
├── tailwind.config.js       # Tailwind + Friends theme config
├── vite.config.ts           # Vite + PWA config
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── bump-version.js          # Version bump utility
└── README.md                # User-facing documentation
```

---

## Key Files & Their Purposes

### Core Application Files

| File | Purpose | Key Responsibilities |
|------|---------|---------------------|
| `src/App.tsx` | Root component | Routing setup, DB initialization, scroll management, feature tour wrapper |
| `src/pages/Home.tsx` | Main page | Coordinates generation UI, uses `useGenerationLogic` hook |
| `src/hooks/useGenerationLogic.ts` | **Core hook** | All state management, generation logic, file handling, DB operations |
| `src/services/sqliteService.ts` | Database service | SQLite setup, CRUD operations, IndexedDB persistence |
| `src/services/geminiService.ts` | API client | Calls to Netlify functions for image/video generation |
| `src/types.ts` | Type definitions | Shared interfaces (`GeneratedImage`, `AspectRatio`, etc.) |

### Serverless Functions

| Function | Purpose | Key Details |
|----------|---------|-------------|
| `generate-image.js` | Image generation | Accepts prompt + optional reference images, returns base64 data URI |
| `generate-video.js` | Video job start | Initiates async video generation, returns `operationName` |
| `check-video-status.js` | Video polling | Checks status via `operationName`, returns video buffer when complete |

**Security Note**: These functions hide `GEMINI_API_KEY` from the client using Netlify environment variables.

### Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Custom Friends theme colors (`friends-purple`, `friends-yellow`, etc.), Poppins font |
| `vite.config.ts` | Dev server proxy to Netlify Functions (port 8888), PWA manifest, app version injection |
| `package.json` | Scripts: `dev`, `build`, `preview`, `netlify:dev`, `version:bump` |

---

## State Management Pattern

### Hook-Based Architecture

The app uses **`useGenerationLogic`** (src/hooks/useGenerationLogic.ts:11) as the central state manager. This hook returns:

```typescript
{
  state: {
    // Generation inputs
    prompt, aspectRatio, mode, model, selectedFiles, previewUrls,

    // UI state
    isGenerating, isDragging, error, success, isLoadingHistory,

    // Results
    currentImage, history,

    // Video-specific
    videoStatus, videoProgress, completedVideoUri,

    // Refs
    fileInputRef
  },
  actions: {
    // Setters
    setPrompt, setAspectRatio, setMode, setModel,

    // File handling
    handleDragOver, handleDragLeave, handleDrop,
    handleFileSelect, clearFiles, handleRemoveFile,

    // Main actions
    handleGenerate, handleDelete, handleEdit, handleDownloadCurrent
  }
}
```

**Why this pattern?**
- Separates business logic from UI components
- Makes testing easier (test the hook independently)
- Centralizes all generation-related state

### Component Data Flow

```
Home.tsx
  └─> useGenerationLogic() hook
       ├─> InputForm (receives state + actions)
       ├─> PreviewPanel (receives state + actions)
       └─> ImageHistory (receives history + delete/edit handlers)
```

---

## Data Persistence Model

### SQLite + IndexedDB Strategy

**Problem**: SQL.js runs SQLite in-memory in the browser. On page reload, data is lost.

**Solution**:
1. After every DB change (insert/delete), export the entire DB as `Uint8Array`
2. Save to IndexedDB (key: `"dude_db"`, store: `"sqlite"`)
3. On app load, restore from IndexedDB and reinitialize SQL.js

**Implementation** (src/services/sqliteService.ts):

```typescript
// DB Schema
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  url TEXT,              -- Base64 data URI
  prompt TEXT,
  timestamp INTEGER,
  aspectRatio TEXT
)

// Key functions
initDB()           // Load from IndexedDB or create new
getAllImages()     // SELECT * ORDER BY timestamp DESC
addImage(img)      // INSERT + persist()
deleteImage(id)    // DELETE + persist()
persist()          // Export DB → IndexedDB
```

**Important**:
- Database is **local to browser/device** (not synced across devices)
- Privacy-first: no user data sent to servers
- Images stored as base64 data URIs directly in SQLite

---

## API Integration

### Generation Modes

| Mode | Input | Output | Function Called |
|------|-------|--------|----------------|
| **Text** | Prompt + AspectRatio | Image (base64 URI) | `generateImage()` with no reference images |
| **Image** | Prompt + AspectRatio + Reference Images (1-N) | Image (base64 URI) | `generateImage()` with reference images |
| **Video** | Prompt + Optional Reference Image | Video file (MP4) | `generateVideo()` + polling via `checkVideoStatus()` |

### Gemini AI Models

Configured in `src/hooks/useGenerationLogic.ts:26-28`:

- **gemini-2.5-flash-image** (default) - Fast image generation
- **gemini-3-pro-image-preview** - Higher quality (beta)

**Video model**: Uses Google's video generation API (exact model determined server-side in `generate-video.js`).

### Video Generation Flow

1. User clicks generate → `generateVideo()` called
2. Netlify function starts job → returns `operationName`
3. Client starts polling every 10 seconds via `checkVideoStatus()`
4. When complete, function returns video buffer
5. Client creates blob URL → auto-downloads + shows preview

**Code reference**: src/hooks/useGenerationLogic.ts:135-166, 217-256

---

## Routing Structure

Defined in `src/App.tsx:63-68`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.tsx` | Main generation interface |
| `/gallery` | `Gallery.tsx` | View all generated images/videos |
| `/image/:id` | `ImageView.tsx` | Single image detail view |
| `*` | Redirect to `/` | Fallback for unknown routes |

**Navigation**: Bottom bar component (`BottomBar.tsx`) provides links.

---

## Styling Conventions

### Friends Theme Colors

Defined in `tailwind.config.js:6-12`:

```javascript
colors: {
  'friends-purple': '#5D3F6A',        // Primary brand color
  'friends-yellow': '#F4C430',        // Accent (like Central Perk logo)
  'friends-red': '#E74C3C',
  'friends-blue': '#3498DB',
  'friends-purple-light': '#d1caf1',  // Background
  'friends-yellow-light': '#fff5cc'
}
```

### Typography

- **Primary Font**: Poppins (sans-serif)
- **Accent Font**: Permanent Marker (cursive) - Used for playful elements

### Component Patterns

- **Feature folders**: Components grouped by feature (e.g., `ImageCard/`, `ModeSelector/`)
- **Responsive design**: Mobile-first with Tailwind breakpoints (`md:`, `lg:`)
- **Consistent spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `gap-8`)

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (port 3000) + Netlify Functions (port 8888)
npm run netlify:dev

# Or separate terminals:
npm run dev              # Vite dev server only (port 3000)
# Netlify functions won't work without netlify dev
```

**Important**: The Vite dev server proxies `/.netlify/functions/*` to `localhost:8888` (see vite.config.ts:17-23). You **must** use `netlify dev` for full functionality.

### Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Bump version
npm run version:bump
```

**Deployment**: Configured for Netlify (automatic deploys from git).

### Environment Variables

Set in Netlify dashboard (not in `.env` files for security):

- `GEMINI_API_KEY` - Required for all generation functions

---

## Common Patterns & Conventions

### File Upload Handling

**Max file size**: 4MB (enforced in src/hooks/useGenerationLogic.ts:63-64, 90-91)

**Accepted formats**: Images (JPEG, PNG, etc.) - determined by browser's file picker

**Drag-and-drop**: Implemented via:
- `handleDragOver()` - Sets `isDragging` to true
- `handleDragLeave()` - Sets `isDragging` to false
- `handleDrop()` - Processes dropped files

### Error Handling

All async operations use try/catch:
- **User-facing errors**: Set via `setError()` state
- **DB errors**: Console warnings + graceful degradation (don't block UI)
- **API errors**: Display error message from Netlify function response

### Success Notifications

Ephemeral success messages (5-second timeout):
```typescript
setSuccess("Image generated successfully!");
setTimeout(() => setSuccess(null), 5000);
```

### Image ID Generation

Simple timestamp-based IDs:
```typescript
id: Date.now().toString()
```

**Collision risk**: Low (assumes user won't generate >1 image per millisecond).

---

## Testing & Quality

### Current State

**No automated tests configured** (no test framework in package.json).

### Manual Testing Checklist

When making changes:
1. Test all 3 generation modes (text/image/video)
2. Verify DB persistence (reload page, check history intact)
3. Test on mobile viewport (responsive design)
4. Check Netlify function logs for errors
5. Verify PWA functionality (offline mode, install prompt)

---

## Git Workflow

### Branch Strategy

- **Main branch**: Production-ready code
- **Feature branches**: Named `feature/<description>` or `claude/<task-id>`

### Commit Guidelines

- Use descriptive commit messages
- Reference PR numbers when merging
- Example: `refactor: extract generation logic into useGenerationLogic hook`

### Recent Refactorings (Git History Context)

Per the git log:
- **5c89554**: Merged PR #25 (refactor props/state in components)
- **08b3a57**: Extracted `useGenerationLogic` hook from `Home.tsx`
- **23b3d44**: Cleaned up imports and component structure

**Pattern**: The codebase is actively being refactored for better separation of concerns.

---

## Important Constraints & Gotchas

### 1. Database is Browser-Local

Users can't access their history on different devices/browsers. This is **by design** for privacy.

### 2. Base64 Image Storage

Images are stored as data URIs (base64-encoded). This is **inefficient** for storage but simplifies architecture (no file hosting needed).

**Implication**: Large images inflate DB size. Consider recommending users clear old history.

### 3. Video Polling Interval

Hardcoded to 10 seconds (src/hooks/useGenerationLogic.ts:240-242). Adjust if videos take longer than expected.

### 4. Vite Proxy Configuration

The dev server expects Netlify Functions on port 8888. If you run `vite dev` directly (not `netlify dev`), API calls will fail.

### 5. PWA Caching

The app is a PWA with aggressive caching. During development, you may need to:
- Hard refresh (Ctrl+Shift+R)
- Clear service workers in DevTools

### 6. TypeScript Strictness

TypeScript is configured but not in strict mode. Some type assertions use `any` (e.g., src/hooks/useGenerationLogic.ts:205, 246).

**Recommendation**: Gradually increase strictness for better type safety.

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Understand the architecture first**: Review this file before making changes
2. **Respect the hook pattern**: Business logic goes in hooks, not components
3. **Test DB persistence**: After DB changes, verify IndexedDB updates
4. **Mind file size limits**: Don't allow uploads >4MB
5. **Preserve Friends theme**: Maintain playful tone in UI (phrases, colors)
6. **Use existing utilities**: Don't duplicate file handling, DB operations, etc.
7. **Check Netlify function logs**: For API debugging (not visible in browser)
8. **Consider mobile UX**: All changes should work on mobile viewports

### Common Tasks

#### Adding a New Component

1. Create feature folder: `src/components/NewFeature/`
2. Export from `NewFeature/NewFeature.tsx`
3. Follow existing naming (PascalCase for components)
4. Use Tailwind classes (avoid inline styles)
5. Import into relevant page (e.g., `Home.tsx`)

#### Modifying Generation Logic

1. Locate logic in `src/hooks/useGenerationLogic.ts`
2. Update state/actions as needed
3. Propagate changes to `Home.tsx` (component receives `state` + `actions`)
4. Test all 3 modes (text/image/video)

#### Adding a New API Endpoint

1. Create function: `netlify/functions/new-endpoint.js`
2. Follow pattern from `generate-image.js` (auth, error handling)
3. Add client call in `src/services/geminiService.ts`
4. Use in hook or component

#### Database Schema Changes

1. Update table creation in `src/services/sqliteService.ts:34-36`
2. Add migration logic if needed (or document manual DB reset)
3. Update TypeScript interfaces in `src/types.ts`

### Performance Considerations

- **DB export on every change**: Not a bottleneck (SQLite is small), but avoid rapid writes
- **Base64 encoding**: Inflates image size by ~33%, consider optimization for large images
- **Video polling**: Uses setInterval, ensure cleanup on unmount (already handled)

### Accessibility Notes

**Current state**: Basic accessibility (semantic HTML, no ARIA attributes).

**Improvement areas**:
- Add ARIA labels to interactive elements
- Test keyboard navigation
- Add screen reader announcements for generation status

---

## Future Enhancement Ideas

Based on codebase analysis, these are logical next steps:

1. **Pull-to-Refresh**: Already scaffolded (see commented code in App.tsx:55-59)
2. **Cloud Sync**: Add optional account system + cloud storage
3. **Image Editing**: Filters, crops, etc. (Gemini supports editing prompts)
4. **Batch Generation**: Generate multiple variations at once
5. **History Search**: Filter by prompt text, date range
6. **Export/Import History**: Let users backup/restore their gallery
7. **Keyboard Shortcuts**: Power user features
8. **Automated Tests**: Add Jest + React Testing Library

---

## Quick Reference

### Most Important Files to Understand

1. `src/hooks/useGenerationLogic.ts` - **All business logic**
2. `src/services/sqliteService.ts` - **Data persistence**
3. `src/App.tsx` - **Routing & initialization**
4. `netlify/functions/generate-image.js` - **API integration example**

### Key Commands

```bash
npm run netlify:dev    # Start dev server with functions
npm run build          # Production build
npm run version:bump   # Update version in package.json
```

### Debugging Tips

- **DB issues**: Check IndexedDB in DevTools → Application → IndexedDB → `dude_images_db`
- **API issues**: Check Netlify CLI output for function logs
- **Image not showing**: Verify base64 data URI format in DB
- **Video stuck**: Check browser Network tab for polling requests

---

## Version

This document reflects the codebase state as of **v1.3.5** (package.json version).

Last updated: 2026-01-11

---

## Contact & Support

For codebase questions:
1. Review this CLAUDE.md file
2. Check inline code comments
3. Examine git history for context on recent changes
4. Refer to README.md for user-facing documentation

**Happy coding!** May your prompts be creative and your generation times be swift.
