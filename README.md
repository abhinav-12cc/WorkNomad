# WorkNomad

**WorkNomad** is a full-stack platform empowering remote professionals with flexible workspace solutions and a thriving community. Users can discover, book, and manage premium workspaces, while admins can manage listings, bookings, and categories. The project features a modern React frontend (with Vite and Tailwind CSS) and a Node.js/Express backend with MongoDB.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Usage](#usage)
- [License](#license)

---

## Features

- **Workspace Discovery:** Browse and search premium workspaces by location, category, and facilities.
- **Booking & Payment:** Book workspaces and pay securely via Stripe integration.
- **Wishlist:** Save favorite workspaces for quick access.
- **User Dashboard:** View profile, order history, and manage bookings.
- **Admin Dashboard:** Manage posts, categories, and bookings.
- **Contribute:** Users can suggest new workspace listings.
- **Support/Query:** Contact form for user support and queries.
- **Responsive UI:** Modern, mobile-friendly design with Tailwind CSS.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Stripe
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Stripe, Cloudinary

---

## Project Structure

```
worknomad/
├── client/      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── server/      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controller/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── package.json
│   └── ...
└── ...
```

---

## Setup & Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or Atlas)

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd worknomad
```

### 2. Backend Setup

```sh
cd server
npm install
```

- Create a `.env` file in `server/` with:
  ```
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```
- (Optional) Add Cloudinary credentials to `.env` and update `src/config/cloudinary.js` to use them.

- Start the backend:
  ```sh
  npm start
  ```
  The server runs on `http://localhost:3000` by default.

### 3. Frontend Setup

```sh
cd ../client
npm install
```

- Create a `.env` file in `client/` with:
  ```
  VITE_BASE_URL=http://localhost:3000
  ```
- Start the frontend:
  ```sh
  npm run dev
  ```
  The app runs on `http://localhost:5173` by default.

---

## Environment Variables

### Backend (`server/.env`)

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT authentication
- (Optional) Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend (`client/.env`)

- `VITE_BASE_URL` — Base URL for backend API (e.g., `http://localhost:3000`)

---

## Scripts

### Backend

- `npm start` — Start the backend server with nodemon

### Frontend

- `npm run dev` — Start the frontend dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint the codebase

---

## API Overview

### Auth

- `POST /auth/api/register` — Register user
- `POST /auth/api/login` — Login user
- `GET /auth/api/user` — Get user info

### Posts (Workspaces)

- `POST /api/post/create-post` — Create workspace (admin)
- `GET /api/post/get-all-post` — List all workspaces
- `GET /api/post/get-post/:slug` — Get workspace details
- `PUT /api/post/update-post/:pid` — Update workspace (admin)
- `DELETE /api/post/delete-post/:pid` — Delete workspace (admin)
- `GET /api/post/related-post/:pid/:cid` — Related workspaces
- `POST /api/post/product-filters` — Filter workspaces
- `GET /api/post/popular-post` — Popular workspaces
- `GET /api/post/search` — Search workspaces

### Categories

- `POST /api/category/create-category` — Create category (admin)
- `GET /api/category/get-category` — List categories
- `PUT /api/category/update-category/:id` — Update category (admin)
- `DELETE /api/category/delete-category/:id` — Delete category (admin)
- `GET /api/category/single-category/:slug` — Get category details
- `GET /api/category/select-category/:slug` — Get workspaces by category

### Bookings

- `POST /api/booking/create-booking` — Create booking
- `POST /api/booking/create-payment-intent` — Create Stripe payment intent
- `PATCH /api/booking/update-availability` — Update workspace availability
- `GET /api/booking/get-all-bookings` — List all bookings (admin)
- `GET /api/booking/search/:keyword` — Search bookings

### Queries

- `POST /api/query/submit` — Submit user query
- `GET /api/query/all` — List all queries (admin)
- `PUT /api/query/update-status/:queryId` — Update query status (admin)

### Contribute

- `POST /api/contribute/contribute-post` — User-contributed workspace

---

## Usage

- **Browse Workspaces:** Explore all available workspaces on the homepage or via search.
- **Book a Workspace:** View details and book a workspace with secure payment.
- **Wishlist:** Add favorite workspaces to your wishlist for later.
- **User Dashboard:** View your profile and order history.
- **Admin Dashboard:** Manage all listings, bookings, and categories.
- **Contribute:** Suggest new workspace listings as a user.
- **Support:** Submit queries via the contact form.

---

## License

This project is licensed under the MIT License.
