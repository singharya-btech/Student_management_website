# Student Management System Frontend

A modern responsive Student Management System frontend built with React, Tailwind CSS, and Vite.

## Features
- Authentication page with role selection and modern glassmorphism design
- Dashboard with sidebar navigation, top navbar, stats cards, and charts
- Student management module with search, filter, pagination, and modal forms
- Course management module with course cards and action buttons
- Attendance management UI with analytics chart and checkboxes
- Fees dashboard with payment history and status badges
- Student profile page with academic summary
- Settings page with dark mode toggle and change password form
- Responsive layout for mobile, tablet, and desktop
- Axios-ready service layer and reusable component structure

## Project Structure
- `src/components/` – reusable UI components
- `src/pages/` – application pages and routes
- `src/services/` – API service configuration
- `src/assets/` – project assets

## Setup
```bash
cd "c:\Users\Varshini Lokesh\OneDrive\Desktop\student Managment system"
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Notes
- Authentication is currently mocked for UI demonstration.
- Replace sample data with real API integration through `src/services/api.js`.
- Add toast notifications or real upload handling as needed for future features.
