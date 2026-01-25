# CLAUDE.md - AI Assistant Guide

## Project Overview

**Dude - AI Creative Studio** (The Friends Edition) is a Single-Page Application (SPA) for generating and editing images and videos using Google's Gemini AI. The interface features a fun "Friends" TV show theme with custom colors and iconic phrases.

**Key Architecture**: The app uses a **RESTful backend API** with server-side database storage and JWT-based authentication, ensuring secure multi-user data management and synchronization across devices.

---

## Architecture

### Three-Tier Architecture

1. **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query
2. **Backend API**: RESTful API (default: http://localhost:3001) for user data, authentication, and image storage
3. **AI Services**: Netlify Serverless Functions (Gemini API integration with secure API key handling)

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19.2.1 | Component-based UI |
| **Language** | TypeScript 5.8.2 | Type-safe development |
| **Build Tool** | Vite 6.4.1 | Fast dev server & optimized builds |
| **Styling** | Tailwind CSS 3.4.18 | Utility-first CSS with custom Friends theme |
| **Routing** | react-router-dom 6.14.1 | Client-side navigation with auth guards |
| **State Management** | @tanstack/react-query 5.90.16 | Server state management & caching |
| **AI Integration** | @google/genai 1.30.0 | Gemini AI SDK (Netlify Functions only) |
| **Authentication** | JWT tokens | Token-based auth with localStorage |
| **Icons** | lucide-react 0.554.0 | Icon library |
| **Tour** | @reactour/tour 3.8.0 | Feature onboarding |
| **Serverless** | Netlify Functions | AI generation endpoints |
| **PWA** | vite-plugin-pwa 1.2.0 | Progressive Web App capabilities |

---

## Directory Structure

```
dude_images_generator/
├── src/
│   ├── components/          # React components (feature-organized)
│   │   ├── AspectRatioSelector/
│   │   ├── AudioPlayer/     # Friends-themed audio phrases
│   │   ├── BottomBar/       # Navigation bar (with auth state)
│   │   ├── FeatureTour/     # Onboarding tour
│   │   ├── Header/          # App header (with login/logout)
│   │   ├── ImageCard/       # Gallery item display
│   │   ├── ImageHistory/    # History grid
│   │   ├── ImageUploadArea/ # Drag-and-drop upload
│   │   ├── InputForm.tsx    # Main generation form
│   │   ├── InputHeader/     # Header for input section
│   │   ├── InputPanel/      # Container for input controls
│   │   ├── Lightbox/        # Image lightbox viewer
│   │   ├── ModeSelector/    # Text/Image/Video mode switcher
│   │   ├── ModelSelectorDropdown/ # AI model selector
│   │   ├── PivotButton/     # Friends-themed generate button
│   │   ├── PreviewPanel.tsx # Result preview
│   │   ├── PromptInput/     # Text prompt input
│   │   └── PullToRefresh/   # Pull-to-refresh (currently disabled)
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication context provider
│   ├── hooks/
│   │   └── useGenerationLogic.ts  # Core state & logic for generation
│   ├── pages/
│   │   ├── Auth.tsx         # Login/Register page
│   │   ├── Gallery.tsx      # Gallery view (route: /gallery)
│   │   ├── Home.tsx         # Main generation page (route: /)
│   │   ├── ImageView.tsx    # Single image detail (route: /image/:id)
│   │   └── LoadingPage.tsx  # Auth initialization screen
│   ├── services/
│   │   ├── api.ts           # API endpoint definitions
│   │   ├── apiClient.ts     # HTTP client with auth token injection
│   │   ├── authService.ts   # Authentication service (login/register/logout)
│   │   ├── geminiService.ts # Netlify Functions API calls (AI generation)
│   │   └── uploadService.ts # Image upload to backend
│   ├── utils/
│   │   └── imageUtils.ts    # Image URL utilities
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── App.tsx              # Root component (auth guards, routing)
│   ├── index.tsx            # Entry point
│   └── index.css            # Global CSS & Tailwind directives
├── netlify/functions/       # Serverless AI generation
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
| `src/App.tsx` | Root component | Auth provider, routing with auth guards, loading states |
| `src/pages/Home.tsx` | Main page | Generation UI, uses `useGenerationLogic` hook |
| `src/pages/Auth.tsx` | Auth page | Login/register forms with validation |
| `src/hooks/useGenerationLogic.ts` | **Core hook** | State management, generation logic, backend integration |
| `src/context/AuthContext.tsx` | Auth context | User state, login/register/logout actions |
| `src/services/apiClient.ts` | HTTP client | Authenticated API requests with automatic token injection |
| `src/services/api.ts` | API config | Centralized endpoint definitions |
| `src/services/authService.ts` | Auth service | Token management, login/register API calls |
| `src/services/uploadService.ts` | Upload service | Image upload to backend with metadata |
| `src/services/geminiService.ts` | AI service | Calls to Netlify Functions for image/video generation |
| `src/types.ts` | Type definitions | Shared interfaces (`GeneratedImage`, `Asset`, `User`, etc.) |

### Serverless Functions (Netlify)

| Function | Purpose | Key Details |
|----------|---------|-------------|
| `generate-image.js` | Image generation | Accepts prompt + optional reference images, returns base64 data URI |
| `generate-video.js` | Video job start | Initiates async video generation, returns `operationName` |
| `check-video-status.js` | Video polling | Checks status via `operationName`, returns video buffer when complete |

**Security Note**: These functions hide `GEMINI_API_KEY` from the client using Netlify environment variables.

### Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Custom Friends theme colors, Poppins font |
| `vite.config.ts` | Dev server proxy to Netlify Functions (port 8888), PWA manifest, env variables |
| `package.json` | Scripts: `dev`, `build`, `preview`, `netlify:dev`, `version:bump` |

---

## Authentication System

### JWT-Based Authentication

The app uses **JSON Web Tokens (JWT)** stored in `localStorage` for authentication.

**Flow**:
1. User submits credentials via `/login` or `/register` page
2. Backend validates and returns `{ user, accessToken }`
3. `authService` stores token in localStorage
4. `apiClient` automatically includes token in all API requests via `Authorization: Bearer <token>` header
5. On 401 responses, token is cleared and user redirected to login

**Implementation** (src/services/authService.ts):

```typescript
class AuthService {
  login(credentials)      // POST /api/v1/auth/login
  register(userData)      // POST /api/v1/auth/register
  getCurrentUser()        // GET /api/v1/auth/me
  logout()                // Clear token from localStorage
  getToken()              // Retrieve stored token
  setToken(token)         // Store token
  removeToken()           // Clear token
}
```

**Auth Context** (src/context/AuthContext.tsx):

```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login(credentials): Promise<void>
  register(userData): Promise<void>
  logout(): void
}
```

### Protected Routes

Routes are protected via conditional rendering in `App.tsx:40-53`:

- **Authenticated users**: Can access `/`, `/gallery`, `/image/:id`
- **Unauthenticated users**: Redirected to `/login` or `/register`
- **Unknown routes**: Redirect to appropriate default based on auth state

---

## Data Model & Backend Integration

### Updated Data Model

**Before (v1.x)**: Images stored as base64 data URIs in client-side SQLite + IndexedDB

**Now (v2.x)**: Images stored on backend server with separate asset management

```typescript
// New Asset model (server-side file storage)
interface Asset {
  id: string
  filename: string
  mimeType: string
  size: number
  path: string           // URL path to image file
  createdAt: string
}

