import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NonAdminRoute from './components/NonAdminRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationPayment from './pages/RegistrationPayment';
import RegistrationVerify from './pages/RegistrationVerify';
import CompleteRegistration from './pages/CompleteRegistration';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import Transactions from './pages/Transactions';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminMessages from './pages/AdminMessages';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

// Placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center">
    <h2 className="text-3xl font-black text-slate-900 mb-4">{title}</h2>
    <p className="text-slate-500 font-medium">This module is coming in the next phase.</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-bold rounded-xl shadow-xl border border-slate-100',
              duration: 4000,
              style: {
                background: '#fff',
                color: '#0f172a',
                padding: '16px',
                borderRadius: '16px',
              },
            }}
          />
          <Routes>
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-payment" element={<RegistrationPayment />} />
            <Route path="/registration-verify" element={<RegistrationVerify />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />

            {/* Public Routes - With MainLayout */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <ProductList />
                </MainLayout>
              }
            />

            <Route
              path="/products/:id"
              element={
                <MainLayout>
                  <ProductDetails />
                </MainLayout>
              }
            />

            {/* Auth Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-product"
              element={
                <ProtectedRoute>
                  <NonAdminRoute>
                    <MainLayout>
                      <CreateProduct />
                    </MainLayout>
                  </NonAdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <NonAdminRoute>
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  </NonAdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <NonAdminRoute>
                    <MainLayout>
                      <Wishlist />
                    </MainLayout>
                  </NonAdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <NonAdminRoute>
                    <MainLayout>
                      <UserProfile />
                    </MainLayout>
                  </NonAdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <NonAdminRoute>
                    <MainLayout>
                      <Transactions />
                    </MainLayout>
                  </NonAdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <MainLayout>
                      <AdminAnalytics />
                    </MainLayout>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <MainLayout>
                      <AdminMessages />
                    </MainLayout>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
