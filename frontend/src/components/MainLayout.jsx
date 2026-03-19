import React from 'react';
import Navbar from './Navbar';
import AIChatWidget from './AI/AIChatWidget';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    
    // Extract productId from URL if on a product details page
    const productMatch = location.pathname.match(/\/products\/(\d+)/);
    const productId = productMatch ? parseInt(productMatch[1]) : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>

            {/* AI Advisor - Only for authenticated users */}
            {user && <AIChatWidget productId={productId} />}

            {/* Footer Placeholder */}
            <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">
                        © 2026 MarketBridge Platform • Premium Commerce Solutions
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
