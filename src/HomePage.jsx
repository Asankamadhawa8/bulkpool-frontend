export default function HomePage({ onNavigate }) {
    return (
        <div style={{ minHeight: '100vh', width: '100vw', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#111827', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box', overflowX: 'hidden' }}>
            
            {/* Top Navigation Bar */}
            <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #e5e7eb', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
                    <img src="/logo.png" alt="BulkPool Logo" style={{ height: '36px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#0558EE' }}>BulkPool</span>
                </div>
                
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <button 
                        type="button"
                        onClick={() => onNavigate('retailer-info')} 
                        style={{ padding: '9px 18px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}
                    >
                        For Retailers
                    </button>
                    <button 
                        type="button"
                        onClick={() => onNavigate('supplier-info')} 
                        style={{ padding: '9px 18px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}
                    >
                        For Suppliers
                    </button>
                    <button 
                        type="button"
                        onClick={() => onNavigate('login')} 
                        style={{ padding: '9px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#0558EE', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Log in
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '900px', width: '100%' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        B2B Cooperative Bulk-Purchasing Platform
                    </span>
                    <h1 style={{ fontSize: '3.4rem', fontWeight: '800', marginTop: '24px', marginBottom: '20px', color: '#0f172a', lineHeight: '1.15' }}>
                        Power in Numbers for Modern Businesses
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '48px', lineHeight: '1.6' }}>
                        BulkPool bridges independent retailers and top-tier suppliers, enabling cooperative bulk purchasing to lower inventory costs, maximize margins, and streamline supply chains.
                    </p>

                    {/* Dual Hub Entry Cards */}
                    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                        
                        {/* Retailer Hub Card */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '36px',
                            borderRadius: '14px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                            width: '340px',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                            border: '1px solid #e2e8f0',
                            boxSizing: 'border-box'
                        }}>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Retailer Hub</h3>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
                                Join buying pools, access wholesale volume discounts, and scale your retail inventory efficiently.
                            </p>
                            
                            {/* Aligned Button Group */}
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', width: '100%' }}>
                                <button 
                                    type="button"
                                    onClick={() => onNavigate('retailer-info')} 
                                    style={{
                                        flex: 1,
                                        height: '44px',
                                        borderRadius: '8px',
                                        border: '1px solid #0558EE',
                                        backgroundColor: '#ffffff',
                                        color: '#0558EE',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    Learn More
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => onNavigate('register-retailer')} 
                                    style={{
                                        flex: 1,
                                        height: '44px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#0558EE',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Supplier Hub Card */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '36px',
                            borderRadius: '14px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                            width: '340px',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                            border: '1px solid #e2e8f0',
                            boxSizing: 'border-box'
                        }}>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>Supplier Hub</h3>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
                                Connect with aggregated pools of buyers, clear bulk stock, and expand your B2B market reach.
                            </p>
                            
                            {/* Aligned Button Group */}
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', width: '100%' }}>
                                <button 
                                    type="button"
                                    onClick={() => onNavigate('supplier-info')} 
                                    style={{
                                        flex: 1,
                                        height: '44px',
                                        borderRadius: '8px',
                                        border: '1px solid #0558EE',
                                        backgroundColor: '#ffffff',
                                        color: '#0558EE',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    Learn More
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => onNavigate('register-supplier')} 
                                    style={{
                                        flex: 1,
                                        height: '44px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#0558EE',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ width: '100%', padding: '24px 48px', textAlign: 'center', borderTop: '1px solid #e5e7eb', color: '#64748b', fontSize: '0.9rem', boxSizing: 'border-box' }}>
                &copy; 2026 BulkPool. All rights reserved. Empowering small business cooperative trade.
            </footer>

        </div>
    );
}