# Deployment Strategy

This document outlines the deployment pipeline, infrastructure, and environment management for the B&B Booking Platform. The goal is to ensure a reliable, scalable, and automated flow from local development to production.

## 1. Environment Strategy

We adopt a multi-environment approach to isolate development changes from the live production system.

| Environment | Purpose | Infrastructure | Database/Storage |
| :--- | :--- | :--- | :--- |
| **Development** | Feature development and local testing. | Localhost | Supabase Cloud (Dev Project) |
| **Staging/Preview** | PR previews and integration testing. | Netlify/Vercel Previews | Supabase Cloud (Dev Project) |
| **Production** | Live system for real guests and hosts. | Netlify/Vercel Production | Supabase Cloud (Prod Project) |


## 2. Database & Assets Strategy (Supabase)

To maintain a "Cloud-First" approach and ensure the reliability of URLs and integrations (Stripe, OAuth), we use Supabase Cloud for all stages.

### 2.1 Database Management
* **Schema Migrations**: Even though we use the cloud, the schema is managed via the **Supabase CLI**. No manual changes are made in the Production Dashboard.
* **Syncing**: Migrations are version-controlled in the `/supabase/migrations` folder.
* **Transaction Integrity**: Postgres triggers and RLS (Row Level Security) are used to enforce business rules (e.g., the 10-minute mutex) at the database level.

### 2.2 Asset Storage (Development vs Production)
* **Development/Staging**: Assets are uploaded to a `development` bucket in the Supabase Dev project. This allows testing of image optimization and Zod validation with real URLs.
* **Production**: Assets are stored in the `production` bucket. 
* **Optimization**: All images must be processed (WebP format, resized) before or during upload to comply with **NFR-02** (Loading speed < 2s).


## 3. CI/CD Pipeline

The deployment flow is triggered by Git events on the GitHub repository.

1.  **Branching Model**: 
    * `feature/*` branches for new tasks.
    * `main` branch for production-ready code.
2.  **Continuous Integration (CI)**:
    * Run **Vitest** for unit tests.
    * Run **Linter** (ESLint) and **Type Check** (TypeScript).
    * Build check to ensure Next.js compilation success.
3.  **Continuous Deployment (CD)**:
    * **Preview Deploys**: Every Pull Request generates a unique preview URL.
    * **Production Deploy**: Merging into `main` triggers an automatic deployment to the production environment.

## 4. Observability & Maintenance

* **Logging**: Use of Supabase Logs and platform-specific logs (Netlify/Vercel) to monitor API errors.
* **Backups**: 
    * **Database**: Daily automated backups via Supabase.
    * **Assets**: Critical assets (Welcome Kits) are mirrored or versioned.
* **State Monitoring**: Monitoring of the `BOOKINGS` table for stuck `pending_payment` states that failed to clear.

## 5. White-Label Rebranding Scalability

To support future "White-Label" versions:
* **Environment Variables**: Brand-specific configurations (Colors, SEO tags, Stripe Keys) are stored as ENV variables.
* **Multi-tenant potential**: The infrastructure is prepared to be cloned into a new Supabase/Netlify project pairing for a different property with minimal config changes.