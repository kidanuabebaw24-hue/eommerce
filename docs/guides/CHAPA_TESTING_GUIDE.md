# Chapa Integration Testing Guide

Your Chapa API keys have been configured. Follow this guide to test the payment integration.

## ✅ Configuration Complete

Your Chapa credentials are now configured in `backend/src/main/resources/application.yml`:

- **Test Public Key**: `CHAPUBK_TEST-v7Uhcr9yvOya2wVxRLtu6thwfsYng2Ah`
- **Test Secret Key**: `CHASECK_TEST-DEQ1BOjsE3FM4fNfG5qalijqTxfl2hmm`
- **Encryption Key**: `wvoiBRNkGDb0GeTNDjHzPsTQ`

## 🧪 Testing the Integration

### Step 1: Ensure Services are Running

**Backend:**
```bash
cd backend
mvn spring-boot:run
```
Should be running on: `http://localhost:8080`

**Frontend:**
```bash
cd frontend
npm run dev
```
Should be running on: `http://localhost:5174`

### Step 2: Test Registration Payment Flow

1. **Navigate to Registration**
   - Open browser: `http://localhost:5174/register`
   - You should see the registration landing page

2. **Click "Continue to Payment"**
   - This redirects to `/registration-payment`

3. **Select Your Role**
   - Choose either "Buyer" ($10) or "Seller" ($50)
   - You'll see the payment summary

4. **Initiate Payment**
   - Click "Pay $10 & Continue" (or $50 for Seller)
   - Backend will call Chapa API
   - You'll be redirected to Chapa's checkout page

5. **Complete Payment on Chapa**
   - Use Chapa's test card numbers:
     - **Success**: `5555555555554444`
     - **Decline**: `4000000000000002`
   - Fill in test details:
     - CVV: Any 3 digits (e.g., `123`)
     - Expiry: Any future date (e.g., `12/25`)
     - Name: Any name

6. **Automatic Verification**
   - After payment, Chapa redirects back to your app
   - URL: `http://localhost:5174/registration-verify?tx_ref=REG-XXXXXXXX`
   - System automatically verifies payment with Chapa
   - Shows loading state during verification

7. **Complete Registration**
   - After successful verification, redirected to `/complete-registration`
   - Fill in registration form:
     - Full Name
     - Email
     - Username
     - Password
   - Click "Complete Registration"

8. **Login**
   - Redirected to `/login`
   - Login with your new credentials

## 🔍 Verification Points

### Backend Logs
Check backend console for:
```
Registration payment initiated: REG-XXXXXXXX for user email@example.com
Registration payment verified: REG-XXXXXXXX
Registration payment marked as used: REG-XXXXXXXX
```

### Database Check
Verify in `registration_payments` table:
```sql
SELECT payment_reference, email, status, is_verified, is_used 
FROM registration_payments 
ORDER BY created_at DESC 
LIMIT 5;
```

Should show:
- `status`: SUCCESS
- `is_verified`: true
- `is_used`: true

### API Endpoints Test

**1. Get Registration Fees:**
```bash
curl http://localhost:8080/api/v1/registration-payment/fees
```
Expected: `{"BUYER":10.0,"SELLER":50.0}`

**2. Initiate Payment:**
```bash
curl -X POST http://localhost:8080/api/v1/registration-payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "username": "testuser",
    "userRole": "BUYER",
    "amount": 10.00,
    "paymentMethod": "CHAPA"
  }'
```

Expected response:
```json
{
  "paymentReference": "REG-XXXXXXXX",
  "checkoutUrl": "https://checkout.chapa.co/checkout/payment/...",
  "amount": 10.00,
  "status": "PENDING"
}
```

**3. Verify Payment:**
```bash
curl -X POST http://localhost:8080/api/v1/registration-payment/verify/REG-XXXXXXXX
```

Expected: `{"status":"success","message":"Payment verified successfully"}`

## 🐛 Troubleshooting

### Issue: "Payment initialization failed"

**Possible Causes:**
1. Backend not running
2. Invalid Chapa API keys
3. Network connectivity issues

**Solutions:**
```bash
# Check backend is running
curl http://localhost:8080/api/v1/registration-payment/fees

# Check Chapa API keys in application.yml
cat backend/src/main/resources/application.yml | grep chapa -A 6

# Test Chapa API directly
curl -X GET https://api.chapa.co/v1/banks \
  -H "Authorization: Bearer CHASECK_TEST-DEQ1BOjsE3FM4fNfG5qalijqTxfl2hmm"
```

### Issue: "Payment verification failed"

**Possible Causes:**
1. Payment not completed on Chapa
2. Invalid transaction reference
3. Network timeout

