import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>

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
