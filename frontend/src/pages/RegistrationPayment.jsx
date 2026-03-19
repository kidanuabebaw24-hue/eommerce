import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

function RegistrationPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('BUYER');
  const [fees, setFees] = useState({ buyerFee: 10, sellerFee: 50 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get(`${API_URL}/registration-payment/fees`);
      // Backend returns {BUYER: 10.0, SELLER: 50.0}
      setFees({
        buyerFee: response.data.BUYER || 10,
        sellerFee: response.data.SELLER || 50
      });
    } catch (err) {
      console.error('Failed to fetch fees:', err);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    // Validate inputs
    if (!email || !fullName || !username) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/registration-payment/initiate`, {
        email: email,
        fullName: fullName,
        username: username,
        userRole: role,
        amount: currentFee,
        paymentMethod: 'CHAPA'
      });

      // Store payment reference for verification
      localStorage.setItem('registrationPaymentId', response.data.paymentReference);
      localStorage.setItem('registrationRole', role);
      localStorage.setItem('registrationEmail', email);
      localStorage.setItem('registrationUsername', username);
      localStorage.setItem('registrationFullName', fullName);
      
      // Redirect to Chapa checkout page
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to get checkout URL');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const currentFee = role === 'BUYER' ? fees.buyerFee : fees.sellerFee;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Payment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Complete payment to proceed with registration
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Information
            </label>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="BUYER"
                  checked={role === 'BUYER'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Buyer</span>
                    <span className="text-lg font-bold text-blue-600">${fees.buyerFee}</span>
                  </div>
                  <p className="text-sm text-gray-500">Browse and purchase products</p>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="SELLER"
                  checked={role === 'SELLER'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Seller</span>
                    <span className="text-lg font-bold text-blue-600">${fees.sellerFee}</span>
                  </div>
                  <p className="text-sm text-gray-500">List and sell your products</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Registration Fee ({role})</span>
              <span className="text-xl font-bold text-blue-600">${currentFee}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || !email || !fullName || !username}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : `Pay $${currentFee} & Continue`}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our terms and conditions. This is a one-time registration fee.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPayment;
