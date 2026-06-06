import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AdminScanner from './pages/AdminScanner.jsx';
import QuoteCart from './pages/QuoteCart.jsx';
import Verticals from './pages/Verticals.jsx';
import { Layers, Phone, MapPin, Mail } from 'lucide-react';

export default function App() {
  // Redirect dirty pathnames (e.g. /admin, /verticals) to clean hash routes (e.g. /#admin, /#verticals)
  const pathname = window.location.pathname.replace(/\/$/, '').toLowerCase();
  const knownPages = ['admin', 'verticals', 'catalog', 'product-detail', 'quote-cart'];
  const matchedPage = knownPages.find(page => pathname === '/' + page);
  if (matchedPage) {
    let targetHash = window.location.hash;
    if (!targetHash) {
      targetHash = `#${matchedPage}`;
      if (window.location.search) {
        targetHash += window.location.search;
      }
    }
    window.location.replace('/' + targetHash);
    return null;
  }

  // Helpers to parse hash synchronously before state initialization
  const getInitialRoute = () => {
    const hash = window.location.hash || '#home';
    const [path] = hash.split('?');
    return path.replace('#', '') || 'home';
  };

  const getInitialProductId = () => {
    const hash = window.location.hash;
    const [, queryString] = hash.split('?');
    if (queryString) {
      const match = queryString.match(/id=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  };

  const getInitialVerticalId = () => {
    const hash = window.location.hash;
    const [path, queryString] = hash.split('?');
    if (path.includes('verticals') && queryString) {
      const match = queryString.match(/id=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    return null;
  };

  const [activePage, setActivePage] = useState(getInitialRoute);
  const [selectedProductId, setSelectedProductId] = useState(getInitialProductId);
  const [quoteCart, setQuoteCart] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem('mavs_admin_authenticated') === 'true'
  );
  const [selectedVerticalId, setSelectedVerticalId] = useState(getInitialVerticalId);
  const [initialCategory, setInitialCategory] = useState(null);

  // Parse URL Hash router helper
  const parseHash = () => {
    const hash = window.location.hash || '#home';
    const [path, queryString] = hash.split('?');
    const page = path.replace('#', '') || 'home';
    
    const params = {};
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, val] = pair.split('=');
        if (key && val) {
          params[key] = decodeURIComponent(val);
        }
      });
    }
    return { page, params };
  };

  // Sync states with URL hash change
  useEffect(() => {
    const handleHashChange = () => {
      const { page, params } = parseHash();
      
      setActivePage(prev => (prev !== page ? page : prev));
      
      if (page === 'product-detail' && params.id) {
        setSelectedProductId(prev => (prev !== params.id ? params.id : prev));
      }
      
      if (page === 'verticals') {
        setSelectedVerticalId(prev => (prev !== (params.id || null) ? (params.id || null) : prev));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state changes back to URL hash
  useEffect(() => {
    let expectedHash = `#${activePage}`;
    if (activePage === 'product-detail' && selectedProductId) {
      expectedHash += `?id=${selectedProductId}`;
    } else if (activePage === 'verticals' && selectedVerticalId) {
      expectedHash += `?id=${selectedVerticalId}`;
    }
    
    if (window.location.hash !== expectedHash) {
      window.location.hash = expectedHash;
    }
  }, [activePage, selectedProductId, selectedVerticalId]);

  const handleAdminLogin = async (password) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        sessionStorage.setItem('mavs_admin_authenticated', 'true');
        sessionStorage.setItem('mavs_admin_password', password);
        setIsAdminAuthenticated(true);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Access denied.' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Network error occurred. Please verify backend is running.' };
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('mavs_admin_authenticated');
    sessionStorage.removeItem('mavs_admin_password');
    setIsAdminAuthenticated(false);
    setActivePage('home');
  };

  // Calculate total items in the cart
  const cartCount = quoteCart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Add product to quote cart
  const handleAddToQuote = (product) => {
    setQuoteCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        alert(`Incremented quantity for: ${product.name}`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      alert(`Added to quote: ${product.name}`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  // Page Routing Router
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'catalog':
        return (
          <Catalog
            activePage={activePage}
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            onAddToQuote={handleAddToQuote}
            initialCategory={initialCategory}
            setInitialCategory={setInitialCategory}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            setActivePage={setActivePage}
            onAddToQuote={handleAddToQuote}
          />
        );
      case 'admin':
        if (!isAdminAuthenticated) {
          return <AdminLogin onLogin={handleAdminLogin} />;
        }
        return (
          <AdminScanner
            setActivePage={setActivePage}
            setSelectedProductId={setSelectedProductId}
            selectedProductId={selectedProductId}
            onLogout={handleAdminLogout}
          />
        );
      case 'quote-cart':
        return (
          <QuoteCart
            cart={quoteCart}
            setCart={setQuoteCart}
            setActivePage={setActivePage}
          />
        );
      case 'verticals':
        return (
          <Verticals
            setActivePage={setActivePage}
            setQuoteCart={setQuoteCart}
            selectedVerticalId={selectedVerticalId}
            setSelectedVerticalId={setSelectedVerticalId}
          />
        );
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        quoteCartCount={cartCount}
        setSelectedProductId={setSelectedProductId}
        setSelectedVerticalId={setSelectedVerticalId}
        setInitialCategory={setInitialCategory}
      />

      {/* Main Viewport Content */}
      <main style={{ flex: 1 }}>
        {renderActivePage()}
      </main>

      {/* Corporate Premium Footer */}
      <footer style={{
        background: '#04070d',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '4rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div className="grid-cols-4" style={{ gap: '3rem', marginBottom: '3rem' }}>
            
            {/* Branding Column */}
            <div>
              <div className="flex align-center gap-3 mb-4">
                <div className="flex-center" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.15rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 0 10px rgba(225, 90, 69, 0.1)'
                }}>
                  <svg width="32" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="10" width="4.5" height="24" rx="2.25" fill="#e15a45" />
                    <rect x="12" y="2" width="4.5" height="40" rx="2.25" fill="#2ea043" />
                    <rect x="20" y="8" width="4.5" height="28" rx="2.25" fill="#4eb995" />
                    <rect x="28" y="14" width="4.5" height="18" rx="2.25" fill="#0077c2" />
                    <rect x="36" y="20" width="4.5" height="10" rx="2.25" fill="#00bcd4" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#ffffff'
                }}>
                  MAVS
                </span>
              </div>
              <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                Architecting advanced visual and acoustic collaboration systems. Custom hardware integrations for conference rooms, auditoriums, and smart buildings.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-sm uppercase mb-4" style={{ letterSpacing: '0.1em', color: 'var(--color-primary)' }}>Site Directory</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('home'); }} className="text-muted" style={{ transition: 'color 0.2s' }}>Home Page</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('catalog'); }} className="text-muted" style={{ transition: 'color 0.2s' }}>Product Catalog</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('verticals'); }} className="text-muted" style={{ transition: 'color 0.2s' }}>Industry Verticals</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedProductId(null); setActivePage('admin'); }} className="text-muted" style={{ transition: 'color 0.2s' }}>AI Product Scanner</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('quote-cart'); }} className="text-muted" style={{ transition: 'color 0.2s' }}>Request a Quote</a></li>
              </ul>
            </div>

            {/* Contact Details Column */}
            <div>
              <h3 className="text-sm uppercase mb-4" style={{ letterSpacing: '0.1em', color: 'var(--color-primary)' }}>Contact Center</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li className="flex align-center gap-2">
                  <Phone size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>+91 98902 02233</span>
                </li>
                <li className="flex align-center gap-2">
                  <Mail size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Sales1@mahaviravsolutions.in</span>
                    <span>Sushil@mahaviravsolutions.in</span>
                  </div>
                </li>
                <li className="flex gap-2">
                  <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.3 }}>Plot-10, 2nd Floor, Parshwanath Nagar, Bibwewadi, Pune - 411037</span>
                </li>
              </ul>
            </div>

            {/* Business Hours Column */}
            <div>
              <h3 className="text-sm uppercase mb-4" style={{ letterSpacing: '0.1em', color: 'var(--color-primary)' }}>Working Hours</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>Monday - Friday: 9:30 AM - 6:30 PM</li>
                <li>Saturday: 10:00 AM - 4:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>

          </div>

          {/* Copyright bar */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-dark)'
          }} className="flex-wrap gap-2">
            <span>© 2026 Mahavir AV Solutions. All rights reserved. Registered trademark.</span>
            <div className="flex gap-4">
              <a href="#" className="text-dark">Privacy Policy</a>
              <a href="#" className="text-dark">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await onLogin(password);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '80vh', padding: '2rem 1.5rem' }}>
      <div className="glass-panel animate-slide-up" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(22, 19, 25, 0.9) 0%, rgba(14, 12, 16, 0.9) 100%)',
        borderColor: 'rgba(225, 90, 69, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--gradient-brand)'
        }} />

        <div className="text-center mb-8">
          <div className="flex-center mb-4" style={{
            width: '64px',
            height: '64px',
            background: 'rgba(225, 90, 69, 0.08)',
            border: '1px solid rgba(225, 90, 69, 0.25)',
            borderRadius: '16px',
            margin: '0 auto',
            boxShadow: '0 0 20px rgba(225, 90, 69, 0.15)'
          }}>
            <svg width="40" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="10" width="4.5" height="24" rx="2.25" fill="#e15a45" />
              <rect x="12" y="2" width="4.5" height="40" rx="2.25" fill="#2ea043" />
              <rect x="20" y="8" width="4.5" height="28" rx="2.25" fill="#4eb995" />
              <rect x="28" y="14" width="4.5" height="18" rx="2.25" fill="#0077c2" />
              <rect x="36" y="20" width="4.5" height="10" rx="2.25" fill="#00bcd4" />
            </svg>
          </div>
          <h2 className="text-2xl mt-2 mb-1" style={{ fontWeight: 800 }}>Admin Portal Gate</h2>
          <p className="text-muted text-sm">Authentication is required to access the catalog database modifier scanner.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Administrator Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="input-control"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingRight: '2.5rem' }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="animate-fade" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#f87171',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Verifying Gate...' : 'Verify Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
