# MarketBridge Backend

Spring Boot REST API for the MarketBridge marketplace application.

## Tech Stack

- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Payment**: Chapa Integration

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/marketplace/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── security/            # Security components
│   │   │   ├── service/             # Business logic
│   │   │   └── specification/       # JPA specifications
│   │   └── resources/
│   │       ├── application.yml      # Main configuration
│   │       └── static/              # Static resources
│   └── test/                        # Test files
├── target/                          # Build output
├── pom.xml                          # Maven configuration
└── README.md                        # This file
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Configuration

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE marketplace_db;
```

2. Update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/marketplace_db
    username: your_username
    password: your_password
```

### JWT Configuration

Update JWT secret in `application.yml`:
```yaml
app:
  jwt:
    secret: your-secret-key-min-256-bits
    expiration-ms: 86400000
```

### Chapa Configuration (Optional)

For payment integration:
```yaml
chapa:
  secret-key: ${CHAPA_SECRET_KEY:CHASECK_TEST-your-key}
  public-key: ${CHAPA_PUBLIC_KEY:CHAPUBK_TEST-your-key}
```

## Running the Application

### Development Mode

```bash
# From backend directory
mvn spring-boot:run
```

Server starts on: `http://localhost:8080`

### Build for Production

```bash
mvn clean package
java -jar target/marketbridge-0.0.1-SNAPSHOT.jar
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

### Users
- `GET /api/v1/profile/user/{username}` - Get profile
- `PUT /api/v1/profile` - Update profile

### Payments
- `POST /api/v1/registration-payment/initiate` - Initiate payment
- `POST /api/v1/registration-payment/verify/{ref}` - Verify payment

### Admin
- `GET /api/v1/admin/users` - List users
- `GET /api/v1/analytics/overview` - Analytics overview

See [API Documentation](../docs/api/API_DOCUMENTATION.md) for complete list.

## Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn clean test jacoco:report
```

## Database Migrations

The application uses Hibernate's `ddl-auto: update` for development. For production, consider using Flyway or Liquibase.

## Environment Variables

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/marketplace_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=86400000

# Chapa
CHAPA_SECRET_KEY=CHASECK_TEST-your-key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-your-key

# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Default Users

On first run, the application creates:

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Roles: ADMIN, BUYER, SELLER

## Security

- JWT-based authentication
- BCrypt password encryption
- Role-based access control (RBAC)
- CORS configuration for frontend
- SQL injection prevention via JPA

## Logging

Logs are configured in `application.yml`:
- Console output in development
- File output in production
- Different log levels per package

## Performance

- Connection pooling (HikariCP)
- Query optimization
- Lazy loading for relationships
- Pagination for large datasets
- Caching strategies (can be added)

## Troubleshooting

### Port 8080 already in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Database connection failed
- Check PostgreSQL is running
- Verify credentials
- Check firewall settings

### Build failed
```bash
mvn clean install -U
```

## Contributing

1. Create feature branch
2. Write tests
3. Follow code style
4. Submit pull request

## Documentation

- [API Documentation](../docs/api/API_DOCUMENTATION.md)
- [Database Schema](../docs/api/DATABASE_SCHEMA.md)
- [Service Layer Guide](../docs/api/SERVICE_LAYER_GUIDE.md)
- [Installation Guide](../docs/setup/INSTALLATION.md)
