# HealthHive

HealthHive is a role-based health tracking web app built as a senior project foundation. It is designed around three user types:

- `patient`: submit symptom check-ins, view history, and review results
- `provider`: monitor patient trends and prioritize follow-up
- `admin`: oversee platform status and account activity

The current repo contains the React frontend prototype, role-aware routing, and product structure needed to evolve into a full-stack healthcare coordination app.

## Project Goals

This project is intended to demonstrate:

- multi-role product design
- protected routing and role-aware navigation
- a marketing-to-application flow in one React app
- scalable frontend structure for future backend integration
- a clear path toward a portfolio-level full-stack system

## Current Features

### Public experience

- single-page marketing landing page
- in-page navigation with smooth scrolling
- back-to-top button
- sample footer
- redirects from old marketing routes to landing page sections

### Authentication flow

- role-based sign-in screen
- frontend route protection by role
- automatic redirect to the correct dashboard

Note:
Current authentication is demo-level and uses local storage for role state. It is not production auth.

### Patient experience

- patient home dashboard
- symptom submission screen
- results screen
- history screen

### Provider experience

- provider dashboard shell for patient review workflows

### Admin experience

- admin dashboard shell for platform oversight workflows

## Tech Stack

- React 19
- React Router 7
- Vite
- ESLint
- CSS modules by feature area via plain `.css` files

## App Structure

```text
src/
  auth/
    AuthProvider.jsx
    roleRoutes.js
    useAuth.js
  components/
    Button.jsx
    Card.jsx
    Chips.jsx
    Input.jsx
  layouts/
    AppShell.jsx
  screens/
    admin/
    auth/
    marketing/
    patient/
    provider/
  router.jsx
```

## Role Routing

The app currently supports these role destinations:

- `patient` -> `/patient`
- `provider` -> `/provider`
- `admin` -> `/admin`

Public routes:

- `/`
- `/login`

Marketing shortcut routes:

- `/resources` -> `/#resources`
- `/how-to` -> `/#how-to`
- `/contact` -> `/#contact`

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Lint the project

```bash
npm run lint
```

## Current State

This repo is currently a frontend-first product prototype. The UI, routing, and role separation are in place, but the app still needs a real backend to become a complete senior-project-quality system.

What is implemented now:

- frontend routing
- demo auth state
- marketing site
- patient/provider/admin screen structure

What is not implemented yet:

- real user accounts
- secure authentication
- database persistence
- API integration
- provider review workflows backed by real data
- admin account management backed by real data

## Backend Direction

The backend plan for this project is documented in [BACKEND_ROADMAP.md](./BACKEND_ROADMAP.md).

The recommended next steps are:

1. create the backend service
2. add real authentication
3. persist patient submissions
4. load patient history and results from the backend
5. add provider and admin data workflows
6. add testing across frontend and backend

## Recommended Senior Project Upgrades

To make this project portfolio-level, the highest-value additions are:

- real auth with hashed passwords and role-based authorization
- PostgreSQL-backed patient submissions and history
- provider review workflow for assigned patients
- admin dashboard backed by audit and account data
- charts for symptom and wellness trends
- loading, error, and empty states across the app
- automated testing
- deployment for both frontend and backend

## Demo Flow

Right now, the intended walkthrough is:

1. open the landing page
2. go to sign in
3. choose a role
4. view the role-specific workspace
5. explore patient, provider, or admin screens

Because auth is still demo-mode, role selection is currently handled client-side.

## Future Enhancements

- TypeScript migration
- backend API integration
- persistent user accounts
- provider notes and submission review states
- patient charting and analytics
- exportable summaries
- accessibility improvements
- CI pipeline for lint, build, and tests

## Repository Notes

- branding assets live in `public/`
- global styles live in `src/styles/`
- marketing-specific UI lives in `src/screens/marketing/`
- patient/provider/admin screens are separated by role under `src/screens/`

## Authoring Direction

This repository is best presented as:

`A role-based health coordination platform prototype evolving into a full-stack senior project.`

That framing is honest, technically credible, and strong for a portfolio as long as the backend work follows.
