import React from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                    <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl text-center">
                        <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500 w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong</h2>
                        <p className="text-slate-500 font-medium mb-8">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Retry Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-slate-100 text-slate-600 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
