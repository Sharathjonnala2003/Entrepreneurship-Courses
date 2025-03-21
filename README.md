# Entrepreneurship Courses Web Application

A modern web application for entrepreneurship courses built with React, Node.js, Express, and SQLite3.

## Features

- Modern, responsive UI design
- Browse courses by category
- Course details and enrollment
- User authentication (login/signup)
- Admin dashboard for course management
- RESTful API with Express
- SQLite3 database for persistence

## Tech Stack

- **Frontend**: React, React Router, Axios, Styled Components, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation and Setup

1. Clone the repository
2. Install dependencies for all parts of the project:

```bash
npm run install-all
```

3. Set up the database and create initial admin user:

```bash
npm run setup-db
```

This will create the SQLite database with tables and a default admin user with these credentials:
- Email: admin@example.com
- Password: admin123

### Development

To run both the client and server in development mode:

```bash
npm run dev
```

- The client will run on http://localhost:5173
- The server will run on http://localhost:5000

### Production

To build the client for production:

```bash
npm run build
```

To start the server in production mode:

```bash
npm start
```

## Project Structure

```
entrepreneurship-courses/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React components and styles
│       ├── components/   # Reusable components
│       └── pages/        # Page components
├── server/               # Backend Express server
│   ├── db/               # SQLite database
│   └── routes/           # API routes
└── README.md             # Project documentation
```

## API Endpoints

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `POST /api/courses` - Create a new course (admin only)
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
