# HealthHive Integration Architecture

This document explains how HealthHive can evolve from a frontend-first senior project into a realistic healthcare workflow platform without overclaiming full production healthcare deployment.

It is designed to answer this question:

`How can this app be built so it feels real, supports believable doctor / appointment / billing workflows, and is still feasible for a student team?`

## Goal

The realistic target is not direct production integration with hospitals, insurers, or real patient data.

The realistic target is:

- a full-stack app
- real authentication and authorization
- real persistence
- believable healthcare workflows
- sandbox-ready architecture
- internal data models that could support future integrations

That is a strong senior project and portfolio outcome.

## Practical Scope

HealthHive should be framed as:

`A role-based healthcare workflow platform prototype designed for future EHR, billing, and operational integrations.`

That means:

- patient, provider, and admin workflows are real inside your system
- data is stored in your own backend
- external healthcare systems are optional integrations layered on top
- the frontend always talks to your backend, not directly to healthcare APIs

## Architecture Overview

Recommended system structure:

### Frontend

- React app
- role-aware routing
- patient dashboard
- provider dashboard
- admin dashboard
- marketing and sign-in flow

### Backend API

Use one backend service first.

Suggested choices:

- Express
- NestJS
- Fastify

Responsibilities:

- authentication
- authorization
- CRUD for app entities
- dashboard aggregation
- audit logging
- external integration orchestration

### Database

Use PostgreSQL.

Responsibilities:

- users and roles
- patient/provider relationships
- submissions and history
- appointments
- billing and claims
- audit logs
- imported external records

### Integration Layer

Keep external API logic separate from core route handlers.

Suggested modules:

- `ehrIntegrationService`
- `billingIntegrationService`
- `claimsSyncService`
- `sandboxImportService`

This makes the project more maintainable and more professional architecturally.

## Data Strategy

Use three layers of data.

### Layer 1: Internal Product Data

This is the data your app owns directly.

Examples:

- symptom submissions
- provider notes
- patient history
- dashboard summaries
- appointments created in HealthHive
- balances and invoices created in HealthHive
- admin audit events

This should be the foundation of the app.

### Layer 2: Sandbox Healthcare Data

Use sandbox or demo data for realism.

Examples:

- demo patient records
- medications
- encounters
- observations
- lab result samples

Potential standards:

- FHIR
- SMART on FHIR sandbox environments

Important:
Do not build the frontend to depend directly on a FHIR payload shape. Normalize external data into your own backend schema first.

### Layer 3: Simulated Billing / Claims Data

This is where a student project can feel realistic without needing real payer contracts.

Examples:

- insurance policy records
- deductible / out-of-pocket summaries
- invoices
- claim statuses
- payment history

Suggested statuses:

- `draft`
- `submitted`
- `in_review`
- `denied`
- `paid`
- `overdue`

## Recommended Domain Model

In addition to the existing backend roadmap, add these entities.

### Core identity and access

- `users`
- `roles`
- `sessions`
- `audit_logs`

### Clinical workflow

- `patient_profiles`
- `provider_profiles`
- `patient_provider_assignments`
- `symptom_submissions`
- `provider_notes`
- `result_summaries`
- `appointments`

### Billing and insurance

- `insurance_policies`
- `claims`
- `invoices`
- `payments`

### External integration storage

- `external_patient_records`
- `external_observations`
- `external_medications`
- `integration_sync_logs`

These external tables can be simplified depending on your implementation. The important point is to separate imported data from internally authored workflow data.

## Frontend-to-Backend Contract

The frontend should always call HealthHive APIs.

Bad approach:

- React app calls hospital API directly
- React app calls payer API directly

Good approach:

- React app calls `GET /patient/dashboard`
- backend aggregates internal DB data
- backend optionally merges sandbox external data
- backend returns a clean app-specific response

This keeps your frontend stable even if external providers change.

## Recommended API Shape

### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Patient

- `GET /patient/dashboard`
- `POST /patient/submissions`
- `GET /patient/history`
- `GET /patient/results`
- `GET /patient/appointments`
- `GET /patient/billing`
- `GET /patient/insurance`

### Provider

