
# 🔁 `api/[tradeid]/`

This folder handles API routes related to **item trades** between users in the Barter marketplace.

Trades are at the core of the platform — users can propose a trade, and others can accept, decline, or counter-offer. This folder currently contains logic for fetching a specific trade and creating a new one.

---

## 📁 Folder Structure

### 🆕 `create/`
- **Purpose:** Initiate a trade offer between two users.
- **Endpoint:** `POST /api/trade/create`
- **Access:** Private (Authenticated)
- **Request Body:**
```json
  {
    proposerId,,
    targetUserId,
    proposedItemId,
    targetItemId,
    status:  'pending'
  }
```

### `getTrade/`

-   **Purpose:** Fetch details of a specific trade using its ID.
    
-   **Endpoint:** `GET /api/trade/:tradeId`
    
-   **Access:** Private (Only involved users can access)
    
-   **Returns:**
    
    -   Trade data including items, users involved, status, and messages
        
-   **Errors:**
    
    -   `404` if trade not found
        
    -   `403` if user is unauthorized to view the trade
        

----------

## 📌 Trade Status Flow

Trade objects may include a `status` field with values like:

-   `pending`
    
-   `accepted`
    
-   `declined`
    
-   `completed`
    
-   `cancelled`