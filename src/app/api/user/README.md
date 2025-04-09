
# 📁 `api/users/`

This folder contains all the backend API routes related to **user account management** in the Barter marketplace app.

Each subfolder represents a specific functionality or endpoint for interacting with user data. These routes are protected and require user authentication unless otherwise specified.

---

## 📌 Folder Breakdown

### 🔍 `[id]/`
- **Purpose:** Fetch a specific user's public profile information.
- **Endpoint:** `GET /api/users/:userId`
- **Access:** Public
- **Returns:** Basic info like username, trade rating, and profile image.

---

### 📊 `dashboard-data/`
- **Purpose:** Returns an authenticated user’s dashboard data, including:
  - Active listings
  - Trade offers
  - Notifications
- **Endpoint:** `GET /api/users/dashboard`
- **Access:** Private (Authenticated)

---

### 🗑️ `deleteProfile/`
- **Purpose:** Allows a user to permanently delete their own profile and all associated data.
- **Endpoint:** `DELETE /api/users/deleteProfile`
- **Access:** Private (Authenticated)
- **Note:** This action is irreversible.

---

### 🔐 `updatePassword/`
- **Purpose:** Enables users to change their password.
- **Endpoint:** `PATCH /api/users/updatePassword`
- **Access:** Private (Authenticated)
- **Requires:**
  - `currentPassword`
  - `newPassword`
- **Returns:** Success or error message.

---

### ✏️ `updateProfile/`
- **Purpose:** Allows users to update personal details such as name, bio, avatar, or contact preferences.
- **Endpoint:** `PATCH /api/users/updateProfile`
- **Access:** Private (Authenticated)
- **Accepts:** JSON body with editable fields

---

## 🔐 Authentication

All endpoints (except for fetching public user profiles) require the user to be logged in. Auth is verified using session tokens or JWT, depending on the app’s configuration.