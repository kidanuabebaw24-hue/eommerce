# MarketBridge

A full-stack marketplace application built with Spring Boot and React, featuring Chapa payment integration for registration fees.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Buyer, Seller)
- **Product Management**: Create, list, search, and manage products
- **Payment Integration**: Chapa payment gateway for registration fees
- **Messaging System**: Direct communication between buyers and sellers
- **Admin Dashboard**: Analytics, user management, and message moderation
- **Wishlist & Favorites**: Save and track favorite products
- **Reviews & Ratings**: Product review system
- **Transaction Management**: Track purchases and sales

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- PostgreSQL 12+
- Maven 3.6+
- Chapa account (for payment integration)

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📁 Project Structure

```
MarketBridge/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/java/com/marketplace/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST API controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── security/            # Security configuration
│   │   │   ├── service/             # Business logic
│   │   │   └── specification/       # JPA specifications
│   │   └── resources/
│   │       ├── application.yml      # Application configuration
│   │       └── static/              # Static resources
│   ├── pom.xml              # Maven configuration
│   └── README.md            # Backend documentation
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── App.jsx          # Main application component
│   ├── package.json
│   └── README.md            # Frontend documentation
├── docs/                    # Project documentation
│   ├── api/                 # API documentation
│   ├── guides/              # Implementation guides
│   └── setup/               # Setup instructions
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MarketBridge
```

### 2. Configure Database
Create a PostgreSQL database:
```sql
CREATE DATABASE marketplace_db;
```

Update `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/marketplace_db
    username: your_username
    password: your_password
```

### 3. Configure Chapa (Optional)
Get API keys from [Chapa Dashboard](https://dashboard.chapa.co) and update `backend/src/main/resources/application.yml`:
```yaml
chapa:
  secret-key: CHASECK_TEST-your-secret-key
  public-key: CHAPUBK_TEST-your-public-key
```

### 4. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 🔐 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

## 📚 Documentation

- [API Documentation](docs/api/API_DOCUMENTATION.md)
- [Database Schema](docs/api/DATABASE_SCHEMA.md)
- [Chapa Integration Guide](docs/guides/CHAPA_INTEGRATION_GUIDE.md)
- [Frontend Implementation](docs/guides/FRONTEND_IMPLEMENTATION_GUIDE.md)
- [Page Functions](docs/guides/PAGE_FUNCTIONS.md)

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/marketplace_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000

# Chapa
CHAPA_SECRET_KEY=CHASECK_TEST-your-key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-your-key

# Email (Optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/marketbridge-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (Seller)
- `PUT /api/v1/products/{id}` - Update product (Seller)
- `DELETE /api/v1/products/{id}` - Delete product (Seller)

### Payments
- `GET /api/v1/registration-payment/fees` - Get registration fees
- `POST /api/v1/registration-payment/initiate` - Initiate payment
- `POST /api/v1/registration-payment/verify/{ref}` - Verify payment

See [API Documentation](docs/api/API_DOCUMENTATION.md) for complete endpoint list.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the frontend library
- Chapa for payment gateway integration
- All contributors who helped with the project

## 📞 Support

For support, email support@marketbridge.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Bulk product upload
- [ ] Export functionality

## 📊 Project Status

Active development - Version 0.0.1-SNAPSHOT
