import React, { useState, useEffect } from 'react';
import messageService from '../services/messageService';
import toast from 'react-hot-toast';
import { 
    Mail, 
    MailOpen, 
    Trash2, 
    AlertTriangle, 
    TrendingUp, 
    MessageSquare,
    Clock,
    CheckCircle,
    Package,
    User,
    Search,
    RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [messagesData, statsData] = await Promise.all([
                messageService.getAllMessages(),
                messageService.getMessageStats()
            ]);
            setMessages(messagesData);
            setStats(statsData);
        } catch (err) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }

        try {
            await messageService.deleteMessage(messageId);
            toast.success('Message deleted successfully');
            setMessages(messages.filter(m => m.id !== messageId));
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null);
            }
            fetchData(); // Refresh stats
        } catch (err) {
            toast.error('Failed to delete message');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages
        .filter(m => {
            if (filter === 'unread') return !m.isRead;
            if (filter === 'read') return m.isRead;
            return true;
        })
        .filter(m =>
            m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.recipientUsername.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32 rounded-[2rem]" />
                    ))}
                </div>
                <Skeleton className="h-[600px] rounded-[2.5rem]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Message Moderation</h1>
                    <p className="text-slate-500 font-medium">Monitor and manage all platform messages</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-600 transition-all group disabled:opacity-50"
                >
                    <RefreshCw className={`w-6 h-6 text-slate-400 group-hover:text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-1">{stats.totalMessages}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Messages</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-amber-50 p-3 rounded-xl">
                                <Mail className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-1">{stats.unreadMessages}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Unread</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-emerald-50 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-1">{stats.readRate.toFixed(1)}%</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Read Rate</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-50 p-3 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-1">{stats.recentMessages}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Last 7 Days</p>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                filter === 'all'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All ({messages.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                filter === 'unread'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Unread ({messages.filter(m => !m.isRead).length})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                filter === 'read'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Read ({messages.filter(m => m.isRead).length})
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by sender, email, product, or recipient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Sender</th>
                                <th className="px-8 py-4">Recipient (Seller)</th>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <Mail className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No messages found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((message) => (
                                    <tr 
                                        key={message.id} 
                                        className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${
                                            selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => setSelectedMessage(message)}
                                    >
                                        <td className="px-8 py-6">
                                            {message.isRead ? (
                                                <div className="flex items-center gap-2">
                                                    <MailOpen className="w-5 h-5 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-500">Read</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-blue-600" />
                                                    <span className="text-xs font-bold text-blue-600">Unread</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="font-black text-slate-900">{message.senderName}</p>
                                                <p className="text-xs text-slate-400 font-medium">{message.senderEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-600">{message.recipientUsername}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products/${message.productId}`);
                                                }}
                                                className="text-blue-600 font-bold hover:underline text-left"
                                            >
                                                {message.productTitle}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(message.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMessage(message.id);
                                                }}
                                                className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div 
                        className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-600 p-4 rounded-2xl">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">{selectedMessage.senderName}</h2>
                                        <p className="text-slate-500 font-medium">{selectedMessage.senderEmail}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Info */}
                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Recipient (Seller)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span className="font-bold text-slate-900">{selectedMessage.recipientUsername}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Product Inquiry
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

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Date & Time
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-600">{formatDate(selectedMessage.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="mb-6">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">
                                    Message Content
                                </h3>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                                    className="flex-1 bg-red-50 text-red-600 font-black py-4 px-8 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete Message
                                </button>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 px-8 rounded-2xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
