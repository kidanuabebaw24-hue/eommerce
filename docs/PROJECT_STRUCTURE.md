# Project Structure

Detailed explanation of the MarketBridge project structure.

## Root Directory

```
MarketBridge/
├── backend/                # Spring Boot backend application
├── frontend/               # React frontend application
├── docs/                   # Documentation
├── README.md               # Project overview
└── .gitignore             # Git ignore rules
```

## Backend Structure (`backend/`)

### Root Files
- `pom.xml` - Maven configuration
- `README.md` - Backend documentation
- `target/` - Build output (gitignored)

### Source Code (`backend/src/main/java/com/marketplace/`)

### Configuration (`config/`)
Application configuration classes:
- `ApplicationConfig.java` - Bean configurations
- `SecurityConfig.java` - Security and CORS setup
- `WebConfig.java` - Web MVC configuration
- `DataInitializer.java` - Initial data seeding
- `RestTemplateConfig.java` - HTTP client configuration

### Controllers (`controller/`)
REST API endpoints:
- `AuthController.java` - Authentication endpoints
- `ProductController.java` - Product CRUD operations
- `UserProfileController.java` - User profile management
- `PaymentController.java` - Payment processing
- `TransactionController.java` - Transaction management
- `MessageController.java` - Messaging system
- `AdminController.java` - Admin operations
- `AnalyticsController.java` - Analytics endpoints
- `RegistrationPaymentController.java` - Registration payment flow

### DTOs (`dto/`)
Data Transfer Objects for API requests/responses:
- Request DTOs: `*Request.java`
- Response DTOs: `*Response.java`
- Organized by feature (Product, User, Payment, etc.)

### Entities (`entity/`)
JPA database entities:
- `User.java` - User account
- `Role.java` - User roles
- `Product.java` - Product listings
- `Category.java` - Product categories
- `Transaction.java` - Purchase transactions
- `Payment.java` - Payment records
- `Message.java` - User messages
- `Review.java` - Product reviews
- `Favorite.java` - User favorites
- `UserProfile.java` - Extended user information
- `RegistrationPayment.java` - Registration fee payments

### Repositories (`repository/`)
Data access layer (Spring Data JPA):
- One repository per entity
- Custom query methods
- JPA specifications for complex queries

### Security (`security/`)
Security components:
- `JwtService.java` - JWT token generation/validation
- `JwtAuthenticationFilter.java` - JWT filter
- `UserDetailsServiceImpl.java` - User details loading

### Services (`service/`)
Business logic layer:
- `*Service.java` - Service classes
- Transaction management
- Business rules enforcement
- Integration with external APIs (Chapa)

### Specifications (`specification/`)
JPA Criteria API specifications:
- `ProductSpecification.java` - Dynamic product queries
- Used for advanced search and filtering

## Frontend Structure (`frontend/src/`)

### Components (`components/`)
Reusable React components:
- `Navbar.jsx` - Navigation bar
- `MainLayout.jsx` - Page layout wrapper
- `ProductCard.jsx` - Product display card
- `ProtectedRoute.jsx` - Route protection
- `AdminRoute.jsx` - Admin-only routes
- `NonAdminRoute.jsx` - Non-admin routes
- `ErrorBoundary.jsx` - Error handling
- `Skeleton.jsx` - Loading skeletons
- `ContactSellerModal.jsx` - Contact form modal

### Context (`context/`)
React Context providers:
- `AuthContext.jsx` - Authentication state management

### Pages (`pages/`)
Page components:
- `Login.jsx` - Login page
- `Register.jsx` - Registration landing
- `RegistrationPayment.jsx` - Payment selection
- `RegistrationVerify.jsx` - Payment verification
- `CompleteRegistration.jsx` - Registration form
- `ProductList.jsx` - Product listing
- `ProductDetails.jsx` - Product details
- `CreateProduct.jsx` - Product creation
- `UserProfile.jsx` - User profile
- `Messages.jsx` - User messages
- `Wishlist.jsx` - Saved products
- `Transactions.jsx` - Transaction history
- `AdminDashboard.jsx` - Admin overview
- `AdminAnalytics.jsx` - Analytics dashboard
- `AdminMessages.jsx` - Message moderation

### Services (`services/`)
API service layer:
- `api.js` - Axios configuration
- `authService.js` - Authentication API
- `productService.js` - Product API
- `profileService.js` - Profile API
- `messageService.js` - Message API
- `paymentService.js` - Payment API
- `transactionService.js` - Transaction API
- `adminService.js` - Admin API
- `analyticsService.js` - Analytics API

