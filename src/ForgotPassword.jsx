import { useState } from 'react';
import api from './api';

export default function ForgotPassword({ onNavigate }) {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint = api.defaults.baseURL && api.defaults.baseURL.endsWith('/api')
                ? '/auth/forgot-password/'
                : '/api/auth/forgot-password/';

            await api.post(endpoint, {
                email: identifier.trim(),
                username: identifier.trim()
            });

            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
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
                maxWidth: '420px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '36px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <img 
                            src="/logo.png" 
                            alt="BulkPool Logo" 
                            style={{ maxHeight: '48px', objectFit: 'contain' }} 
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                    </div>
                    <h1 
                        onClick={() => onNavigate && onNavigate('home')}
                        style={{
                            fontSize: '1.6rem',
                            fontWeight: '800',
                            color: '#0558EE',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        BulkPool
                    </h1>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                        Reset your password
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '6px' }}>
                        Enter your email or username and we'll send you an activation link to set a new password.
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.88rem'
                    }}>
                        {error}
                    </div>
                )}

                {submitted ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.6rem',
                            margin: '0 auto 16px auto'
                        }}>
                            ✉
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                            Check your email
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
                            If an account exists for <strong>{identifier}</strong>, you will receive an email shortly with instructions to reset your password.
                        </p>
                        <button
                            type="button"
                            onClick={() => onNavigate('login')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0558EE',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer'
                            }}
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                color: '#334155',
                                marginBottom: '6px'
                            }}>
                                Email or Username
                            </label>
                            <input
                                type="text"
                                className="custom-white-placeholder"
                                required
                                placeholder="name@business.com.au"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0558EE',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => onNavigate('login')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    fontSize: '0.88rem',
                                    textDecoration: 'underline'
                                }}
                            >
                                &larr; Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}