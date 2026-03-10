import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import toast from 'react-hot-toast';
import { PackagePlus, ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        const newImages = [...selectedImages, ...files];
        setSelectedImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const loadToast = toast.loading('Publishing your listing...');

        const submitData = new FormData();

        // Add product data as a Blob with application/json type
        const productBlob = new Blob([JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            categoryId: parseInt(formData.categoryId)
        })], { type: 'application/json' });

        submitData.append('product', productBlob);

        // Add images
        selectedImages.forEach(image => {
            submitData.append('images', image);
        });

        try {
            await productService.createProduct(submitData);
            toast.success('Your object is now live!', { id: loadToast });
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create product. Please check your inputs.';
            setError(msg);
            toast.error(msg, { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Back to Marketplace
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 md:p-12 text-white flex items-center gap-6">
                    <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-600/20">
                        <PackagePlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">List New Product</h1>
                        <p className="text-slate-400 font-medium">Fill in the details to reach thousands of buyers.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Product Title
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="e.g. Professional Wireless Headphones"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Category
                            </label>
                            <select
                                name="categoryId"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium appearance-none"
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Price (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-10 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium font-mono"
                                    placeholder="0.00"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Item Location
                            </label>
                            <input
                                name="location"
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="e.g. New York, NY"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Product Images ({selectedImages.length}/5)
                            </label>
                            <label className="border-2 border-dashed border-slate-200 rounded-2xl py-8 px-6 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center gap-3 text-slate-500 group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <div className="text-center">
                                    <span className="font-bold text-slate-700 block text-lg">Click to upload</span>
                                    <span className="text-xs font-medium text-slate-400">PNG, JPG or WEBP (Max 5)</span>
                                </div>
                            </label>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-5 gap-3 mt-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Product Description
                            </label>
                            <textarea
                                name="description"
                                rows="5"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                                placeholder="Describe your product features, condition, and any other relevant details..."
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all hover:text-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Publishing...' : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Publish Listing
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
