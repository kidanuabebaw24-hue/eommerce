import React, { useState, useEffect } from 'react';
import messageService from '../services/messageService';
import toast from 'react-hot-toast';
import { Mail, MailOpen, Clock, Package, User, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = filter === 'unread' 
                ? await messageService.getUnreadMessages()
                : await messageService.getMyMessages();
            setMessages(data);
        } catch (err) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleMessageClick = async (message) => {
        setSelectedMessage(message);
        setShowReplyForm(false);
        setReplyText('');
        
        if (!message.isRead) {
            try {
                await messageService.markAsRead(message.id);
                // Update local state
                setMessages(messages.map(m => 
                    m.id === message.id ? { ...m, isRead: true } : m
                ));
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        setSending(true);
        try {
            // Create mailto link with the reply
            const subject = encodeURIComponent(`Re: ${selectedMessage.productTitle}`);
            const body = encodeURIComponent(replyText);
            const mailtoLink = `mailto:${selectedMessage.senderEmail}?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            toast.success('Opening your email client...');
            setShowReplyForm(false);
            setReplyText('');
        } catch (error) {
            toast.error('Failed to open email client');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
                    </div>
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

            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Inbox</h1>
                <p className="text-slate-500 font-medium">
                    {unreadCount > 0 
                        ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''} from potential buyers` 
                        : 'All caught up! No new inquiries.'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                    {/* Filter Tabs */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                All ({messages.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                                    filter === 'unread'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="overflow-y-auto max-h-[600px]">
                        {messages.length === 0 ? (
                            <div className="p-12 text-center">
                                <Mail className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-slate-900 mb-2">No messages yet</h3>
                                <p className="text-slate-500 text-sm font-medium">
                                    {filter === 'unread' 
                                        ? 'All messages have been read' 
                                        : 'You haven\'t received any inquiries yet. When buyers contact you about your products, they\'ll appear here.'}
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <button
                                    key={message.id}
                                    onClick={() => handleMessageClick(message)}
                                    className={`w-full p-6 border-b border-slate-100 text-left transition-all hover:bg-slate-50 ${
                                        selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                    } ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-xl ${message.isRead ? 'bg-slate-100' : 'bg-blue-100'}`}>
                                            {message.isRead ? (
                                                <MailOpen className="w-5 h-5 text-slate-600" />
                                            ) : (
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-black text-slate-900 truncate ${!message.isRead ? 'text-blue-900' : ''}`}>
                                                    {message.senderName}
                                                </h3>
                                                <span className="text-xs text-slate-400 font-medium ml-2">
                                                    {formatDate(message.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mb-2 truncate">
                                                {message.senderEmail}
                                            </p>
                                            <p className="text-sm text-slate-600 font-medium line-clamp-2">
                                                {message.content}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                                <Package className="w-3 h-3" />
                                                <span className="truncate">{message.productTitle}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                    {selectedMessage ? (
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-600 p-4 rounded-2xl">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">{selectedMessage.senderName}</h2>
                                            <p className="text-slate-500 font-medium">{selectedMessage.senderEmail}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        {!selectedMessage.isRead && (
                                            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-black px-3 py-1 rounded-full">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Inquiry About
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        <button
                                            onClick={() => navigate(`/products/${selectedMessage.productId}`)}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            {selectedMessage.productTitle}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">
                                    Buyer's Message
                                </h3>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold">
                                        💡 Tip: Reply via email to continue the conversation with this potential buyer.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50">
                                {!showReplyForm ? (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowReplyForm(true)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95"
                                        >
                                            Reply via Email
                                        </button>
                                        <button
                                            onClick={() => navigate(`/products/${selectedMessage.productId}`)}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 px-8 rounded-2xl transition-all"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                                Your Reply
                                            </label>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows="6"
                                                placeholder={`Hi ${selectedMessage.senderName},\n\nThank you for your interest in ${selectedMessage.productTitle}...`}
                                                className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                                            ></textarea>
                                            <p className="text-xs text-slate-500 font-medium mt-2">
                                                This will open your email client with the message pre-filled. You can edit before sending.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleSendReply}
                                                disabled={sending || !replyText.trim()}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {sending ? 'Opening Email...' : 'Send Reply'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowReplyForm(false);
                                                    setReplyText('');
                                                }}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 px-8 rounded-2xl transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-12">
                            <div className="text-center">
                                <Mail className="w-24 h-24 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Select a message</h3>
                                <p className="text-slate-500 font-medium">
                                    Choose a message from the list to view its details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
