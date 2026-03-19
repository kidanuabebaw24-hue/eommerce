import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, DollarSign } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const handleStartRegistration = () => {
        navigate('/registration-payment');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Join MarketBridge</h1>
                    <p className="text-slate-500 mt-2">Start your journey as a buyer or seller</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-blue-900 mb-1">Registration Fee Required</h3>
                                <p className="text-sm text-blue-700">
                                    A one-time registration fee is required to join our marketplace:
                                </p>
                                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                    <li>• Buyers: $10</li>
                                    <li>• Sellers: $50</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <h3 className="font-bold text-slate-900">What you'll get:</h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>✓ Access to thousands of products</li>
                            <li>✓ Secure payment processing</li>
                            <li>✓ Buyer protection guarantee</li>
                            <li>✓ 24/7 customer support</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleStartRegistration}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                    >
                        Continue to Payment
                    </button>
                </div>

                <p className="text-center text-slate-500 mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
