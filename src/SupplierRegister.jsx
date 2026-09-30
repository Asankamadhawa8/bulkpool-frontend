import { useState } from 'react';
import api from './api';

export default function SupplierRegister({ onNavigate }) {
    const [step, setStep] = useState(1);

    const [postcode, setPostcode] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [afterHours, setAfterHours] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const availableCategories = [
        'Packaging, Cartons & Mailing Supplies',
        'Commercial Cleaning & Hygiene Chemicals',
        'Food & Beverage Wholesale Supplies',
        'Safety Gear, Workwear & PPE',
        'Retail Fixtures & Display Hardware',
        'Cold-Chain & Insulated Shipping Materials',
        'Warehouse Consumables & Pallet Wrap',
        'Eco-Friendly Takeaway Food Packaging'
    ];

    const filteredCategories = availableCategories.filter(cat =>
        cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleNext = (e) => {
        if (e) e.preventDefault();
        setError(null);

        if (step === 1 && !postcode.trim()) {
            setError('Please enter your primary dispatch postcode.');
            return;
        }
        if (step === 2 && !selectedCategory) {
            setError('Please select your main supply category.');
            return;
        }
        if (step === 3 && (!email.trim() || !email.includes('@'))) {
            setError('Please enter a valid work email address.');
            return;
        }
        if (step === 4 && !contactNumber.trim()) {
            setError('Please enter a phone number where our team can reach you.');
            return;
        }

        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setError(null);
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleSubmitFinal = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setError('Please provide your first and last name.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Check api.js baseURL:
            // If baseURL has '/api' at the end, use '/supplier-onboard/'
            // If baseURL is just the host (e.g. 'http://127.0.0.1:8000'), use '/api/supplier-onboard/'
            const endpoint = api.defaults.baseURL && api.defaults.baseURL.endsWith('/api')
                ? '/supplier-onboard/'
                : '/api/supplier-onboard/';

            await api.post('/api/supplier-onboard/', {
                postcode,
                category: selectedCategory,
                email,
                contactNumber,
                afterHours,
                firstName,
                lastName,
                businessName: businessName || `${firstName} ${lastName}`
            });
            setStep(6);
        } catch (err) {
            console.error("Submission error details:", err.response?.data || err);
            const serverMsg = err.response?.data?.error 
                || err.response?.data?.detail 
                || (typeof err.response?.data === 'string' ? err.response?.data : null);
            setError(serverMsg || 'Unable to submit your registration. Please check the network tab or console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#111827', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', boxSizing: 'border-box' }}>
            
            {/* Header Navigation & Multi-step Progress Bar */}
            {/* Top Navigation & Segmented Stepper Bar */}
            {/* Top Navigation & Centered Segmented Stepper Bar */}
{/* Top Navigation & Centered Segmented Stepper Bar */}
 {/* Top Navigation & Centered Segmented Stepper Bar */}
            <header style={{
                width: '100%',
                padding: '28px 48px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                boxSizing: 'border-box',
                borderBottom: 'none'
            }}>
                {/* Left balance placeholder */}
                <div />

                {/* Center Group: Logo + Brand + Step Lines */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '36px', justifyContent: 'center' }}>
                    {/* Brand with Logo */}
                    <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} 
                        onClick={() => onNavigate('home')}
                    >
                        <img 
                            src="/logo.png" 
                            alt="BulkPool Logo" 
                            style={{ height: '32px', objectFit: 'contain' }} 
                            onError={(e) => e.target.style.display = 'none'} 
                        />
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0558EE', letterSpacing: '-0.5px' }}>
                            BulkPool
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '600', color: '#475569' }}>
                            business
                        </span>
                    </div>

                    {/* Longer & Thicker Segmented Progress Indicators */}
                    {step <= 5 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                    key={s}
                                    style={{
                                        width: '110px',
                                        height: '8px',
                                        borderRadius: '9999px',
                                        backgroundColor: s <= step ? '#0558EE' : '#e2e8f0',
                                        transition: 'background-color 0.25s ease'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Close Cross Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 20 }}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (typeof onNavigate === 'function') {
                                onNavigate('home');
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            color: '#334155',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            lineHeight: 1,
                            pointerEvents: 'auto'
                        }}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </header>
            {/* Main Stage Container */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px 24px', boxSizing: 'border-box' }}>
                
                {step > 1 && step <= 5 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600', marginBottom: '28px', padding: 0 }}
                    >
                        &larr; Back
                    </button>
                )}

                {error && (
                    <div style={{ width: '100%', backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                {/* STEP 1: Postcode */}
                {step === 1 && (
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0558EE', marginBottom: '28px', letterSpacing: '-0.3px' }}>
                            Grow your wholesale supply with BulkPool today.
                        </h1>

                        {/* 3 Metric Pills */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>+20k Retailers</div>
                                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>connecting with direct suppliers</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>Guaranteed MOQs</div>
                                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>orders only trigger on volume</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>Direct Pallet Orders</div>
                                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>move warehouse stock faster</div>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '14px' }}>
                            Already have an account?{' '}
                            <span onClick={() => onNavigate('login')} style={{ color: '#0558EE', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>
                                Log in
                            </span>
                        </div>

                        <form onSubmit={handleNext}>
                            <input
                                type="text"
                                placeholder="Enter dispatch facility postcode (e.g. 3175)"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '14px 16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    marginBottom: '40px'
                                }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    style={{
                                        width: '240px',
                                        padding: '13px',
                                        backgroundColor: '#0558EE',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* STEP 2: Category Search & Selection */}
                {step === 2 && (
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0558EE', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                            What's the main type of stock you supply?
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
                            Choose one category for now. You can add more later.
                        </p>

                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '14px 16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                            Results
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', marginBottom: '40px' }}>
                            {filteredCategories.map((cat, idx) => {
                                const isSelected = selectedCategory === cat;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '16px 8px',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            color: isSelected ? '#0558EE' : '#1e293b',
                                            fontWeight: isSelected ? '700' : '400',
                                            backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                            borderRadius: isSelected ? '6px' : '0'
                                        }}
                                    >
                                        <span>{cat}</span>
                                        {isSelected && <span style={{ backgroundColor: '#0558EE', color: '#ffffff', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>Selected</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!selectedCategory}
                                style={{
                                    width: '240px',
                                    padding: '13px',
                                    backgroundColor: '#0558EE',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: selectedCategory ? 'pointer' : 'not-allowed',
                                    opacity: selectedCategory ? 1 : 0.6
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Demand Alert & Email */}
                {step === 3 && (
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>You're in demand:</span>
                            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0558EE', margin: '8px 0 10px 0', lineHeight: '1.3', letterSpacing: '-0.3px' }}>
                                Verified bulk pools for {selectedCategory} around postcode {postcode} are actively filling orders*
                            </h2>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                *aggregated purchasing demand posted within your distribution zone in the last 4 weeks
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                            What is your email address?
                        </h3>

                        <form onSubmit={handleNext}>
                            <input
                                type="email"
                                placeholder="name@company.com.au"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '14px 16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    marginBottom: '14px'
                                }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '40px' }}>
                                By clicking 'Next', you agree to BulkPool's Wholesale Terms & Conditions and consent to receive notifications regarding pool commitments and volume allocations.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    style={{
                                        width: '240px',
                                        padding: '13px',
                                        backgroundColor: '#0558EE',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* STEP 4: Contact Number */}
                {step === 4 && (
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0558EE', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                            What number should we reach you on?
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px' }}>
                            Our vendor management desk will call you on this direct line to confirm your warehouse logistics and tier pricing.
                        </p>

                        <form onSubmit={handleNext}>
                            <input
                                type="tel"
                                placeholder="Contact number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '14px 16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    marginBottom: '20px'
                                }}
                            />

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569', cursor: 'pointer', marginBottom: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={afterHours}
                                    onChange={(e) => setAfterHours(e.target.checked)}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                Flexible hours: I'm happy to be called by BulkPool from 7am to 7pm Mon–Sat.
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    style={{
                                        width: '240px',
                                        padding: '13px',
                                        backgroundColor: '#0558EE',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* STEP 5: Name & Business Verification */}
                {step === 5 && (
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0558EE', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                            Provide a few more details about you and your business.
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px' }}>
                            This will help us verify your supplier credentials and prepare your directory listing.
                        </p>

                        <form onSubmit={handleSubmitFinal}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>First name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Last name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Registered business name</label>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Optional</span>
                                <input
                                    type="text"
                                    placeholder="Registered business name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '260px',
                                        padding: '14px',
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
                                    {loading ? 'Registering...' : 'Register your business today'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* STEP 6: Confirmation */}
                {step === 6 && (
                    <div style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#0558EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px auto' }}>
                            ✓
                        </div>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                            We have received your business details
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 28px auto' }}>
                            Thank you, <strong>{firstName}</strong>. Our vendor verification team will contact you at <strong>{contactNumber}</strong> shortly to review your catalog and activate your bulk listings on BulkPool.
                        </p>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px', maxWidth: '440px', margin: '0 auto 36px auto', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>
                            <div><strong>Category:</strong> {selectedCategory}</div>
                            <div><strong>Dispatch Hub:</strong> Postcode {postcode}</div>
                            <div><strong>Work Email:</strong> {email}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate('home')}
                            style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#0558EE', color: '#ffffff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
                        >
                            Return to Home
                        </button>
                    </div>
                )}

            </main>

            {/* Bottom Support Desk Bar */}
            <footer style={{ padding: '20px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                Call us <strong>1300 000 000</strong> (Mon–Fri 8:30am–7:00pm, Sat 9am–5pm)
            </footer>

        </div>
    );
}