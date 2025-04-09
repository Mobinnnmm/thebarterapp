
# ⭐ `api/reviews/`

This folder contains API routes for handling **user reviews** on Barter. After a trade is completed, users can leave feedback on each other to build trust and reputation in the community.

---

## 📁 Folder Structure

### ✍️ `create/`
- **Purpose:** Create a new review for another user after a completed trade.
- **Endpoint:** `POST /api/reviews/create`
- **Access:** Private (Authenticated)
- **Request Body:**
  ```json
  {
    reviewerId,
    reviewedId,
    rating,
    notes
  }
```

### ❌ `delete/`

-   **Purpose:** Delete a review created by the current user.
    
-   **Endpoint:** `DELETE /api/reviews/delete/:reviewId`
    
-   **Access:** Private (Authenticated)
    
-   **Permissions:** Only the original author of the review can delete it.
    
-   **Returns:**
    
    -   Confirmation of deletion
        
    -   Or `404` if user is not the author

### `get/`

-   **Purpose:** Retrieve all reviews for a specific user.
    
-   **Endpoint:** `GET /api/reviews/get/:userId`
    
-   **Access:** Public
    