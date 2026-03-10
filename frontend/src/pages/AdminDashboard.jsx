import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import {
    ShieldCheck,
    Users,
    Package,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Search,
    RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users');

    const fetchUsers = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
            if (silent) toast.success('User list synchronized');
        } catch (err) {
            toast.error('Failed to sync system users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserAction = async (id, action, username) => {
        const loadToast = toast.loading(`Processing ${action} for ${username}...`);
        try {
            if (action === 'approve') await adminService.approveUser(id);
            if (action === 'reject') await adminService.rejectUser(id);
            if (action === 'suspend') await adminService.suspendUser(id);

            toast.success(`User ${username} ${action}d successfully`, { id: loadToast });
            fetchUsers(true);
        } catch (err) {
            toast.error('Moderation action failed. Check privileges.', { id: loadToast });
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 p-4 rounded-3xl shadow-xl">
                        <ShieldCheck className="text-blue-400 w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Admin</h1>
                        <p className="text-slate-500 font-medium">Platform-wide governance and moderation.</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchUsers(true)}
                    disabled={loading}
                    className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-600 transition-all group disabled:opacity-50"
                >
                    <RefreshCw className={`w-6 h-6 text-slate-400 group-hover:text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                    <Users className="w-5 h-5" />
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === 'products' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                    <Package className="w-5 h-5" />
                    Global Listings
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-xl font-black text-slate-900">Registered Users ({users.length})</h3>
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by username or email..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                                <tr>
                                    <th className="px-8 py-4">User Details</th>
                                    <th className="px-8 py-4">Roles</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-50 text-blue-600 font-black w-10 h-10 rounded-xl flex items-center justify-center">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.username}</p>
                                                    <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map(role => (
                                                    <span key={role} className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tighter uppercase whitespace-nowrap">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                                                    user.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.status !== 'ACTIVE' && (
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'approve', user.username)}
                                                        className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve User"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {user.status === 'ACTIVE' && (
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'suspend', user.username)}
                                                        className="bg-amber-50 text-amber-600 p-2.5 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                        title="Suspend User"
                                                    >
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleUserAction(user.id, 'reject', user.username)}
                                                    className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title="Ban / Reject User"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="py-20 text-center">
                                <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users match your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-20 text-center">
                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2 font-mono uppercase tracking-tighter italic">Coming in v1.2</h3>
                    <p className="text-slate-500 font-medium">Platform-wide bulk product moderation tools are being finalized.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
