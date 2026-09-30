import { useState } from 'react';
import api from './api';

export default function Login({ onLoginSuccess, onNavigate }) {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (username.trim() === '') {
            setError('Please enter your username or email.');
            return;
        }
        setError(null);
        setStep(2); 
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const cleanIdentifier = username.trim();

        try {
            // Respect baseURL configuration whether it ends in /api or not
            const endpoint = api.defaults.baseURL && api.defaults.baseURL.endsWith('/api')
                ? '/login/'
                : '/api/login/';

            // Send both username and email to guarantee matching
            const response = await api.post(endpoint, { 
                username: cleanIdentifier, 
                email: cleanIdentifier, 
                password: password 
            });

            // Store tokens
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
            }
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }

            onLoginSuccess(response.data.access);
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            const serverMsg = err.response?.data?.detail 
                || err.response?.data?.error 
                || 'Invalid credentials. Please try again.';
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-auth-wrapper">
            <div className="split-auth-left">
                <div className="auth-content-container" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    
                    {/* Centered Logo */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <img src="/logo.png" alt="BulkPool Logo" className="brand-logo" style={{ maxHeight: '48px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>

                    {step === 1 ? (
                        <>
                            <h2 className="auth-heading" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Welcome back</h2>
                            
                            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem', width: '100%', textAlign: 'left' }}>{error}</div>}
                            
                            <form onSubmit={handleNextStep} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input 
                                    type="text" 
                                    className="hi-input" 
                                    placeholder="Enter your username or email" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    autoFocus
                                    required 
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                                <button 
                                    type="submit" 
                                    className="hi-btn"
                                    style={{ 
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: username.trim().length > 0 ? '#0558EE' : '#21E8E6',
                                        color: '#ffffff',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                >
                                    Next
                                </button>
                            </form>

                            <div className="auth-footer-text" style={{ marginTop: '24px', fontSize: '0.9rem', color: '#4b5563', width: '100%' }}>
                                Don't have an account? Sign up for:
                                <div className="auth-links" style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                    <span 
                                        className="auth-link" 
                                        onClick={() => onNavigate('register-retailer')} 
                                        style={{ color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        Retailer Hub
                                    </span>
                                    <span style={{ color: '#d1d5db' }}>|</span>
                                    <span 
                                        className="auth-link" 
                                        onClick={() => onNavigate('register-supplier')} 
                                        style={{ color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        Supplier Hub
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="auth-heading" style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Log in with password</h2>
                            
                            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem', width: '100%', textAlign: 'left' }}>{error}</div>}
                            
                            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input 
                                        type="text" 
                                        className="hi-input" 
                                        value={username} 
                                        disabled 
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '1rem', boxSizing: 'border-box', cursor: 'not-allowed' }}
                                    />
                                    <span 
                                        onClick={() => setStep(1)} 
                                        style={{ position: 'absolute', right: '12px', top: '14px', fontSize: '0.85rem', color: '#0558EE', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Edit
                                    </span>
                                </div>

                                <input 
                                    type="password" 
                                    className="hi-input" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    autoFocus
                                    required 
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                                
                                <div style={{ textAlign: 'left', width: '100%' }}>
                                    <span 
                                        onClick={() => onNavigate('forgot-password')}   
                                        style={{ fontSize: '0.85rem', color: '#0558EE', cursor: 'pointer', fontWeight: '500' }}
                                        >
                                            I forgot my password
                                    </span>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="hi-btn"
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px 16px', 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        fontSize: '1rem', 
                                        fontWeight: '600', 
                                        cursor: loading ? 'not-allowed' : 'pointer', 
                                        backgroundColor: '#0558EE', 
                                        color: '#ffffff',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Logging in...' : 'Log in with Password'}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Back to Home positioned centrally underneath */}
                    <div style={{ marginTop: '32px', width: '100%', textAlign: 'center' }}>
                        <button 
                            type="button" 
                            onClick={() => onNavigate('home')} 
                            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                        >
                            &larr; Back to Home
                        </button>
                    </div>

                </div>
            </div>
            
            {/* Right-hand Image Split */}
            <div className="split-auth-right"></div>
        </div>
    );
}