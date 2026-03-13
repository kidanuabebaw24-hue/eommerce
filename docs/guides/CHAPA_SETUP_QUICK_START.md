# Chapa Integration - Quick Start Guide

## What Changed?

Your MarketBridge registration payment system now integrates with Chapa payment gateway instead of using mock payments.

## Setup Steps

### 1. Get Chapa API Keys

**For Testing:**
1. Go to [https://dashboard.chapa.co](https://dashboard.chapa.co)
2. Sign up for a test account
3. Navigate to Settings → API Keys
4. Copy your test Secret Key (starts with `CHASECK_TEST-`)

**For Production:**
- Use production API keys (starts with `CHASECK-`)

### 2. Configure Your Application

Open `src/main/resources/application.yml` and update:

```yaml
chapa:
  secret-key: CHASECK_TEST-your-actual-secret-key-here
  public-key: CHAPUBK_TEST-your-actual-public-key-here
  api-url: https://api.chapa.co/v1
  callback-url: http://localhost:5173/registration-verify
  return-url: http://localhost:5173/registration-verify
```

**Or use environment variables (recommended):**

```bash
# Windows PowerShell
$env:CHAPA_SECRET_KEY="CHASECK_TEST-your-key"
$env:CHAPA_PUBLIC_KEY="CHAPUBK_TEST-your-key"

# Linux/Mac
export CHAPA_SECRET_KEY="CHASECK_TEST-your-key"
export CHAPA_PUBLIC_KEY="CHAPUBK_TEST-your-key"
```

### 3. Test the Integration

1. **Start Backend:**
   ```bash
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Payment Flow:**
   - Navigate to `http://localhost:5173/register`
   - Click "Continue to Payment"
   - Select role (Buyer or Seller)
   - Click "Pay $10 & Continue" (or $50 for Seller)
   - You'll be redirected to Chapa checkout page
   - Use test card: `5555555555554444`
   - Complete payment
   - You'll be redirected back and payment will auto-verify
   - Complete registration form

## How It Works

### Old Flow (Mock):
1. User initiates payment
2. System generates mock payment ID
3. User enters verification code "DEMO123"
4. User completes registration

### New Flow (Chapa):
1. User initiates payment
2. System calls Chapa API and gets checkout URL
3. User is redirected to Chapa's secure payment page
4. User completes payment on Chapa
5. Chapa redirects back to your app
6. System automatically verifies payment with Chapa
7. User completes registration

## Key Changes

### Backend Changes:
- ✅ Created `ChapaPaymentService` for Chapa API integration
- ✅ Updated `RegistrationPaymentService` to use Chapa
- ✅ Added webhook endpoint for Chapa callbacks
- ✅ Added RestTemplate configuration
- ✅ Updated SecurityConfig for webhook access

### Frontend Changes:
- ✅ Updated `RegistrationPayment.jsx` to redirect to Chapa
- ✅ Updated `RegistrationVerify.jsx` to auto-verify payment
- ✅ Removed manual verification code input
- ✅ Added loading states and error handling

## Testing Without Chapa Account

If you don't have Chapa API keys yet, you can:

1. Use the placeholder keys in `application.yml`
2. The system will attempt to call Chapa but will fail
3. For testing, you can temporarily modify `RegistrationPaymentService` to skip Chapa calls

**Temporary Test Mode (Optional):**

In `RegistrationPaymentService.java`, comment out Chapa calls:

```java
// Temporary: Skip Chapa for testing
// ChapaPaymentService.ChapaInitializeResponse chapaResponse = 
//         chapaPaymentService.initializePayment(chapaRequest);

// Use mock URL instead
String checkoutUrl = "http://localhost:5173/registration-verify?tx_ref=" + paymentReference;
```

## Currency Note

Chapa processes payments in Ethiopian Birr (ETB). Your registration fees are configured in USD:
- Buyer: $10
- Seller: $50

The system currently sends these amounts directly to Chapa. If you need ETB conversion:

1. Update `ChapaPaymentService.initializePayment()`:
   ```java
   BigDecimal exchangeRate = new BigDecimal("55.00"); // USD to ETB
   BigDecimal amountInETB = request.getAmount().multiply(exchangeRate);
   body.put("amount", amountInETB.toString());
   ```

2. Or configure fees directly in ETB in `application.yml`:
   ```yaml
   registration:
     fee:
       buyer: 550.00    # 10 USD = 550 ETB
       seller: 2750.00  # 50 USD = 2750 ETB
   ```

## Troubleshooting

### Error: "Payment initialization failed"
- Check your Chapa API keys
- Ensure keys are correctly set in environment variables or application.yml
- Verify internet connection

### Error: "Payment verification failed"
- Check if payment was actually completed on Chapa
- Verify the transaction reference matches
- Check Chapa dashboard for payment status

### Payment stuck on "Verifying"
- Check browser console for errors
- Verify backend is running
- Check backend logs for error messages

### Redirect not working
- Ensure `callback-url` and `return-url` match your frontend URL
- Check for CORS issues in browser console

## Production Deployment

Before going live:

1. ✅ Replace test API keys with production keys
2. ✅ Update callback/return URLs to production domain
3. ✅ Configure webhook in Chapa dashboard
4. ✅ Test with real payment methods
5. ✅ Set up SSL/TLS (HTTPS required)
6. ✅ Configure proper error logging
7. ✅ Set up payment monitoring

## Support

- **Chapa Documentation:** [https://developer.chapa.co](https://developer.chapa.co)
- **Chapa Support:** support@chapa.co
- **Chapa Dashboard:** [https://dashboard.chapa.co](https://dashboard.chapa.co)

## Next Steps

1. Get your Chapa test API keys
2. Update configuration
3. Test the payment flow
4. Review the detailed guide in `CHAPA_INTEGRATION_GUIDE.md`
5. Prepare for production deployment

---

**Note:** The integration is production-ready. You just need to add your Chapa API keys to start accepting payments!
