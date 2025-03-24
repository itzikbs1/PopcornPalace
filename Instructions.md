# Popcorn Palace - Movie Ticket Booking System

## 📖 Overview

This project is a **NestJS-based** backend service for managing **movies, showtimes, bookings, and users**.  
It provides RESTful APIs for handling:

- 🎬 **Movies**
- 🎟️ **Showtimes**
- 🎫 **Bookings**
- 👤 **Users**

## 🛠️ **How to Download and Run the Project**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/itzikbs1/PopcornPalace
cd PopcornPalace
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Start PostgreSQL (Using Docker)**

```sh
docker-compose up -d
```

### **4️⃣ Apply Database Migrations**

```sh
npx prisma migrate deploy
```

### **Generate prisma**

```sh
npx prisma generate
```

### **5️⃣ Start the Server**

```sh
npm run start
```

Your NestJS server will run on **`http://localhost:3000`** 🚀

### **6️⃣ Stop and Clean Up Docker (After Running the Project and Tests)**

When you are finished using the project, stop and remove containers and volumes:

```sh
docker-compose down -v
```

This will ensure that all data and resources are properly cleaned up.

---

## 🛠️ **Running Tests**

### **1️⃣ Unit Tests**

Run all **unit tests**:

```sh
npm run test
```

### **2️⃣ End-to-End (E2E) Tests**

Run all **E2E tests**:

```sh
npm run test:e2e
```

## 🛠️ **Database Schema**

### **Tables and Their Fields**

#### **1️⃣ Movie Table** 🎬

Stores movie details available for booking.

| Field         | Type       | Description                               |
| ------------- | ---------- | ----------------------------------------- |
| `id`          | Int        | Unique identifier (Auto Increment)        |
| `title`       | String     | Unique movie title                        |
| `genre`       | String     | Genre of the movie (e.g., Action, Comedy) |
| `duration`    | Int        | Duration in minutes                       |
| `rating`      | Float      | Movie rating (out of 10)                  |
| `releaseYear` | Int        | Year of release                           |
| `showtimes`   | Showtime[] | Related showtimes                         |

#### **2️⃣ Showtime Table** 🎟️

Stores available movie showtimes.

| Field       | Type      | Description                        |
| ----------- | --------- | ---------------------------------- |
| `id`        | Int       | Unique identifier (Auto Increment) |
| `movieId`   | Int       | ID of the related movie            |
| `theater`   | String    | Theater name                       |
| `startTime` | DateTime  | Showtime start time                |
| `endTime`   | DateTime  | Showtime end time                  |
| `price`     | Float     | Ticket price                       |
| `bookings`  | Booking[] | Related bookings                   |

#### **3️⃣ Booking Table** 🎫

Stores user ticket bookings.

| Field        | Type     | Description                                |
| ------------ | -------- | ------------------------------------------ |
| `bookingId`  | String   | Unique identifier (UUID)                   |
| `showtimeId` | Int      | ID of the related showtime                 |
| `seatNumber` | Int      | Seat number                                |
| `userId`     | String   | ID of the related user                     |
| `status`     | Enum     | Booking status (`CONFIRMED` or `CANCELED`) |
| `createdAt`  | DateTime | Booking creation timestamp                 |

#### **4️⃣ User Table** 👤

Stores registered users.

| Field       | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| `id`        | String    | Unique user identifier (UUID)   |
| `name`      | String    | User's full name                |
| `email`     | String    | Unique email (Login credential) |
| `password`  | String    | Hashed password                 |
| `createdAt` | DateTime  | Account creation timestamp      |
| `updatedAt` | DateTime  | Last profile update timestamp   |
| `bookings`  | Booking[] | Related bookings                |

## 📌 API Documentation

### **1️⃣ Movie API 🎬**

| Action             | Endpoint                           | Request Body                                                                                       | Response                                                                                                        |
| ------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Get all movies** | `GET /movies/all`                  | -                                                                                                  | `[ { "id": 1, "title": "Inception", "genre": "Sci-Fi", "duration": 148, "rating": 8.8, "releaseYear": 2010 } ]` |
| **Add a movie**    | `POST /movies`                     | `{ "title": "Inception", "genre": "Sci-Fi", "duration": 148, "rating": 8.8, "releaseYear": 2010 }` | `{ "id": 1, "title": "Inception", "genre": "Sci-Fi", "duration": 148, "rating": 8.8, "releaseYear": 2010 }`     |
| **Update a movie** | `POST /movies/update/{movieTitle}` | `{ "genre": "Action", "duration": 150 }`                                                           | `{ "id": 1, "title": "Inception", "genre": "Action", "duration": 150 }`                                         |
| **Delete a movie** | `DELETE /movies/{movieTitle}`      | -                                                                                                  | `200 OK`                                                                                                        |

### **2️⃣ Showtime API 🎟️**

| Action                 | Endpoint                              | Request Body                                                                                                  | Response                                                                                                               |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Get showtime by ID** | `GET /showtimes/{showtimeId}`         | -                                                                                                             | `{ "id": 1, "movieId": 1, "theater": "IMAX", "startTime": "2025-02-14T10:00:00Z", "endTime": "2025-02-14T12:00:00Z" }` |
| **Add a showtime**     | `POST /showtimes`                     | `{ "movieId": 1, "theater": "IMAX", "startTime": "2025-02-14T10:00:00Z", "endTime": "2025-02-14T12:00:00Z" }` | `{ "id": 1, "movieId": 1, "theater": "IMAX", "startTime": "2025-02-14T10:00:00Z", "endTime": "2025-02-14T12:00:00Z" }` |
| **Update a showtime**  | `POST /showtimes/update/{showtimeId}` | `{ "price": 55.0 }`                                                                                           | `200 OK`                                                                                                               |
| **Delete a showtime**  | `DELETE /showtimes/{showtimeId}`      | -                                                                                                             | `200 OK`                                                                                                               |

### **3️⃣ Booking API 🎫**

| Action            | Endpoint         | Request Body                                           | Response                                           |
| ----------------- | ---------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **Book a ticket** | `POST /bookings` | `{ "showtimeId": 1, "seatNumber": 10, "userId": "1" }` | `{ "bookingId": "abc123", "status": "CONFIRMED" }` |

### **4️⃣ User API 👤**

| Action            | Endpoint      | Request Body                                                                         | Response                                                         |
| ----------------- | ------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Create a user** | `POST /users` | `{ "name": "John Doe", "email": "john@example.com", "password": "hashed_password" }` | `{ "id": "1", "name": "John Doe", "email": "john@example.com" }` |
