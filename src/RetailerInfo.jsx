export default function RetailerInfo({ onNavigate }) {
    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#111827', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflowX: 'hidden' }}>
            
            {/* Header Navigation Bar */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 10 }}>
                {/* Brand Logo & Back to Home */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
                    <img src="/logo.png" alt="BulkPool Logo" style={{ height: '36px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0558EE' }}>BulkPool</span>
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#eff6ff', color: '#0558EE', padding: '3px 8px', borderRadius: '12px', fontWeight: '600' }}>Retailer Hub</span>
                </div>

                {/* Right Action Controls */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                        type="button"
                        onClick={() => onNavigate('supplier-info')} 
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc', color: '#1e293b', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        For Suppliers
                    </button>
                    <button 
                        type="button"
                        onClick={() => onNavigate('login')} 
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Sign In
                    </button>
                    <button 
                        type="button"
                        onClick={() => onNavigate('register-retailer')} 
                        style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#0558EE', color: '#ffffff', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(5,88,238,0.2)' }}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{ padding: '64px 24px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap-reverse' }}>
                    
                    {/* Left Column: Copy & CTAs */}
                    <div style={{ flex: 1, minWidth: '320px' }}>
                        <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Cooperative Bulk Buying
                        </span>
                        
                        <h1 style={{ fontSize: '2.9rem', fontWeight: '800', marginTop: '18px', marginBottom: '18px', color: '#0f172a', lineHeight: '1.2' }}>
                            Connect with trusted suppliers
                        </h1>

                        <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.6', marginBottom: '28px' }}>
                            The <strong>Retailer Hub</strong> empowers small businesses and independent merchants to pool collective demand. By teaming up with nearby retailers, you instantly bypass high Minimum Order Quantities (MOQs) and unlock Tier-1 bulk discounts previously reserved for retail giants.
                        </p>

                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <button 
                                onClick={() => onNavigate('register-retailer')}
                                style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0558EE', color: '#ffffff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
                            >
                                Join a Buying Pool
                            </button>
                            <button 
                                onClick={() => onNavigate('login')}
                                style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
                            >
                                Browse Pools
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div style={{ flex: 1, minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
                        <img 
                            src="/retailer-hero.jpg" 
                            alt="Retailers inspecting inventory" 
                            style={{ width: '100%', maxWidth: '520px', height: '360px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=80';
                            }}
                        />
                    </div>

                </div>
            </section>

            {/* Core Benefits / Why Retailer Hub */}
            <section style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
                    <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                        Designed to protect your margins
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
                        Independent retail shouldn't mean paying full wholesale markup. Here is how BulkPool puts the leverage back in your hands.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                    
                    <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '14px' }}>🤝</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Group Purchasing Power</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>
                            Combine product volume with non-competing merchants in your local area to hit wholesale tiers without tying up all your working capital in excess stock.
                        </p>
                    </div>

                    <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '14px' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Verified Suppliers</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>
                            Every supplier on BulkPool undergoes credential checks, ensuring direct-from-source quality, reliable shipping schedules, and transparent dispute resolution.
                        </p>
                    </div>

                    <div style={{ padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '14px' }}>📊</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Split Invoicing & Delivery</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>
                            Orders placed in a group pool are automatically split at checkout. You receive separate tax invoices and tracked shipments straight to your store door.
                        </p>
                    </div>

                </div>
            </section>

            {/* Visual Process Section */}
            <section style={{ backgroundColor: '#f1f5f9', padding: '64px 24px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <img 
                            src="/retailer-procurement.jpg" 
                            alt="Warehouse pallet logistics" 
                            style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.07)' }}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
                            }}
                        />
                    </div>

                    <div style={{ flex: 1.2, minWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                            How the Retailer Hub Works
                        </h3>
                        <ol style={{ paddingLeft: '20px', color: '#475569', fontSize: '1rem', lineHeight: '1.8' }}>
                            <li><strong>Select or Propose a Pool:</strong> Choose regular consumables (packaging, cleaning supplies, stock essentials) or start your own pool.</li>
                            <li><strong>Aggregate Order Quantity:</strong> Other local retailers contribute their order portions until the volume target is fulfilled.</li>
                            <li><strong>Wholesale Discount Activated:</strong> The supplier fulfills the order at bulk pricing, saving you up to 35% per unit.</li>
                        </ol>
                        <button 
                            onClick={() => onNavigate('register-retailer')}
                            style={{ marginTop: '16px', padding: '10px 22px', borderRadius: '6px', border: 'none', backgroundColor: '#0558EE', color: '#ffffff', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Start Saving Today &rarr;
                        </button>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '24px 40px', textAlign: 'center', borderTop: '1px solid #e5e7eb', color: '#64748b', fontSize: '0.88rem', backgroundColor: '#ffffff' }}>
                &copy; 2026 BulkPool Technologies Pty Ltd. Designed for independent retailers.
            </footer>

        </div>
    );
}