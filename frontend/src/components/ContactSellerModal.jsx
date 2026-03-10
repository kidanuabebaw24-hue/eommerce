import React, { useState } from 'react';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import messageService from '../services/messageService';

const ContactSellerModal = ({ isOpen, onClose, product, sellerUsername }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const messageData = {
                senderName: formData.name,
                senderEmail: formData.email,
                content: formData.message,
                productId: product.id
            };

            await messageService.sendMessage(messageData);
            
            toast.success('Message sent successfully! The seller will contact you soon.');
            setFormData({ name: '', email: '', message: '' });
            onClose();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(errorMsg);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Header */}
                <div className="bg-slate-900 p-8 rounded-t-[2.5rem] relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-4 rounded-2xl">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Contact Seller</h2>
                            <p className="text-slate-400 font-medium">Send a message to {sellerUsername}</p>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Regarding Product
                    </p>
                    <div className="flex items-center gap-4">
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                            <img
                                src={`http://localhost:8080${product.imageUrls[0]}`}
                                alt={product.title}
                                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-slate-400" />
                            </div>
                        )}
                        <div>
                            <h3 className="font-black text-slate-900">{product.title}</h3>
                            <p className="text-blue-600 font-black">${product.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                            Your Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                            Your Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                            Your Message
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                            placeholder="Hi, I'm interested in this product. Is it still available?"
                        ></textarea>
                        <p className="text-xs text-slate-500 font-medium mt-2">
                            Be specific about your inquiry to get a faster response.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 px-8 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {sending ? (
                                'Sending...'
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactSellerModal;
