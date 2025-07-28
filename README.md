# 🎬 QuickShow - Movie Ticket Booking App

QuickShow is a full-stack movie ticket booking web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to browse now-playing movies using the TMDB API, select showtimes, and book tickets. Admins can create and manage movie shows through a dashboard.

---

## 🚀 Features

- 🎞️ Fetch and display movies from TMDB (Now Playing)
- 🕒 View and book available shows
- 🪑 Seat selection for each show
- 🔐 Authentication using Clerk / JWT
- 🛠️ Admin panel to add shows
- 📊 Dashboard with total bookings, revenue, and active shows
  
---

## 💻 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- TMDB API
- Clerk or JWT for authentication
---
## 🖼️ Screenshots
<img width="361" height="124" alt="Image" src="https://github.com/user-attachments/assets/28a2fa62-25c7-40da-a99a-29e6f05f3874" /> <img width="390" height="133" alt="Image" src="https://github.com/user-attachments/assets/14dd5131-8998-4c3d-8318-0e52d8a19e66" />


## FIGMA DISIGN :- 
👉 [figma disign](https://kikanimeetwedhar.netlify.app/](https://www.figma.com/design/qYz06tL5U6ASdrXwq3yf6z/Untitled?node-id=0-1&t=5ouVgrZ61gLY5j3g-1)
## ⚙️ Setup Instructions
. Setup Backend
cd backend
npm install

.Createa .env
MONGODB_URI=your_mongodb_connection_string ,
TMDB_API_KEY=your_tmdb_api_key ,
JWT_SECRET=your_jwt_secret ,
CLERK_SECRET_KEY=your_clerk_secret_key   # If using Clerk

Run the server:
npm start

.Setup Frontend
cd frontend
npm install
npm run dev

### 1. Clone the Repository
```bash
git clone https://github.com/KikaniMeet/QuickShow-move-ticket-boking.git
cd QuickShow-move-ticket-boking
