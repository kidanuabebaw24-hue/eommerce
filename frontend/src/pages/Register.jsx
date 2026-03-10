import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullname: '',
        roles: ['BUYER'], // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const loadToast = toast.loading('Creating your account...');

        try {
            await authService.register(formData);
            toast.success('Account created! Welcome aboard.', { id: loadToast });
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg, { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join the MarketBridge network today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="johndoe"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="john@example.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            name="fullname"
                            type="text"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="John Doe"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Register as:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roles: ['BUYER'] })}
                                className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${formData.roles[0] === 'BUYER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                Buyer
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, roles: ['SELLER'] })}
                                className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${formData.roles[0] === 'SELLER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                Seller
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

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