// Updated GeneratedImage model
interface GeneratedImage {
  id: string
  prompt: string
  timestamp: string      // ISO 8601 format (was numeric timestamp)
  aspectRatio: string
  userId: string         // NEW: Multi-user support
  assetId: string        // NEW: Reference to Asset
  asset: Asset           // NEW: Populated asset data
  url?: string           // LEGACY: For backward compatibility
}
```

### Backend API Endpoints

Configured in `src/services/api.ts:18-54`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/auth/login` | POST | User login |
| `POST /api/v1/auth/register` | POST | User registration |
| `GET /api/v1/auth/me` | GET | Get current user |
| `GET /api/v1/images` | GET | Fetch user's images |
| `GET /api/v1/images/:id` | GET | Fetch single image |
| `POST /api/v1/images` | POST | Upload new image (FormData) |
| `DELETE /api/v1/images/:id` | DELETE | Delete image |
| `GET /api/v1/videos` | GET | Fetch user's videos (prepared) |
| `POST /api/v1/videos` | POST | Upload video (prepared) |

**Base URL**: Configured via `VITE_API_BASE_URL` environment variable (default: `http://localhost:3001`)

### Image Upload Flow

**When generating an image** (src/hooks/useGenerationLogic.ts:188-209):

1. Call Netlify Function to generate image → receives base64 data URI
2. Convert data URI to File object
3. Upload to backend via `uploadService.uploadImage(file, metadata)`
4. Backend stores file and returns `GeneratedImage` with asset data
5. Update local state with backend response
6. Display image using `asset.path` URL

