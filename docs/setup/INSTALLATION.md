# Installation Guide

Complete step-by-step installation guide for MarketBridge.

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

### Software Requirements
- Java Development Kit (JDK) 17 or higher
- Node.js 18+ and npm 9+
- PostgreSQL 12+
- Maven 3.6+
- Git

## Step 1: Install Prerequisites

### Install Java 17
**Windows:**
1. Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)
2. Run installer
3. Verify: `java -version`

**macOS:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### Install Node.js
**Windows/macOS:**
Download from [nodejs.org](https://nodejs.org/)

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

### Install PostgreSQL
**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Install Maven
**Windows:**
1. Download from [maven.apache.org](https://maven.apache.org/download.cgi)
2. Extract to `C:\Program Files\Maven`
3. Add to PATH

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

Verify: `mvn -version`

## Step 2: Database Setup

### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE marketplace_db;

# Create user (optional)
CREATE USER marketplace_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO marketplace_user;

# Exit
\q
```

### Verify Connection
```bash
psql -U postgres -d marketplace_db -c "SELECT version();"
```

## Step 3: Clone and Configure

### Clone Repository
```bash
git clone <repository-url>
cd MarketBridge
```

### Configure Backend
Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/marketplace_db
    username: postgres
    password: your_password
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

app:
  jwt:
    secret: your-secret-key-min-256-bits
    expiration-ms: 86400000

registration:
  fee:
    buyer: 10.00
    seller: 50.00
```

### Configure Frontend
Edit `frontend/src/services/api.js` if needed:
```javascript
const API_URL = 'http://localhost:8080/api/v1';
```

## Step 4: Install Dependencies

### Backend Dependencies
```bash
mvn clean install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

## Step 5: Run Application

### Start Backend
```bash
# From project root
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Start Frontend
```bash
# In new terminal
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

## Step 6: Verify Installation

### Check Backend
```bash
curl http://localhost:8080/api/v1/products
```

### Check Frontend
Open browser: `http://localhost:5173`

### Login
- Username: `admin`
- Password: `admin123`

## Step 7: Configure Chapa (Optional)

### Get API Keys
1. Sign up at [dashboard.chapa.co](https://dashboard.chapa.co)
2. Get test API keys from Settings

### Update Configuration
Edit `application.yml`:
```yaml
chapa:
  secret-key: CHASECK_TEST-your-key
  public-key: CHAPUBK_TEST-your-key
  api-url: https://api.chapa.co/v1
  callback-url: http://localhost:5173/registration-verify
  return-url: http://localhost:5173/registration-verify
```

### Restart Backend
```bash
# Stop with Ctrl+C
mvn spring-boot:run
```

## Troubleshooting

### Port Already in Use
**Backend (8080):**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Database Connection Failed
1. Check PostgreSQL is running
2. Verify credentials in `application.yml`
3. Check firewall settings

### Maven Build Failed
```bash
# Clear cache
mvn clean
rm -rf ~/.m2/repository

# Rebuild
mvn clean install -U
```

### npm Install Failed
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Next Steps

1. Read [API Documentation](../api/API_DOCUMENTATION.md)
2. Review [Frontend Guide](../guides/FRONTEND_IMPLEMENTATION_GUIDE.md)
3. Set up [Chapa Integration](../guides/CHAPA_INTEGRATION_GUIDE.md)
4. Explore [Page Functions](../guides/PAGE_FUNCTIONS.md)

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide.
