
# 🔐 `api/auth/`

This folder contains authentication routes for the Barter marketplace app. These routes handle **user registration** and **login**, enabling secure access to protected features like creating listings, trading, and messaging.

---

## 📁 Endpoints Overview

### 🧾 `POST /api/auth/register`
- **Purpose:** Register a new user account.
- **Access:** 🔓 Public
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "user@example.com",
    "password": "hashed password"
  }
	```

-   **Validations:**
    
    -   Email must be unique
        
-   **Response:**
    
    -   `201 Created` with user data (excluding password)
        
    -   Automatically logs in the user (returns token/session if applicable)

### `POST /api/auth/login`

-   **Purpose:** Authenticate a user and establish a session.
    
-   **Access:** 🔓 Public
    
-   **Request Body:**
```
{
  "email": "user@example.com",
  "password": "string"
}
  ```  
-   **Response:**
    
    -   User data (excluding password)
        
    -   Token or session cookie depending on implementation
        
-   **Errors:**
    
    -   `401 Unauthorized` if credentials are invalid