### Styles
- `index.css` - Global styles
- Tailwind CSS for component styling

## Documentation Structure (`docs/`)

### API Documentation (`api/`)
- `API_DOCUMENTATION.md` - Complete API reference
- `DATABASE_SCHEMA.md` - Database structure
- `DTO_GUIDE.md` - DTO documentation
- `REPOSITORY_GUIDE.md` - Repository patterns
- `SERVICE_LAYER_GUIDE.md` - Service layer guide

### Guides (`guides/`)
- `CHAPA_INTEGRATION_GUIDE.md` - Chapa payment setup
- `CHAPA_SETUP_QUICK_START.md` - Quick Chapa guide
- `REGISTRATION_PAYMENT_GUIDE.md` - Registration flow
- `FRONTEND_IMPLEMENTATION_GUIDE.md` - Frontend guide
- `PAGE_FUNCTIONS.md` - Page functionality

### Setup (`setup/`)
- `INSTALLATION.md` - Installation instructions
- `DEPLOYMENT.md` - Deployment guide (to be created)

## Resources (`backend/src/main/resources/`)

```
resources/
├── application.yml         # Main configuration
├── application-dev.yml     # Development config
├── application-prod.yml    # Production config
└── static/                 # Static resources
```

## Build Output

### Backend (`backend/target/`)
- Compiled classes
- JAR file
- Test reports

### Frontend (`frontend/dist/`)
- Optimized production build
- Static assets
- Index HTML

## Configuration Files

### Backend
- `backend/pom.xml` - Maven dependencies and build config
- `backend/src/main/resources/application.yml` - Application properties

### Frontend
- `frontend/package.json` - npm dependencies
- `frontend/vite.config.js` - Vite build configuration
- `frontend/eslint.config.js` - ESLint rules
- `frontend/index.html` - HTML template

## Key Design Patterns

### Backend
- **MVC Pattern**: Controller → Service → Repository
- **DTO Pattern**: Separate API models from entities
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Spring IoC container
- **Builder Pattern**: Entity construction (Lombok)

### Frontend
- **Component-Based**: Reusable React components
- **Context API**: Global state management
- **Service Layer**: API abstraction
- **Route Protection**: HOC for authentication
- **Lazy Loading**: Code splitting for performance

## Naming Conventions

### Backend
- **Classes**: PascalCase (`UserService`)
- **Methods**: camelCase (`findUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Packages**: lowercase (`com.marketplace.service`)

### Frontend
- **Components**: PascalCase (`ProductCard.jsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **CSS Classes**: kebab-case (`product-card`)

## Best Practices

### Backend
- Use DTOs for API communication
- Keep controllers thin, services fat
- Use transactions for data consistency
- Validate input at controller level
- Handle exceptions globally
- Log important operations

### Frontend
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement error boundaries
- Optimize re-renders with memo
- Use lazy loading for routes
- Handle loading and error states

## Security Considerations

### Backend
- JWT for authentication
- CORS configuration
- SQL injection prevention (JPA)
- Password encryption (BCrypt)
- Role-based access control
- Input validation

### Frontend
- Token storage in localStorage
- Protected routes
- CSRF protection
- XSS prevention
- Secure API calls
- Environment variables for secrets

## Performance Optimization

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Caching strategies
- Lazy loading relationships
- Pagination for large datasets

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- Memoization
- Virtual scrolling for lists

## Testing Structure

### Backend Tests
```
backend/src/test/java/com/marketplace/
├── controller/     # Controller tests
├── service/        # Service tests
├── repository/     # Repository tests
└── integration/    # Integration tests
```

### Frontend Tests
```
frontend/src/
├── __tests__/      # Test files
├── __mocks__/      # Mock data
└── setupTests.js   # Test configuration
```

## Deployment Structure

### Development
- Local PostgreSQL
- Local backend (port 8080)
- Local frontend (port 5173)

### Production
- Cloud database (AWS RDS, etc.)
- Backend on cloud (Heroku, AWS, etc.)
- Frontend on CDN (Vercel, Netlify, etc.)

## Maintenance

### Regular Tasks
- Update dependencies
- Review security vulnerabilities
- Monitor logs
- Backup database
- Update documentation
- Code reviews

### Monitoring
- Application logs
- Error tracking
- Performance metrics
- User analytics
- Payment transactions
