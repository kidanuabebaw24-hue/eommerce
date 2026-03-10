import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import {
    User,
    Package,
    CreditCard,
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(user?.roles?.includes('SELLER') ? 'listings' : 'purchases');

    useEffect(() => {
        const fetchMyData = async () => {
            if (!user?.roles?.includes('SELLER')) {
                setLoading(false);
                return;
            }
            try {
                const products = await productService.getMyProducts();
                setMyProducts(products);
            } catch (err) {
                toast.error('Failed to load your products');
            } finally {
                setLoading(false);
            }
        };
        fetchMyData();
    }, [user]);

    const isSeller = user?.roles?.includes('SELLER');

    const stats = isSeller ? [
        { label: 'Total Listings', value: myProducts.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Sales', value: '$0.00', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Reports', value: '0', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    ] : [
        { label: 'Orders Placed', value: '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Spent', value: '$0.00', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Reward Points', value: '100', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {isSeller ? 'Seller Hub' : 'My Account'}
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        {isSeller ? 'Monitor your shop performance and manage inventory.' : 'Track your orders and manage your profile.'}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="bg-slate-100 p-2 rounded-xl">
                        <User className="text-slate-600 w-5 h-5" />
                    </div>
                    <div className="pr-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Logged in as</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{user?.username}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {['overview', isSeller && 'listings', 'purchases'].filter(Boolean).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all capitalize ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-44 w-full" />)}
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            ) : (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                                        <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {isSeller && (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900">Recent Listings</h3>
                                        <button
                                            onClick={() => setActiveTab('listings')}
                                            className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4"
                                        >
                                            View all <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-8">
                                        {myProducts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-slate-400 font-medium">You haven't listed any products yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {myProducts.slice(0, 3).map(product => (
                                                    <ProductCard key={product.id} product={product} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 text-left">
                            {myProducts.length === 0 ? (
                                <div className="text-center py-20">
                                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">No listings yet</h3>
                                    <p className="text-slate-500 font-medium">Start selling to see your products here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {myProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Purchases Tab */}
                    {activeTab === 'purchases' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 text-center">
                            <CreditCard className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Transaction history is empty</h3>
                            <p className="text-slate-500 font-medium">Your purchases will appear here once you start shopping.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
