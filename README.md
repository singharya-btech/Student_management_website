<img width="1919" height="1071" alt="Screenshot 2026-06-01 205630" src="https://github.com/user-attachments/assets/b8cd20dd-ca10-40ee-a27f-07c7aea20da9" />

# Student Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) based Student Management System deployed using Docker on AWS EC2.

## Features

- Student Registration & Login
- Admin Dashboard
- Course Management
- Attendance Tracking
- Fee Management
- JWT Authentication
- Role-Based Access Control
- Responsive UI
- Dockerized Deployment
- AWS Cloud Hosting

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB

### DevOps
- Docker
- Docker Compose
- Docker Swarm
- AWS EC2
- GitHub

---

## Folder Structure

```bash
student-management-system/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/student-management-system.git
```

### Go To Project Folder

```bash
cd student-management-system
```

---

## Environment Variables

Create `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## Run Project Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

# Docker Setup

## Build Containers

```bash
docker-compose build
```

## Run Containers

```bash
docker-compose up -d
```

## Stop Containers

```bash
docker-compose down
```

---

# AWS Deployment

This project is deployed on AWS EC2 using Docker containers.

### Open Ports

| Port | Purpose |
|------|----------|
| 3000 | Frontend |
| 5000 | Backend API |
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |

---

# Authentication

- JWT Based Authentication
- Protected Routes
- Role-Based Access

---

# Screenshots

## Login Page

![Uploading Screenshot 2026-06-01 205630.png…]()


---

# Future Improvements

- Payment Gateway
- Email Verification
- Mobile App
- AI Analytics
- Notification System

---

# Contributing

```bash
git checkout -b feature-name
git commit -m "Added new feature"
git push origin feature-name
```

---

# License

MIT License

---

# Developer

Arya Prakash Singh

---


# Team Leader
Ujjwal Mandal
# Support

If you like this project, give it a ⭐ on GitHub.
