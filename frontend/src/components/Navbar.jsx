import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';
import {
    ShoppingBag,
    Search,
    PlusCircle,
    User,
    LogOut,
    Menu,
    X,
    Store,
    ShieldCheck,
    Mail,
    Heart,
    Receipt
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && (user.roles?.includes('SELLER') || user.roles?.includes('ADMIN'))) {
            fetchUnreadCount();
            // Poll for new messages every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const count = await messageService.getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                                <Store className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">
                                Market<span className="text-blue-600">Bridge</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products & services..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-slate-600 font-bold hover:text-blue-600 transition-colors">
                            Discover
                        </Link>

                        {user && (
                            <>
                                <Link to="/wishlist" className="text-slate-600 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    <span>Wishlist</span>
                                </Link>

                                <Link to="/transactions" className="text-slate-600 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
                                    <Receipt className="w-5 h-5" />
                                    <span>Transactions</span>
                                </Link>
                            </>
                        )}

                        {(user?.roles?.includes('SELLER') || user?.roles?.includes('ADMIN')) && (
                            <Link to="/messages" className="relative text-slate-600 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                <span>Messages</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user?.roles?.includes('ADMIN') && (
                            <>
                                <Link to="/admin" className="flex items-center gap-2 text-slate-900 font-bold hover:text-blue-600 transition-colors">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    <span>Admin</span>
                                </Link>
                                <Link to="/admin/analytics" className="text-slate-600 font-bold hover:text-blue-600 transition-colors">
                                    Analytics
                                </Link>
                            </>
                        )}

                        {(user?.roles?.includes('SELLER') || user?.roles?.includes('ADMIN')) && (
                            <Link
                                to="/create-product"
                                className="flex items-center gap-2 bg-blue-50 text-blue-600 font-bold py-2.5 px-4 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Sell Item</span>
                            </Link>
                        )}

                        <div className="h-8 w-px bg-slate-100 mx-2" />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="flex flex-col items-end group">
                                    <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {user?.username}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        {user?.roles?.[0]} Account
                                    </span>
                                </Link>
                                <Link to="/profile" className="bg-slate-100 rounded-xl p-2 cursor-pointer hover:bg-slate-200 transition-colors">
                                    <User className="text-slate-600 w-6 h-6" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600 transition-colors">
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
                            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none"
                        />
                    </div>
                    <Link
                        to="/"
                        className="block py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                        onClick={() => setIsOpen(false)}
                    >
                        Discover
                    </Link>
                    {user && (
                        <>
                            <Link
                                to="/wishlist"
                                className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                                onClick={() => setIsOpen(false)}
                            >
                                <Heart className="w-5 h-5" />
                                Wishlist
                            </Link>
                            <Link
                                to="/transactions"
                                className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                                onClick={() => setIsOpen(false)}
                            >
                                <Receipt className="w-5 h-5" />
                                Transactions
                            </Link>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                Profile
                            </Link>
                        </>
                    )}
                    {(user?.roles?.includes('SELLER') || user?.roles?.includes('ADMIN')) && (
                        <Link
                            to="/messages"
                            className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Messages
                            </span>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    )}
                    {user?.roles?.includes('ADMIN') && (
                        <>
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                                onClick={() => setIsOpen(false)}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                Admin
                            </Link>
                            <Link
                                to="/admin/analytics"
                                className="block py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
                                onClick={() => setIsOpen(false)}
                            >
                                Analytics
                            </Link>
                        </>
                    )}
                    {(user?.roles?.includes('SELLER') || user?.roles?.includes('ADMIN')) && (
                        <Link
                            to="/create-product"
                            className="block py-3 px-4 rounded-xl bg-blue-600 text-white font-bold"
                            onClick={() => setIsOpen(false)}
                        >
                            Sell Item
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-red-50 text-red-600 font-bold"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
