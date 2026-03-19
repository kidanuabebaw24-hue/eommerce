# Registration Payment System

## Overview
The MarketBridge platform requires users to pay a one-time registration fee before creating an account. This monetization strategy ensures committed users and generates revenue.

## Registration Fees
- **Buyer**: $10.00
- **Seller**: $50.00

Fees are configurable in `src/main/resources/application.yml`:
```yaml
registration:
  fee:
    buyer: 10.00
    seller: 50.00
```

## User Flow

### 1. Registration Landing Page (`/register`)
- User sees information about registration fees
- Displays benefits of joining the platform
- "Continue to Payment" button redirects to payment page

### 2. Payment Selection (`/registration-payment`)
- User selects role (Buyer or Seller)
- Displays corresponding registration fee
- Initiates payment process
- Stores `paymentId` and `role` in localStorage

### 3. Payment Verification (`/registration-verify`)
- User enters verification code
- **Demo Mode**: Use code `DEMO123` to proceed
- In production, code would be sent via email/SMS
- Validates payment with backend

### 4. Complete Registration (`/complete-registration`)
- User fills out registration form:
  - Full Name
  - Email
  - Username
  - Password
- Backend validates payment before creating account
- Payment is marked as "used" to prevent reuse
- User is redirected to login page

## Backend Implementation

### Entities

#### RegistrationPayment
```java
@Entity
@Table(name = "registration_payments")
public class RegistrationPayment {
    private Long id;
    private String paymentReference;  // Unique: REG-XXXXXXXX
    private String email;
    private String fullName;
    private String username;
    private UserRole userRole;        // BUYER or SELLER
    private BigDecimal amount;
    private PaymentStatus status;     // PENDING, SUCCESS, FAILED, EXPIRED
    private String paymentMethod;
    private Boolean isVerified;
    private Boolean isUsed;           // Prevents payment reuse
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
}
```

### API Endpoints

#### Get Registration Fees
```
GET /api/v1/registration-payment/fees
Response: {"BUYER": 10.0, "SELLER": 50.0}
```

#### Initiate Payment
```
POST /api/v1/registration-payment/initiate
Request: {
  "email": "user@example.com",
  "fullName": "John Doe",
  "username": "johndoe",
  "userRole": "BUYER",
  "amount": 10.00,
  "paymentMethod": "CREDIT_CARD"
}
Response: {
  "paymentReference": "REG-A1B2C3D4",
  "amount": 10.00,
  "status": "PENDING",
  "checkoutUrl": "http://localhost:5173/payment/checkout/REG-A1B2C3D4"
}
```

#### Verify Payment
```
POST /api/v1/registration-payment/verify
Request: {
  "paymentReference": "REG-A1B2C3D4",
  "verificationCode": "DEMO123"
}
Response: 200 OK
```

#### Get Payment Status
```
GET /api/v1/registration-payment/status/{paymentReference}
Response: {
  "paymentReference": "REG-A1B2C3D4",
  "status": "SUCCESS",
  "isVerified": true,
  "isUsed": false
}
```

### Registration with Payment Validation

The `AuthService.register()` method validates payment before creating user:

```java
public AuthenticationResponse register(RegistrationRequest request) {
    // Validate payment
    if (!registrationPaymentService.isPaymentValidForRegistration(request.getPaymentId())) {
        throw new RuntimeException("Invalid or expired payment");
    }
    
    // Create user account
    // ...
    
    // Mark payment as used
    registrationPaymentService.markPaymentAsUsed(request.getPaymentId());
}
```

## Security Configuration

Registration payment endpoints are publicly accessible:
```java
.requestMatchers("/api/v1/registration-payment/**").permitAll()
.requestMatchers("/api/v1/auth/register").permitAll()
```

## Frontend Pages

### Files Created
1. `frontend/src/pages/RegistrationPayment.jsx` - Payment selection
2. `frontend/src/pages/RegistrationVerify.jsx` - Payment verification
3. `frontend/src/pages/CompleteRegistration.jsx` - Registration form

### Routes Added to App.jsx
```jsx
<Route path="/registration-payment" element={<RegistrationPayment />} />
<Route path="/registration-verify" element={<RegistrationVerify />} />
<Route path="/complete-registration" element={<CompleteRegistration />} />
```

## Testing the Flow

### Demo Mode Testing
1. Navigate to `http://localhost:5173/register`
2. Click "Continue to Payment"
3. Select role (Buyer or Seller)
4. Click "Pay & Continue"
5. Enter verification code: `DEMO123`
6. Click "Verify & Continue"
7. Fill registration form
8. Click "Complete Registration"
9. Login with new credentials

### Backend Testing
```bash
# Get fees
curl http://localhost:8080/api/v1/registration-payment/fees

# Initiate payment
curl -X POST http://localhost:8080/api/v1/registration-payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "username": "testuser",
    "userRole": "BUYER",
    "amount": 10.00,
    "paymentMethod": "CREDIT_CARD"
  }'

# Verify payment (use paymentReference from above)
curl -X POST http://localhost:8080/api/v1/registration-payment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "paymentReference": "REG-XXXXXXXX",
    "verificationCode": "DEMO123"
  }'
```

## Production Integration

### Payment Gateway Integration
Replace mock implementation in `RegistrationPaymentService.generateCheckoutUrl()` with:
- Stripe
- PayPal
- Square
- Other payment processors

### Verification Code Delivery
Implement email/SMS service to send verification codes:
```java
// In initiateRegistrationPayment()
String verificationCode = generateVerificationCode();
emailService.sendVerificationCode(request.getEmail(), verificationCode);
```

### Payment Webhook
Add webhook endpoint to receive payment confirmations from gateway:
```java
@PostMapping("/webhook/payment")
public ResponseEntity<?> handlePaymentWebhook(@RequestBody PaymentWebhookEvent event) {
    registrationPaymentService.processPaymentWebhook(event);
    return ResponseEntity.ok().build();
}
```

## Database Schema

```sql
CREATE TABLE registration_payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_reference VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(100),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_reference ON registration_payments(payment_reference);
CREATE INDEX idx_email ON registration_payments(email);
CREATE INDEX idx_status ON registration_payments(status);
```

## Key Features

✅ One-time registration fee requirement
✅ Role-based pricing (Buyer vs Seller)
✅ Payment verification before account creation
✅ Payment reuse prevention
✅ Configurable fees via application.yml
✅ Demo mode for testing
✅ Clean user flow with 4 steps
✅ Secure payment validation
✅ Ready for production payment gateway integration

## Notes

- Payment records are never deleted (audit trail)
- Each payment can only be used once for registration
- Failed payments can be retried with new payment reference
- Admin users cannot be created through this flow (manual creation only)
