import { useState } from 'react';
import api from './api';

const RETAILER_CATEGORIES = [
    { id: 'cleaning_janitorial', label: 'Commercial Cleaning & Janitorial', icon: '🧹' },
    { id: 'hospitality_cafe', label: 'Cafes, Restaurants & Hospitality', icon: '☕' },
    { id: 'gym_fitness', label: 'Gyms, Fitness & Wellness Centers', icon: '🏋️' },
    { id: 'office_corporate', label: 'Offices & Co-working Spaces', icon: '🏢' },
    { id: 'automotive_detailing', label: 'Auto Detailing & Workshops', icon: '🚗' },
    { id: 'property_maintenance', label: 'Property & Facility Maintenance', icon: '🔧' },
    { id: 'medical_healthcare', label: 'Clinics & Healthcare Facilities', icon: '🩺' },
    { id: 'other', label: 'General Commercial Retailer / Other', icon: '📦' }
];

export default function Register({ onNavigate, onNavigateToLogin }) {
    const [step, setStep] = useState(1);
    const [postcode, setPostcode] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [abn, setAbn] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goToLogin = () => {
        if (onNavigateToLogin) {
            onNavigateToLogin();
        } else if (onNavigate) {
            onNavigate('login');
        } else {
            window.location.href = '/login';
        }
    };

    const goToHome = () => {
        if (onNavigate) {
            onNavigate('home');
        } else {
            window.location.href = '/';
        }
    };

    // Step 1: Postcode validation
    const handleStep1Next = (e) => {
        e.preventDefault();
        setError(null);
        if (!postcode.trim() || postcode.trim().length < 3) {
            setError('Please enter a valid Australian postcode.');
            return;
        }
        setStep(2);
    };

    // Step 2: Category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setError(null);
        setStep(3);
    };

    // Step 3: Business Details
    const handleStep3Next = (e) => {
        e.preventDefault();
        setError(null);
        if (!businessName.trim()) {
            setError('Please enter your registered business or company name.');
            return;
        }
        setStep(4);
    };

    // Step 4: Contact Person
    const handleStep4Next = (e) => {
        e.preventDefault();
        setError(null);
        if (!firstName.trim() || !lastName.trim() || !contactNumber.trim()) {
            setError('Please enter your full contact details.');
            return;
        }
        setStep(5);
    };

    // Step 5: Final Submission (Account Credentials & Creation)
    const handleSubmitFinal = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError('Please enter a valid work email.');
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
                ? '/register/'
                : '/api/register/';

            await api.post(endpoint, {
                username: email.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                password: password,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                role: 'retailer',
                business_name: businessName.trim(),
                abn: abn.trim(),
                postcode: postcode.trim(),
                category: selectedCategory,
                phone: contactNumber.trim()
            });

            setStep(6);
        } catch (err) {
            console.error('Retailer registration error:', err.response?.data || err);
            const serverMsg = err.response?.data?.error 
                || err.response?.data?.detail 
                || err.response?.data?.username?.[0]
                || err.response?.data?.email?.[0]
                || 'Failed to create your retailer account. Please check your details and try again.';
            setError(serverMsg);
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
            {/* Scoped style: White placeholder, solid black typed text */}
            <style>{`
                .retailer-custom-input {
                    color: #000000 !important;
                    background-color: #ffffff !important;
                }
                .retailer-custom-input::placeholder {
                    color: #ffffff !important;
                    opacity: 1 !important;
                }
                .retailer-custom-input::-webkit-input-placeholder {
                    color: #ffffff !important;
                }
                .retailer-custom-input::-moz-placeholder {
                    color: #ffffff !important;
                    opacity: 1 !important;
                }
                .retailer-custom-input:-ms-input-placeholder {
                    color: #ffffff !important;
                }
            `}</style>

            <div style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '36px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                {/* Brand Header with Logo */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <img 
                            src="/logo.png" 
                            alt="BulkPool Logo" 
                            style={{ maxHeight: '44px', objectFit: 'contain', cursor: 'pointer' }} 
                            onClick={goToHome}
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                    </div>
                    <h1 
                        onClick={goToHome}
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#0558EE',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        BulkPool
                    </h1>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                        Retailer Buyer Account
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                        Unlock wholesale volume discounts through collaborative purchasing pools.
                    </p>
                </div>

                {/* Step Indicator (Steps 1 to 5) */}
                {step <= 5 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    height: '4px',
                                    borderRadius: '2px',
                                    backgroundColor: step >= s ? '#0558EE' : '#e2e8f0',
                                    transition: 'background-color 0.3s'
                                }} />
                                <span style={{
                                    fontSize: '0.72rem',
                                    color: step >= s ? '#0558EE' : '#94a3b8',
                                    fontWeight: step === s ? '700' : '500',
                                    marginTop: '4px',
                                    display: 'inline-block'
                                }}>
                                    {s === 1 && 'Location'}
                                    {s === 2 && 'Category'}
                                    {s === 3 && 'Business'}
                                    {s === 4 && 'Contact'}
                                    {s === 5 && 'Security'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error Banner */}
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

                {/* STEP 1: Postcode / Location */}
                {step === 1 && (
                    <form onSubmit={handleStep1Next}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Delivery Postcode
                            </label>
                            <input
                                type="text"
                                className="retailer-custom-input"
                                placeholder="e.g. 3000, 3171"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                autoFocus
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '6px' }}>
                                Pools consolidate delivery to regional hubs to keep freight costs minimal.
                            </p>
                        </div>
                        <button
                            type="submit"
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
                            Next: Primary Category &rarr;
                        </button>
                    </form>
                )}

                {/* STEP 2: Category Selection */}
                {step === 2 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <label style={{ fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
                                Select your business industry
                            </label>
                            <span 
                                onClick={() => setStep(1)} 
                                style={{ fontSize: '0.8rem', color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                            >
                                &larr; Back
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', marginBottom: '16px' }}>
                            {RETAILER_CATEGORIES.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: selectedCategory === cat.id ? '2px solid #0558EE' : '1px solid #e2e8f0',
                                        backgroundColor: selectedCategory === cat.id ? '#eff6ff' : '#ffffff',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: Business Details */}
                {step === 3 && (
                    <form onSubmit={handleStep3Next}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Business Information</h3>
                            <span 
                                onClick={() => setStep(2)} 
                                style={{ fontSize: '0.8rem', color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                            >
                                &larr; Back
                            </span>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Registered Business Name
                            </label>
                            <input
                                type="text"
                                className="retailer-custom-input"
                                placeholder="e.g. Acme Commercial Services Pty Ltd"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                autoFocus
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                ABN (Optional)
                            </label>
                            <input
                                type="text"
                                className="retailer-custom-input"
                                placeholder="11-digit Australian Business Number"
                                value={abn}
                                onChange={(e) => setAbn(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
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
                            Next: Contact Person &rarr;
                        </button>
                    </form>
                )}

                {/* STEP 4: Contact Details */}
                {step === 4 && (
                    <form onSubmit={handleStep4Next}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Contact Person</h3>
                            <span 
                                onClick={() => setStep(3)} 
                                style={{ fontSize: '0.8rem', color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                            >
                                &larr; Back
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="retailer-custom-input"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    autoFocus
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="retailer-custom-input"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                className="retailer-custom-input"
                                placeholder="0400 000 000"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
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
                            Next: Login Credentials &rarr;
                        </button>
                    </form>
                )}

                {/* STEP 5: Email & Password Setup */}
                {step === 5 && (
                    <form onSubmit={handleSubmitFinal}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Create Account Credentials</h3>
                            <span 
                                onClick={() => setStep(4)} 
                                style={{ fontSize: '0.8rem', color: '#0558EE', cursor: 'pointer', fontWeight: '600' }}
                            >
                                &larr; Back
                            </span>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Work Email (Username)
                            </label>
                            <input
                                type="email"
                                className="retailer-custom-input"
                                placeholder="buyer@company.com.au"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                className="retailer-custom-input"
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
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="retailer-custom-input"
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
                                    boxSizing: 'border-box'
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
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Complete Registration'}
                        </button>
                    </form>
                )}

                {/* STEP 6: Confirmation & Success Screen */}
                {step === 6 && (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
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
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                            Retailer Account Created!
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
                            Welcome to BulkPool! Your account for <strong>{businessName}</strong> is active. You can now access available bulk purchasing pools and commit to volume orders.
                        </p>
                        <button
                            type="button"
                            onClick={goToLogin}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#0558EE',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Proceed to Login
                        </button>
                    </div>
                )}

                {/* Switch to Login Link Only */}
                {step <= 5 && (
                    <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
                        Already have an account?{' '}
                        <span 
                            onClick={goToLogin}
                            style={{ color: '#0558EE', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Sign In
                        </span>
                    </div>
                )}

                {/* Back to Home Link */}
                <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                    <button 
                        type="button" 
                        onClick={goToHome} 
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#64748b', 
                            cursor: 'pointer', 
                            fontSize: '0.88rem', 
                            textDecoration: 'underline' 
                        }}
                    >
                        &larr; Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
}


