import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import transactionService from '../services/transactionService';
import paymentService from '../services/paymentService';
import favoriteService from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, User, Tag, Calendar, ChevronLeft, ChevronRight, Package, Heart, Star, ShoppingCart } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import ContactSellerModal from '../components/ContactSellerModal';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                toast.error('Failed to load product details');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
        if (user) {
            checkIfFavorited();
        }
    }, [id, navigate, user]);

    const nextImage = () => {
        if (product?.imageUrls?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
        }
    };

    const prevImage = () => {
        if (product?.imageUrls?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
        }
    };

    const checkIfFavorited = async () => {
        try {
            const favorites = await favoriteService.getMyFavorites();
            setIsFavorited(favorites.some(fav => fav.productId === parseInt(id)));
        } catch (err) {
            // Silently fail
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            toast.error('Please login to add favorites');
            return;
        }

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
            toast.error('Failed to update wishlist');
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getProductReviews(id);
            setReviews(data);
        } catch (err) {
            // Silently fail
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            toast.error('Please login to purchase');
            navigate('/login');
            return;
        }

        if (product.status !== 'AVAILABLE') {
            toast.error('This product is no longer available');
            return;
        }

        setProcessingPayment(true);
        try {
            // Create transaction
            const transaction = await transactionService.createTransaction({
                productId: parseInt(id),
                amount: product.price,
                paymentMethod: 'chapa'
            });

            // Initiate payment
            const payment = await paymentService.initiatePayment({
                transactionId: transaction.id,
                amount: product.price,
                currency: 'ETB',
                email: user.email || `${user.username}@example.com`,
                firstName: user.username,
                lastName: 'User',
                returnUrl: `${window.location.origin}/transactions`
            });

            toast.success('Redirecting to payment gateway...');
            // In production, redirect to payment.checkoutUrl
            // For now, just show success
            setTimeout(() => {
                toast.success('Payment initiated successfully!');
                navigate('/transactions');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setProcessingPayment(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }

        if (!reviewComment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setSubmittingReview(true);
        try {
            await reviewService.createReview({
                rating: reviewRating,
                comment: reviewComment,
                productId: parseInt(id)
            });
            toast.success('Review submitted successfully!');
            setReviewComment('');
            setReviewRating(5);
            setShowReviewForm(false);
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-8 w-32 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-16 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const images = product.imageUrls?.length > 0 
        ? product.imageUrls.map(url => `http://localhost:8080${url}`)
        : ['https://placehold.co/800x600/e2e8f0/64748b?text=No+Image'];

    return (
        <div className="max-w-7xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Back to Marketplace
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl shadow-blue-900/5">
                        <img
                            src={images[currentImageIndex]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-white transition-all hover:scale-110"
                                >
                                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-white transition-all hover:scale-110"
                                >
                                    <ChevronRight className="w-6 h-6 text-slate-900" />
                                </button>
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                index === currentImageIndex
                                                    ? 'bg-white w-8'
                                                    : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                        index === currentImageIndex
                                            ? 'border-blue-600 shadow-lg shadow-blue-100'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                                {product.categoryName || 'Uncategorized'}
                            </span>
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                                product.status === 'AVAILABLE' 
                                    ? 'bg-green-50 text-green-600 border border-green-100'
                                    : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                                {product.status}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                            {product.title}
                        </h1>
                        
                        <div className="bg-blue-50/50 inline-block px-6 py-4 rounded-2xl">
                            <p className="text-4xl font-black text-blue-600">
                                ${product.price.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">
                            Seller Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-xl">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Seller</p>
                                    <p className="text-slate-900 font-bold">{product.ownerUsername}</p>
                                </div>
                            </div>
                            
                            {product.location && (
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-200 p-2 rounded-xl">
                                        <MapPin className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Location</p>
                                        <p className="text-slate-900 font-bold">{product.location}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-200 p-2 rounded-xl">
                                    <Calendar className="w-4 h-4 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Listed</p>
                                    <p className="text-slate-900 font-bold">
                                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Product Description
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                            {product.description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        {product.status === 'AVAILABLE' && user && user.username !== product.ownerUsername && (
                            <button 
                                onClick={handleBuyNow}
                                disabled={processingPayment}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-green-100 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {processingPayment ? 'Processing...' : `Buy Now - $${product.price.toLocaleString()}`}
                            </button>
                        )}
                        
                        {user && user.username !== product.ownerUsername && (
                            <>
                                <button 
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95"
                                >
                                    Contact Seller
                                </button>
                                <button 
                                    onClick={toggleFavorite}
                                    className={`${
                                        isFavorited 
                                            ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                    } font-black py-4 px-8 rounded-2xl transition-all transform active:scale-95 flex items-center gap-2`}
                                >
                                    <Heart className={isFavorited ? 'fill-red-600' : ''} />
                                    {isFavorited ? 'Saved' : 'Save'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        Customer Reviews ({reviews.length})
                    </h2>
                    {user && user.username !== product.ownerUsername && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            {showReviewForm ? 'Cancel' : 'Write Review'}
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={submitReview} className="bg-white rounded-2xl p-8 border border-slate-100 mb-8">
                        <div className="mb-6">
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-3">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= reviewRating
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-slate-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-3">
                                Your Review
                            </label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows="4"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                                placeholder="Share your experience with this product..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submittingReview}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                        >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                        <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating
                                                            ? 'fill-yellow-500 text-yellow-500'
                                                            : 'text-slate-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-slate-900 font-medium leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                                    <User className="w-4 h-4" />
                                    <span>{review.reviewerUsername}</span>
                                    <span>•</span>
                                    <span>
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Seller Modal */}
            <ContactSellerModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                product={product}
                sellerUsername={product.ownerUsername}
            />
        </div>
    );
};

export default ProductDetails;
