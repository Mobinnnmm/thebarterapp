
# 📧 `api/email/`

This folder contains API routes and utilities for sending various **email notifications** in the Barter marketplace app. These emails are used to notify users about key actions in the trade flow, account verification, and other important activities.

---

## 📁 Email Types

### 📩 `POST /api/email/acceptTrade`
- **Purpose:** Send an email to notify a user when a trade offer is accepted.
- **Trigger:** When a user accepts a trade proposal.
- **Recipient:** Trade offer recipient
- **Subject:** "Your Trade Proposal Has Been Accepted!"
- **Content:** Includes details about the accepted trade, including items, user names, and next steps.

---

### 📩 `POST /api/email/completion`
- **Purpose:** Notify a user when a trade has been completed.
- **Trigger:** After a trade has been marked as completed.
- **Recipient:** Both users involved in the trade
- **Subject:** "Your Trade Has Been Completed!"
- **Content:** Confirms the completion of the trade and any next steps.

---

### 📩 `POST /api/email/emailVerification`
- **Purpose:** Send an email to verify the user's email address upon registration.
- **Trigger:** When a new user registers on the platform.
- **Recipient:** The newly registered user
- **Subject:** "Please Verify Your Email Address"
- **Content:** A link for the user to click to verify their email address. Usually expires after a set period.

---

### 📩 `POST /api/email/receiveTradeProposal`
- **Purpose:** Notify a user when they receive a trade proposal.
- **Trigger:** When a user receives a trade proposal for one of their listed items.
- **Recipient:** The user receiving the proposal
- **Subject:** "You Have Received a Trade Proposal!"
- **Content:** Includes details about the trade proposal, including proposed items, trade details, and a link to view or respond.

---

### 📩 `POST /api/email/tradeFlow`
- **Purpose:** Notify users about various updates during the trade flow.
- **Trigger:** Multiple steps in the trade process (e.g., new offer, trade accepted, trade completed).
- **Recipient:** The users involved in the trade
- **Subject:** Varies based on action (e.g., "Trade Proposal Sent", "Trade Accepted", "Trade Completed")
- **Content:** Provides relevant details about the trade step, including a summary of actions taken and next steps.

---

## 🛡️ Security & Reliability

- Emails are sent securely using a trusted email provider.
- Ensure email content does not expose sensitive information (e.g., passwords or personal data).
- Include a unique verification token in verification emails to prevent unauthorized actions.
- Use rate-limiting to avoid spam or excessive email sending.