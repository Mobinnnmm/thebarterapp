
# Barter API

This folder contains the backend logic and API routes for the **Barter** marketplace application. Each module handles a different core feature of the app such as authentication, item listings, user profiles, and more.

All routes in this folder follow the [Next.js API routes](https://nextjs.org/docs/api-routes/introduction) convention.

---

## 🧱 Structure

The API is organized into the following main modules:

### 📣 `notifications/`
Handles creation and retrieval of real-time notifications for trade requests, messages, or system alerts.

### 🔐 `auth/`
Manages user authentication and session handling. Includes login, register, and token validation endpoints.

### 🏷️ `categories/`
Returns a list of supported item categories used in listings. Admins may manage available categories.

### 💬 `chat/`
Responsible for chat threads between users. Supports sending and receiving messages in real time or via polling.

### 📦 `listings/`
Core module for creating, retrieving, updating, and deleting item listings. Includes features like filtering by category or proximity.

### 🚩 `report/`
Allows users to report suspicious or inappropriate content. Reports can be reviewed and moderated by admins.

### 🔁 `trade/`
Handles the trade negotiation process between users:
- Making an offer
- Accepting/Declining
- Completing a trade

### 👤 `users/`
Manages user profiles, settings, and viewing other traders' profiles.

---

## 📂 File Example

Each module typically includes:
- `route.js` – handles route routing
- HTTP method files (`get.js`, `post.js`, etc.) – handle individual HTTP methods
- Utility/helper files if needed

---
