# Social Proof & Urgency Features - Backend Implementation Guide

## 🎯 Overview
This document outlines the backend requirements for implementing the Social Proof and Urgency/Scarcity features that are currently parked using feature flags.

## 📊 Social Proof Features

### Database Schema Requirements

#### 1. Reviews/Ratings Table
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listing(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
```

#### 2. Community Members Table
```sql
CREATE TABLE community_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    display_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_community_members_active ON community_members(is_active);
CREATE INDEX idx_community_members_last_active ON community_members(last_active);
```

#### 3. Business Statistics Table
```sql
CREATE TABLE business_stats (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listing(id) ON DELETE CASCADE,
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    total_bookings INTEGER DEFAULT 0,
    years_in_business INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(listing_id)
);

-- Indexes
CREATE INDEX idx_business_stats_listing_id ON business_stats(listing_id);
CREATE INDEX idx_business_stats_rating ON business_stats(average_rating);
```

### API Endpoints Required

#### 1. Get Business Reviews
```javascript
// GET /api/listings/[id]/reviews
{
  "reviews": [
    {
      "id": 1,
      "rating": 4.8,
      "review_text": "Excellent service!",
      "user_name": "John D.",
      "created_at": "2024-01-15T10:30:00Z",
      "is_verified": true
    }
  ],
  "summary": {
    "total_reviews": 50,
    "average_rating": 4.9,
    "rating_breakdown": {
      "5": 40,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
}
```

#### 2. Get Community Members
```javascript
// GET /api/community/members
{
  "members": [
    {
      "id": 1,
      "display_name": "Alice",
      "avatar_url": "https://...",
      "last_active": "2024-01-15T10:30:00Z"
    }
  ],
  "total_active": 15
}
```

## ⚡ Urgency/Scarcity Features

### Database Schema Requirements

#### 1. Availability Slots Table
```sql
CREATE TABLE availability_slots (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listing(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_capacity INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(listing_id, date, time_slot)
);

-- Indexes
CREATE INDEX idx_availability_listing_date ON availability_slots(listing_id, date);
CREATE INDEX idx_availability_available ON availability_slots(is_available);
```

#### 2. Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listing(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES availability_slots(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### API Endpoints Required

#### 1. Get Availability Status
```javascript
// GET /api/listings/[id]/availability
{
  "availability": {
    "this_week": {
      "total_slots": 20,
      "available_slots": 3,
      "booked_slots": 17,
      "percentage_full": 85
    },
    "next_week": {
      "total_slots": 20,
      "available_slots": 15,
      "booked_slots": 5,
      "percentage_full": 25
    }
  },
  "urgency_level": "high", // low, medium, high
  "message": "Only 3 spots left for this week"
}
```

#### 2. Create Booking
```javascript
// POST /api/bookings
{
  "listing_id": 123,
  "booking_date": "2024-01-20",
  "booking_time": "14:00:00"
}

// Response
{
  "booking_id": 456,
  "status": "pending",
  "confirmation_code": "ABC123",
  "message": "Booking request submitted successfully"
}
```

## 🔧 Implementation Steps

### Phase 1: Database Setup
1. Create the database tables above
2. Set up proper indexes for performance
3. Create database triggers for automatic stats updates

### Phase 2: API Development
1. Implement review/rating endpoints
2. Implement availability tracking endpoints
3. Add proper error handling and validation

### Phase 3: Frontend Integration
1. Update feature flags to enable features
2. Connect frontend to new API endpoints
3. Add real-time updates using WebSockets or polling

### Phase 4: Advanced Features
1. Real-time availability updates
2. Push notifications for availability changes
3. Dynamic pricing based on demand
4. Advanced analytics and reporting

## 🚀 How to Enable Features

### Quick Enable (All Features)
```javascript
// In lib/feature-flags.js
export const FEATURE_FLAGS = {
  SOCIAL_PROOF_SECTION: true,
  COMMUNITY_AVATARS: true,
  RATING_DISPLAY: true,
  REVIEW_COUNT: true,
  URGENCY_SECTION: true,
  SPOT_COUNTDOWN: true,
  BOOKING_CTA: true,
  // ... other flags
}
```

### Gradual Rollout
```javascript
// Enable one feature at a time
export const FEATURE_FLAGS = {
  SOCIAL_PROOF_SECTION: true,  // Start with this
  COMMUNITY_AVATARS: false,   // Enable later
  RATING_DISPLAY: false,       // Enable later
  // ... etc
}
```

## 📝 Notes
- All features are currently disabled by default
- Features can be enabled individually for testing
- Backend data should be populated before enabling features
- Consider A/B testing different configurations
- Monitor performance impact when enabling features
