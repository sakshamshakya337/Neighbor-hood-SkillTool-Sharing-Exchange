# Neighborhood Skill & Tool Sharing Exchange

This is the central repository for the Neighborhood Skill & Tool Sharing platform. The backend is an Express/Node.js application optimized for Vercel's Serverless Functions, and the frontend is a React application built with Vite and TailwindCSS.

## API Documentation

**Total APIs Integrated: 34** 
*(8 Auth + 4 User + 7 Tool + 5 Skill + 9 Booking + 1 Health Check)*

All endpoints are fully hooked up with the React frontend and are hosted within a single Vercel Serverless Function (via Express) to avoid the 12-function limit.

### 1. Auth APIs (8) - `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login user and issue JWT |
| `POST` | `/logout` | Logout user and clear session |
| `POST` | `/refresh-token` | Refresh authentication token |
| `POST` | `/forgot-password`| Send forgot password email link |
| `POST` | `/reset-password` | Reset user password |
| `POST` | `/verify-email` | Verify user's email address |
| `POST` | `/verify-neighborhood`| Verify user's neighborhood status |

### 2. User APIs (4) - `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get logged-in user profile |
| `PUT` | `/profile` | Update user profile details |
| `GET` | `/address` | Get user address |
| `PUT` | `/address` | Update user address |

### 3. Tool APIs (7) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tool` | Add a new tool listing |
| `GET` | `/tool` | Get all available tools |
| `GET` | `/tool/:id` | Get details of a specific tool |
| `PUT` | `/tool/:id` | Update a tool listing (owner only) |
| `DELETE`| `/tool/:id` | Delete a tool listing (owner only) |
| `GET` | `/categories` | Get all tool categories |
| `GET` | `/search` | Search tools by keyword or category |

### 4. Skill APIs (5) - `/api/skill`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/skill` | Add a new skill listing |
| `GET` | `/skill` | Get all available skills |
| `GET` | `/skill/:id` | Get details of a specific skill |
| `PUT` | `/skill/:id` | Update a skill listing (provider only) |
| `DELETE`| `/skill/:id` | Delete a skill listing (provider only) |

### 5. Booking APIs (9) - `/api`
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

### 6. System APIs (1) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint for monitoring |

## Frontend Modules
The frontend connects to these 34 APIs using Axios and includes the following main features:
- **Authentication:** Registration, login, and secure sessions.
- **Tool Listing & Booking:** Browsing tools, searching, categories, booking calendar, and rental history management.