**Why this approach?**
- Separates AI generation (Netlify) from data persistence (Backend)
- Keeps Gemini API key secure in Netlify Functions
- Enables multi-user data management on backend
- Allows image storage optimization on server (CDN, compression, etc.)

---

## State Management Pattern

### Hook-Based Architecture

The app uses **`useGenerationLogic`** (src/hooks/useGenerationLogic.ts:14) as the central state manager. This hook returns:

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
- Easy to swap backend implementations

### Component Data Flow

```
App.tsx (AuthProvider)
  └─> AppContent (routing)
       ├─> Auth (login/register)
       └─> Home.tsx
            └─> useGenerationLogic() hook
                 ├─> InputForm (state + actions)
                 ├─> PreviewPanel (state + actions)
                 └─> ImageHistory (history + delete/edit)
```

---

## API Integration

### Generation Modes

| Mode | Input | Output | Workflow |
|------|-------|--------|----------|
| **Text** | Prompt + AspectRatio | Image | Netlify Function → Upload to Backend → Display |
| **Image** | Prompt + AspectRatio + Reference Images (1-3) | Image | Netlify Function → Upload to Backend → Display |
| **Video** | Prompt + Optional Reference Image (1) | Video file (MP4) | Netlify Function (async) → Poll status → Download |

### Gemini AI Models

Configured in `src/hooks/useGenerationLogic.ts:26-28`:

- **gemini-2.5-flash-image** (default) - Fast image generation
- **gemini-3-pro-image-preview** - Higher quality (beta)

**Video model**: Uses Google's video generation API (exact model determined server-side in `generate-video.js`).

### Video Generation Flow

1. User clicks generate → `generateVideo()` called (Netlify Function)
2. Netlify function starts job → returns `operationName`
3. Client starts polling every 10 seconds via `checkVideoStatus()`
4. When complete, function returns video buffer
5. Client creates blob URL → auto-downloads + shows preview

**Note**: Videos are currently **not** uploaded to backend (feature prepared but not fully implemented)

**Code reference**: src/hooks/useGenerationLogic.ts:222-256

---

## Routing Structure

Defined in `src/App.tsx:39-54`:

### Authenticated Routes (requires login)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.tsx` | Main generation interface |
| `/gallery` | `Gallery.tsx` | View all user's images |
| `/image/:id` | `ImageView.tsx` | Single image detail view |
| `*` | Redirect to `/` | Fallback for unknown routes |

### Public Routes (no auth required)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | `Auth.tsx` | Login form |
| `/register` | `Auth.tsx` | Registration form |
| `*` | Redirect to `/login` | Fallback for unauthenticated users |

**Navigation**: Bottom bar component (`BottomBar.tsx`) provides links (dynamically shows based on auth state).

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

- **Primary Font**: Poppins (sans-serif) - Used for UI text
- **Accent Font**: Permanent Marker (cursive) - Used for playful elements (`.font-hand`)

### Component Patterns

- **Feature folders**: Components grouped by feature (e.g., `ImageCard/`, `ModeSelector/`)
- **Responsive design**: Mobile-first with Tailwind breakpoints (`md:`, `lg:`)
- **Consistent spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `gap-8`)
- **Animations**: Subtle transitions for hover states and loading states

---

## Development Workflow

### Local Development

#### Prerequisites

1. **Backend API**: Must be running on port 3001 (or configure `VITE_API_BASE_URL`)
2. **Netlify Functions**: Must be available for AI generation

#### Setup

```bash
# Install dependencies
npm install

# Set environment variables (optional - has defaults)
# Create .env file:
VITE_API_BASE_URL=http://localhost:3001

# Start dev server + Netlify Functions
npm run netlify:dev

# Or run separately:
npm run dev              # Frontend only (port 3000)
# Netlify functions won't work without netlify dev
```

**Important**:
- The Vite dev server proxies `/.netlify/functions/*` to `localhost:8888`
- You **must** use `netlify dev` for AI generation to work
- Backend API must be running separately (not included in this repo)

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

