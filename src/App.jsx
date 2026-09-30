import { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import Register from './Register';
import RetailerDashboard from './RetailerDashboard';
import SupplierDashboard from './SupplierDashboard';
import HomePage from './HomePage';
import RetailerInfo from './RetailerInfo';
import SupplierInfo from './SupplierInfo';
import SupplierRegister from './SupplierRegister';
import SetPassword from './SetPassword';
import ForgotPassword from './ForgotPassword';
import api from './api';
import './App.css';

export default function App() {
    const [token, setToken] = useState(() => localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState(null);

    // Detect if the incoming URL is a password setup link from the approval email
    const isSetPasswordRequest = 
        window.location.pathname.includes('set-password') || 
        (window.location.search.includes('uid=') && window.location.search.includes('token='));

    // Determine initial view based on activation link, token, or default home
    const [currentView, setCurrentView] = useState(() => {
        if (isSetPasswordRequest) return 'set-password';
        return token ? 'loading' : 'home';
    });

    const handleLogout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUserRole(null);
        setCurrentView('home');
    }, []);

    const fetchUserRole = useCallback(async (activeToken) => {
        const authToken = activeToken || token;
        if (!authToken) {
            setCurrentView('home');
            return;
        }

        try {
            // Determine endpoint path respecting api.js baseURL
            const endpoint = api.defaults.baseURL && api.defaults.baseURL.endsWith('/api')
                ? '/user/role/'
                : '/api/user/role/';

            const response = await api.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            const role = response.data.role; // 'supplier' or 'retailer'
            setUserRole(role);
            setCurrentView(role);
        } catch (err) {
            console.error('Failed to fetch user role:', err.response?.data || err);
            handleLogout();
        }
    }, [token, handleLogout]);

    useEffect(() => {
        if (token && !isSetPasswordRequest) {
            fetchUserRole(token);
        }
    }, [token, isSetPasswordRequest, fetchUserRole]);

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
        // Seamlessly transition views without triggering window.location.reload()
        fetchUserRole(newToken);
    };

    return (
        <>
            {/* Loading Spinner for Token Session Verification */}
            {token && currentView === 'loading' && (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#64748b'
                }}>
                    <p>Loading your dashboard...</p>
                </div>
            )}

            {/* Supplier Account Password Setup (from Email Link) */}
            {currentView === 'set-password' && (
                <SetPassword onNavigate={setCurrentView} />
            )}

            {/* Public and Informational Views */}
            {!token && currentView === 'home' && (
                <HomePage onNavigate={setCurrentView} />
            )}
            
            {!token && currentView === 'retailer-info' && (
                <RetailerInfo onNavigate={setCurrentView} />
            )}

            {!token && currentView === 'supplier-info' && (
                <SupplierInfo onNavigate={setCurrentView} />
            )}

            {/* Authentication Views */}
            {!token && currentView === 'login' && (
                <Login 
                    onLoginSuccess={handleLoginSuccess} 
                    onNavigate={setCurrentView} 
                />
            )}
            
            {/* Retailer Registration */}
            {!token && (currentView === 'register' || currentView === 'register-retailer') && (
                <Register 
                    defaultRole="retailer"
                    onNavigateToLogin={() => setCurrentView('login')} 
                />
            )}

            {/* Supplier Multi-step Onboarding Registration */}
            {!token && currentView === 'register-supplier' && (
                <SupplierRegister onNavigate={setCurrentView} />
            )}

            {/* Authenticated Dashboards */}
            {token && currentView === 'retailer' && (
                <RetailerDashboard onLogout={handleLogout} />
            )}
            {token && currentView === 'supplier' && (
                <SupplierDashboard onLogout={handleLogout} />
            )}

            {!token && currentView === 'forgot-password' && (
                <ForgotPassword onNavigate={setCurrentView} />
            )}
        </>
    );
}