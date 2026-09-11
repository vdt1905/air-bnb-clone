# Phase 4 — Full Stack Architecture

We are implementing an original desktop-only Airbnb listing clone.

Technology:

Frontend:
- React
- Vite
- JavaScript
- Zustand
- Tailwind CSS

Backend:
- Node.js
- Express

Use the following architecture:

Routes
→ Controllers
→ Services
→ Models

Middleware should handle:
- validation
- errors
- security-related concerns where appropriate

## Requirements

Design a clean monorepo structure:

client/
server/
docs/
ai/

## Frontend

Define:

- component hierarchy
- pages
- Zustand stores
- hooks
- API services
- utilities
- constants
- asset organization

Zustand should manage shared UI/application state.

Avoid putting every local UI state variable into Zustand.

## Backend

Define:

- routes
- controllers
- services
- models
- middleware
- configuration
- data

The backend should remain minimal.

We do NOT need:
- authentication
- payment processing
- complex booking infrastructure
- microservices
- unnecessary database infrastructure

unless required by the reference.

## API

Design the minimum API needed for the clone.

At minimum consider:

GET /api/listings/:id

Only add additional endpoints if the frontend genuinely requires them.

## Output

Create:

docs/architecture/TECHNICAL_ARCHITECTURE.md

Include:
- directory structure
- component hierarchy
- state architecture
- API architecture
- data flow
- frontend/backend responsibilities
- key design decisions
- tradeoffs
