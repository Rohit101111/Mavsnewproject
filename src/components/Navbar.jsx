import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  quoteCartCount, 
  setSelectedProductId, 
  setSelectedVerticalId, 
  setInitialCategory 
}) {
  const categories = [
    'Audio',
    'Video',
    'Collaboration',
    'Control',
    'Signal',
    'Display',
    'Wireless Presentation',
    'Camera',
    'Cables & Connectors',
    'Headphone'
  ];

  const verticals = [
    { id: 'corporate', title: 'Corporate Enterprises' },
    { id: 'education', title: 'Education & Training' },
    { id: 'government', title: 'Government & Control Centers' },
    { id: 'healthcare', title: 'Healthcare Facilities' },
    { id: 'hospitality', title: 'Hospitality & Venues' },
    { id: 'experience_center', title: 'Experience Centers' }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 10, 19, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.25rem 0'
    }}>
      <div className="container flex justify-between align-center">
        {/* Animated Tech Logo */}
        {/* Custom MAVS Company Logo SVG & Text */}
        <a href="#" className="flex align-center gap-3" onClick={(e) => { e.preventDefault(); setActivePage('home'); }} style={{ cursor: 'pointer' }}>
          <div className="flex-center" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 0 15px rgba(225, 90, 69, 0.1)'
          }}>
            <svg width="40" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bar 1 (Coral Red) */}
              <rect x="4" y="10" width="4.5" height="24" rx="2.25" fill="#e15a45" />
              {/* Bar 2 (Vibrant Green) */}
              <rect x="12" y="2" width="4.5" height="40" rx="2.25" fill="#2ea043" />
              {/* Bar 3 (Mint Teal) */}
              <rect x="20" y="8" width="4.5" height="28" rx="2.25" fill="#4eb995" />
              {/* Bar 4 (Blue) */}
              <rect x="28" y="14" width="4.5" height="18" rx="2.25" fill="#0077c2" />
              {/* Bar 5 (Teal/Cyan) */}
              <rect x="36" y="20" width="4.5" height="10" rx="2.25" fill="#00bcd4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span style={{
              fontFamily: 'var(--font-header)',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              lineHeight: 1,
              color: '#ffffff'
            }}>
              MAVS
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
              lineHeight: 1,
              marginTop: '4px'
            }}>
              A.V. Solution and System Integrator
            </span>
          </div>
        </a>

        {/* Links */}
        <div className="flex align-center gap-4">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '0.95rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              color: activePage === 'home' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activePage === 'home' ? '2px solid var(--color-primary)' : '2px solid transparent'
            }}
          >
            Home
          </a>

          {/* Products Dropdown */}
          <div className="nav-item-dropdown">
            <a
              href="#catalog"
              onClick={(e) => { 
                e.preventDefault(); 
                if (setInitialCategory) setInitialCategory(null);
                setActivePage('catalog'); 
              }}
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: '0.95rem',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                display: 'block',
                color: activePage === 'catalog' || activePage === 'product-detail' ? '#ffffff' : 'var(--text-muted)',
                borderBottom: activePage === 'catalog' || activePage === 'product-detail' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              Products
            </a>
            <div className="dropdown-menu">
              {categories.map(cat => (
                <a
                  key={cat}
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (setInitialCategory) setInitialCategory(cat);
                    setActivePage('catalog');
                  }}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Verticals Dropdown */}
          <div className="nav-item-dropdown">
            <a
              href="#verticals"
              onClick={(e) => { 
                e.preventDefault(); 
                if (setSelectedVerticalId) setSelectedVerticalId(null);
                setActivePage('verticals'); 
              }}
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: '0.95rem',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                display: 'block',
                color: activePage === 'verticals' ? '#ffffff' : 'var(--text-muted)',
                borderBottom: activePage === 'verticals' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              Verticals
            </a>
            <div className="dropdown-menu">
              {verticals.map(v => (
                <a
                  key={v.id}
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (setSelectedVerticalId) setSelectedVerticalId(v.id);
                    setActivePage('verticals');
                  }}
                >
                  {v.title}
                </a>
              ))}
            </div>
          </div>

          <a
            href="#admin"
            onClick={(e) => { 
              e.preventDefault(); 
              if (setSelectedProductId) setSelectedProductId(null);
              setActivePage('admin'); 
            }}
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '0.95rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              color: activePage === 'admin' ? '#ffffff' : 'var(--text-muted)',
              borderBottom: activePage === 'admin' ? '2px solid var(--color-primary)' : '2px solid transparent'
            }}
          >
            AI Scanner
          </a>

          {/* Cart Icon Link */}
          <button
            className="btn btn-secondary flex-center btn-sm"
            onClick={() => setActivePage('quote-cart')}
            style={{
              position: 'relative',
              borderRadius: '8px',
              padding: '0.55rem 0.95rem',
              background: activePage === 'quote-cart' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
              borderColor: activePage === 'quote-cart' ? 'var(--color-primary)' : 'var(--border-color)'
            }}
          >
            <ShoppingCart size={18} style={{ color: activePage === 'quote-cart' ? 'var(--color-primary)' : '#fff' }} />
            <span style={{ marginLeft: '4px', fontFamily: 'var(--font-header)', fontWeight: 600 }}>Quote</span>
            {quoteCartCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--gradient-brand)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
              }}>
                {quoteCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
