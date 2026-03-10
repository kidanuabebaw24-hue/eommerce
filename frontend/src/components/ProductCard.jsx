import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, MapPin, User, Heart } from 'lucide-react';
import favoriteService from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { id, title, price, categoryName, ownerUsername, location, imageUrls } = product;
    const mainImage = imageUrls && imageUrls.length > 0 ? `http://localhost:8080${imageUrls[0]}` : 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkIfFavorited();
        }
    }, [user, id]);

    const checkIfFavorited = async () => {
        try {
            const favorites = await favoriteService.getMyFavorites();
            setIsFavorited(favorites.some(fav => fav.productId === id));
        } catch (err) {
            // Silently fail
        }
    };

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error('Please login to add favorites');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isFavorited) {
                await favoriteService.removeFromFavorites(id);
                toast.success('Removed from wishlist');
                setIsFavorited(false);
            } else {
                await favoriteService.addToFavorites(id);
                toast.success('Added to wishlist');
                setIsFavorited(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white">
                        {categoryName || 'Uncategorized'}
                    </span>
                </div>
                {user && (
                    <button
                        onClick={toggleFavorite}
                        disabled={isLoading}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-xl hover:bg-white transition-all hover:scale-110 disabled:opacity-50"
                    >
                        <Heart 
                            className={`w-5 h-5 transition-all ${
                                isFavorited 
                                    ? 'fill-red-500 text-red-500' 
                                    : 'text-slate-600'
                            }`}
                        />
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>

                <p className="text-2xl font-black text-blue-600 mb-4 bg-blue-50/50 inline-block self-start px-2 py-1 rounded-lg">
                    ${price.toLocaleString()}
                </p>

                <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tight">
                        <User className="w-3.5 h-3.5" />
                        <span>{ownerUsername}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tight">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{location || 'Remote'}</span>
                    </div>
                </div>

                <Link
                    to={`/products/${id}`}
                    className="mt-6 w-full bg-slate-900 group-hover:bg-blue-600 text-white font-black py-3 rounded-2xl text-center transition-all shadow-xl shadow-slate-200 group-hover:shadow-blue-100 active:scale-[0.98]"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
