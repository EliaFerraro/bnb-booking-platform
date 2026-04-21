# Testing Strategy Specification

## 1. Introduction
This document defines the testing framework, methodologies, and quality gates for the B&B Booking Platform. The strategy is optimized for a high-velocity development environment, prioritizing integration and end-to-end (E2E) verification to ensure the integrity of critical business flows.

## 2. Testing Objectives
* **Reliability**: Ensure the core booking and payment "Happy Path" is functional at all times.
* **Maintainability**: Minimize test fragility by focusing on behavior rather than implementation details.
* **Automation**: Integrate quality checks into the CI/CD pipeline to prevent regressions.
* **Performance**: Validate non-functional requirements (NFRs) regarding latency and accessibility.


## 3. Testing Levels & Scope

### 3.1 Static Analysis (L0)
The first line of defense is enforced during development and build time.
* **TypeScript**: Strict type-checking to prevent runtime type mismatches.
* **Zod**: Runtime schema validation for all API boundaries and external data (Stripe webhooks, iCal feeds).
* **ESLint**: Enforcement of code quality and security best practices.

### 3.2 Integration Testing (L1)
Focuses on the interaction between business logic and the persistence layer (Supabase).
* **Scope**: Database functions, pricing engine, and the 10-minute concurrency guard (mutex).
* **Tooling**: Vitest.
* **Data Strategy**: Tests are executed against a dedicated Development database instance to ensure real-world SQL compatibility.

### 3.3 End-to-End (E2E) Testing (L2)
Simulates real user behavior across the entire stack.
* **Scope**: 
    * User authentication via OAuth.
    * Room discovery and availability filtering.
    * The complete booking-to-payment lifecycle (Stripe Test Mode).
* **Tooling**: Playwright.
* **Standard**: A suite of "Critical Path" smoke tests must pass before any production deployment.


## 4. Test Environment & Data Management

| Component | Strategy |
| :--- | :--- |
| **Database** | Shared Cloud Development Instance (Supabase). |
| **Authentication** | Test accounts with bypass codes or dedicated test users. |
| **Payments** | Stripe API in **Test Mode** using mock cards. |
| **Media Assets** | Development bucket in Supabase Storage. |


## 5. Execution Pipeline (CI/CD Integration)

Quality gates are enforced via GitHub Actions:

1.  **Commit Stage**: Automatic execution of Linting and Type-checking.
2.  **Staging Stage**: Deployment to a Preview environment followed by:
    * Execution of the Vitest integration suite.
    * Execution of Playwright smoke tests.
    * Automated Accessibility (a11y) audit via `axe-playwright`.
3.  **Production Stage**: Deployment is authorized only upon the successful completion of all previous stages.


## 6. Defect Management & Reporting
* **Regression Policy**: When a production bug is identified, a corresponding test case must be added to the E2E suite to prevent recurrence.
* **Performance Monitoring**: Core pages (Landing, Room Details) are audited for the **< 2s loading time** requirement (NFR-02) as part of the build process.