#### Frontend (.env)

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:3001`)

#### Netlify Functions (Netlify dashboard)

- `GEMINI_API_KEY` - Required for all AI generation functions

---

## Common Patterns & Conventions

### File Upload Handling

**Max file size**: 4MB (enforced in src/hooks/useGenerationLogic.ts:63-64, 90-91)

**File limits per mode**:
- **Text mode**: 0 files
- **Image mode**: Max 3 reference images
- **Video mode**: Max 1 reference image

**Accepted formats**: Images (JPEG, PNG, etc.) - determined by browser's file picker

**Drag-and-drop**: Implemented via:
- `handleDragOver()` - Sets `isDragging` to true
- `handleDragLeave()` - Sets `isDragging` to false
- `handleDrop()` - Processes dropped files

### Error Handling

All async operations use try/catch:
- **User-facing errors**: Set via `setError()` state (displayed in UI)
- **Network errors**: Display error message from API response
- **Auth errors (401)**: Automatically handled by `apiClient` → redirects to login
- **Graceful degradation**: Failed uploads don't block UI

### Success Notifications

Ephemeral success messages (5-second timeout):
```typescript
setSuccess("Image generated successfully!");
setTimeout(() => setSuccess(null), 5000);
```

### Image ID Generation

**Backend-generated**: Server assigns IDs (typically UUIDs or auto-increment)

**Previous approach (v1.x)**: Client-side timestamp-based IDs (`Date.now().toString()`)

### Image URL Construction

Use `getImageUrl()` utility (src/utils/imageUtils.ts:9-23):

```typescript
const imageUrl = getImageUrl(generatedImage);
// Returns: image.asset.path (backend URL) or image.url (legacy blob URL)
```

**Why?**
- Supports both backend assets and legacy local URLs
- Centralizes URL logic (easy to change CDN configuration)
- Handles missing data gracefully

---

## Testing & Quality

### Current State

**No automated tests configured** (no test framework in package.json).

### Manual Testing Checklist

When making changes:
1. Test all 3 generation modes (text/image/video)
2. Verify backend persistence (reload page, check history intact)
3. Test authentication flow (login, register, logout, token expiry)
4. Test on mobile viewport (responsive design)
5. Check Netlify function logs for AI generation errors
6. Verify PWA functionality (offline mode, install prompt)
7. Test multi-user scenarios (different users don't see each other's images)

---

## Git Workflow

### Branch Strategy

- **Main branch**: Production-ready code
- **Feature branches**: Named `feature/<description>` or `claude/<task-id>`

### Commit Guidelines

- Use descriptive commit messages with conventional commits format
- Reference PR numbers when merging
- Example: `feat: add JWT authentication system (#26)`

### Recent Major Changes (Git History Context)

**Version 2.0.0 - Major Architecture Overhaul**:
- Migrated from SQLite + IndexedDB to RESTful backend API
- Added JWT-based authentication system
- Added multi-user support with user isolation
- Changed data model to use server-side assets
- Added `AuthContext`, `apiClient`, `authService`
- Removed `sqliteService.ts` and SQL.js dependencies from data flow
- Added TanStack Query for server state management

**Previous version (1.x)**:
- Client-side only architecture
- No authentication
- SQLite + IndexedDB persistence
- Base64 image storage

**Pattern**: The codebase underwent a major architectural refactor from client-side to server-side persistence.

---

## Important Constraints & Gotchas

### 1. Backend API Dependency

**Critical**: The app now **requires** a running backend API server for core functionality.

- Images are stored on the backend (not in browser)
- User authentication requires backend endpoints
- History won't load without backend connection

**Recommendation**: Provide clear error messages when backend is unavailable.

### 2. Authentication Required

All routes except `/login` and `/register` require authentication. Users must create an account to use the app.

### 3. Image Storage Location

Images are stored on the **backend server**, not in browser:
- **Pros**: Multi-device sync, persistent across browsers, better for large images
- **Cons**: Requires internet connection, backend storage costs

### 4. Video Polling Interval

Hardcoded to 10 seconds (src/hooks/useGenerationLogic.ts:240-242). Adjust if videos take longer than expected.

### 5. Vite Proxy Configuration

The dev server expects Netlify Functions on port 8888. If you run `vite dev` directly (not `netlify dev`), AI generation will fail.

### 6. PWA Caching

The app is a PWA with aggressive caching. During development, you may need to:
- Hard refresh (Ctrl+Shift+R)
- Clear service workers in DevTools
- Clear localStorage (auth tokens persist)

### 7. TypeScript Strictness

TypeScript is configured but not in strict mode. Some type assertions use `any` (e.g., src/hooks/useGenerationLogic.ts:205, 246).

**Recommendation**: Gradually increase strictness for better type safety.

### 8. CORS Configuration

Backend API must allow requests from frontend origin (typically `http://localhost:3000` in dev).

### 9. Token Expiration

JWT tokens may expire. The app handles 401 responses by clearing the token and redirecting to login, but there's no automatic refresh mechanism.

**Recommendation**: Implement refresh tokens or handle expiration more gracefully.

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Understand the architecture first**: This is now a **full-stack application** with frontend + backend
2. **Respect the hook pattern**: Business logic goes in hooks, not components
3. **Use apiClient for backend calls**: Never use raw `fetch` for authenticated endpoints
4. **Handle auth states**: Consider logged-in vs. logged-out user experiences
5. **Mind file size limits**: Max 4MB per file, max 3 images in image mode
6. **Preserve Friends theme**: Maintain playful tone in UI (phrases, colors)
7. **Use existing utilities**: `getImageUrl()`, `apiClient`, `authService`
8. **Check Netlify function logs**: For AI debugging (not visible in browser)
9. **Consider mobile UX**: All changes should work on mobile viewports
10. **Test auth flows**: Login, logout, token expiry, unauthorized access

### Common Tasks

#### Adding a New Component

1. Create feature folder: `src/components/NewFeature/`
2. Export from `NewFeature/NewFeature.tsx`
3. Follow existing naming (PascalCase for components)
4. Use Tailwind classes (avoid inline styles)
5. Import into relevant page (e.g., `Home.tsx`)
6. Consider auth state if component behavior changes based on user

#### Modifying Generation Logic

1. Locate logic in `src/hooks/useGenerationLogic.ts`
2. Update state/actions as needed
3. Test AI generation (Netlify Functions)
4. Test backend upload (ensure images persist)
5. Propagate changes to `Home.tsx` (component receives `state` + `actions`)
6. Test all 3 modes (text/image/video)

#### Adding a New API Endpoint

**Frontend:**
1. Add endpoint to `src/services/api.ts`
2. Create service function if needed (e.g., in `uploadService.ts`)
3. Use `apiClient` for authenticated requests
4. Handle errors and loading states

**Backend:** (not included in this repo)
1. Implement route handler with authentication middleware
2. Add database queries/mutations
3. Return consistent JSON responses
4. Handle errors with appropriate status codes

#### Adding Protected Routes

1. Add route in `App.tsx` inside authenticated routes section (lines 40-46)
2. Create page component in `src/pages/`
3. Use `useAuth()` hook if component needs user data
4. Test with logged-in and logged-out states

#### Modifying Data Model

**Frontend:**
1. Update TypeScript interfaces in `src/types.ts`
2. Update `GeneratedImage`, `Asset`, or `User` interfaces
3. Check all usages (TypeScript will help identify)

**Backend:** (not included in this repo)
1. Create database migration
2. Update models/schemas
3. Update API response serialization

### Performance Considerations

- **Backend API calls**: Minimize unnecessary requests (use caching via TanStack Query)
- **Image loading**: Backend assets should be optimized (compression, CDN)
- **Auth checks**: Cached via AuthContext (only fetches user once on mount)
- **Video polling**: Uses setInterval, ensure cleanup on unmount (already handled)
- **Asset URLs**: Consider adding CDN for production (not yet implemented)

### Accessibility Notes

**Current state**: Basic accessibility (semantic HTML, some ARIA attributes).

**Implemented**:
- ARIA labels on model selector
- Lazy loading for images
- Focus states on interactive elements

**Improvement areas**:
- Add more ARIA labels to complex interactions
- Test keyboard navigation thoroughly
- Add screen reader announcements for generation status
- Improve color contrast ratios

---

## Security Considerations

### Authentication Security

1. **JWT Storage**: Tokens stored in `localStorage` (vulnerable to XSS)
   - **Recommendation**: Consider `httpOnly` cookies for production
   - **Mitigation**: Ensure backend validates and expires tokens

2. **Token Exposure**: Client-side storage means tokens accessible to JavaScript
   - **Mitigation**: Short-lived tokens + refresh token rotation (not yet implemented)

3. **CORS**: Backend must properly configure CORS to prevent unauthorized origins

4. **API Key Protection**: `GEMINI_API_KEY` hidden in Netlify Functions (good!)

### Best Practices for AI Assistants

- Never log or expose `GEMINI_API_KEY` in client code
- Validate user input before sending to backend
- Sanitize file uploads (size, type checks already implemented)
- Handle auth errors gracefully (don't expose sensitive error details)
- Use HTTPS in production for all API calls

---

## Future Enhancement Ideas

Based on current architecture, these are logical next steps:

1. **Refresh Token System**: Implement refresh tokens to avoid frequent re-logins
2. **Cloud CDN Integration**: Serve images from CDN for better performance
3. **Video Backend Integration**: Complete video upload/storage on backend
4. **Image Editing**: Filters, crops, etc. (Gemini supports editing prompts)
5. **Batch Generation**: Generate multiple variations at once
6. **History Search**: Filter by prompt text, date range, user
7. **Export/Import History**: Let users backup/restore their gallery
8. **Keyboard Shortcuts**: Power user features
9. **Automated Tests**: Add Jest + React Testing Library
10. **Social Features**: Share images, collaborative galleries (requires backend changes)
11. **Admin Dashboard**: User management, usage analytics
12. **Rate Limiting**: Prevent abuse of AI generation (backend side)
13. **Email Verification**: Add email to user registration
14. **Password Reset**: Forgot password flow
15. **Profile Management**: Update username, avatar, settings

---

## Quick Reference

### Most Important Files to Understand

1. `src/hooks/useGenerationLogic.ts` - **All generation logic**
2. `src/services/apiClient.ts` - **HTTP client with auth**
3. `src/services/authService.ts` - **Authentication logic**
4. `src/context/AuthContext.tsx` - **Auth state management**
5. `src/App.tsx` - **Routing & auth guards**
6. `netlify/functions/generate-image.js` - **AI integration example**

### Key Commands

```bash
npm run netlify:dev    # Start dev server with functions
npm run build          # Production build
npm run version:bump   # Update version in package.json
```

### Environment Variables Checklist

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3001)

**Netlify:**
- `GEMINI_API_KEY` - Gemini AI API key (required)

### Debugging Tips

- **Auth issues**: Check localStorage for `auth_token`, check backend `/api/v1/auth/me`
- **API issues**: Check Network tab in DevTools, verify backend is running
- **Image not showing**: Check `asset.path` value, verify backend serves static files
- **Video stuck**: Check browser Network tab for polling requests
- **401 Unauthorized**: Token expired or invalid → should auto-redirect to login
- **CORS errors**: Backend CORS configuration issue

---

## API Documentation Quick Reference

### Authentication Endpoints

```
POST /api/v1/auth/login
Body: { username: string, password: string }
Response: { user: User, accessToken: string }

POST /api/v1/auth/register
Body: { username: string, password: string }
Response: { user: User, accessToken: string }

GET /api/v1/auth/me
Headers: Authorization: Bearer <token>
Response: User
```

### Image Endpoints

```
GET /api/v1/images
Headers: Authorization: Bearer <token>
Response: GeneratedImage[]

GET /api/v1/images/:id
Headers: Authorization: Bearer <token>
Response: GeneratedImage

POST /api/v1/images
Headers: Authorization: Bearer <token>
Body: FormData { image: File, prompt: string, aspectRatio: string, description?: string }
Response: GeneratedImage

DELETE /api/v1/images/:id
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

---

## Version History

### Version 2.0.3 (Current)

**Major Changes:**
- ✅ Migrated from SQLite + IndexedDB to RESTful backend API
- ✅ Added JWT-based authentication system
- ✅ Added multi-user support with user isolation
- ✅ Implemented server-side image storage with Asset model
- ✅ Added TanStack Query for server state management
- ✅ Added Lightbox component for image viewing
- ✅ Removed client-side SQLite dependency from data flow

**Breaking Changes from 1.x:**
- Backend API now required (app won't work without it)
- All users must authenticate (no anonymous usage)
- Image data structure changed (added `userId`, `assetId`, `asset`)
- Images stored on server (not in browser)

### Version 1.3.5 (Legacy)

- Client-side only architecture
- SQLite + IndexedDB persistence
- No authentication
- Base64 image storage in browser

---

## Contact & Support

For codebase questions:
1. Review this CLAUDE.md file
2. Check inline code comments
3. Examine git history for context on recent changes
4. Refer to README.md for user-facing documentation
5. Check backend API documentation (separate repo)

**Happy coding!** May your prompts be creative and your APIs be RESTful.

---

**Document Version**: 2.0
**Last Updated**: 2026-01-25
**Codebase Version**: 2.0.3
