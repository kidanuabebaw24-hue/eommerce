# MarketBridge - Page Functions & Descriptions

## 📋 Table of Contents
- [Public Pages](#public-pages)
- [Authentication Pages](#authentication-pages)
- [Buyer/Seller Pages](#buyerseller-pages)
- [Seller Pages](#seller-pages)
- [Admin Pages](#admin-pages)
- [Shared Components](#shared-components)

---

## 🌐 Public Pages

### 1. **Product List (Home Page)** - `/`
**Purpose:** Main marketplace discovery page where users browse available products.

**Functions:**
- Display all available products in a grid/list view
- Filter products by category (Electronics, Fashion, Home & Garden, etc.)
- Search products by keywords
- Sort products by price, date, popularity
- View product cards with image, title, price, and seller info
- Click on products to view details
- Accessible to everyone (no login required)

**User Actions:**
- Browse products
- Search and filter
- Navigate to product details
- Sign up/Login prompts for actions requiring authentication

---

### 2. **Product Details** - `/products/:id`
**Purpose:** Detailed view of a specific product with full information.

**Functions:**
- Display product images (gallery/carousel)
- Show product title, description, price, location
- Display seller information and rating
- Show product category and status (Available/Sold)
- View product reviews and ratings
- Contact seller button (opens modal)
- Add to wishlist button (requires login)
- Purchase/Buy button (requires login)
- Related products suggestions

**User Actions:**
- View complete product information
- Contact seller via message
- Add to wishlist
- Initiate purchase
- Read reviews
- View seller profile

---

## 🔐 Authentication Pages

### 3. **Login** - `/login`
**Purpose:** User authentication page for existing users.

**Functions:**
- Username/email input field
- Password input field
- "Remember me" option
- Login button
- Forgot password link
- Redirect to registration page
- JWT token generation on successful login
- Store user credentials in localStorage
- Redirect to dashboard after login

**User Actions:**
- Enter credentials
- Submit login form
- Navigate to registration
- Reset password

---

### 4. **Register** - `/register`
**Purpose:** New user account creation page.

**Functions:**
- Username input field
- Full name input field
- Email input field
- Password input field (with strength indicator)
- Confirm password field
- Role selection (Buyer/Seller)
- Terms and conditions checkbox
- Register button
- Redirect to login page
- Account creation with default PENDING status
- Email verification (optional)

**User Actions:**
- Fill registration form
- Select user role
- Accept terms
- Create account
- Navigate to login

---

## 🛒 Buyer/Seller Pages

### 5. **Wishlist** - `/wishlist`
**Purpose:** Personal collection of favorite/saved products for future reference.

**Functions:**
- Display all products added to wishlist
- Show product image, title, price, seller
- Remove from wishlist button
- Navigate to product details
- Empty state when no items
- Quick add to cart/buy option
- Filter by category or price range

**User Actions:**
- View saved products
- Remove items from wishlist
- Navigate to product details
- Purchase wishlist items

**Access:** Buyers and Sellers only (not Admin-only users)

---

### 6. **Transactions** - `/transactions`
**Purpose:** View personal buying and selling transaction history.

**Functions:**
- Two tabs: "Purchases" and "Sales"
- Display transaction list with:
  - Product information
  - Transaction amount
  - Transaction status (Success/Pending/Failed)
  - Date and time
  - Buyer/Seller information
- Filter by status or date
- Transaction details view
- Download receipt/invoice
- Empty state for no transactions

**User Actions:**
- View purchase history
- View sales history
- Check transaction status
- Download receipts
- Contact support for issues

**Access:** Buyers and Sellers only (not Admin-only users)

---

### 7. **User Profile** - `/profile`
**Purpose:** Personal profile management and settings.

**Functions:**
- View and edit profile information:
  - Profile photo upload
  - Full name
  - Email
  - Phone number
  - Location (city, country)
  - Bio/About me
- Business information (for sellers):
  - Business name
  - Business registration number
- Social media links (Facebook, Twitter, LinkedIn)
- Verification status display
- Upload verification documents
- Change password
- Account settings
- Delete account option

**User Actions:**
- Update profile information
- Upload profile photo
- Submit verification documents
- Change password
- Manage account settings

**Access:** Buyers and Sellers only (not Admin-only users)

---

## 🏪 Seller Pages

### 8. **Create Product** - `/create-product`
**Purpose:** Form for sellers to list new products for sale.

**Functions:**
- Product information form:
  - Title input
  - Description textarea
  - Price input
  - Category selection dropdown
  - Location input
- Image upload (multiple images)
  - Drag and drop support
  - Image preview
  - Remove uploaded images
- Product status selection (Available/Sold)
- Submit button
- Form validation
- Success/error notifications
- Redirect to product details after creation

**User Actions:**
- Fill product details
- Upload product images
- Select category
- Set price and location
- Submit listing

**Access:** Sellers only (not Admin-only users or regular Buyers)

---

### 9. **Messages (Seller Inbox)** - `/messages`
**Purpose:** Inbox for sellers to receive and respond to buyer inquiries.

**Functions:**
- Message list view:
  - Sender name and email
  - Message preview
  - Product inquiry reference
  - Read/Unread status
  - Timestamp
- Message detail view:
  - Full message content
  - Sender information
  - Product link
  - Reply via email button
- Filter messages:
  - All messages
  - Unread only
- Mark as read functionality
- Search messages
- Empty state for no messages

**User Actions:**
- Read buyer inquiries
- Reply via email
- Mark messages as read
- Navigate to product
- Search and filter messages

**Access:** Sellers only (not Admin-only users or regular Buyers)

---

## 👨‍💼 Admin Pages

### 10. **Admin Dashboard** - `/admin`
**Purpose:** Central hub for platform administration and user management.

**Functions:**
- User management table:
  - List all registered users
  - Display user details (username, email, roles, status)
  - User status indicators (Active, Pending, Suspended, Rejected)
- User moderation actions:
  - Approve pending users
  - Suspend active users
  - Reject/ban users
- Search users by username or email
- Filter by user status
- User statistics:
  - Total users count
  - Pending approvals count
  - Active users count
- Refresh data button
- Two tabs: "User Management" and "Global Listings"

**User Actions:**
- View all platform users
- Approve new user registrations
- Suspend problematic users
- Ban/reject users
- Search and filter users
- Monitor user activity

**Access:** Admin role only

---

### 11. **Admin Analytics** - `/admin/analytics`
**Purpose:** Platform-wide analytics and business intelligence dashboard.

**Functions:**
- Overview statistics cards:
  - **Total Users:** Registered accounts count
  - **Total Products:** Listed items count
  - **Total Revenue:** All-time earnings ($0 in screenshot)
  - **Transactions:** Completed sales count
- Additional analytics (expandable):
  - Revenue trends over time
  - Category performance
  - Top sellers ranking
  - User growth metrics
  - Transaction success rate
  - Popular products
  - Geographic distribution
- Date range filters
- Export data functionality
- Visual charts and graphs

**User Actions:**
- View platform statistics
- Analyze business metrics
- Monitor growth trends
- Export reports
- Make data-driven decisions

**Access:** Admin role only

---

### 12. **Admin Messages (Message Moderation)** - `/admin/messages`
**Purpose:** Platform-wide message monitoring and moderation system.

**Functions:**
- Message statistics dashboard:
  - Total messages count
  - Unread messages count
  - Read rate percentage
  - Recent messages (last 7 days)
- All messages table view:
  - Message status (read/unread)
  - Sender information (name, email)
  - Recipient (seller) username
  - Product inquiry link
  - Timestamp
  - Delete action button
- Message filtering:
  - All messages
  - Unread only
  - Read only
- Advanced search:
  - Search by sender name
  - Search by sender email
  - Search by product title
  - Search by recipient username
- Message detail modal:
  - Full message content
  - Complete sender/recipient info
  - Product reference
  - Delete functionality
- Content moderation:
  - Delete inappropriate messages
  - Monitor communication patterns
  - Identify spam or abuse

**User Actions:**
- View all platform messages
- Monitor buyer-seller communications
- Delete inappropriate content
- Search and filter messages
- View message statistics
- Ensure platform safety

**Access:** Admin role only

---

## 🔄 Shared Components

### 13. **Contact Seller Modal** (Component)
**Purpose:** Allow buyers to send inquiries to product sellers.

**Functions:**
- Modal popup overlay
- Contact form fields:
  - Sender name input
  - Sender email input
  - Message textarea
- Product reference display
- Send button
- Form validation
- Email notification to seller
- Success/error messages
- Close modal button

**User Actions:**
- Fill contact form
- Send inquiry to seller
- Close modal

**Access:** Available on product detail pages for all users

---

## 📊 Page Access Summary

| Page | Public | Buyer/Seller | Admin |
|------|--------|--------------|-------|
| Product List | ✅ | ✅ | ✅ |
| Product Details | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Register | ✅ | ✅ | ✅ |
| Wishlist | ❌ | ✅ | ❌ |
| Transactions | ❌ | ✅ | ❌ |
| User Profile | ❌ | ✅ | ❌ |
| Create Product | ❌ | ✅ (Sellers) | ❌ |
| Messages (Inbox) | ❌ | ✅ (Sellers) | ❌ |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Admin Analytics | ❌ | ❌ | ✅ |
| Admin Messages | ❌ | ❌ | ✅ |

---

## 🎯 Key Features by Role

### **Public Users (Not Logged In)**
- Browse products
- Search and filter
- View product details
- Register/Login

### **Buyers**
- All public features
- Add to wishlist
- Purchase products
- View transaction history
- Manage profile
- Contact sellers

### **Sellers**
- All buyer features
- Create product listings
- Manage inventory
- Receive buyer inquiries
- View sales analytics
- Respond to messages

### **Admins**
- Platform oversight
- User management (approve/suspend/ban)
- View all analytics
- Monitor all messages
- Content moderation
- Platform statistics

---

## 🔒 Security & Access Control

### Route Protection
- **Public Routes:** No authentication required
- **Protected Routes:** Require login (JWT token)
- **Role-Based Routes:** Require specific roles (Buyer, Seller, Admin)
- **Admin Routes:** Require ADMIN role only

### Access Restrictions
- Admin-only users cannot access buyer/seller features
- Buyers cannot access seller-specific pages
- Non-authenticated users redirected to login
- Unauthorized access redirected to appropriate page

---

## 📱 Responsive Design
All pages are fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

---

## 🎨 UI/UX Features
- Modern, clean design with rounded corners
- Consistent color scheme (Blue primary, Slate secondary)
- Loading skeletons for better UX
- Toast notifications for user feedback
- Empty states for no data
- Hover effects and transitions
- Accessible forms with validation
- Error boundaries for crash prevention

---

*Last Updated: March 2026*
*Version: 1.0.0*
