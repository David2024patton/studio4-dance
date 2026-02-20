# Studio4 Dance Co Website

A comprehensive dance studio management system with parent portal, billing, and AI chat integration.

## Features

### Public Website
- Beautiful landing page with hero section
- Class schedules and descriptions
- Events and competitions calendar
- Photo gallery
- Blog section
- AI chat widget for general questions

### Parent Portal (Dashboard)
- User authentication and registration
- Account balance tracking (bank account style)
- Student enrollment management
- Upcoming events and competitions
- Transaction history
- AI chat widget with personalized context (billing, enrollments, events)

### Admin Features
- Role-based permissions (Owner, Finance, Instructor, Parent, Student)
- User management
- Class and event management
- Billing and payment processing

## Tech Stack

### Backend
- Python FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- Google Gemini AI for chat
- JWT authentication

### Frontend
- React + Vite
- Tailwind CSS
- Zustand for state management
- Lucide React icons

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+

### Quick Start

```bash
# Start the application
./start.sh
```

Or manually:

```bash
# 1. Set up PostgreSQL
sudo -u postgres createdb studio4
sudo -u postgres psql -d studio4 -f database/schema.sql

# 2. Start backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Using Docker

```bash
docker-compose up
```

## Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Project Structure

```
studio4/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic (Gemini AI)
│   │   └── main.py        # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   └── App.jsx        # Main app
│   └── package.json
├── database/
│   └── schema.sql         # PostgreSQL schema
└── research/
    └── comprehensive_research_report.md
```

## User Roles

- **Owner**: Full access to all features
- **Finance**: Access to billing and financial reports
- **Instructor**: Access to class management and student info
- **Parent**: Access to own family dashboard
- **Student**: Limited access to own classes

## License

Private project for Studio4 Dance Co.
