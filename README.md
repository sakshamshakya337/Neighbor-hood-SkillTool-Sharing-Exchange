# 🏘️ Neighborhood Skill & Tool Sharing Exchange

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)
[![DeepScan grade](https://deepscan.io/api/teams/30237/projects/32103/branches/1044001/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=30237&pid=32103&bid=1044001)

A robust, full-stack platform empowering communities to connect, share physical tools, and offer skills to one another. Built on the MERN stack with modern frontend tooling, this platform features real-time chat, a complete booking and review system, payment gateways, and admin dashboards.

---

## 🌟 Key Features

- **Comprehensive Booking System:** Full lifecycle management for booking tools and skills, including availability checking, requests, approvals, late-fee management, and cancellations.
- **Secure Payments & Deposits:** Integrated with Razorpay to handle security deposits, rental payments, and late fees securely.
- **Real-Time Communication:** Real-time chat integration using Socket.io for immediate coordination between neighbors.
- **Robust Trust & Safety:** Built-in review systems, trust scores, reporting features, and verification checks.
- **Admin Management Dashboard:** Complete overview of users, listings, system metrics, reports, and moderation capabilities (block/delete users).
- **Modern UI/UX:** A responsive, highly performant interface built with React 19, Vite, and TailwindCSS v4.

---

## 💻 Tech Stack

### Frontend
- **React 19** & **React Router v7**
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS v4** (Utility-first styling)
- **Lucide React** & **React Icons**
- **Socket.io-client** (Real-time updates)
- **Axios** (API requests)

### Backend
- **Node.js** & **Express 5**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)** & **Bcrypt** (Authentication)
- **Socket.io** (WebSockets)
- **Razorpay** (Payment Gateway Integration)
- **Nodemailer** (Email notifications)

---

## 🚀 Getting Started & Running Locally

To get the project running seamlessly on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sakshamshakya337/Neighbor-hood-SkillTool-Sharing-Exchange.git
   cd Neighbor-hood-SkillTool-Sharing-Exchange
   ```

2. **Install Dependencies:**
   Make sure to install dependencies from the root directory.
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and configure the required variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   # Other email/SMTP configurations...
   ```

4. **Run the Application:**
   Use the `dev` script to concurrently start both the backend Node.js server and the Vite React frontend.
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`.*

---

## 📚 API Documentation

**Total APIs Integrated: 68** 

The backend architecture consists of 68 APIs, perfectly structured and grouped. All endpoints are fully hooked up with the React frontend and are optimized for Serverless deployment.

### 1. Auth APIs (9) - `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login user and issue JWT |
| `POST` | `/admin-login` | Admin login |
| `POST` | `/logout` | Logout user and clear session |
| `POST` | `/refresh-token` | Refresh authentication token |
| `POST` | `/forgot-password`| Send forgot password email link |
| `POST` | `/reset-password` | Reset user password |
| `POST` | `/verify-email` | Verify user's email address |
| `POST` | `/verify-neighborhood`| Verify user's neighborhood status |

### 2. User APIs (6) - `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get logged-in user profile |
| `PUT` | `/profile` | Update user profile details |
| `GET` | `/address` | Get user address |
| `PUT` | `/address` | Update user address |
| `GET` | `/admin` | Get Admin User details |
| `GET` | `/listings` | Get user listed tools and skills |

### 3. Tool APIs (7) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tool` | Add a new tool listing |
| `GET` | `/tool` | Get all available tools |
| `GET` | `/tool/:id` | Get details of a specific tool |
| `PUT` | `/tool/:id` | Update a tool listing |
| `DELETE`| `/tool/:id` | Delete a tool listing |
| `GET` | `/categories` | Get all tool categories |
| `GET` | `/search` | Search tools by keyword or category |

### 4. Skill APIs (5) - `/api/skill`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/skill` | Add a new skill listing |
| `GET` | `/skill` | Get all available skills |
| `GET` | `/skill/:id` | Get details of a specific skill |
| `PUT` | `/skill/:id` | Update a skill listing |
| `DELETE`| `/skill/:id` | Delete a skill listing |

### 5. Booking APIs (13) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/booking` | Create a new booking request |
| `GET` | `/booking` | Get bookings for the current user |
| `GET` | `/booking/:id` | Get details of a specific booking |
| `PUT` | `/booking/:id` | Update booking status (e.g. approve) |
| `DELETE`| `/booking/:id` | Delete a booking request |
| `POST` | `/cancel-booking`| Cancel an active booking |
| `GET` | `/availability` | Get unavailable dates for a specific tool |
| `POST` | `/deposit` | Process a security deposit payment |
| `GET` | `/rental-history` | Get history of tools rented and lent out |
| `POST` | `/booking/:id/remind` | Send a reminder email for an active booking |
| `POST` | `/booking/:id/not-returned` | Mark a booking as not returned |
| `POST` | `/booking/:id/report` | Report a renter for an issue |
| `POST` | `/booking/:id/pay-late-fee` | Pay late fees for a booking |

### 6. Admin APIs (6) - `/api/admin`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get admin dashboard statistics |
| `GET` | `/users` | Get list of all users |
| `GET` | `/tools` | Get list of all tools/skills |
| `PUT` | `/block-user` | Block or unblock a user |
| `DELETE`| `/delete-user` | Delete a user |
| `GET` | `/bookings` | Get all system bookings |

### 7. Chat APIs (5) - `/api/chat`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Access or create a chat with a user |
| `GET` | `/` | Fetch all chats for the user |
| `POST` | `/message` | Send a new message |
| `GET` | `/:id` | Get all messages for a specific chat |
| `DELETE`| `/:id` | Delete a chat |

### 8. Payment APIs (4) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/payment` | Create a new Razorpay payment |
| `GET` | `/payment-history` | Get user payment history |
| `POST` | `/verify` | Verify payment status with webhook |
| `GET` | `/get-key` | Get Razorpay client key |

### 9. Review APIs (4) - `/api/review`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Add a new review |
| `GET` | `/:toolId` | Get all reviews for a specific tool/skill |
| `PUT` | `/:id` | Update an existing review |
| `DELETE`| `/:id` | Delete a review |

### 10. Report APIs (3) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/report` | Create a new report (issue with tool/user) |
| `GET` | `/reports` | Get all reports (Admin) |
| `PUT` | `/report/resolve` | Mark a report as resolved |

### 11. Notification APIs (2) - `/api/notifications`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all notifications for user |
| `PUT` | `/read` | Mark notifications as read |

### 12. Trust Score APIs (2) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/trust-score` | Get the trust score for the current user |
| `GET` | `/rating` | Get the rating details |

### 13. Wishlist APIs (1) - `/api/wishlist`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Toggle a tool/skill in the user's wishlist |

### 14. System APIs (1) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint for monitoring |

---
*Maintained by the Neighborhood Skill & Tool Sharing Exchange community.*
