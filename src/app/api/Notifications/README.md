
# 🔔 `api/notifications/`

This folder contains API routes for handling **user notifications** in the Barter marketplace app. Notifications are used to alert users about important activity like trade offers, message replies, review updates, and more.

---

## 📁 Endpoints Overview

### ✍️ `POST /api/notifications/create`
- **Purpose:** Create a new notification for a specific user.
- **Access:** 🔒 Private (Usually triggered server-side after specific user actions)
- **Request Body:**
  ```json
  {
    userId,
    type,
    content,
    dateSent: new Date(),
    isRead: false
  }
```

-   **Use Cases:**
    
    -   Notify a user about a new trade offer
        
    -   Inform a user of a new message or review
        
    -   Link to relevant parts of the app (e.g. trade page, chat thread)
        
-   **Response:**
    
    -   `201 Created` with the notification object


### `GET /api/notifications/getNotifications`

-   **Purpose:** Retrieve all notifications for the authenticated user.
    
-   **Access:** 🔒 Private (Authenticated)
        

----------