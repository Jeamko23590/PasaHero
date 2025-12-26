# PasaHero - Smart Driving School Management Platform

A comprehensive ERP system for driving schools featuring student enrollment, scheduling, digital records, and VR simulation integration.

## 🏗️ Architecture

```
pasahero/
├── backend/          # Laravel 11 API
│   ├── app/
│   │   ├── Models/   # Eloquent models
│   │   └── Http/Controllers/Api/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── frontend/         # React 18 + Vite
    └── src/
        ├── pages/    # Route components
        ├── components/
        └── api/      # API client
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📦 Modules

### 1. Student Enrollment
- Student registration with validation (age 18+)
- Auto-generated student IDs
- License type selection (Non-Pro, Professional, Motorcycle)
- Emergency contact & medical info tracking
- Status workflow: Pending → Enrolled → In Progress → Completed

### 2. Scheduling & Reservations
- Calendar-based scheduling (week/day views)
- Instructor availability checking
- Vehicle allocation for practical sessions
- Conflict detection for double-bookings
- Session types: Theory, Practical, VR Simulation, Exam

### 3. Digital Records
- Auto-generated certificates with QR codes
- Certificate types: Completion, Theory Exam, Practical Exam, LTO Ready
- Training progress tracking
- Downloadable/printable certificates
- Verification URLs for authenticity

### 4. VR Simulation Integration
- 8 training scenarios (beginner to advanced)
- Performance metrics tracking
- AI-powered feedback generation
- Skill radar charts
- Progress analytics

## 💡 ERP Thinking & Business Logic

### Data Relationships
- Students → Enrollments → Courses
- Enrollments → Schedules → Instructors/Vehicles
- Schedules → VR Sessions (for simulation type)
- Enrollments → Certificates

### Business Rules
- Students must be 18+ years old
- One active enrollment per student
- Instructors have daily hour limits
- Vehicles checked for availability
- Auto-progress tracking on session completion
- Certificate generation on course completion

### Payment Workflow
- Partial payments supported
- Balance tracking per enrollment
- Payment status: Pending → Partial → Paid

## 📈 Scalability Considerations

### Database
- Indexed queries on frequently filtered columns
- Soft deletes for data retention
- JSON columns for flexible metadata

### API Design
- RESTful endpoints with pagination
- Eager loading to prevent N+1 queries
- Stateless authentication ready (Sanctum)

### Frontend
- Component-based architecture
- Lazy loading ready
- Responsive design with Tailwind

## 🎨 UX Decisions

- **Dashboard First**: Quick overview of key metrics
- **Color-Coded Sessions**: Visual distinction by type
- **Progress Bars**: Clear completion tracking
- **Modal Forms**: Non-disruptive data entry
- **Badge System**: Status at a glance
- **Calendar View**: Intuitive scheduling
- **Radar Charts**: Skill visualization for VR

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Dashboard stats |
| GET/POST | /api/students | List/Create students |
| GET/PUT/DELETE | /api/students/{id} | Student CRUD |
| GET/POST | /api/enrollments | List/Create enrollments |
| POST | /api/enrollments/{id}/payment | Add payment |
| GET/POST | /api/schedules | List/Create schedules |
| GET | /api/available-slots | Check availability |
| GET | /api/vr/scenarios | List VR scenarios |
| POST | /api/vr/sessions | Record VR session |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Recharts, Lucide Icons
- **Backend**: Laravel 11, Sanctum, Eloquent ORM
- **Database**: MySQL/PostgreSQL
