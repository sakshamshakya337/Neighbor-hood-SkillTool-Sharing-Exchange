# Neighborhood Skill & Tool Sharing Exchange

This is the central repository for the Neighborhood Skill & Tool Sharing platform. The backend is an Express/Node.js application optimized for Vercel's Serverless Functions, and the frontend is a React application built with Vite and TailwindCSS.

[![DeepScan grade](https://deepscan.io/api/teams/30237/projects/32103/branches/1044001/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=30237&pid=32103&bid=1044001)
## API Documentation

**Total APIs Integrated: 61** 
*(9 Auth + 6 User + 7 Tool + 5 Skill + 9 Booking + 5 Admin + 5 Chat + 2 Notification + 3 Payment + 3 Report + 4 Review + 2 Trust Score + 1 Wishlist + 1 Health Check)*

All endpoints are fully hooked up with the React frontend and are hosted within a single Vercel Serverless Function (via Express) to avoid the 12-function limit.

### 1. Auth APIs (8) - `/api/auth`
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

### 2. User APIs (4) - `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get logged-in user profile |
| `PUT` | `/profile` | Update user profile details |
| `GET` | `/address` | Get user address |
| `PUT` | `/address` | Update user address |
| `GET` | `/admin` | Get Admin User Id |
| `GET` | `/listings` | Get user listed tools and skills |

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

### 7. Admin APIs (5) - `/api/admin`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get admin dashboard statistics |
| `GET` | `/users` | Get list of all users |
| `GET` | `/tools` | Get list of all tools/skills |
| `PUT` | `/block-user` | Block or unblock a user |
| `DELETE`| `/delete-user` | Delete a user |

### 8. Chat APIs (5) - `/api/chat`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Access or create a chat with a user |
| `GET` | `/` | Fetch all chats for the user |
| `POST` | `/message` | Send a new message |
| `GET` | `/:id` | Get all messages for a specific chat |
| `DELETE`| `/:id` | Delete a chat |

### 9. Notification APIs (2) - `/api/notifications`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all notifications |
| `PUT` | `/read` | Mark a notification as read |

### 10. Payment APIs (3) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/payment` | Create a new payment |
| `GET` | `/payment-history` | Get user payment history |
| `POST` | `/webhook` | Webhook for payment events |

### 11. Report APIs (3) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/report` | Create a new report (e.g., issue with tool) |
| `GET` | `/reports` | Get all reports |
| `PUT` | `/report/resolve` | Mark a report as resolved |

### 12. Review APIs (4) - `/api/review`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Add a new review |
| `GET` | `/:toolId` | Get all reviews for a specific tool/skill |
| `PUT` | `/:id` | Update an existing review |
| `DELETE`| `/:id` | Delete a review |

### 13. Trust Score APIs (2) - `/api`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/trust-score` | Get the trust score for the current user |
| `GET` | `/rating` | Get the rating details |

### 14. Wishlist APIs (1) - `/api/wishlist`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Toggle a tool in the user's wishlist |

## Frontend Modules
The frontend connects to these 61 APIs using Axios and includes the following main features:
- **Authentication:** Registration, login, and secure sessions.
- **Tool Listing & Booking:** Browsing tools, searching, categories, booking calendar, and rental history management.
