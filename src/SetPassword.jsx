import { useState, useEffect } from 'react';
import api from './api';

export default function SetPassword({ onNavigate }) {
    const [uid, setUid] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlUid = params.get('uid');
        const urlToken = params.get('token');

        if (!urlUid || !urlToken) {
            setError('Missing password activation token or UID. Please use the exact link sent to your email.');
        } else {
            setUid(urlUid);
            setToken(urlToken);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!uid || !token) {
            setError('Missing activation parameters (uid or token). Check your email link.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const endpoint = api.defaults.baseURL && api.defaults.baseURL.endsWith('/api')
                ? '/auth/set-password/'
                : '/api/auth/set-password/';

            await api.post(endpoint, {
                uid: uid,
                token: token,
                password: password,
                new_password: password
            });

            setSuccess(true);
        } catch (err) {
            console.error('Password setup error:', err.response?.data || err);
            const serverMsg = err.response?.data?.error 
                || err.response?.data?.detail 
                || (typeof err.response?.data === 'string' ? err.response?.data : null)
                || 'The activation link has expired or is invalid. Please request a new one.';
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueToLogin = () => {
        window.history.replaceState({}, document.title, window.location.pathname);
        if (onNavigate) {
            onNavigate('login');
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Scoped style to ensure typed text is black and placeholder is white */}
            <style>{`
                .custom-white-placeholder {
                    color: #000000 !important;
                }
                .custom-white-placeholder::placeholder {
                    color: #ffffff !important;
                    opacity: 1 !important;
                }
                .custom-white-placeholder::-webkit-input-placeholder {
                    color: #ffffff !important;
                }
                .custom-white-placeholder::-moz-placeholder {
                    color: #ffffff !important;
                    opacity: 1 !important;
                }
                .custom-white-placeholder:-ms-input-placeholder {
                    color: #ffffff !important;
                }
            `}</style>

            <div style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '36px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <img 
                            src="/logo.png" 
                            alt="BulkPool Logo" 
                            style={{ maxHeight: '48px', objectFit: 'contain' }} 
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                    </div>
                    <h1 style={{
                        fontSize: '1.6rem',
                        fontWeight: '800',
                        color: '#0558EE',
                        marginBottom: '8px',
                        letterSpacing: '-0.5px'
                    }}>
                        BulkPool
                    </h1>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                        Activate Supplier Account
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>
                        Set a secure password for your BulkPool supplier portal.
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.88rem',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            margin: '0 auto 16px auto'
                        }}>
                            ✓
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                            Password Set Successfully!
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '24px' }}>
                            Your supplier account is now active and ready to log in.
                        </p>
                        <button
                            type="button"
                            onClick={handleContinueToLogin}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0558EE',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Continue to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                color: '#334155',
                                marginBottom: '6px'
                            }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                className="custom-white-placeholder"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                color: '#334155',
                                marginBottom: '6px'
                            }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="custom-white-placeholder"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !uid || !token}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0558EE',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: (loading || !uid || !token) ? 'not-allowed' : 'pointer',
                                opacity: (loading || !uid || !token) ? 0.7 : 1,
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {loading ? 'Activating Account...' : 'Set Password & Activate'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}