# Golf Bookr ⛳

A premium, full-stack online booking system and AI concierge for elite golf courses in Bangkok. Built with a modern client-server architecture, real-time WebSocket updates, a MySQL database, and integrated with Google's **Gemini 3.5 Flash** for a dynamic chatbot experience.

---

## 🌟 Key Features

* **Luxury Frontend Redesign**: An ultra-premium visual interface utilizing a Forest Green & Gold color palette, custom glassmorphism components, elegant typography, and responsive layouts.
* **Real-time Tee Time Booking**: Interactive reservation flow with live slot availability updates powered by WebSockets.
* **CawFee AI Assistant**: A custom-prompted Gemini AI chatbot acting as a personal concierge to answer questions about course features, weather conditions, player limits, and time-slot recommendations.
* **Admin Dashboard**: A secure back-office module allowing admins to manage course details, add or cancel tee times, and track user reservations using interactive analytical charts.
* **Add-on Services**: Select options for professional caddies, golf carts, and elite club rentals during checkout.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework**: React 18 & Vite 6 (JavaScript/ESM)
* **Styling**: Vanilla CSS Modules (theme variables) + React-Bootstrap & Material-UI (MUI) components
* **Routing**: React Router DOM v6
* **Analytics**: Chart.js & React-Chartjs-2
* **HTTP Client**: Axios with automatic authorization interceptors

### Backend (Server)
* **Framework**: Node.js & Express.js
* **Database**: MySQL (using `mysql2/promise` connection pool)
* **WebSockets**: Native WS implementation for real-time update broadcasts
* **AI Engine**: Google Generative AI SDK (`gemini-3.5-flash`)
* **Security**: JWT-based session auth, bcrypt password hashing, and Express rate limiter

---

## ⚙️ Project Setup

### 1. Database Setup
Ensure you have MySQL running. Create a database called `golf_bookr` and import the schema found in `/server/db/schema.sql`:
```bash
mysql -u root -p -e "CREATE DATABASE golf_bookr;"
mysql -u root -p golf_bookr < server/db/schema.sql
```

### 2. Environment Variables
Create a `.env` file in the root directory (and copy it to `/server/.env` if running servers separately) with the following variables:
```env
PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=golf_bookr

JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `/client` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Installation & Running
Install dependencies and run the development servers:

#### Backend Server
```bash
cd server
npm install
npm run dev
```
*The server will run on [http://localhost:3000](http://localhost:3000)*

#### Frontend Client
```bash
cd client
npm install
npm run dev
```
*The client will run on [http://localhost:5173](http://localhost:5173)*

---

## 🧑‍✈️ CawFee AI assistant Prompts
The chatbot **CawFee** resides in [server/routes/chat.js](server/routes/chat.js). It dynamically gathers database status info (e.g. tomorrow's slots, course difficulty, holes) and blends it into its system instructions to guide users contextually through the booking flow using friendly golf-themed puns.
