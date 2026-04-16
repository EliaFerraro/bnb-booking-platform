# User Personas & User Stories

This document defines the core users and user stories for the "Il Respiro del Borgo" platform. Our mission is to digitize an authentic, 1950s "Nonna's Style" rural hospitality experience. By focusing on real-world travelers (wine lovers, event-goers, and road-trippers) and the specific operational constraints of a part-time host, we ensure high technical performance and failure-resilient flows without losing the human, authentic touch that defines the brand.

<br>

## 1. User Personas
Understanding the "who" is critical to defining the "how". These personas represent the pillars of the "Il Respiro del Borgo" ecosystem.
Personas are living documents designed to foster empathy and streamline user-centered design.

### Lisa & Klaus: "The Practical Explorers"
> "We want an authentic stay that is easy to reach, clean, and close to a good bottle of Barbera."
* **Context:** 45-60 years old, Swiss/German/Dutch. Well-off, grounded, often traveling by car (SUV/Tesla) or e-bike.
* **Behavioral pattern:** Road-tripping to Southern Italy or visiting Monferrato for wine/food tourism.
* **Friction & Risks:** Low tolerance for digital bugs; if a payment fails once, they will call a travel agent or use a known platform. They struggle with complex nested menus.
* **Needs:** Instant access to availability and high-quality visual confirmation that "vintage" means "spotless and charming."
* **Business Value:** High-intent leads; they value authenticity over luxury and pay a fair price for a unique experience.

### Marco & Giulia: "The Short-Term Guest"
> "I'm here for a wedding/event nearby. I just need a clean, unique place to sleep for one night."
* **Context:** 35+ years old, often Italian or European. Attending local events (weddings, festivals, concerts). They arrive late, leave early, and prioritize utility.
* **Behavioral pattern:** Very fast booking. Needs a simple hint to find the location and check-in instructions.
* **Friction & Risks:** Extremely high friction sensitivity. If the site takes >5s to load on a country road, they drop off. They expect 'Apple Pay' speed.
* **Needs:** A frictionless, fast booking process. Clear, "one-tap" access to location and check-in instructions.
* **Business Value:** Crucial for filling one-night gaps in the calendar, especially during weekends.

### Ben: "The Comparison Shopper"
> "Why should I book here instead of Airbnb or Booking.com?"
* **Context:** A 30–55-year-old European traveler who is actively comparing multiple platforms and accommodations before making a decision.
* **Behavioral pattern:** He opens several tabs, scans photos, prices, and reviews, and switches between platforms to validate the best option.
* **Friction & Risks:** He drops off immediately if trust signals, pricing clarity, or perceived value are weaker than competitors.
* **Needs:** Clear differentiation, transparent pricing, strong visual proof, and immediate reassurance that this is a better or more authentic choice.
* **Business Value:** He represents high-conversion potential if convinced, but also high drop-off risk if the platform fails to compete with industry standards.

### Margherita: "The Weekend Social Host"
> "I love meeting new people, but only when I have the time. I need to manage my B&B between school lessons and my free time."
* **Context:** 60-year-old teacher, passionate about social interaction. Operates in March–October, primarily weekends. Multitasking between school and home life.
* **Behavioral pattern:** Technology is not so easy, but it is crucial for this kind of projects.
* **Friction & Risks:** Fear of 'breaking the system.' If she receives a double-booking due to sync lag, she will stop using the platform entirely.
* **Needs:** A "Central Info Point" to see availability (including Airbnb/Booking data). Tools for instant price quotes during phone calls.
* **Business Value:** Operational sanity. Turning fragmented management into a streamlined, professional process.

<br>

## 2.User Stories
After defining our primary user personas, this section outlines their respective User Stories. These stories illustrate key interactions with the platform, highlighting the underlying needs and the specific value each functionality provides.

### 2.1 Guests
| US-N      | Notes         | Priority | Story Points |
| -------- | ------- | --------:| -------: |
| US-001  | As a **Guest**, I want to access all important information about the structure and its position so that I can decide if it is good for me | 100 | 3 |
| US-002  | As a **Guest**, I want to explore a photo gallery grouped by area, so that I can quickly understand the style of the apartment  | 95 | 5 |
| US-003  | As a **Guest**, I want to check rooms availability by dates, so that I can know if the structure can guest me when I need   | 95 | 8 |
| US-004  | As a **Guest**, I want to book a room for a specific date range adding a brief note describing my trip, so that I can have the permission to stay in the structure | 90 | 5 |
| US-005  | As a **Guest**, I want to pay in the app with immediate failure feedback and retry options so that I can forget about money during the trip | 85 | 13 |
| US-006  | As a **Guest**, I want to send a message to the host, so that I can ask for additional information   | 70 | 8 |
| US-007  | As a **Guest**, I want to receive a confirmation or an alert about the result of my booking and a welcome kit/check-in instructions so that I can easily find useful information in a few instants | 80 | 3 |
| US-008  | As a **Guest**, I want to log in with Google, so that I can use my known password instead of creating a new one | 60 | 3 |
| US-009  | As a **Guest**, I want to access the webapp on mobile devices so that I can book my trip on the fly | 90 | 8 |
| US-010  | As a **Guest**, I want to see a map with the main attractions of the area, so that I can schedule my vacation before | 40 | 5 |
| US-011  | As a **Guest**, I want to read verified guest reviews and clear cancellation policies to build trust, so that I have an objective idea about the structure |100 | 3 |
| US-012  | As a **Guest**, I want to access offline-cached check-in instructions in case of poor rural signal | 85 | 5 |
| US-013  | As a **Guest**, I want to have online fast check-in so that I can skip this phase during my vacation | 85 | 5 |

### 2.2 Host
| US-N      | Notes         | Priority | Story Points |
| -------- | ------- | --------:| ------- |
| US-014  | As a **Host**, I want to see the list of the booking requests so that I can approve or discard them   | 100 | 5 |
| US-015  | As a **Host**, I want to automatically synch calendar dates already taken from other platforms such as Booking and AirBnb (through iCal) | 100 | 13 |
| US-016  | As a **Host**, I want to send a message to the guest or respond to them so that I can communicate and negotiate with them  | 70 | 8 |
| US-017  | As a **Host**, I want to manage the calendar of open dates and closed dates so that guest can bookonly choosen dates  | 90 | 5 |
| US-018  | As a **Host**, I want to edit the price for each room both for guests number and date period (high/low season) | 85 | 8 |
| US-019  | As a **Host**, I want to edit the minimum number of nights for staying for each date range or periodically (eg. in weekends) | 75 | 5 |
| US-020  | As a **Host**, I want to share the booking offer (preventivo) with a single click so that the experience is more professional | 80 | 5 |
| US-021  | As a **Host**, I want to receive an alert if I have not answered to a request before its arrival date  | 60 | 3 | 
| US-022  | As a **Host**, I want to manage the list of my rooms so that I can edit photos and details for each of them  | 50 | 5 |
| US-023  | As a **Host**, I want to mark a booking as paid, so that I can track booking status | 40 | 3 |
| US-024  | As a **Host**, I want to see a dashboard of all bookings and earnings so that I can take future proof decisions | 40 | 3 |
| US-025  | As a **Host**, I want to receive email messages when guests book a room or whenever they perform a relevant operation | 80 | 8 |
| US-026  | As a **Host**, I want to manualy resolve overbookings across different platforms, by deleting one of the booking | 40 | 8 |