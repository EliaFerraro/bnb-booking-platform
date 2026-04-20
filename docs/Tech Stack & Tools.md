# Tech stack & Tools
This file contains the list of all  frameworks, languages and tools adopted during the lifecycle of the **B&B Booking Platform** project, from the initial architecture planning to the deployment and maintenance, together with the reasons they have been choosen among competitors. The stack has been selected to ensure high performance, type safety, and a modular architecture that supports "White-Label" rebranding.

## 💻 Core Development Stack
The foundation of the project relies on modern web technologies to ensure a robust developer experience and a maintainable codebase.

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 | Best-in-class SEO, SSR for fast room listings, and optimized image handling. |
| **Language** | TypeScript | Strict typing to prevent runtime errors in complex booking logic. |
| **Styling** | Tailwind CSS | Utility-first approach for rapid UI development and easy theme customization (Theming). |
| **State Management** | TanStack Query & React Context | Dedicated to server-state management, caching, and synchronization to ensure a seamless UI when fetching room availability and booking data and used for lightweight global UI state (e.g., authentication status and localization) |

## 🗄️ Backend & Infrastructure
The backend is designed to handle transactional integrity, specifically to manage availability and prevent overbookings.

* **Database:** PostgreSQL (via Supabase) – Chosen for relational integrity and support for atomic transactions (both in development and production).
* **Authentication:** Supabase Auth – Handling OAuth 2.0 (Google Login) for both Guests and Hosts.
* **Data Validation:** Zod - Schema validation for end-to-end type safety; ensures API responses and form inputs match TypeScript interfaces at runtime.
* **Storage:** Supabase Storage – Optimized hosting for high-resolution property and room photos.
* **Payments:** Stripe API – The industry standard for secure, failure-resilient payment processing.


## 🔄 Integrations & Services
* **iCal Synchronization:** node-ical – Parsing and syncing external calendar feeds from OTAs (Airbnb, Booking.com).
* **Notifications:** Resend – Automated transactional emails for booking confirmations and Welcome Kits.
* **Maps:** Leaflet – Lightweight library, standard for maps and POIs.

## 🛠️ Dev Tools & DevOps
Tools used to maintain code quality and streamline the development-to-production pipeline.

* **Version Control:** Git & GitHub
* **Deployment:** Netlify or SelfHosting or Cloudflare (still TBD) – For seamless CI/CD and edge performance.
* **Testing:** Vitest, Playwright and axeDevTools – Ensuring the booking flow works across all devices for APIs and E2E, also for accessibility.


## 🎨 Design & Prototyping
* **Figma:** Used for UI/UX wireframing and defining the design system tokens (colors, typography).