**Solutions:**
1. Check Chapa dashboard for payment status
2. Verify transaction reference matches
3. Check backend logs for errors
4. Try manual verification:
   ```bash
   curl -X POST http://localhost:8080/api/v1/registration-payment/verify/REG-XXXXXXXX
   ```

### Issue: Redirect not working

**Possible Causes:**
1. Wrong callback URL
2. CORS issues
3. Frontend not running

**Solutions:**
1. Verify callback URL in `application.yml`:
   ```yaml
   callback-url: http://localhost:5174/registration-verify
   ```
2. Check browser console for CORS errors
3. Ensure frontend is running on port 5174

### Issue: "Payment has already been used"

**Cause:** Trying to register with same payment twice

**Solution:** Initiate new payment for new registration

## 📊 Test Scenarios

### Scenario 1: Successful Buyer Registration
1. Select "Buyer" role
2. Pay $10
3. Use success card: `5555555555554444`
4. Complete registration
5. Login successfully

**Expected:** User created with BUYER role

### Scenario 2: Successful Seller Registration
1. Select "Seller" role
2. Pay $50
3. Use success card: `5555555555554444`
4. Complete registration
5. Login successfully

**Expected:** User created with SELLER role

### Scenario 3: Failed Payment
1. Select any role
2. Initiate payment
3. Use decline card: `4000000000000002`
4. Payment fails on Chapa

**Expected:** Error message, can retry

### Scenario 4: Payment Reuse Prevention
1. Complete successful payment
2. Try to register again with same payment reference
3. Should fail with "Payment has already been used"

**Expected:** Error message

### Scenario 5: Webhook Test
1. Complete payment on Chapa
2. Chapa sends webhook to backend
3. Backend updates payment status

**Expected:** Payment verified via webhook

## 🔐 Security Checks

### 1. API Key Protection
- ✅ Keys stored in `application.yml`
- ✅ Not committed to Git (use environment variables in production)
- ✅ Test keys only (prefix: `CHASECK_TEST-`)

### 2. Payment Validation
- ✅ Amount validation (matches role fee)
- ✅ Email uniqueness check
- ✅ Payment reuse prevention
- ✅ Status verification with Chapa

### 3. Registration Security
- ✅ Payment required before registration
- ✅ Payment verification before account creation
- ✅ Password encryption
- ✅ JWT token generation

## 📈 Monitoring

### Check Payment Statistics
```sql
-- Total payments
SELECT COUNT(*) FROM registration_payments;

-- Successful payments
SELECT COUNT(*) FROM registration_payments WHERE status = 'SUCCESS';

-- Payments by role
SELECT user_role, COUNT(*) 
FROM registration_payments 
WHERE status = 'SUCCESS' 
GROUP BY user_role;

-- Recent payments
SELECT payment_reference, email, user_role, amount, status, created_at 
FROM registration_payments 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check User Registrations
```sql
-- Users created via payment
SELECT u.username, u.email, u.created_at, rp.payment_reference, rp.amount
FROM users u
JOIN registration_payments rp ON u.email = rp.email
WHERE rp.status = 'SUCCESS'
ORDER BY u.created_at DESC;
```

## 🚀 Production Deployment

Before going live:

### 1. Update API Keys
Replace test keys with production keys in `application.yml`:
```yaml
chapa:
  secret-key: CHASECK-your-production-key
  public-key: CHAPUBK-your-production-key
```

### 2. Update URLs
```yaml
chapa:
  callback-url: https://yourdomain.com/registration-verify
  return-url: https://yourdomain.com/registration-verify
```

### 3. Configure Webhook
In Chapa dashboard:
- Add webhook URL: `https://yourdomain.com/api/v1/registration-payment/webhook/chapa`
- Enable webhook notifications

### 4. Test in Production
- Use real payment methods
- Verify webhook delivery
- Monitor error logs
- Test all scenarios

## 📞 Support

### Chapa Support
- Dashboard: https://dashboard.chapa.co
- Documentation: https://developer.chapa.co
- Email: support@chapa.co

### Application Logs
```bash
# Backend logs
cd backend
mvn spring-boot:run

# Check specific errors
grep "ERROR" backend/logs/application.log
```

## ✅ Success Checklist

- [ ] Backend running with Chapa keys configured
- [ ] Frontend running on port 5174
- [ ] Can access registration page
- [ ] Payment initiation works
- [ ] Redirected to Chapa checkout
- [ ] Payment completes successfully
- [ ] Automatic verification works
- [ ] Registration form appears
- [ ] User account created
- [ ] Can login with new account
- [ ] Payment marked as used
- [ ] Database records correct

## 🎉 Next Steps

Once testing is complete:
1. Test with different scenarios
2. Monitor payment success rate
3. Set up error alerting
4. Configure production keys
5. Deploy to production
6. Monitor production payments

Your Chapa integration is ready to test! Start with the registration flow and verify each step works correctly.
