# Chapa Payment Integration Guide

## Overview
MarketBridge now integrates with Chapa, Ethiopia's leading payment gateway, for processing registration fees. Users are redirected to Chapa's secure checkout page to complete payment.

## Configuration

### 1. Get Chapa API Keys
1. Sign up at [https://dashboard.chapa.co](https://dashboard.chapa.co)
2. Navigate to Settings → API Keys
3. Copy your Secret Key and Public Key

### 2. Configure Application
Update `src/main/resources/application.yml`:

```yaml
chapa:
  secret-key: ${CHAPA_SECRET_KEY:CHASECK_TEST-your-secret-key-here}
  public-key: ${CHAPA_PUBLIC_KEY:CHAPUBK_TEST-your-public-key-here}
  api-url: https://api.chapa.co/v1
  callback-url: ${CHAPA_CALLBACK_URL:http://localhost:5173/registration-verify}
  return-url: ${CHAPA_RETURN_URL:http://localhost:5173/registration-verify}
```

### 3. Set Environment Variables
For production, set environment variables:

```bash
export CHAPA_SECRET_KEY=CHASECK-your-secret-key
export CHAPA_PUBLIC_KEY=CHAPUBK-your-public-key
export CHAPA_CALLBACK_URL=https://yourdomain.com/registration-verify
export CHAPA_RETURN_URL=https://yourdomain.com/registration-verify
```

## Payment Flow

### 1. User Initiates Payment
- User selects role (Buyer/Seller) on `/registration-payment`
- Frontend calls `POST /api/v1/registration-payment/initiate`
- Backend creates payment record and calls Chapa API
- User is redirected to Chapa checkout page

### 2. User Completes Payment on Chapa
- User enters payment details on Chapa's secure page
- Chapa processes the payment
- User is redirected back to `/registration-verify`

### 3. Payment Verification
- Frontend automatically calls `POST /api/v1/registration-payment/verify/{txRef}`
- Backend verifies payment with Chapa API
- If successful, user proceeds to registration form

### 4. Webhook Notification (Optional)
- Chapa sends webhook to `POST /api/v1/registration-payment/webhook/chapa`
- Backend updates payment status
- Provides redundancy in case user closes browser

## API Integration

### ChapaPaymentService

The service handles all Chapa API interactions:

#### Initialize Payment
```java
ChapaInitializeRequest request = ChapaInitializeRequest.builder()
    .amount(new BigDecimal("10.00"))
    .email("user@example.com")
    .firstName("John")
    .lastName("Doe")
    .txRef("REG-A1B2C3D4")
    .userRole("BUYER")
    .build();

ChapaInitializeResponse response = chapaPaymentService.initializePayment(request);
// response.getCheckoutUrl() -> Redirect user here
```

#### Verify Payment
```java
ChapaVerifyResponse response = chapaPaymentService.verifyPayment("REG-A1B2C3D4");
// response.getPaymentStatus() -> "success", "failed", "pending"
```

## API Endpoints

### Initialize Payment
```http
POST /api/v1/registration-payment/initiate
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe",
  "username": "johndoe",
  "userRole": "BUYER",
  "amount": 10.00,
  "paymentMethod": "CHAPA"
}

Response:
{
  "paymentReference": "REG-A1B2C3D4",
  "checkoutUrl": "https://checkout.chapa.co/checkout/payment/...",
  "amount": 10.00,
  "status": "PENDING"
}
```

### Verify Payment
```http
POST /api/v1/registration-payment/verify/REG-A1B2C3D4

Response:
{
  "status": "success",
  "message": "Payment verified successfully"
}
```

### Webhook Callback
```http
POST /api/v1/registration-payment/webhook/chapa
Content-Type: application/json

{
  "tx_ref": "REG-A1B2C3D4",
  "status": "success",
  "amount": "10.00",
  "currency": "ETB",
  "reference": "CH-123456789"
}
```

## Frontend Implementation

### RegistrationPayment.jsx
- Collects user role selection
- Calls initiate endpoint
- Redirects to Chapa checkout URL

```javascript
const response = await axios.post(`${API_URL}/registration-payment/initiate`, {
  email: 'user@example.com',
  fullName: 'John Doe',
  username: 'johndoe',
  userRole: role,
  amount: currentFee,
  paymentMethod: 'CHAPA'
});

// Redirect to Chapa
window.location.href = response.data.checkoutUrl;
```

### RegistrationVerify.jsx
- Automatically verifies payment on page load
- Extracts `tx_ref` from URL or localStorage
- Shows loading state during verification
- Redirects to registration form on success

```javascript
useEffect(() => {
  const paymentId = localStorage.getItem('registrationPaymentId') || 
                    searchParams.get('tx_ref');
  if (paymentId) {
    verifyPayment(paymentId);
  }
}, []);
```

## Testing

### Test Mode
Chapa provides test credentials for development:

1. Use test API keys (prefix: `CHASECK_TEST-`)
2. Test card numbers:
   - Success: `5555555555554444`
   - Decline: `4000000000000002`

### Test Flow
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:5173/register`
4. Click "Continue to Payment"
5. Select role and click "Pay & Continue"
6. Use test card on Chapa checkout
7. Verify automatic redirect and verification

## Currency Conversion

Chapa processes payments in Ethiopian Birr (ETB). If your fees are in USD:

```java
// In ChapaPaymentService.initializePayment()
BigDecimal amountInETB = request.getAmount().multiply(new BigDecimal("55.00")); // USD to ETB rate
body.put("amount", amountInETB.toString());
body.put("currency", "ETB");
```

Update configuration:
```yaml
chapa:
  currency: ETB
  exchange-rate: 55.00  # USD to ETB
```

## Security Considerations

### 1. API Key Protection
- Never commit API keys to version control
- Use environment variables in production
- Rotate keys periodically

### 2. Webhook Verification
Add signature verification to webhook endpoint:

```java
@PostMapping("/webhook/chapa")
public ResponseEntity<Void> chapaWebhook(
    @RequestBody Map<String, Object> payload,
    @RequestHeader("Chapa-Signature") String signature) {
    
    // Verify signature
    if (!chapaPaymentService.verifyWebhookSignature(payload, signature)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // Process webhook
    // ...
}
```

### 3. Payment Validation
- Always verify payment amount matches expected fee
- Check payment status before allowing registration
- Prevent payment reuse with `isUsed` flag

## Error Handling

### Common Errors

#### 1. Invalid API Key
```
Error: Payment initialization failed: 401 Unauthorized
Solution: Check CHAPA_SECRET_KEY in environment variables
```

#### 2. Network Timeout
```
Error: Payment verification failed: Connection timeout
Solution: Check internet connection and Chapa API status
```

#### 3. Payment Already Used
```
Error: Payment has already been used
Solution: User must initiate new payment
```

### Error Recovery
- Failed payments can be retried with new transaction reference
- Webhook provides backup verification mechanism
- Payment records are never deleted for audit trail

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Update callback/return URLs to production domain
- [ ] Configure webhook endpoint in Chapa dashboard
- [ ] Implement webhook signature verification
- [ ] Set up monitoring for failed payments
- [ ] Configure email notifications for payment events
- [ ] Test with real payment methods
- [ ] Set up currency conversion if needed
- [ ] Configure SSL/TLS for secure communication
- [ ] Set up logging and error tracking

## Monitoring

### Key Metrics to Track
- Payment success rate
- Average payment verification time
- Failed payment reasons
- Webhook delivery success rate

### Logging
```java
log.info("Payment initiated: {} for user {}", txRef, email);
log.info("Payment verified: {} with status {}", txRef, status);
log.error("Payment verification failed: {}", error.getMessage());
```

## Support

### Chapa Support
- Documentation: [https://developer.chapa.co](https://developer.chapa.co)
- Support Email: support@chapa.co
- Dashboard: [https://dashboard.chapa.co](https://dashboard.chapa.co)

### Common Issues
1. **Payment stuck in pending**: Check webhook configuration
2. **Verification fails**: Ensure tx_ref matches exactly
3. **Redirect not working**: Check return_url configuration

## Additional Features

### 1. Payment Status Polling
For better UX, implement status polling:

```javascript
const pollPaymentStatus = async (txRef) => {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkPaymentStatus(txRef);
    if (status === 'success') return true;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return false;
};
```

### 2. Payment Receipt
Generate and email payment receipt after successful payment.

### 3. Refund Support
Implement refund functionality for failed registrations:

```java
public void refundPayment(String txRef) {
    // Call Chapa refund API
    // Update payment status to REFUNDED
}
```

## Conclusion

Chapa integration provides a secure, reliable payment solution for MarketBridge registration fees. The implementation handles the complete payment lifecycle from initiation to verification, with proper error handling and security measures.
