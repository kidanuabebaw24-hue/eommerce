import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import { Receipt, Calendar, User, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Transactions = () => {
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [activeTab, setActiveTab] = useState('purchases');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const [purchasesData, salesData] = await Promise.all([
                transactionService.getMyPurchases().catch(err => {
                    console.error('Purchases error:', err.response?.data || err.message);
                    return [];
                }),
                transactionService.getMySales().catch(err => {
                    console.error('Sales error:', err.response?.data || err.message);
                    return [];
                })
            ]);
            setPurchases(purchasesData);
            setSales(salesData);
        } catch (err) {
            console.error('Transaction fetch error:', err);
            toast.error(err.response?.data?.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const transactions = activeTab === 'purchases' ? purchases : sales;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="flex gap-4 mb-8">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl">
                    <Receipt className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">My Transactions</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('purchases')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        activeTab === 'purchases'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    Purchases ({purchases.length})
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        activeTab === 'sales'
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    Sales ({sales.length})
                </button>
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-slate-100">
                    <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                        No {activeTab} yet
                    </h3>
                    <p className="text-slate-500 font-medium">
                        {activeTab === 'purchases' 
                            ? 'Start shopping to see your purchase history here'
                            : 'Your sales will appear here once you make a sale'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map(transaction => (
                        <div 
                            key={transaction.id} 
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-xl">
                                            <Package className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-lg text-slate-900 mb-1">
                                                {transaction.productTitle}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                                    <User className="w-4 h-4" />
                                                    <span>
                                                        {activeTab === 'purchases' 
                                                            ? `Seller: ${transaction.sellerUsername}`
                                                            : `Buyer: ${transaction.buyerUsername}`
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                            <p className="text-2xl font-black text-blue-600">
                                                ${transaction.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                                            transaction.status === 'SUCCESS'
                                                ? 'bg-green-100 text-green-600'
                                                : transaction.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transactions;
