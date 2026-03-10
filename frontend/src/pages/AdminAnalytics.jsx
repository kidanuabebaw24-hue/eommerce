import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, Star, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const StatCard = ({ icon, title, value, color, subtitle }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className={`inline-flex p-3 rounded-xl mb-4 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">
                {title}
            </h3>
            <p className="text-3xl font-black text-slate-900 mb-1">
                {value !== undefined ? value : '—'}
            </p>
            {subtitle && (
                <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
            )}
        </div>
    );
};

const AdminAnalytics = () => {
    const [overview, setOverview] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [categories, setCategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [overviewData, revenueData, categoriesData, sellersData] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getRevenueAnalytics(),
                analyticsService.getCategoryAnalytics(),
                analyticsService.getTopSellers()
            ]);
            setOverview(overviewData);
            setRevenue(revenueData);
            setCategories(categoriesData);
            setSellers(sellersData);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-40 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-purple-600 p-3 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">Analytics Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    title="Total Users"
                    value={overview?.totalUsers?.toLocaleString()}
                    color="blue"
                    subtitle="Registered accounts"
                />
                <StatCard
                    icon={<Package className="w-6 h-6" />}
                    title="Total Products"
                    value={overview?.totalProducts?.toLocaleString()}
                    color="green"
                    subtitle="Listed items"
                />
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    title="Total Revenue"
                    value={`$${overview?.totalRevenue?.toLocaleString()}`}
                    color="purple"
                    subtitle="All-time earnings"
                />
                <StatCard
                    icon={<ShoppingCart className="w-6 h-6" />}
                    title="Transactions"
                    value={overview?.totalTransactions?.toLocaleString()}
                    color="orange"
                    subtitle="Completed sales"
                />
            </div>

            {/* Revenue Overview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <DollarSign className="w-7 h-7 text-purple-600" />
                    Revenue Overview
                </h2>
                {revenue && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                            <p className="text-sm font-black text-purple-600 uppercase tracking-widest mb-2">
                                Today
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                ${revenue.todayRevenue?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">
                                This Month
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                ${revenue.monthRevenue?.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <p className="text-sm font-black text-green-600 uppercase tracking-widest mb-2">
                                This Year
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                ${revenue.yearRevenue?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Analytics */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <Package className="w-7 h-7 text-green-600" />
                        Top Categories
                    </h2>
                    <div className="space-y-4">
                        {categories.slice(0, 5).map((category, index) => (
                            <div key={category.categoryName} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-50 text-green-600 font-black w-10 h-10 rounded-xl flex items-center justify-center border border-green-100">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{category.categoryName}</p>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {category.productCount} products
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-green-600">
                                        ${category.totalRevenue?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <Award className="w-7 h-7 text-orange-600" />
                        Top Sellers
                    </h2>
                    <div className="space-y-4">
                        {sellers.slice(0, 5).map((seller, index) => (
                            <div key={seller.sellerUsername} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-50 text-orange-600 font-black w-10 h-10 rounded-xl flex items-center justify-center border border-orange-100">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{seller.sellerUsername}</p>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-500 font-medium">
                                                {seller.totalSales} sales
                                            </span>
                                            {seller.averageRating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-slate-500 font-medium">
                                                        {seller.averageRating.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-orange-600">
                                        ${seller.totalRevenue?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
