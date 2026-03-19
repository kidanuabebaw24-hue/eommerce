import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

function RegistrationVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);

  // Get payment reference from localStorage or URL params
  const paymentId = localStorage.getItem('registrationPaymentId') || searchParams.get('tx_ref');
  const role = localStorage.getItem('registrationRole');

  useEffect(() => {
    if (paymentId) {
      verifyPayment();
    } else {
      setError('No payment reference found');
      setLoading(false);
      setVerifying(false);
    }
  }, [paymentId]);

  const verifyPayment = async () => {
    try {
      await axios.post(`${API_URL}/registration-payment/verify/${paymentId}`);

      // Payment verified, proceed to registration
      setTimeout(() => {
        navigate('/complete-registration', {
          state: { paymentId, role }
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
      setVerifying(false);
    } finally {
      setLoading(false);
    }
  };

  if (!paymentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-4">Please start from the registration payment page.</p>
          <button
            onClick={() => navigate('/registration-payment')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Payment
          </button>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verifying Payment
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we verify your payment with Chapa
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-700 font-medium">Verifying your payment...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Payment Reference:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{paymentId}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Payment Verification Failed
            </h2>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => navigate('/registration-payment')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Payment Verified!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Redirecting to complete your registration...
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium text-center">
              ✓ Payment verified successfully
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationVerify;
