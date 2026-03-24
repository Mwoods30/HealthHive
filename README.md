# HealthHive

HealthHive is a role-based healthcare web application built as a senior project. The current repository is a frontend-only shell that preserves the product structure, page layouts, routing, styling system, and role-based navigation while leaving the actual data layer empty.

The app is organized around three workspaces:

- `patient`
- `provider`
- `admin`

## Current Frontend State

Right now, this project is intentionally frontend-first:

- role-based routing is in place
- patient, provider, and admin screens exist
- the landing page, auth flow, and workspace navigation are connected
- forms and containers are present as UI structure
- fields are empty and no application data is persisted

Authentication is still lightweight and frontend-only. The selected role is stored in local storage so the app can route to the correct workspace.

## What The Frontend Does

The frontend currently demonstrates:

- a marketing-to-app flow in one React application
- protected role-aware routing with React Router
- reusable UI primitives such as buttons, cards, chips, and inputs
- consistent screen composition across patient, provider, and admin experiences
- empty frontend forms and placeholders that are ready to connect to real APIs later

This makes the project useful as a product shell: the interface and navigation are already built, so backend work can focus on real data, business logic, and integrations.

## Styling And Design Choices

The current UI is designed to feel clean, modern, and clinical without looking generic.

### Visual direction

- soft healthcare-inspired green palette
- white card surfaces on a light neutral background
- rounded containers and cards for a softer product feel
- subtle shadows and borders instead of heavy contrast

### Typography

- `Fraunces` for display headings
- `Manrope` for body copy and interface text

This combination gives the project a more editorial and intentional look than a default system-font dashboard.

### Layout choices

- a framed app shell using `.app-stage` and `.container`
- card-based composition for dashboards and sections
- responsive spacing that scales from mobile to desktop
- role-separated screen folders so each workspace can evolve independently

### Theme tokens

Core design tokens live in [src/styles/theme.css](/Users/matthewwoods/SeniorProject/healthhive-react/src/styles/theme.css), including:

- primary greens for CTA and navigation emphasis
- neutrals for surfaces and dividers
- shared radius tokens
- shared shadow tokens
- font variables for display and body text

Global layout and typography rules live in [src/styles/global.css](/Users/matthewwoods/SeniorProject/healthhive-react/src/styles/global.css).

## Tech Stack

- React 19
- React Router 7
- Vite
- ESLint
- plain CSS organized by feature area

## App Structure

```text
src/
  auth/
    AuthProvider.jsx
    authContext.js
    roleRoutes.js
    useAuth.js
  components/
    Button.jsx
    Card.jsx
    Chips.jsx
    Input.jsx
    Toast.jsx
  layouts/
    AppShell.jsx
  screens/
    admin/
    auth/
    marketing/
    patient/
    provider/
  styles/
    global.css
    theme.css
  router.jsx
```

## Role Routing

Current role destinations:

- `patient` -> `/patient`
- `provider` -> `/provider`
- `admin` -> `/admin`

Public routes:

- `/`
- `/login`
- `/signup`

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## How To Incorporate The Backend

The current frontend is set up in a way that makes backend integration straightforward. The recommended approach is to add a real API layer instead of wiring network calls directly inside screen components.

### Recommended integration plan

1. Create an API folder such as `src/api/`.
2. Add a shared HTTP client such as `src/api/client.js`.
3. Split domain logic into files such as:
   - `src/api/auth.js`
   - `src/api/patient.js`
   - `src/api/provider.js`
   - `src/api/admin.js`
   - `src/api/chatbot.js`
4. Replace placeholder screen content with controlled state, loading states, and API calls.
5. Move authentication from local role storage to real login/session handling.
6. Add error handling, validation, and API response mapping per role workflow.

### Suggested frontend/backend connection points

- `AuthProvider.jsx`
  Replace local role-only auth with login, logout, token/session storage, and current-user fetch.

- patient screens
  Connect forms and views to endpoints for submissions, appointments, medications, billing, and results.

- provider screens
  Connect review queues, patient records, scheduling, and notes to backend resources.

- admin screens
  Connect approvals, operational issues, audit logs, and platform metrics to admin APIs.

### Suggested API shape

Examples of backend routes the frontend will likely need:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /patients/:id`
- `GET /patients/:id/submissions`
- `POST /patients/:id/submissions`
- `GET /providers/:id/queue`
- `POST /appointments`
- `GET /admin/audit`
- `POST /chat`

### Environment setup

Use Vite environment variables for backend configuration, for example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Then reference that in a shared client:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### Recommended implementation pattern

- keep screens focused on rendering
- keep HTTP logic inside `src/api/`
- keep auth/session state in `AuthProvider`
- use reusable request helpers for headers, tokens, and JSON parsing
- add loading, success, and error states before connecting full workflows

## AI Chatbot Integration

The AI chatbot should be integrated through the backend, not directly from the browser to the model provider.

### Recommended architecture

1. Build a backend `/chat` or `/assistant/chat` endpoint.
2. Send the user message and relevant app context from the frontend to that backend route.
3. Let the backend call the AI provider securely using server-side API keys.
4. Return the assistant response to the frontend chat UI.

### Why route chatbot requests through the backend

- protects API keys
- allows prompt control and guardrails
- makes logging and moderation possible
- lets you inject app context such as role, patient state, or provider workflow context
- makes it easier to add rate limiting and analytics

### Frontend chatbot pieces to add later

- `ChatbotPanel.jsx` or `ChatWidget.jsx`
- chat state for messages, loading, and error handling
- API file such as `src/api/chatbot.js`
- role-aware placement:
  - patient support assistant
  - provider workflow assistant
  - admin help assistant

## TODO

- build a real backend and replace local role-only auth with full authentication
- create an API layer in `src/api/` and connect all workspace screens to backend data
- connect patient submissions, appointments, billing, medications, and results to live endpoints
- connect provider queue, patient records, and scheduling workflows to live endpoints
- connect admin approvals, operational issues, and audit views to live endpoints
- add an AI chatbot backed by a secure server-side integration
- design the chatbot UI and connect it to a backend `/chat` endpoint
- add loading, error, and success states to all major screens
- add automated tests
- prepare deployment configuration for frontend and backend

## Repository Notes

- branding assets live in `public/`
- global styles live in `src/styles/`
- marketing UI lives in `src/screens/marketing/`
- patient, provider, and admin pages are separated under `src/screens/`
- role-based auth state currently lives in [src/auth/AuthProvider.jsx](/Users/matthewwoods/SeniorProject/healthhive-react/src/auth/AuthProvider.jsx)

## Presentation Summary

This repository is best described as:

`A role-based healthcare frontend shell built in React, with completed navigation and styling, ready for backend and AI chatbot integration.`
