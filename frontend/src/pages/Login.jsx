import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const loadToast = toast.loading('Verifying credentials...');

        try {
            const data = await login(username, password);
            toast.success('Welcome back!', { id: loadToast });
            if (data.roles?.includes('ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid username or password';
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
                        <LogIn className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Log in to manage your marketplace</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
