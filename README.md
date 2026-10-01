# 🍕 Lizza — Full-Stack Pizza Ordering Platform

Lizza is a full-stack MERN pizza ordering platform with secure authentication, role-based access control, online payments, real-time order tracking, and automated inventory alerts. It is wrapped in a bold neubrutalist orange UI.

**🔗 Live Demo:** [lizza20.vercel.app](https://lizza20.vercel.app)

> Built as part of the **Oasis Infobyte (OIBSIP) Level 3** web development task.

---

## 📸 Screenshots

<!-- Add screenshots here: Home, Pizza Builder, Cart, Checkout, Order Tracking, Admin Dashboard -->

| Home | Cart | Admin Dashboard |
|------|------|-----------------|
| _add image_ | _add image_ | _add image_ |

---

## ✨ Features

### 👤 Customer
- Register / login with JWT-based authentication (stored in secure cookies)
- Browse the pizza menu and customize orders
- Add items to a persistent cart
- Pay online through **Razorpay**
- Track order status **live** via Socket.io (no refresh needed)
- View order history

### 🛠️ Admin
- Role-protected admin dashboard
- Manage menu items and inventory (bases, sauces, cheeses, veggies, etc.)
- View and update order status (received → preparing → out for delivery → delivered)
- **Automatic low-stock alerts** via scheduled cron jobs

### ⚙️ Platform
- Role-Based Access Control (RBAC) on both frontend routes and backend APIs
- User-scoped real-time rooms, so users only receive updates for their own orders
- Scheduled background jobs with `node-cron`
- Fully deployed: Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Context API, Axios |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB, Mongoose |
| Auth | JWT, HTTP-only cookies, bcrypt |
| Payments | Razorpay |
| Real-time | Socket.io |
| Scheduling | node-cron |
| Deployment | Vercel, Render, MongoDB Atlas |

---

## 🏗️ Architecture

```
┌──────────────┐     REST + cookies      ┌──────────────────┐     ┌──────────────┐
│   React SPA  │ ──────────────────────► │  Express API     │ ──► │ MongoDB Atlas│
│   (Vercel)   │ ◄────────────────────── │  (Render)        │ ◄── │              │
└──────┬───────┘                         └───────┬──────────┘     └──────────────┘
       │            Socket.io (WebSocket)        │
       └─────────────────────────────────────────┤
                                                 ├──► Razorpay (payments)
                                                 └──► node-cron (low-stock alerts)
```

### Frontend state management
State is organized with three React Contexts:

- **AuthContext** — current user, login/logout, role checks
- **CartContext** — cart items, totals, add/remove/clear
- **OrderContext** — order placement, history, live status updates

### Real-time order tracking
When a user logs in, their socket joins a **user-scoped room**. When an admin updates an order, the server emits the update only to that user's room, so customers never see each other's orders.

### Payment flow
1. Client requests order creation → server creates a Razorpay order (amount sent as a **number in paise**)
2. Razorpay checkout opens on the client
3. On success, the client sends payment details to the server
4. Server verifies the signature, then marks the order as paid

### Inventory alerts
A `node-cron` job periodically checks ingredient stock levels and flags or notifies the admin when any item falls below its threshold.

---

## 📁 Project Structure

> Adjust to match your actual folders.

```
lizza/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── context/        # AuthContext, CartContext, OrderContext
│       ├── pages/
│       └── App.jsx
└── server/                 # Express backend
    ├── config/             # DB connection, Razorpay setup
    ├── controllers/
    ├── middleware/         # auth + role checks
    ├── models/             # Mongoose schemas
    ├── routes/
    ├── jobs/               # node-cron tasks
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Razorpay account (test mode keys work fine)

### 1. Clone the repository
```bash
git clone https://github.com/jai345coder/lizza.git
cd lizza
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

Run the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Run the client:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔐 Roles & Access

| Role | Access |
|------|--------|
| **User** | Menu, cart, checkout, own orders, live tracking |
| **Admin** | Everything above + inventory, all orders, status updates |

Protected routes are enforced in the React router **and** by auth/role middleware on the API.

---

## 🌐 Deployment Notes

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Things that matter in production:
- `dotenv` must be the **first import** in the server entry file (ES module imports are hoisted, so env vars would otherwise be undefined)
- Cross-origin cookies require matching CORS config (`credentials: true`, an explicit origin) plus `sameSite: "none"` and `secure: true` in production
- Make sure all source files are committed and nothing needed is in `.gitignore`, or Render builds will fail

---

## 🧠 Challenges & Learnings

- **ES module import hoisting** — learned why `dotenv/config` has to be imported first
- **Async Mongoose queries** — missing `await` silently returned query objects instead of data
- **`populate()` failures** — caused by case mismatches in model `ref` strings
- **Razorpay quirks** — authentication errors and an amount type bug (string vs number)
- **Cookie + CORS auth** across two different domains in production
- **Scoped Socket.io rooms** for private, per-user updates

---

## 🗺️ Roadmap

- [ ] Email / SMS order notifications
- [ ] Coupon codes and offers
- [ ] Order cancellation and refunds
- [ ] Delivery partner view
- [ ] Ratings and reviews

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Fork the repo, create a feature branch, and open a pull request.

---

## 👨‍💻 Author

**Prashant Tiwari (Jai)**

- GitHub: [@jai345coder](https://github.com/jai345coder)
- LinkedIn: [Prashant Tiwari](https://linkedin.com/in/prashant-tiwari-74284b27b)

---

## 📄 License

This project is licensed under the MIT License.
