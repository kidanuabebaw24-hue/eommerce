# Folder Structure Reference

Quick reference guide for the MarketBridge project structure.

## Overview

MarketBridge follows a **monorepo** structure with separate backend and frontend directories.

```
MarketBridge/
├── backend/         # Spring Boot API
├── frontend/        # React application
├── docs/            # Documentation
├── README.md        # Main documentation
└── .gitignore      # Git ignore rules
```

## Backend (`backend/`)

### Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/marketplace/
│   │   │   ├── config/              # Spring configuration
│   │   │   ├── controller/          # REST endpoints
│   │   │   ├── dto/                 # Request/Response objects
│   │   │   ├── entity/              # Database entities
│   │   │   ├── repository/          # Data access
│   │   │   ├── security/            # JWT & Security
│   │   │   ├── service/             # Business logic
│   │   │   └── specification/       # Query specifications
│   │   └── resources/
│   │       ├── application.yml      # Configuration
│   │       └── static/              # Static files
│   └── test/                        # Unit & integration tests
├── target/                          # Build output (ignored)
├── pom.xml                          # Maven config
└── README.md                        # Backend docs
```

### Key Files
- `pom.xml` - Dependencies and build configuration
- `application.yml` - Database, JWT, Chapa config
- `SecurityConfig.java` - Security and CORS setup
- `DataInitializer.java` - Initial data seeding

### Running
```bash
cd backend
mvn spring-boot:run
```

## Frontend (`frontend/`)

### Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── ProductList.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   ├── services/            # API integration
│   │   ├── api.js           # Axios config
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── ...
│   ├── App.jsx              # Main component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Build output (ignored)
├── node_modules/            # Dependencies (ignored)
├── package.json             # npm config
├── vite.config.js           # Vite config
└── README.md                # Frontend docs
```

### Key Files
- `package.json` - Dependencies and scripts
- `vite.config.js` - Build configuration
- `App.jsx` - Routes and main layout
- `api.js` - API base URL and interceptors

### Running
```bash
cd frontend
npm install
npm run dev
```

## Documentation (`docs/`)

### Structure
```
docs/
├── api/                     # API documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DTO_GUIDE.md
│   ├── REPOSITORY_GUIDE.md
│   └── SERVICE_LAYER_GUIDE.md
├── guides/                  # Implementation guides
│   ├── CHAPA_INTEGRATION_GUIDE.md
│   ├── CHAPA_SETUP_QUICK_START.md
│   ├── REGISTRATION_PAYMENT_GUIDE.md
│   ├── FRONTEND_IMPLEMENTATION_GUIDE.md
│   └── PAGE_FUNCTIONS.md
├── setup/                   # Setup instructions
│   └── INSTALLATION.md
├── PROJECT_STRUCTURE.md     # Detailed structure
└── FOLDER_STRUCTURE.md      # This file
```

## Common Commands

### Backend
```bash
# Navigate to backend
cd backend

# Run application
mvn spring-boot:run

# Build
mvn clean package

# Run tests
mvn test

# Clean build
mvn clean install
```

### Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

### Both
```bash
# From project root

# Start backend
cd backend && mvn spring-boot:run

# Start frontend (in new terminal)
cd frontend && npm run dev
```

## File Naming Conventions

### Backend (Java)
- **Classes**: PascalCase (`UserService.java`)
- **Interfaces**: PascalCase with 'I' prefix optional (`UserRepository.java`)
- **Packages**: lowercase (`com.marketplace.service`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Frontend (JavaScript/React)
- **Components**: PascalCase (`ProductCard.jsx`)
- **Services**: camelCase (`authService.js`)
- **Utilities**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)

## Directory Navigation

### Quick Access
```bash
# Backend source
cd backend/src/main/java/com/marketplace

# Backend config
cd backend/src/main/resources

# Frontend components
cd frontend/src/components

# Frontend pages
cd frontend/src/pages

# Documentation
cd docs
```

## Build Outputs

### Backend
- Location: `backend/target/`
- JAR file: `backend/target/marketbridge-0.0.1-SNAPSHOT.jar`
- Classes: `backend/target/classes/`

### Frontend
- Location: `frontend/dist/`
- Entry: `frontend/dist/index.html`
- Assets: `frontend/dist/assets/`

## Configuration Files

### Backend
- `backend/pom.xml` - Maven
- `backend/src/main/resources/application.yml` - App config

### Frontend
- `frontend/package.json` - npm
- `frontend/vite.config.js` - Vite
- `frontend/eslint.config.js` - ESLint

### Root
- `.gitignore` - Git ignore
- `README.md` - Main docs

## Environment-Specific Files

### Backend
- `application.yml` - Default
- `application-dev.yml` - Development
- `application-prod.yml` - Production

### Frontend
- `.env` - Default
- `.env.local` - Local overrides
- `.env.production` - Production

## Ignored Directories

These are in `.gitignore`:
- `backend/target/` - Build output
- `frontend/node_modules/` - Dependencies
- `frontend/dist/` - Build output
- `.idea/` - IntelliJ IDEA
- `.vscode/` - VS Code

## Best Practices

### Backend
- Keep controllers thin
- Business logic in services
- Use DTOs for API
- Write tests for services
- Document complex logic

### Frontend
- Small, focused components
- Reuse common components
- Use services for API calls
- Handle loading/error states
- Implement proper routing

## Migration from Old Structure

If you had the old structure:
```
Old:
MarketBridge/
├── src/          # Backend
├── frontend/     # Frontend
└── pom.xml

New:
MarketBridge/
├── backend/      # Backend (moved src + pom.xml here)
├── frontend/     # Frontend (unchanged)
└── docs/         # Documentation
```

## Quick Start

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd MarketBridge
   ```

2. **Setup backend**
   ```bash
   cd backend
   # Configure application.yml
   mvn spring-boot:run
   ```

3. **Setup frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080
   - API Docs: http://localhost:8080/swagger-ui.html (if configured)

## Support

For detailed information:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Installation: See `docs/setup/INSTALLATION.md`
- API: See `docs/api/API_DOCUMENTATION.md`
