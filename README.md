# 🛎️ B&B Booking Platform
> **A modular booking engine and management system for independent hospitality owners.**

[![Status: Active Development](https://img.shields.io/badge/Status-In_Progress-success?style=for-the-badge)]()
[![Architecture: White-Label_Ready](https://img.shields.io/badge/Architecture-White--Label_Ready-blueviolet?style=for-the-badge)]()


## 💡 Project Overview
**B&B Booking Platform** is a specialized solution designed to handle the core operations of small hospitality structures. The project focuses on providing a failure-resilient booking flow, real-time calendar synchronization (iCal), and an intuitive administrative interface for non-technical hosts.

The system is built with a **White-Label approach**, allowing the core logic to remain constant while the frontend appearance can be fully customized for different brands or styles.

## 📍 Current status

What is deployed today is **not yet the booking engine described above**. It is the public site for the first property, *Il Respiro del Borgo* in Montemagno (AT):

- a five-language brochure site (IT, EN, DE, FR, ES) — property, grounds, services, contact;
- an enquiry form that validates, emails the host, acknowledges the guest in their own language, and stores the enquiry in PostgreSQL;
- a first-party cookie consent layer, with the Google Maps embed loaded only after consent;
- first-party, cookieless usage statistics — no vendor, no banner category, nothing stored on the visitor's device;
- published privacy, cookie and terms pages, plus an automatic anonymisation job.

Not built: availability search, payments, the host dashboard, iCal sync, authentication, and messaging. `docs/Requirements.md` marks every requirement ✅ shipped or ⚪ planned, and `docs/Data Architecture.md` separates the three tables that exist from the schema that does not.

## 🗺️ Documentation

| Module | Content | Link |
| :--- | :--- | :---: |
| **User Analysis** | Target personas, user stories & market needs | [View Docs ↗](./docs/User%20Personas%20&%20User%20Stories.md) |
| **Requirements** | Functional & non-functional specs, with build status | [View Docs ↗](./docs/Requirements.md) |
| **Data Architecture** | Implemented tables, the planned booking schema, retention | [View Docs ↗](./docs/Data%20Architecture.md) |
| **Tech Stack & Tools** | Frameworks, tools & service integrations | [View Docs ↗](./docs/Tech%20Stack%20&%20Tools.md) |
| **Deployment Strategy** | Environments, migrations, quality gates, scheduled jobs | [View Docs ↗](./docs/Deployment%20Strategy.md) |
| **Testing Strategy** | Intended test levels and tooling — *not yet implemented* | [View Docs ↗](./docs/Testing%20Strategy.md) |
| **Privacy & Data Processing** | Record of processing, processors, retention, cookie inventory | [View Docs ↗](./docs/Privacy%20&%20Data%20Processing.md) |

Setup and day-to-day commands live in [`src/README.md`](./src/README.md) — the npm project root is `src/`, not this directory.

## ⚙️ Getting Started

**Prerequisites:** Node.js 22+, and PostgreSQL 17 if you want persistence locally (the site runs without it).

```bash
git clone https://github.com/EliaFerraro/bnb-booking-platform.git
cd bnb-booking-platform/src     # the npm project root is src/

npm install
cp .env.example .env.local      # fill in SMTP_USER and SMTP_APP_PASSWORD

npm run db:bootstrap            # optional: creates the local database
npm run db:migrate              # optional: applies the schema
npm run dev
```

Leaving `DATABASE_URL` unset is supported: the site runs and enquiries are still emailed, they are simply not stored. See [`src/README.md`](./src/README.md) for the full command reference.

<br>
<br>
<br> 
👨‍💻 Author
Elia Ferraro - Web Developer

Building scalable solutions where technical precision meets user-centered design.