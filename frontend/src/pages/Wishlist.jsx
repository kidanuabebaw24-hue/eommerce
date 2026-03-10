import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import favoriteService from '../services/favoriteService';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const Wishlist = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const data = await favoriteService.getMyFavorites();
            setFavorites(data);
        } catch (err) {
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await favoriteService.removeFromFavorites(productId);
            setFavorites(favorites.filter(fav => fav.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error('Failed to remove from wishlist');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-96 w-full rounded-[2rem]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Back
            </button>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-2xl">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">My Wishlist</h1>
                        <p className="text-slate-500 font-medium">
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                    <Heart className="w-24 h-24 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-slate-500 font-medium mb-8">
                        Start adding products you love to your wishlist
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                        <div
                            key={favorite.id}
                            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={favorite.productImages && favorite.productImages.length > 0
                                        ? `http://localhost:8080${favorite.productImages[0]}`
                                        : 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'}
                                    alt={favorite.productTitle}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => handleRemove(favorite.productId)}
                                        className="bg-white/90 backdrop-blur-md p-3 rounded-xl hover:bg-red-50 transition-all shadow-xl"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                                {favorite.categoryName && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                                            {favorite.categoryName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2">
                                    {favorite.productTitle}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2">
                                    {favorite.productDescription}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-2xl font-black text-blue-600">
                                        ${favorite.productPrice.toLocaleString()}
                                    </p>
                                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                                        favorite.productStatus === 'AVAILABLE'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                    }`}>
                                        {favorite.productStatus}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/products/${favorite.productId}`)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
