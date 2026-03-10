import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Search, Filter, ShoppingBag, ArrowRight, Smartphone, Shirt, Home, Dumbbell, Car, Briefcase } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    productService.getAllProducts(),
                    productService.getCategories()
                ]);
                setAllProducts(productsData);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                toast.error('Could not load products');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedCategory, searchQuery, allProducts]);

    const filterProducts = () => {
        let filtered = [...allProducts];

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.categoryName === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.categoryName?.toLowerCase().includes(query)
            );
        }

        setProducts(filtered);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const getCategoryIcon = (categoryName) => {
        const iconClass = "w-5 h-5";
        switch (categoryName) {
            case 'Electronics':
                return <Smartphone className={iconClass} />;
            case 'Fashion':
                return <Shirt className={iconClass} />;
            case 'Home & Garden':
                return <Home className={iconClass} />;
            case 'Sports & Outdoors':
                return <Dumbbell className={iconClass} />;
            case 'Car':
                return <Car className={iconClass} />;
            case 'Services':
                return <Briefcase className={iconClass} />;
            default:
                return <ShoppingBag className={iconClass} />;
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-red-50 p-6 rounded-[2.5rem] mb-6">
                    <ShoppingBag className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-slate-500 font-medium max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-slate-900 text-white font-black px-8 py-3 rounded-xl hover:bg-slate-800 transition-all"
                >
                    Retry Now
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Section with Category Showcase */}
            <div className="relative bg-slate-900 rounded-[3rem] p-8 md:p-12 overflow-hidden">
                <div className="relative z-10 mb-8">
                    <span className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
                        Premium Marketplace
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                        Discover items that <span className="text-blue-500 italic">bridge</span> your needs.
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mb-6 leading-relaxed max-w-2xl">
                        The world's most transparent community marketplace. Buy, sell, and grow with confidence.
                    </p>
                </div>

                {/* Category Grid */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Car Category */}
                    <button
                        onClick={() => handleCategoryClick('Car')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=400&fit=crop"
                            alt="Car"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Car</h3>
                            <p className="text-white/70 text-xs font-medium">Vehicles & Parts</p>
                        </div>
                    </button>

                    {/* Home & Garden Category */}
                    <button
                        onClick={() => handleCategoryClick('Home & Garden')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop"
                            alt="Home & Garden"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Home</h3>
                            <p className="text-white/70 text-xs font-medium">Furniture & Decor</p>
                        </div>
                    </button>

                    {/* Electronics Category */}
                    <button
                        onClick={() => handleCategoryClick('Electronics')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop"
                            alt="Electronics"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Electronics</h3>
                            <p className="text-white/70 text-xs font-medium">Gadgets & Devices</p>
                        </div>
                    </button>

                    {/* Fashion Category */}
                    <button
                        onClick={() => handleCategoryClick('Fashion')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop"
                            alt="Fashion"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Fashion</h3>
                            <p className="text-white/70 text-xs font-medium">Clothing & Style</p>
                        </div>
                    </button>

                    {/* Sports & Outdoors Category */}
                    <button
                        onClick={() => handleCategoryClick('Sports & Outdoors')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop"
                            alt="Sports & Outdoors"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Sports</h3>
                            <p className="text-white/70 text-xs font-medium">Fitness & Outdoor</p>
                        </div>
                    </button>

                    {/* Services Category */}
                    <button
                        onClick={() => handleCategoryClick('Services')}
                        className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop"
                            alt="Services"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-black text-lg">Services</h3>
                            <p className="text-white/70 text-xs font-medium">Professional Help</p>
                        </div>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-40 bg-slate-50/80 backdrop-blur-xl py-4 -mx-4 px-4">
                <div className="relative flex-1 max-w-xl w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-900 shadow-sm"
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    <button
                        onClick={() => handleCategoryClick('All')}
                        className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all shadow-sm ${
                            selectedCategory === 'All'
                                ? 'bg-blue-600 text-white border border-blue-600'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all shadow-sm ${
                                selectedCategory === cat.name
                                    ? 'bg-blue-600 text-white border border-blue-600'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {selectedCategory === 'All' ? 'Featured Listings' : selectedCategory}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-64 md:h-80 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton variant="circle" className="h-10 w-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                        <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-500 font-medium">Be the first to list something in this category!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
