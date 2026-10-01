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
    MyPools: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    BrowsePools: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
    ),
    MyOrders: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    ),
    Suppliers: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    LocalNetwork: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Invoices: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="15" x2="10" y2="15" />
        </svg>
    ),
    Settings: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
};

export default function RetailerDashboard({ onLogout }) {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [profile, setProfile] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [loading, setLoading] = useState(true);

    // Live Database States
    const [summary, setSummary] = useState({
        total_savings: 0,
        committed_capital: 0,
        active_pools_count: 0,
        transit_count: 0,
        urgent_pools: []
    });
    const [marketplacePools, setMarketplacePools] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [verifiedSuppliers, setVerifiedSuppliers] = useState([]);
    const [networkPeers, setNetworkPeers] = useState([]);
    const [invoices, setInvoices] = useState([]);

    // Invoice View Modal state
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Marketplace Search & Pledging Modal
    const [searchQuery, setSearchQuery] = useState('');
    const [joinModal, setJoinModal] = useState({ open: false, pool: null, quantity: '' });

    // Request Pool Modal State
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        product_name: '',
        target_quantity: '',
        target_price: ''
    });

    // Settings Form State (MYOB-style)
    const [settingsForm, setSettingsForm] = useState({
        business_name: '',
        trading_name: 'Registered Retail Member',
        abn: '25 639 398 164',
        acn: '',
        industry: 'Retail & Commercial Wholesale Supplies',
        specific_industry_code: 'Retail Trade - General Store Operations',
        address: '',
        website: '',
        email: '',
        phone: '(03) 7008 5025'
    });
    const [settingsSaved, setSettingsSaved] = useState(false);

    // Dynamic Endpoint Prefix Helper
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

    // Load Live Data from System
    const loadSystemData = useCallback(async () => {
        try {
            setLoading(true);
            const [
                profileRes,
                summaryRes,
                poolsRes,
                ordersRes,
                requestsRes,
                suppliersRes,
                networkRes,
                invoicesRes
            ] = await Promise.allSettled([
                api.get(getEndpoint('/user/profile/')),
                api.get(getEndpoint('/retailer/dashboard-summary/')),
                api.get(getEndpoint('/retailer/marketplace/')),
                api.get(getEndpoint('/retailer/orders/')),
                api.get(getEndpoint('/requests/')),
                api.get(getEndpoint('/suppliers/public/')),
                api.get(getEndpoint('/retailer/network-peers/')),
                api.get(getEndpoint('/retailer/invoices/'))
            ]);

            if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
                const p = profileRes.value.data;
                setProfile(p);
                setSettingsForm((prev) => ({
                    ...prev,
                    business_name: p.business_name || '',
                    email: p.email || '',
                    address: p.address || ''
                }));
            }

            if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
                setSummary(summaryRes.value.data);
            }

            if (poolsRes.status === 'fulfilled' && Array.isArray(poolsRes.value?.data)) {
                setMarketplacePools(poolsRes.value.data);
            }

            if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value?.data)) {
                setMyOrders(ordersRes.value.data);
            }

            if (requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value?.data)) {
                setMyRequests(requestsRes.value.data);
            }

            if (suppliersRes.status === 'fulfilled' && Array.isArray(suppliersRes.value?.data)) {
                setVerifiedSuppliers(suppliersRes.value.data);
            }

            if (networkRes.status === 'fulfilled' && Array.isArray(networkRes.value?.data)) {
                setNetworkPeers(networkRes.value.data);
            }

            if (invoicesRes.status === 'fulfilled' && Array.isArray(invoicesRes.value?.data)) {
                setInvoices(invoicesRes.value.data);
            }
        } catch (err) {
            console.error('System data load failure:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSystemData();
    }, [loadSystemData]);

    const displayBusinessName = useMemo(() => {
        if (profile?.business_name && profile.business_name.trim().length > 0) {
            return profile.business_name.trim();
        }
        if (profile?.username && profile.username.trim().length > 0) {
            return profile.username.trim();
        }
        return 'Registered Retailer';
    }, [profile]);

    const businessInitial = useMemo(() => {
        return displayBusinessName.charAt(0).toUpperCase();
    }, [displayBusinessName]);

    // Handle Join Pool
    const handleJoinPool = async (e) => {
        e.preventDefault();
        const qty = parseInt(joinModal.quantity, 10);
        if (!qty || qty <= 0 || !joinModal.pool) return;

        try {
            await api.post(getEndpoint(`/pools/${joinModal.pool.id}/contribute/`), {
                quantity: qty
            });
            setJoinModal({ open: false, pool: null, quantity: '' });
            await loadSystemData();
            alert('Your commitment has been recorded to the live pool.');
        } catch (err) {
            alert(err.response?.data?.error || 'Could not pledge to this pool.');
        }
    };

    // Handle Request New Pool from Suppliers
    const handleRequestPool = async (e) => {
        e.preventDefault();
        if (!requestForm.product_name.trim()) return;

        try {
            await api.post(getEndpoint('/requests/'), {
                product_name: requestForm.product_name.trim(),
                target_quantity: parseInt(requestForm.target_quantity, 10) || 100,
                target_price: parseFloat(requestForm.target_price) || 15.00
            });
            setShowRequestModal(false);
            setRequestForm({ product_name: '', target_quantity: '', target_price: '' });
            alert('Your sourcing request has been broadcasted to verified wholesale suppliers.');
            loadSystemData();
        } catch (err) {
            console.error('Request submission error:', err.response?.data);
            const errorDetails = err.response?.data
                ? JSON.stringify(err.response.data)
                : 'Failed to submit pool request.';
            alert(`Error: ${errorDetails}`);
        }
    };

    // Save Settings
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await api.put(getEndpoint('/user/profile/'), {
                business_name: settingsForm.business_name,
                email: settingsForm.email,
                address: settingsForm.address
            });
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
            loadSystemData();
        } catch (err) {
            alert('Failed to update retailer settings.');
        }
    };

    // Filtered Pools
    const filteredPools = useMemo(() => {
        return marketplacePools.filter((p) => {
            return p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [marketplacePools, searchQuery]);

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
        { key: 'my-pools', label: 'My Pools', icon: <Icons.MyPools /> },
        { key: 'browse-pools', label: 'Browse Pools', icon: <Icons.BrowsePools /> },
        { key: 'my-orders', label: 'My Orders', icon: <Icons.MyOrders /> },
        { key: 'suppliers', label: 'Suppliers', icon: <Icons.Suppliers /> },
        { key: 'local-network', label: 'Local Network', icon: <Icons.LocalNetwork /> },
        { key: 'invoices', label: 'Invoices', icon: <Icons.Invoices /> },
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
                input, textarea, select {
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                    background-color: #ffffff !important;
                }
                input::placeholder, textarea::placeholder {
                    color: #64748b !important;
                    -webkit-text-fill-color: #64748b !important;
                    opacity: 1 !important;
                }
            `}</style>

            {/* SIDEBAR */}
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
                            <div style={{ fontSize: '0.66rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.9px', fontWeight: '800' }}>
                                RETAIL HUB
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
                    Live Data: <strong style={{ color: '#0f172a' }}>Database Connected</strong>
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
                                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                                    Verified Retailer ▾
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
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Store Account</div>
                                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {displayBusinessName}
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowProfileMenu(false); setCurrentTab('settings'); }}
                                    style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}
                                >
                                    Store Settings
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

                    {/* 1. DASHBOARD */}
                    {currentTab === 'dashboard' && (
                        <div>
                            {/* KPI Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                                <div style={{ backgroundColor: '#ffffff', padding: '22px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -2px rgba(5, 88, 238, 0.05)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)' }} />
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800' }}>TOTAL SAVINGS REALIZED</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', margin: '8px 0' }}>
                                        ${summary.total_savings.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>vs. Standard Wholesale MSRP</div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '22px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -2px rgba(5, 88, 238, 0.05)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0558EE 0%, #21E8E6 100%)' }} />
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800' }}>COMMITTED CAPITAL</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0558EE', margin: '8px 0' }}>
                                        ${summary.committed_capital.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pledged in open pools</div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '22px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -2px rgba(5, 88, 238, 0.05)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #21E8E6 0%, #0891b2 100%)' }} />
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800' }}>ACTIVE POOL PLEDGES</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#252d2f', margin: '8px 0' }}>
                                        {summary.active_pools_count} Pools
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Waiting for target volume</div>
                                </div>

                                <div style={{ backgroundColor: '#ffffff', padding: '22px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -2px rgba(5, 88, 238, 0.05)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0f172a 0%, #334155 100%)' }} />
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800' }}>CONSIGNMENTS IN-TRANSIT</div>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', margin: '8px 0' }}>
                                        {summary.transit_count} Shipments
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#0558EE', fontWeight: '600' }}>Live dispatch manifest</div>
                                </div>
                            </div>

                            {/* Urgent Attention Rail */}
                            {summary.urgent_pools && summary.urgent_pools.length > 0 && (
                                <div style={{
                                    backgroundColor: '#edf4ff',
                                    border: '1px solid #c7d9fc',
                                    borderRadius: '12px',
                                    padding: '18px 24px',
                                    marginBottom: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0558EE', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                                            ⚡
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                                                {summary.urgent_pools[0].title} is close to reaching quorum!
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                                                Only {summary.urgent_pools[0].units_remaining} units remaining to lock production MOQ.
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentTab('browse-pools')}
                                        style={{ padding: '8px 18px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        Pledge Remaining
                                    </button>
                                </div>
                            )}

                            {/* Live Progress Snapshot & Recent Activity */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
                                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 20px 0', color: '#0f172a' }}>
                                        Pledged Items Live Momentum
                                    </h3>
                                    {myOrders.length === 0 ? (
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No pool pledges recorded yet. Browse open pools to join wholesale orders.</p>
                                    ) : (
                                        myOrders.slice(0, 3).map((o) => {
                                            const pool = marketplacePools.find((p) => p.id === o.pool_id);
                                            const current = pool?.current_volume || o.quantity;
                                            const target = pool?.target_volume || o.quantity;
                                            const pct = Math.min(100, Math.round((current / target) * 100));

                                            return (
                                                <div key={o.id} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{o.product_name}</span>
                                                        <span style={{ fontWeight: '800', color: '#0558EE' }}>${o.total_price} Total</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #0558EE 0%, #21E8E6 100%)', borderRadius: '4px' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
                                                        <span>{current} / {target} units committed ({pct}%)</span>
                                                        <span style={{ color: '#059669', fontWeight: '700' }}>Status: {o.status}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 20px 0', color: '#0f172a' }}>
                                        System Activity & Intakes
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {myOrders.slice(0, 3).map((o, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0558EE', marginTop: '6px' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>{o.product_name}</div>
                                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Pledged {o.quantity} units • Status: {o.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. MY POOLS */}
                    {currentTab === 'my-pools' && (
                        <div>
                            {/* SECTION A: MY REQUESTED POOLS */}
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>My Requested Sourcing Pools</h3>
                                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                                            Custom wholesale demand requests you broadcasted to registered suppliers.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowRequestModal(true)}
                                        style={{ padding: '11px 22px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}
                                    >
                                        + Request Pool from Suppliers
                                    </button>
                                </div>

                                {myRequests.filter(req => req.is_active).length === 0 ? (
                                    <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.88rem' }}>
                                        You don't have any active custom pool requests. Click the button above to broadcast a sourcing demand.
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}>
                                                <th style={{ padding: '12px' }}>Requested Product</th>
                                                <th style={{ padding: '12px' }}>Target Volume</th>
                                                <th style={{ padding: '12px' }}>Target Price</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myRequests.filter(req => req.is_active).map((req) => (
                                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#0f172a' }}>{req.product_name}</td>
                                                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{req.target_quantity || 100} units</td>
                                                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#0558EE' }}>${parseFloat(req.target_price || 15).toFixed(2)}</td>
                                                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                                                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#edf4ff', color: '#0558EE' }}>
                                                            Broadcasting...
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* SECTION B: MY CONTRIBUTED & JOINED POOLS */}
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>My Pledged & Joined Pools</h3>
                                <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.88rem' }}>
                                    Active group purchasing pools where you have committed units toward quorum.
                                </p>

                                {myOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                        <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📦</div>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>No Joined Pools Yet</div>
                                        <div style={{ fontSize: '0.85rem', margin: '4px 0 16px 0' }}>Explore open pools to pledge volume and unlock wholesale discounts.</div>
                                        <button
                                            onClick={() => setCurrentTab('browse-pools')}
                                            style={{ padding: '8px 18px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}
                                        >
                                            Browse Open Pools
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                        {myOrders.map((ord) => {
                                            const pool = marketplacePools.find((p) => p.id === ord.pool_id);
                                            // Fallback to order quantity if the pool hit MOQ instantly and vanished from active marketplace
                                            const current = pool?.current_volume || ord.quantity;
                                            const target = pool?.target_volume || ord.quantity;
                                            const pct = Math.min(100, Math.round((current / target) * 100));

                                            return (
                                                <div key={ord.id} style={{
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    padding: '20px',
                                                    backgroundColor: '#fcfdfe',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0558EE', backgroundColor: '#edf4ff', padding: '3px 8px', borderRadius: '4px' }}>
                                                                PLEDGE #{ord.id}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: ord.status === 'Processing' ? '#059669' : '#0558EE' }}>
                                                                {ord.status}
                                                            </span>
                                                        </div>
                                                        <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>{ord.product_name}</h4>
                                                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
                                                            My Commitment: <strong>{ord.quantity} units</strong> (${ord.total_price})
                                                        </div>

                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                                                                <span style={{ color: '#64748b' }}>Quorum Progress</span>
                                                                <span style={{ fontWeight: '800', color: '#0558EE' }}>{current} / {target} units ({pct}%)</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#059669' : 'linear-gradient(90deg, #0558EE 0%, #21E8E6 100%)' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                                                        <span>Status:</span>
                                                        <strong style={{ color: '#0f172a' }}>{pct >= 100 ? 'Quorum Reached' : 'Collecting Quorum'}</strong>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. BROWSE POOLS */}
                    {currentTab === 'browse-pools' && (
                        <div>
                            <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Search live pools by product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', width: '380px', outline: 'none' }}
                                />
                                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                                    Showing <strong>{filteredPools.length}</strong> active pools
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
                                {filteredPools.map((pool) => {
                                    const pct = Math.min(100, Math.round((pool.current_volume / pool.target_volume) * 100));
                                    return (
                                        <div key={pool.id} style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0558EE', backgroundColor: '#edf4ff', padding: '4px 8px', borderRadius: '6px' }}>{pool.sku}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: '700' }}>MOQ Target: {pool.target_volume}</span>
                                                </div>
                                                <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{pool.title}</h4>
                                                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                        <span style={{ color: '#64748b' }}>Wholesale Rate:</span>
                                                        <span style={{ fontWeight: '800', color: '#059669' }}>${pool.unit_price.toFixed(2)} / unit</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setJoinModal({ open: true, pool, quantity: '10' })}
                                                style={{ width: '100%', padding: '10px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                            >
                                                Pledge to this Pool
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. MY ORDERS */}
                    {currentTab === 'my-orders' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Pledged Inventory & Orders</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                        <th style={{ padding: '14px 12px' }}>Pledge ID</th>
                                        <th style={{ padding: '14px 12px' }}>Product</th>
                                        <th style={{ padding: '14px 12px' }}>Committed Units</th>
                                        <th style={{ padding: '14px 12px' }}>Total Due</th>
                                        <th style={{ padding: '14px 12px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>No pledges currently recorded.</td>
                                        </tr>
                                    ) : (
                                        myOrders.map((ord) => (
                                            <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 12px', fontWeight: '800', color: '#0558EE' }}>PLG-00{ord.id}</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '700', color: '#0f172a' }}>{ord.product_name}</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{ord.quantity} units</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '800', color: '#0f172a' }}>${ord.total_price}</td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#ecfdf5', color: '#059669' }}>
                                                        {ord.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 5. SUPPLIERS */}
                    {currentTab === 'suppliers' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
                            {verifiedSuppliers.map((s) => (
                                <div key={s.id} style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
                                    <h4 style={{ margin: '8px 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{s.name}</h4>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Contact: {s.email}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 6. LOCAL NETWORK */}
                    {currentTab === 'local-network' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Nearby Co-op Retail Partners</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {networkPeers.map((b) => (
                                    <div key={b.id} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fcfdfe' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Location: {b.address}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 7. INVOICES */}
                    {currentTab === 'invoices' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Wholesale Invoices</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                        <th style={{ padding: '14px 12px' }}>Invoice ID</th>
                                        <th style={{ padding: '14px 12px' }}>Pool Product</th>
                                        <th style={{ padding: '14px 12px' }}>Supplier</th>
                                        <th style={{ padding: '14px 12px' }}>Total Amount</th>
                                        <th style={{ padding: '14px 12px', textAlign: 'right' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>No invoices issued yet.</td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv) => (
                                            <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <button
                                                        onClick={() => setSelectedInvoice(inv)}
                                                        style={{ background: 'none', border: 'none', color: '#0558EE', fontWeight: '800', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                                    >
                                                        {inv.id}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{inv.pool_title}</td>
                                                <td style={{ padding: '16px 12px' }}>{inv.supplier}</td>
                                                <td style={{ padding: '16px 12px', fontWeight: '800', color: '#0558EE' }}>${inv.amount.toFixed(2)}</td>
                                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: inv.is_paid ? '#ecfdf5' : '#fef9c3', color: inv.is_paid ? '#059669' : '#ca8a04' }}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 8. SETTINGS (MYOB-style) */}
                    {currentTab === 'settings' && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '36px 44px', maxWidth: '860px', boxSizing: 'border-box' }}>
                            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 18px', fontSize: '0.85rem', color: '#1e40af', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>ℹ️</span>
                                <span>Changes made here will be reflected across your store profile, order invoices, and group purchasing activities.</span>
                            </div>

                            {settingsSaved && (
                                <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '12px 18px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem', fontWeight: '700' }}>
                                    ✓ Settings saved successfully to the system database!
                                </div>
                            )}

                            <form onSubmit={handleSaveSettings}>
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
                                        value={settingsForm.trading_name}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, trading_name: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ABN</label>
                                    <input
                                        type="text"
                                        value={settingsForm.abn}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, abn: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ACN</label>
                                    <input
                                        type="text"
                                        value={settingsForm.acn}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, acn: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />
                                </div>

                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Industry details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Business industry</label>
                                    <input
                                        type="text"
                                        value={settingsForm.industry}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, industry: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                    />

                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Specific industry code</label>
                                    <select
                                        value={settingsForm.specific_industry_code}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, specific_industry_code: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                                    >
                                        <option value="Retail Trade - General Store Operations">Retail Trade - General Store Operations</option>
                                        <option value="Hospitality and Food Services">Hospitality and Food Services</option>
                                        <option value="Commercial Cleaning & Supplies">Commercial Cleaning & Supplies</option>
                                    </select>
                                </div>

                                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>Contact details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '14px', columnGap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                                    <label style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Address</label>
                                    <textarea
                                        rows="3"
                                        value={settingsForm.address || ''}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                                        style={{ width: '380px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
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
                                        value={settingsForm.phone}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
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

            {/* INVOICE VIEW & PDF DOWNLOAD MODAL */}
            {selectedInvoice && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '14px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Tax Invoice {selectedInvoice.id}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Issued to: {displayBusinessName}</div>
                            </div>
                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: selectedInvoice.is_paid ? '#ecfdf5' : '#fef9c3', color: selectedInvoice.is_paid ? '#059669' : '#ca8a04' }}>
                                {selectedInvoice.status}
                            </span>
                        </div>

                        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>Item / Pool Line:</span>
                                <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedInvoice.pool_title}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>Supplier / Vendor:</span>
                                <span style={{ fontWeight: '600' }}>{selectedInvoice.supplier}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '10px', fontWeight: '800', fontSize: '1.1rem', color: '#0558EE' }}>
                                <span>Total Amount Due:</span>
                                <span>${selectedInvoice.amount.toFixed(2)} AUD</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                style={{ padding: '10px 18px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#000000' }}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const printWindow = window.open('', '_blank');
                                    printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>Tax Invoice ${selectedInvoice.id}</title>
                                                <style>
                                                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; font-size: 14px; line-height: 1.5; }
                                                    .header-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
                                                    .company-details { font-size: 0.88rem; color: #334155; }
                                                    .company-details h1 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; }
                                                    .logo-container img { width: 56px; height: 56px; object-fit: contain; border-radius: 10px; }
                                                    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
                                                    .meta-item label { font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px; }
                                                    .meta-item val { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
                                                    .bill-section { margin-bottom: 30px; }
                                                    .bill-section h4 { font-size: 0.8rem; text-transform: uppercase; color: #64748b; margin: 0 0 6px 0; font-weight: 700; }
                                                    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                                                    th { background: #f1f5f9; color: #475569; font-size: 0.82rem; text-transform: uppercase; padding: 10px 12px; text-align: left; border-bottom: 2px solid #cbd5e1; }
                                                    td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
                                                    .totals-wrapper { width: 300px; margin-left: auto; margin-bottom: 40px; }
                                                    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; color: #475569; }
                                                    .balance-row { display: flex; justify-content: space-between; padding: 12px; background: #f1f5f9; font-weight: 800; font-size: 1.05rem; color: #0f172a; border-radius: 6px; margin-top: 8px; border: 1px solid #cbd5e1; }
                                                    .payment-box { display: flex; gap: 20px; margin-top: 16px; }
                                                    .bpay-card { border: 1px solid #cbd5e1; padding: 14px; border-radius: 8px; width: 220px; font-size: 0.78rem; background: #ffffff; }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="header-flex">
                                                    <div class="company-details">
                                                        <h1>BulkPool Clearing Hub</h1>
                                                        <div>Melbourne Commercial Depot</div>
                                                        <div>Victoria 3000, Australia</div>
                                                        <div>Phone: (03) 7008 5025</div>
                                                        <div>accounts@bulkpool.com.au</div>
                                                        <div>ABN: 25 639 398 164</div>
                                                    </div>
                                                    <div class="logo-container">
                                                        <img src="${window.location.origin}/logo.png" alt="BulkPool Logo" />
                                                    </div>
                                                </div>

                                                <div class="meta-grid">
                                                    <div class="meta-item">
                                                        <label>Tax Invoice</label>
                                                        <val>${selectedInvoice.id}</val>
                                                    </div>
                                                    <div class="meta-item">
                                                        <label>Issue Date</label>
                                                        <val>${new Date().toLocaleDateString('en-AU')}</val>
                                                    </div>
                                                    <div class="meta-item">
                                                        <label>Due Date</label>
                                                        <val>30 Days Net</val>
                                                    </div>
                                                </div>

                                                <div class="bill-section">
                                                    <h4>Bill To:</h4>
                                                    <div style="font-weight: 700; color: #0f172a;">${displayBusinessName}</div>
                                                    <div style="color: #475569; white-space: pre-line; margin-top: 2px;">${settingsForm.address || 'Registered Retail Member\nVictoria, Australia'}</div>
                                                </div>

                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Description</th>
                                                            <th>Tax Code</th>
                                                            <th style="text-align: right;">Amount (AUD)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <strong>${selectedInvoice.pool_title}</strong><br/>
                                                                <span style="font-size: 0.8rem; color: #64748b;">Fulfilled by ${selectedInvoice.supplier}</span>
                                                            </td>
                                                            <td>GST</td>
                                                            <td style="text-align: right; font-weight: 600;">$${selectedInvoice.amount.toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div class="totals-wrapper">
                                                    <div class="total-row"><span>Tax (GST included):</span> <span>$${(selectedInvoice.amount * 0.0909).toFixed(2)}</span></div>
                                                    <div class="total-row"><span>Total Amount (inc. tax):</span> <span>$${selectedInvoice.amount.toFixed(2)}</span></div>
                                                    <div class="total-row"><span>Total Paid:</span> <span>$${selectedInvoice.is_paid ? selectedInvoice.amount.toFixed(2) : '0.00'}</span></div>
                                                    <div class="balance-row">
                                                        <span>Balance due</span>
                                                        <span>$${selectedInvoice.is_paid ? '0.00' : selectedInvoice.amount.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <div style="margin-top: 40px;">
                                                    <h4 style="font-size: 0.85rem; text-transform: uppercase; color: #334155; margin-bottom: 10px;">How to Pay (EFT / Direct Bank Transfer)</h4>
                                                    <div class="payment-box">
                                                        <div class="bpay-card">
                                                            <strong style="color: #0f172a; display: block; margin-bottom: 6px;">DIRECT DEPOSIT (EFT)</strong>
                                                            <div><strong>Bank:</strong> National Australia Bank</div>
                                                            <div><strong>BSB:</strong> 083-004</div>
                                                            <div><strong>Acc:</strong> 8892 10459</div>
                                                            <div style="margin-top: 6px; color: #0558EE; font-weight: 700;">Ref: ${selectedInvoice.id}</div>
                                                        </div>
                                                        <div class="bpay-card">
                                                            <strong style="color: #0f172a; display: block; margin-bottom: 6px;">BULKPOOL CLEARING</strong>
                                                            <div>All group-buying cooperative orders are verified and reconciled via our secure clearing house.</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <script>window.print();</script>
                                            </body>
                                        </html>
                                    `);
                                    printWindow.document.close();
                                }}
                                style={{ padding: '10px 22px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Download PDF / Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* JOIN POOL MODAL */}
            {joinModal.open && joinModal.pool && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '14px', width: '100%', maxWidth: '440px' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Pledge Volume to Pool</h3>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0558EE', marginBottom: '16px' }}>{joinModal.pool.title}</div>
                        
                        <form onSubmit={handleJoinPool}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Units to Commit</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={joinModal.quantity}
                                    onChange={(e) => setJoinModal({ ...joinModal, quantity: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setJoinModal({ open: false, pool: null, quantity: '' })} style={{ padding: '10px 18px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#000000' }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 22px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Confirm Pledge</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REQUEST POOL FROM SUPPLIERS MODAL */}
            {showRequestModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '14px', width: '100%', maxWidth: '460px' }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Request Pool from Suppliers</h3>
                        <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.88rem' }}>
                            Broadcast a wholesale sourcing demand. Verified suppliers can review this request and convert it into a group purchasing pool.
                        </p>
                        
                        <form onSubmit={handleRequestPool}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Requested Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 5L Sanitiser Drums or 16oz Compostable Cups"
                                    value={requestForm.product_name}
                                    onChange={(e) => setRequestForm({ ...requestForm, product_name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Target Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="e.g. 150"
                                        value={requestForm.target_quantity}
                                        onChange={(e) => setRequestForm({ ...requestForm, target_quantity: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Target Unit Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="e.g. 12.50"
                                        value={requestForm.target_price}
                                        onChange={(e) => setRequestForm({ ...requestForm, target_price: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    style={{ padding: '10px 18px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#000000' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 22px', backgroundColor: '#0558EE', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Broadcast Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}