# Job Board Application

A MERN stack job board application where job seekers can view and apply for jobs, and recruiters can post job openings and manage applications.

---

## Table of Contents

- [Features](#features)
- [Architecture and Design Choices](#architecture-and-design-choices)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)

---

## Features

### For Job Seekers
- **User Registration/Login**: Sign up and login with email or Google OAuth.
- **View Jobs**: Search for jobs by title, location, and salary, with additional filters.
- **Apply for Jobs**: Submit applications with a cover letter and resume link.
- **Track Applications**: View the status of applications.

### For Recruiters
- **Post Jobs**: Post job openings with details like employment type, experience level, and skills required.
- **Manage Jobs**: View jobs posted by the recruiter.
- **Manage Applications**: View and update application statuses (Accepted, Rejected, Hold).
- **Add Notes**: Option to add recruiter notes for each applicant.

---

## Architecture and Design Choices

This job board application follows the MERN (MongoDB, Express, React, Node.js) stack architecture, which enables seamless frontend-backend communication, efficient handling of RESTful APIs, and real-time interactions with the database.

- **Separation of Concerns**: Divided frontend (React) and backend (Express) for scalable code management.
- **JWT Authentication**: Secured API endpoints using JSON Web Token (JWT) for user verification.
- **Google OAuth**: Google OAuth 2.0 implemented for easy registration and login.
- **Dynamic Filtering**: Implemented a Fuse.js-based fuzzy search on job titles, along with filters for salary, location, etc.
- **Data Models**: Well-structured Mongoose models for User, Job, and Application, allowing efficient and organized data storage.

---

## Technologies Used

- **Frontend**: React, Fuse.js for fuzzy search, CSS for styling.
- **Backend**: Node.js, Express, Passport.js (for Google OAuth), and bcrypt.js for password hashing.
- **Database**: MongoDB with Mongoose ORM for schema definitions.
- **Hosting**: Vercel (frontend) and Render (backend) for free, reliable hosting.

---

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/job-board-app.git
   cd job-board-app
   ```

2. **Install Dependencies**:
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Variables**:
   - Configure the following environment variables for backend and frontend as described in the next section.

4. **Start the Application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```

---

## Environment Variables

In the backend, create a `.env` file and add the following:

```plaintext
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret>
GOOGLE_CLIENT_ID=<Your Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Your Google OAuth Client Secret>
```

In the frontend, create a `.env` file and add the following:

```plaintext
REACT_APP_API_URL=http://localhost:5000
```

---

## API Documentation

### Authentication

- **POST /auth/register** - Register a new user
  - **Body**: `{ "name": "string", "email": "string", "password": "string", "role": "recruiter/job_seeker" }`

- **POST /auth/login** - Login existing user
  - **Body**: `{ "email": "string", "password": "string" }`

- **GET /auth/google** - Google OAuth login

### Jobs

- **POST /jobs** - Create a new job (Recruiter only)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ "title": "string", "description": "string", "location": "string", "salary": "number", "employmentType": "Full-Time/Part-Time/etc.", "experienceLevel": "Entry/Mid/Senior", "industry": "string", "skillsRequired": ["skill1", "skill2"], "educationLevel": "High School/Bachelor/etc.", "benefits": ["benefit1", "benefit2"], "applicationDeadline": "YYYY-MM-DD", "isRemote": true/false }`

- **GET /jobs** - Retrieve job listings
  - **Query Params**: `location, salary, experienceLevel, etc.` for filtering.

- **GET /jobs/my-jobs** - Get jobs posted by the recruiter
  - **Headers**: `Authorization: Bearer <token>`

- **GET /jobs/job-applications/:jobId** - Get applications for a job (Recruiter only)
  - **Headers**: `Authorization: Bearer <token>`

### Applications

- **POST /jobs/:id/apply** - Apply for a job (Job Seeker only)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ "coverLetter": "string", "resume": "string (URL)" }`

- **GET /jobs/applied-jobs** - Get jobs the user has applied for
  - **Headers**: `Authorization: Bearer <token>`

- **PATCH /jobs/job-applications/:applicationId/status** - Update application status (Recruiter only)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ "status": "Accepted/Rejected/Hold", "recruiterNotes": "string" }`

### Profile

- **GET /profile** - Get profile details for logged-in user
  - **Headers**: `Authorization: Bearer <token>`

---

## Frontend Setup

The React frontend is organized with components for `Home`, `JobListings`, `Profile`, `Signup`, `Login`, and `ApplyForJob`.

### Components

- **Navbar**: Dynamic based on user role and authentication state.
- **Home**: Displays a hero section, job search, and featured jobs.
- **Signup/Login**: Handles registration and authentication, with Google OAuth.
- **JobListings**: Displays job listings with filters.
- **ApplyForJob**: Form for job seekers to apply with cover letter and resume.
- **JobApplications**: For recruiters to view and manage applications for a job.

---

## Backend Setup

The Node.js/Express backend is organized with separate routes for authentication, jobs, and applications.

### Middleware

- **auth.js**: Middleware to protect routes, using JWT to validate users.
- **passport.js**: Configures Google OAuth with Passport.

### Models

- **User**: Stores user details, with separate roles for job seekers and recruiters.
- **Job**: Stores job information, including employment type, experience level, etc.
- **Application**: Tracks applications, status updates, and recruiter notes.
