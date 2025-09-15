import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Landingpage from './pages/Landingpage';
// import News from './pages/News';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import './App.css';
import News from './components/News';
import BusinessList from './components/BusinessList';
import BusinessCard from './components/BusinessCard';
import BusinessDetail from './components/BusinessDetail';
import BusinessForm from './components/BusinessForm';
import BusinessDashboard from './components/BusinessDashboard';
import InvestmentForm from './components/InvestmentForm';
import InvestmentList from './components/InvestmentList';
import InvestmentCard from './components/InvestmentCard';
import PerformanceForm from './components/PerformanceForm';
import PerformanceChart from './components/PerformanceChart';
import PerformanceHistory from './components/PerformanceHistory';
import DistributionList from './components/DistributionList';
import DistributionCard from './components/DistributionCard';
import DistributionDashboard from './components/DistributionDashboard';
import Document from './pages/Document';
import Schemes from './pages/Schemes';
import CropPrices from './pages/CropPrices';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/auth" replace />;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
            <div className="App">
              <Routes>
                {/* Public routes with layout */}
                <Route path="/" element={
                  <Layout>
                    <Landingpage />
                  </Layout>
                } />
                <Route path="/news" element={
                  <Layout>
                    <News />
                  </Layout>
                } />
                <Route path="/weather" element={
                  <Layout>
                    <Weather />
                  </Layout>
                } />
                <Route path="/documents" element={
                  <Layout>
                    <Document />
                  </Layout>
                } />
                <Route path="/schemes" element={
                  <Layout>
                    <Schemes />
                  </Layout>
                } />
                <Route path="/crop-prices" element={
                  <Layout>
                    <CropPrices />
                  </Layout>
                } />
                
                {/* Auth route without layout */}
                <Route 
                  path="/auth" 
                  element={
                    <PublicRoute>
                      <Auth />
                    </PublicRoute>
                  } 
                />

<Route 
                  path="/news" 
                  element={
                    <PublicRoute>
                      <News />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected routes with layout */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/business" element={<BusinessList />} />
                <Route path="/business/:id" element={<BusinessDetail />} />
                <Route path="/business/:id/edit" element={<BusinessForm />} />
                <Route path="/dashboard/business" element={<BusinessDashboard />} />
                <Route path="/investments" element={<InvestmentList />} />
                <Route path="/investments/new/:businessId" element={<InvestmentForm />} />
                <Route path="/performance/new/:businessId" element={<PerformanceForm />} />
                <Route path="/distributions" element={<DistributionDashboard />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
} 

export default App;
