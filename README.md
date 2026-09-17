# PulseTrack

PulseTrack is a workforce operations dashboard for distributed teams. It provides employee directory management, attendance and work-status visibility, project and task tracking, and role-oriented dashboards through a React frontend and Spring Boot API.

> **Project status:** The repository contains a working development application and the production foundation. The `dev` profile uses disposable H2 data and seeded records. Production deployment requires PostgreSQL, database migrations, secure session authorization, tenant isolation, audit logging, and privacy controls before real employee data is processed.

## Contents

- [Product Scope](#product-scope)
- [Architecture](#architecture)
- [Technology](#technology)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Security and Privacy](#security-and-privacy)
- [Production Deployment](#production-deployment)
- [Operational Notes](#operational-notes)
- [Development Workflow](#development-workflow)
- [Known Limitations](#known-limitations)
- [License](#license)

## Product Scope

PulseTrack is designed for organizations managing distributed teams. The current application includes:

- Admin and employer login flows
- Employee directory and department filtering
- Attendance and online/offline status views
- Task and project views
- Employer and administrator dashboards
- Employee account creation, editing, and deletion flows
- Development seed data for local evaluation

The product is intentionally scoped toward work status, attendance, tasks, projects, and aggregate productivity. Detailed surveillance signals such as keystrokes, window contents, webcam verification, and precise location require an explicit product, legal, consent, retention, and access-control decision before they can be used in a real organization.

## Architecture

```text
Browser
  |
  | React / Vite
  v
Frontend application (localhost:3000)
  |
  | /api requests through the Vite development proxy
  v
Spring Boot REST API (localhost:8080)
  |
  v
JPA repositories
  |
  +--> H2 in-memory database (dev profile only)
  +--> PostgreSQL (prod profile)
```

The frontend uses the Vite proxy during development. API calls default to `/api`, which avoids hard-coding a local backend port in the browser. The production API origin can be supplied through `VITE_API_BASE`.

## Technology

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Motion

### Backend

- Java 21
- Spring Boot 3.2
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security Crypto with BCrypt password hashing
- H2 for development
- PostgreSQL for production
- Maven Wrapper 3.9.10

## Repository Structure

```text
.
├── backend/
│   ├── .mvn/wrapper/              Maven Wrapper configuration
│   ├── src/main/java/             Spring Boot application and API
│   ├── src/main/resources/        Development and production profiles
│   ├── src/test/java/             Backend unit tests
│   ├── mvnw / mvnw.cmd            Project-local Maven launchers
│   └── pom.xml
├── public/avatars/                Local development avatar assets
├── scripts/dev-all.ps1            Starts frontend and backend together
├── src/                           React application
├── .env.example                   Frontend/API environment reference
├── package.json                   Frontend scripts and dependencies
├── package-lock.json
└── vite.config.ts
```

## Prerequisites

- Node.js 20 or later
- Java 21 or later
- PowerShell on Windows for the combined development command
- PostgreSQL 15 or later for production
- Git

A global Maven installation is not required. The backend Maven Wrapper downloads and caches the required Maven distribution under the user's Maven directory.

## Local Development

Install frontend dependencies:

```powershell
npm install
```

Start both applications with one command:

```powershell
npm run dev:all
```

The launcher clears stale processes on ports `3000` and `8080` before starting the services.

Open the application at:

```text
http://localhost:3000
```

The development API is available at:

```text
http://localhost:8080
```

To run the frontend only:

```powershell
npm run dev
```

To run the backend only:

```powershell
Set-Location backend
./mvnw.cmd org.springframework.boot:spring-boot-maven-plugin:3.2.3:run
```

### Development accounts

The `dev` Spring profile uses disposable H2 data and startup seed records. Do not use these credentials outside local development.

| Account | Email | Password |
|---|---|---|
| Admin | `admin@pulsetrack.com` | `admin123` |
| Seed employee accounts | See seeded employee email | `dev-only-change-me` |

The H2 console is available only in the development profile:

```text
http://localhost:8080/h2-console
```

## Configuration

### Frontend variables

Copy `.env.example` only when environment-specific frontend configuration is needed. Vite exposes variables prefixed with `VITE_` to browser code.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE` | Browser API base URL | `/api` |
| `VITE_BACKEND_URL` | Vite development proxy target | `http://localhost:8080` |

Never place private keys, database credentials, or server secrets in `VITE_*` variables.

### Backend profiles

The default profile is `dev`:

```text
SPRING_PROFILES_ACTIVE=dev
```

The production profile requires PostgreSQL and environment-provided secrets:

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:5432/pulsetrack
DATABASE_USERNAME=<managed database user>
DATABASE_PASSWORD=<managed database password>
PULSETRACK_ADMIN_PASSWORD_HASH=<BCrypt hash>
PULSETRACK_FRONTEND_ORIGIN=https://app.example.com
```

Production configuration must be supplied through Azure Key Vault, App Configuration, or an equivalent secret-management system. Do not commit `.env` files, passwords, tokens, or connection strings.

## API Reference

All endpoints are currently under `/api`. The endpoint list describes the implemented development API; authorization requirements must be enforced before production exposure.

### Authentication

#### `POST /api/auth/login`

Request:

```json
{
  "email": "admin@pulsetrack.com",
  "password": "admin123",
  "role": "admin"
}
```

Successful responses contain a user profile and a development token-shaped value. The current token is not yet a production session or validated bearer token.

#### `POST /api/auth/reset-password`

The unsafe email-only reset behavior has been disabled. A verified reset-token workflow must be implemented before this endpoint is enabled for production use.

### Employees

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/employees` | List employees; optional `department` filter |
| `GET` | `/api/employees/{id}` | Retrieve one employee |
| `POST` | `/api/employees` | Create an employee account |
| `PUT` | `/api/employees/{id}` | Update employee profile/account fields |
| `DELETE` | `/api/employees/{id}` | Delete an employee |
| `PATCH` | `/api/employees/{id}/status` | Update work status, availability, or clock fields |

### Tasks

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/tasks` | List tasks; optional `assignedTo` filter |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle a task between done and in-progress |

## Testing

Run backend tests:

```powershell
Set-Location backend
./mvnw.cmd test
```

Compile the backend without tests:

```powershell
./mvnw.cmd -DskipTests compile
```

Run frontend type checking:

```powershell
Set-Location ..
npm run lint
```

Build the frontend production bundle:

```powershell
npm run build
```

Before a production release, the test suite should include authentication, authorization, tenant isolation, validation, password non-disclosure, reset-token expiry, audit events, database migrations, and API integration tests.

## Security and Privacy

The following safeguards are already present in the development foundation:

- Employee passwords are excluded from JSON serialization.
- Password hashing support uses BCrypt.
- Production database credentials are environment-based.
- H2 and startup seed data are restricted to the `dev` profile.
- Production H2 console access is disabled.
- The frontend API base is not tied to a hard-coded browser origin.

The following controls are required before handling real employee data:

- Backend-enforced authentication and authorization on every protected endpoint
- Secure HttpOnly, SameSite session cookies or a fully validated token strategy
- Organization/tenant isolation on every query and mutation
- PostgreSQL schema migrations and backup/restore procedures
- Verified, expiring password-reset tokens delivered through an approved channel
- Rate limiting, login throttling, account lockout policy, and security event logging
- Audit history for account, attendance, task, and permission changes
- Consent, data minimization, retention, export, and deletion policies
- TLS termination, managed secrets, dependency scanning, and vulnerability response
- Role-based access rules that separate administrators, managers, and employees

Do not use the development seed data or detailed telemetry fields as evidence of real employee activity. They are demonstration values.

## Production Deployment

The intended production direction is Azure with a managed PostgreSQL service and managed application secrets.

A production deployment should include:

1. Build the frontend with `npm run build`.
2. Build and package the backend with `./mvnw.cmd clean package`.
3. Configure `SPRING_PROFILES_ACTIVE=prod`.
4. Provide PostgreSQL credentials through managed secrets.
5. Run database migrations before application startup.
6. Serve the frontend and API behind HTTPS.
7. Restrict CORS to the deployed frontend origin.
8. Configure health checks, structured logs, metrics, alerts, and backups.
9. Run smoke, integration, and security tests against the deployment.
10. Confirm rollback and data-recovery procedures before onboarding users.

The repository does not currently include infrastructure-as-code or a CI/CD pipeline. Those should be added as part of the deployment work rather than treated as manual production configuration.

## Operational Notes

- H2 data is lost whenever the development backend restarts.
- The current application uses startup seed data only in the `dev` profile.
- The frontend contains development/demo views and some client-side state that must be connected to persisted APIs before production use.
- Do not expose the H2 console or development credentials on a public network.
- Do not interpret the current development token-shaped login response as a security boundary.

## Development Workflow

1. Create a feature branch from `main`.
2. Keep changes focused and update tests with behavior changes.
3. Run frontend lint/build and backend tests locally.
4. Review API and privacy implications for any employee-data change.
5. Open a pull request with a clear summary, test evidence, migration notes, and rollout considerations.
6. Merge only after review and required checks pass.

## Known Limitations

This repository is an active product foundation, not a completed compliance-ready workforce monitoring system. In particular:

- The backend does not yet enforce authenticated authorization on all endpoints.
- The production PostgreSQL profile is configured but migrations are not yet included.
- Several frontend workflows still use local or demonstration state.
- Tenant isolation, audit logs, consent, retention, and data export are not complete.
- The current password-reset endpoint intentionally rejects reset requests until a verified token flow exists.

These limitations are documented deliberately so deployment decisions are based on the actual implementation.

## License

No license has been declared for this repository. Add an approved license file before distributing the software outside the owning organization.
