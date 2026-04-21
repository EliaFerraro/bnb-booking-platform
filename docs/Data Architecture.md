# Data Architecture

This document defines the data models, database schema, and entity relationships for the platform. The architecture is designed to be relational, ensuring transactional integrity (ACID) and scalability for future "White-Label" implementations.

## 1 Database Schema

### 1.1 Identity Module
Manages authentication and user roles.

#### Users
Stores information for both Guests and Hosts.

```sql
USERS (
    UUID id PRIMARY KEY,
    String first_name,
    String last_name,
    String email UNIQUE,
    Enum role, -- ['guest', 'host', 'admin']
    Timestamp created_at,
    Timestamp last_access_at
)
```

### 1.2 Inventory & CMS Module
Defines the properties (rooms) and their multimedia assets.

#### Rooms
The core entity representing the stay options.

```sql
ROOMS (
    UUID id PRIMARY KEY,
    String name,
    Text description,
    Decimal base_price,
    Integer max_guests,
    JSONB amenities, -- List of features (e.g., ["WiFi", "AC", "Kitchen"])
    Timestamp updated_at
)
```

#### Rooms_Amenities
The amenities that each room can have

```sql
AMENITIES (
    UUID id PRIMARY KEY,
    String name, -- es. "WiFi", "Parking", "Breakfast"
    String icon_slug -- es. "wifi-icon", "car-icon" for frontend 
)
```

#### Room_Images
Handles the "Categorized Media Gallery" requirement (FR-02).

```sql
ROOM_IMAGES (
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    String url,
    Enum category, -- ['bedroom', 'bathroom', 'common', 'outdoor']
    Boolean is_primary, -- True for the main listing photo
    Integer display_order
)
```

### 1.3 Booking & Transactional Module
Manages the lifecycle of a reservation and the 10-minute "Concurrency Guard" (FR-19).

#### Bookings
```sql
BOOKINGS (
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    UUID user_id FK -> USERS(id),
    Date check_in,
    Date check_out,
    Decimal total_price,
    Enum status, -- ['pending_payment', 'confirmed', 'cancelled', 'completed']
    Timestamp expires_at, -- For Mutex: expires after 10 mins if status is 'pending_payment'
    Text guest_notes,
    Timestamp created_at
)
```

#### Payments
Records transactional data via Stripe (FR-05).

```sql
PAYMENTS (
    UUID id PRIMARY KEY,
    UUID booking_id FK -> BOOKINGS(id),
    String stripe_payment_intent_id,
    Decimal amount,
    String currency,
    Enum status, -- ['succeeded', 'failed', 'processing', 'refunded']
    Timestamp created_at
)
```

### 1.4 Availability & Sync Module
Handles iCal synchronization (FR-11) and Dynamic Pricing (FR-12).

#### Availability_Overrides
Used to block dates from external calendars (Airbnb/Booking.com) or manual host actions.

```sql
AVAILABILITY_OVERRIDES (
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    Date date, -- Single date entry (e.g., '2026-05-20')
    Enum source, -- ['manual_host', 'ical_airbnb', 'ical_booking', 'maintenance']
    String notes, -- Optional: "Cleaning", "Airbnb reservation", etc.
    Timestamp created_at
)
```

#### Pricing_Rules
Manages seasonal prices and stay constraints (FR-13).

```sql
PRICING_RULES (
    UUID id PRIMARY KEY,
    UUID room_id FK -> ROOMS(id),
    Date start_date,
    Date end_date,
    Decimal price_modifier, -- Overrides ROOMS.base_price
    Integer min_stay, -- e.g., 2 for weekends
    String label -- e.g., 'Summer Season'
)
```

### 1.5 Communication Module
Supports host-guest interaction (FR-17) with a Whatsapp-like experience.

#### Conversations
```sql
CONVERSATIONS (
    UUID id PRIMARY KEY,
    UUID guest_id FK -> USERS(id),
    UUID host_id FK -> USERS(id),
    Timestamp created_at,
    Timestamp last_message_at
)
```

#### Messages
```sql
MESSAGES (
    UUID id PRIMARY KEY,
    UUID conversation_id FK -> CONVERSATIONS(id),
    UUID sender_id FK -> USERS(id),
    Text content,
    Timestamp sent_at,
    Boolean is_read
)
```

## 2 Entity Relationships
Users to Bookings (1:N): A guest can have multiple reservations.

Rooms to Bookings (1:N): A room can be booked many times, but never on overlapping dates.

Rooms to Room_Amenities (1:N): A room can have many amenities and an amenity can be in many rooms.

Rooms to Room_Images (1:N): Supports the categorized gallery and visual identification.

Bookings to Payments (1:1/N): A booking typically has one successful payment, but can have multiple failed attempts.

Bookings to Messages (1:N): All communication is contextualized within a specific booking.

## 3 Business Logic Implementation
Concurrency Guard (Mutex): When a guest enters the checkout flow, a BOOKING record is created with status: 'pending_payment'. Any search query for availability must filter out dates where a booking is either confirmed OR pending_payment with an expires_at timestamp in the future.

iCal Integration: The synchronization worker updates the AVAILABILITY_OVERRIDES table. If a date is blocked in the override table, it is removed from the Availability Search Engine.