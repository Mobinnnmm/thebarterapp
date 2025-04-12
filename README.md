# Barter

Barter is a community-driven marketplace application that allows users to trade items directly with others—no money involved. Whether you're looking to swap clothes, electronics, books, or handmade goods, Barter provides a simple platform to post, discover, and negotiate trades.

## System Architecture

- Frontend: Next.js
- Backend: Next.js API routing
- Database: MongoDB (hosted on MongoDB Atlas)
- Authentication: JSON Web Token (JWT)
- Hosting: Vercel for both frontend and backend, and Render for Chat's socket server

## Technologies Used

- TODO

## API Endpoints 

  ### Authentication Endpoints
- POST /api/auth/login - Authenticate a user and return a JWT token
- POST /api/auth/register - Register a new user

  ### User Endpoints
- GET /api/user/[id] - Get user details by ID
- GET /api/user/dashboard-data - Get user data for dashboard including items and favorites
- POST /api/user/updateProfile - Update user profile information
- PUT /api/user/updatePassword - Update user password
- DELETE /api/user/deleteProfile - Delete user account
 
 ### Listing Endpoints
- GET /api/listing/all - Get all available listings
- GET /api/listing/[id] - Get a specific listing by ID
- GET /api/listing/user/[id] - Get all listings by a specific user
- GET /api/listing/proposals/[id] - Get all trade proposals for a specific listing
- POST /api/listing/create - Create a new listing
- PUT /api/listing/update - Update an existing listing
- PUT /api/listing/favourite - Toggle a listing as favorite
- DELETE /api/listing/delete - Delete a listing
  
  ### Trade Endpoints
- GET /api/trade/[tradeId] - Get details of a specific trade
- PUT /api/trade/[tradeId] - Update a trade's status
- POST /api/trade/create - Create a new trade proposal
- POST /api/trade/[tradeId]/initial-offer - Submit initial offer for a trade
- POST /api/trade/[tradeId]/counter-offer - Submit counter offer for a trade
- POST /api/trade/[tradeId]/negotiate - Submit negotiation details for a trade
- POST /api/trade/[tradeId]/completion - Mark a trade as completed
- GET /api/trade/[tradeId]/history - Get negotiation history for a completed trade
  
 ### User Trade Management Endpoints
- GET /api/user/[id]/trade-proposals - Get pending trade proposals made by a user
- GET /api/user/[id]/received-offers - Get pending trade offers received by a user
- GET /api/user/[id]/active-trades - Get active trades (in negotiation) for a user
- GET /api/user/[id]/completed-trades - Get completed trades for a user
 
 ### Chat & Messages Endpoints
- GET /api/socketio - Socket.IO connection handler
- POST /api/socketio - Socket.IO connection handler
- GET /api/chat/[roomId] - Get chat details by room ID
- GET /api/chat/user - Get all chats for a specific user
- POST /api/chat/create - Create a new chat room
- GET /api/messages - Get messages for a specific chat
- POST /api/messages - Create a new message
  
  ### Review Endpoints
- POST /api/review/create - Create a new review
- GET /api/review/get/[id] - Get reviews for a specific user
- DELETE /api/review/delete - Delete a review
  
  ### Report Endpoints
- POST /api/report/create - Create a new report
- GET /api/report/all - Get all reports (admin endpoint)
  
  ### Notification Endpoints
- POST /api/Notifications/create - Create a new notification
- GET /api/Notifications/getNotifications - Get notifications for a user
- PUT /api/Notifications/getNotifications - Mark notifications as read
  
  ### Email Endpoints
- POST /api/email/email-verification - Send email verification code
- POST /api/email/receive_trade_proposal - Send email about received trade proposal
- POST /api/email/accept_trade_email - Send email about accepted trade
- POST /api/email/trade_flow_email - Send email about trade flow
- POST /api/email/Completion_Email - Send email about completed trade
- POST /api/email - Send a test email
  
  ### Categories Endpoint
- GET /api/categories - Get all categories

# Installlation Requirements

  - Todo:

### Local Setup

git clone https://github.com/Mobinnnmm/thebarterapp.git
cd barter
npm install
npm run dev

## Public Server:

- TODO:

## Test account credintials

- TODO

## 🚀 Features

- Create listings with images, categories, tags, and item descriptions
- Explore nearby listings using an interactive map
- Make and manage trade offers
- User authentication and profile management
- Real-time updates and notifications
- Ability to chat with other users


