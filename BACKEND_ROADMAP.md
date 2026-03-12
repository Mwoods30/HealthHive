# HealthHive Backend Roadmap

This document turns the current React app into a practical backend plan.
It is scoped to the frontend that already exists in this repo:

- Public marketing landing page
- Role-based sign-in
- Patient home, submit, results, and history flows
- Provider dashboard
- Admin dashboard

## Current Frontend Scope

The current screens imply the following backend responsibilities:

- `LoginPage`: authenticate a user and resolve their role
- `PatientSubmit`: create a patient symptom check-in
- `PatientHistory`: list prior patient submissions
- `PatientResults`: return latest summaries, trends, or computed insights
- `ProviderDashboard`: show patients needing review and provider workload summaries
- `AdminDashboard`: show platform health and account activity

## Recommended Stack

Start with the simplest architecture that supports the app well:

- API style: REST
- App shape: single backend service / monolith
- Database: PostgreSQL
- Auth: session cookie or JWT with refresh flow
- ORM or query layer: Prisma, Drizzle, Sequelize, or equivalent
- Validation: Zod, Joi, or backend framework validation layer

Avoid microservices for the first version. The current app does not justify that complexity.

## Phase 1 Goals

The first backend milestone should support this end-to-end flow:

1. A user signs in.
2. The backend returns the authenticated user and role.
3. A patient submits a symptom entry.
4. That patient can view their own history.
5. That patient can view basic results or summary data.
6. A provider can view assigned patients and recent submissions.
7. An admin can view user/account activity and system-level summaries.

If those seven things work, the frontend can stop relying on placeholder data.

## Domain Model v1

Start with these core tables.

### `users`

- `id`
- `email`
- `password_hash`
- `full_name`
- `role` (`patient`, `provider`, `admin`)
- `status` (`active`, `inactive`, `pending`)
- `created_at`
- `updated_at`

### `patient_profiles`

- `user_id`
- `date_of_birth`
- `sex`
- `primary_provider_id`
- `created_at`
- `updated_at`

### `provider_profiles`

- `user_id`
- `specialty`
- `license_number`
- `created_at`
- `updated_at`

### `provider_patient_assignments`

- `id`
- `provider_user_id`
- `patient_user_id`
- `status`
- `assigned_at`

### `symptom_submissions`

- `id`
- `patient_user_id`
- `submitted_at`
- `symptoms_text`
- `duration_text`
- `notes_text`
- `status` (`new`, `reviewed`, `flagged`)
- `created_at`

This maps directly to the fields already present in `PatientSubmit`.

### `result_summaries`

- `id`
- `patient_user_id`
- `title`
- `summary`
- `severity`
- `effective_date`
- `created_at`

This supports the current `PatientResults` screen.

### `audit_logs`

- `id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata_json`
- `created_at`

Use this for admin visibility and future compliance work.

## API Contract v1

These endpoints match the existing frontend routes and likely next steps.

### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

`POST /auth/login` request:

```json
{
  "email": "user@example.com",
  "password": "plaintext-password"
}
```

`GET /auth/me` response:

```json
{
  "id": "usr_123",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "role": "patient",
  "status": "active"
}
```

### Patient

- `POST /patient/submissions`
- `GET /patient/submissions`
- `GET /patient/submissions/:submissionId`
- `GET /patient/results`
- `GET /patient/history`

`POST /patient/submissions` request:

```json
{
  "symptoms": "Headache, sore throat, fatigue",
  "duration": "2 days",
  "notes": "Worse in the morning"
}
```

`GET /patient/history` response:

```json
[
  {
    "id": "sub_001",
    "submittedAt": "2026-03-10T14:30:00Z",
    "summary": "Fatigue reduced, energy improved by afternoon.",
    "status": "reviewed"
  }
]
```

### Provider

- `GET /provider/dashboard`
- `GET /provider/patients`
- `GET /provider/patients/:patientId`
- `GET /provider/patients/:patientId/submissions`
- `PATCH /provider/submissions/:submissionId`

`GET /provider/dashboard` should at minimum return:

- number of patients needing review
- recent flagged or new submissions
- weekly summary counts

### Admin

- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:userId`
- `GET /admin/audit-logs`

`GET /admin/dashboard` should at minimum return:

- service status
- user counts by role
- pending provider approvals or invites
- recent account activity

## Authorization Rules

Write these rules down before implementation. Most backend mistakes happen here.

### Patient

- Can read their own profile
- Can create their own submissions
- Can read their own history
- Can read their own results
- Cannot read another patient's data

### Provider

- Can read only assigned patients
- Can read assigned patient submissions and results
- Can update review status or notes for allowed submissions
- Cannot access unassigned patients

### Admin

- Can read user lists and audit logs
- Can update account status and roles according to policy
- Should not silently modify clinical data without audit logging

## Backend Work Breakdown

Split work into four parallel tracks.

### Track 1: Auth and Access Control

- Implement user table and role enum
- Implement password hashing
- Implement login, logout, and `me`
- Implement middleware for auth
- Implement role-based authorization helpers

### Track 2: Database and Models

- Create schema for users, assignments, submissions, results, and audit logs
- Add migrations
- Seed local dev data for patient/provider/admin accounts
- Add indexes for common queries

Recommended early indexes:

- `users.email`
- `symptom_submissions.patient_user_id`
- `symptom_submissions.submitted_at`
- `provider_patient_assignments.provider_user_id`

### Track 3: Patient APIs

- Create submission endpoint
- Create patient history endpoint
- Create patient results endpoint
- Add validation for all patient-facing input

### Track 4: Provider and Admin APIs

- Create provider dashboard summary endpoint
- Create patient review list endpoint
- Create admin dashboard endpoint
- Create user-management and audit-log endpoints

## Milestones

### Milestone 1: Replace Mock Auth

Target outcome:

- frontend login uses real backend auth
- backend returns current user and role
- protected routes rely on real auth state

Definition of done:

- patient, provider, and admin can sign in with seeded accounts
- frontend no longer uses fake role selection as the real source of truth

### Milestone 2: Patient Check-In Flow

Target outcome:

- patient submits symptom data to backend
- patient history page reads from backend

Definition of done:

- `PatientSubmit` persists data
- `PatientHistory` lists real records

### Milestone 3: Patient Results

Target outcome:

- `PatientResults` loads real summaries

Definition of done:

- results endpoint returns at least placeholder computed summaries from stored submissions

### Milestone 4: Provider Dashboard

Target outcome:

- provider sees assigned patients and recent submissions requiring review

Definition of done:

- provider dashboard is backed by real database queries
- provider access is limited to assigned patients

### Milestone 5: Admin Dashboard

Target outcome:

- admin sees real platform/account data

Definition of done:

- admin dashboard returns user counts, pending activity, and recent audit items

## Testing Plan

Start automated testing early. At minimum, cover:

- auth success and failure cases
- role-based route protection
- patient creating a submission
- patient reading only their own history
- provider reading assigned patient data only
- admin updating account status

Recommended test layers:

- unit tests for validators and authorization helpers
- integration tests for API endpoints
- seed-based local manual verification for role flows

## Local Development Setup

Your team should define this before serious backend work starts:

- local database startup flow
- `.env` variables
- migration command
- seed command
- test command
- API base URL used by the React app

Example `.env` variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthhive
PORT=4000
JWT_SECRET=replace-me
CORS_ORIGIN=http://localhost:5173
```

## Team Plan

Suggested assignment for a four-person team:

- Person 1: auth, sessions/tokens, middleware
- Person 2: schema, migrations, seed data
- Person 3: patient submissions, history, results APIs
- Person 4: provider/admin APIs, audit logging, integration tests

If your team is smaller, do the work in this order:

1. Auth
2. Patient submissions and history
3. Patient results
4. Provider dashboard
5. Admin dashboard

## Immediate Next Documents

Create these next if they do not already exist:

- `API_CONTRACT.md`
- `DATABASE_SCHEMA.md`
- `AUTHORIZATION_RULES.md`
- `BACKEND_TASKS.md`

## Immediate Next Implementation Step

The best first coding step is:

1. Pick the backend framework.
2. Create the auth and user schema.
3. Seed one patient, one provider, and one admin account.
4. Implement `POST /auth/login` and `GET /auth/me`.
5. Wire the frontend login flow to those endpoints.

That gives the team a real foundation instead of building isolated backend pieces without integration.
