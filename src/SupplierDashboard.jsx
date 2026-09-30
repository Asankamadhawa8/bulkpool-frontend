import { useState, useEffect, useCallback, useMemo } from 'react';
import api from './api';

// Classic Monochrome Vector Icons
const Icons = {
    Dashboard: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    ActiveListing: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    ),
    IncomingOrders: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    ),
    PoolRequests: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Analytics: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
    ),
    Payouts: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    ),
    Settings: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
};

export default function SupplierDashboard({ onLogout }) {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [profile, setProfile] = useState(null);
    const [pools, setPools] = useState([]);
    const [recentRetailers, setRecentRetailers] = useState([]);
    const [poolRequests, setPoolRequests] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Active Listings - Initialized empty for new suppliers
    const [products, setProducts] = useState([]);
    const [productModal, setProductModal] = useState({ open: false, mode: 'add', item: null });
    const [productForm, setProductForm] = useState({ name: '', price: '', moq: '', details: '' });

    // Launch Pool Modal state
    const [showLaunchModal, setShowLaunchModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [newPoolName, setNewPoolName] = useState('');
    const [newPoolMoq, setNewPoolMoq] = useState('');
    const [newPoolPrice, setNewPoolPrice] = useState('');
    const [activeRequestId, setActiveRequestId] = useState(null);

    // Pool Request Filter state
    const [requestSearch, setRequestSearch] = useState('');

    // Settings Form State - Initialized completely blank
    const [settingsForm, setSettingsForm] = useState({
        business_name: '',
        trading_name: '',
        abn: '',
        gst_branch_number: '',
        acn: '',
        client_code: '',
        industry: '',
        specific_industry_code: '',
        address: '',
        website: '',
        email: '',
        phone: '',
        fax: '',
        bank_name: '',
        bank_account_name: '',
        bank_bsb: '',
        bank_account_number: ''
    });
    const [settingsSaved, setSettingsSaved] = useState(false);

    const getEndpoint = (path) => {
        const base = api.defaults.baseURL || '';
        if (base.endsWith('/api') && path.startsWith('/api')) {
            return path.replace('/api', '');
        }
        if (!base.endsWith('/api') && !path.startsWith('/api')) {
            return `/api${path}`;
        }
        return path;
    };

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [profileRes, ordersRes, retailersRes, requestsRes, payoutsRes, productsRes] = await Promise.allSettled([
                api.get(getEndpoint('/user/profile/')),
                api.get(getEndpoint('/supplier/orders/')),
                api.get(getEndpoint('/supplier/recent-retailers/')),
                api.get(getEndpoint('/requests/')),
                api.get(getEndpoint('/supplier/payouts/')),
                api.get(getEndpoint('/supplier/products/'))
            ]);

            if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
                const pData = profileRes.value.data;
                setProfile(pData);
                setSettingsForm((prev) => ({
                    ...prev,
                    business_name: pData.business_name || '',
                    email: pData.email || '',
                    address: pData.address || '',
                    industry: pData.industry || ''
                }));
            }

            if (ordersRes.status === 'fulfilled') {
                setPools(ordersRes.value?.data || []);
            }

            if (retailersRes.status === 'fulfilled') {
                setRecentRetailers(retailersRes.value?.data || []);
            }

            if (requestsRes.status === 'fulfilled') {
                setPoolRequests(requestsRes.value?.data || []);
            }

            if (payoutsRes.status === 'fulfilled') {
                const pData = payoutsRes.value?.data;
                if (pData && pData.invoices) {
                    setPayouts(pData.invoices);
                    if (pData.bank_details) {
                        setSettingsForm((prev) => ({
                            ...prev,
                            bank_name: pData.bank_details.bank_name || '',
                            bank_account_name: pData.bank_details.account_name || '',
                            bank_bsb: pData.bank_details.bsb || '',
                            bank_account_number: pData.bank_details.account_number || ''
                        }));
                    }
                } else if (Array.isArray(pData)) {
                    setPayouts(pData);
                }
            }

            if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value?.data)) {
                setProducts(productsRes.value.data);
            }
        } catch (err) {
            console.error('Failed to load supplier data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const displayBusinessName = useMemo(() => {
        if (profile?.business_name && profile.business_name.trim().length > 0) {
            return profile.business_name.trim();
        }
        if (profile?.first_name || profile?.last_name) {
            return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        }
        if (profile?.username && profile.username.trim().length > 0) {
            return profile.username.trim();
        }
        return 'Supplier Hub';
    }, [profile]);

    const businessInitial = useMemo(() => {
        return displayBusinessName.charAt(0).toUpperCase();
    }, [displayBusinessName]);

    const metrics = useMemo(() => {
        const totalRevenue = pools.reduce((acc, p) => {
            const price = parseFloat(p.unit_price || p.price || 15.00);
            return acc + ((p.current_volume || 0) * price);
        }, 0);

        const activePoolsCount = pools.filter((p) => !p.is_fulfilled).length;
        const pendingDispatchCount = pools.filter((p) => p.status === 'Ready for Production' || p.is_fulfilled).length;

        return {
            totalRevenue: totalRevenue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }),
            activePoolsCount,
            pendingDispatchCount
        };
    }, [pools]);

    const handleDispatch = async (poolId) => {
        try {
            await api.post(getEndpoint(`/supplier/dispatch/${poolId}/`));
            setPools((prev) => prev.map((p) => (p.id === poolId ? { ...p, status: 'Dispatched' } : p)));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to dispatch order.');
        }
    };

    const handleProductSelectChange = (e) => {
        const prodId = e.target.value;
        setSelectedProductId(prodId);

        const foundProd = products.find((p) => String(p.id) === String(prodId));
        if (foundProd) {
            setNewPoolName(foundProd.name);
            setNewPoolMoq(foundProd.moq || 100);
            setNewPoolPrice(foundProd.price !== undefined ? foundProd.price : 15.00);
        } else {
            setNewPoolName('');
            setNewPoolMoq('');
            setNewPoolPrice('');
        }
    };

    const handleLaunchPool = async (e) => {
        e.preventDefault();
        if (!newPoolName.trim() || !newPoolMoq) return;

        const resolvedPrice = parseFloat(newPoolPrice) || 15.00;

        try {
            await api.post(getEndpoint('/supplier/pools/create/'), {
                product_name: newPoolName.trim(),
                moq_threshold: parseInt(newPoolMoq, 10),
                unit_price: resolvedPrice,
                price: resolvedPrice,
                current_volume: 0,
                request_id: activeRequestId
            });
            setShowLaunchModal(false);
            setNewPoolName('');
            setNewPoolMoq('');
            setNewPoolPrice('');
            setSelectedProductId('');
            setActiveRequestId(null);
            await loadData();
            alert(`Pool successfully launched at $${resolvedPrice.toFixed(2)}/unit!`);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to launch pool.');
        }
    };

    const openAddProduct = () => {
        setProductForm({ name: '', price: '', moq: '', details: '' });
        setProductModal({ open: true, mode: 'add', item: null });
    };

    const openEditProduct = (prod) => {
        setProductForm({ name: prod.name, price: prod.price, moq: prod.moq, details: prod.details });
        setProductModal({ open: true, mode: 'edit', item: prod });
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to remove this product from active listings?')) {
            try {
                await api.delete(getEndpoint('/supplier/products/'), {
                    data: { id: id }
                });
                setProducts((prev) => prev.filter((p) => p.id !== id));
                await loadData();
                alert('Product deleted successfully.');
            } catch (err) {
                console.error('Failed to delete product on backend:', err);
                const errorMsg = err.response?.data?.error || 'Cannot delete product because retailers have already joined this pool.';
                alert(errorMsg);
            }
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!productForm.name.trim()) return;

        const priceNum = parseFloat(productForm.price) || 0.0;
        const moqNum = parseInt(productForm.moq, 10) || 100;

        try {
            if (productModal.mode === 'add') {
                const response = await api.post(getEndpoint('/supplier/products/'), {
                    name: productForm.name.trim(),
                    price: priceNum,
                    unit_price: priceNum,
                    moq: moqNum,
                    details: productForm.details.trim()
                });

                const savedItem = response.data || {
                    id: Date.now(),
                    name: productForm.name.trim(),
                    price: priceNum,
                    moq: moqNum,
                    details: productForm.details.trim()
                };

                setProducts((prev) => [savedItem, ...prev]);
                alert('Product saved to your catalog successfully!');
            } else {
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === productModal.item.id
                            ? {
                                  ...p,
                                  name: productForm.name.trim(),
                                  price: priceNum,
                                  moq: moqNum,
                                  details: productForm.details.trim()
                              }
                            : p
                    )
                );
            }
            setProductModal({ open: false, mode: 'add', item: null });
            await loadData();
        } catch (err) {
            console.error('Failed to save product to database:', err);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await api.put(getEndpoint('/user/profile/'), {
                business_name: settingsForm.business_name,
                email: settingsForm.email,
                address: settingsForm.address,
                bank_name: settingsForm.bank_name,
                bank_account_name: settingsForm.bank_account_name,
                bank_bsb: settingsForm.bank_bsb,
                bank_account_number: settingsForm.bank_account_number
            });
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
            loadData();
        } catch (err) {
            alert('Failed to update settings.');
        }
    };

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
        { key: 'active-listings', label: 'Active Listing', icon: <Icons.ActiveListing /> },
        { key: 'incoming-orders', label: 'Incoming Orders', icon: <Icons.IncomingOrders /> },
        { key: 'pool-requests', label: 'Pool Requests', icon: <Icons.PoolRequests /> },
        { key: 'analytics', label: 'Analytics', icon: <Icons.Analytics /> },
        { key: 'payouts', label: 'Payouts', icon: <Icons.Payouts /> },
        { key: 'settings', label: 'Settings', icon: <Icons.Settings /> }
    ];

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f6f9fc',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#1e293b'
        }}>
            <style>{`
                input, textarea, select, .settings-input, .settings-textarea {
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                    background-color: #ffffff !important;
                }
                input::placeholder, textarea::placeholder,
                .settings-input::placeholder, .settings-textarea::placeholder {
                    color: #64748b !important;
                    -webkit-text-fill-color: #64748b !important;
                    opacity: 1 !important;
                }
            `}</style>

            {/* SIDEBAR MENU */}
            <aside style={{
                width: '260px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px 18px',
                boxSizing: 'border-box'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 8px', marginBottom: '36px' }}>
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0558EE 0%, #21E8E6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '900',
                            fontSize: '1.05rem',
                            boxShadow: '0 4px 12px rgba(5, 88, 238, 0.25)'
                        }}>
                            BP
                        </div>
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.5px' }}>
                                Bulk<span style={{ color: '#0558EE' }}>Pool</span>
                            </div>
                            <div style={{ fontSize: '0.66rem', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '0.9px', fontWeight: '800' }}>
                                SUPPLIER HUB
                            </div>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {navItems.map((menu) => {
                            const isActive = currentTab === menu.key;
                            return (
                                <button
                                    key={menu.key}
                                    onClick={() => setCurrentTab(menu.key)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '12px 16px',
                                        backgroundColor: isActive ? '#edf4ff' : 'transparent',
                                        color: isActive ? '#0558EE' : '#64748b',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.92rem',
                                        fontWeight: isActive ? '700' : '600',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        borderLeft: isActive ? '4px solid #0558EE' : '4px solid transparent'
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#0558EE' : '#64748b' }}>
                                        {menu.icon}
                                    </span>
                                    <span>{menu.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '0.74rem',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
                    System Status: <strong style={{ color: '#0f172a' }}>Online</strong>
                </div>
            </aside>

            {/* MAIN VIEW */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <header style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '16px 36px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 20
                }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', textTransform: 'capitalize', letterSpacing: '-0.3px' }}>
                        {currentTab.replace('-', ' ')}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowProfileMenu((prev) => !prev)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                backgroundColor: showProfileMenu ? '#f1f5f9' : '#ffffff',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0558EE 0%, #21E8E6 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '0.95rem'
                            }}>
                                {businessInitial}
                            </div>
                            <div style={{ textAlign: 'left', maxWidth: '220px' }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {displayBusinessName}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#0558EE', fontWeight: '700' }}>
                                    {profile?.is_verified ? 'Verified Vendor ▾' : 'Pending Verification ▾'}
                                </div>
                            </div>
                        </div>

                        {showProfileMenu && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '56px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.08)',
                                width: '220px',
                                padding: '6px 0',
                                zIndex: 50
                            }}>
                                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Registered Business</div>
                                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {displayBusinessName}
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowProfileMenu(false); setCurrentTab('settings'); }}
                                    style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}
                                >
                                    Account Settings
                                </button>
                                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                                <button
                                    onClick={onLogout}
                                    style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.88rem', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main style={{ padding: '36px' }}>
                    
                    {/* TAB 1: DASHBOARD */}
                    {currentTab === 'dashboard' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', marginBottom: '32px' }}>
                                <div style={{ backgroundColor: '#ffffff', padding: '24px 28px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0558EE 0%, #21E8E6 100%)' }} />
                                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '800' }}>TOTAL REVENUE UNLOCKED</div>
                                    <div style={{ fontSize: '2.3rem', fontWeight: '900', color: '#0f172a', margin: '10px 0' }}>{metrics.totalRevenue}</div>
                                    <div style={{ fontSize: '0.82rem', color: '#0558EE', fontWeight: '600' }}>Calculated from actual active pool rates</div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '24px 28px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #21E8E6 0%, #0891b2 100%)' }} />
                                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '800' }}>ACTIVE CO-OP POOLS</div>
                                    <div style={{ fontSize: '2.3rem', fontWeight: '900', color: '#0891b2', margin: '10px 0' }}>{metrics.activePoolsCount} Pools</div>
                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Collecting retailer commitments</div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '24px 28px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)' }} />
                                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '800' }}>PENDING DISPATCH</div>
                                    <div style={{ fontSize: '2.3rem', fontWeight: '900', color: '#059669', margin: '10px 0' }}>{metrics.pendingDispatchCount} Orders</div>
                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>MOQ reached, awaiting shipment</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                <button
                                    onClick={openAddProduct}
                                    style={{ padding: '13px 24px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    + Add Product to Product List
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveRequestId(null);
                                        if (products.length > 0) {
                                            setSelectedProductId(products[0].id);
                                            setNewPoolName(products[0].name);
                                            setNewPoolMoq(products[0].moq || 100);
                                            setNewPoolPrice(products[0].price !== undefined ? products[0].price : 15.00);
                                        }
                                        setShowLaunchModal(true);
                                    }}
                                    style={{ padding: '13px 24px', backgroundColor: '#ffffff', color: '#0558EE', border: '2px solid #0558EE', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Launch New Group Pool
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '24px' }}>
                                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 20px 0', color: '#0f172a' }}>Latest Pools Status</h3>
                                    {pools.length === 0 ? (
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No pools launched yet.</p>
                                    ) : (
                                        pools.map((p) => {
                                            const pct = Math.min(100, Math.round((p.current_volume / p.moq_threshold) * 100));
                                            return (
                                                <div key={p.id} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontWeight: '700', color: '#1e293b' }}>{p.product_name}</span>
                                                        <span style={{ fontWeight: '800', color: pct >= 100 ? '#059669' : '#0558EE' }}>{pct}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#059669' : 'linear-gradient(90deg, #0558EE 0%, #21E8E6 100%)' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                                        <span>{p.current_volume} / {p.moq_threshold} committed</span>
                                                        <span>Status: <strong style={{ color: '#0f172a' }}>{p.status}</strong></span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 20px 0', color: '#0f172a' }}>Recently Joined Retailers</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {recentRetailers.length === 0 ? (
                                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No recent retailer activity.</p>
                                        ) : (
                                            recentRetailers.map((r) => (
                                                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#edf4ff', color: '#0558EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Icons.PoolRequests />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{r.name}</div>
                                                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Postcode: {r.postcode}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: ACTIVE LISTINGS */}
                    {currentTab === 'active-listings' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>Active Product Listings</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Wholesale products saved in your database catalog.</p>
                                </div>
                                <button
                                    onClick={openAddProduct}
                                    style={{ padding: '12px 22px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    + Add New Product
                                </button>
                            </div>

                            {products.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '10px' }}>
                                    No active product listings. Click "+ Add New Product" to create your first listing.
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                                            <th style={{ padding: '14px 12px' }}>Product Name</th>
                                            <th style={{ padding: '14px 12px' }}>Price / Unit</th>
                                            <th style={{ padding: '14px 12px' }}>MOQ</th>
                                            <th style={{ padding: '14px 12px' }}>Details</th>
                                            <th style={{ padding: '14px 12px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((prod) => (
                                            <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>{prod.name}</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '700', color: '#059669' }}>
                                                    ${parseFloat(prod.price !== undefined ? prod.price : 15.00).toFixed(2)}
                                                </td>
                                                <td style={{ padding: '16px 12px' }}>{prod.moq} Units</td>
                                                <td style={{ padding: '16px 12px', color: '#64748b', maxWidth: '320px' }}>{prod.details}</td>
                                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => openEditProduct(prod)}
                                                        style={{ padding: '8px 16px', marginRight: '8px', backgroundColor: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                        style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* TAB 3: INCOMING ORDERS */}
                    {currentTab === 'incoming-orders' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>Incoming Pool Orders</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '14px 12px' }}>Product</th>
                                        <th style={{ padding: '14px 12px' }}>Volume / Target MOQ</th>
                                        <th style={{ padding: '14px 12px' }}>Status</th>
                                        <th style={{ padding: '14px 12px', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pools.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>No incoming orders.</td>
                                        </tr>
                                    ) : (
                                        pools.map((p) => (
                                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>{p.product_name}</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{p.current_volume} / {p.moq_threshold} units</td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <span style={{
                                                        padding: '5px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '700',
                                                        backgroundColor: p.is_fulfilled ? '#ecfdf5' : '#edf4ff',
                                                        color: p.is_fulfilled ? '#059669' : '#0558EE'
                                                    }}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                    {p.status === 'Ready for Production' ? (
                                                        <button
                                                            onClick={() => handleDispatch(p.id)}
                                                            style={{ padding: '8px 18px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                                        >
                                                            Dispatch Manifest
                                                        </button>
                                                    ) : p.status === 'Dispatched' ? (
                                                        <span style={{ color: '#059669', fontWeight: '700' }}>✓ Dispatched</span>
                                                    ) : (
                                                        <span style={{ color: '#64748b' }}>Collecting...</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 4: POOL REQUESTS */}
                    {currentTab === 'pool-requests' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>Retailer Sourcing Requests</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Direct demand logged by retailers seeking pooled supply.</p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter by product name..."
                                    value={requestSearch}
                                    onChange={(e) => setRequestSearch(e.target.value)}
                                    style={{ padding: '11px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', width: '280px', outline: 'none' }}
                                />
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '14px 12px' }}>Requested Product</th>
                                        <th style={{ padding: '14px 12px' }}>Est. Volume Needed</th>
                                        <th style={{ padding: '14px 12px' }}>Target Unit Price</th>
                                        <th style={{ padding: '14px 12px', textAlign: 'right' }}>Convert to Pool</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poolRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>
                                                No active sourcing requests from retailers at this moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        poolRequests
                                            .filter((r) => r.product_name?.toLowerCase().includes(requestSearch.toLowerCase()))
                                            .map((req) => (
                                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '16px 12px' }}>
                                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{req.product_name}</div>
                                                        {req.retailer_name && (
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>From: {req.retailer_name}</div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '16px 12px', fontWeight: '600' }}>{req.target_quantity || 100} units</td>
                                                    <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0558EE' }}>${parseFloat(req.target_price || 15).toFixed(2)}</td>
                                                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProductId('CUSTOM_REQUEST');
                                                                setNewPoolName(req.product_name);
                                                                setNewPoolMoq(req.target_quantity || 100);
                                                                setNewPoolPrice(req.target_price || 15.00);
                                                                setActiveRequestId(req.id);
                                                                setShowLaunchModal(true);
                                                            }}
                                                            style={{ padding: '8px 18px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                                        >
                                                            Launch Pool
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 5: ANALYTICS */}
                    {currentTab === 'analytics' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>Predictive Pool Fulfillment AI</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '20px' }}>
                                {pools.map((p) => (
                                    <div key={p.id} style={{ padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fcfdfe' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{p.product_name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#0558EE', fontWeight: '700' }}>
                                            Predicted MOQ Reach: {p.is_fulfilled ? 'Completed' : '4 - 7 business days'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 6: PAYOUTS */}
                    {currentTab === 'payouts' && (
                        <div>
                            {/* Bank Account Routing Card */}
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: '#0558EE', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Active Settlement Destination</div>
                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                                        {settingsForm.bank_name || 'Bank Name Not Set'} — {settingsForm.bank_account_number ? `••••${settingsForm.bank_account_number.slice(-4)}` : 'No Account Linked'}
                                    </h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                                        Account Name: <strong>{settingsForm.bank_account_name || 'Not Set'}</strong> | BSB: <strong>{settingsForm.bank_bsb || 'Not Set'}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCurrentTab('settings')}
                                    style={{ padding: '10px 20px', backgroundColor: '#f8fafc', color: '#0558EE', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                                >
                                    Update Bank Details
                                </button>
                            </div>

                            {/* Invoices Table */}
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>Wholesale Invoices & Dispatched Payouts</h3>
                                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                                            Confirm direct bank transfers (EFT) from participating retailers.
                                        </p>
                                    </div>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                            <th style={{ padding: '14px 12px' }}>Invoice ID</th>
                                            <th style={{ padding: '14px 12px' }}>Product Pool</th>
                                            <th style={{ padding: '14px 12px' }}>Retailer Buyer</th>
                                            <th style={{ padding: '14px 12px' }}>Total Amount</th>
                                            <th style={{ padding: '14px 12px', textAlign: 'right' }}>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payouts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>No invoices or payouts recorded yet.</td>
                                            </tr>
                                        ) : (
                                            payouts.map((inv) => (
                                                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '16px 12px', fontWeight: '700' }}>INV-00{inv.id}</td>
                                                    <td style={{ padding: '16px 12px' }}>{inv.pool_name}</td>
                                                    <td style={{ padding: '16px 12px' }}>{inv.retailer}</td>
                                                    <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0558EE' }}>${inv.amount.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                        {inv.status === 'Paid' ? (
                                                            <span style={{ padding: '5px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700', backgroundColor: '#ecfdf5', color: '#059669' }}>
                                                                Paid & Cleared
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await api.post(getEndpoint(`/supplier/invoices/${inv.id}/mark-paid/`));
                                                                        await loadData();
                                                                    } catch (err) {
                                                                        alert('Failed to update invoice status.');
                                                                    }
                                                                }}
                                                                style={{ padding: '6px 14px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                                                            >
                                                                Confirm EFT Received
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 7: SETTINGS */}
                    {currentTab === 'settings' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '36px 44px', maxWidth: '860px', boxSizing: 'border-box' }}>
                            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 18px', fontSize: '0.85rem', color: '#1e40af', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>ℹ️</span>
                                <span>Changes made here will be reflected across your wholesale catalog, group purchasing pools, and tax invoices.</span>
                            </div>

                            {settingsSaved && (
                                <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '12px 18px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem', fontWeight: '700' }}>
                                    ✓ Settings saved successfully to the system database!
                                </div>
                            )}

                            <form onSubmit={handleSaveSettings}>
                                {/* SECTION 1: BUSINESS DETAILS */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Business details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Serial number</label>
                                    <input type="text" disabled value="618718208557" style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b' }} />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Business name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={settingsForm.business_name || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, business_name: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Trading name</label>
                                    <input
                                        type="text"
                                        value={settingsForm.trading_name || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, trading_name: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ABN</label>
                                    <input
                                        type="text"
                                        value={settingsForm.abn || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, abn: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ACN</label>
                                    <input
                                        type="text"
                                        value={settingsForm.acn || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, acn: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>

                                {/* SECTION 2: INDUSTRY DETAILS */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Industry details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Business industry</label>
                                    <input
                                        type="text"
                                        value={settingsForm.industry || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, industry: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Specific industry code</label>
                                    <select
                                        value={settingsForm.specific_industry_code || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, specific_industry_code: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                                    >
                                        <option value="">-- Select Industry Code --</option>
                                        <option value="Building and Other Industrial Cleaning Services">Building and Other Industrial Cleaning Services</option>
                                        <option value="Wholesale Trade - Commercial Goods">Wholesale Trade - Commercial Goods</option>
                                        <option value="Hospitality and Food Packaging Supplies">Hospitality and Food Packaging Supplies</option>
                                    </select>
                                </div>

                                {/* SECTION 3: CONTACT DETAILS */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Contact details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Address</label>
                                    <textarea
                                        rows="3"
                                        value={settingsForm.address || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Website</label>
                                    <input
                                        type="text"
                                        value={settingsForm.website || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Email</label>
                                    <input
                                        type="email"
                                        value={settingsForm.email || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Phone</label>
                                    <input
                                        type="text"
                                        value={settingsForm.phone || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>

                                {/* SECTION 4: BANK PAYOUT DETAILS */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Bank payout details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Bank Name</label>
                                    <input
                                        type="text"
                                        value={settingsForm.bank_name || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })}
                                        placeholder="e.g. National Australia Bank"
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Account Name</label>
                                    <input
                                        type="text"
                                        value={settingsForm.bank_account_name || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, bank_account_name: e.target.value })}
                                        placeholder="Business Legal Account Name"
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>BSB Number</label>
                                    <input
                                        type="text"
                                        value={settingsForm.bank_bsb || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, bank_bsb: e.target.value })}
                                        placeholder="083-004"
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Account Number</label>
                                    <input
                                        type="text"
                                        value={settingsForm.bank_account_number || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, bank_account_number: e.target.value })}
                                        placeholder="889210459"
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>

                                <div style={{ paddingLeft: '200px', marginTop: '30px' }}>
                                    <button type="submit" style={{ padding: '12px 28px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 88, 238, 0.2)' }}>
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            {/* PRODUCT MODAL */}
            {productModal.open && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '14px', width: '100%', maxWidth: '480px' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', fontWeight: '800' }}>
                            {productModal.mode === 'add' ? 'Add Listed Product' : 'Edit Product'}
                        </h3>
                        <form onSubmit={handleSaveProduct}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter product title..."
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Price / Unit ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="18.50"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>MOQ</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="100"
                                        value={productForm.moq}
                                        onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Product Details</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter product description or specifications..."
                                    value={productForm.details}
                                    onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setProductModal({ open: false, mode: 'add', item: null })} style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#1e293b', fontWeight: '600' }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* LAUNCH POOL MODAL */}
            {showLaunchModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '14px', width: '100%', maxWidth: '460px' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontWeight: '800' }}>
                            {activeRequestId ? 'Convert Retailer Request to Pool' : 'Launch Group Purchasing Pool'}
                        </h3>
                        
                        <form onSubmit={handleLaunchPool}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                                    Select from Listed Products
                                </label>
                                {activeRequestId ? (
                                    <input
                                        type="text"
                                        disabled
                                        value={newPoolName}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: '600', boxSizing: 'border-box' }}
                                    />
                                ) : (
                                    <select
                                        required
                                        value={selectedProductId}
                                        onChange={handleProductSelectChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                                    >
                                        <option value="">-- Choose a Product --</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Base MOQ: {p.moq || 100}, ${parseFloat(p.price !== undefined ? p.price : 15.00).toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {!activeRequestId && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                                        Pool Product Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newPoolName}
                                        onChange={(e) => setNewPoolName(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                            )}

                            {/* Aligned Row for MOQ and Wholesale Rate */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                                        MOQ Threshold
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={newPoolMoq}
                                        onChange={(e) => setNewPoolMoq(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>
                                        Rate / Unit ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        value={newPoolPrice}
                                        onChange={(e) => setNewPoolPrice(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLaunchModal(false);
                                        setActiveRequestId(null);
                                    }}
                                    style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#1e293b', fontWeight: '600' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 24px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Launch Pool
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}