import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Building, Save, Camera, ArrowLeft, Star } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        phone: '',
        location: '',
        city: '',
        country: '',
        businessName: '',
        businessRegistration: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getMyProfile();
            setProfile(data);
            setFormData({
                bio: data.bio || '',
                phone: data.phone || '',
                location: data.location || '',
                city: data.city || '',
                country: data.country || '',
                businessName: data.businessName || '',
                businessRegistration: data.businessRegistration || ''
            });
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await profileService.updateMyProfile(formData);
            setProfile(updated);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const updated = await profileService.uploadProfilePhoto(file);
            setProfile(updated);
            toast.success('Profile photo updated');
        } catch (err) {
            toast.error('Failed to upload photo');
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-12 w-64 mb-8" />
                <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Back
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 p-8 md:p-12">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-700 flex items-center justify-center">
                                {profile.profilePhoto ? (
                                    <img
                                        src={`http://localhost:8080${profile.profilePhoto}`}
                                        alt={profile.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-slate-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all shadow-xl">
                                <Camera className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-white mb-1">{profile.fullname}</h1>
                            <p className="text-slate-400 font-medium">@{profile.username}</p>
                            {profile.averageRating > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-yellow-500 font-black">{profile.averageRating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-slate-400 text-sm font-medium">
                                        ({profile.reviewCount} reviews)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="+251911234567"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Bole, Addis Ababa"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Addis Ababa"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Ethiopia"
                            />
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Business Name (Optional)
                            </label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Tech Solutions Ltd"
                                />
                            </div>
                        </div>

                        {/* Business Registration */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">
                                Business Registration (Optional)
                            </label>
                            <input
                                type="text"
                                name="businessRegistration"
                                value={formData.businessRegistration}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="REG-12345"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
