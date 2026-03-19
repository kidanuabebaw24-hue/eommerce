# MarketBridge Frontend

React-based frontend application for the MarketBridge marketplace.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProductList.jsx
│   │   └── ...
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── ...
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Prerequisites

- Node.js 18+ and npm 9+
- Backend API running on `http://localhost:8080`

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Application runs on: `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Configuration

### API URL
Update in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:8080/api/v1';
```

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Features

### Authentication
- Login/Logout
- Registration with payment
- JWT token management
- Protected routes

### Product Management
- Browse products
- Search and filter
- Product details
- Create/Edit products (Sellers)

### User Features
- User profile
- Wishlist
- Messages
- Transaction history

### Admin Features
- User management
- Analytics dashboard
- Message moderation
- System overview

## Components

### Layout Components
- `MainLayout` - Page wrapper with navbar
- `Navbar` - Navigation bar
- `ErrorBoundary` - Error handling

### Route Protection
- `ProtectedRoute` - Requires authentication
- `AdminRoute` - Admin-only access
- `NonAdminRoute` - Non-admin access

### UI Components
- `ProductCard` - Product display
- `Skeleton` - Loading states
- `ContactSellerModal` - Contact form

## Services

### API Service (`api.js`)
Axios instance with:
- Base URL configuration
- Request interceptors (JWT)
- Response interceptors (error handling)

### Feature Services
- `authService` - Authentication
- `productService` - Products
- `profileService` - User profiles
- `messageService` - Messaging
- `paymentService` - Payments
- `adminService` - Admin operations

## Routing

```javascript
/ - Home (Product list)
/login - Login page
/register - Registration
/registration-payment - Payment selection
/registration-verify - Payment verification
/complete-registration - Registration form
/products/:id - Product details
/create-product - Create product
/profile - User profile
/messages - User messages
/wishlist - Saved products
/transactions - Transaction history
/admin - Admin dashboard
/admin/analytics - Analytics
/admin/messages - Message moderation
```

## State Management

### Context API
- `AuthContext` - Authentication state
  - User info
  - Login/Logout functions
  - Token management

### Local Storage
- JWT token
- User preferences
- Cart data (if applicable)

## Styling

### Tailwind CSS
Utility-first CSS framework

### Custom Styles
Global styles in `index.css`

### Responsive Design
Mobile-first approach with breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Linting

```bash
# Run ESLint
npm run lint

# Fix issues
npm run lint:fix
```

## Building

```bash
# Production build
npm run build

# Analyze bundle
npm run build -- --analyze
```

## Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### Manual
1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure redirects for SPA

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX
```

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Bundle size optimization
- Lazy loading routes
- Memoization with React.memo

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 5173 already in use
```bash
# Kill process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### API connection failed
- Check backend is running
- Verify API_URL in `api.js`
- Check CORS configuration

### Build failed
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Follow React best practices
2. Use functional components
3. Implement proper error handling
4. Write meaningful commit messages
5. Test before submitting PR

## Documentation

- [Frontend Implementation Guide](../docs/guides/FRONTEND_IMPLEMENTATION_GUIDE.md)
- [Page Functions](../docs/guides/PAGE_FUNCTIONS.md)
- [API Documentation](../docs/api/API_DOCUMENTATION.md)