- `GET /provider/dashboard`
- `GET /provider/patients`
- `GET /provider/patients/:patientId`
- `GET /provider/patients/:patientId/submissions`
- `POST /provider/patients/:patientId/notes`
- `PATCH /provider/submissions/:submissionId`

### Admin

- `GET /admin/dashboard`
- `GET /admin/users`
- `PATCH /admin/users/:userId`
- `GET /admin/audit-logs`
- `GET /admin/provider-approvals`
- `PATCH /admin/provider-approvals/:approvalId`

### Integration

- `POST /integrations/fhir/sync-demo`
- `GET /integrations/status`
- `GET /integrations/sync-logs`

For the senior project, these integration endpoints can be admin-only.

## Realistic Implementation Phases

### Phase 1: Real Full-Stack Foundation

Build:

- backend service
- PostgreSQL schema
- real login
- role-based authorization
- seed data for patient/provider/admin

Definition of done:

- frontend no longer uses fake localStorage auth as the source of truth

### Phase 2: Patient Workflow

Build:

- symptom submission persistence
- patient history
- patient results summary
- appointments and billing placeholders from the DB

Definition of done:

- patient dashboard reads from real APIs

### Phase 3: Provider Workflow

Build:

- provider dashboard aggregation
- review queues
- provider notes
- patient assignment model

Definition of done:

- provider only sees assigned patients

### Phase 4: Admin Workflow

Build:

- account management
- provider approval queue
- audit log viewer
- platform metrics

Definition of done:

- admin dashboard uses real data and records admin actions

### Phase 5: Sandbox Healthcare Integration

Build:

- one sandbox FHIR import flow
- external observation import
- normalized storage in internal tables
- dashboard merge logic

Definition of done:

- at least one dashboard surface displays imported sandbox data through your backend

### Phase 6: Simulated Billing Integration

Build:

- claims table
- invoices table
- payment records
- statuses and admin/provider visibility rules

Definition of done:

- patient can see balances
- admin can see claim/billing workflow state

## What Is Feasible for Students

### Feasible

- real auth
- real role permissions
- real database
- seeded demo accounts
- realistic patient/provider/admin workflows
- simulated appointments
- simulated claims and billing
- sandbox FHIR import
- audit logs

### Risky but possible

- one real sandbox integration
- limited OAuth-based healthcare sandbox auth
- importing observations or medications from a demo source

### Not realistic for this course timeline

- live Epic production integration
- real insurer claim submission
- production PHI handling for actual patients
- hospital deployment
- legal/compliance-ready release

## Security Expectations

For credibility, implement at least:

- hashed passwords
- protected routes
- role-based authorization middleware
- input validation
- audit logging for sensitive actions
- `.env` secrets
- database migrations

Nice-to-have:

- rate limiting
- refresh tokens or secure sessions
- structured logging
- error monitoring

## Example Demo Story

A strong demo could look like this:

1. Patient logs in and submits a symptom check-in.
2. Patient dashboard updates with history, appointment, billing, and results data.
3. Provider logs in and sees that submission appear in a review queue.
4. Provider adds a note and updates status.
5. Admin logs in and reviews platform metrics, provider approvals, and audit activity.
6. Admin triggers a sandbox data sync that imports external observation data into the backend.

That is a very strong senior-project demo because it shows:

- role separation
- persistence
- workflow continuity
- realistic system architecture
- a path toward real healthcare integration

## Best Portfolio Framing

Use language like this:

`HealthHive is a role-based healthcare workflow platform prototype with real full-stack architecture, simulated billing and operational workflows, and an integration-ready design for future EHR interoperability.`

Avoid saying:

- live medical deployment
- real hospital integration
- real patient data platform

unless that is actually true.

## Recommended Next Files

To support this architecture, the repo should eventually include:

- `API_CONTRACT.md`
- `DATABASE_SCHEMA.md`
- `AUTHORIZATION_RULES.md`
- `INTEGRATION_PLAN.md`
- `DEMO_SCENARIOS.md`

## Immediate Next Build Step

The most practical next step is:

1. stand up the backend
2. replace demo auth
3. persist patient submissions
4. create patient/provider/admin dashboard API responses
5. add appointments, insurance, and billing tables

That gives the project a real core before adding any sandbox healthcare integration.
