# Document Access Control System

A full-stack Document Access Control System built with React, Node.js, Express, MongoDB, JWT, bcrypt, multer, and dotenv.

## Overview

This system supports two roles: `USER` and `ADMIN`.

- Users can register, login, view available documents, request access, and download approved documents.
- Admins can login, upload documents, manage documents, and approve or reject access requests.

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Security: JWT, bcrypt
- File uploads: multer
- Environment variables: dotenv

## Project Structure

- `backend/` - Express API with auth, document, and access request routes
- `frontend/` - React application with protected routes and role-based dashboards

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Documents
- `GET /api/documents` - List documents (authenticated)
- `POST /api/documents` - Upload document (admin only)
- `PUT /api/documents/:id` - Update document metadata (admin only)
- `DELETE /api/documents/:id` - Delete a document (admin only)
- `GET /api/documents/:id/download` - Download approved document (authenticated)

### Access Requests
- `POST /api/requests` - Request access to a document (user only)
- `GET /api/requests` - Get access requests for current user or all requests for admin
- `PATCH /api/requests/:id/approve` - Approve a request (admin only)
- `PATCH /api/requests/:id/reject` - Reject a request (admin only)

## Database Schema

### User
- `name`: string
- `email`: string
- `password`: string (hashed)
- `role`: `USER` or `ADMIN`

### Document
- `title`: string
- `description`: string
- `filePath`: string
- `uploadedBy`: reference to User
- `createdAt`: date

### AccessRequest
- `userId`: reference to User
- `documentId`: reference to Document
- `status`: `PENDING`, `APPROVED`, or `REJECTED`
- `requestedAt`: date
- `updatedAt`: date

## Setup Instructions

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` based on `.env.example`.

3. Start backend server:

```bash
npm run dev
```

4. Create the first admin user:

```bash
npm run seed-admin
```

This will create an admin account using `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` from `.env` if set, or defaults to `admin@example.com` / `Admin123!`.

5. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

5. Start frontend app:

```bash
npm start
```

## Deployment

- Deploy the backend to a Node-compatible host (Heroku, Render, Vercel serverless function, etc.)
- Deploy the frontend to a React host (Netlify, Vercel, GitHub Pages, etc.)
- Configure `REACT_APP_API_URL` in `.env` for production API URL.

## Notes

- JWT-based authentication protects both frontend routes and backend APIs.
- Documents can only be downloaded by users with approved access requests.
- Admins manage file uploads and access request decisions.
