# Smart Community Issue Intelligence System with Real-Time Engagement

A full-stack MERN civic platform for reporting community problems, crowd-prioritizing them with intelligent scoring, and driving local engagement through comments, upvotes, notifications, and analytics.

## Features

- JWT authentication with secure password hashing
- Issue management with category, status, location, and optional image upload
- Community interactions (single upvote per user and issue comments)
- Intelligent priority scoring:
  - `priorityScore = (upvotes * 2) + commentCount + timeFactor`
  - `timeFactor` increases over time for unresolved issues
- Notification system:
  - New issue notifications for nearby/all users
  - Threshold alerts when upvotes cross a configured value
  - Comment alerts for issue owners
- Analytics dashboard:
  - Total, pending, in-progress, and resolved issue counts
  - Category distribution charts
  - High-priority issue spotlight
- Search and filtering by category/status/keywords
- Responsive modern UI with card layout and notification bell dropdown
- Right-side navigation sidebar for authenticated users

## Project Structure

```text
smart-community-issue-intelligence-system/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx (new)
│   │   │   ├── IssueCard.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── seed.js
├── package.json
└── README.md
```

## Recent Updates

### UI Navigation Improvements
- **Right-Side Sidebar Navigation**: Added a dedicated sidebar component that displays on the right side of the application
  - Shows "Report Issue" and "Dashboard" links for authenticated users only
  - Features smooth hover and active states with teal highlight color
  - Responsive design: converts to horizontal layout on mobile devices
  - Width: 220px on desktop with left border separator

### Navigation Bar Restructure
- **Simplified Navbar**: Kept only "Home" link in the main navigation bar
- **Sidebar Integration**: Moved "Report Issue" and "Dashboard" navigation to the new right-side sidebar for better organization
- **Maintained Features**: Notification bell, user chip, and logout button remain in the navbar

### Layout Architecture
- **App Layout Component**: Introduced `.app-layout` flex container to accommodate the new sidebar
- **Main Shell**: Central content area now properly sized to allow sidebar display
- **Responsive Container**: App layout adapts to different screen sizes

### Dashboard Analytics Chart Enhancements
- **Improved Category Chart**: 
  - Category data displayed as grouped bars with individual colors for each category
  - Five distinct colors: Infrastructure (teal), Sanitation (orange), Utilities (blue), Safety (red), Community (green)
  - Legend displays all 5 categories for easy reference
  - Y-axis shows integer values (1, 2, 3...) instead of decimals
  - Rounded bar corners for modern appearance

### CSS Updates
```css
/* Sidebar styling */
.app-layout {
  display: flex;
  gap: 0;
}

.sidebar {
  width: 220px;
  padding: 1.5rem 1rem;
  border-left: 1px solid rgba(15, 118, 110, 0.12);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background: rgba(15, 118, 110, 0.1);
  color: var(--primary);
}

.sidebar-link.active {
  background: rgba(15, 118, 110, 0.15);
  color: var(--primary);
}

/* Responsive sidebar */
@media (max-width: 760px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(15, 118, 110, 0.12);
    padding: 1rem;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 1rem;
  }
}
```

## Environment Setup

1. Copy env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Update required values:
- `server/.env`:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL`
- `client/.env`:
  - `VITE_API_URL`
  - `VITE_ASSET_URL`

## Install and Run

From project root:

```bash
npm run install:all
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Sample Data

Run from `server` folder:

```bash
npm run seed
```

Sample login after seed:
- `aarav@example.com`
- `Password123`

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Issues
- `POST /api/issues` (auth, optional image)
- `GET /api/issues`
- `GET /api/issues/:id`
- `PATCH /api/issues/:id/status` (auth)

### Interactions
- `POST /api/issues/:id/upvote` (auth)
- `POST /api/issues/:id/comment` (auth)

### Notifications
- `GET /api/notifications` (auth)
- `POST /api/notifications` (auth)
- `PATCH /api/notifications/:id/read` (auth)
- `PATCH /api/notifications/read-all` (auth)

### Analytics
- `GET /api/analytics` (auth)

## Tech Stack

- Frontend: React + Vite + React Router + Axios + Chart.js
- Backend: Node.js + Express + MongoDB + Mongoose
- Security/ops: JWT, bcryptjs, helmet, rate limiting, CORS
- Uploads: Multer

