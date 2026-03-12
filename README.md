# Smart Document Classifier – Frontend

This repository contains the **React + TypeScript frontend** for the Smart Document Classifier platform.

The frontend provides a modern **SaaS-style dashboard** for uploading documents, viewing classification results, and tracking document history.

---

# Features

### User Authentication

* User login and registration
* Secure authentication using JWT tokens
* Role-based UI (Admin/User)

### Document Upload

* Upload PDF documents
* Real-time classification results
* Confidence score display

### Dashboard

* View document statistics
* Recent classification activity
* Quick upload access

### Classification History

* View previously uploaded documents
* Search and filter results
* View prediction metrics

### Admin Dashboard

Admin users can access:

* System analytics
* User activity
* Model performance metrics

---

# Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **TailwindCSS**
* **shadcn/ui**
* **React Query**
* **Wouter (Routing)**
* **Lucide React Icons**

---

# Project Structure

```
client
│
├── public/
│
├── src/
│   ├── app/              # App configuration
│   ├── components/       # UI components
│   ├── context/          # Auth context
│   ├── pages/            # Application pages
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

# Setup Instructions

## 1 Install Dependencies

```bash
npm install
```

---

## 2 Configure Environment Variables

Create a `.env` file in the root of the frontend project.

Example:

```env
VITE_API_URL=http://localhost:8000
```

The frontend will communicate with the backend API using this URL.

---

## 3 Run Development Server

```bash
npm run dev
```

The application will start at:

```
http://localhost:5173
```

---

# Backend Requirement

This frontend requires the backend API to be running.

Backend repository:

```
smart-document-classifier-backend
```

Start backend server:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

# API Integration

The frontend communicates with the backend using REST API endpoints.

Example endpoints:

```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/classify
GET  /api/v1/classify/status/{job_id}
GET  /api/v1/history
```

---

# Building for Production

To build the frontend for production:

```bash
npm run build
```

The optimized build will be generated in:

```
dist/
```

---

# Deployment Options

The frontend can be deployed using:

* **Vercel**
* **Netlify**
* **AWS S3**
* **Cloudflare Pages**

---

# Development Notes

* React Query is used for data fetching
* TailwindCSS is used for styling
* Wouter handles routing
* Environment variables use `VITE_` prefix

---

# Author

Poorva Jain

---

# License

This project is licensed under the MIT License.
