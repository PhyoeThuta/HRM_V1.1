# 10. Testing Gap Analysis

*Status:* VERIFIED FROM CODE

## Current State of Testing
The current backend repository contains a `server/tests/` directory with `176` lines of code across 6 files (`hrm.test.js`, `crm_ops.test.js`, etc.). This indicates near **0% test coverage** for a 10,000+ line backend.

## Missing Tests (The Gap)

### 1. Integration Tests for Operations (Critical)
- **Flow**: `POST /api/operations/orders/auto-generate`
- **Gap**: There are no tests verifying that a customer with an active 30-day package actually receives 30 distinct daily kitchen orders, or that skipped days extend the expiry correctly.

### 2. Integration Tests for CRM Webhooks (Critical)
- **Flow**: `POST /api/crm/webhooks/zernio`
- **Gap**: Missing tests to verify idempotency (what happens if Facebook sends the same message twice?).

### 3. Unit Tests for Payroll Engine (High)
- **Flow**: `GET /api/payroll-engine/calculate/:employee_id/:month`
- **Gap**: No tests verify the correct mathematical deduction of late penalties from base pay.

### 4. End-to-End (E2E) Smoke Tests (High)
- **Flow**: Login -> Dashboard Load
- **Gap**: If `verifyToken` middleware is accidentally broken, the entire app goes down. A simple HTTP test is needed.

## Recommendation BEFORE Refactoring
Do not attempt Phase 3 or Phase 4 of the Refactoring Roadmap until at least **API Integration Tests** are written for the flows listed above. 
