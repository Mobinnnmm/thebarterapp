
# 📦 `api/listing/`

  

This folder handles all backend routes related to **listings** on the Barter marketplace. Listings represent the items users put up for trade, and this API allows users to create, view, update, delete, and favorite those items.

  

---

  

## 📁 Endpoints Overview

  

### 🔍 `GET /api/listing/:listingId`

-  **Purpose:** Fetch a specific listing by its ID.

-  **Access:** 🔓 Public

-  **Returns:**
```json
	{

	"listingId": "string",

	"title": "string",

	"description": "string",

	"selectedCategory": "string",

	"images": ["url1", "url2"],

	"location"

	}
```

  
  

### `GET /api/listing/all`

  

-  **Purpose:** Fetch all listings.

-  **Access:** 🔓 Public

-  **Supports:** Optional filters by category, tag, keyword, etc.

-  **Returns:** Array of listing objects, optionally paginated

  

----------

  

### ➕ `POST /api/listing/create`

  

-  **Purpose:** Create a new listing.

-  **Access:** 🔒 Private (Authenticated)

-  **Request Body:**
```json
	{

	"listingId": "string",

	"title": "string",

	"description": "string",

	"selectedCategory": "string",

	"images": ["url1", "url2"],

	"location"

	}
```

-  **Response:**

-  `201 Created` with the new listing object

  

----------

  

### ❌ `DELETE /api/listing/delete/:listingId`

  

-  **Purpose:** Delete a listing.

-  **Access:** 🔒 Private (Owner only)

-  **Response:**

-  `200 OK` on success

-  `404 Not Found` if listing does not exist

  

----------

  

### ⭐ `POST /api/listing/favourite/:listingId`

  

-  **Purpose:** Toggle a listing as favorite for the authenticated user.

-  **Access:** 🔒 Private

-  **Effect:**

- Adds the listing to the user's favorite list if not already there

- Removes it if already favorited

-  **Returns:** Updated favorite status

  

----------

  

## 🛡️ Authentication

  

- Viewing listings is public.

- Creating, updating, deleting, and favoriting listings require authentication.